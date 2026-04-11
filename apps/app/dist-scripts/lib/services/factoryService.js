"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateSlogansOnly = regenerateSlogansOnly;
exports.generateSingleStrategy = generateSingleStrategy;
exports.bulkDiscover = bulkDiscover;
exports.generateChunk = generateChunk;
// server-only removed for script runtime
const trendEngine_1 = require("../ai/trendEngine");
const marketMath_1 = require("../ai/marketMath");
const promptBuilder_1 = require("../ai/promptBuilder");
const aiGateway_1 = require("../ai/aiGateway");
const sloganEngine_1 = require("../ai/sloganEngine");
const salesFeedbackService_1 = require("./salesFeedbackService");
const complianceEngine_1 = require("./complianceEngine");
function parseJsonPayload(text) {
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
}
function detectSloganMode(style) {
    const lowerStyle = style?.toLowerCase() || "";
    if (lowerStyle.includes("edgy"))
        return "edgy";
    if (lowerStyle.includes("viral") || lowerStyle.includes("bold") || lowerStyle.includes("aggressive"))
        return "viral";
    return "safe";
}
function normalizeSloganLookupKey(value) {
    return value.toLowerCase().trim().replace(/\s+/g, " ");
}
function alignImagePromptsToSlogans(targetSlogans, sourceSlogans, sourcePrompts) {
    const originalSlogans = Array.isArray(sourceSlogans)
        ? sourceSlogans.map((value) => (typeof value === "string" ? value.trim() : ""))
        : [];
    const originalPrompts = Array.isArray(sourcePrompts)
        ? sourcePrompts.map((value) => (typeof value === "string" ? value.trim() : ""))
        : [];
    const promptBySlogan = new Map();
    originalSlogans.forEach((slogan, index) => {
        const prompt = originalPrompts[index];
        if (!slogan || !prompt)
            return;
        const key = normalizeSloganLookupKey(slogan);
        if (!promptBySlogan.has(key)) {
            promptBySlogan.set(key, prompt);
        }
    });
    return targetSlogans.map((slogan, index) => {
        const exact = promptBySlogan.get(normalizeSloganLookupKey(slogan));
        if (exact)
            return exact;
        const byIndex = originalPrompts[index];
        return typeof byIndex === "string" ? byIndex : "";
    });
}
async function buildMerchPayload(parsed, niche, audience, style, userId, platform) {
    const sloganMode = detectSloganMode(style);
    // Fast sync pass — only used to get initial rankings for sales-signal lookup
    const initialRanked = (0, sloganEngine_1.enhanceSlogans)({
        niche,
        audience,
        style,
        shirtSlogans: parsed?.shirtSlogans,
        imagePrompts: parsed?.imagePrompts,
        salesSignals: parsed?.salesSignals,
        mode: sloganMode,
    }).ranked;
    const learnedSalesSignals = await (0, salesFeedbackService_1.getPersistedSalesSignalsForRankedSlogans)({
        userId,
        niche,
        platform,
        rankedSlogans: initialRanked,
    });
    const mergedSalesSignals = (0, salesFeedbackService_1.mergeSalesSignalsInputs)(parsed?.salesSignals, learnedSalesSignals);
    // Full async engine: applies DB pattern-score boosts + merged sales signals
    let sloganEngine = await (0, sloganEngine_1.runEliteSloganEngine)({
        niche,
        audience,
        style,
        shirtSlogans: parsed?.shirtSlogans,
        imagePrompts: parsed?.imagePrompts,
        salesSignals: mergedSalesSignals,
        mode: sloganMode,
    });
    // Elite Refinement Pass (gpt-4o) for Top candidates
    const topScored = sloganEngine.ranked.slice(0, 5).map(r => r.slogan);
    if (topScored.length > 0) {
        const refinedSlogans = await (0, sloganEngine_1.refineWithGPT4o)(topScored, niche, audience);
        // Re-inject refined slogans into the engine result (requires a second ranking pass)
        const refinedEngine = await (0, sloganEngine_1.runEliteSloganEngine)({
            niche,
            audience,
            style,
            shirtSlogans: [...refinedSlogans, ...sloganEngine.slogans],
            imagePrompts: parsed?.imagePrompts,
            salesSignals: mergedSalesSignals,
            mode: sloganMode,
        });
        sloganEngine = refinedEngine;
    }
    const alignedImagePrompts = alignImagePromptsToSlogans(sloganEngine.slogans, parsed?.shirtSlogans, parsed?.imagePrompts);
    // ── Compliance: filter slogans and attach report ──────────────────────
    const { safe: safeSlogans } = (0, complianceEngine_1.filterSafeSlogans)(sloganEngine.slogans);
    const finalSlogans = safeSlogans.length > 0 ? safeSlogans : sloganEngine.slogans;
    const alignedPromptsFiltered = alignImagePromptsToSlogans(finalSlogans, sloganEngine.slogans, (0, sloganEngine_1.normalizeImagePrompts)(sloganEngine.slogans, alignedImagePrompts, style, niche));
    const complianceReport = (0, complianceEngine_1.checkCompliance)({
        niche,
        shirtSlogans: finalSlogans,
        amazonListing: parsed?.amazonListing,
    });
    return {
        ...parsed,
        shirtSlogans: finalSlogans,
        imagePrompts: alignedPromptsFiltered,
        sloganInsights: sloganEngine.ranked,
        sloganCollections: sloganEngine.collections,
        sloganPersona: sloganEngine.persona,
        sloganPersonaKey: sloganEngine.personaKey,
        sloganMode: sloganEngine.mode,
        marketFeedback: {
            source: Object.keys(learnedSalesSignals).length > 0 ? "persisted_outcomes" : parsed?.salesSignals ? "inline_signals" : "none",
            learnedSignalCount: Object.keys(learnedSalesSignals).length,
        },
        compliance: complianceReport,
    };
}
function buildBestSellerPredictor(result, market, topSloganScore) {
    const demand = result.searchVolume ?? result.estimatedDemandStrength ?? 50;
    const intent = result.buyerIntent ?? result.estimatedBuyerIntent ?? 50;
    const trend = result.trendMomentum ?? result.estimatedTrend ?? 50;
    const nicheScore = result.niche_score ?? 50;
    const topSlogan = result.sloganInsights?.[0];
    const marketSignalScore = topSlogan?.marketSignalScore ?? 0;
    const hookScore = topSlogan?.hookScore ?? 50;
    const visualFit = topSlogan?.visualFit ?? 50;
    const marketEvidenceConfidence = topSlogan?.salesSignals?.confidence ?? 0;
    const predictorScore = Math.round(nicheScore * 0.28
        + topSloganScore * 0.18
        + demand * 0.12
        + intent * 0.1
        + trend * 0.1
        + hookScore * 0.08
        + visualFit * 0.06
        + marketSignalScore * 0.08);
    const confidence = predictorScore >= 80 ? "High" : predictorScore >= 65 ? "Medium" : "Watch";
    return {
        score: predictorScore,
        confidence,
        features: {
            topSloganScore,
            hookScore,
            visualFit,
            marketSignalScore,
            marketEvidenceConfidence,
            demand: Math.round(demand),
            intent: Math.round(intent),
            trend: Math.round(trend),
        },
        rationale: [
            `Top slogan strength ${topSloganScore}/100`,
            `Hook strength ${Math.round(hookScore)}/100`,
            `Visual fit ${Math.round(visualFit)}/100`,
            `Market feedback ${Math.round(marketSignalScore)}/100`,
            `Evidence confidence ${Math.round(marketEvidenceConfidence * 100)}/100`,
            `Demand signal ${Math.round(demand)}/100`,
            `Buyer intent ${Math.round(intent)}/100`,
            `Trend momentum ${Math.round(trend)}/100`,
            `Market source ${market.metricsSource || "simulated"}`,
        ],
    };
}
async function regenerateSlogansOnly(prompt, platform, audience, style, userId, excludeSlogans) {
    const detectedPlatform = (0, promptBuilder_1.detectPlatform)(platform);
    const blockedSlogans = Array.isArray(excludeSlogans)
        ? excludeSlogans.filter((value) => typeof value === "string" && value.trim().length > 0).slice(0, 20)
        : [];
    const aiResponse = await (0, aiGateway_1.chatCompletionSafe)({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content: `You are a POD slogan specialist.
Generate ONLY fresh t-shirt slogans for the supplied niche.

RULES:
    - Output valid JSON only.
    - Return exactly 12 slogans.
    - Use BEHAVIORAL HOOKS: Insider jokes, status signals, humility/bragging, relatable struggles.
    - Wearability: Phrases humans actually say (e.g. "Just One More...", "Survivor", "Official Specialist").
    - Avoid: "Built for X", "X state of mind", "Life is better with X".
    - Tone: ${style || "Elite, conversion-focused"}

JSON SHAPE:
{
  "shirtSlogans": ["slogan 1", "slogan 2", "...", "slogan 10"]
}`,
            },
            {
                role: "user",
                content: [
                    `Niche: ${prompt}`,
                    platform ? `Platform: ${platform}` : "",
                    audience ? `Audience: ${audience}` : "",
                    style ? `Style/Tone: ${style}` : "",
                    blockedSlogans.length > 0 ? `Avoid these slogans or near-duplicates:\n- ${blockedSlogans.join("\n- ")}` : "",
                    "Return only JSON.",
                ].filter(Boolean).join("\n\n"),
            },
        ],
        usageContext: {
            userId,
            feature: "strategy.single",
        },
    });
    if (aiResponse.error || !aiResponse.data) {
        throw new Error("AI slogan regeneration service unavailable");
    }
    const text = aiResponse.data.choices[0].message.content || "{}";
    let parsed;
    try {
        parsed = parseJsonPayload(text);
    }
    catch {
        throw new Error("AI did not return valid slogan JSON");
    }
    const merchPayload = await buildMerchPayload({
        shirtSlogans: parsed?.shirtSlogans,
    }, prompt, audience, style, userId, detectedPlatform);
    return {
        shirtSlogans: merchPayload.shirtSlogans,
        imagePrompts: merchPayload.imagePrompts,
        sloganInsights: merchPayload.sloganInsights,
        sloganCollections: merchPayload.sloganCollections,
        sloganPersona: merchPayload.sloganPersona,
        sloganPersonaKey: merchPayload.sloganPersonaKey,
        sloganMode: merchPayload.sloganMode,
        marketFeedback: merchPayload.marketFeedback,
        detectedPlatform,
        platform: detectedPlatform,
        meta: {
            apiCallsUsed: 1,
            mode: "slogan-only",
        },
    };
}
async function generateSingleStrategy(prompt, platform, audience, style, userId) {
    const detectedPlatform = (0, promptBuilder_1.detectPlatform)(platform);
    const aiResponse = await (0, aiGateway_1.chatCompletionSafe)({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `
You are a cross-platform print-on-demand listing expert and commercial design strategist.
Create a COMPLETE strategy and listing for the idea below.
SLOGAN SYSTEM (Elite Behavioral Design):
- Generate slogans using COGNITIVE HOOKS: Recognition ("That's me"), Emotion ("That hits"), Social Signal ("Others get this").
- Patterns: INSIDER_JOKE, STATUS_SIGNAL, HUMBLE_BRAG, RELATABLE_STRUGGLE.
- Tone: Niche-authentic and wearable. Phrases should feel like spoken word, not ad copy.
- No periods at the end of slogans. Max 8 words.
- Commercially safe: no brand names or trademarks.

Score the niche based on: demand strength, competition pressure, emotional purchase power, design simplicity, platform fit (0-100).

Output ONLY valid JSON:
{
  "niche": "",
  "whyItSells": "",
  "competitionLevel": "",
  "emotionalTrigger": "",
  "targetAudiences": [],
  "designDirections": [],
  "artStyles": ["style 1", "style 2"],
  "seoKeywords": { "primary": "", "longTail": [], "buyerIntent": [], "platformTags": [] },
  "safe": true,
  "reasoning": "",
  "estimatedDemandStrength": 0,
  "estimatedCompetition": 0,
  "estimatedTrend": 0,
  "estimatedBuyerIntent": 0,
  "shirtSlogans": ["slogan 1","slogan 2","...","slogan 10"],
  "imagePrompts": ["unique design prompt for slogan 1","...","unique design prompt for slogan 10"],
  "amazonListing": { "title": "", "brandName": "", "bulletPoint1": "", "bulletPoint2": "", "description": "", "keywords": [] }
}

IMAGE PROMPTS: Provide exactly 10 UNIQUE image prompts (one per slogan) formatted exactly as:
Create an original POD t-shirt design.
Text: "[The exact slogan]"
Style: [STYLE] — [1-2 sentences of UNIQUE design description]
No brands, logos, or trademarks.
Transparent background.
Commercial friendly.
300 DPI.
IMPORTANT: The literal token [STYLE] MUST appear at the start of the Style line. Do NOT replace it.`
            },
            {
                role: 'user',
                content: `Idea: ${prompt}${platform ? `\nPlatform: ${platform}` : ''}${audience ? `\nTarget Audience: ${audience}` : ''}${style ? `\nStyle/Tone: ${style}` : ''}\n\nUse the user's details to populate the niches, audiences, and styles. Make slogans commercially strong, wearable, and varied enough to support ranking into top picks, bold picks, and experimental picks.`
            }
        ],
        usageContext: {
            userId,
            feature: "strategy.single",
        },
    });
    if (aiResponse.error || !aiResponse.data) {
        throw new Error("AI generation service unavailable");
    }
    const text = aiResponse.data.choices[0].message.content || "{}";
    let parsed;
    try {
        parsed = parseJsonPayload(text);
    }
    catch (err) {
        throw new Error("AI did not return valid JSON");
    }
    parsed = await buildMerchPayload(parsed, parsed?.niche || prompt, audience, style, userId, detectedPlatform);
    const trend = (0, marketMath_1.createTrendSnapshot)({
        trend_score: parsed.estimatedTrend,
        trendMomentum: parsed.estimatedTrend,
    }, 65);
    const aiSignals = {
        estimatedDemandStrength: parsed.estimatedDemandStrength || 50,
        estimatedCompetition: parsed.estimatedCompetition || 50,
        estimatedTrend: parsed.estimatedTrend || 50,
        estimatedBuyerIntent: parsed.estimatedBuyerIntent || 50
    };
    let market = (0, marketMath_1.generateMarketSignals)(prompt, trend, aiSignals);
    const scoreData = (0, marketMath_1.scoreWithMarketIntel)(parsed, market, trend);
    const { projectedRevenue, revenueCategory } = (0, marketMath_1.calculateRevenue)(prompt, market.trendMomentum);
    const topSloganScore = parsed.sloganInsights?.[0]?.score || 50;
    return {
        ...parsed,
        niche: parsed.niche || prompt,
        trend, projectedRevenue, revenueCategory, ...market, ...scoreData,
        bestSellerPredictor: buildBestSellerPredictor({ ...parsed, ...scoreData, ...market }, market, topSloganScore),
        metricsSource: scoreData.metricsSource || market.metricsSource || 'simulated',
        detectedPlatform, platform: detectedPlatform
    };
}
async function bulkDiscover() {
    const discoveryResult = await (0, trendEngine_1.discoverTrends)();
    // Return top 15 niches with expected fallback fields for frontend chunking
    return {
        niches: discoveryResult.niches.slice(0, 15).map(n => ({
            niche: n.niche,
            targetAudience: 'Broad Audience',
            whyItSells: 'High cultural momentum',
            safe: true,
            finalScore: n.finalScore,
            profitScore: n.profitScore,
            viralScore: n.viralScore,
        })),
        signalSources: discoveryResult.signalSources,
        signalConfidence: discoveryResult.signalConfidence,
    };
}
async function generateChunk(niches, isAutopilot = false, userId) {
    if (!niches || !Array.isArray(niches))
        throw new Error("Niches array required");
    const settledResults = await Promise.allSettled(niches.map(async (nicheData) => {
        try {
            const trend = (0, marketMath_1.createTrendSnapshot)(nicheData, 65);
            const generation = await (0, aiGateway_1.chatCompletionSafe)({
                model: 'gpt-4o-mini',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: isAutopilot
                            ? 'You create Amazon POD listings. Always output valid JSON exactly: { "slogan": "", "title": "", "bullet_point_1": "", "bullet_point_2": "", "description": "" }'
                            : `You create Amazon POD shirt listings. Always output valid JSON in exactly this structure:\n{\n    "shirtSlogans": ["", "", "", "", "", "", "", "", "", ""],\n    "imagePrompts": ["", "", "", "", "", "", "", "", "", ""],\n    "designDirections": ["", ""],\n    "amazonListing": { "title": "", "bulletPoint1": "", "bulletPoint2": "", "description": "", "keywords": ["", ""] }\n}\n\nSLOGAN RULES:\n- Use the formula IDENTITY + EMOTION + PUNCH.\n- Keep most slogans between 2 and 7 words.\n- Make them wearable, commercial, and emotionally sticky.\n- Include a mix of safe winners, bold lines, and experimental ideas.\n- Avoid generic motivational filler.\n\nIMAGE PROMPT RULES:\nProvide 10 UNIQUE image prompts (one per slogan). Use EXACTLY this format for EVERY prompt:\nCreate an original POD t-shirt design.\nText: "[The exact slogan]"\nStyle: [STYLE] — [1-2 sentences of UNIQUE, niche-specific design description for THIS slogan.]\nNo brands, logos, or trademarks.\nTransparent background.\nCommercial friendly.\n300 DPI.\nIMPORTANT: The literal token [STYLE] MUST appear at the start of the Style line. Do NOT replace it.`
                    },
                    {
                        role: 'user',
                        content: isAutopilot
                            ? `Create a listing for this POD niche: ${nicheData.niche}\nTarget Audience: ${nicheData.targetAudience || 'Broad'}\n\nOutput only JSON.`
                            : `Create a POD shirt concept for:\n\nNiche: ${nicheData.niche}\nAudience: ${nicheData.targetAudience || 'Broad'}\n\nReturn valid JSON exactly as structured. The slogans should be varied enough to rank into top picks, bold picks, and experimental picks.`
                    }
                ],
                usageContext: {
                    userId,
                    feature: isAutopilot ? "factory.autopilotChunk" : "factory.bulkChunk",
                },
            });
            if (generation.error || !generation.data)
                return null;
            let gen;
            try {
                gen = parseJsonPayload(generation.data.choices[0].message.content || "{}");
            }
            catch (err) {
                return null;
            }
            const market = (0, marketMath_1.generateMarketSignals)(nicheData.niche, trend);
            const score = (0, marketMath_1.scoreWithMarketIntel)(nicheData, market, trend);
            let product;
            if (isAutopilot) {
                const { projectedRevenue, revenueCategory } = (0, marketMath_1.calculateRevenue)(nicheData.niche, market.trendMomentum);
                // Enhance the GPT slogan through the elite engine for scoring + DB pattern boosts
                let topSlogan = gen.slogan;
                let topSloganInsight = null;
                try {
                    const engineResult = await (0, sloganEngine_1.runEliteSloganEngine)({
                        niche: nicheData.niche,
                        shirtSlogans: gen.slogan ? [gen.slogan] : undefined,
                    });
                    topSlogan = engineResult.ranked[0]?.slogan ?? gen.slogan;
                    topSloganInsight = engineResult.ranked[0] ?? null;
                }
                catch (_) { /* non-blocking */ }
                const autoCompliance = (0, complianceEngine_1.checkCompliance)({
                    niche: nicheData.niche,
                    slogan: topSlogan,
                    title: gen.title,
                    description: gen.description,
                    bullet_point_1: gen.bullet_point_1,
                    bullet_point_2: gen.bullet_point_2,
                });
                product = {
                    niche: nicheData.niche, slogan: topSlogan, sloganInsight: topSloganInsight,
                    title: gen.title, bullet_point_1: gen.bullet_point_1, bullet_point_2: gen.bullet_point_2,
                    description: gen.description, trend, projectedRevenue, revenueCategory, ...market, ...score,
                    compliance: autoCompliance,
                };
            }
            else {
                const { projectedRevenue, revenueCategory } = (0, marketMath_1.calculateRevenue)(nicheData.niche, market.trendMomentum);
                const merchPayload = await buildMerchPayload(gen, nicheData.niche, nicheData.targetAudience, nicheData.style, userId, nicheData.platform);
                const topSloganScore = merchPayload.sloganInsights?.[0]?.score || 50;
                product = {
                    niche: nicheData.niche, audience: nicheData.targetAudience, whyItSells: nicheData.whyItSells,
                    safe: nicheData.safe, trend, projectedRevenue, revenueCategory, ...market, ...merchPayload, ...score,
                    bestSellerPredictor: buildBestSellerPredictor({ ...merchPayload, ...score, ...market }, market, topSloganScore),
                    metricsSource: score.metricsSource || market.metricsSource || 'simulated'
                };
            }
            return product;
        }
        catch (err) {
            return null;
        }
    }));
    const results = settledResults
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value);
    return results.filter(Boolean);
}
