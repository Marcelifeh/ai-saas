/**
 * Keyword Expansion Engine
 * Generates diverse angles from a single seed niche.
 */

function expandKeywords(niche) {
    if (!niche) return [];

    const baseNiche = String(niche).trim().toLowerCase();

    const modifiers = [
        "funny",
        "vintage",
        "retro",
        "gift for",
        "minimalist",
        "aesthetic",
        "cute",
        "sarcastic",
        "motivational",
        "trending",
        "viral",
        "custom",
        "personalized"
    ];

    const buyerIntents = [
        "t-shirt",
        "shirt",
        "gift",
        "design",
        "merch",
        "apparel",
        "hoodie",
        "poster"
    ];

    const keywords = [];

    // Add base niche with intents
    buyerIntents.forEach(intent => {
        keywords.push(`${baseNiche} ${intent}`);
    });

    // Add modified niche with intents (mix a subset to prevent explosion in size for now)
    modifiers.forEach(mod => {
        buyerIntents.slice(0, 3).forEach(intent => {
            keywords.push(`${mod} ${baseNiche} ${intent}`);
        });
    });

    // Semantic Clustering could be added here later to remove near-duplicates

    return [...new Set(keywords)];
}

module.exports = { expandKeywords };
