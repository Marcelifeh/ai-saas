"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFactory, type DesignMode } from "../../../hooks/useFactory";
import { Copy, Sparkles, Wand2, Target, Tags, ShoppingCart, BarChart2 } from "lucide-react";
import { InsightPanel } from "../../../components/dashboard/InsightPanel";
import { AiUsageWidget } from "../../../components/dashboard/AiUsageWidget";
import { safeJson } from "@/lib/utils/safeJson";
import { getVisualReleasePresentation } from "@/lib/utils/visualReleasePresentation";
import CustomStyleSelector, { resolveVisualStyle } from "@/components/design/CustomStyleSelector";

const PRESET_STYLES = [
    "Vintage Distressed",
    "Hand-Drawn",
    "Bold Graphic",
    "Retro Vintage",
    "Minimalist Vector",
    "Retro Neon",
    "Y2K",
];

const DESIGN_MODES: Array<{ value: DesignMode; label: string }> = [
    { value: "AUTO", label: "Auto" },
    { value: "TEXT_ONLY", label: "Text" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "CHARACTER", label: "Human" },
    { value: "CARTOON", label: "Cartoon" },
    { value: "ILLUSTRATION_ONLY", label: "Illustration" },
];

const VISUAL_ENGINE_VERSION = "dynamic-visual-v4";
const LISTING_ENGINE_VERSION = "dynamic-listing-v3";
const STORAGE_KEY = `tf_single_strategy_state_${VISUAL_ENGINE_VERSION}_${LISTING_ENGINE_VERSION}`;

