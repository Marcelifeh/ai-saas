/**
 * Deterministic Revenue Model — Phase 37
 *
 * Replaces Math.random() with category-based revenue ranges
 * grounded in real Amazon Merch on Demand market research.
 *
 * Formula: range.min + (trendScore / 100) * (range.max - range.min)
 * Result: deterministic, explainable, category-appropriate.
 */

// Real POD revenue ranges per category (monthly estimate, USD)
const REVENUE_RANGES = {
    seasonal: { min: 800, max: 3200 }, // High spike, short window (Christmas, Valentine, St. Patrick's)
    gift: { min: 500, max: 2000 }, // Evergreen gifting — birthdays, mothers day, fathers day
    humor: { min: 300, max: 1500 }, // Volume play — high CTR, lower AOV
    hobby: { min: 400, max: 1800 }, // Loyal niche communities — fishing, hunting, gaming
    profession: { min: 600, max: 2500 }, // Identity-driven — nurses, teachers, engineers
    faith: { min: 700, max: 2800 }, // Evergreen, community-driven repeat buyers
    pet: { min: 450, max: 1900 }, // Strong gifting + identity signal
    sport: { min: 350, max: 1600 }, // Fan-driven, team loyalty
    default: { min: 300, max: 1200 }  // Unclassified
};

// Keyword patterns to classify niche into a category
const CATEGORY_PATTERNS = {
    seasonal: ['christmas', 'halloween', 'thanksgiving', 'patrick', 'valentine', 'easter', 'fourth of july', '4th of july', 'holiday', 'new year'],
    gift: ['gift', 'present', 'for mom', 'for dad', 'for her', 'for him', 'for grandma', 'for grandpa', 'birthday'],
    humor: ['funny', 'sarcastic', 'sarcasm', 'humor', 'humour', 'joke', 'meme', 'ironic', 'parody', 'pun'],
    hobby: ['fishing', 'hunting', 'camping', 'hiking', 'gaming', 'gamer', 'gardening', 'crafting', 'woodworking', 'cycling', 'knitting'],
    profession: ['nurse', 'doctor', 'teacher', 'engineer', 'vet', 'lawyer', 'accountant', 'firefighter', 'paramedic', 'chef', 'programmer', 'developer'],
    faith: ['christian', 'jesus', 'faith', 'church', 'prayer', 'bible', 'god', 'blessed', 'pastor'],
    pet: ['dog', 'cat', 'puppy', 'kitten', 'pet', 'paw', 'rescue'],
    sport: ['football', 'basketball', 'baseball', 'soccer', 'hockey', 'tennis', 'golf', 'wrestling', 'athlete', 'gym', 'runner']
};

/**
 * Classify a niche string into a revenue category
 */
function classifyNiche(niche) {
    const lower = (niche || '').toLowerCase();
    for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
        if (patterns.some(p => lower.includes(p))) {
            return category;
        }
    }
    return 'default';
}

/**
 * Calculate projected monthly revenue
 * @param {string} niche - The niche string
 * @param {number} trendScore - 0-100 trend signal (from AI or trendEngine)
 * @returns {{ projectedRevenue: number, revenueCategory: string, revenueRange: { min: number, max: number } }}
 */
function calculateRevenue(niche, trendScore = 50) {
    const category = classifyNiche(niche);
    const range = REVENUE_RANGES[category] || REVENUE_RANGES.default;
    const clampedTrend = Math.max(0, Math.min(100, trendScore));

    // Deterministic formula — no randomness
    const projectedRevenue = Math.round(range.min + (clampedTrend / 100) * (range.max - range.min));

    return {
        projectedRevenue,
        revenueCategory: category,
        revenueRange: range
    };
}

module.exports = { calculateRevenue, classifyNiche, REVENUE_RANGES };
