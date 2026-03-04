/**
 * Keyword Scoring Engine
 * Incorporates Trademark Risk layers alongside commercial signals.
 */

function scoreKeyword(signals) {
    const demandWeight = 0.35;
    const trendWeight = 0.30;
    const competitionWeight = 0.20;
    const intentWeight = 0.15;

    const baseScore =
        (signals.demandScore * demandWeight) +
        (signals.trendScore * trendWeight) +
        ((100 - signals.competitionScore) * competitionWeight) +
        (signals.buyerIntentScore * intentWeight);

    // Trademark Risk Simulation based on common words
    // In production, this would cross-reference USPTO databases
    const riskyBrands = ["disney", "marvel", "nike", "gucci", "nintendo", "pokemon", "star wars", "mickey"];
    const hasRisk = riskyBrands.some(brand => signals.keyword.toLowerCase().includes(brand));

    const riskScore = hasRisk ? 80 : 5;
    let riskLevel = "safe";

    if (riskScore >= 75) riskLevel = "high";
    else if (riskScore > 30) riskLevel = "caution";

    // Penalize score if risky
    const finalOpportunityScore = baseScore * (1 - (riskScore / 150));

    return {
        opportunityScore: Math.round(finalOpportunityScore),
        riskScore,
        riskLevel
    };
}

module.exports = { scoreKeyword };
