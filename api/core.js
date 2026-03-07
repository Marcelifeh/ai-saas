/**
 * Core Router — Vercel Hobby Consolidation
 * Covers: /api/discover, /api/generate, /api/bulk-generate,
 *         /api/generate-prompt, /api/discover-advanced,
 *         /api/autopilot, /api/usage
 */

const OpenAI = require('openai');
const { requireAuth } = require('./utils/sessionManager');
const { enforceUsage } = require('./utils/usageGuard');
const { enforceCompliance } = require('./utils/complianceCheck');
const { logRun } = require('./utils/performanceEngine');
const { getTrendSignals, discoverTrends } = require('./utils/trendEngine');
const { generateMarketSignals, scoreWithMarketIntel } = require('./utils/marketSignals');
const { detectPlatform, buildImagePrompt } = require('./utils/promptBuilder');
const { getAiMetrics, setAiMetrics } = require('./utils/aiMetricCache');
const { calculateRevenue } = require('./utils/revenueModel');
const { discoverHighPotentialKeywords } = require('./utils/advancedDiscovery');
const { getUserWorkspace } = require('./utils/userWorkspace');
const { getWorkspace } = require('./utils/workspaceStore');
const { PLANS } = require('./utils/plans');
const { getDynamicContext } = require('./utils/trendContext');

let openaiInstance = null;
function getClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY environment variable. API requests cannot proceed.");
    }
    if (!openaiInstance) {
        openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 55000 });
    }
    return openaiInstance;
}

async function safeCompletion(params) {
    try {
        const client = getClient();
        return await client.chat.completions.create(params);
    } catch (err) {
        console.error("LLM Generation failure in core:", err);
        return { error: true, message: err.message || "LLM temporarily unavailable" };
    }
}

// ─── Route Dispatcher ─────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
    const url = (req.url || '').split('?')[0];

    if (url === '/api/discover') return requireAuth(handleDiscover)(req, res);
    if (url === '/api/generate') return requireAuth(handleGenerate)(req, res);
    if (url === '/api/bulk-generate') return requireAuth(handleBulkGenerate)(req, res);
    if (url === '/api/generate-chunk') return requireAuth(handleGenerateChunk)(req, res);
    if (url === '/api/generate-prompt') return requireAuth(handleGeneratePrompt)(req, res);
    if (url === '/api/discover-advanced') return requireAuth(handleDiscoverAdvanced)(req, res);
    if (url === '/api/autopilot') return requireAuth(handleAutopilot)(req, res);
    if (url === '/api/usage') return requireAuth(handleUsage)(req, res);

    return res.status(404).json({ error: 'Not found' });
};

