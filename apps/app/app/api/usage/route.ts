import { NextResponse } from "next/server";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { getAIUsageSummaryForUser, getUserPlanAndLimits } from "@/lib/services/usageService";

export const GET = withWorkspaceAuth(async ({ session }) => {
    try {
        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const [summary, planInfo] = await Promise.all([
            getAIUsageSummaryForUser(userId),
            getUserPlanAndLimits(userId),
        ]);

        return NextResponse.json({
            success: true,
            usage: summary,
            plan: planInfo.plan,
            limits: planInfo.limits,
            usageStatus: summary.status,
        });
    } catch (err: unknown) {
        console.error("Usage API Error:", err);
        const message = err instanceof Error ? err.message : "Usage summary failed";
        return NextResponse.json(
            { success: false, error: "Usage summary failed", details: message },
            { status: 500 },
        );
    }
});
