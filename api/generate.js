const OpenAI = require("openai");
const { generateMarketSignals, scoreWithMarketIntel } = require("./utils/marketSignals");
const { enforceCompliance } = require("./utils/complianceCheck");

// ─── Platform Auto-Detect ────────────────────────────────────────────────────
function detectPlatform(platformInput) {
    if (!platformInput) return "amazon";
    const p = platformInput.toLowerCase();
    if (p.includes("etsy")) return "etsy";
    if (p.includes("redbubble")) return "redbubble";
    if (p.includes("shopify") || p.includes("printify") || p.includes("printful")) return "shopify";
    if (p.includes("teespring") || p.includes("spring")) return "shopify";
    return "amazon"; // default
}

// ─── Platform Optimization Blocks ────────────────────────────────────────────
const PLATFORM_RULES = {
    amazon: `PLATFORM OPTIMIZATION — Amazon Merch on Demand:
Max print clarity at 4500x5400 ratio
Bold typography preferred for thumbnail legibility
Design visible and readable at small marketplace thumbnail size
High-contrast palette for dark garment performance`,

    etsy: `PLATFORM OPTIMIZATION — Etsy POD:
Handmade, artisanal aesthetic or strong niche personality emphasis
Giftable visual tone — design should feel personal and intentional
Artistic or boutique presentation preferred over mass-market generic look
Seasonal or evergreen niche visual cues`,

    redbubble: `PLATFORM OPTIMIZATION — Redbubble:
Art-forward, visually expressive composition
Works effectively on stickers, laptop cases, and apparel simultaneously
Strong silhouette that reads at small sizes
Illustrative or graphic art style preferred`,

    shopify: `PLATFORM OPTIMIZATION — eCommerce Storefront (Shopify / Printify / Printful):
Brandable, professional aesthetic suitable for a product catalogue
Clean layout adaptable to multiple product types (tee, hoodie, tote, mug)
Consistent with a cohesive brand identity
Suitable for paid traffic ad creative thumbnails`
};

// ─── Universal Prompt Base ────────────────────────────────────────────────────
function buildImagePrompt({ niche, audience, style, platform }) {
    const platformKey = detectPlatform(platform);
    const platformBlock = PLATFORM_RULES[platformKey];

    return `Create a commercial print-ready apparel design.

NICHE: ${niche}
TARGET AUDIENCE: ${audience || "general apparel buyer"}
DESIGN STYLE: ${style || "evergreen commercial"}

CORE CONCEPT:
A visually clear, high-conversion t-shirt design focused on strong readability, emotional appeal, and marketplace compliance.

COMPOSITION:
Centered design optimized for chest print area
Strong silhouette — balanced spacing — readable at distance
No clutter

GRAPHIC STYLE:
Clean vector illustration or typography-based design
Commercial evergreen style suitable for mass-market apparel

COLOR STRATEGY:
Print-safe color palette
High contrast for dark and light garments
Limited color count for production efficiency

PLATFORM PRODUCTION REQUIREMENTS:
Transparent background
Vector-style artwork
300 DPI minimum
No mockups — no background scenery — no photographic textures
No tiny details that disappear when printed
No trademarked content

COMMERCIAL OPTIMIZATION:
Designed for high click-through and readability in marketplace thumbnails
Emotionally resonant visual concept
Scalable across apparel types (t-shirt, hoodie, tote)

${platformBlock}

OUTPUT:
Single isolated design ready for upload to POD platforms`;
}

// ─── Handler ─────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "POST only" });
    }

    try {
        const { prompt, platform, audience, style } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, error: "Prompt missing" });
        }

        const detectedPlatform = detectPlatform(platform);

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  "imagePrompts": [
    "complete structured POD image prompt 1",
    "complete structured POD image prompt 2",
    "complete structured POD image prompt 3"
  ],
  "seoKeywords": {
    "primary": "",
    "longTail": [],
    "buyerIntent": [],
    "platformTags": []
  },
  "safe": true,
  "reasoning": "",
  "shirtSlogans": [],
  "amazonListing": {
    "title": "",
    "brandName": "",
    "bulletPoint1": "",
    "bulletPoint2": "",
    "description": "",
    "keywords": []
  }
}

RULES FOR IMAGE PROMPTS — CRITICAL:
Each of the 3 imagePrompts must be a COMPLETE production-grade POD prompt.
Use this EXACT format as a base, starting from the template provided in the user message.
Vary the visual concept, composition style, and color choices across all 3 prompts.
Each prompt should be 120-200 words. Vary: concept, composition, typography, and palette.
Embed the full structured text as the JSON string value (use \\n for newlines inside JSON strings).

RULES FOR AMAZON LISTING:
TITLE: 60-80 chars, main keyword + audience, natural language
BULLETS: benefit-driven, emotional + functional, POD safe
DESCRIPTION: 2-3 sentences — who it's for, when to wear it, why it's unique
KEYWORDS: search phrases buyers type, no repetition

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

Use this as the base template for all 3 imagePrompts (vary concept/composition/colors between them):

${imagePromptTemplate}`,
                },
            ],
            temperature: 0.8,
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

        // Deterministic AI Scoring Engine
        const market = generateMarketSignals(parsed.niche || prompt);
        const scoreData = scoreWithMarketIntel(parsed, market);

        const baseResult = {
            ...parsed,
            niche: parsed.niche || prompt,
            ...market,
            ...scoreData,
            detectedPlatform,
        };

        const finalResult = enforceCompliance(baseResult);

        res.status(200).json({
            success: true,
            data: finalResult,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};