// ─── /api/discover ────────────────────────────────────────────────────────────
async function handleDiscover(req, res) {
    const { user } = req.platformContext;
    const guard = enforceUsage(user.id, 'trendAnalysis');
    if (!guard.allowed) return res.status(403).json(guard);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // 1. Run V2 Trend Engine (Google Trends + Reddit + Clustering + Scoring)
        const discoveryResult = await discoverTrends();
        const top5 = discoveryResult.niches.slice(0, 5); // Take top 5 to keep frontend fast

        // 2. Enrich the phrases with expected frontend metadata via a single fast LLM call
        const enrichment = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: 'You are a POD analyst. Return a JSON object with a key "enriched" containing an array of objects corresponding exactly to the niches provided.' },
                { role: 'user', content: `Enrich these 5 print-on-demand niches with additional metadata.\n\nNiches: ${top5.map(n => n.niche).join(', ')}\n\nFor each niche, return an object in the 'enriched' array with these exact string keys:\n- targetAudience (who buys this)\n- whyItSells (the psychological reason)\n- emotionalTrigger (e.g. 'Humor', 'Identity', 'Nostalgia')\n- safe (boolean true/false for family-friendly)` }
            ]
        });

        const raw = enrichment.choices[0].message.content;
        let enrichedData = [];
        try { enrichedData = JSON.parse(raw).enriched || []; }
        catch (err) { console.error("Enrichment mapping failed:", err); }

        // 3. Map into the existing frontend opportunity schema
        const scored = await Promise.all(top5.map(async (n, i) => {
            const extra = enrichedData[i] || { targetAudience: 'Broad Audience', whyItSells: 'Strong cultural relevance', emotionalTrigger: 'Identity Expression', safe: true };

            const trend = await getTrendSignals(n.niche);
            let market = getAiMetrics(n.niche);
            if (!market) {
                market = generateMarketSignals(n.niche, trend);
                setAiMetrics(n.niche, market);
            }

            const score = scoreWithMarketIntel({ ...n, ...extra }, market, trend);
            const { projectedRevenue, revenueCategory } = calculateRevenue(n.niche, market.trendMomentum);

            const result = {
                niche: n.niche,
                audience: extra.targetAudience,
                whyItSells: extra.whyItSells,
                emotionalTrigger: extra.emotionalTrigger,
                safe: extra.safe,
                projectedRevenue,
                revenueCategory,
                research_demand: market.searchVolume,
                research_competition: market.competitionDensity,
                trend_score: market.trendMomentum,
                // Override static score with dynamic V2 profitScore
                niche_score: n.finalScore,
                metricsSource: 'trend-engine-v2'
            };
            return enforceCompliance(result);
        }));

        scored.sort((a, b) => b.niche_score - a.niche_score);
        return res.json({ success: true, usage: guard.usage, opportunities: scored, signals: discoveryResult.signals });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Discovery failed', details: err.message });
    }
}

