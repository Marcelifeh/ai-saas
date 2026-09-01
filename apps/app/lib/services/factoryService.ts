import "server-only";
import { discoverTrends, getGoogleTrends } from "../ai/trendEngine";
import { createTrendSnapshot, generateMarketSignals, scoreWithMarketIntel, calculateRevenue, MarketIntel } from "../ai/marketMath";
import { detectPlatform, PLATFORM_RULES } from "../ai/promptBuilder";
import { globalCache } from "../utils/cache";
import { chatCompletionSafe } from "../ai/aiGateway";
import { TrendSignalSourceResult } from "../ai/trendEngine";
import {
    runEliteSloganEngine,
    type SloganEngineResult,
    type SloganPipelineMetrics,
} from "../ai/sloganEngine";
import {
    evaluateVisualBatchRelease,
    generateDynamicDesignBatch,
    VISUAL_ENGINE_VERSION,
    type DesignBatchDiversityMetrics,
    type DynamicDesignStrategy,
    type DesignMode,
    type VisualReleaseGate,
} from "../ai/dynamicDesignPrompt";
import {
    generateDynamicListing,
    toLegacyListingShape,
    type DynamicListingInput,
    type DynamicListingResult,
} from "../ai/dynamicListingEngine";
import { getPersistedSalesSignalsForRankedSlogans, mergeSalesSignalsInputs } from "./salesFeedbackService";
import { checkCompliance, filterSafeSlogans } from "./complianceEngine";
import { prisma } from "../db/prisma";
import { getMarketData } from "../market/marketAggregator";
import { computeOpportunity, classifyNicheIntent } from "../market/opportunityEngine";
import { generateMarketInsights } from "../ai/marketInsightEngine";
import { logError } from "../utils/logger";

export interface BulkDiscoveryResult {
    niches: any[];
    signalSources: TrendSignalSourceResult[];
    signalConfidence: number;
}

export interface SloganRegenerationResult {
    shirtSlogans: string[];
    imagePrompts: string[];
    visualStrategies: DynamicDesignStrategy[];
    visualBatchMetrics: DesignBatchDiversityMetrics | null;
    visualReleaseGate: VisualReleaseGate;
    visualEngineVersion: string;
    winningSlogan: string;
    dynamicProfile: unknown;
    evidenceSnapshotId?: string;
    evidenceContentHash?: string;
    creativeTerritories?: unknown[];
    semanticEligibility?: unknown[];
    creativeDirection?: unknown;
    expressionWorthiness?: unknown[];
    sloganPipelineMetrics?: SloganPipelineMetrics;
    dynamicListing: DynamicListingResult;
    amazonListing: ReturnType<typeof toLegacyListingShape>;
    sloganInsights: any[];
    sloganCollections: any;
    sloganPersona: string;
    sloganPersonaKey: string;
    sloganMode: string;
    marketFeedback: {
        source: string;
        learnedSignalCount: number;
    };
    detectedPlatform: string;
    platform: string;
    meta: {
        apiCallsUsed: number;
        mode: "slogan-only";
    };
}

export type SloganPipelineFailureCode = NonNullable<SloganEngineResult["error"]>;

const sloganFailureMessages: Partial<Record<SloganPipelineFailureCode, string>> = {
    PROFILE_INSUFFICIENT_EVIDENCE: "We couldn't find enough grounded evidence for this opportunity. Try a more specific opportunity or choose another one.",
    EXPRESSION_INTENT_FAILED: "We couldn't find a grounded human expression angle for this opportunity. Try refining the creative direction or choose another opportunity.",
    NO_ELIGIBLE_SLOGANS: "We couldn't find a sufficiently grounded slogan for this opportunity. Try regenerating or choose another opportunity.",
    GENERATION_EXHAUSTED: "We couldn't find a strong enough slogan for this crossover. Try regenerating or refining the concept.",
    VERIFIER_FORMAT_FAILED: "The slogan quality check returned an invalid response. Please try again.",
    VERIFIER_INCOMPLETE: "The slogan quality check returned an incomplete response. Please try again.",
    VERIFIER_RATE_LIMITED: "The slogan quality check is temporarily busy. Please try again shortly.",
    VERIFIER_API_FAILED: "The slogan quality check is temporarily unavailable. Please try again.",
};

export class SloganPipelineFailure extends Error {
    readonly code: SloganPipelineFailureCode;
    readonly pipelineMetrics?: SloganPipelineMetrics;

