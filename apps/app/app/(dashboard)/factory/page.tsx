"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFactory } from "../../../hooks/useFactory";
import { Layers, Play, RotateCcw, CheckCircle2, ChevronRight, Zap, ArrowUpRight, TrendingUp } from "lucide-react";

const STORAGE_KEY_FACTORY = "tf_factory_state_v1";

type DiscoveredNiche = {
    niche: string;
};

type BulkResult = {
    niche: string;
    decision?: string;
    niche_score?: number;
    bestSellerPredictor?: {
        score?: number;
        confidence?: string;
    };
    amazonListing?: {
        title?: string;
        brandName?: string;
        bulletPoint1?: string;
        bulletPoint2?: string;
        description?: string;
    };
    safe?: boolean;
    shirtSlogans?: string[];
    sloganCollections?: {
        topPicks?: Array<{ slogan: string; score: number }>;
        boldPicks?: Array<{ slogan: string; score: number }>;
        experimental?: Array<{ slogan: string; score: number }>;
    };
    searchVolume?: number;
    competitionDensity?: number;
    trendMomentum?: number;
    trend?: { score?: number };
    buyerIntent?: number;
    opportunityIndex?: number;
    projectedRevenue?: number;
};

export default function FactoryPage() {
    const { bulkDiscover, generateChunk, isLoading, error } = useFactory();
    const [nichesText, setNichesText] = useState("");
    const [discoveredNiches, setDiscoveredNiches] = useState<DiscoveredNiche[]>([]);
    const [results, setResults] = useState<BulkResult[]>([]);
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const publishQueue = results.filter((p) => p.decision === "PUBLISH");
    const testQueue = results.filter((p) => p.decision === "TEST");
    const bestProduct =
        results.length > 0 ? [...results].sort((a, b) => (b.niche_score || 0) - (a.niche_score || 0))[0] : null;

    const getHeadlineSlogans = (product: BulkResult) => {
        const ranked = product.sloganCollections?.topPicks?.map((entry) => entry.slogan).filter(Boolean);
        if (ranked && ranked.length > 0) return ranked;
        return product.shirtSlogans || [];
    };

    const crossoverCombos = useMemo(() => {
        if (!results || results.length < 2) return [] as Array<{ key: string; nicheA: string; nicheB: string; headline: string; audience: string; angle: string; estRevenue: number; demandA: number; demandB: number }>;

        const sorted = [...results].sort((a, b) => (b.projectedRevenue || 0) - (a.projectedRevenue || 0));
        const top = sorted.slice(0, 6);

        const combos: Array<{ key: string; nicheA: string; nicheB: string; headline: string; audience: string; angle: string; estRevenue: number; demandA: number; demandB: number }> = [];
        for (let i = 0; i < top.length; i++) {
            for (let j = i + 1; j < top.length; j++) {
                const a = top[i];
                const b = top[j];
                const estRevenue = (a.projectedRevenue || 0) + (b.projectedRevenue || 0);
                const demandA = Math.round(a.searchVolume ?? a.buyerIntent ?? 0);
                const demandB = Math.round(b.searchVolume ?? b.buyerIntent ?? 0);
                // Build a punchy crossover headline from the two niche names
                const aShort = a.niche.replace(/ shirt$/i, "").replace(/ tee$/i, "").trim();
                const bShort = b.niche.replace(/ shirt$/i, "").replace(/ tee$/i, "").trim();
                const headline = `${aShort} — ${bShort}`;
                const audience = `Fans of both ${aShort.split(" ").slice(0, 3).join(" ")} and ${bShort.split(" ").slice(0, 3).join(" ")}`;
                const angle = estRevenue > 5000 ? "High-demand overlap" : estRevenue > 3000 ? "Strong crossover" : "Emerging blend";
                combos.push({ key: `${a.niche}-${b.niche}`, nicheA: a.niche, nicheB: b.niche, headline, audience, angle, estRevenue, demandA, demandB });
                if (combos.length >= 4) break;
            }
            if (combos.length >= 4) break;
        }

        return combos;
    }, [results]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY_FACTORY);
            if (!raw) return;
            const saved = JSON.parse(raw) as {
                nichesText?: string;
                discoveredNiches?: DiscoveredNiche[];
                results?: BulkResult[];
                step?: number;
            };
            if (!saved || typeof saved !== "object") return;

            const nextNichesText = typeof saved.nichesText === "string" ? saved.nichesText : "";
            const nextDiscovered = Array.isArray(saved.discoveredNiches) ? saved.discoveredNiches : [];
            const hasResults = Array.isArray(saved.results) && saved.results.length > 0;
            const nextStep: 1 | 2 | 3 = hasResults ? (saved.step === 2 ? 2 : 3) : saved.step === 2 ? 2 : 1;

            // Defer state updates slightly to avoid cascading renders warning
            setTimeout(() => {
                setNichesText(nextNichesText);
                setDiscoveredNiches(nextDiscovered);
                if (hasResults && saved.results) {
                    setResults(saved.results);
                }
                setStep(nextStep);
            }, 0);
        } catch (err) {
            console.error("Failed to restore factory state", err);
        }
    }, []);

    const handleAutoDiscover = async () => {
        const niches = await bulkDiscover();
        if (niches && niches.length > 0) {
            setDiscoveredNiches(niches as DiscoveredNiche[]);
            setNichesText((niches as DiscoveredNiche[]).map((n) => n.niche).join("\n"));
            setStep(2);
            if (typeof window !== "undefined") {
                try {
                    window.localStorage.setItem(
                        STORAGE_KEY_FACTORY,
                        JSON.stringify({ nichesText: (niches as DiscoveredNiche[]).map((n) => n.niche).join("\n"), discoveredNiches: niches, results: [], step: 2 })
                    );
                } catch (err) {
                    console.error("Failed to persist factory state", err);
                }
            }
        }
    };

    const handleManualNext = () => {
        const lines = nichesText.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length > 0) {
            const nextDiscovered = lines.map((line) => ({ niche: line.trim() }));
            setDiscoveredNiches(nextDiscovered);
            setStep(2);
            if (typeof window !== "undefined") {
                try {
                    window.localStorage.setItem(
                        STORAGE_KEY_FACTORY,
                        JSON.stringify({ nichesText, discoveredNiches: nextDiscovered, results: [], step: 2 })
                    );
                } catch (err) {
                    console.error("Failed to persist factory state", err);
                }
            }
        }
    };

    const handleRunFactory = async () => {
        const data = await generateChunk(discoveredNiches, false);
        if (data) {
            setResults(data as BulkResult[]);
            setStep(3); // Render results
            if (typeof window !== "undefined") {
                try {
                    window.localStorage.setItem(
                        STORAGE_KEY_FACTORY,
                        JSON.stringify({ nichesText, discoveredNiches, results: data, step: 3 })
                    );
                } catch (err) {
                    console.error("Failed to persist factory state", err);
                }
            }
        }
    };

    const handleExportCsv = () => {
        if (!results || results.length === 0) return;

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
        ];

        const csvSafe = (text: unknown) => {
            if (text === undefined || text === null) return "";
            return `"${String(text).replace(/"/g, '""')}"`;
        };

        const rows: string[] = [];
        rows.push(headers.join(","));

        results.forEach((prod) => {
            // Prefer ranked top picks, then fall back to unranked slogans
            const slogansToExport: string[] = (
                prod.sloganCollections?.topPicks?.map((e) => e.slogan).filter(Boolean)
                ?? prod.shirtSlogans
                ?? []
            );
            if (slogansToExport.length === 0) return;

            slogansToExport.forEach((slogan: string) => {
                const row = [
                    csvSafe(prod.niche),
                    csvSafe(slogan),
                    csvSafe(prod.decision),
                    prod.niche_score ?? "",
                    csvSafe(prod.amazonListing?.title || ""),
                    csvSafe(prod.amazonListing?.brandName || ""),
                    csvSafe(prod.amazonListing?.bulletPoint1 || ""),
                    csvSafe(prod.amazonListing?.bulletPoint2 || ""),
                    csvSafe(prod.amazonListing?.description || ""),
                    prod.safe === false ? "TRUE" : "FALSE",
                    "",
                    prod.safe !== false ? "TRUE" : "FALSE",
                    "BULK_AUTO",
                    prod.searchVolume ?? "",
                    prod.competitionDensity ?? "",
                    prod.trendMomentum ?? "",
                    prod.buyerIntent ?? "",
                    prod.opportunityIndex ?? "",
                ];
                rows.push(row.join(","));
            });
        });

        const csvContent = rows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "pod_research.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleStartNewBatch = () => {
        setStep(1);
        setNichesText("");
        setResults([]);
        if (typeof window !== "undefined") {
            try {
                window.localStorage.removeItem(STORAGE_KEY_FACTORY);
            } catch (err) {
                console.error("Failed to clear factory state", err);
            }
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent flex items-center gap-3">
                        <Layers className="w-8 h-8 text-orange-400" />
                        Bulk Strategy Factory
                    </h1>
                    <p className="text-gray-400 mt-2">Generate multiple print-on-demand listings concurrently to scale your catalog.</p>
                </div>
                {step === 3 && results.length > 0 && discoveredNiches.length > 0 && (
                    <button
                        type="button"
                        onClick={handleStartNewBatch}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Start New Batch
                    </button>
                )}
            </header>

            {/* Pipeline Steps Tracker */}
            <div className="flex items-center gap-4 mb-8">
                <div className={`px-4 py-2 rounded-full text-sm font-medium border \${step >= 1 ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-gray-800 text-gray-500'}`}>
                    1. Input Niches
                </div>
                <ChevronRight className="w-5 h-5 text-gray-700" />
                <div className={`px-4 py-2 rounded-full text-sm font-medium border \${step >= 2 ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-gray-800 text-gray-500'}`}>
                    2. Configure Run
                </div>
                <ChevronRight className="w-5 h-5 text-gray-700" />
                <div className={`px-4 py-2 rounded-full text-sm font-medium border \${step >= 3 ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-800 text-gray-500'}`}>
                    3. Results
                </div>
            </div>

            {error && <div className="p-4 bg-red-900/20 text-red-400 border border-red-500/50 rounded-xl">{error}</div>}

            {/* STEP 1: Input */}
            {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Provide Target Niches</h3>
                        <p className="text-gray-400 text-sm mb-4">Paste your niches below, one per line.</p>

                        <textarea
                            rows={10}
                            value={nichesText}
                            onChange={(e) => setNichesText(e.target.value)}
                            placeholder="Sarcastic nurses\\nRetro skateboarding gamers\\n..."
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none font-mono text-sm leading-relaxed"
                        />

                        <button
                            onClick={handleManualNext}
                            disabled={!nichesText.trim()}
                            className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            Continue Setup
                        </button>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border items-center justify-center flex flex-col border-gray-800 rounded-2xl text-center">
                        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                            <Zap className="w-8 h-8 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No ideas? Let AI run Discovery</h3>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            Query the live market to pull the top 15 trending niches dynamically and load them directly into the Factory.
                        </p>
                        <button
                            onClick={handleAutoDiscover}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5" />
                            )}
                            {isLoading ? "Querying Engine..." : "Auto-Fill 15 Trends"}
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: Configure & Run */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Factory Run Ready</h3>
                                <p className="text-gray-400 mt-1">Queued {discoveredNiches.length} niches for parallel processing.</p>
                            </div>
                            <button
                                onClick={handleRunFactory}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-4 border-white/30 border-t-white overflow-hidden rounded-full animate-spin" />
                                ) : (
                                    <Play className="w-5 h-5 fill-current" />
                                )}
                                {isLoading ? "Synthesizing Concepts..." : "Start Generation Sequence"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {discoveredNiches.map((n, i) => (
                                <div key={i} className="px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-300 flex items-center justify-between group">
                                    <span className="truncate pr-2">{n.niche}</span>
                                    {isLoading ? (
                                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                                    ) : (
                                        <div className="w-2 h-2 bg-gray-600 rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: Results Render */}
            {step === 3 && results.length > 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            Smart Publish Queue
                        </h3>
                        <div className="flex items-center gap-3">
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
                    </div>

                    {bestProduct && (
                        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">Top Performer</div>
                                <h4 className="text-xl font-bold text-white mb-1">{bestProduct.niche}</h4>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{bestProduct.amazonListing?.title}</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                    <div>
                                        <div className="text-gray-500 font-semibold uppercase mb-1">Score</div>
                                        <div className="text-2xl font-black text-white">{bestProduct.niche_score}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 font-semibold uppercase mb-1">Demand</div>
                                        <div className="text-lg font-bold text-white">{Math.round(bestProduct.searchVolume ?? 0)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 font-semibold uppercase mb-1">Competition</div>
                                        <div className="text-lg font-bold text-white">{Math.round(bestProduct.competitionDensity ?? 0)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 font-semibold uppercase mb-1">Momentum</div>
                                        <div className="text-lg font-bold text-emerald-300 flex items-center gap-1">
                                            {Math.round(bestProduct.trendMomentum ?? bestProduct.trend?.score ?? 0)}
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-right">
                                        <div className="text-gray-500 font-semibold uppercase mb-1">Total Products</div>
                                        <div className="text-lg font-bold text-white">{results.length}</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/60 text-right">
                                        <div className="text-emerald-200 font-semibold uppercase mb-1 text-[11px]">Publish Queue</div>
                                        <div className="text-lg font-bold text-emerald-200">{publishQueue.length}</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/60 text-right">
                                        <div className="text-yellow-200 font-semibold uppercase mb-1 text-[11px]">Test Queue</div>
                                        <div className="text-lg font-bold text-yellow-200">{testQueue.length}</div>
                                    </div>
                                </div>
                                <Link
                                    href={`/dashboard?niche=${encodeURIComponent(bestProduct.niche || "")}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-white uppercase tracking-wide shadow-lg shadow-emerald-900/40 hover:from-emerald-400 hover:to-teal-400"
                                >
                                    Develop Full Strategy
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {crossoverCombos.length > 0 && (
                        <div className="p-5 bg-gray-900 border border-emerald-500/40 rounded-2xl">
                            <h3 className="text-sm font-semibold text-gray-100 mb-1 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                Combined Opportunity Concepts
                            </h3>
                            <p className="text-xs text-gray-400 mb-4">
                                High-sales niches blended into crossover campaigns for broader buyer reach and stronger daily revenue.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {crossoverCombos.map((combo) => (
                                    <div
                                        key={combo.key}
                                        className="p-4 rounded-xl bg-gray-950 border border-gray-800 flex flex-col gap-3"
                                    >
                                        {/* Angle badge */}
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                                {combo.angle}
                                            </span>
                                            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Est. Monthly Profit</span>
                                        </div>
                                        {/* Headline */}
                                        <div className="text-sm font-bold text-white leading-snug">{combo.headline}</div>
                                        {/* Niche pills */}
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-[11px] text-gray-300 font-medium line-clamp-1">
                                                {combo.nicheA}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-[11px] text-gray-300 font-medium line-clamp-1">
                                                {combo.nicheB}
                                            </span>
                                        </div>
                                        {/* Audience + revenue row */}
                                        <div className="flex items-end justify-between gap-2 pt-1 border-t border-gray-800">
                                            <div className="text-[11px] text-gray-400 leading-tight">
                                                <span className="text-gray-500">Target: </span>{combo.audience}
                                            </div>
                                            <div className="text-base font-black text-emerald-300 whitespace-nowrap">${combo.estRevenue.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {results.map((product, idx) => {
                            const demand = Math.round(product.searchVolume ?? 0);
                            const competition = Math.round(product.competitionDensity ?? 0);
                            const trend = Math.round(product.trendMomentum ?? product.trend?.score ?? 0);
                            const buyerIntent = Math.round(product.buyerIntent ?? 0);

                            return (
                                <div key={idx} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-lg font-bold text-emerald-400 pr-4">{product.niche}</h4>
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 shrink-0">
                                            Score: {product.niche_score}
                                        </span>
                                    </div>

                                    <div className="text-sm font-medium text-gray-300 mb-3 line-clamp-2">
                                        {product.amazonListing?.title || "Title Output"}
                                    </div>

                                    {getHeadlineSlogans(product).length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-1">Top Slogans</div>
                                            <ul className="text-sm text-gray-200 space-y-1">
                                                {getHeadlineSlogans(product).slice(0, 3).map((s: string, i: number) => (
                                                    <li key={i} className="leading-snug">
                                                        +{s}+
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {product.bestSellerPredictor?.score && (
                                        <div className="mb-4 text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                                            Best Seller Predictor {product.bestSellerPredictor.score} · {product.bestSellerPredictor.confidence}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-3 border-t border-gray-800">
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <div className="text-gray-500 font-semibold uppercase mb-1">Demand</div>
                                                <div className="text-sm font-bold text-white">{demand}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 font-semibold uppercase mb-1">Competition</div>
                                                <div className="text-sm font-bold text-white">{competition}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 font-semibold uppercase mb-1">Trend</div>
                                                <div className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                                                    {trend}
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 font-semibold uppercase mb-1">Buyer Intent</div>
                                                <div className="text-sm font-bold text-white">{buyerIntent}</div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <span className={`inline-block text-[11px] font-black px-2.5 py-1 rounded-full border ${
                                                product.decision === 'PUBLISH'
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : product.decision === 'SKIP'
                                                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                            }`}>
                                                {product.decision === 'PUBLISH' ? '🟢 SELL NOW' : product.decision === 'SKIP' ? '🔴 SKIP' : '🟡 TEST'}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                Trend Intel Active
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <Link
                                            href={`/dashboard?niche=${encodeURIComponent(product.niche || "")}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white uppercase tracking-wide"
                                        >
                                            Develop Full Strategy
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// Ensure Sparkles component works
function Sparkles(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    );
}