// ─── /api/generate ────────────────────────────────────────────────────────────
async function handleGenerate(req, res) {
    const { user } = req.platformContext;
    const guard = enforceUsage(user.id, 'generateStrategy');
    if (!guard.allowed) return res.status(403).json(guard);
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });

    try {
        const { prompt, platform, audience, style } = req.body;
        if (!prompt) return res.status(400).json({ success: false, error: 'Prompt missing' });

        const detectedPlatform = detectPlatform(platform);

        const aiResponse = await safeCompletion({
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 4000,
            messages: [
                {
                    role: 'system',
                    content: `
You are a cross-platform print-on-demand listing expert and commercial design strategist.

Create a COMPLETE strategy and listing for the idea below.

Score the niche based on:
- demand strength
- competition pressure
- emotional purchase power
- design simplicity
- platform fit (0-100)

Then output ONLY valid JSON in this structure:

{
  "niche": "",
  "whyItSells": "",
  "competitionLevel": "",
  "emotionalTrigger": "",
  "targetAudiences": [],
  "designDirections": [],
  "artStyles": ["style 1 (e.g. vintage distressed)", "style 2", "style 3"],
  "seoKeywords": { "primary": "", "longTail": [], "buyerIntent": [], "platformTags": [] },
  "safe": true,
  "reasoning": "",
  "estimatedDemandStrength": 0,
  "estimatedCompetition": 0,
  "estimatedTrend": 0,
  "estimatedBuyerIntent": 0,
  "shirtSlogans": ["slogan 1","slogan 2","slogan 3","slogan 4","slogan 5","slogan 6","slogan 7","slogan 8","slogan 9","slogan 10"],
  "imagePrompts": ["unique design prompt for slogan 1","unique design prompt for slogan 2","...","unique design prompt for slogan 10"],
  "amazonListing": { "title": "", "brandName": "", "bulletPoint1": "", "bulletPoint2": "", "description": "", "keywords": [] }
}

RULES FOR AMAZON LISTING:
TITLE: 60-80 chars, main keyword + audience, natural language
BULLETS: benefit-driven, emotional + functional, POD safe
DESCRIPTION: 2-3 sentences — who it's for, when to wear it, why it's unique
IMAGE PROMPTS: Provide exactly 10 UNIQUE image prompts (one per slogan). Use EXACTLY this format for EVERY prompt:

Create an original POD t-shirt design.
Text: "[The exact slogan]"
Style: [STYLE] — [1-2 sentences of UNIQUE, niche-specific design description for THIS slogan: visual motifs, colors, symbols, textures, and composition that suit the slogan AND niche. Each must be distinct.]
No brands, logos, or trademarks.
Transparent background.
Commercial friendly.
300 DPI.

IMPORTANT: The literal token [STYLE] MUST appear at the start of the Style line. Do NOT replace it. Each prompt's design description must be UNIQUE to its slogan.
KEYWORD/SLOGANS: Provide exactly 10 catchy, commercial shirt slogans. Provide strong search keywords.

COMPLIANCE RULES — CRITICAL:
Do NOT include brand names, copyrighted characters, trademarked phrases, song lyrics, movie quotes, or celebrity references in any field.
Create only original, commercial-safe wording.
Avoid parody of any existing brand or product.
- No explanations outside JSON
- JSON only
`
                },
                {
                    role: 'user',
                    content: `Idea: ${prompt}${platform ? `\nPlatform: ${platform}` : ''}${audience ? `\nTarget Audience: ${audience}` : ''}${style ? `\nStyle/Tone: ${style}` : ''}\n\nUse the user's details to populate the niches, audiences, and styles.`
                }
            ]
        });

        if (aiResponse.error) {
            return res.status(503).json({ success: false, error: 'AI generation service unavailable', action: 'Please try again momentarily' });
        }

        const text = aiResponse.choices[0].message.content;
        let parsed;
        try { parsed = JSON.parse(text); }
        catch (err) { return res.status(500).json({ success: false, error: 'AI did not return valid JSON', raw: text }); }

        const trend = await getTrendSignals(prompt);
        let market;
        const cached = getAiMetrics(prompt);
        if (cached) {
            market = cached;
        } else {
            const aiSignals = {
                estimatedDemandStrength: parsed.estimatedDemandStrength,
                estimatedCompetition: parsed.estimatedCompetition,
                estimatedTrend: parsed.estimatedTrend,
                estimatedBuyerIntent: parsed.estimatedBuyerIntent
            };
            market = generateMarketSignals(prompt, trend, aiSignals);
            setAiMetrics(prompt, market);
        }
        const scoreData = scoreWithMarketIntel(parsed, market, trend);
        const { projectedRevenue, revenueCategory } = calculateRevenue(prompt, market.trendMomentum);

        const baseResult = {
            ...parsed,
            niche: parsed.niche || prompt,
            trend, projectedRevenue, revenueCategory, ...market, ...scoreData,
            metricsSource: scoreData.metricsSource || market.metricsSource || 'simulated',
            detectedPlatform, platform: detectedPlatform
        };
        const finalResult = enforceCompliance(baseResult);
        logRun(finalResult);

        return res.status(200).json({ success: true, usage: guard.usage, data: finalResult });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

// ─── /api/bulk-generate ───────────────────────────────────────────────────────
async function handleBulkGenerate(req, res) {
    const { user } = req.platformContext;
    const guard = enforceUsage(user.id, 'bulkGenerate');
    if (!guard.allowed) return res.status(403).json(guard);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const discoveryResult = await discoverTrends();
        // Return top 15 niches with expected fallback fields for frontend chunking
        const niches = discoveryResult.niches.slice(0, 15).map(n => ({
            niche: n.niche,
            targetAudience: 'Broad Audience',
            whyItSells: 'High cultural momentum',
            safe: true,
            finalScore: n.finalScore
        }));

        return res.json({ success: true, usage: guard.usage, niches });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Bulk discovery failed', details: err.message });
    }
}

