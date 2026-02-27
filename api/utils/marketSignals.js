function generateMarketSignals(niche) {
    const baseStr = niche ? String(niche).toLowerCase() : "default";
    const base = hashString(baseStr);

    const searchVolume = normalize(base * 1.3);
    const competitionDensity = normalize(base * 0.9 + 20);
    const trendMomentum = normalize(Math.abs(Math.sin(base)) * 100);
    const buyerIntent = normalize(60 + Math.cos(base) * 20);

    const opportunityIndex =
        searchVolume * 0.4 +
        (100 - competitionDensity) * 0.3 +
        trendMomentum * 0.2 +
        buyerIntent * 0.1;

    return {
        searchVolume,
        competitionDensity,
        trendMomentum,
        buyerIntent,
        opportunityIndex: Math.round(opportunityIndex)
    };
}

function scoreWithMarketIntel(intel, market) {
    const demandScore = market.searchVolume;
    const competitionScore = market.competitionDensity;
    const trendScore = market.trendMomentum;
    const buyerIntent = market.buyerIntent;

    const finalScore =
        demandScore * 0.30 +
        (100 - competitionScore) * 0.25 +
        trendScore * 0.20 +
        buyerIntent * 0.15 +
        (intel.safe ? 10 : -10);

    let decision = "TEST";
    if (finalScore >= 75) decision = "PUBLISH";
    if (finalScore < 50) decision = "SKIP";

    return {
        niche_score: Math.round(finalScore),
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
