"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutopilotSync = runAutopilotSync;
exports.enqueueAutopilot = enqueueAutopilot;
exports.runAutopilot = runAutopilot;
require("server-only");
const factoryService_1 = require("./factoryService");
const learnedScoring_1 = require("../../lib/engines/learnedScoring");
const prisma_1 = require("../../lib/db/prisma");
async function runAutopilotSync(userId, workspaceId) {
    console.log(`[Autopilot Sync] Starting job for workspace: ${workspaceId}`);
    // 1. Discover trends
    console.log(`[Autopilot Sync] Step 1: Discovering & Validating Trends...`);
    const discovery = await (0, factoryService_1.bulkDiscover)();
    // 2. Process synchronously (Phase 2 MVP)
    // Only pass MEDIUM/HIGH executionConfidence niches to generateChunk; cap at 5 to control cost
    let topNiches = discovery.niches
        .filter((n) => n.executionConfidence !== "LOW")
        .slice(0, 5);
    // Safety net: if every niche was LOW confidence, use the top-scored niches anyway
    if (topNiches.length === 0 && discovery.niches.length > 0) {
        console.log(`[Autopilot Sync] All niches LOW confidence — falling back to top 3 by score.`);
        topNiches = [...discovery.niches]
            .sort((a, b) => (b.finalScore ?? b.opportunityScore ?? 0) - (a.finalScore ?? a.opportunityScore ?? 0))
            .slice(0, 3);
    }
    console.log(`[Autopilot Sync] Step 2: Generating Listing Assets for ${topNiches.length} niches...`);
    const results = await (0, factoryService_1.generateChunk)(topNiches, true, userId);
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
    console.log(`[Autopilot Async] Queueing job for workspace: ${workspaceId}`);
    const { queues } = await Promise.resolve().then(() => __importStar(require("@trendforge/queue")));
    const job = await queues.autopilot.add("autopilot-run", { workspaceId, userId }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 30000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
    });
    const jobId = String(job.id);
    await prisma_1.prisma.autopilotJob.upsert({
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
async function runAutopilot(userId, workspaceId) {
    if (process.env.USE_QUEUE === "true") {
        return enqueueAutopilot(userId, workspaceId);
    }
    return runAutopilotSync(userId, workspaceId);
}
