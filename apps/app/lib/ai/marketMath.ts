import "server-only";

export interface MarketIntel {
    searchVolume: number;
    competitionDensity: number;
    trendMomentum: number;
    buyerIntent: number;
    opportunityIndex: number;
    metricsSource: string;
}

export interface TrendSnapshot {
    score: number;
    signals: {
        growthAcceleration: number;
    };
}

export function createTrendSnapshot(seed: any = null, fallbackScore: number = 65): TrendSnapshot {
    const scoreCandidate = firstFiniteNumber(
        seed?.trend?.score,
        seed?.trend_score,
        seed?.trendMomentum,
        typeof seed?.viralScore === "number" ? seed.viralScore * 10 : undefined,
        seed?.finalScore,
        fallbackScore,
    );
    const score = clamp(scoreCandidate);

    const growthCandidate = firstFiniteNumber(
        seed?.trend?.signals?.growthAcceleration,
        seed?.growthAcceleration,
        typeof seed?.profitScore === "number" && typeof seed?.viralScore === "number"
            ? seed.profitScore * 0.45 + seed.viralScore * 5.5
            : undefined,
        score,
    );

    return {
        score,
        signals: {
            growthAcceleration: clamp(growthCandidate),
        },
    };
}

function generateBaseSignals(niche: string, trendSigs: any = null): MarketIntel {
    const baseStr = niche ? String(niche).toLowerCase().trim() : 'default';
    const hash = [...baseStr].reduce((acc, c) => acc + c.charCodeAt(0), 0);

    const searchVolume = (hash % 40) + 40;        // 40–80
    const competitionDensity = (hash % 30) + 30;   // 30–60
    const trendMomentum = trendSigs ? trendSigs.score : (hash % 50) + 30; // 30–80
    const buyerIntent = (hash % 35) + 45;

    return {
        searchVolume,
        competitionDensity,
        trendMomentum,
        buyerIntent,
        opportunityIndex: computeOpportunityIndex(trendMomentum, searchVolume, competitionDensity),
        metricsSource: 'deterministic'
    };
}

function refineWithAI(base: MarketIntel, aiSignals: any, trendSigs: any = null): MarketIntel {
    const aiDemand = clamp(aiSignals.estimatedDemandStrength);
    const aiComp = clamp(aiSignals.estimatedCompetition);
    const aiTrend = trendSigs ? trendSigs.score : clamp(aiSignals.estimatedTrend);
    const aiIntent = clamp(aiSignals.estimatedBuyerIntent);

    const blendedSearchVolume = Math.round((base.searchVolume * 0.6) + (aiDemand * 0.4));
    const blendedComp = Math.round((base.competitionDensity * 0.6) + (aiComp * 0.4));
    const blendedTrend = Math.round((base.trendMomentum * 0.6) + (aiTrend * 0.4));
    const blendedIntent = Math.round((base.buyerIntent * 0.6) + (aiIntent * 0.4));

    return {
        searchVolume: blendedSearchVolume,
        competitionDensity: blendedComp,
        trendMomentum: blendedTrend,
        buyerIntent: blendedIntent,
        opportunityIndex: computeOpportunityIndex(blendedTrend, blendedSearchVolume, blendedComp),
        metricsSource: 'blended'
    };
}

export function generateMarketSignals(niche: string, trendSigs: any = null, aiSignals: any = null): MarketIntel {
    const base = generateBaseSignals(niche, trendSigs);
    
    if (aiSignals && typeof aiSignals.estimatedDemandStrength === 'number') {
        return refineWithAI(base, aiSignals, trendSigs);
    }

    return base;
}

function computeOpportunityIndex(trend: number, demand: number, competition: number): number {
    return Math.round(trend * 0.5 + demand * 0.3 + (100 - competition) * 0.2);
}

