import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";

function isMissingSubscriptionTableError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const maybe = err as { code?: string; message?: string };
    if (maybe.code === "P2021") return true;
    return typeof maybe.message === "string" && maybe.message.includes("public.Subscription");
}

export async function POST(req: Request): Promise<Response> {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

    if (!stripe || !webhookSecret) {
        console.error("Stripe webhook is not fully configured.");
        return NextResponse.json({ received: true }, { status: 200 });
    }

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    const payload = await req.text();

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: unknown) {
        console.error("Stripe webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const userId =
                    (session.metadata?.userId) ||
                    (session.client_reference_id);
                const plan = (session.metadata?.plan) || "pro";

                if (!userId) break;

                const customerId =
                    (typeof session.customer === "string" ? session.customer : session.customer?.id) || null;
                const subscriptionId =
                    (typeof session.subscription === "string"
                        ? session.subscription
                        : session.subscription?.id) || null;

                await upsertSubscription(userId, plan, customerId, subscriptionId, undefined);
                break;
            }
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                const userId = (subscription.metadata?.userId) || undefined;
                const plan = (subscription.metadata?.plan) || "pro";

                if (!userId) break;

                const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
                const customerId = (typeof subscription.customer === 'string') ? subscription.customer : subscription.customer?.id || null;
                await upsertSubscription(userId, plan, customerId, subscription.id, currentPeriodEnd);
                break;
            }
            default:
                break;
        }
    } catch (err: unknown) {
        console.error("Stripe webhook handler error:", err);
        return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}

async function upsertSubscription(
    userId: string | undefined,
    plan: string,
    stripeCustomerId?: string | null,
    stripeSubId?: string | null,
    currentPeriodEnd?: Date | null
): Promise<void> {
    if (!userId) return;
    let existing = null;
    try {
        existing = await prisma.subscription.findFirst({ where: { userId } });
    } catch (err: unknown) {
        if (isMissingSubscriptionTableError(err)) {
            return;
        }
        throw err;
    }

    if (!existing) {
        try {
            await prisma.subscription.create({
                data: {
                    userId,
                    stripeCustomerId,
                    stripeSubId,
                    plan,
                    status: "active",
                    currentPeriodEnd: currentPeriodEnd ?? null,
                },
            });
        } catch (err: unknown) {
            if (!isMissingSubscriptionTableError(err)) {
                throw err;
            }
        }
        return;
    }

    try {
        await prisma.subscription.update({
            where: { id: existing.id },
            data: {
                stripeCustomerId: stripeCustomerId ?? existing.stripeCustomerId,
                stripeSubId: stripeSubId ?? existing.stripeSubId,
                plan,
                status: "active",
                currentPeriodEnd: currentPeriodEnd ?? existing.currentPeriodEnd,
            },
        });
    } catch (err: unknown) {
        if (!isMissingSubscriptionTableError(err)) {
            throw err;
        }
    }
}
