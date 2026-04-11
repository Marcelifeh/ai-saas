import { NextResponse } from "next/server";
import { z } from "zod";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { recordMerchOutcomeFeedback } from "@/lib/services/salesFeedbackService";

const SalesFeedbackSchema = z.object({
    niche: z.string().min(1),
    platform: z.string().optional(),
    slogan: z.string().min(1),
    pattern: z.string().optional(),
    tags: z.array(z.string().min(1)).max(20).optional(),
    audience: z.string().optional(),
    style: z.string().optional(),
    productTitle: z.string().optional(),
    impressions: z.number().int().nonnegative().optional(),
    clicks: z.number().int().nonnegative().optional(),
    orders: z.number().int().nonnegative().optional(),
    favorites: z.number().int().nonnegative().optional(),
    revenue: z.number().nonnegative().optional(),
    refunds: z.number().int().nonnegative().optional(),
    observedAt: z.string().datetime().optional(),
}).refine((value) => {
    return Boolean(
        (value.impressions ?? 0)
        || (value.clicks ?? 0)
        || (value.orders ?? 0)
        || (value.favorites ?? 0)
        || (value.revenue ?? 0)
        || (value.refunds ?? 0)
    );
}, {
    message: "At least one outcome metric is required",
    path: ["impressions"],
});

export const POST = withWorkspaceAuth(async ({ req, session }) => {
    try {
        const body = await (req as Request).json();
        const parsed = SalesFeedbackSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ success: false, error: "Invalid sales feedback payload", details: parsed.error.flatten() }, { status: 400 });
        }

        const userId = session.user?.id as string | undefined;
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const record = await recordMerchOutcomeFeedback({
            userId,
            ...parsed.data,
        });

        return NextResponse.json({
            success: true,
            data: {
                id: record.id,
                slogan: record.slogan,
                niche: record.niche,
                platform: record.platform,
                observedAt: record.observedAt,
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to record sales feedback";
        const status = message.includes("tables are not available") ? 503 : 500;
        return NextResponse.json({ success: false, error: message }, { status });
    }
});
