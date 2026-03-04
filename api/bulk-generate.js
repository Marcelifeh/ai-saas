const OpenAI = require("openai");
const { generateMarketSignals, scoreWithMarketIntel } = require("./utils/marketSignals");
const { enforceCompliance } = require("./utils/complianceCheck");
const { logRun } = require("./utils/performanceEngine");
const { getTrendSignals } = require("./utils/trendEngine");
const { detectPlatform, buildImagePrompt } = require("./utils/promptBuilder");
const { enforceUsage } = require("./utils/usageGuard");
const { getAiMetrics, setAiMetrics } = require("./utils/aiMetricCache");
const { calculateRevenue } = require("./utils/revenueModel");
const { requireAuth } = require("./utils/sessionManager");

module.exports = requireAuth(async function handler(req, res) {
    const { user } = req.platformContext;
    const userId = user.id;
    const guard = enforceUsage(userId, "bulkFactoryRun");

    if (!guard.allowed) {
        return res.status(403).json(guard);
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // STEP 1 — discover niches
        const discovery = await client.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You are a POD niche discovery engine. Always output valid JSON." },
                {
                    role: "user",
                    content: `
Find 3 profitable Amazon POD niches.
Return a JSON object with a single key "niches" containing an array of objects.

Fields per object:
niche (string)
targetAudience (string)
whyItSells (string)
emotionalTrigger (string)
safe (boolean, true if family friendly)
estimatedDemandStrength (0-100 — your estimate of search/buyer demand strength)
estimatedCompetition (0-100 — 0=blue ocean, 100=extremely saturated)
estimatedTrend (0-100 — momentum: rising=70+, stable=40-69, cooling=below 40)
estimatedBuyerIntent (0-100 — how purchase-ready this audience is)
`
                }
            ]
        });

        const parsedDiscovery = JSON.parse(discovery.choices[0].message.content);
        const niches = parsedDiscovery.niches || [];
        const results = [];

        // STEP 2 — generate products from each niche
        for (const nicheData of niches) {
            // Fetch real-world trend signals (simulated layer with caching)
            const trend = await getTrendSignals(nicheData.niche);

            const generation = await client.chat.completions.create({
                model: "gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: `You create Amazon POD shirt listings. Always output valid JSON in exactly this structure:
{
    "shirtSlogans": ["", "", "", "", "", "", "", "", "", ""],
    "imagePrompts": ["", "", "", "", "", "", "", "", "", ""],
    "designDirections": ["", ""],
    "amazonListing": {
        "title": "",
        "bulletPoint1": "",
        "bulletPoint2": "",
        "description": "",
        "keywords": ["", ""]
    }
}

IMAGE PROMPT RULES:
Provide 10 UNIQUE image prompts (one per slogan).
Use EXACTLY this format for EVERY prompt:

Create an original POD t-shirt design.
Text: "[The exact slogan]"
Style: [STYLE] — [1-2 sentences of UNIQUE, niche-specific design description for THIS slogan: visual motifs, colors, symbols, textures, and composition. Each must be distinct.]
No brands, logos, or trademarks.
Transparent background.
Commercial friendly.
300 DPI.

IMPORTANT: The literal token [STYLE] MUST appear at the start of the Style line. Do NOT replace it.`
                    },
                    {
                        role: "user",
                        content: `Create a POD shirt concept for:

Niche: ${nicheData.niche}
Audience: ${nicheData.targetAudience}

Return valid JSON exactly as structured.`
                    }
                ]
            });

            let gen;
            try {
                gen = JSON.parse(generation.choices[0].message.content);
            } catch (err) {
                console.error("Failed to parse generation for niche", nicheData.niche);
                continue; // Skip this one if it fails, continue loop
            }

            // Phase 36 — AI-Grounded Metrics with cache
            const cachedMetrics = getAiMetrics(nicheData.niche);
            let market;
            if (cachedMetrics) {
                market = cachedMetrics;
            } else {
                const aiSignals = {
                    estimatedDemandStrength: nicheData.estimatedDemandStrength,
                    estimatedCompetition: nicheData.estimatedCompetition,
                    estimatedTrend: nicheData.estimatedTrend,
                    estimatedBuyerIntent: nicheData.estimatedBuyerIntent
                };
                market = generateMarketSignals(nicheData.niche, trend, aiSignals);
                setAiMetrics(nicheData.niche, market);
            }
            const score = scoreWithMarketIntel(nicheData, market, trend);

            // Phase 37 — Deterministic Revenue
            const { projectedRevenue, revenueCategory } = calculateRevenue(nicheData.niche, market.trendMomentum);

            let product = {
                niche: nicheData.niche,
                audience: nicheData.targetAudience,
                whyItSells: nicheData.whyItSells,
                safe: nicheData.safe,
                trend,
                projectedRevenue,
                revenueCategory,
                ...market,
                ...gen,
                ...score,
                metricsSource: score.metricsSource || market.metricsSource || 'simulated'
            };
            product = enforceCompliance(product);
            logRun(product);
            results.push(product);
        }

        // Sort: Decisions First (Publish > Test > Skip), then Priority Score (Trend-weighted)
        results.sort((a, b) => {
            const decValue = { "PUBLISH": 3, "TEST": 2, "SKIP": 1 };
            const decisionDiff = (decValue[b.decision] || 0) - (decValue[a.decision] || 0);
            if (decisionDiff !== 0) return decisionDiff;
            return (b.publishPriority || 0) - (a.publishPriority || 0);
        });

        res.json({ success: true, usage: guard.usage, products: results });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Bulk generation failed", details: err.message });
    }
});
