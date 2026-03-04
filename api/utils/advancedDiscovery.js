/**
 * Orchestrator: Advanced Discovery Engine
 */

const { expandKeywords } = require("./keywordExpansion");
const { getKeywordSignals } = require("./keywordSignals");
const { scoreKeyword } = require("./keywordScoring");

function discoverHighPotentialKeywords(niche) {
    // 1. Expand
    const keywords = expandKeywords(niche);

    // 2. Score & Analyze
    const analyzed = keywords.map(keyword => {
        // Signals include: demandScore, competitionScore, trendScore, buyerIntentScore, intentType
        const signals = getKeywordSignals(keyword);
        signals.keyword = keyword; // inject for risk checker

        // Scoring includes: opportunityScore, riskScore, riskLevel
        const scoring = scoreKeyword(signals);

        return {
            keyword,
            opportunityScore: scoring.opportunityScore,
            demandScore: signals.demandScore,
            trendScore: signals.trendScore,
            competitionScore: signals.competitionScore,
            buyerIntentScore: signals.buyerIntentScore,
            intentType: signals.intentType,
            riskScore: scoring.riskScore,
            riskLevel: scoring.riskLevel
        };
    });

    // 3. Rank
    return analyzed
        .sort((a, b) => b.opportunityScore - a.opportunityScore)
        .slice(0, 10);
}

module.exports = { discoverHighPotentialKeywords };
