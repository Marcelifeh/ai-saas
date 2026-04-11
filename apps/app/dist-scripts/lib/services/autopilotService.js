"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutopilotSync = runAutopilotSync;
exports.enqueueAutopilot = enqueueAutopilot;
exports.runAutopilot = runAutopilot;
// server-only removed for script runtime
const factoryService_1 = require("./factoryService");
const learnedScoring_1 = require("../../lib/engines/learnedScoring");
async function runAutopilotSync(userId, workspaceId) {
    console.log(`[Autopilot Sync] Starting job for workspace: ${workspaceId}`);
    // 1. Discover trends
    const discovery = await (0, factoryService_1.bulkDiscover)();
    // 2. Process synchronously (Phase 2 MVP)
    const results = await (0, factoryService_1.generateChunk)(discovery.niches, true, userId);
    // 3. Filter each product's slogans to top-performing (learned) winners only
    const enriched = await Promise.all(results.map(async (product) => {
        try {
            const rawSlogans = Array.isArray(product.shirtSlogans)
                ? product.shirtSlogans
                : [];
            if (rawSlogans.length === 0)
                return product;
            const niche = typeof product.niche === "string"
                ? product.niche
                : "";
            const winners = await (0, learnedScoring_1.getWinningSlogans)(rawSlogans, niche);
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
        }
        catch {
            // Never drop a product — fall back to unfiltered slogans
            return product;
        }
    }));
    return {
        success: true,
        message: "Autopilot completed synchronously",
        productsGenerated: enriched.length,
        signalSources: discovery.signalSources,
        signalConfidence: discovery.signalConfidence,
        data: enriched,
    };
}
async function enqueueAutopilot(userId, workspaceId) {
    console.log(`[Autopilot Async] Queue mode requested for workspace: ${workspaceId} — running synchronously (BullMQ Phase 3 pending)`);
    // Phase 3: wire BullMQ here when workers/autopilot-worker is deployed.
    // For now, fall through to the sync path so the caller always gets real results.
    return runAutopilotSync(userId, workspaceId);
}
async function runAutopilot(userId, workspaceId) {
    if (process.env.USE_QUEUE === "true") {
        return enqueueAutopilot(userId, workspaceId);
    }
    return runAutopilotSync(userId, workspaceId);
}
