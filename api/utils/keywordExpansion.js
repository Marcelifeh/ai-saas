/**
 * Keyword Expansion Engine — Phase 36 V2
 * Generates diverse angles from a single seed niche with randomized modern subcultures.
 */

function expandKeywords(niche) {
    if (!niche) return [];

    const baseNiche = String(niche).trim().toLowerCase();

    const allModifiers = [
        // Classic
        "funny", "vintage", "retro", "gift for", "minimalist", "aesthetic", "sarcastic",
        // Modern & Internet Culture
        "introvert", "ADHD", "quiet luxury", "cozy", "feral", "Y2K", "gothic", "cute",
        // Lifestyles
        "gym rat", "plant parent", "dog mom", "booktok", "burnout", "overstimulated"
    ];

    const allIntents = [
        "t-shirt", "shirt", "hoodie", "sweatshirt", "merch", "apparel", "gift", "design"
    ];

    // Shuffle and pick subset to avoid generating thousands of keywords, focusing on novelty each run
    const activeModifiers = [...allModifiers].sort(() => 0.5 - Math.random()).slice(0, 8);
    const activeIntents = [...allIntents].sort(() => 0.5 - Math.random()).slice(0, 4);

    const keywords = [];

    // Add base niche with intents
    activeIntents.forEach(intent => {
        keywords.push(`${baseNiche} ${intent}`);
    });

    // Add modified niche with intents
    activeModifiers.forEach(mod => {
        activeIntents.slice(0, 2).forEach(intent => {
            keywords.push(`${mod} ${baseNiche} ${intent}`);
        });
    });

    return [...new Set(keywords)];
}

module.exports = { expandKeywords };
