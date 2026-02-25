const OpenAI = require("openai");

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
  "nicheScore": {
    "overall": 0,
    "demand": 0,
    "competition": 0,
    "emotionalPower": 0,
    "designSimplicity": 0,
    "platformFit": 0,
    "reasoning": ""
  },
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

RULES FOR IMAGE PROMPTS:
- Minimalist and printable
- Avoid tiny details
- Focused on centered composition
- Mention "transparent background" and "print-ready t-shirt design"

RULES FOR AMAZON LISTING:
TITLE:
- 60–80 characters
- Include main keyword + audience
- Natural language, not spammy

BULLETS:
- Benefit-driven
- Emotional + functional
- POD safe

DESCRIPTION:
- 2–3 sentences
- Who it’s for
- When to wear it
- Why it’s unique

KEYWORDS:
- Search phrases buyers type
- No repetition

- No explanations
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

        res.status(200).json({
            success: true,
            data: parsed,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};