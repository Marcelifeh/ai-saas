const OpenAI = require("openai");
const { buildImagePrompt } = require("./utils/promptBuilder");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "POST only" });
    }

    try {
        const { slogan, niche, audience, style, platform } = req.body;

        if (!slogan || !niche) {
            return res.status(400).json({ success: false, error: "Slogan and niche missing" });
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const imagePromptTemplate = buildImagePrompt({ niche, audience, style, platform });

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a professional print-on-demand designer mapping a given slogan to a structured image prompt.
Return ONLY valid JSON with a single key "prompt" containing the structured prompt string.
Use the EXACT formatting from the template provided by the user.
Embed the full structured text as the JSON string value (use \\n for newlines inside JSON strings).
The prompt should be 120-200 words.
Ensure the design explicitly integrates this exact text: "${slogan}"`
                },
                {
                    role: "user",
                    content: `Slogan to feature: "${slogan}"
Niche: ${niche}
Target Audience: ${audience || "general apparel buyer"}
Style/Tone: ${style || "evergreen commercial"}

Use this template as the base for the structured prompt:

${imagePromptTemplate}
`
                }
            ],
            temperature: 0.8,
            max_tokens: 600
        });

        const result = JSON.parse(aiResponse.choices[0].message.content);
        return res.json({ success: true, prompt: result.prompt });

    } catch (error) {
        console.error("Error generating prompt:", error);
        return res.status(500).json({ success: false, error: "Prompt generation failed" });
    }
};
