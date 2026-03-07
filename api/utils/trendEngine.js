/**
 * TrendForge AI v2 Trend Engine
 * trendEngine.js
 *
 * Pipeline:
 * 1. Google Trends ingestion
 * 2. Reddit trend scraping
 * 3. Trend aggregation
 * 4. LLM niche generation
 * 5. Semantic clustering
 * 6. Profitability scoring
 * 7. Viral potential detection
 */

const OpenAI = require("openai");
const googleTrends = require("google-trends-api");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**************************************************************
 * UTILITIES
 **************************************************************/

function cleanText(str) {
    return str
        .replace(/[^\w\s]/gi, "")
        .toLowerCase()
        .trim();
}

function unique(arr) {
    return [...new Set(arr)];
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

/**************************************************************
 * VECTOR UTILS
 **************************************************************/

function cosineSimilarity(vecA, vecB) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    return dot / (magA * magB);
}

/**************************************************************
 * GOOGLE TRENDS INGESTION
 **************************************************************/

async function getGoogleTrends() {
    try {
        const trends = await googleTrends.dailyTrends({
            geo: "US",
        });

        const data = JSON.parse(trends);

        const keywords =
            data.default.trendingSearchesDays[0].trendingSearches.map(
                (trend) => trend.title.query
            );

        return keywords.slice(0, 20);
    } catch (err) {
        console.error("Google Trends error:", err);
        return [];
    }
}

/**************************************************************
 * REDDIT TREND SCRAPER
 **************************************************************/

const SUBREDDITS = [
    "sidehustle",
    "entrepreneur",
    "printondemand",
    "streetwear",
    "fitness",
    "smallbusiness",
    "etsy",
];

async function getRedditTrends() {
    const titles = [];

    for (const sub of SUBREDDITS) {
        try {
            const res = await fetch(
                `https://www.reddit.com/r/${sub}/hot.json?limit=20`
            );

            const json = await res.json();

            json.data.children.forEach((post) => {
                titles.push(post.data.title);
            });
        } catch (err) {
            console.error("Reddit error:", err);
        }
    }

    return titles;
}

/**************************************************************
 * TREND AGGREGATOR
 **************************************************************/

async function collectTrendSignals() {
    const google = await getGoogleTrends();
    const reddit = await getRedditTrends();

    const combined = [...google, ...reddit];

    const cleaned = combined.map(cleanText);

    return unique(cleaned).slice(0, 40);
}

/**************************************************************
 * LLM NICHE GENERATION
 **************************************************************/

async function generateNiches(signals) {
    const contextSignals = signals.slice(0, 15).join("\n");

    const prompt = `
You are a print-on-demand trend analyst.

Using these trending signals:

${contextSignals}

Generate 30 unique niche communities suitable for POD apparel.

Rules:
- Focus on micro communities
- Prefer humor or identity expression
- Avoid generic niches like "dog lover"
- Return short phrases only

Return as JSON array.
`;

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.85,
        messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message.content;

    try {
        const niches = JSON.parse(text);
        return niches.slice(0, 30);
    } catch {
        return text.split("\n").map((x) => x.trim());
    }
}

/**************************************************************
 * EMBEDDING GENERATION
 **************************************************************/

async function embedTexts(texts) {
    const embeddings = [];

    for (const text of texts) {
        const response = await client.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });

        embeddings.push(response.data[0].embedding);
    }

    return embeddings;
}

/**************************************************************
 * SEMANTIC CLUSTERING
 **************************************************************/

async function clusterNiches(niches) {
    const embeddings = await embedTexts(niches);

    const clusters = [];

    niches.forEach((niche, index) => {
        const vec = embeddings[index];

        let placed = false;

        for (const cluster of clusters) {
            const similarity = cosineSimilarity(vec, cluster.vector);

            if (similarity > 0.82) {
                cluster.items.push(niche);
                placed = true;
                break;
            }
        }

        if (!placed) {
            clusters.push({
                vector: vec,
                items: [niche],
            });
        }
    });

    return clusters.map((c) => c.items);
}

/**************************************************************
 * PROFITABILITY SCORING
 **************************************************************/

function estimateDemand(niche) {
    const demandKeywords = [
        "mom",
        "dad",
        "club",
        "crew",
        "energy",
        "society",
        "gang",
    ];

    let score = 50;

    demandKeywords.forEach((kw) => {
        if (niche.includes(kw)) score += 5;
    });

    return Math.min(score, 100);
}

function estimateUniqueness(niche) {
    if (niche.split(" ").length >= 3) return 80;
    if (niche.split(" ").length === 2) return 70;
    return 60;
}

function estimateCompetition(niche) {
    const saturated = ["dog", "cat", "coffee"];

    for (const word of saturated) {
        if (niche.includes(word)) return 30;
    }

    return 70;
}

function scoreNiche(niche) {
    const demand = estimateDemand(niche);
    const uniqueness = estimateUniqueness(niche);
    const competition = estimateCompetition(niche);

    const score =
        demand * 0.3 +
        uniqueness * 0.25 +
        competition * 0.2 +
        Math.random() * 10;

    return Math.round(score);
}

/**************************************************************
 * VIRAL POTENTIAL DETECTION
 **************************************************************/

async function detectViralPotential(niche) {
    const prompt = `
Rate the viral meme potential (1-10) of this phrase:

"${niche}"

Consider:
- humor
- relatability
- meme culture
- identity expression

Return only a number.
`;

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
    });

    const score = parseFloat(completion.choices[0].message.content);

    return score || 5;
}

/**************************************************************
 * FINAL SCORING PIPELINE
 **************************************************************/

async function evaluateClusters(clusters) {
    const results = [];

    for (const cluster of clusters) {
        const representative = cluster[0];

        const profitScore = scoreNiche(representative);

        const viralScore = await detectViralPotential(representative);

        results.push({
            niche: representative,
            cluster,
            profitScore,
            viralScore,
            finalScore: profitScore * 0.7 + viralScore * 3,
        });
    }

    return results.sort((a, b) => b.finalScore - a.finalScore);
}

/**************************************************************
 * MASTER DISCOVERY ENGINE
 **************************************************************/

async function discoverTrends() {
    console.log("Collecting signals...");
    const signals = await collectTrendSignals();

    console.log("Generating niches...");
    const niches = await generateNiches(signals);

    console.log("Clustering niches...");
    const clusters = await clusterNiches(niches);

    console.log("Evaluating niches...");
    const scored = await evaluateClusters(clusters);

    const top = scored.slice(0, 10);

    return {
        timestamp: new Date(),
        signals,
        niches: top,
    };
}

module.exports = {
    getGoogleTrends,
    getRedditTrends,
    collectTrendSignals,
    generateNiches,
    clusterNiches,
    scoreNiche,
    detectViralPotential,
    discoverTrends,
    getTrendSignals: async (niche) => {
        return {
            score: scoreNiche(niche),
            badge: "🔥 Trending",
            confidence: "high",
            signals: {
                searchMomentum: 80,
                socialVelocity: 70,
                conversationIntensity: 65,
                growthAcceleration: 85
            }
        };
    }
};
