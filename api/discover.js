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

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini", // Use gpt-4o-mini as the standard for this app
            messages: [
                {
                    role: "system",
                    content: `You are a POD market analyst.

Find 5 profitable print-on-demand niches that:
- have strong buyer identity
- are emotionally engaging
- are NOT oversaturated
- work well for Amazon Merch

For each niche return:

niche
targetAudience
whyItSells
emotionalTrigger
trendScore (0-100)
researchDemandScore (0-100)
researchCompetitionScore (0-100)
viralPotentialScore (0-100)
safe (true/false)

Return JSON array only. No markdown formatting or explanation.`
                },
                {
                    role: "user",
                    content: "Find 5 profitable Amazon POD niches. Return valid JSON array only."
                }
            ],
            temperature: 0.9,
        });

        let raw = completion.choices[0].message.content;

        // Clean up markdown markers if present
        if (raw.startsWith('```json')) {
            raw = raw.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (raw.startsWith('```')) {
            raw = raw.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        let niches;
        try {
            niches = JSON.parse(raw);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to parse AI JSON response", raw: raw });
        }

        const scored = niches.map(n => {
            const score = scoreDesign(n);
            return { ...n, ...score };
        });

        scored.sort((a, b) => b.niche_score - a.niche_score);

        res.json({ success: true, opportunities: scored });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Discovery failed", details: err.message });
    }
};
