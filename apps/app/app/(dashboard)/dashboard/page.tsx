"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFactory } from "../../../hooks/useFactory";
import { Copy, Sparkles, Wand2, Target, Tags, ShoppingCart, BarChart2 } from "lucide-react";
import { InsightPanel } from "../../../components/dashboard/InsightPanel";
import { AiUsageWidget } from "../../../components/dashboard/AiUsageWidget";
import { safeJson } from "@/lib/utils/safeJson";

const PRESET_STYLES = [
    "Vintage Distressed",
    "Hand-Drawn",
    "Bold Graphic",
    "Retro Vintage",
    "Minimalist Vector",
    "Retro Neon",
    "Y2K",
];

const STORAGE_KEY = "tf_single_strategy_state_v1";

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

/* eslint-disable @typescript-eslint/no-explicit-any */

function SingleStrategyContent() {
    const { generateSingleStrategy, regenerateSlogans, recordSalesFeedback, isLoading, isSloganRefreshing, error } = useFactory();
    const searchParams = useSearchParams();
    const [prompt, setPrompt] = useState("");
    const [platform, setPlatform] = useState("amazon");
    const [audience, setAudience] = useState("");
    const [style, setStyle] = useState("Vintage Distressed");
    const [result, setResult] = useState<any | null>(null);
    const [insights, setInsights] = useState<any[] | null>(null);
    const [trendsLoading, setTrendsLoading] = useState(false);
    const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
    const [crossoverTopics, setCrossoverTopics] = useState<string[]>([]);
    const [selectedDesignStyle, setSelectedDesignStyle] = useState<string>("Vintage Distressed");
    const [collapsedPrompts, setCollapsedPrompts] = useState<Record<string, boolean>>({});
    const [copiedListing, setCopiedListing] = useState(false);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState<{ slogan: string; sloganIdx: number } | null>(null);
    const [feedbackInputs, setFeedbackInputs] = useState({ impressions: "", clicks: "", orders: "" });
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

    const demandScore = result ? Math.round(result.searchVolume ?? 0) : null;
    const compScore = result ? Math.round(result.competitionDensity ?? 0) : null;
    const trendScore = result ? Math.round(result.trend?.score ?? result.trendMomentum ?? 0) : null;
    const buyerIntentScore = result ? Math.round(result.buyerIntent ?? 0) : null;
    const sloganCollections = (result?.sloganCollections || {}) as SloganCollections;
    const rankedSlogans = (result?.sloganInsights || []) as RankedSlogan[];
    const designSlogans = result?.shirtSlogans || [];

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
        const data = await generateSingleStrategy(prompt, platform, audience, style);
        if (data) {
            setResult(data);
            try {
                const payload = {
                    prompt,
                    platform,
                    audience,
                    style,
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
                if (typeof saved.prompt === "string") setPrompt(saved.prompt);
                if (typeof saved.platform === "string") setPlatform(saved.platform);
                if (typeof saved.audience === "string") setAudience(saved.audience);
                if (typeof saved.style === "string") {
                    setStyle(saved.style);
                    setSelectedDesignStyle(saved.style || "Vintage Distressed");
                }
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
        await recordSalesFeedback({
            niche: result.niche || prompt,
            slogan: feedbackModal.slogan,
            impressions: feedbackInputs.impressions ? parseInt(feedbackInputs.impressions, 10) : undefined,
            clicks: feedbackInputs.clicks ? parseInt(feedbackInputs.clicks, 10) : undefined,
            orders: feedbackInputs.orders ? parseInt(feedbackInputs.orders, 10) : undefined,
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
                const exportPrompt = injectStyle(rawPrompt, selectedDesignStyle || style || "Bold Graphic");
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
        const suffix = "Transparent background. Commercial friendly. 300 DPI.";
        if (!text) return suffix;

        // Avoid duplicating if already present
        if (text.includes("Transparent background") || text.includes("300 DPI")) {
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

    const handleRegenerateSlogans = async () => {
        if (!result || !prompt) return;

        const data = await regenerateSlogans(
            result.niche || prompt,
            platform,
            audience,
            style,
            Array.isArray(result.shirtSlogans) ? result.shirtSlogans : rankedSlogans.map((entry) => entry.slogan)
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
                    result: nextResult,
                }));
            }
        } catch (err) {
            console.error("Failed to persist regenerated slogans", err);
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
                                <div className="flex items-center justify-between mb-4 gap-3">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Tags className="w-5 h-5 text-blue-400" />
                                        {platform === "amazon" ? "Amazon Merch Listing" : `${platform.toUpperCase()} Listing`}
                                    </h3>
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-950 rounded-xl">
                                            <div className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-widest">Product Title</div>
                                            <div className="text-white font-semibold text-sm sm:text-base leading-snug">
                                                {result.amazonListing?.title || "Product Title"}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-950 rounded-xl space-y-2">
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Brand Name</div>
                                            <div className="inline-flex items-center px-3 py-1 rounded-md bg-blue-500/15 text-blue-200 text-xs font-semibold">
                                                {result.amazonListing?.brandName || "Brand"}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-950 rounded-xl">
                                            <div className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-widest">Bullet Points</div>
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
                                            <div className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-widest">Backend Search Terms</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {result.seoKeywords?.primary && (
                                                    <span className="px-2 py-1 rounded-full bg-gray-800 text-gray-200 text-xs font-medium">
                                                        {result.seoKeywords.primary}
                                                    </span>
                                                )}
                                                {result.seoKeywords?.longTail?.slice(0, 4).map((kw: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 rounded-full bg-gray-800 text-gray-200 text-xs font-medium"
                                                    >
                                                        {kw}
                                                    </span>
                                                ))}
                                                {Array.isArray(result.amazonListing?.keywords) &&
                                                    result.amazonListing.keywords.slice(0, 4).map((kw: string, i: number) => (
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
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300">
                                        {platform === "amazon" ? "Amazon Merch" : platform.toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {PRESET_STYLES.map((styleName) => (
                                        <button
                                            key={styleName}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDesignStyle(styleName);
                                                setStyle(styleName);
                                            }}
                                            className={`text-[10px] font-bold px-3 py-1.5 rounded-md border uppercase tracking-tighter transition-all ${
                                                selectedDesignStyle === styleName
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                    : "bg-indigo-50/10 text-indigo-200 border-indigo-500/20 hover:bg-indigo-500/20"
                                            }`}
                                        >
                                            {styleName}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    {designSlogans.map((slogan: string, i: number) => {
                                        const basePromptText = result.imagePrompts?.[i] || "No design prompt generated.";
                                        const styledPromptText = injectStyle(basePromptText, selectedDesignStyle);
                                        const finalPromptText = enhancePromptWithStandards(styledPromptText);
                                        const isCollapsed = collapsedPrompts[slogan] ?? true;
                                        const wordCount = finalPromptText.trim() ? finalPromptText.trim().split(/\s+/).length : 0;
                                        const sloganMeta = rankedSlogans.find((entry) => entry.slogan === slogan);

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
                                                            Image Prompt {i + 1}
                                                        </span>
                                                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest truncate max-w-[140px] sm:max-w-[220px] italic">
                                                            &quot;{slogan}&quot;
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
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
                                                            Stats
                                                        </button>
                                                    </div>
                                                </div>

                                                {!isCollapsed && (
                                                    <div className="px-4 sm:px-6 py-4 text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">
                                                        {finalPromptText}
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
