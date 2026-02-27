const OpenAI = require("openai");
const { generateMarketSignals, scoreWithMarketIntel } = require("./utils/marketSignals");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // STEP 1 — discover niches
        const discovery = await client.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You are a POD niche discovery engine. Always output valid JSON." },
                {
                    role: "user",
                    content: `
Find 3 profitable Amazon POD niches.
Return a JSON object with a single key "niches" containing an array of objects.

Fields per object:
niche (string)
targetAudience (string)
whyItSells (string)
emotionalTrigger (string)
safe (boolean, true if family friendly)
`
                }
            ]
        });

        const parsedDiscovery = JSON.parse(discovery.choices[0].message.content);
        const niches = parsedDiscovery.niches || [];
        const results = [];

        // STEP 2 — generate products from each niche
        for (const nicheData of niches) {
            const generation = await client.chat.completions.create({
                model: "gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: `You create Amazon POD shirt listings. Always output valid JSON in exactly this structure:
{
    "shirtSlogans": ["", "", "", ""],
    "designDirections": ["", ""],
    "amazonListing": {
        "title": "",
        "bulletPoint1": "",
        "bulletPoint2": "",
        "description": "",
        "keywords": ["", ""]
    }
}`
                    },
                    {
                        role: "user",
                        content: `Create a POD shirt concept for:

Niche: ${nicheData.niche}
Audience: ${nicheData.targetAudience}

Return valid JSON exactly as structured.`
                    }
                ]
            });

            let gen;
            try {
                gen = JSON.parse(generation.choices[0].message.content);
            } catch (err) {
                console.error("Failed to parse generation for niche", nicheData.niche);
                continue; // Skip this one if it fails, continue loop
            }

            const market = generateMarketSignals(nicheData.niche);
            const score = scoreWithMarketIntel(nicheData, market);

            results.push({
                niche: nicheData.niche,
                audience: nicheData.targetAudience,
                whyItSells: nicheData.whyItSells,
                safe: nicheData.safe,
                ...market,
                ...gen,
                ...score
            });
        }

        res.json({ success: true, products: results });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Bulk generation failed", details: err.message });
    }
};
