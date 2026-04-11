import { NextResponse } from "next/server";
import { runDiscovery } from "../../../lib/services/trendDiscoveryService";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { ensureUsageAllowed } from "@/lib/services/usageService";

export const POST = withWorkspaceAuth(async ({ session }) => {
    try {
        const userId = session.user?.id as string | undefined;
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const guard = await ensureUsageAllowed(userId, "discovery.enrichNiches");
        if (!guard.allowed) {
            return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
        }

        // 1. Invoke the abstracted Service Layer
        const result = await runDiscovery(userId);

        // 2. Return Response
        return NextResponse.json({
            success: true,
            opportunities: result.opportunities,
            signals: result.signals,
            signalSources: result.signalSources,
            signalConfidence: result.signalConfidence,
            lastUpdated: result.lastUpdated,
            usage: { allowed: true } // Stubbed until UsageGuard is fully ported
        });

    } catch (err: unknown) {
        console.error("Discovery API Error:", err);
        const message = err instanceof Error ? err.message : "Discovery failed";
        return NextResponse.json(
            { success: false, error: "Discovery failed", details: message },
            { status: 500 }
        );
    }
});
