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
            model: "gpt-4o-mini", // Standardizing on gpt-4o-mini
            messages: [
                { role: "system", content: "You are a POD niche discovery engine." },
                {
                    role: "user",
                    content: `
Find 3 profitable Amazon POD niches.
Return JSON array only.

Fields:
niche
targetAudience
whyItSells
emotionalTrigger
safe
`
                }
            ]
        });

        let rawDiscovery = discovery.choices[0].message.content;
        if (rawDiscovery.startsWith('```json')) rawDiscovery = rawDiscovery.replace(/^```json\n/, '').replace(/\n```$/, '');
        else if (rawDiscovery.startsWith('```')) rawDiscovery = rawDiscovery.replace(/^```\n/, '').replace(/\n```$/, '');

        const niches = JSON.parse(rawDiscovery);
        const results = [];

        // STEP 2 — generate products from each niche
        for (const nicheData of niches) {
            const generation = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You create Amazon POD shirt listings.

Return exactly this JSON object structure (no markdown):
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
                        content: `
Create a POD shirt concept for:

Niche: ${nicheData.niche}
Audience: ${nicheData.targetAudience}

Return valid JSON exactly as structured.`
                    }
                ]
            });

            let rawGen = generation.choices[0].message.content;
            if (rawGen.startsWith('```json')) rawGen = rawGen.replace(/^```json\n/, '').replace(/\n```$/, '');
            else if (rawGen.startsWith('```')) rawGen = rawGen.replace(/^```\n/, '').replace(/\n```$/, '');

            let gen;
            try {
                gen = JSON.parse(rawGen);
            } catch (err) {
                console.error("Failed to parse generation for niche", nicheData.niche, rawGen);
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
