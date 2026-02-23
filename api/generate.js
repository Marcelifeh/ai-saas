const OpenAI = require("openai");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "POST only" });
    }

    try {
        const { prompt } = req.body;

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
                    content: "Generate 10 short, catchy, shirt-ready slogans. Return them as a list, one per line.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const text = aiResponse.choices[0].message.content;

        const shirtSlogans = text
            .split("\n")
            .map(s => s.replace(/^\d+[\).\s-]*/, "").trim())
            .filter(Boolean);

        res.status(200).json({
            success: true,
            shirtSlogans,
        });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
};
