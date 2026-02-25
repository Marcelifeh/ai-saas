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
You are an AI SaaS assistant for Print-on-Demand sellers.

Analyze the user's idea like a merch strategist.

First THINK silently about:
- audience
- emotional driver
- uniqueness
- market viability
- platform optimization

Score the niche based on:
- demand strength
- competition pressure
- emotional purchase power
- design simplicity
- platform fit

Scores must be 0–100.

Then output ONLY valid JSON in this structure:

{
  "niche": "",
  "whyItSells": "",
  "competitionLevel": "",
  "emotionalTrigger": "",
  "targetAudiences": [],
  "designDirections": [],
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
  "shirtSlogans": []
}

Rules:
- Generate 10 shirt-ready slogans
- Keywords must sound like natural search phrases
- Focus on real buyer search behavior
- Be realistic, not optimistic
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