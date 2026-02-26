const OpenAI = require("openai");

function scoreDesign(intel) {
    const demand = intel.researchDemandScore || 50;
    const competition = intel.researchCompetitionScore || 50;
    const trend = intel.trendScore || 50;
    const viral = intel.viralPotentialScore || 50;
    const safety = intel.safe !== false ? 100 : 30;

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

    return {
        niche_score: Math.round(finalScore),
        decision,
        research_demand: demand,
        research_competition: competition,
        viral_potential: viral,
        trend_score: trend
    };
}

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
trendScore
researchDemandScore
researchCompetitionScore
viralPotentialScore
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

            const score = scoreDesign(nicheData);

            results.push({
                niche: nicheData.niche,
                audience: nicheData.targetAudience,
                whyItSells: nicheData.whyItSells,
                safe: nicheData.safe,
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
