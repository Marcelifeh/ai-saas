import { NextResponse } from "next/server";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { getAIUsageSummaryForUser, getUserPlanAndLimits } from "@/lib/services/usageService";

export const GET = withWorkspaceAuth(async ({ session }) => {
    try {
        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const [usage, planInfo] = await Promise.all([
            getAIUsageSummaryForUser(userId),
            getUserPlanAndLimits(userId),
        ]);

        const remaining = Math.max(
            0,
            (planInfo.limits.totalTokens24h ?? 0) - (usage.totalTokens24h ?? 0),
        );

        const insights = [
            {
                message: `You have used ${usage.totalTokens24h.toLocaleString()} AI tokens in the last 24 hours on your ${planInfo.plan} plan.`,
                severity: "info",
                icon: "📊",
            },
            {
                message: remaining > 0
                    ? `Approximately ${remaining.toLocaleString()} tokens remain in today's allowance before throttling kicks in.`
                    : "You've reached today's AI allowance. Consider upgrading your plan if you need more throughput.",
                severity: remaining > 0 ? "success" : "warning",
                icon: remaining > 0 ? "✅" : "⚠️",
            },
        ];

        if (usage.status === "degraded") {
            insights.push({
                message: usage.degradedReason
                    ? `Usage telemetry is temporarily degraded: ${usage.degradedReason}`
                    : "Usage telemetry is temporarily degraded. Totals may be delayed while the system retries.",
                severity: "warning",
                icon: "🛠️",
            });
        }

        return NextResponse.json({ success: true, insights });
    } catch (err: unknown) {
        console.error("Analytics Insights Error:", err);
        const message = err instanceof Error ? err.message : "Failed to load analytics insights";
        return NextResponse.json(
            { success: false, error: "Failed to load analytics insights", details: message },
            { status: 500 },
        );
    }
});
