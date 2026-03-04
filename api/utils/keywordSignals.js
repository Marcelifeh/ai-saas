/**
 * Simulated keyword demand signals + intent classification
 */

function getKeywordSignals(keyword) {
    const seed = hashString(keyword);

    // Baseline signals
    const demandScore = normalize(seed * 1.5 + 20);
    const competitionScore = normalize(seed * 0.8 + 10);
    const trendScore = normalize(Math.abs(Math.cos(seed)) * 100);

    // Intent Classification
    const lowerKw = keyword.toLowerCase();
    let intentType = "trend-driven"; // default
    let buyerIntentScore = 50;

    if (lowerKw.includes("gift") || lowerKw.includes("present") || lowerKw.includes("for")) {
        intentType = "gift";
        buyerIntentScore = 85;
    } else if (lowerKw.includes("shirt") || lowerKw.includes("t-shirt") || lowerKw.includes("hoodie") || lowerKw.includes("apparel") || lowerKw.includes("merch")) {
        intentType = "purchase";
        buyerIntentScore = 95;
    } else if (lowerKw.includes("aesthetic") || lowerKw.includes("minimalist") || lowerKw.includes("retro") || lowerKw.includes("vintage")) {
        intentType = "identity";
        buyerIntentScore = 75;
    } else if (lowerKw.includes("funny") || lowerKw.includes("sarcastic")) {
        intentType = "humor";
        buyerIntentScore = 80;
    }

    // Boost scores slightly if intent is very high
    const finalDemand = Math.min(95, demandScore + (buyerIntentScore > 80 ? 10 : 0));

    return {
        demandScore: finalDemand,
        competitionScore,
        trendScore,
        buyerIntentScore,
        intentType
    };
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 100);
}

function normalize(num) {
    return Math.max(5, Math.min(95, Math.round(num % 100)));
}

module.exports = { getKeywordSignals };
