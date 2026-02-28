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

        let content = aiResponse.choices[0].message.content.trim();

        // Robust JSON extraction: Find the first { and last }
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON found in AI response:", content);
            return res.status(500).json({
                success: false,
                error: "AI did not return a valid design structure",
                raw: content
            });
        }

        try {
            const result = JSON.parse(jsonMatch[0]);
            return res.json({
                success: true,
                prompt: result.prompt,
                fallback: false,
                error: null
            });
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Content:", jsonMatch[0]);
            return res.status(200).json({ // Return 200 even on AI failure to let client handle fallback gracefully
                success: false,
                prompt: null,
                fallback: true,
                error: "Failed to parse design instructions",
                action: "Use client-side fallback"
            });
        }

    } catch (error) {
        console.error("Prompt generation error:", error);
        return res.status(200).json({
            success: false,
            prompt: null,
            fallback: true,
            error: error.message || "Deep-link generation timed out",
            action: "Use client-side fallback"
        });
    }
};
