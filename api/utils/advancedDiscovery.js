/**
 * Advanced Discovery Engine — Phase 36 Upgrade
 *
 * Pipeline: expand → prune → AI batch evaluate → score locally → cache
 *
 * Replaces hash-based simulation with a single AI batch call per niche.
 * Uses aiMetricCache to prevent redundant calls (12hr TTL).
 *
 * metricsSource: 'ai_estimated' | 'simulated' (fallback)
 */

const OpenAI = require('openai');
const { expandKeywords } = require('./keywordExpansion');
const { scoreKeyword } = require('./keywordScoring');
const { getAiMetrics, setAiMetrics } = require('./aiMetricCache');

// ─── Prune: priority sort before sending to AI ────────────────────────────────
// Intent priority order: purchase > gift > humor > identity > trend-driven
const INTENT_PRIORITY = { purchase: 5, gift: 4, humor: 3, identity: 2, 'trend-driven': 1 };

function getIntentType(keyword) {
    const k = keyword.toLowerCase();
    if (k.includes('shirt') || k.includes('hoodie') || k.includes('merch') || k.includes('apparel')) return 'purchase';
    if (k.includes('gift') || k.includes('present')) return 'gift';
    if (k.includes('funny') || k.includes('sarcastic')) return 'humor';
    if (k.includes('aesthetic') || k.includes('minimalist') || k.includes('vintage') || k.includes('retro')) return 'identity';
    return 'trend-driven';
}

function pruneKeywords(keywords, limit = 15) {
    return keywords
        .map(k => ({ keyword: k, intentType: getIntentType(k), priority: INTENT_PRIORITY[getIntentType(k)] || 0 }))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, limit)
        .map(k => k.keyword);
}

// ─── AI Batch Evaluation ───────────────────────────────────────────────────────
async function batchEvaluateKeywords(keywords, niche) {
    const cacheKey = `adv:${niche}`;
    const cached = getAiMetrics(cacheKey);
    if (cached && cached.keywords) return cached.keywords;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30000 });

    const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0, // locked for stability
        max_tokens: 1200,
        messages: [
            {
                role: 'system',
                content: `You are a print-on-demand market analyst with expertise in Amazon Merch on Demand.
Evaluate the following keywords for a POD seller and return ONLY valid JSON.
For each keyword estimate (0-100 integers):
- estimatedDemand: search/buyer demand strength
- estimatedCompetition: market saturation (0=blue ocean, 100=saturated)
- estimatedBuyerIntent: purchase readiness of audience
- estimatedTrend: momentum right now (70+=rising, 40-69=stable, <40=cooling)
Return a JSON array of objects with fields: keyword, estimatedDemand, estimatedCompetition, estimatedBuyerIntent, estimatedTrend`
            },
            {
                role: 'user',
                content: `Niche context: "${niche}"\n\nKeywords to evaluate:\n${keywords.map((k, i) => `${i + 1}. ${k}`).join('\n')}\n\nReturn JSON array only.`
            }
        ]
    });

    let raw = completion.choices[0].message.content.trim();
    if (raw.startsWith('```')) raw = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

    const evaluated = JSON.parse(raw);

    // Cache the AI batch result
    setAiMetrics(cacheKey, { keywords: evaluated });

    return evaluated;
}

// ─── Main Orchestrator ─────────────────────────────────────────────────────────
async function discoverHighPotentialKeywords(niche) {
    // 1. Expand
    const allKeywords = expandKeywords(niche);

    // 2. Prune: top 15 by intent priority before AI call
    const pruned = pruneKeywords(allKeywords, 15);

    let evaluated;
    let metricsSource = 'ai_estimated';

    try {
        // 3. AI Batch Evaluate (single call for all 15 keywords)
        evaluated = await batchEvaluateKeywords(pruned, niche);
    } catch (err) {
        console.warn('[advancedDiscovery] AI batch failed, falling back to simulation:', err.message);
        // Fallback to simulated signals
        metricsSource = 'simulated';
        evaluated = pruned.map(keyword => ({
            keyword,
            estimatedDemand: simHash(keyword, 1.5, 20),
            estimatedCompetition: simHash(keyword, 0.8, 10),
            estimatedBuyerIntent: 50,
            estimatedTrend: simHash(keyword, 1.1, 15)
        }));
    }

    // 4. Score locally using AI-provided signals + trademark risk check
    const scored = evaluated.map(item => {
        const intentType = getIntentType(item.keyword);
        const signals = {
            keyword: item.keyword,
            demandScore: clamp(item.estimatedDemand),
            competitionScore: clamp(item.estimatedCompetition),
            trendScore: clamp(item.estimatedTrend),
            buyerIntentScore: clamp(item.estimatedBuyerIntent),
            intentType
        };

        // Trademark risk check (still rule-based — keeps real compliance layer)
        const { opportunityScore, riskScore, riskLevel } = scoreKeyword(signals);

        return {
            keyword: item.keyword,
            opportunityScore,
            demandScore: signals.demandScore,
            trendScore: signals.trendScore,
            competitionScore: signals.competitionScore,
            buyerIntentScore: signals.buyerIntentScore,
            intentType,
            riskScore,
            riskLevel,
            metricsSource
        };
    });

    // 5. Rank by opportunity score (descending), return top 10
    return scored
        .sort((a, b) => b.opportunityScore - a.opportunityScore)
        .slice(0, 10);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clamp(n) {
    return Math.max(5, Math.min(95, Math.round(Number(n) || 50)));
}

function simHash(str, multiplier, offset) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return clamp(Math.abs(hash % 100) * multiplier + offset);
}

module.exports = { discoverHighPotentialKeywords };
