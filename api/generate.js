const OpenAI = require("openai");
const { generateMarketSignals, scoreWithMarketIntel } = require("./utils/marketSignals");
const { enforceCompliance } = require("./utils/complianceCheck");
const { logRun } = require("./utils/performanceEngine");
const { detectPlatform, buildImagePrompt } = require("./utils/promptBuilder");
const { getTrendSignals } = require("./utils/trendEngine");
const { enforceUsage } = require("./utils/usageGuard");
const { getAiMetrics, setAiMetrics } = require("./utils/aiMetricCache");
const { calculateRevenue } = require("./utils/revenueModel");
const { requireAuth } = require("./utils/sessionManager");

// ─── Handler ─────────────────────────────────────────────────────────────────
module.exports = requireAuth(async function handler(req, res) {
    const { user } = req.platformContext;
    const userId = user.id;

    const guard = enforceUsage(userId, "generateStrategy");

    if (!guard.allowed) {
        return res.status(403).json(guard);
    }

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "POST only" });
    }

    try {
        const { prompt, platform, audience, style } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, error: "Prompt missing" });
        }

        const detectedPlatform = detectPlatform(platform);

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 55000 });

        // Build the structured image prompt template so GPT knows exactly what to produce
        const imagePromptTemplate = buildImagePrompt({
            niche: prompt,
            audience: audience || "",
            style: style || "evergreen commercial",
            platform
        });

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a cross-platform print-on-demand listing expert and commercial design strategist.

Create a COMPLETE strategy and listing for the idea below.

Score the niche based on:
- demand strength
- competition pressure
- emotional purchase power
- design simplicity
- platform fit (0-100)

Then output ONLY valid JSON in this structure:

{
  "niche": "",
  "whyItSells": "",
  "competitionLevel": "",
  "emotionalTrigger": "",
  "targetAudiences": [],
  "designDirections": [],
  "artStyles": [
    "style 1 (e.g. vintage distressed)",
    "style 2",
    "style 3"
  ],
  "seoKeywords": {
    "primary": "",
    "longTail": [],
    "buyerIntent": [],
    "platformTags": []
  },
  "safe": true,
  "reasoning": "",
  "estimatedDemandStrength": 0,
  "estimatedCompetition": 0,
  "estimatedTrend": 0,
  "estimatedBuyerIntent": 0,
  "shirtSlogans": [
    "slogan 1", "slogan 2", "slogan 3", "slogan 4", "slogan 5",
    "slogan 6", "slogan 7", "slogan 8", "slogan 9", "slogan 10"
  ],
  "imagePrompts": [
    "unique design prompt for slogan 1",
    "unique design prompt for slogan 2",
    "...",
    "unique design prompt for slogan 10"
  ],
  "amazonListing": {
    "title": "",
    "brandName": "",
    "bulletPoint1": "",
    "bulletPoint2": "",
    "description": "",
    "keywords": []
  }
}

RULES FOR AMAZON LISTING:
TITLE: 60-80 chars, main keyword + audience, natural language
BULLETS: benefit-driven, emotional + functional, POD safe
DESCRIPTION: 2-3 sentences — who it's for, when to wear it, why it's unique
IMAGE PROMPTS: Provide exactly 10 UNIQUE image prompts (one per slogan). Use EXACTLY this format for EVERY prompt:

Create an original POD t-shirt design.
Text: "[The exact slogan]"
Style: [STYLE] — [1-2 sentences of UNIQUE, niche-specific design description for THIS slogan: visual motifs, colors, symbols, textures, and composition that suit the slogan AND niche. Each must be distinct.]
No brands, logos, or trademarks.
Transparent background.
Commercial friendly.
300 DPI.

IMPORTANT: The literal token [STYLE] MUST appear at the start of the Style line. Do NOT replace it. Each prompt's design description must be UNIQUE to its slogan.
KEYWORD/SLOGANS: Provide exactly 10 catchy, commercial shirt slogans. Provide strong search keywords.

COMPLIANCE RULES — CRITICAL:
Do NOT include brand names, copyrighted characters, trademarked phrases, song lyrics, movie quotes, or celebrity references in any field.
Create only original, commercial-safe wording.
Avoid parody of any existing brand or product.
- No explanations outside JSON
- JSON only
`,
                },
                {
                    role: "user",
                    content: `Idea: ${prompt}${platform ? `\nPlatform: ${platform}` : ""}${audience ? `\nTarget Audience: ${audience}` : ""}${style ? `\nStyle/Tone: ${style}` : ""}


Use the user's details to populate the niches, audiences, and styles.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        const text = aiResponse.choices[0].message.content;

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: "AI did not return valid JSON",
                raw: text,
            });
        }

        // Phase 36 — AI-Grounded Metrics
        // Check cache first; if miss, use AI response's estimated signals
        const trend = await getTrendSignals(prompt);
        let market;
        const cached = getAiMetrics(prompt);
        if (cached) {
            market = cached;
        } else {
            const aiSignals = {
                estimatedDemandStrength: parsed.estimatedDemandStrength,
                estimatedCompetition: parsed.estimatedCompetition,
                estimatedTrend: parsed.estimatedTrend,
                estimatedBuyerIntent: parsed.estimatedBuyerIntent
            };
            market = generateMarketSignals(prompt, trend, aiSignals);
            setAiMetrics(prompt, market);
        }
        const scoreData = scoreWithMarketIntel(parsed, market, trend);

        // Phase 37 — Deterministic Revenue
        const { projectedRevenue, revenueCategory } = calculateRevenue(prompt, market.trendMomentum);

        const baseResult = {
            ...parsed,
            niche: parsed.niche || prompt,
            trend,
            projectedRevenue,
            revenueCategory,
            ...market,
            ...scoreData,
            metricsSource: scoreData.metricsSource || market.metricsSource || 'simulated',
            detectedPlatform,
            platform: detectedPlatform,
        };

        const finalResult = enforceCompliance(baseResult);
        logRun(finalResult);

        res.status(200).json({
            success: true,
            usage: guard.usage,
            data: finalResult,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});