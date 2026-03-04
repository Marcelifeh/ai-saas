const OpenAI = require("openai");
const { enforceUsage } = require("./utils/usageGuard");
const { generateMarketSignals, scoreWithMarketIntel } = require("./utils/marketSignals");
const { getTrendSignals } = require("./utils/trendEngine");
const { enforceCompliance } = require("./utils/complianceCheck");
const { getAiMetrics, setAiMetrics } = require("./utils/aiMetricCache");
const { calculateRevenue } = require("./utils/revenueModel");
const { requireAuth } = require("./utils/sessionManager");

module.exports = requireAuth(async function handler(req, res) {
    const { user } = req.platformContext;
    const userId = user.id;
    const guard = enforceUsage(userId, "trendAnalysis");

    if (!guard.allowed) {
        return res.status(403).json(guard);
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0, // Phase 36: locked for metric stability
            messages: [
                {
                    role: "system",
                    content: `You are a POD market analyst with deep knowledge of Amazon Merch on Demand.

Find 5 profitable print-on-demand niches that:
- have strong buyer identity
- are emotionally engaging
- are NOT oversaturated
- work well for Amazon Merch

For each niche return:

niche (string)
targetAudience (string)
whyItSells (string)
emotionalTrigger (string)
safe (true/false — family friendly)
estimatedDemandStrength (0-100 — your estimate of search/buyer demand)
estimatedCompetition (0-100 — 0=blue ocean, 100=extremely saturated)
estimatedTrend (0-100 — momentum right now: rising=70+, stable=40-69, cooling=below 40)
estimatedBuyerIntent (0-100 — how purchase-ready is the audience)

Return JSON array only. No markdown formatting or explanation.`
                },
                {
                    role: "user",
                    content: "Find 5 profitable Amazon POD niches. Return valid JSON array only."
                }
            ]
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
            return res.status(500).json({ error: "Failed to parse AI JSON response", raw });
        }

        const scored = await Promise.all(niches.map(async (n) => {
            // Phase 36: Check cache before re-computing AI metrics
            const cached = getAiMetrics(n.niche);
            let market, score;

            if (cached) {
                market = cached;
                const trend = await getTrendSignals(n.niche);
                score = scoreWithMarketIntel(n, market, trend);
            } else {
                // Extract AI-estimated signals from the discovery response
                const aiSignals = {
                    estimatedDemandStrength: n.estimatedDemandStrength,
                    estimatedCompetition: n.estimatedCompetition,
                    estimatedTrend: n.estimatedTrend,
                    estimatedBuyerIntent: n.estimatedBuyerIntent
                };

                const trend = await getTrendSignals(n.niche);
                market = generateMarketSignals(n.niche, trend, aiSignals);
                score = scoreWithMarketIntel(n, market, trend);

                // Cache the AI-estimated signals for 12 hours
                setAiMetrics(n.niche, market);
            }

            // Phase 37: Deterministic revenue (replace Math.random())
            const { projectedRevenue, revenueCategory } = calculateRevenue(n.niche, market.trendMomentum);

            const result = {
                ...n,
                ...market,
                ...score,
                projectedRevenue,
                revenueCategory,
                research_demand: market.searchVolume,
                research_competition: market.competitionDensity,
                trend_score: market.trendMomentum,
                metricsSource: score.metricsSource || market.metricsSource || 'simulated'
            };
            return enforceCompliance(result);
        }));

        scored.sort((a, b) => b.niche_score - a.niche_score);

        res.json({ success: true, usage: guard.usage, opportunities: scored });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Discovery failed", details: err.message });
    }
});

