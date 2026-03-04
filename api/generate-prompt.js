const OpenAI = require("openai");
const { buildImagePrompt } = require("./utils/promptBuilder");
const { enforceUsage } = require("./utils/usageGuard");
const { requireAuth } = require("./utils/sessionManager");

module.exports = requireAuth(async function handler(req, res) {
    const { user } = req.platformContext;
    const userId = user.id;
    const guard = enforceUsage(userId, "generatePrompt");

    if (!guard.allowed) {
        return res.status(403).json(guard);
    }

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
                    content: `You are a professional POD t-shirt design prompt writer.
Return ONLY valid JSON with a single key "prompt".
Use EXACTLY this format:

Create an original POD t-shirt design.
Text: "[The exact slogan]"
Style: [STYLE] — [1-2 sentences of vivid, niche-specific design description: visual motifs, color palette, symbols, textures, and composition that suit both the slogan and niche.]
No brands, logos, or trademarks.
Transparent background.
Commercial friendly.
300 DPI.

IMPORTANT: The literal token [STYLE] MUST appear at the start of the Style line. Do NOT replace it.`
                },
                {
                    role: "user",
                    content: `Create the image prompt for this slogan: "${slogan}" (Niche: ${niche})`
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
                usage: guard.usage,
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
});