    constructor(code: SloganPipelineFailureCode, pipelineMetrics?: SloganPipelineMetrics) {
        super(sloganFailureMessages[code] ?? "Slogan generation could not produce a releasable result. Please try again.");
        this.name = "SloganPipelineFailure";
        this.code = code;
        this.pipelineMetrics = pipelineMetrics;
    }
}

function parseJsonPayload(text: string): any {
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
}

function detectSloganMode(style?: string): "safe" | "viral" | "edgy" {
    const lowerStyle = style?.toLowerCase() || "";
    if (lowerStyle.includes("edgy")) return "edgy";
    if (lowerStyle.includes("viral") || lowerStyle.includes("bold") || lowerStyle.includes("aggressive")) return "viral";
    return "safe";
}

function mapDesignMarketplace(platform?: string): "amazon_merch" | "etsy" | "general" {
    const detected = detectPlatform(platform);
    if (detected === "amazon") return "amazon_merch";
    if (detected === "etsy") return "etsy";
    return "general";
}

function collectListingMarketTerms(parsed: any): string[] {
    const seo = parsed?.seoKeywords;
    return [...new Set([
        typeof seo?.primary === "string" ? seo.primary : "",
        ...(Array.isArray(seo?.longTail) ? seo.longTail : []),
        ...(Array.isArray(seo?.buyerIntent) ? seo.buyerIntent : []),
        ...(Array.isArray(seo?.platformTags) ? seo.platformTags : []),
    ].filter((term): term is string => typeof term === "string" && term.trim().length > 0))];
}

async function getConfiguredMerchBrand(userId?: string): Promise<string | null> {
    if (!userId) return null;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { merchBrand: true },
        });
        return user?.merchBrand?.trim() || null;
    } catch (err: unknown) {
        logError("Configured merch brand unavailable", err);
        return null;
    }
}

export async function repackageDynamicListing(
    input: Omit<DynamicListingInput, "configuredBrand" | "userId">,
    userId: string,
) {
    const dynamicListing = await generateDynamicListing({
        ...input,
        configuredBrand: await getConfiguredMerchBrand(userId),
        userId,
    });
    return {
        dynamicListing,
        amazonListing: toLegacyListingShape(dynamicListing),
    };
}

export async function regenerateVisualDesigns(input: {
    niche: string;
    slogans: string[];
    profile: Parameters<typeof generateDynamicDesignBatch>[0]["profile"];
    style?: string;
    platform?: string;
    designMode?: DesignMode;
    subjectOverride?: "AUTO" | "NO_PERSON" | "INCLUDE_PERSON";
    userId?: string;
}) {
    const visualStrategies = await generateDynamicDesignBatch({
        niche: input.niche,
        slogans: input.slogans,
        profile: input.profile,
        style: input.style?.trim() || "Bold Graphic",
        garmentBackground: "either",
        printBackground: "transparent",
        marketplace: mapDesignMarketplace(input.platform),
        designMode: input.designMode ?? "AUTO",
        subjectOverride: input.subjectOverride,
        userId: input.userId,
    });
    const visualBenchmark = evaluateVisualBatchRelease(visualStrategies);
    return {
        imagePrompts: visualStrategies.map((strategy) => strategy.prompt),
        visualStrategies,
        visualBatchMetrics: visualBenchmark.metrics,
        visualReleaseGate: visualBenchmark.releaseGate,
        visualEngineVersion: VISUAL_ENGINE_VERSION,
    };
}

