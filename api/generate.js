const OpenAI = require("openai");
const { generateMarketSignals, scoreWithMarketIntel } = require("./utils/marketSignals");
const { enforceCompliance } = require("./utils/complianceCheck");

const { detectPlatform, buildImagePrompt } = require("./utils/promptBuilder");

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
  "seoKeywords": {
    "primary": "",
    "longTail": [],
    "buyerIntent": [],
    "platformTags": []
  },
  "safe": true,
  "reasoning": "",
  "shirtSlogans": [
    "slogan 1", "slogan 2", "slogan 3", "slogan 4", "slogan 5",
    "slogan 6", "slogan 7", "slogan 8", "slogan 9", "slogan 10"
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