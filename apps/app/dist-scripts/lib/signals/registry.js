"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SOURCES = void 0;
exports.blendWithFreshnessDecay = blendWithFreshnessDecay;
exports.fetchAndBlend = fetchAndBlend;
// server-only removed for script runtime
const trendEngine_1 = require("../../lib/ai/trendEngine");
// ---------------------------------------------------------------------------
// Freshness decay constants.
//
//   freshnessWeight = Math.exp(-ageHours / HALF_LIFE_HOURS)
//
// At HALF_LIFE_HOURS the weight is 0.5. At 24 h it is 0.37, at 48 h it is
// 0.14. This mirrors how trend data "stales" — Google Trends data collected 2
// hours ago is nearly as good as live; data from yesterday halves its influence.
// ---------------------------------------------------------------------------
const FRESHNESS_HALF_LIFE_HOURS = 24;
// Tier multipliers mirror SOURCE_TIER_MULTIPLIER in trendEngine.ts
const TIER_MULTIPLIER = {
    tier1: 1.0,
    tier2: 0.74,
    tier3: 0.55,
};
// ---------------------------------------------------------------------------
// Registry — wraps the existing provider functions as TrendSource adapters.
// ---------------------------------------------------------------------------
const googleTrendsSource = {
    name: "google_trends",
    tier: "tier1",
    fetch: () => (0, trendEngine_1.getGoogleTrends)(),
    healthCheck: async () => {
        const result = await (0, trendEngine_1.getGoogleTrends)();
        return result.status === "ok";
    },
};
const serpApiSource = {
    name: "serpapi_trends",
    tier: "tier1",
    fetch: () => (0, trendEngine_1.getSerpApiTrends)(),
    healthCheck: async () => {
        const result = await (0, trendEngine_1.getSerpApiTrends)();
        return result.status === "ok";
    },
};
const redditSource = {
    name: "reddit",
    tier: "tier2",
    fetch: () => (0, trendEngine_1.getRedditTrends)(),
    healthCheck: async () => {
        const result = await (0, trendEngine_1.getRedditTrends)();
        return result.status === "ok";
    },
};
const hackerNewsSource = {
    name: "hacker_news",
    tier: "tier3",
    fetch: () => (0, trendEngine_1.getHackerNewsTrends)(),
    healthCheck: async () => {
        const result = await (0, trendEngine_1.getHackerNewsTrends)();
        return result.status === "ok";
    },
};
/** Ordered by tier precedence (tier1 sources weigh in first). */
exports.DEFAULT_SOURCES = [
    googleTrendsSource,
    serpApiSource,
    redditSource,
    hackerNewsSource,
];
// ---------------------------------------------------------------------------
// Freshness helpers
// ---------------------------------------------------------------------------
function computeFreshnessWeight(fetchedAt) {
    const ageMs = Date.now() - new Date(fetchedAt).getTime();
    const ageHours = ageMs / 3600000;
    return Math.exp(-ageHours / FRESHNESS_HALF_LIFE_HOURS);
}
function computeCompositeScore(confidence, freshnessWeight, tier) {
    const tierMult = TIER_MULTIPLIER[tier] ?? 0.5;
    return Math.round(confidence * freshnessWeight * tierMult * 10000) / 10000;
}
// ---------------------------------------------------------------------------
// blendWithFreshnessDecay
//
// Takes an array of already-fetched TrendSignalSourceResults and applies the
// three-factor composite:   confidence × freshnessWeight × tierMultiplier
//
// Terms are deduplicated and ranked by their source's compositeScore (higher
// score sources contribute their terms first / with more weight).
// ---------------------------------------------------------------------------
function blendWithFreshnessDecay(sources) {
    const annotated = sources.map((src) => {
        const fw = computeFreshnessWeight(src.fetchedAt);
        const cs = computeCompositeScore(src.confidence, fw, src.tier);
        return { ...src, freshnessWeight: Math.round(fw * 10000) / 10000, compositeScore: cs };
    });
    // Sort descending by composite score so highest-quality terms come first
    const ranked = [...annotated].sort((a, b) => b.compositeScore - a.compositeScore);
    // Deduplicate terms while preserving score-weighted order
    const seen = new Set();
    const terms = [];
    for (const src of ranked) {
        for (const term of src.data) {
            const key = term.toLowerCase().replace(/[^\w\s]/g, "").trim();
            if (key && !seen.has(key)) {
                seen.add(key);
                terms.push(term);
            }
        }
    }
    // Blended confidence = weighted average (composite score as weight)
    const totalScore = ranked.reduce((s, src) => s + src.compositeScore, 0);
    const blendedConfidence = totalScore > 0
        ? Math.round((ranked.reduce((s, src) => s + src.confidence * src.compositeScore, 0) / totalScore) * 100) / 100
        : 0;
    return {
        terms: terms.slice(0, 50),
        sources: ranked,
        blendedConfidence,
        blendedAt: new Date().toISOString(),
    };
}
// ---------------------------------------------------------------------------
// fetchAndBlend
//
// Convenience function: fetches all registered sources in parallel and returns
// a freshness-decayed blend. If a subset of sources should be used, pass them
// explicitly via the `sources` parameter.
// ---------------------------------------------------------------------------
async function fetchAndBlend(sources = exports.DEFAULT_SOURCES) {
    const results = await Promise.all(sources.map((s) => s.fetch()));
    return blendWithFreshnessDecay(results);
}
