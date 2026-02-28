const OpenAI = require("openai");
const { generateMarketSignals, scoreWithMarketIntel } = require("./utils/marketSignals");
const { enforceCompliance } = require("./utils/complianceCheck");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const start = Date.now();

    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // STEP 1 — discover niches
        const discovery = await client.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You discover profitable POD niches. Always output valid JSON." },
                {
                    role: "user",
                    content: `
Find 5 profitable Amazon POD niches.
Return a JSON object with a single key "niches" containing an array of objects.

Object Fields:
niche (string)
targetAudience (string)
whyItSells (string)
emotionalTrigger (string)
trendScore (number 1-100)
researchDemandScore (number 1-100)
researchCompetitionScore (number 1-100)
viralPotentialScore (number 1-100)
safe (boolean, true if family friendly)
`
                }
            ]
        });

        const parsedDiscovery = JSON.parse(discovery.choices[0].message.content);
        const niches = parsedDiscovery.niches || [];

        const products = [];

        // STEP 2 — generate multiple products per niche
        for (const nicheData of niches) {
            // Generate 2 products per niche to stay within 60s vercel hobby limit, adjust later if requested
            for (let i = 0; i < 2; i++) {

                const generation = await client.chat.completions.create({
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: "You create Amazon POD listings. Always output valid JSON." },
                        {
                            role: "user",
                            content: `
Create a listing for this POD niche: ${nicheData.niche}
Target Audience: ${nicheData.targetAudience}

Return JSON with these exact fields:
slogan (string, 1 catchy phrase for the shirt design)
title (string, Amazon optimized title, 150 chars max)
bullet_point_1 (string, 250 chars max)
bullet_point_2 (string, 250 chars max)
description (string)
`
                        }
                    ]
                });

                const design = JSON.parse(generation.choices[0].message.content);
                const market = generateMarketSignals(nicheData.niche);
                const score = scoreWithMarketIntel(nicheData, market);

                let product = {
                    niche: nicheData.niche,
                    slogan: design.slogan,
                    title: design.title,
                    bullet_point_1: design.bullet_point_1,
                    bullet_point_2: design.bullet_point_2,
                    description: design.description,
                    ...market,
                    ...score
                };
                product = enforceCompliance(product);
                products.push(product);
            }
        }

        // STEP 3 - generate run summary
        const runSummary = {
            productsGenerated: products.length,
            publishCount: products.filter(p => p.decision === 'PUBLISH').length,
            testCount: products.filter(p => p.decision === 'TEST').length,
            skipCount: products.filter(p => p.decision === 'SKIP').length,
            runTimeSeconds: Math.round((Date.now() - start) / 1000)
        };

        // Sort to show publish products first
        products.sort((a, b) => {
            const value = { "PUBLISH": 3, "TEST": 2, "SKIP": 1 };
            return (value[b.decision] || 0) - (value[a.decision] || 0) || (b.niche_score - a.niche_score);
        });

        res.status(200).json({
            runSummary,
            products
        });

    } catch (error) {
        console.error("Autopilot Error:", error);
        res.status(500).json({ error: "Autopilot processing failed: " + error.message });
    }
};
