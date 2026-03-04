/**
 * Trend Intelligence Engine
 * 
 * Responsibilities:
 * - Fetch/simulate real-world momentum signals (Search, Social, Conv)
 * - Normalize and weight metrics
 * - Provide 6-hour caching to prevent rate limiting
 * - Provide strict schema contract for pipeline stability
 */

const { cache } = require("./trendCache");

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Main entry point for trend signals
 */
async function getTrendSignals(niche, platform = 'amazon', region = 'US') {
    const cacheKey = `${niche}:${platform}:${region}`.toLowerCase();

    // 1. Check Cache
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry) {
        return cachedEntry;
    }

    // 2. Signal Acquisition with Fallback Simulation
    // In a production environment, this would hit real APIs (Google Trends, TikTok, Reddit)
    // Here we use a deterministic simulation grounded in the niche string
    const signals = simulateTrendSignals(niche);

    // 3. Normalize and Weight
    const trendData = calculateTrendScore(signals);

    // 4. Update Cache (ttl is passed as the 3rd arg to our new memory cache adapter)
    cache.set(cacheKey, trendData, CACHE_TTL);

    return trendData;
}

/**
 * Deterministic simulation of trend signals
 */
function simulateTrendSignals(niche) {
    const seed = hashString(niche || "default");

    // Signals (0-100)
    const searchMomentum = normalize(seed * 1.7);
    const socialVelocity = normalize(seed * 2.1 + 10);
    const conversationIntensity = normalize(seed * 0.9 + 30);
    const growthAcceleration = normalize(Math.abs(Math.sin(seed)) * 100);

    // Confidence mapping
    let confidence = "fallback";
    if (seed > 80) confidence = "high";
    else if (seed > 40) confidence = "medium";
    else confidence = "low";

    return {
        searchMomentum,
        socialVelocity,
        conversationIntensity,
        growthAcceleration,
        confidence
    };
}

/**
 * Unified Trend Scoring Model
 */
function calculateTrendScore(signals) {
    const { searchMomentum, socialVelocity, conversationIntensity, growthAcceleration, confidence } = signals;

    // Weighting formula
    const rawScore = (searchMomentum * 0.4) +
        (socialVelocity * 0.35) +
        (conversationIntensity * 0.15) +
        (growthAcceleration * 0.10);

    // Confidence multiplier
    const confidenceMultiplier = {
        "high": 1.0,
        "medium": 0.8,
        "low": 0.6,
        "fallback": 0.4
    }[confidence] || 0.4;

    const score = Math.round(rawScore * confidenceMultiplier);

    // Badge Logic
    let badge = "⚖ Stable";
    if (score >= 80) badge = "🔥 Trending";
    else if (score >= 60) badge = "📈 Rising";
    else if (score < 30) badge = "🧊 Cooling";

    return {
        score,
        badge,
        confidence,
        signals
    };
}

/**
 * Helper: Simple string hash
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 100);
}

/**
 * Helper: Keep numbers 5-95
 */
function normalize(num) {
    return Math.max(5, Math.min(95, Math.round(num % 100)));
}

module.exports = { getTrendSignals, simulateTrendSignals };
