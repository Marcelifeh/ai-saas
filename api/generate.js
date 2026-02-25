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
  "researchDemandScore": 0,
  "researchCompetitionScore": 0,
  "trendScore": 0,
  "viralPotentialScore": 0,
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

        // Deterministic AI Scoring Engine
        const demand = parsed.researchDemandScore || 50;
        const competition = parsed.researchCompetitionScore || 50;
        const trend = parsed.trendScore || 50;
        const viral = parsed.viralPotentialScore || 50;
        const safety = parsed.safe !== false ? 100 : 30;

        const competitionInverse = 100 - competition;

        const finalScore =
            demand * 0.30 +
            competitionInverse * 0.25 +
            trend * 0.20 +
            viral * 0.15 +
            safety * 0.10;

        let decision = "TEST";
        if (finalScore >= 75) decision = "PUBLISH";
        else if (finalScore < 50) decision = "SKIP";

        const scoreData = {
            niche_score: Math.round(finalScore),
            decision,
            research_demand: demand,
            research_competition: competition,
            viral_potential: viral,
            trend_score: trend
        };

        const finalResult = {
            ...parsed,
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