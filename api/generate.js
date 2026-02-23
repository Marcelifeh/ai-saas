// /api/generate.js
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
        const { audience, theme, style } = req.body || {};

        const userPrompt = `
You are a top print-on-demand merch strategist.

Audience: ${audience || "Invent a new profitable audience"}
Theme: ${theme || "Create a trending and untapped theme for shirts"}
Style: ${style || "Choose a style that fits the niche (funny, witty, inspirational, cute, etc.)"}

Goal: Discover a profitable T-shirt concept and generate 10 shirt-ready slogans.

Rules:
- Invent or refine an emerging niche if inputs are missing
- Include emotional triggers and competition estimate
- Suggest target audiences if not provided
- Provide 3 visual design directions (typography, layout, mood)
- Generate 10 short, readable, emotionally specific, merch-ready slogans
- Respond strictly in JSON format with the following keys:

{
  "niche": "",
  "whyItSells": "",
  "competitionLevel": "",
  "emotionalTrigger": "",
  "targetAudiences": ["", ""],
  "designDirections": ["", "", ""],
  "shirtSlogans": ["", "", "", "", "", "", "", "", "", ""]
}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a highly skilled POD merch strategist." },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.9,
            max_tokens: 1400,
        });

        const textOutput = completion.choices[0].message.content;

        // Try to parse JSON (model is instructed to return valid JSON)
        let jsonOutput;
        try {
            jsonOutput = JSON.parse(textOutput);
        } catch (parseErr) {
            // fallback if model returns invalid JSON
            console.warn("JSON parse failed, returning raw text");
            jsonOutput = { raw: textOutput };
        }

        res.status(200).json({ result: jsonOutput });
    } catch (err) {
        console.error("Error in /api/generate:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};