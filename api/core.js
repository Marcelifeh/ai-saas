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
const { getTrendSignals } = require('./utils/trendEngine');
const { generateMarketSignals, scoreWithMarketIntel } = require('./utils/marketSignals');
const { detectPlatform, buildImagePrompt } = require('./utils/promptBuilder');
const { getAiMetrics, setAiMetrics } = require('./utils/aiMetricCache');
const { calculateRevenue } = require('./utils/revenueModel');
const { discoverHighPotentialKeywords } = require('./utils/advancedDiscovery');
const { getUserWorkspace } = require('./utils/userWorkspace');
const { getWorkspace } = require('./utils/workspaceStore');
const { PLANS } = require('./utils/plans');

// ─── Route Dispatcher ─────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
    const url = (req.url || '').split('?')[0];

    if (url === '/api/discover') return requireAuth(handleDiscover)(req, res);
    if (url === '/api/generate') return requireAuth(handleGenerate)(req, res);
    if (url === '/api/bulk-generate') return requireAuth(handleBulkGenerate)(req, res);
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

        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0,
            messages: [
                {
                    role: 'system',
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
                { role: 'user', content: 'Find 5 profitable Amazon POD niches. Return valid JSON array only.' }
            ]
        });

        let raw = completion.choices[0].message.content;
        if (raw.startsWith('```json')) raw = raw.replace(/^```json\n/, '').replace(/\n```$/, '');
        else if (raw.startsWith('```')) raw = raw.replace(/^```\n/, '').replace(/\n```$/, '');

        let niches;
        try { niches = JSON.parse(raw); }
        catch (err) { return res.status(500).json({ error: 'Failed to parse AI JSON response', raw }); }

        const scored = await Promise.all(niches.map(async (n) => {
            const cached = getAiMetrics(n.niche);
            let market, score;
            if (cached) {
                market = cached;
                const trend = await getTrendSignals(n.niche);
                score = scoreWithMarketIntel(n, market, trend);
            } else {
                const aiSignals = {
                    estimatedDemandStrength: n.estimatedDemandStrength,
                    estimatedCompetition: n.estimatedCompetition,
                    estimatedTrend: n.estimatedTrend,
                    estimatedBuyerIntent: n.estimatedBuyerIntent
                };
                const trend = await getTrendSignals(n.niche);
                market = generateMarketSignals(n.niche, trend, aiSignals);
                score = scoreWithMarketIntel(n, market, trend);
                setAiMetrics(n.niche, market);
            }
            const { projectedRevenue, revenueCategory } = calculateRevenue(n.niche, market.trendMomentum);
            const result = {
                ...n, ...market, ...score, projectedRevenue, revenueCategory,
                research_demand: market.searchVolume,
                research_competition: market.competitionDensity,
                trend_score: market.trendMomentum,
                metricsSource: score.metricsSource || market.metricsSource || 'simulated'
            };
            return enforceCompliance(result);
        }));

        scored.sort((a, b) => b.niche_score - a.niche_score);
        return res.json({ success: true, usage: guard.usage, opportunities: scored });

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
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 55000 });

        const aiResponse = await openai.chat.completions.create({
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
    const guard = enforceUsage(user.id, 'bulkFactoryRun');
    if (!guard.allowed) return res.status(403).json(guard);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const discovery = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: 'You are a POD niche discovery engine. Always output valid JSON.' },
                {
                    role: 'user',
                    content: `Find 3 profitable Amazon POD niches.
Return a JSON object with a single key "niches" containing an array of objects.

Fields per object:
niche (string)
targetAudience (string)
whyItSells (string)
emotionalTrigger (string)
safe (boolean, true if family friendly)
estimatedDemandStrength (0-100 — your estimate of search/buyer demand strength)
estimatedCompetition (0-100 — 0=blue ocean, 100=extremely saturated)
estimatedTrend (0-100 — momentum: rising=70+, stable=40-69, cooling=below 40)
estimatedBuyerIntent (0-100 — how purchase-ready this audience is)`
                }
            ]
        });

        const parsedDiscovery = JSON.parse(discovery.choices[0].message.content);
        const niches = parsedDiscovery.niches || [];
        const results = [];

        for (const nicheData of niches) {
            const trend = await getTrendSignals(nicheData.niche);

            const generation = await client.chat.completions.create({
                model: 'gpt-4o-mini',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: `You create Amazon POD shirt listings. Always output valid JSON in exactly this structure:
{
    "shirtSlogans": ["", "", "", "", "", "", "", "", "", ""],
    "imagePrompts": ["", "", "", "", "", "", "", "", "", ""],
    "designDirections": ["", ""],
    "amazonListing": { "title": "", "bulletPoint1": "", "bulletPoint2": "", "description": "", "keywords": ["", ""] }
}

IMAGE PROMPT RULES:
Provide 10 UNIQUE image prompts (one per slogan). Use EXACTLY this format for EVERY prompt:

Create an original POD t-shirt design.
Text: "[The exact slogan]"
Style: [STYLE] — [1-2 sentences of UNIQUE, niche-specific design description for THIS slogan: visual motifs, colors, symbols, textures, and composition. Each must be distinct.]
No brands, logos, or trademarks.
Transparent background.
Commercial friendly.
300 DPI.

IMPORTANT: The literal token [STYLE] MUST appear at the start of the Style line. Do NOT replace it.`
                    },
                    {
                        role: 'user',
                        content: `Create a POD shirt concept for:\n\nNiche: ${nicheData.niche}\nAudience: ${nicheData.targetAudience}\n\nReturn valid JSON exactly as structured.`
                    }
                ]
            });

            let gen;
            try { gen = JSON.parse(generation.choices[0].message.content); }
            catch (err) { console.error('Failed to parse generation for niche', nicheData.niche); continue; }

            const cachedMetrics = getAiMetrics(nicheData.niche);
            let market;
            if (cachedMetrics) {
                market = cachedMetrics;
            } else {
                const aiSignals = {
                    estimatedDemandStrength: nicheData.estimatedDemandStrength,
                    estimatedCompetition: nicheData.estimatedCompetition,
                    estimatedTrend: nicheData.estimatedTrend,
                    estimatedBuyerIntent: nicheData.estimatedBuyerIntent
                };
                market = generateMarketSignals(nicheData.niche, trend, aiSignals);
                setAiMetrics(nicheData.niche, market);
            }
            const score = scoreWithMarketIntel(nicheData, market, trend);
            const { projectedRevenue, revenueCategory } = calculateRevenue(nicheData.niche, market.trendMomentum);

            let product = {
                niche: nicheData.niche, audience: nicheData.targetAudience, whyItSells: nicheData.whyItSells,
                safe: nicheData.safe, trend, projectedRevenue, revenueCategory, ...market, ...gen, ...score,
                metricsSource: score.metricsSource || market.metricsSource || 'simulated'
            };
            product = enforceCompliance(product);
            logRun(product);
            results.push(product);
        }

        results.sort((a, b) => {
            const decValue = { 'PUBLISH': 3, 'TEST': 2, 'SKIP': 1 };
            const diff = (decValue[b.decision] || 0) - (decValue[a.decision] || 0);
            return diff !== 0 ? diff : (b.publishPriority || 0) - (a.publishPriority || 0);
        });

        return res.json({ success: true, usage: guard.usage, products: results });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Bulk generation failed', details: err.message });
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

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const aiResponse = await openai.chat.completions.create({
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

    const start = Date.now();
    try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const discovery = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: 'You discover profitable POD niches. Always output valid JSON.' },
                {
                    role: 'user',
                    content: `Find 5 profitable Amazon POD niches.
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
safe (boolean, true if family friendly)`
                }
            ]
        });

        const parsedDiscovery = JSON.parse(discovery.choices[0].message.content);
        const niches = parsedDiscovery.niches || [];
        const products = [];

        for (const nicheData of niches) {
            const trend = await getTrendSignals(nicheData.niche);

            for (let i = 0; i < 2; i++) {
                const generation = await client.chat.completions.create({
                    model: 'gpt-4o-mini',
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: 'You create Amazon POD listings. Always output valid JSON.' },
                        {
                            role: 'user',
                            content: `Create a listing for this POD niche: ${nicheData.niche}
Target Audience: ${nicheData.targetAudience}

Return JSON with these exact fields:
slogan (string, 1 catchy phrase for the shirt design)
title (string, Amazon optimized title, 150 chars max)
bullet_point_1 (string, 250 chars max)
bullet_point_2 (string, 250 chars max)
description (string)`
                        }
                    ]
                });

                const design = JSON.parse(generation.choices[0].message.content);
                const market = generateMarketSignals(nicheData.niche, trend);
                const score = scoreWithMarketIntel(nicheData, market, trend);
                const rawRevenue = Math.floor(Math.random() * (1200 - 300) + 300);
                const momentumBoost = 1 + Math.pow(trend.score / 100, 1.4);
                const projectedRevenue = Math.round(rawRevenue * momentumBoost);

                let product = {
                    niche: nicheData.niche, slogan: design.slogan, title: design.title,
                    bullet_point_1: design.bullet_point_1, bullet_point_2: design.bullet_point_2,
                    description: design.description, trend, projectedRevenue, ...market, ...score
                };
                product = enforceCompliance(product);
                logRun(product);
                products.push(product);
            }
        }

        const runSummary = {
            productsGenerated: products.length,
            publishCount: products.filter(p => p.decision === 'PUBLISH').length,
            testCount: products.filter(p => p.decision === 'TEST').length,
            skipCount: products.filter(p => p.decision === 'SKIP').length,
            runTimeSeconds: Math.round((Date.now() - start) / 1000)
        };

        products.sort((a, b) => {
            const decValue = { 'PUBLISH': 3, 'TEST': 2, 'SKIP': 1 };
            const diff = (decValue[b.decision] || 0) - (decValue[a.decision] || 0);
            return diff !== 0 ? diff : (b.publishPriority || 0) - (a.publishPriority || 0);
        });

        return res.status(200).json({ usage: guard.usage, runSummary, products });

    } catch (error) {
        console.error('Autopilot Error:', error);
        return res.status(500).json({ error: 'Autopilot processing failed: ' + error.message });
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