async function buildMerchPayload(
    parsed: any,
    niche: string,
    audience?: string,
    style?: string,
    userId?: string,
    platform?: string,
    designMode: DesignMode = "AUTO",
    excludeSlogans: string[] = [],
    creativeDirection?: string,
    creativeExamples: string[] = [],
    negativeCreativeConstraints: string[] = [],
) {
    const sloganMode = detectSloganMode(style);

    const learnedSalesSignals = await getPersistedSalesSignalsForRankedSlogans({
        userId,
        niche,
        platform,
        rankedSlogans: [],
    }).catch((err: unknown) => {
        logError("Learned sales signals skipped", err);
        return {};
    });

    const mergedSalesSignals = mergeSalesSignalsInputs(parsed?.salesSignals, learnedSalesSignals);

    // Full async engine: applies DB pattern-score boosts + merged sales signals
    const sloganEngine = await runEliteSloganEngine({
        niche,
        audience,
        style,
        shirtSlogans: parsed?.shirtSlogans,
        imagePrompts: parsed?.imagePrompts,
        salesSignals: mergedSalesSignals,
        mode: sloganMode,
        excludeSlogans,
        creativeDirection,
        creativeExamples,
        negativeCreativeConstraints,
    });

    const dynamicProfile = sloganEngine.dynamicProfile;
    if (!dynamicProfile) {
        throw new SloganPipelineFailure(
            sloganEngine.error ?? "DYNAMIC_PROFILE_GENERATION_FAILED",
            sloganEngine.pipelineMetrics,
        );
    }

    if (!sloganEngine.slogans.length || !sloganEngine.ranked.length) {
        throw new SloganPipelineFailure(
            sloganEngine.error ?? "GENERATION_EXHAUSTED",
            sloganEngine.pipelineMetrics,
        );
    }

    // ── Compliance: filter slogans and attach report ──────────────────────
    const { safe: safeSlogans } = filterSafeSlogans(sloganEngine.slogans);
    if (safeSlogans.length === 0) {
        throw new Error("No slogans survived compliance validation");
    }
    const finalSlogans = safeSlogans;
    const visualStrategies = await generateDynamicDesignBatch({
            niche,
            slogans: finalSlogans,
            profile: dynamicProfile,
            style: style?.trim() || "Bold Graphic",
            garmentBackground: "either",
            printBackground: "transparent",
            marketplace: mapDesignMarketplace(platform),
            userId,
            designMode,
        });
    const visualBenchmark = evaluateVisualBatchRelease(visualStrategies);
    const winningSlogan = sloganEngine.ranked.find((entry) => finalSlogans.includes(entry.slogan))?.slogan
        ?? finalSlogans[0]
        ?? "";
    const winningVisualStrategy = visualStrategies.find((strategy) => strategy.slogan === winningSlogan);
    const configuredBrand = await getConfiguredMerchBrand(userId);
    const dynamicListing = await generateDynamicListing({
        niche,
        slogan: winningSlogan,
        audience: audience || dynamicProfile.audience,
        profile: dynamicProfile,
        visualStrategy: winningVisualStrategy,
        marketTerms: collectListingMarketTerms(parsed),
        purchaseMotives: dynamicProfile.purchaseMotives,
        marketplace: mapDesignMarketplace(platform),
        visualStyle: style?.trim() || "Bold Graphic",
        configuredBrand,
        userId,
    });
    const amazonListing = toLegacyListingShape(dynamicListing);
    const complianceReport = checkCompliance({
        niche,
        shirtSlogans: finalSlogans,
        brandName: dynamicListing.brand ?? undefined,
        amazonListing,
    });

    return {
        ...parsed,
        shirtSlogans: finalSlogans,
        imagePrompts: visualStrategies.map((strategy) => strategy.prompt),
        visualStrategies,
        visualBatchMetrics: visualBenchmark.metrics,
        visualReleaseGate: visualBenchmark.releaseGate,
        visualEngineVersion: VISUAL_ENGINE_VERSION,
        winningSlogan,
        dynamicProfile,
        evidenceSnapshotId: sloganEngine.evidenceSnapshotId,
        evidenceContentHash: sloganEngine.evidenceContentHash,
        creativeTerritories: sloganEngine.creativeTerritories,
        semanticEligibility: sloganEngine.semanticEligibility,
        creativeDirection: sloganEngine.creativeDirection,
        expressionWorthiness: sloganEngine.expressionWorthiness,
        sloganPipelineMetrics: sloganEngine.pipelineMetrics,
        dynamicListing,
        amazonListing,
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

function buildBestSellerPredictor(result: any, market: MarketIntel, topSloganScore: number) {
    const demand = result.searchVolume ?? result.estimatedDemandStrength ?? 50;
    const intent = result.buyerIntent ?? result.estimatedBuyerIntent ?? 50;
    const trend = result.trendMomentum ?? result.estimatedTrend ?? 50;
    const nicheScore = result.niche_score ?? 50;
    const topSlogan = result.sloganInsights?.[0];
    const marketSignalScore = topSlogan?.marketSignalScore ?? 0;
    const hookScore = topSlogan?.hookScore ?? 50;
    const visualFit = topSlogan?.visualFit ?? 50;
    const marketEvidenceConfidence = topSlogan?.salesSignals?.confidence ?? 0;
    const predictorScore = Math.round(
        nicheScore * 0.28
        + topSloganScore * 0.18
        + demand * 0.12
        + intent * 0.1
        + trend * 0.1
        + hookScore * 0.08
        + visualFit * 0.06
        + marketSignalScore * 0.08
    );
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

export async function regenerateSlogansOnly(
    prompt: string,
    platform?: string,
    audience?: string,
    style?: string,
    userId?: string,
    excludeSlogans?: string[],
    designMode: DesignMode = "AUTO",
    creativeExamples: string[] = [],
    negativeCreativeConstraints: string[] = [],
    creativeDirection?: string,
): Promise<SloganRegenerationResult> {
    const detectedPlatform = detectPlatform(platform);
    const blockedSlogans = Array.isArray(excludeSlogans)
        ? excludeSlogans.filter((value): value is string => typeof value === "string" && value.trim().length > 0).slice(0, 30)
        : [];

    // Regeneration now uses the same authoritative evidence-driven creative
    // selection path as Strategy Factory, Design Studio, and Autopilot. There
    // is deliberately no separate direct-LLM slogan prompt or template layer.
    const merchPayload = await buildMerchPayload(
        {},
        prompt,
        audience,
        style,
        userId,
        detectedPlatform,
        designMode,
        blockedSlogans,
        creativeDirection?.trim() || prompt,
        creativeExamples,
        negativeCreativeConstraints,
    );

    return {
        shirtSlogans: merchPayload.shirtSlogans,
        imagePrompts: merchPayload.imagePrompts,
        visualStrategies: merchPayload.visualStrategies,
        visualBatchMetrics: merchPayload.visualBatchMetrics,
        visualReleaseGate: merchPayload.visualReleaseGate,
        visualEngineVersion: merchPayload.visualEngineVersion,
        winningSlogan: merchPayload.winningSlogan,
        dynamicProfile: merchPayload.dynamicProfile,
        evidenceSnapshotId: merchPayload.evidenceSnapshotId,
        evidenceContentHash: merchPayload.evidenceContentHash,
        creativeTerritories: merchPayload.creativeTerritories,
        semanticEligibility: merchPayload.semanticEligibility,
        creativeDirection: merchPayload.creativeDirection,
        expressionWorthiness: merchPayload.expressionWorthiness,
        sloganPipelineMetrics: merchPayload.sloganPipelineMetrics,
        dynamicListing: merchPayload.dynamicListing,
        amazonListing: merchPayload.amazonListing,
        sloganInsights: merchPayload.sloganInsights,
        sloganCollections: merchPayload.sloganCollections,
        sloganPersona: merchPayload.sloganPersona,
        sloganPersonaKey: merchPayload.sloganPersonaKey,
        sloganMode: merchPayload.sloganMode,
        marketFeedback: merchPayload.marketFeedback,
        detectedPlatform,
        platform: detectedPlatform,
        meta: {
            apiCallsUsed: 0,
            mode: "slogan-only",
        },
    };
}

export async function generateSingleStrategy(
    prompt: string,
    platform?: string,
    audience?: string,
    style?: string,
    userId?: string,
    designMode: DesignMode = "AUTO",
    creativeExamples: string[] = [],
    negativeCreativeConstraints: string[] = [],
    creativeDirection?: string,
): Promise<any> {
    const detectedPlatform = detectPlatform(platform);

    const aiResponse = await chatCompletionSafe({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
        messages: [
                {
                    role: 'system',
                    content: `
You are a cross-platform print-on-demand market strategist.
Create market and audience context for the idea below.

Do NOT generate slogans, slogan patterns, visual concepts, image prompts, or product listings. The authoritative evidence-driven creative selection engine runs after this strategy context is returned.

Score the niche based on: demand strength, competition pressure, emotional purchase power, design simplicity, and platform fit (0-100).

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
  "salesSignals": {}
}`
                },
                {
                    role: 'user',
                    content: `Idea: ${prompt}${platform ? `\nPlatform: ${platform}` : ''}${audience ? `\nTarget Audience: ${audience}` : ''}${style ? `\nStyle/Tone: ${style}` : ''}\n\nUse the user's details to populate market context, audiences, and rendering-style context. Do not generate slogan copy.`
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
    let parsed: any;
    try {
        parsed = parseJsonPayload(text);
    } catch (err) {
        throw new Error("AI did not return valid JSON");
    }

    parsed = await buildMerchPayload(
        parsed,
        parsed?.niche || prompt,
        audience,
        style,
        userId,
        detectedPlatform,
        designMode,
        [],
        creativeDirection?.trim() || prompt,
        creativeExamples,
        negativeCreativeConstraints,
    );

    const trend = createTrendSnapshot({
        trend_score: parsed.estimatedTrend,
        trendMomentum: parsed.estimatedTrend,
    }, 65);
    const aiSignals = {
        estimatedDemandStrength: parsed.estimatedDemandStrength || 50,
        estimatedCompetition: parsed.estimatedCompetition || 50,
        estimatedTrend: parsed.estimatedTrend || 50,
        estimatedBuyerIntent: parsed.estimatedBuyerIntent || 50
    };

    let market: MarketIntel = generateMarketSignals(prompt, trend, aiSignals);
    const scoreData = scoreWithMarketIntel(parsed, market, trend);
    const { projectedRevenue, revenueCategory } = calculateRevenue(prompt, market.trendMomentum);
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

export async function bulkDiscover(userId?: string): Promise<BulkDiscoveryResult> {
    const discoveryResult = await discoverTrends();
    const startTime = Date.now();
    
    console.log(`[BulkDiscover] Sniper v1.1: Validating ${discoveryResult.niches.length} niches...`);

    // REVENUE INTELLIGENCE: Validate and Score every discovered niche
    const analysisResults = await Promise.allSettled(
        discoveryResult.niches.map(async (n) => {
            // v1.1 SAFETY ENGINE: Layer 1-3 Compliance Gate (FIRST STEP)
            const compliance = checkCompliance({ niche: n.niche });
            if (!compliance.safe) {
                return { 
                    status: "DROP", 
                    reason: "COMPLIANCE", 
                    safetyReason: compliance.safetyReason ?? "trademark_exact",
                    niche: n.niche, 
                    score: 0 
                };
            }

            const market = await getMarketData(n.niche);
            const opportunity = computeOpportunity(market, n.finalScore); 
            
            // v1.2 INSTITUTIONAL QUALITY GATES
            const intent = classifyNicheIntent(n.niche);
            const score = opportunity.finalOpportunityScore;

            // 2. Kill Stage: Threshold check based on intent
            if (opportunity.status === "DROP") {
                return { 
                    status: "DROP", 
                    reason: "LOW_SCORE",
                    niche: n.niche, 
                    score, 
                    velocity: opportunity.velocityScore 
                };
            }

            const insights = await generateMarketInsights(opportunity);

            return {
                status: opportunity.status,
                niche: n.niche,
                targetAudience: 'Broad Audience',
                whyItSells: insights || 'High cultural momentum',
                safe: compliance.safe,
                finalScore: opportunity.finalOpportunityScore,
                profitScore: n.profitScore,
                viralScore: n.viralScore,
                // Marketplace Truth
                amazonListings: market.amazon.listings,
                etsyListings: market.etsy.listings,
                avgPrice: (market.amazon.avgPrice + market.etsy.avgPrice) / 2,
                opportunityScore: opportunity.finalOpportunityScore,
                demandScore: opportunity.demandScore,
                competitionScore: opportunity.competitionScore,
                noveltyScore: opportunity.noveltyScore,
                confidence: opportunity.confidence,
                executionConfidence: opportunity.confidence === "real"
                    ? "HIGH"
                    : opportunity.finalOpportunityScore >= 30
                    ? "MEDIUM"
                    : "LOW",
                insight: insights,
                opportunityReasons: opportunity.opportunityReasons, // v1.3 Structured Reasons
            };
        })
    );

    const processed = analysisResults
        .filter((res): res is PromiseFulfilledResult<any> => res.status === 'fulfilled')
        .map(res => res.value);

    const winners = processed.filter(p => p.status === "PASS");
    const watchlisted = processed.filter(p => p.status === "WATCHLIST");
    const dropped = processed.filter(p => p.status === "DROP");
    
    // Safety & Quality Telemetry breakdown
    const complianceDrops = dropped.filter(d => d.reason === "COMPLIANCE");
    const lowScoreDrops = dropped.filter(d => d.reason === "LOW_SCORE");
    const lowConfidenceDrops = dropped.filter(d => d.reason === "LOW_CONFIDENCE");
    
    const exactDrops = complianceDrops.filter(d => d.safetyReason === "trademark_exact").length;
    const fuzzyDrops = complianceDrops.filter(d => d.safetyReason === "trademark_fuzzy").length;
    const derivativeDrops = complianceDrops.filter(d => d.safetyReason === "derivative_content").length;

    // v1.3 INSTITUTIONAL TELEMETRY
    const topDrop = lowScoreDrops.length > 0 ? lowScoreDrops.sort((a, b) => b.score - a.score)[0] : null;
    const realConfidenceCount = processed.filter(p => p.confidence === "real").length;

    console.log(`\n--- Discovery Production Sniper v1.3 Telemetry ---`);
    console.log(`- Pipeline Latency: ${Date.now() - startTime}ms`);
    console.log(`- PASSED Quality Check: ${winners.length}`);
    console.log(`- WATCHLIST (Borderline): ${watchlisted.length}`);
    console.log(`- COMPLIANCE KILL: ${complianceDrops.length} (Exact: ${exactDrops}, Fuzzy: ${fuzzyDrops}, Derivative: ${derivativeDrops})`);
    console.log(`- REVENUE SCORE KILL: ${lowScoreDrops.length}`);
    console.log(`- CONFIDENCE GATE KILL: ${lowConfidenceDrops.length}`);
    console.log(`- DATA FIDELITY: ${realConfidenceCount} Real-World / ${processed.length - realConfidenceCount} Simulated`);
    const highExec = processed.filter(p => p.executionConfidence === "HIGH").length;
    const medExec  = processed.filter(p => p.executionConfidence === "MEDIUM").length;
    const lowExec  = processed.filter(p => p.executionConfidence === "LOW").length;
    console.log(`- EXEC CONFIDENCE: HIGH=${highExec} / MEDIUM=${medExec} / LOW=${lowExec}`);
    if (topDrop) {
        console.log(`- Top Dropped (Non-Compliance): "${topDrop.niche}" (Score: ${topDrop.score})`);
    }
    console.log(`--------------------------------------------------\n`);

    // Prioritize PASS winners, then fill with WATCHLIST if need be (up to 15)
    const finalSelection = [...winners, ...watchlisted]
        .sort((a, b) => (b.opportunityScore || b.score) - (a.opportunityScore || a.score))
        .slice(0, 15);

    // Fallback: if all quality gates produced nothing, take the top-scored non-compliance niches
    // Enforce a minimum opportunityScore floor of 30 and cap at 5 to avoid garbage generation
    if (finalSelection.length === 0) {
        const fallback = processed
            .filter(p => p.reason !== "COMPLIANCE" && (p.opportunityScore ?? p.score ?? 0) >= 30)
            .sort((a, b) => (b.opportunityScore ?? b.score ?? 0) - (a.opportunityScore ?? a.score ?? 0))
            .slice(0, 5);
        finalSelection.push(...fallback);
        if (fallback.length > 0) {
            console.log(`[BulkDiscover] Empty selection — fallback to top ${fallback.length} scored niches (floor ≥30).`);
        }
    }

    // --- Winner Lock & Auto-Listing (prototype) ---------------------------
    // Classify items into WINNER / TEST / DISCARD and auto-generate listing
    // payloads for WINNERs to speed up activation.
    // Evaluate creative conversion strength for a niche by generating top slogans
    async function evaluateConversionFor(niche: string, userId?: string) {
        try {
            const engine = await runEliteSloganEngine({ niche, audience: 'Broad' });
            const top = engine.ranked && engine.ranked[0] ? engine.ranked[0] : null;
            const sloganText = top?.slogan || (engine.slogans && engine.slogans[0]) || '';

            const hookScore = typeof top?.hookScore === 'number' ? top.hookScore : (top?.score || 50);
            const wordCount = sloganText ? sloganText.split(/\s+/).length : 0;
            const brevityScore = wordCount <= 3 ? 100 : wordCount === 4 ? 80 : wordCount === 5 ? 60 : wordCount === 6 ? 40 : 20;
            const wordplayScore = /\b(rhyme|play|punch|wordplay)\b/i.test(sloganText) ? 80 : 50;
            const wearabilityScore = /\b(you|me|we|my)\b/i.test(sloganText) ? 80 : 55;

            const conversionScore = Math.round(
                (hookScore * 0.3) + (brevityScore * 0.2) + (wordplayScore * 0.3) + (wearabilityScore * 0.2)
            );

            return {
                slogan: sloganText,
                hookScore,
                brevityScore,
                wordplayScore,
                wearabilityScore,
                conversionScore,
                topInsight: top || null,
                dynamicProfile: engine.dynamicProfile,
            };
        } catch (err) {
            return null;
        }
    }

    async function generateAdHooksFor(slogan: string) {
        try {
            const prompt = `Generate 3 short ad hooks (social/ad copy style) for the slogan: "${slogan}". Return a JSON array of 3 strings.`;
            const ai = await chatCompletionSafe({
                model: 'gpt-4o-mini',
                temperature: 0.8,
                max_tokens: 200,
                response_format: { type: 'json_object' },
                messages: [{ role: 'system', content: 'You are a punchy ad-copy writer. Return JSON array only.' }, { role: 'user', content: prompt }],
            });
            if (ai.error || !ai.data) return [];
            const text = ai.data.choices[0].message.content || '[]';
            const parsed = parseJsonPayload(text);
            if (Array.isArray(parsed)) return parsed.slice(0,3);
            return [];
        } catch (err) {
            return [];
        }
    }

    async function generateListingPayloadFor(nicheItem: any, conversion: any) {
        try {
            if (!conversion?.slogan || !conversion?.dynamicProfile) return null;
            const dynamicListing = await generateDynamicListing({
                niche: nicheItem.niche,
                slogan: conversion.slogan,
                audience: nicheItem.targetAudience || conversion.dynamicProfile.audience,
                profile: conversion.dynamicProfile,
                marketTerms: [
                    ...(Array.isArray(nicheItem.opportunityReasons) ? nicheItem.opportunityReasons : []),
                    nicheItem.insight || "",
                ],
                purchaseMotives: conversion.dynamicProfile.purchaseMotives,
                marketplace: "etsy",
                configuredBrand: await getConfiguredMerchBrand(userId),
                userId,
            });
            return {
                ...toLegacyListingShape(dynamicListing),
                bullets: dynamicListing.bullets,
                tags: dynamicListing.searchTerms,
                mockupPrompt: dynamicListing.description,
                dynamicListing,
            };
        } catch (err) {
            return null;
        }
    }

    // Apply winner lock statuses and generate listings for winners asynchronously
    const processedWithStatus = await Promise.all(finalSelection.map(async (item) => {
        // Skip all LLM work for LOW execution confidence niches — mark as DISCARD immediately
        if (item.executionConfidence === "LOW") {
            item.status = 'DISCARD';
            return item;
        }
        // Use marketMath niche_score if available (50–80 range); opportunityEngine score is market data quality
        // score and sits much lower (~30–50). Winner/TEST thresholds reference the marketMath scale.
        const trend = createTrendSnapshot(item, item.finalScore ?? 65);
        const market = generateMarketSignals(item.niche, trend);
        const marketScore = scoreWithMarketIntel(item, market, trend);
        const score = marketScore.niche_score;
        item.niche_score = score;
        item.publishPriority = marketScore.publishPriority;
        // Run creative conversion eval for top candidates
        let conversion = null;
        if (score >= 60) {
            conversion = await evaluateConversionFor(item.niche, userId);
            item.conversion = conversion;
        }

        const hasHighConversionSlogan = conversion && conversion.conversionScore >= 65 && (conversion.topInsight?.score ?? 0) >= 70;

        if (score >= 75 && hasHighConversionSlogan) {
            item.status = 'WINNER';
            // generate listing payload tailored to the winning slogan
            try {
                const listing = await generateListingPayloadFor(item, conversion);
                if (listing) {
                    item.autoListing = listing;
                    item.listingQuality = listing.dynamicListing?.quality;
                    item.listingReleaseGate = listing.dynamicListing?.qualityGate;
                    item.listingCompliance = listing.dynamicListing?.compliance;
                }
                const listingReady = Boolean(
                    listing?.dynamicListing?.qualityGate?.passed
                    && listing?.dynamicListing?.compliance?.safe,
                );
                item.listingReviewRequired = !listingReady;
                // also generate ad hooks
                const hooks = await generateAdHooksFor(conversion?.slogan || '');
                if (hooks && hooks.length) item.adHooks = hooks;
                if (listingReady) {
                    // enqueue for launch pipeline only after listing quality and compliance pass
                    try {
                        const learning = require('./learningService');
                        learning.enqueueLaunch({
                            niche: item.niche,
                            slogan: conversion?.slogan || '',
                            listing: item.autoListing,
                            adHooks: item.adHooks,
                            visualBatchMetrics: item.visualBatchMetrics ?? undefined,
                            visualStrategyMetrics: item.visualStrategies?.find((strategy: DynamicDesignStrategy) => strategy.slogan === conversion?.slogan),
                            visualReleaseGate: item.visualReleaseGate,
                        });
                    } catch (e) {
                        // ignore queue failures
                    }
                    // Persist to DB-backed queue when prisma is available
                    try {
                        if (prisma && prisma.listingQueue && typeof prisma.listingQueue.create === 'function' && item.autoListing) {
                        await prisma.listingQueue.create({
                            data: {
                                niche: item.niche,
                                slogan: conversion?.slogan || '',
                                title: (item.autoListing?.title || '').toString().slice(0, 220),
                                bullets: Array.isArray(item.autoListing?.bullets) ? item.autoListing.bullets : [],
                                tags: Array.isArray(item.autoListing?.tags) ? item.autoListing.tags : [],
                                mockupPrompt: item.autoListing?.mockupPrompt || item.autoListing?.description || '',
                                adHooks: Array.isArray(item.adHooks) ? item.adHooks : [],
                                visualBatchMetrics: item.visualBatchMetrics ?? undefined,
                                visualStrategyMetrics: item.visualStrategies?.find((strategy: DynamicDesignStrategy) => strategy.slogan === conversion?.slogan),
                                visualReleaseGate: item.visualReleaseGate,
                                status: 'PENDING',
                                platform: 'etsy',
                            }
                        });
                        // Auto-trigger worker (best-effort, non-blocking)
                        try {
                            const worker = require('./listingWorker');
                            // fire-and-forget
                            setImmediate(() => { worker.runListingWorker().catch((e:any)=>{ console.warn('[factory] worker trigger failed', e && e.message); }); });
                        } catch (e) {
                            // ignore
                        }
                    }
                    } catch (e) {
                        // DB persistence is best-effort; ignore errors here
                    }
                }
            } catch (e) { /* ignore */ }
        } else if (score >= 60) {
            item.status = 'TEST';
        } else {
            item.status = 'DISCARD';
        }
        return item;
    }));

    return {
        niches: processedWithStatus,
        signalSources: discoveryResult.signalSources,
        signalConfidence: discoveryResult.signalConfidence,
    };
}

export async function generateChunk(niches: any[], isAutopilot: boolean = false, userId?: string): Promise<any[]> {
    if (!niches || !Array.isArray(niches)) throw new Error("Niches array required");

    const settledResults = await Promise.allSettled(niches.map(async (nicheData) => {
        try {
            const trend = createTrendSnapshot(nicheData, 65);
            const market = generateMarketSignals(nicheData.niche, trend);
            const score = scoreWithMarketIntel(nicheData, market, trend);
            const { projectedRevenue, revenueCategory } = calculateRevenue(nicheData.niche, market.trendMomentum);

            // Bulk Factory and Autopilot deliberately share the exact same
            // evidence-driven creative path. No parallel slogan prompt exists here.
            const merchPayload = await buildMerchPayload(
                {},
                nicheData.niche,
                nicheData.targetAudience,
                nicheData.style,
                userId,
                nicheData.platform || (isAutopilot ? "amazon" : undefined),
            );
            const topSlogan = merchPayload.winningSlogan;
            const topSloganInsight = merchPayload.sloganInsights?.find((entry: any) => entry.slogan === topSlogan)
                ?? merchPayload.sloganInsights?.[0]
                ?? null;

            if (isAutopilot) {
                return {
                    niche: nicheData.niche,
                    slogan: topSlogan,
                    sloganInsight: topSloganInsight,
                    title: merchPayload.amazonListing.title,
                    bullet_point_1: merchPayload.amazonListing.bulletPoint1,
                    bullet_point_2: merchPayload.amazonListing.bulletPoint2,
                    description: merchPayload.amazonListing.description,
                    trend,
                    projectedRevenue,
                    revenueCategory,
                    ...market,
                    ...merchPayload,
                    ...score,
                };
            }

            const topSloganScore = merchPayload.sloganInsights?.[0]?.score || 50;
            return {
                niche: nicheData.niche,
                audience: nicheData.targetAudience,
                whyItSells: nicheData.whyItSells,
                safe: nicheData.safe,
                trend,
                projectedRevenue,
                revenueCategory,
                ...market,
                ...merchPayload,
                ...score,
                bestSellerPredictor: buildBestSellerPredictor({ ...merchPayload, ...score, ...market }, market, topSloganScore),
                metricsSource: score.metricsSource || market.metricsSource || "simulated",
            };
        } catch (err) {
            logError(`Chunk generation failed for ${nicheData?.niche || "unknown niche"}`, err);
            return null;
        }
    }));

    return settledResults
        .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
        .map((result) => result.value)
        .filter(Boolean);
}
