const OpenAI = require("openai");
const { generateMarketSignals, scoreWithMarketIntel } = require("./utils/marketSignals");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "POST only" });
    }

    try {
        const { prompt, platform, audience, style } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, error: "Prompt missing" });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are an Amazon print-on-demand listing expert and design strategist.

Create a COMPLETE strategy and listing based on the idea below.

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
    "print-ready AI image prompt 1",
    "print-ready AI image prompt 2",
    "print-ready AI image prompt 3"
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
Each of the 3 imagePrompts must be a COMPLETE, STRUCTURED, production-grade POD prompt.
Use this EXACT multi-line format for each prompt string (vary the design concept between all 3):

"Create a print-ready t-shirt design.

Main focus:
[specific visual concept tied to the niche and audience]

Design style:
[one of: retro vintage / bold graphic / minimalist vector / hand-drawn / clean typographic]

Composition:
[centered / left-aligned / arched / stacked] layout, balanced spacing, strong readability at distance.

Typography:
[font pairing description, e.g. bold modern sans-serif headline with handwritten accent]

Color palette:
[2-3 specific muted or brand-appropriate color names], high contrast for black or white shirts.

Technical requirements:
Transparent background
Vector style illustration
300 DPI
No mockups
No shadows
No gradients that break print clarity
No extra text outside main design
Screen print safe
Designed for Amazon Merch on Demand"

Vary the visual concept, composition style, and color choices across all 3 prompts.
Keep each prompt 100-180 words. Embed the full structured text inside the JSON string value.

RULES FOR AMAZON LISTING:
TITLE:
- 60-80 characters
- Include main keyword + audience
- Natural language, not spammy

BULLETS:
- Benefit-driven
- Emotional + functional
- POD safe

DESCRIPTION:
- 2-3 sentences
- Who it's for, when to wear it, why it's unique

KEYWORDS:
- Search phrases buyers type
- No repetition

- No explanations outside JSON
- JSON only
`,
                },
                {
                    role: "user",
                    content: `Idea: ${prompt}${platform ? `\nPlatform: ${platform}` : ""}${audience ? `\nTarget Audience: ${audience}` : ""}${style ? `\nStyle/Tone: ${style}` : ""}`,
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

        const finalResult = {
            ...parsed,
            ...market,
            ...scoreData
        };

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