function shortenNiche(name: string): string {
    const s = name
        .replace(/\s*(shirt|tee|t-shirt)s?$/i, "")
        .replace(/\b(fans|lovers|enthusiasts|aficionados)\s+of\s+/gi, "")
        .replace(/\s+who\s+are\s+also\s+/gi, " ")
        .replace(/\s+who\s+are\s+/gi, " ")
        .replace(/\s+who\s+is\s+/gi, " ")
        .replace(/\s+who\s+\S.*$/gi, "")
        .replace(/\s+that\s+are\s+/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
    const words = s.split(" ");
    return words.length > 4 ? words.slice(0, 4).join(" ") : s;
}

type RankedSlogan = {
    slogan: string;
    score: number;
    bucket: "top" | "bold" | "experimental";
    aiScore?: number;
    marketSignalScore?: number;
    wearability: number;
    memorability: number;
    identity: number;
    emotion: number;
    punch: number;
    visualFit?: number;
    hookScore?: number;
    symmetry?: number;
    lineBreakPotential?: number;
    fontImpact?: number;
    contrastScore?: number;
    curiosityGap?: number;
    emotionalTriggerScore?: number;
    genericPenalty?: number;
    pattern?: string;
    tags?: string[];
    variants?: string[];
    salesSignals?: {
        ctr?: number;
        conversionRate?: number;
        favorites?: number;
    };
    reasons?: string[];
};

type SloganCollections = {
    topPicks?: RankedSlogan[];
    boldPicks?: RankedSlogan[];
    experimental?: RankedSlogan[];
};

type VisualStrategy = {
    slogan: string;
    visualImpact: number;
    qualityGatePassed: boolean;
    diversityPenalty: number;
    requestedDesignMode: DesignMode;
    resolvedDesignMode: Exclude<DesignMode, "AUTO">;
    designModeDecision: { mode: Exclude<DesignMode, "AUTO">; confidence: number; rationale: string };
    modeCompliance: { modeComplianceScore: number; violations: string[] };
    concept: { coreMessage: string };
    composition: { primaryFocus: "typography" | "illustration" | "hybrid" };
    complexity: { supportingDetailLevel: "minimal" | "controlled" | "moderate" };
    fingerprint: { metaphorType: string };
    quality: {
        thumbnailLegibility: number;
        focalClarity: number;
        silhouetteStrength: number;
        textGraphicIntegration: number;
        contrast: number;
        printability: number;
        visualOriginality: number;
        sloganReinforcement: number;
    };
};

type VisualReleaseWarningView = {
    metric: string;
    actual: number;
    threshold: number;
    expectation: "minimum" | "maximum";
};

type VisualReleaseGateView = {
    status: "NOT_EVALUATED" | "INSUFFICIENT_SAMPLE" | "PASS" | "REVIEW";
    evaluated: boolean;
    passed: boolean;
    sampleSize: number;
    repairAttempts: number;
    maxRepairAttempts: number;
    unresolvedMetrics: string[];
    warnings: VisualReleaseWarningView[];
    reason?: string;
};

type ListingMarketplace = "amazon_merch" | "etsy" | "general";

type DynamicListingView = {
    title: string;
    brand: string | null;
    brandStrategy: {
        source: "configured" | "generated_candidate" | "none";
        label: string;
        verified: boolean;
        warning?: string;
    };
    bullets: string[];
    description: string;
    searchTerms: string[];
    marketplace: ListingMarketplace;
    quality: {
        buyerIdentityAlignment: number;
        nicheSpecificity: number;
        behavioralRelevance: number;
        searchIntentCoverage: number;
        bulletSeoQuality: number;
        keywordNaturalness: number;
        giftIntent: number;
        repetitionScore: number;
        readability: number;
        complianceConfidence: number;
        claimGrounding: number;
        listingQualityScore: number;
    };
    seoAudit: {
        titleCoverage: number;
        bulletCoverage: number;
        backendCoverage: number;
        buyerIntent: number;
        naturalness: number;
        duplicatePhraseRate: number;
        unsupportedTerms: number;
        overallScore: number;
        bulletKeywords: string[];
    };
    qualityGate: {
        status: "PASS" | "REVIEW";
        passed: boolean;
        warnings: string[];
        repairAttempts: number;
    };
    compliance: { safe: boolean; confidence: number; riskLevel: string; warnings: string[] };
    grounding: { score: number; attributionCoverage: number; unsupportedClaims: unknown[] };
    engineVersion: string;
};

const marketplaceLabels: Record<ListingMarketplace, string> = {
    amazon_merch: "Amazon Merch",
    etsy: "Etsy",
    general: "General POD",
};

function mapListingMarketplace(value: string): ListingMarketplace {
    if (value === "amazon") return "amazon_merch";
    if (value === "etsy") return "etsy";
    return "general";
}

const visualMetricLabels: Record<string, string> = {
    primaryFocusDiversity: "Focus diversity",
    compositionFamilyDiversity: "Composition diversity",
    visualMetaphorDiversity: "Metaphor diversity",
    supportingObjectOverlap: "Supporting-object overlap",
    typographyRoleDiversity: "Typography-role diversity",
    commercialQualityScore: "Commercial quality",
    averageModeCompliance: "Mode compliance",
};

function formatVisualMetric(value: number): string {
    return Math.abs(value) <= 1 ? value.toFixed(2) : Math.round(value).toString();
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function SingleStrategyContent() {
    const { generateSingleStrategy, regenerateSlogans, regenerateDesigns, repackageListing, recordSalesFeedback, isLoading, isSloganRefreshing, isDesignRefreshing, isListingRefreshing, error } = useFactory();
    const searchParams = useSearchParams();
    const [prompt, setPrompt] = useState("");
    const [platform, setPlatform] = useState("amazon");
    const [audience, setAudience] = useState("");
    const [style, setStyle] = useState("Vintage Distressed");
    const [designMode, setDesignMode] = useState<DesignMode>("AUTO");
    const [result, setResult] = useState<any | null>(null);
    const [insights, setInsights] = useState<any[] | null>(null);
    const [trendsLoading, setTrendsLoading] = useState(false);
    const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
    const [crossoverTopics, setCrossoverTopics] = useState<string[]>([]);
    const [selectedDesignStyle, setSelectedDesignStyle] = useState<string>("Vintage Distressed");
    const [customStyle, setCustomStyle] = useState("");
    const [collapsedPrompts, setCollapsedPrompts] = useState<Record<string, boolean>>({});
    const [copiedListing, setCopiedListing] = useState(false);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState<{ slogan: string; sloganIdx: number } | null>(null);
    const [feedbackInputs, setFeedbackInputs] = useState({ impressions: "", clicks: "", orders: "" });
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
    const [showListingMetrics, setShowListingMetrics] = useState(false);
    const [showSeoAudit, setShowSeoAudit] = useState(false);

    // Combines custom free-form style (takes priority) with the active preset.
    // Falls back to "Bold Graphic" if neither is set — matching the downstream engine default.
    const resolvedVisualStyle = useMemo(
        () => resolveVisualStyle(customStyle, selectedDesignStyle || style),
        [customStyle, selectedDesignStyle, style],
    );

    const demandScore = result ? Math.round(result.searchVolume ?? 0) : null;
    const compScore = result ? Math.round(result.competitionDensity ?? 0) : null;
    const trendScore = result ? Math.round(result.trend?.score ?? result.trendMomentum ?? 0) : null;
    const buyerIntentScore = result ? Math.round(result.buyerIntent ?? 0) : null;
    const sloganCollections = (result?.sloganCollections || {}) as SloganCollections;
    const rankedSlogans = (result?.sloganInsights || []) as RankedSlogan[];
    const designSlogans = result?.shirtSlogans || [];
    const visualStrategies = (result?.visualStrategies || []) as VisualStrategy[];
    const visualReleaseGate = result?.visualReleaseGate as VisualReleaseGateView | undefined;
    const visualReleaseEvaluated = visualReleaseGate?.evaluated === true;
    const visualReleasePresentation = getVisualReleasePresentation(visualReleaseGate);
    const visualReleasePassed = visualReleasePresentation.tone === "success";
    const visualReleaseNeedsReview = visualReleasePresentation.showReviewWarning;
    const dynamicListing = result?.dynamicListing as DynamicListingView | undefined;
    const listingQuality = dynamicListing?.quality;
    const listingScore = listingQuality?.listingQualityScore;
    const listingBand = (value?: number) => value == null ? "Pending" : value >= 85 ? "High" : value >= 70 ? "Strong" : "Review";

    const describeBand = (value: number | null) => {
        if (value == null || Number.isNaN(value)) return "Medium";
        if (value >= 70) return "High";
        if (value >= 40) return "Medium";
        return "Low";
    };

    const confidenceLabel = describeBand(result ? result.niche_score ?? null : null);

    const demandLabel = describeBand(demandScore);
    const competitionLabel = describeBand(compScore);

    const combinedTrendingTopics = [...trendingTopics, ...crossoverTopics];

    useEffect(() => {
        const nicheFromQuery = searchParams.get("niche");
        if (nicheFromQuery && !result && !prompt) {
            setPrompt(nicheFromQuery);
        }
    }, [searchParams, result, prompt]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) return;
        const data = await generateSingleStrategy(prompt, platform, audience, style, designMode);
        if (data) {
            setResult(data);
            try {
                const payload = {
                    prompt,
                    platform,
                    audience,
                    style,
                    designMode,
                    result: data,
                };
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
                }
            } catch (err) {
                console.error("Failed to persist strategy state", err);
            }
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        // If a niche is being passed in from Autopilot, prefer that over
        // any previously stored state to avoid loading an old strategy.
        const nicheFromQuery = searchParams.get("niche");
        if (nicheFromQuery) {
            return;
        }

        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (saved && typeof saved === "object") {
                if (
                    saved.result?.visualEngineVersion !== VISUAL_ENGINE_VERSION
                    || saved.result?.dynamicListing?.engineVersion !== LISTING_ENGINE_VERSION
                ) {
                    window.localStorage.removeItem(STORAGE_KEY);
                    return;
                }
                if (typeof saved.prompt === "string") setPrompt(saved.prompt);
                if (typeof saved.platform === "string") setPlatform(saved.platform);
                if (typeof saved.audience === "string") setAudience(saved.audience);
                if (typeof saved.style === "string") {
                    setStyle(saved.style);
                    setSelectedDesignStyle(saved.style || "Vintage Distressed");
                }
                if (DESIGN_MODES.some((mode) => mode.value === saved.designMode)) setDesignMode(saved.designMode);
                if (saved.result) setResult(saved.result);
            }
        } catch (err) {
            console.error("Failed to restore strategy state", err);
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchInsights() {
            try {
                const res = await fetch("/api/analytics/insights");
                if (!res.ok) return;
                const data = await safeJson<{ success?: boolean; insights?: unknown[] }>(res);
                if (data.success && data.insights) {
                    setInsights(data.insights);
                }
            } catch (err) {
                console.error("Failed to fetch insights", err);
            }
        }

        fetchInsights();
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function fetchTrending() {
            try {
                setTrendsLoading(true);
                const res = await fetch("/api/discover", { method: "POST" });
                let topics: string[] | null = null;
            const combos: string[] = [];

                if (res.ok) {
                    const data = await safeJson<{ success?: boolean; opportunities?: unknown[] }>(res);
                    if (data.success && Array.isArray(data.opportunities)) {
                        type DiscoveryOpportunity = {
                            niche: string;
                            projectedRevenue?: number;
                        };

                        const opps = [...data.opportunities].filter((o): o is DiscoveryOpportunity =>
                            Boolean(o && typeof (o as DiscoveryOpportunity).niche === "string")
                        );

                        topics = opps
                            .map((o) => o.niche)
                            .filter((n) => typeof n === "string" && n.trim().length > 0)
                            .slice(0, 6);

                        if (opps.length >= 2) {
                            opps.sort((a, b) => (b.projectedRevenue || 0) - (a.projectedRevenue || 0));
                            const top = opps.slice(0, 5);
                            for (let i = 0; i < top.length; i++) {
                                for (let j = i + 1; j < top.length; j++) {
                                    const a = top[i];
                                    const b = top[j];
                                    combos.push(`${shortenNiche(a.niche)} × ${shortenNiche(b.niche)}`);
                                    if (combos.length >= 3) break;
                                }
                                if (combos.length >= 3) break;
                            }
                        }
                    }
                }

                if (!topics || topics.length === 0) {
                    topics = [
                        "Cozy introvert creators",
                        "Dark academia book lovers",
                        "Retro gaming coffee addicts",
                        "Anxious pet parents",
                        "Studio photographers on the go",
                        "Mindful hustle culture escapees",
                    ];
                }

                if (!cancelled) {
                    if (combos.length === 0 && topics.length >= 2) {
                        for (let i = 0; i < topics.length - 1 && combos.length < 3; i++) {
                            combos.push(`${shortenNiche(topics[i])} × ${shortenNiche(topics[i + 1])}`);
                        }
                    }
                    setTrendingTopics(topics);
                    setCrossoverTopics(combos);
                }
            } catch (err) {
                console.error("Failed to fetch trending topics", err);
                if (!cancelled) {
                    const fallbackTopics = [
                        "Cozy introvert creators",
                        "Dark academia book lovers",
                        "Retro gaming coffee addicts",
                        "Anxious pet parents",
                        "Studio photographers on the go",
                        "Mindful hustle culture escapees",
                    ];
                    const fallbackCombos = [
                        "Cozy introvert creators × Dark academia book lovers",
                        "Retro gaming coffee addicts × Studio photographers on the go",
                    ];
                    setTrendingTopics(fallbackTopics);
                    setCrossoverTopics(fallbackCombos);
                }
            } finally {
                if (!cancelled) setTrendsLoading(false);
            }
        }

        fetchTrending();

        return () => {
            cancelled = true;
        };
    }, []);

    const getSloganBadges = (entry: RankedSlogan) => {
        const badges: { label: string; color: string }[] = [];
        if (entry.bucket === "top") badges.push({ label: "⭐ Elite Pick", color: "emerald" });
        if ((entry.hookScore ?? 0) >= 80) badges.push({ label: "🔥 Viral", color: "orange" });
        if ((entry.emotionalTriggerScore ?? 0) >= 65) badges.push({ label: "❤️ Emotion", color: "rose" });
        if ((entry.wearability ?? 0) >= 85) badges.push({ label: "👕 Wearable", color: "blue" });
        if ((entry.marketSignalScore ?? 0) >= 40) badges.push({ label: "💰 Market", color: "amber" });
        return badges;
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackModal || !result) return;
        setFeedbackSubmitting(true);
        const selectedVisualStrategy = visualStrategies.find((strategy) => strategy.slogan === feedbackModal.slogan);
        await recordSalesFeedback({
            niche: result.niche || prompt,
            slogan: feedbackModal.slogan,
            impressions: feedbackInputs.impressions ? parseInt(feedbackInputs.impressions, 10) : undefined,
            clicks: feedbackInputs.clicks ? parseInt(feedbackInputs.clicks, 10) : undefined,
            orders: feedbackInputs.orders ? parseInt(feedbackInputs.orders, 10) : undefined,
            visualBatchMetrics: result.visualBatchMetrics ?? undefined,
            visualStrategyMetrics: selectedVisualStrategy ? {
                visualImpact: selectedVisualStrategy.visualImpact,
                qualityGatePassed: selectedVisualStrategy.qualityGatePassed,
                diversityPenalty: selectedVisualStrategy.diversityPenalty,
                quality: selectedVisualStrategy.quality,
                complexity: selectedVisualStrategy.complexity,
                fingerprint: selectedVisualStrategy.fingerprint,
                primaryFocus: selectedVisualStrategy.composition.primaryFocus,
            } : undefined,
            visualReleaseGate: result.visualReleaseGate,
        });
        setFeedbackSubmitting(false);
        setFeedbackModal(null);
        setFeedbackInputs({ impressions: "", clicks: "", orders: "" });
    };

    const handleExportCsv = () => {
        if (!result) return;

        const headers = [
            "niche",
            "slogan",
            "status",
            "niche_score",
            "title",
            "brand_name",
            "bullet_point_1",
            "bullet_point_2",
            "description",
            "blacklist_flag",
            "tmhunt_flag",
            "safe",
            "prompt",
            "search_volume",
            "competition_density",
            "trend_momentum",
            "buyer_intent",
            "opportunity_index",
            "image_prompt",
        ];

        const csvSafe = (text: unknown) => {
            if (text === undefined || text === null) return "";
            return `"${String(text).replace(/"/g, '""')}"`;
        };

        const rows: string[] = [];
        rows.push(headers.join(","));

        if (Array.isArray(result.shirtSlogans)) {
            result.shirtSlogans.forEach((slogan: string, sloganIdx: number) => {
                // Resolve the image prompt for this slogan and apply the active design style so the
                // exported CSV never contains the raw [STYLE] placeholder token.
                const rawPrompt: string = Array.isArray(result.imagePrompts) ? (result.imagePrompts[sloganIdx] ?? "") : "";
                const exportPrompt = injectStyle(rawPrompt, resolvedVisualStyle || "Bold Graphic");
                const row = [
                    csvSafe(result.niche),
                    csvSafe(slogan),
                    csvSafe(result.decision),
                    result.niche_score ?? "",
                    csvSafe(result.amazonListing?.title || ""),
                    csvSafe(result.amazonListing?.brandName || ""),
                    csvSafe(result.amazonListing?.bulletPoint1 || ""),
                    csvSafe(result.amazonListing?.bulletPoint2 || ""),
                    csvSafe(result.amazonListing?.description || ""),
                    result.safe === false ? "TRUE" : "FALSE",
                    "",
                    result.safe !== false ? "TRUE" : "FALSE",
                    csvSafe(prompt),
                    result.searchVolume ?? "",
                    result.competitionDensity ?? "",
                    result.trendMomentum ?? "",
                    result.buyerIntent ?? "",
                    result.opportunityIndex ?? "",
                    csvSafe(exportPrompt),
                ];
                rows.push(row.join(","));
            });
        }

        const csvContent = rows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "pod_research.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const injectStyle = (text: string, designStyle: string): string => {
        if (!text || !designStyle) return text;

        // Dynamic prompts keep the concept fixed and expose one rendering-only seam.
        if (/ART DIRECTION:\s*\n[^\n]*/i.test(text)) {
            return text.replace(/ART DIRECTION:\s*\n[^\n]*/i, `ART DIRECTION:\n${designStyle}`);
        }

        // If placeholder token exists, replace it
        if (text.includes("[STYLE]")) {
            return text.replace(/\[STYLE\]/g, designStyle);
        }

        // Try to rewrite existing Style: line
        if (/Style:\s*[^\n]+/i.test(text)) {
            return text.replace(/Style:\s*([^—\n]+)?/i, (match) => {
                const dashIndex = match.indexOf("—");
                if (dashIndex && dashIndex > -1) {
                    const rest = match.slice(dashIndex);
                    return `Style: ${designStyle} ${rest}`;
                }
                return `Style: ${designStyle}`;
            });
        }

        // Fallback: insert after Text: line
        return text.replace(/(Text:\s*"[^"]*")/i, `$1\nStyle: ${designStyle}`);
    };

    const enhancePromptWithStandards = (text: string): string => {
        const suffix = "Transparent background. Commercial-friendly original artwork. Deliver the highest-resolution print-ready composition supported by the image pipeline.";
        if (!text) return suffix;

        // Avoid duplicating if already present
        if (text.includes("BACKGROUND:") || text.includes("Transparent background")) {
            return text;
        }

        const trimmed = text.trim().replace(/[.!?]*$/, "");
        return `${trimmed}. ${suffix}`;
    };

    const toggleCollapse = (slogan: string) => {
        setCollapsedPrompts((prev) => ({
            ...prev,
            [slogan]: !(prev[slogan] ?? true),
        }));
    };

    const handleCopyListing = () => {
        if (!result?.amazonListing) return;

        const listing = result.amazonListing;
        const keywords = Array.isArray(listing.keywords) ? listing.keywords.join(", ") : "";
        const text = `${listing.title || ""}\n\n${listing.brandName || ""}\n\n${listing.bulletPoint1 || ""}\n${listing.bulletPoint2 || ""}\n\n${listing.description || ""}\n\n${keywords}`;

        navigator.clipboard.writeText(text);
        setCopiedListing(true);
        setTimeout(() => setCopiedListing(false), 1500);
    };

    const handleListingRefresh = async (marketplace: ListingMarketplace) => {
        if (!result?.dynamicProfile || !result?.winningSlogan) return;
        const selectedStrategy = visualStrategies.find((entry) => entry.slogan === result.winningSlogan);
        const seo = result.seoKeywords || {};
        const marketTerms = [
            seo.primary,
            ...(Array.isArray(seo.longTail) ? seo.longTail : []),
            ...(Array.isArray(seo.buyerIntent) ? seo.buyerIntent : []),
            ...(Array.isArray(seo.platformTags) ? seo.platformTags : []),
        ].filter((term): term is string => typeof term === "string" && term.trim().length > 0);
        const data = await repackageListing({
            niche: result.niche || prompt,
            slogan: result.winningSlogan,
            audience: audience || result.dynamicProfile.audience,
            profile: result.dynamicProfile,
            visualStrategy: selectedStrategy,
            marketTerms,
            purchaseMotives: result.dynamicProfile.purchaseMotives,
            marketplace,
            visualStyle: resolvedVisualStyle,
        }) as { dynamicListing?: DynamicListingView; amazonListing?: Record<string, unknown> } | null;
        if (!data?.dynamicListing || !data.amazonListing) return;

        const nextPlatform = marketplace === "amazon_merch" ? "amazon" : marketplace === "etsy" ? "etsy" : "shopify";
        const nextResult = { ...result, ...data, platform: nextPlatform, detectedPlatform: nextPlatform };
        setPlatform(nextPlatform);
        setResult(nextResult);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
                prompt,
                platform: nextPlatform,
                audience,
                style,
                designMode,
                result: nextResult,
            }));
        } catch (err) {
            console.error("Failed to persist repackaged listing", err);
        }
    };

    const handleRegenerateSlogans = async () => {
        if (!result || !prompt) return;

        const data = await regenerateSlogans(
            result.niche || prompt,
            platform,
            audience,
            style,
            Array.isArray(result.shirtSlogans) ? result.shirtSlogans : rankedSlogans.map((entry) => entry.slogan),
            designMode,
        );

        if (!data || typeof data !== "object") return;

        const nextResult = {
            ...result,
            ...data,
        };

        setResult(nextResult);
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    prompt,
                    platform,
                    audience,
                    style,
                    designMode,
                    result: nextResult,
                }));
            }
        } catch (err) {
            console.error("Failed to persist regenerated slogans", err);
        }
    };

    const handleRegenerateDesigns = async () => {
        if (!result?.dynamicProfile || designSlogans.length === 0) return;
        const data = await regenerateDesigns({
            niche: result.niche || prompt,
            slogans: designSlogans,
            profile: result.dynamicProfile,
            style: resolvedVisualStyle,
            platform,
            designMode,
        }) as Record<string, unknown> | null;
        if (!data) return;
        const nextResult = { ...result, ...data };
        setResult(nextResult);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ prompt, platform, audience, style, designMode, result: nextResult }));
        } catch (err) {
            console.error("Failed to persist regenerated designs", err);
        }
    };


    return (
        <div className="w-full max-w-6xl px-4 sm:px-8 py-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Wand2 className="w-8 h-8 text-emerald-400" />
                    Strategy Factory
                </h1>
                <p className="text-gray-400 mt-2">Generate a complete cross-platform POD listing strategy from a single niche idea.</p>
            </header>

            <InsightPanel insights={insights} />

            <AiUsageWidget />

            {/* Input Form at top */}
            <div className="w-full mb-8">
                <form onSubmit={handleGenerate} className="px-6 py-4 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Niche / Concept Idea *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. Sarcastic introverted raccoons who love coffee..."
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none transition-all"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2 items-center">
                                <span className="text-xs font-bold text-gray-400 self-center mr-1 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.281.438-.509.966-.713 1.5l-.264.69c-.066.173-.133.344-.222.501a1 1 0 00-.096.177 4.965 4.965 0 011.026 1.838 5.011 5.011 0 01.11 1.76l-.083.473a1 1 0 001.62.946c.551-.433.953-.943 1.256-1.463a4.981 4.981 0 00.564-1.724l.011-.11a1 1 0 00-.2-.68c-.144-.19-.304-.373-.473-.55-.385-.4-.764-.812-.904-1.282A8.618 8.618 0 0112 4.192V4c0-.495.093-.976.242-1.427a1 1 0 00-.323-1.05z"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            fillRule="evenodd"
                                            d="M7 6a5 5 0 1010 0 1 1 0 00-1-1h-1.5A3.5 3.5 0 0111 1.5 1 1 0 0010 .5a4.5 4.5 0 00-4 4 1 1 0 001 1H8v1.5A3.5 3.5 0 014.5 10a1 1 0 00-1 1A4.5 4.5 0 008 15v1a1 1 0 001 1h2a1 1 0 001-1v-2h1a5 5 0 005-5 1 1 0 00-1-1h-1.5A3.5 3.5 0 0113 4.5c.29-.026.574-.083.847-.168a6.5 6.5 0 016.153 10.668A6.5 6.5 0 0112 21a6.471 6.471 0 01-5-2.397A6.5 6.5 0 012 12c0-3.15 2.251-5.787 5.253-6.425.068.163.14.322.217.478l.264.69c.174.453.385.93.633 1.341.253.42.569.79.953 1.045l.939.626A5.006 5.006 0 0012 10z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Trending:
                                </span>
                                {trendsLoading
                                    ? [1, 2, 3, 4, 5, 6].map((i) => (
                                          <span
                                              key={i}
                                              className="h-7 w-20 bg-gray-800 rounded-full animate-pulse inline-block"
                                          ></span>
                                      ))
                                    : combinedTrendingTopics.map((preset, i) => (
                                          <button
                                              key={i}
                                              onClick={() => setPrompt(preset)}
                                              className="text-xs bg-gray-100/5 hover:bg-blue-500/10 text-gray-300 hover:text-blue-300 font-bold py-1.5 px-3 rounded-full transition-colors border border-gray-700 hover:border-blue-500/60"
                                          >
                                              {preset}
                                          </button>
                                      ))}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedOptions((prev) => !prev)}
                                    className="w-full flex items-center justify-between px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 hover:border-emerald-500/60 hover:text-emerald-300 transition-colors"
                                >
                                    <span>Show other options</span>
                                    <svg
                                        className={`w-4 h-4 transform transition-transform ${showAdvancedOptions ? "rotate-180" : "rotate-0"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showAdvancedOptions && (
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Platform Focus</label>
                                            <select
                                                value={platform}
                                                onChange={(e) => setPlatform(e.target.value)}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            >
                                                <option value="amazon">Amazon Merch</option>
                                                <option value="etsy">Etsy</option>
                                                <option value="redbubble">Redbubble</option>
                                                <option value="shopify">Shopify / General</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Audience Targeting</label>
                                            <input
                                                type="text"
                                                value={audience}
                                                onChange={(e) => setAudience(e.target.value)}
                                                placeholder="e.g. Gen Z college students"
                                                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Design Mode</label>
                                            <div className="flex flex-wrap gap-2">
                                                {DESIGN_MODES.map((mode) => (
                                                    <button
                                                        key={mode.value}
                                                        type="button"
                                                        onClick={() => setDesignMode(mode.value)}
                                                        className={`text-[10px] font-bold px-3 py-1.5 rounded-md border uppercase tracking-wide transition-all ${designMode === mode.value ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-950 text-gray-300 border-gray-700 hover:border-emerald-500/50"}`}
                                                    >
                                                        {mode.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Design Style</label>
                                            <input
                                                type="text"
                                                value={style}
                                                onChange={(e) => {
                                                    setStyle(e.target.value);
                                                    setSelectedDesignStyle(e.target.value || "");
                                                }}
                                                placeholder="e.g. Retro 90s Vintage"
                                                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !prompt}
                                className="w-full flex items-center justify-center gap-2 mt-6 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Sparkles className="w-5 h-5" />
                                )}
                                {isLoading ? "Synthesizing..." : "Generate Strategy"}
                            </button>

                            {error && <div className="text-red-400 text-sm mt-4 text-center">{error}</div>}
                        </div>
                    </form>
            </div>

            {/* Results Display - full width */}
            <div className="space-y-6">
                    {!result && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-gray-800 rounded-2xl text-center p-8">
                            <Target className="w-16 h-16 text-gray-700 mb-4" />
                            <h3 className="text-xl font-medium text-gray-500 mb-2">Awaiting your idea</h3>
                            <p className="text-gray-600 max-w-sm">Enter a niche concept above, and our AI will build a complete, ready-to-publish retail strategy.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-gray-800/50 bg-gray-900/20 rounded-2xl">
                            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                            <p className="text-emerald-400 font-medium animate-pulse">Analyzing market demand & generating blueprints...</p>
                        </div>
                    )}

                    {result && !isLoading && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-gray-300">
                                    AI Retail Blueprint for <span className="text-emerald-400">{result.niche}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleExportCsv}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold uppercase tracking-wide text-white shadow-sm shadow-emerald-900/40"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        ></path>
                                    </svg>
                                    Export CSV Data
                                </button>
                            </div>
                            {/* Strategy Overview + Metrics */}
                            <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Strategy Overview</h2>
                                        <p className="text-xs text-gray-500 mt-1">Full analysis and generation results for your niche concept.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
                                        <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Niche Score</div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-emerald-400">{result.niche_score}</span>
                                                <span className="text-xs text-gray-500 font-semibold">/100</span>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Decision</div>
                                            <div className={`inline-block text-xs font-black px-2.5 py-1 rounded-full border ${
                                                result.decision === 'PUBLISH'
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : result.decision === 'SKIP'
                                                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                            }`}>
                                                {result.decision === 'PUBLISH' ? '🟢 SELL NOW' : result.decision === 'SKIP' ? '🔴 SKIP' : result.decision === 'TEST' ? '🟡 TEST' : result.decision || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Est. Revenue / mo</div>
                                            <div className="text-sm font-bold text-white">${result.projectedRevenue}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-800 flex flex-col gap-3">
                                    <div className="flex flex-wrap gap-3 text-[11px] text-gray-300">
                                        <span>
                                            Confidence <span className="font-semibold text-emerald-400">{confidenceLabel}</span>
                                        </span>
                                        <span>
                                            Average Demand <span className="font-semibold text-blue-300">{demandLabel}</span>
                                        </span>
                                        <span>
                                            Competition <span className="font-semibold text-amber-300">{competitionLabel}</span>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Demand</div>
                                            <div className="text-sm font-black text-white">{demandScore ?? '—'}</div>
                                        </div>
                                        <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Comp</div>
                                            <div className="text-sm font-black text-white">{compScore ?? '—'}</div>
                                        </div>
                                        <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Trend</div>
                                            <div className="text-sm font-black text-white">{trendScore ?? '—'}</div>
                                        </div>
                                        <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Buyer Intent</div>
                                            <div className="text-sm font-black text-white">{buyerIntentScore ?? '—'}</div>
                                        </div>
                                    </div>

                                    {(result.sloganPersona || result.sloganMode || result.bestSellerPredictor) && (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Persona Lens</div>
                                                    <div className="text-sm font-bold text-white">{result.sloganPersona || 'Broad Audience'}</div>
                                                </div>
                                                <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Slogan Mode</div>
                                                    <div className="text-sm font-bold text-indigo-300 uppercase">{result.sloganMode || 'safe'}</div>
                                                </div>
                                                <div className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Best Seller Predictor</div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xl font-black text-amber-300">{result.bestSellerPredictor?.score ?? '—'}</span>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{result.bestSellerPredictor?.confidence || 'watch'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {(Array.isArray(result.bestSellerPredictor?.features) || Array.isArray(result.bestSellerPredictor?.rationale)) && (
                                                <div className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3">
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {Array.isArray(result.bestSellerPredictor?.features) && result.bestSellerPredictor.features.map((feature: string, featureIndex: number) => (
                                                            <span
                                                                key={`predictor-feature-${featureIndex}`}
                                                                className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest text-amber-200"
                                                            >
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {Array.isArray(result.bestSellerPredictor?.rationale) && result.bestSellerPredictor.rationale.length > 0 && (
                                                        <p className="text-xs text-gray-400 leading-relaxed">
                                                            {result.bestSellerPredictor.rationale.join(' • ')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Optimized SEO Strategy */}
                            {result.seoKeywords?.primary && (
                                <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                        <span className="bg-blue-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono">#</span>
                                        Optimized SEO Strategy
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Keyword</h4>
                                            <div className="inline-block bg-blue-500/10 text-blue-200 py-2 px-4 rounded-lg font-mono font-bold text-lg border border-blue-500/40">
                                                {result.seoKeywords.primary}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Long-tail</h4>
                                                <ul className="space-y-1">
                                                    {result.seoKeywords.longTail?.map((kw: string, i: number) => (
                                                        <li
                                                            key={i}
                                                            className="text-xs sm:text-sm text-gray-300 font-medium bg-gray-950 px-2 py-1 rounded border border-gray-800"
                                                        >
                                                            {kw}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Buyer Intent</h4>
                                                <ul className="space-y-1">
                                                    {result.seoKeywords.buyerIntent?.map((kw: string, i: number) => (
                                                        <li
                                                            key={i}
                                                            className="text-xs sm:text-sm text-gray-300 font-medium bg-gray-950 px-2 py-1 rounded border border-gray-800"
                                                        >
                                                            {kw}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform Tags</h4>
                                                <ul className="flex flex-wrap gap-1">
                                                    {result.seoKeywords.platformTags?.map((kw: string, i: number) => (
                                                        <li
                                                            key={i}
                                                            className="text-xs sm:text-sm text-gray-200 font-medium bg-gray-950 px-2 py-1 rounded-full border border-gray-800"
                                                        >
                                                            #{kw}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Why it Sells */}
                            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-emerald-400" />
                                    Why This Sells
                                </h3>
                                <p className="text-gray-300 leading-relaxed">{result.whyItSells}</p>
                                <p className="text-gray-400 text-sm mt-3 pt-3 border-t border-gray-800">
                                    <span className="text-emerald-500 font-medium">Emotional Trigger:</span> {result.emotionalTrigger}
                                </p>
                            </div>

                            {/* Listing Optimization */}
                            <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl">
                                <div className="flex flex-col gap-4 mb-4">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Tags className="w-5 h-5 text-blue-400" />
                                                {dynamicListing ? `${marketplaceLabels[dynamicListing.marketplace]} Listing` : platform === "amazon" ? "Amazon Merch Listing" : `${platform.toUpperCase()} Listing`}
                                            </h3>
                                            {listingScore != null && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowListingMetrics((value) => !value)}
                                                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${dynamicListing?.qualityGate.passed ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-amber-500/40 bg-amber-500/10 text-amber-300"}`}
                                                >
                                                    Listing quality {listingScore}
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCopyListing}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs font-black py-2 px-4 rounded-lg shadow-sm flex items-center justify-center min-w-[150px] transition-colors uppercase tracking-wider"
                                        >
                                        {copiedListing ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                Copied 
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                </svg>
                                                Copy Full Listing
                                            </span>
                                        )}
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-800 pt-3">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-200">
                                                Buyer fit: {listingBand(listingQuality?.buyerIdentityAlignment)}
                                            </span>
                                            <button
                                                type="button"
                                                aria-expanded={showSeoAudit}
                                                onClick={() => setShowSeoAudit((value) => !value)}
                                                className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 hover:border-indigo-400"
                                            >
                                                SEO: {listingBand(dynamicListing?.seoAudit?.overallScore ?? listingQuality?.searchIntentCoverage)}
                                            </button>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${dynamicListing?.compliance.safe ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" : "bg-amber-500/10 border-amber-500/30 text-amber-200"}`}>
                                                Compliance: {dynamicListing?.compliance.safe ? "Pass" : "Review"}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${dynamicListing?.grounding?.score === 100 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" : "bg-amber-500/10 border-amber-500/30 text-amber-200"}`}>
                                                Grounding: {dynamicListing?.grounding?.score === 100 ? "Pass" : "Review"}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5" aria-label="Marketplace intent">
                                            {(["amazon_merch", "etsy", "general"] as ListingMarketplace[]).map((marketplace) => (
                                                <button
                                                    key={marketplace}
                                                    type="button"
                                                    disabled={isListingRefreshing}
                                                    onClick={() => handleListingRefresh(marketplace)}
                                                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors disabled:opacity-50 ${dynamicListing?.marketplace === marketplace ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-950 border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-200"}`}
                                                >
                                                    {isListingRefreshing && dynamicListing?.marketplace !== marketplace ? "…" : marketplaceLabels[marketplace]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {showSeoAudit && dynamicListing?.seoAudit && (
                                    <div className="mb-4 p-4 rounded-xl bg-gray-950 border border-indigo-500/30">
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">SEO coverage audit</div>
                                                <div className="mt-1 text-xs text-gray-400">Grounded customer-copy phrases are measured separately from backend-only terms.</div>
                                            </div>
                                            <div className="text-lg font-black text-white">{dynamicListing.seoAudit.overallScore}</div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                            {[
                                                ["Title coverage", dynamicListing.seoAudit.titleCoverage],
                                                ["Bullet coverage", dynamicListing.seoAudit.bulletCoverage],
                                                ["Backend coverage", dynamicListing.seoAudit.backendCoverage],
                                                ["Buyer intent", dynamicListing.seoAudit.buyerIntent],
                                                ["Naturalness", dynamicListing.seoAudit.naturalness],
                                            ].map(([label, value]) => (
                                                <div key={String(label)}>
                                                    <div className="text-[9px] uppercase tracking-widest text-gray-500">{label}</div>
                                                    <div className="mt-1 font-black text-white">{value}</div>
                                                </div>
                                            ))}
                                            <div>
                                                <div className="text-[9px] uppercase tracking-widest text-gray-500">Duplicate phrase rate</div>
                                                <div className="mt-1 font-black text-white">{dynamicListing.seoAudit.duplicatePhraseRate}%</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] uppercase tracking-widest text-gray-500">Unsupported terms</div>
                                                <div className={`mt-1 font-black ${dynamicListing.seoAudit.unsupportedTerms === 0 ? "text-emerald-300" : "text-amber-300"}`}>{dynamicListing.seoAudit.unsupportedTerms}</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] uppercase tracking-widest text-gray-500">Bullet SEO quality</div>
                                                <div className="mt-1 font-black text-white">{listingQuality?.bulletSeoQuality}</div>
                                            </div>
                                        </div>
                                        {dynamicListing.seoAudit.bulletKeywords.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-800">
                                                <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-2">Grounded bullet phrases</div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {dynamicListing.seoAudit.bulletKeywords.map((term) => (
                                                        <span key={term} className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-100">{term}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showListingMetrics && listingQuality && (
                                    <div className="mb-4 p-4 rounded-xl bg-gray-950 border border-gray-800">
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                                            {[
                                                ["Buyer alignment", listingQuality.buyerIdentityAlignment],
                                                ["Niche specificity", listingQuality.nicheSpecificity],
                                                ["Behavioral relevance", listingQuality.behavioralRelevance],
                                                ["Search intent", listingQuality.searchIntentCoverage],
                                                ["Bullet SEO", listingQuality.bulletSeoQuality],
                                                ["Natural language", listingQuality.keywordNaturalness],
                                                ["Gift relevance", listingQuality.giftIntent],
                                                ["Readability", listingQuality.readability],
                                                ["Compliance", listingQuality.complianceConfidence],
                                                ["Claim grounding", listingQuality.claimGrounding],
                                            ].map(([label, value]) => (
                                                <div key={String(label)}>
                                                    <div className="text-[9px] uppercase tracking-widest text-gray-500">{label}</div>
                                                    <div className="mt-1 font-black text-white">{value}</div>
                                                </div>
                                            ))}
                                            <div>
                                                <div className="text-[9px] uppercase tracking-widest text-gray-500">Repetition</div>
                                                <div className="mt-1 font-black text-white">{listingQuality.repetitionScore}%</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] uppercase tracking-widest text-gray-500">Gate</div>
                                                <div className={`mt-1 font-black ${dynamicListing?.qualityGate.passed ? "text-emerald-300" : "text-amber-300"}`}>{dynamicListing?.qualityGate.status}</div>
                                            </div>
                                        </div>
                                        {dynamicListing && !dynamicListing.qualityGate.passed && dynamicListing.qualityGate.warnings.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-amber-200">
                                                {dynamicListing.qualityGate.warnings.join(" · ")}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-950 rounded-xl">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Product Title</div>
                                                <button type="button" disabled={isListingRefreshing} onClick={() => handleListingRefresh(dynamicListing?.marketplace ?? mapListingMarketplace(platform))} className="text-[9px] font-bold uppercase tracking-widest text-blue-300 hover:text-blue-200 disabled:opacity-50">Optimize</button>
                                            </div>
                                            <div className="text-white font-semibold text-sm sm:text-base leading-snug">
                                                {result.amazonListing?.title || "Product Title"}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-950 rounded-xl space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Brand Strategy</div>
                                                <a href="/settings#merch-brand" className="text-[9px] font-bold uppercase tracking-widest text-blue-300 hover:text-blue-200">
                                                    {dynamicListing?.brandStrategy.source === "none" ? "Configure brand →" : "Change →"}
                                                </a>
                                            </div>
                                            {dynamicListing?.brandStrategy.source === "none" ? (
                                                <div>
                                                    <div className="text-sm font-semibold text-white">No seller brand configured</div>
                                                    <p className="mt-1 text-[11px] leading-relaxed text-gray-400">Add your storefront brand once and TrendForge will reuse it across eligible listings.</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <div className="text-sm font-semibold text-white">{result.amazonListing?.brandName}</div>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${dynamicListing?.brandStrategy.source === "configured" ? "text-blue-300" : "text-amber-300"}`}>
                                                            {dynamicListing?.brandStrategy.source === "configured" ? "Seller brand" : "Unverified candidate"}
                                                        </span>
                                                    </div>
                                                    {dynamicListing?.brandStrategy.warning && <p className="mt-1 text-[10px] leading-relaxed text-amber-200">⚠ {dynamicListing.brandStrategy.warning}</p>}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 bg-gray-950 rounded-xl">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Bullet Points</div>
                                                <button type="button" disabled={isListingRefreshing} onClick={() => handleListingRefresh(dynamicListing?.marketplace ?? mapListingMarketplace(platform))} className="text-[9px] font-bold uppercase tracking-widest text-blue-300 hover:text-blue-200 disabled:opacity-50">Regenerate</button>
                                            </div>
                                            <ul className="list-disc pl-4 space-y-1.5 text-gray-300 text-sm">
                                                <li>{result.amazonListing?.bulletPoint1}</li>
                                                <li>{result.amazonListing?.bulletPoint2}</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-950 rounded-xl min-h-[140px]">
                                            <div className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-widest">Product Description</div>
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                {result.amazonListing?.description}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-gray-950 rounded-xl">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{dynamicListing?.marketplace === "etsy" ? "Discovery Tags" : "Backend Search Terms"}</div>
                                                <button type="button" onClick={() => setShowListingMetrics(true)} className="text-[9px] font-bold uppercase tracking-widest text-blue-300 hover:text-blue-200">Analyze</button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {Array.isArray(result.amazonListing?.keywords) &&
                                                    result.amazonListing.keywords.map((kw: string, i: number) => (
                                                        <span
                                                            key={`k-${i}`}
                                                            className="px-2 py-1 rounded-full bg-gray-800 text-gray-200 text-xs font-medium"
                                                        >
                                                            {kw}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slogan & Prompts */}
                            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                                <div className="flex items-center justify-between mb-4 gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">AI Design Studio</h3>
                                        <p className="text-xs text-gray-500 mt-1">Refine and copy ready-to-use image prompts.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {visualReleaseGate && (
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${visualReleasePassed
                                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                                : visualReleaseNeedsReview
                                                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                                                    : "border-slate-500/40 bg-slate-500/10 text-slate-300"
                                            }`}>
                                                Visual release: {visualReleasePresentation.label}
                                            </span>
                                        )}
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300">
                                            {platform === "amazon" ? "Amazon Merch" : platform.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {visualReleaseGate && !visualReleaseEvaluated && (
                                    <div className="mb-4 rounded-xl border border-slate-500/25 bg-slate-500/5 px-3 py-2 text-[11px] text-slate-300">
                                        {visualReleaseGate.reason || "Visual benchmark will run once enough valid design concepts are available."}
                                    </div>
                                )}

                                {visualReleaseNeedsReview && Array.isArray(visualReleaseGate?.warnings) && visualReleaseGate.warnings.length > 0 && (
                                    <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-200">
                                        <div className="font-bold">Visual batch needs review.</div>
                                        <div className="mt-0.5 text-amber-100/80">Some concepts remain below the commercial diversity or quality thresholds.</div>
                                        {visualReleaseGate.repairAttempts > 0 && (
                                            <div className="mt-1 text-amber-100/70">
                                                Automated repair attempts: {visualReleaseGate.repairAttempts}/{visualReleaseGate.maxRepairAttempts}
                                            </div>
                                        )}
                                        <details className="mt-2">
                                            <summary className="cursor-pointer font-bold text-amber-100">Details</summary>
                                            <div className="mt-1 space-y-0.5 text-amber-100/75">
                                                {visualReleaseGate.warnings.map((warning) => (
                                                    <div key={warning.metric}>
                                                        {visualMetricLabels[warning.metric] ?? warning.metric}: {formatVisualMetric(warning.actual)} / {warning.expectation === "maximum" ? "max" : "min"} {formatVisualMetric(warning.threshold)}
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    </div>
                                )}

                                <div className="mb-4 rounded-xl border border-gray-800 bg-gray-950/70 p-3">
                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Design mode</div>
                                            {designMode === "AUTO" && visualStrategies[0] && (
                                                <div className="mt-1 text-[11px] text-indigo-200">
                                                    Auto chooses per slogan · first result: <span className="font-black">{visualStrategies[0].resolvedDesignMode.replaceAll("_", " ")}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRegenerateDesigns}
                                            disabled={isDesignRefreshing}
                                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 disabled:opacity-50"
                                        >
                                            {isDesignRefreshing ? "Rebuilding…" : "Regenerate designs"}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {DESIGN_MODES.map((mode) => (
                                            <button
                                                key={mode.value}
                                                type="button"
                                                onClick={() => setDesignMode(mode.value)}
                                                title={mode.value === "AUTO" ? "Analyzes wording, action, metaphor, character potential, and thumbnail clarity." : undefined}
                                                className={`text-[10px] font-bold px-3 py-1.5 rounded-md border uppercase tracking-wide transition-all ${designMode === mode.value ? "bg-indigo-600 text-white border-indigo-600" : "bg-indigo-50/10 text-indigo-200 border-indigo-500/20 hover:bg-indigo-500/20"}`}
                                            >
                                                {mode.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {PRESET_STYLES.map((styleName) => (
                                        <button
                                            key={styleName}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDesignStyle(styleName);
                                                setStyle(styleName);
                                                setCustomStyle("");
                                            }}
                                            className={`text-[10px] font-bold px-3 py-1.5 rounded-md border uppercase tracking-tighter transition-all ${
                                                !customStyle.trim() && selectedDesignStyle === styleName
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                    : "bg-indigo-50/10 text-indigo-200 border-indigo-500/20 hover:bg-indigo-500/20"
                                            }`}
                                        >
                                            {styleName}
                                        </button>
                                    ))}
                                </div>

                                <CustomStyleSelector
                                    value={customStyle}
                                    selectedPreset={selectedDesignStyle}
                                    disabled={isDesignRefreshing}
                                    onChange={setCustomStyle}
                                />

                                <div className="space-y-4">
                                    {designSlogans.map((slogan: string, i: number) => {
                                        const basePromptText = result.imagePrompts?.[i] || "No design prompt generated.";
                                        const styledPromptText = injectStyle(basePromptText, resolvedVisualStyle);
                                        const finalPromptText = enhancePromptWithStandards(styledPromptText);
                                        const isCollapsed = collapsedPrompts[slogan] ?? true;
                                        const wordCount = finalPromptText.trim() ? finalPromptText.trim().split(/\s+/).length : 0;
                                        const sloganMeta = rankedSlogans.find((entry) => entry.slogan === slogan);
                                        const visualStrategy = visualStrategies.find((entry) => entry.slogan === slogan);
                                        return (
                                            <div
                                                key={i}
                                                className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors"
                                            >
                                                <div
                                                    onClick={() => toggleCollapse(slogan)}
                                                    className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-3 border-b border-gray-800 cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <svg
                                                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                                                isCollapsed ? "-rotate-90" : "rotate-0"
                                                            }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 9l-7 7-7-7"
                                                            ></path>
                                                        </svg>
                                                        <span className="bg-indigo-600/30 text-indigo-300 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-600/30">
                                                            Design Concept {i + 1}
                                                        </span>
                                                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest truncate max-w-[140px] sm:max-w-[220px] italic">
                                                            &quot;{slogan}&quot;
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {visualStrategy && (
                                                            <span className="hidden sm:inline text-[9px] font-black text-indigo-300 uppercase tracking-widest">
                                                                {visualStrategy.resolvedDesignMode.replaceAll("_", " ")} · impact {visualStrategy.visualImpact}
                                                            </span>
                                                        )}
                                                        {sloganMeta && (
                                                            <span className="text-[9px] font-black text-emerald-300 uppercase tracking-widest">
                                                                score {sloganMeta.score}
                                                            </span>
                                                        )}
                                                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{wordCount}w</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(finalPromptText);
                                                            }}
                                                            className="text-[10px] font-black py-1.5 px-3 rounded-lg border flex items-center gap-1.5 transition-all uppercase tracking-wider bg-white/5 hover:bg-white/15 text-white border-white/10"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                            Copy Prompt
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFeedbackModal({ slogan, sloganIdx: i });
                                                                setFeedbackInputs({ impressions: "", clicks: "", orders: "" });
                                                            }}
                                                            className="text-[10px] font-black py-1.5 px-3 rounded-lg border flex items-center gap-1.5 transition-all uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                                        >
                                                            <BarChart2 className="w-3 h-3" />
                                                            Sales Data
                                                        </button>
                                                    </div>
                                                </div>

                                                {!isCollapsed && (
                                                    <div className="px-4 sm:px-6 py-4">
                                                        {visualStrategy && (
                                                            <div className="mb-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] uppercase tracking-widest">
                                                                    <div><span className="text-gray-500">Concept</span><div className="mt-0.5 text-indigo-200 font-bold normal-case tracking-normal">{visualStrategy.fingerprint.metaphorType || visualStrategy.concept.coreMessage}</div></div>
                                                                    <div><span className="text-gray-500">Mode</span><div className="mt-0.5 text-white font-black">{visualStrategy.resolvedDesignMode.replaceAll("_", " ")}</div></div>
                                                                    <div><span className="text-gray-500">Mode compliance</span><div className="mt-0.5 text-white font-black">{visualStrategy.modeCompliance.modeComplianceScore}</div></div>
                                                                    <div><span className="text-gray-500">Complexity</span><div className="mt-0.5 text-white font-black">{visualStrategy.complexity.supportingDetailLevel}</div></div>
                                                                </div>
                                                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
                                                                    <div className="text-gray-500">Visual Impact <span className="text-white font-black">{visualStrategy.visualImpact}</span></div>
                                                                    <div className="text-gray-500">Thumbnail <span className="text-white font-black">{visualStrategy.quality.thumbnailLegibility}</span></div>
                                                                    <div className="text-gray-500">Reinforcement <span className="text-white font-black">{visualStrategy.quality.sloganReinforcement}</span></div>
                                                                    <div className="text-gray-500">Originality <span className="text-white font-black">{visualStrategy.quality.visualOriginality}</span></div>
                                                                    <div className="text-gray-500">Printability <span className="text-white font-black">{visualStrategy.quality.printability}</span></div>
                                                                </div>
                                                                <div className={`mt-2 text-[9px] font-black uppercase tracking-widest ${visualStrategy.qualityGatePassed ? "text-emerald-300" : "text-amber-300"}`}>
                                                                    Quality gate: {visualStrategy.qualityGatePassed ? "passed" : "review recommended"}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">
                                                            {finalPromptText}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            {/* Sales Feedback Modal */}
            {feedbackModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-emerald-400" />
                                    Record Listing Results
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">&quot;{feedbackModal.slogan}&quot;</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFeedbackModal(null)}
                                className="text-gray-500 hover:text-gray-300 transition-colors ml-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3 mb-5">
                            {(["impressions", "clicks", "orders"] as const).map((field) => (
                                <div key={field}>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">{field}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={feedbackInputs[field]}
                                        onChange={(e) => setFeedbackInputs((prev) => ({ ...prev, [field]: e.target.value }))}
                                        placeholder="0"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setFeedbackModal(null)}
                                className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-400 text-sm font-bold hover:text-white hover:border-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitFeedback}
                                disabled={feedbackSubmitting}
                                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {feedbackSubmitting && (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {feedbackSubmitting ? "Saving..." : "Save Results"}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-600 text-center mt-3">
                            This data trains the AI to improve future pattern picks.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SingleStrategyPage() {
    return (
        <Suspense fallback={<div className="p-8 text-gray-400">Loading Strategy Factory...</div>}>
            <SingleStrategyContent />
        </Suspense>
    );
}
