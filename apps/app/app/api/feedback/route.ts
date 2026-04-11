import { NextResponse } from "next/server";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { recordSloganPerformance } from "@/lib/engines/patternMemory";
import { recordMerchOutcomeFeedback } from "@/lib/services/salesFeedbackService";

/**
 * POST /api/feedback
 *
 * Records real-world performance signals for a slogan and closes the
 * Autonomous Selling System learning loop:
 *
 *   SloganPattern DB ← impressions / clicks / sales
 *   MerchOutcomeFeedback DB ← full engagement record with recency weighting
 *
 * Body shape:
 * {
 *   slogan:      string   (required)
 *   niche:       string   (required)
 *   impressions: number
 *   clicks:      number
 *   sales:       number   (orders)
 *   favorites:   number
 *   revenue:     number
 *   platform:    string   ("amazon" | "etsy" | "redbubble" etc.)
 *   observedAt:  string   ISO date of when these metrics were observed
 * }
 */
export const POST = withWorkspaceAuth(async ({ req, session }) => {
    let body: unknown = {};
    try {
        body = await (req as Request).json();
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid JSON body." },
            { status: 400 },
        );
    }

    const raw = body as Record<string, unknown>;

    const slogan = typeof raw.slogan === "string" ? raw.slogan.trim() : "";
    const niche = typeof raw.niche === "string" ? raw.niche.trim() : "";

    if (!slogan || !niche) {
        return NextResponse.json(
            { success: false, error: "slogan and niche are required." },
            { status: 400 },
        );
    }

    const impressions = sanitizeCount(raw.impressions);
    const clicks = sanitizeCount(raw.clicks);
    const sales = sanitizeCount(raw.sales);
    const favorites = sanitizeCount(raw.favorites);
    const revenue = sanitizeMoney(raw.revenue);
    const platform = typeof raw.platform === "string" ? raw.platform.trim() : "amazon";
    const observedAt = typeof raw.observedAt === "string" ? raw.observedAt : undefined;

    const userId = (session?.user as Record<string, unknown> | undefined)?.id;
    const userIdStr = typeof userId === "string" ? userId : "system";

    // Run both writes concurrently — failures are isolated
    const [patternResult, feedbackResult] = await Promise.allSettled([
        // 1. Update SloganPattern: learned scoring engine
        recordSloganPerformance({ slogan, niche, impressions, clicks, sales }),

        // 2. Update MerchOutcomeFeedback: full historical signal with recency weighting
        recordMerchOutcomeFeedback({
            userId: userIdStr,
            niche,
            platform,
            slogan,
            impressions,
            clicks,
            orders: sales,
            favorites,
            revenue,
            observedAt,
        }),
    ]);

    const patternOk = patternResult.status === "fulfilled";
    const feedbackOk = feedbackResult.status === "fulfilled";

    if (!patternOk) {
        console.error("[feedback] recordSloganPerformance failed:", patternResult.reason);
    }
    if (!feedbackOk) {
        console.error("[feedback] recordMerchOutcomeFeedback failed:", feedbackResult.reason);
    }

    return NextResponse.json({
        success: true,
        patternMemoryUpdated: patternOk,
        feedbackRecorded: feedbackOk,
        slogan,
        niche,
    });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeCount(value: unknown): number {
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    return Math.max(0, Math.round(value));
}

function sanitizeMoney(value: unknown): number {
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    return Math.max(0, Math.round(value * 100) / 100);
}
