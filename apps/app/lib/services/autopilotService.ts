import "server-only";
import { bulkDiscover, generateChunk } from "./factoryService";
import { getWinningSlogans } from "@/lib/engines/learnedScoring";
import { prisma } from "@/lib/db/prisma";

export type AutopilotRunResult = Awaited<ReturnType<typeof runAutopilotSync>>;

export interface AutopilotQueuedResult {
    success: true;
    status: "queued";
    message: string;
    jobId: string;
    workspaceId: string;
}

type AutopilotNicheCandidate = {
    executionConfidence?: string;
    finalScore?: number;
    opportunityScore?: number;
};

export async function runAutopilotSync(userId: string | undefined, workspaceId: string) {
    console.log(`[Autopilot Sync] Starting job for workspace: ${workspaceId}`);

    // 1. Discover trends
    console.log(`[Autopilot Sync] Step 1: Discovering & Validating Trends...`);
    const discovery = await bulkDiscover();

    // 2. Process synchronously (Phase 2 MVP)
    // Only pass MEDIUM/HIGH executionConfidence niches to generateChunk; cap at 5 to control cost
    let topNiches: AutopilotNicheCandidate[] = discovery.niches
        .filter((n: AutopilotNicheCandidate) => n.executionConfidence !== "LOW")
        .slice(0, 5);

    // Safety net: if every niche was LOW confidence, use the top-scored niches anyway
    if (topNiches.length === 0 && discovery.niches.length > 0) {
        console.log(`[Autopilot Sync] All niches LOW confidence — falling back to top 3 by score.`);
        topNiches = [...discovery.niches]
            .sort((a: AutopilotNicheCandidate, b: AutopilotNicheCandidate) => (b.finalScore ?? b.opportunityScore ?? 0) - (a.finalScore ?? a.opportunityScore ?? 0))
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

export async function enqueueAutopilot(userId: string | undefined, workspaceId: string): Promise<AutopilotQueuedResult> {
    console.log(`[Autopilot Async] Queueing job for workspace: ${workspaceId}`);

    const { queues } = await import("@trendforge/queue");
    const job = await queues.autopilot.add(
        "autopilot-run",
        { workspaceId, userId },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 30_000,
            },
            removeOnComplete: 100,
            removeOnFail: 100,
        },
    );

    const jobId = String(job.id);
    await prisma.autopilotJob.upsert({
        where: { id: jobId },
        update: {
            status: "queued",
            workspaceId,
        },
        create: {
            id: jobId,
            workspaceId,
            status: "queued",
        },
    });

    return {
        success: true,
        status: "queued",
        message: "Autopilot job queued",
        jobId,
        workspaceId,
    };
}

export async function runAutopilot(userId: string | undefined, workspaceId: string): Promise<AutopilotRunResult | AutopilotQueuedResult> {
    if (process.env.USE_QUEUE === "true") {
        return enqueueAutopilot(userId, workspaceId);
    }

    return runAutopilotSync(userId, workspaceId);
}