export function scoreWithMarketIntel(intel: any, market: MarketIntel, trendSigs: any = null) {
    const demandScore = market.searchVolume;
    const competitionScore = market.competitionDensity;
    const trendScore = trendSigs ? trendSigs.score : market.trendMomentum;

    const opportunityScore =
        trendScore * 0.5 +
        demandScore * 0.3 +
        (100 - competitionScore) * 0.2;

    const finalScore = opportunityScore;

    const trendAccel = trendSigs?.signals?.growthAcceleration || 50;
    const publishPriority = Math.round(opportunityScore * 0.7 + trendAccel * 0.3);

    let decision = 'TEST';
    if (finalScore >= 75) decision = 'PUBLISH';
    if (finalScore < 50) decision = 'SKIP';
    if (intel?.safe === false && decision === 'PUBLISH') decision = 'TEST';

    return {
        niche_score: Math.round(finalScore),
        publishPriority,
        decision,
        metricsSource: market.metricsSource || 'simulated'
    };
}

function clamp(num: any): number {
    return Math.max(5, Math.min(95, Math.round(Number(num) || 50)));
}

function firstFiniteNumber(...values: unknown[]): number {
    for (const value of values) {
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }
    }
    return 50;
}

function normalize(num: number): number {
    return Math.max(5, Math.min(95, Math.round(num % 100)));
}

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 100);
}

// -------------------------------------------------------------
// REVENUE MODEL
// -------------------------------------------------------------

const REVENUE_RANGES: Record<string, { min: number, max: number }> = {
    seasonal: { min: 800, max: 3200 },
    gift: { min: 500, max: 2000 },
    humor: { min: 300, max: 1500 },
    hobby: { min: 400, max: 1800 },
    profession: { min: 600, max: 2500 },
    faith: { min: 700, max: 2800 },
    pet: { min: 450, max: 1900 },
    sport: { min: 350, max: 1600 },
    default: { min: 300, max: 1200 }
};

const CATEGORY_PATTERNS: Record<string, string[]> = {
    seasonal: ['christmas', 'halloween', 'thanksgiving', 'patrick', 'valentine', 'easter', 'fourth of july', '4th of july', 'holiday', 'new year'],
    gift: ['gift', 'present', 'for mom', 'for dad', 'for her', 'for him', 'for grandma', 'for grandpa', 'birthday'],
    humor: ['funny', 'sarcastic', 'sarcasm', 'humor', 'humour', 'joke', 'meme', 'ironic', 'parody', 'pun'],
    hobby: ['fishing', 'hunting', 'camping', 'hiking', 'gaming', 'gamer', 'gardening', 'crafting', 'woodworking', 'cycling', 'knitting'],
    profession: ['nurse', 'doctor', 'teacher', 'engineer', 'vet', 'lawyer', 'accountant', 'firefighter', 'paramedic', 'chef', 'programmer', 'developer'],
    faith: ['christian', 'jesus', 'faith', 'church', 'prayer', 'bible', 'god', 'blessed', 'pastor'],
    pet: ['dog', 'cat', 'puppy', 'kitten', 'pet', 'paw', 'rescue'],
    sport: ['football', 'basketball', 'baseball', 'soccer', 'hockey', 'tennis', 'golf', 'wrestling', 'athlete', 'gym', 'runner']
};

export function classifyNiche(niche: string): string {
    const lower = (niche || '').toLowerCase();
    for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
        if (patterns.some(p => lower.includes(p))) {
            return category;
        }
    }
    return 'default';
}

export function calculateRevenue(niche: string, trendScore: number = 50) {
    const category = classifyNiche(niche);
    const range = REVENUE_RANGES[category] || REVENUE_RANGES.default;
    const clampedTrend = Math.max(0, Math.min(100, trendScore));

    const projectedRevenue = Math.round(range.min + (clampedTrend / 100) * (range.max - range.min));

    return {
        projectedRevenue,
        revenueCategory: category,
        revenueRange: range
    };
}