// ─── /api/generate-chunk ──────────────────────────────────────────────────────
async function handleGenerateChunk(req, res) {
    const { user } = req.platformContext;
    const guard = enforceUsage(user.id, 'bulkGenerate'); // Use bulk token pool
    if (!guard.allowed) return res.status(403).json(guard);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { niches, isAutopilot } = req.body;
        if (!niches || !Array.isArray(niches)) return res.status(400).json({ error: 'Niches array required' });

        const results = await Promise.all(niches.map(async (nicheData) => {
            try {
                const trend = await getTrendSignals(nicheData.niche);

                const generation = await safeCompletion({
                    model: 'gpt-4o-mini',
                    response_format: { type: 'json_object' },
                    messages: [
                        {
                            role: 'system',
                            content: isAutopilot
                                ? 'You create Amazon POD listings. Always output valid JSON exactly: { "slogan": "", "title": "", "bullet_point_1": "", "bullet_point_2": "", "description": "" }'
                                : `You create Amazon POD shirt listings. Always output valid JSON in exactly this structure:\n{\n    "shirtSlogans": ["", "", "", "", "", "", "", "", "", ""],\n    "imagePrompts": ["", "", "", "", "", "", "", "", "", ""],\n    "designDirections": ["", ""],\n    "amazonListing": { "title": "", "bulletPoint1": "", "bulletPoint2": "", "description": "", "keywords": ["", ""] }\n}\n\nIMAGE PROMPT RULES:\nProvide 10 UNIQUE image prompts (one per slogan). Use EXACTLY this format for EVERY prompt:\nCreate an original POD t-shirt design.\nText: "[The exact slogan]"\nStyle: [STYLE] — [1-2 sentences of UNIQUE, niche-specific design description for THIS slogan.]\nNo brands, logos, or trademarks.\nTransparent background.\nCommercial friendly.\n300 DPI.\nIMPORTANT: The literal token [STYLE] MUST appear at the start of the Style line. Do NOT replace it.`
                        },
                        {
                            role: 'user',
                            content: isAutopilot
                                ? `Create a listing for this POD niche: ${nicheData.niche}\nTarget Audience: ${nicheData.targetAudience || 'Broad'}\n\nOutput only JSON.`
                                : `Create a POD shirt concept for:\n\nNiche: ${nicheData.niche}\nAudience: ${nicheData.targetAudience || 'Broad'}\n\nReturn valid JSON exactly as structured.`
                        }
                    ]
                });

                if (generation.error) return null;

                let gen;
                try { gen = JSON.parse(generation.choices[0].message.content); }
                catch (err) { console.error('Failed to parse chunk generation for niche', nicheData.niche); return null; }

                let market = getAiMetrics(nicheData.niche);
                if (!market) {
                    market = generateMarketSignals(nicheData.niche, trend);
                    setAiMetrics(nicheData.niche, market);
                }
                const score = scoreWithMarketIntel(nicheData, market, trend);

                let product;
                if (isAutopilot) {
                    const rawRevenue = Math.floor(Math.random() * (1200 - 300) + 300);
                    const momentumBoost = 1 + Math.pow(trend.score / 100, 1.4);
                    const projectedRevenue = Math.round(rawRevenue * momentumBoost);
                    product = {
                        niche: nicheData.niche, slogan: gen.slogan, title: gen.title,
                        bullet_point_1: gen.bullet_point_1, bullet_point_2: gen.bullet_point_2,
                        description: gen.description, trend, projectedRevenue, ...market, ...score
                    };
                } else {
                    const { projectedRevenue, revenueCategory } = calculateRevenue(nicheData.niche, market.trendMomentum);
                    product = {
                        niche: nicheData.niche, audience: nicheData.targetAudience, whyItSells: nicheData.whyItSells,
                        safe: nicheData.safe, trend, projectedRevenue, revenueCategory, ...market, ...gen, ...score,
                        metricsSource: score.metricsSource || market.metricsSource || 'simulated'
                    };
                }

                return enforceCompliance(product);
            } catch (err) {
                console.error("Error generating product for", nicheData.niche, err);
                return null;
            }
        }));

        let validResults = results.filter(Boolean);
        validResults.forEach(p => logRun(p));

        return res.json({ success: true, usage: guard.usage, products: validResults });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Chunk generation failed', details: err.message });
    }
}

