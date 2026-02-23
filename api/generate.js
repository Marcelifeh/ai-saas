// api/generate.js
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed. Use POST." });
        return;
    }

    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim() === "") {
            res.status(400).json({ error: "Prompt is required in request body." });
            return;
        }

        // Call OpenAI API
        const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a creative T-shirt slogan generator. Return concise, high-converting slogans based on the user's prompt.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 500,
        });

        // Extract response text
        const text = completion.data.choices[0].message.content;

        // Optional: split into array if using bullet points or line breaks
        const slogans = text.split(/\r?\n/).filter((line) => line.trim() !== "");

        // Respond with structured JSON
        res.status(200).json({
            success: true,
            prompt: prompt,
            rawText: text,
            shirtSlogans: slogans,
        });
    } catch (error) {
        console.error("Generate API error:", error.message || error);
        res.status(500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};