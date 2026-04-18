import { NextResponse } from "next/server";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { prisma } from "@/lib/db/prisma";
import Stripe from "stripe";

function isMissingSubscriptionTableError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const maybe = err as { code?: string; message?: string };
    if (maybe.code === "P2021") return true;
    return typeof maybe.message === "string" && maybe.message.includes("public.Subscription");
}

export const POST = withWorkspaceAuth(async ({ req, session }) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
    const proYearlyPriceId = process.env.STRIPE_PRO_YEARLY_PRICE_ID;

    const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

    if (!stripe) {
        return NextResponse.json(
            {
                success: false,
                error: "Stripe is not configured on the server. Missing STRIPE_SECRET_KEY.",
            },
            { status: 500 }
        );
    }

    if (!proPriceId) {
        return NextResponse.json(
            {
                success: false,
                error: "Pro plan price ID is not configured. Missing STRIPE_PRO_PRICE_ID.",
            },
            { status: 500 }
        );
    }

    if (!proPriceId.startsWith("price_")) {
        return NextResponse.json(
            {
                success: false,
                error: "STRIPE_PRO_PRICE_ID must be a Stripe Price ID (starts with price_), not a Product ID.",
            },
            { status: 500 }
        );
    }

    try {
        const userId = session.user?.id as string | undefined;
        const email = session.user?.email as string | undefined;

        if (!userId || !email) {
            return NextResponse.json(
                { success: false, error: "Missing user identity for billing." },
                { status: 400 }
            );
        }

        let body: unknown = {};
        try {
            body = await (req as Request).json();
        } catch {
            body = {};
        }

        const { plan } = (body as { plan?: string }) || {};
        const planKey = (plan || "pro").toLowerCase();
        if (planKey !== "pro" && planKey !== "pro_yearly") {
            return NextResponse.json(
                { success: false, error: "Only the Pro plan is available via checkout." },
                { status: 400 }
            );
        }

        const activePriceId =
            planKey === "pro_yearly" && proYearlyPriceId
                ? proYearlyPriceId
                : proPriceId!;

        // Try to reuse an existing Stripe customer if we have one
        let existingSub = null;
        try {
            existingSub = await prisma.subscription.findFirst({
                where: { userId },
            });
        } catch (err: unknown) {
            if (!isMissingSubscriptionTableError(err)) {
                throw err;
            }
            existingSub = null;
        }

        let customerId = existingSub?.stripeCustomerId ?? undefined;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email,
                metadata: { userId },
            });
            customerId = customer.id;
        }

        const originEnv =
            process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

        if (!originEnv) {
            return NextResponse.json(
                { success: false, error: "NEXT_PUBLIC_APP_URL or VERCEL_URL must be set in production." },
                { status: 500 }
            );
        }

        const checkoutSession = await stripe.checkout.sessions.create(
            {
                mode: "subscription",
                customer: customerId,
                line_items: [
                    {
                        price: activePriceId,
                        quantity: 1,
                    },
                ],
                success_url: `${originEnv}/dashboard/settings?billing=success`,
                cancel_url: `${originEnv}/dashboard/settings?billing=cancelled`,
                client_reference_id: userId,
                metadata: {
                    userId,
                    plan: planKey,
                },
            },
            { idempotencyKey: `checkout-${userId}-${planKey}` }
        );

        // Record or update a pending subscription shell so we can attach metadata later
        if (!existingSub) {
            try {
                await prisma.subscription.create({
                    data: {
                        userId,
                        stripeCustomerId: customerId,
                        stripeSubId: null,
                        plan: planKey,
                        status: "pending",
                        currentPeriodEnd: null,
                    },
                });
            } catch (err: unknown) {
                if (!isMissingSubscriptionTableError(err)) {
                    throw err;
                }
            }
        } else if (!existingSub.stripeCustomerId) {
            try {
                await prisma.subscription.update({
                    where: { id: existingSub.id },
                    data: {
                        stripeCustomerId: customerId,
                    },
                });
            } catch (err: unknown) {
                if (!isMissingSubscriptionTableError(err)) {
                    throw err;
                }
            }
        }

        return NextResponse.json({ success: true, url: checkoutSession.url });
    } catch (err: unknown) {
        console.error("Billing checkout error:", err);
        const message = err instanceof Error ? err.message : "Checkout failed";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
});
