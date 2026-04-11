import { AggregatedMarketData, OpportunityScoreResult, NicheStatus } from "./providers/types";

/**
 * Normalizes a value to a 0-100 scale given a min and max.
 */
function normalize(value: number, min: number, max: number): number {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

/**
 * v1.2 Intent Classifier
 */
export function classifyNicheIntent(niche: string): "gift" | "trend" | "evergreen" {
    const n = niche.toLowerCase();
    if (/(gift|birthday|dad|mom|father|mother|grandpa|grandma|teacher)/.test(n)) return "gift";
    if (/(trend|viral|challenge|2026|2025|news|breaking)/.test(n)) return "trend";
    return "evergreen";
}

/**
 * v1.3 Dynamic Weights (Production Finalized)
 */
function getDynamicWeights(type: "gift" | "trend" | "evergreen") {
    switch (type) {
        case "gift":
            return { demand: 0.35, competition: 0.20, intent: 0.30, trend: 0.15 };
        case "trend":
            return { demand: 0.30, competition: 0.25, intent: 0.15, trend: 0.30 };
        case "evergreen":
        default:
            return { demand: 0.40, competition: 0.30, intent: 0.20, trend: 0.10 };
    }
}

/**
 * Computes the final opportunity score using the v1.3 Production Sniper model.
 * Formula: (Demand * 0.4) + (LowComp * 0.3) + (Intent * 0.2) + (Trend * 0.1)
 */
export function computeOpportunity(
    marketData: AggregatedMarketData, 
    trendVelocity: number = 50 
): OpportunityScoreResult {
    const { amazon, etsy, combinedConfidence } = marketData;
    const nicheType = classifyNicheIntent(marketData.keyword);
    const weights = getDynamicWeights(nicheType);
    const reasons: string[] = [];

    // 1. Demand Layer (Static Reviews + Velocity Injection)
    // Amazon weight 0.6, Etsy weight 0.4
    const avgReviews = (amazon.avgReviews * 0.6) + (etsy.avgReviews * 0.4);
    const normalizedReviews = normalize(avgReviews, 0, 1000);
    const demandScore = (normalizedReviews * 0.7) + (normalize(trendVelocity, 0, 100) * 0.3);
    
    if (demandScore > 70) reasons.push("Strong buyer demand with high review density.");
    if (trendVelocity > 70) reasons.push("Explosive cultural momentum detected.");

    // 2. Competition Layer (Institutional Log-Scaled)
    // cap at 20k, weigh density
    const listings = (amazon.listings * 0.6) + (etsy.listings * 0.4);
    const reviewRatio = Math.min(avgReviews / Math.max(1, listings), 1);
    
    // Detect Weak Competition (Institutional Gap)
    let competitionRaw = Math.log10(listings + 1) * (1 - reviewRatio);
    if (reviewRatio < 0.02) {
        competitionRaw *= 0.7; // Boost score for weak competition
        reasons.push("Detected weak professional competition; top listings lack review authority.");
    }

    const lowCompetitionScore = 100 - normalize(competitionRaw, 0, 4.5);

    // 3. Intent Layer (Price Power)
    const avgPrice = (amazon.avgPrice * 0.6) + (etsy.avgPrice * 0.4);
    const intentScore = normalize(avgPrice, 15, 35); 
    if (intentScore > 65) reasons.push("Premium pricing power detected.");

    // 4. Momentum Score
    const finalVelocityScore = normalize(trendVelocity, 0, 100);

    // FINAL FORMULA (v1.3)
    let score = (demandScore * 0.4) + 
                (lowCompetitionScore * 0.3) + 
                (intentScore * 0.2) + 
                (finalVelocityScore * 0.1);

    // Confidence Penalty
    if (combinedConfidence === "mock") {
        score *= 0.85;
    }

    const finalScore = Math.round(Math.min(100, score));

    // Thresholds (v1.2 Persistence)
    const thresholds = { trend: 60, gift: 55, evergreen: 50 };
    const threshold = thresholds[nicheType];
    
    let status: NicheStatus = "DROP";
    if (finalScore >= threshold) {
        status = "PASS";
    } else if (finalScore >= 30) {
        status = "WATCHLIST";
    }

    // Default reason if empty
    if (reasons.length === 0) {
        reasons.push("Steady evergreen potential with balanced metrics.");
    }

    return {
        niche: marketData.keyword,
        demandScore: Math.round(demandScore),
        competitionScore: Math.round(100 - lowCompetitionScore),
        intentScore: Math.round(intentScore),
        velocityScore: Math.round(finalVelocityScore),
        noveltyScore: 50, // Static fallback for novelty in v1.3
        finalOpportunityScore: finalScore,
        status,
        confidence: combinedConfidence,
        opportunityReasons: reasons.slice(0, 3) 
    };
}