// ─── /api/generate-prompt ─────────────────────────────────────────────────────
async function handleGeneratePrompt(req, res) {
    const { user } = req.platformContext;
    const guard = enforceUsage(user.id, 'generatePrompt');
    if (!guard.allowed) return res.status(403).json(guard);
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });

    try {
        const { slogan, niche, audience, style, platform } = req.body;
        if (!slogan || !niche) return res.status(400).json({ success: false, error: 'Slogan and niche missing' });

        const aiResponse = await safeCompletion({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            temperature: 0.8,
            max_tokens: 600,
            messages: [
                {
                    role: 'system',
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
                { role: 'user', content: `Create the image prompt for this slogan: "${slogan}" (Niche: ${niche})` }
            ]
        });

        if (aiResponse.error) {
            return res.status(200).json({ success: false, prompt: null, fallback: true, error: 'AI unavailable', action: 'Use client-side fallback' });
        }

        let content = aiResponse.choices[0].message.content.trim();
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({ success: false, error: 'AI did not return a valid design structure', raw: content });
        }

        try {
            const result = JSON.parse(jsonMatch[0]);
            return res.json({ success: true, usage: guard.usage, prompt: result.prompt, fallback: false, error: null });
        } catch (parseError) {
            return res.status(200).json({ success: false, prompt: null, fallback: true, error: 'Failed to parse design instructions', action: 'Use client-side fallback' });
        }

    } catch (error) {
        console.error('Prompt generation error:', error);
        return res.status(200).json({ success: false, prompt: null, fallback: true, error: error.message || 'Deep-link generation timed out', action: 'Use client-side fallback' });
    }
}

// ─── /api/discover-advanced ───────────────────────────────────────────────────
async function handleDiscoverAdvanced(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { niche } = req.body;
        if (!niche) return res.status(400).json({ error: 'Missing niche', action: 'Provide a niche to analyze' });

        const { user } = req.platformContext;
        const guard = enforceUsage(user.id, 'advancedDiscovery');
        if (!guard.allowed) return res.status(403).json(guard);

        const results = await discoverHighPotentialKeywords(niche);

        return res.status(200).json({
            success: true, niche, topKeywords: results,
            metricsSource: results[0]?.metricsSource || 'simulated',
            workspaceCreditsRemaining: guard.usage.creditsRemaining,
            usage: guard.usage
        });
    } catch (e) {
        console.error('Advanced Discovery Error:', e);
        return res.status(500).json({ error: 'Failed to run advanced discovery', details: e.message });
    }
}

// ─── /api/autopilot ───────────────────────────────────────────────────────────
async function handleAutopilot(req, res) {
    const { user } = req.platformContext;
    const guard = enforceUsage(user.id, 'autopilotRun');
    if (!guard.allowed) return res.status(403).json(guard);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const discoveryResult = await discoverTrends();
        // Return top 15 niches with expected fallback fields for frontend chunking
        const niches = discoveryResult.niches.slice(0, 15).map(n => ({
            niche: n.niche,
            targetAudience: 'Broad Audience',
            whyItSells: 'High cultural momentum',
            safe: true,
            finalScore: n.finalScore
        }));

        return res.json({ success: true, usage: guard.usage, niches });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Autopilot discovery failed', details: err.message });
    }
}

// ─── /api/usage ───────────────────────────────────────────────────────────────
async function handleUsage(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { user } = req.platformContext;
    const workspaceId = getUserWorkspace(user.id);
    const ws = getWorkspace(workspaceId);
    const plan = PLANS[ws.plan];
    return res.json({
        success: true,
        usage: { creditsRemaining: ws.creditsRemaining, bulkRunsUsed: ws.bulkRunsUsed || 0, autopilotRunsUsed: ws.autopilotRunsUsed || 0 },
        plan, workspaceId, members: ws.members
    });
}
