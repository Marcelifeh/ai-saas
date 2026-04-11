import "server-only";
import { bulkDiscover, generateChunk } from "./factoryService";
import { getWinningSlogans } from "@/lib/engines/learnedScoring";

export async function runAutopilotSync(userId: string | undefined, workspaceId: string) {
    console.log(`[Autopilot Sync] Starting job for workspace: ${workspaceId}`);

    // 1. Discover trends
    console.log(`[Autopilot Sync] Step 1: Discovering & Validating Trends...`);
    const discovery = await bulkDiscover();

    // 2. Process synchronously (Phase 2 MVP)
    // Only pass MEDIUM/HIGH executionConfidence niches to generateChunk; cap at 5 to control cost
    let topNiches = discovery.niches
        .filter((n: any) => n.executionConfidence !== "LOW")
        .slice(0, 5);

    // Safety net: if every niche was LOW confidence, use the top-scored niches anyway
    if (topNiches.length === 0 && discovery.niches.length > 0) {
        console.log(`[Autopilot Sync] All niches LOW confidence — falling back to top 3 by score.`);
        topNiches = [...discovery.niches]
            .sort((a: any, b: any) => (b.finalScore ?? b.opportunityScore ?? 0) - (a.finalScore ?? a.opportunityScore ?? 0))
            .slice(0, 3);
    }

    console.log(`[Autopilot Sync] Step 2: Generating Listing Assets for ${topNiches.length} niches...`);
    const results = await generateChunk(topNiches, true, userId);

    // 3. Filter each product's slogans to top-performing (learned) winners only
    const enriched = await Promise.all(
        results.map(async (product) => {
            try {
                const rawSlogans: string[] = Array.isArray((product as Record<string, unknown>).shirtSlogans)
                    ? ((product as Record<string, unknown>).shirtSlogans as string[])
                    : [];
                if (rawSlogans.length === 0) return product;

                const niche =
                    typeof (product as Record<string, unknown>).niche === "string"
                        ? ((product as Record<string, unknown>).niche as string)
                        : "";
                const winners = await getWinningSlogans(rawSlogans, niche);
                return {
                    ...product,
                    shirtSlogans: winners.map((w) => w.text),
                    sloganInsights: winners.map((w) => ({
                        slogan: w.text,
                        score: w.score,
                        learnedBoost: w.learnedBoost,
                        pattern: w.pattern,
                        hasEvidenced: w.hasEvidenced,
                    })),
                    bestSellerScore: winners[0]?.score ?? 0,
                };
            } catch {
                // Never drop a product — fall back to unfiltered slogans
                return product;
            }
        }),
    );

    return {
        success: true,
        message: "Autopilot completed synchronously",
        productsGenerated: enriched.length,
        signalSources: discovery.signalSources,
        signalConfidence: discovery.signalConfidence,
        data: enriched,
    };
}

export async function enqueueAutopilot(userId: string | undefined, workspaceId: string) {
    console.log(`[Autopilot Async] Queue mode requested for workspace: ${workspaceId} — running synchronously (BullMQ Phase 3 pending)`);

    // Phase 3: wire BullMQ here when workers/autopilot-worker is deployed.
    // For now, fall through to the sync path so the caller always gets real results.
    return runAutopilotSync(userId, workspaceId);
}

export async function runAutopilot(userId: string | undefined, workspaceId: string) {
    if (process.env.USE_QUEUE === "true") {
        return enqueueAutopilot(userId, workspaceId);
    }

    return runAutopilotSync(userId, workspaceId);
}
