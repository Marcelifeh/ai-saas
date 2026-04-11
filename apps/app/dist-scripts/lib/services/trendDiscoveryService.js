"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDiscovery = runDiscovery;
// server-only removed for script runtime
const trendEngine_1 = require("../ai/trendEngine");
const marketMath_1 = require("../ai/marketMath");
const aiGateway_1 = require("../ai/aiGateway");
const safetyEngine_1 = require("../ai/safetyEngine");
async function runDiscovery(userId) {
    // 1. Run V2 Trend Engine 
    const discoveryResult = await (0, trendEngine_1.discoverTrends)();
    const top5 = discoveryResult.niches.slice(0, 10);
    // 2. Enrich the phrases with expected frontend metadata via a single fast LLM call
    const enrichment = await (0, aiGateway_1.chatCompletionSafe)({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: 'You are a POD analyst. Return a JSON object with a key "enriched" containing an array of objects corresponding exactly to the niches provided.' },
            { role: 'user', content: `Enrich these ${top5.length} print-on-demand niches with additional metadata.\n\nNiches: ${top5.map(n => n.niche).join(', ')}\n\nFor each niche, return an object in the 'enriched' array with these exact string keys:\n- targetAudience (who buys this)\n- whyItSells (the psychological reason)\n- emotionalTrigger (e.g. 'Humor', 'Identity', 'Nostalgia')\n- safe (boolean true/false for family-friendly)` }
        ],
        usageContext: {
            userId,
            feature: "discovery.enrichNiches",
        },
    });
    let enrichedData = [];
    if (!enrichment.error && enrichment.data?.choices[0].message.content) {
        try {
            enrichedData = JSON.parse(enrichment.data.choices[0].message.content).enriched || [];
        }
        catch (err) {
            console.error("Enrichment mapping failed:", err);
        }
    }
    // 3. Map into the existing frontend opportunity schema
    const scored = await Promise.all(top5.map(async (n, i) => {
        const extra = enrichedData[i] || { targetAudience: 'Broad Audience', whyItSells: 'Strong cultural relevance', emotionalTrigger: 'Identity Expression', safe: true };
        const trend = (0, marketMath_1.createTrendSnapshot)(n, 65);
        let market = (0, marketMath_1.generateMarketSignals)(n.niche, trend);
        const score = (0, marketMath_1.scoreWithMarketIntel)({ ...n, ...extra }, market, trend);
        const { projectedRevenue, revenueCategory } = (0, marketMath_1.calculateRevenue)(n.niche, market.trendMomentum);
        const safetyResult = (0, safetyEngine_1.runSafetyEngine)(n.niche);
        const safeName = safetyResult.modified ? safetyResult.sanitizedNiche : n.niche;
        const result = {
            niche: safeName,
            audience: extra.targetAudience,
            whyItSells: extra.whyItSells,
            emotionalTrigger: extra.emotionalTrigger,
            safe: extra.safe,
            projectedRevenue,
            revenueCategory,
            research_demand: market.searchVolume,
            research_competition: market.competitionDensity,
            trend_score: market.trendMomentum,
            // Use the same niche_score calculation as the Strategy
            // factory so scores stay consistent across views.
            niche_score: score.niche_score,
            metricsSource: score.metricsSource || market.metricsSource || 'trend-engine-v2',
            safety: {
                safe: safetyResult.safe,
                modified: safetyResult.modified,
                riskScore: safetyResult.riskScore,
                originalName: safetyResult.modified ? safetyResult.originalNiche : undefined,
            },
        };
        return result;
    }));
    scored.sort((a, b) => b.niche_score - a.niche_score);
    const lastUpdated = new Date().toISOString();
    return {
        opportunities: scored,
        signals: discoveryResult.signals,
        signalSources: discoveryResult.signalSources,
        signalConfidence: discoveryResult.signalConfidence,
        lastUpdated,
    };
}
