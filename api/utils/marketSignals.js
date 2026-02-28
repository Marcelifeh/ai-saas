function generateMarketSignals(niche, trendSigs = null) {
    const baseStr = niche ? String(niche).toLowerCase() : "default";
    const base = hashString(baseStr);

    const searchVolume = normalize(base * 1.3);
    const competitionDensity = normalize(base * 0.9 + 20);
    const trendMomentum = trendSigs ? trendSigs.score : normalize(Math.abs(Math.sin(base)) * 100);
    const buyerIntent = normalize(60 + Math.cos(base) * 20);

    // Enhanced Formula: (Trend * 0.5) + (Demand * 0.3) + (Competition * 0.2)
    const opportunityIndex =
        trendMomentum * 0.5 +
        searchVolume * 0.3 +
        (100 - competitionDensity) * 0.2;

    return {
        searchVolume,
        competitionDensity,
        trendMomentum,
        buyerIntent,
        opportunityIndex: Math.round(opportunityIndex)
    };
}

function scoreWithMarketIntel(intel, market, trendSigs = null) {
    const demandScore = market.searchVolume;
    const competitionScore = market.competitionDensity;
    const trendScore = trendSigs ? trendSigs.score : market.trendMomentum;
    const buyerIntent = market.buyerIntent;

    // (trendScore * 0.5) + (demandScore * 0.3) + (competitionScore * 0.2)
    const opportunityScore =
        trendScore * 0.5 +
        demandScore * 0.3 +
        (100 - competitionScore) * 0.2;

    const finalScore = opportunityScore + (intel.safe ? 10 : -10);

    // Publish Priority: Emerging winners prioritize high trend acceleration
    const trendAccel = trendSigs?.signals?.growthAcceleration || 50;
    const publishPriority = Math.round(opportunityScore * 0.7 + trendAccel * 0.3);

    let decision = "TEST";
    if (finalScore >= 75) decision = "PUBLISH";
    if (finalScore < 50) decision = "SKIP";

    return {
        niche_score: Math.round(finalScore),
        publishPriority,
        decision
    };
}

function normalize(num) {
    return Math.max(5, Math.min(95, Math.round(num % 100)));
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 100);
}

module.exports = { generateMarketSignals, scoreWithMarketIntel };
