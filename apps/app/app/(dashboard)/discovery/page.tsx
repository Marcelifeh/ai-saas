"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TrendSignalSource, useDiscover } from "../../../hooks/useDiscover";
import { Activity, DatabaseZap, Target, TrendingUp, Zap, Sparkles, ArrowUpRight } from "lucide-react";

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

function getSourceLabel(source: TrendSignalSource["source"]): string {
    if (source === "google_trends") return "Google Trends";
    if (source === "serpapi_trends") return "SerpAPI Trends";
    if (source === "hacker_news") return "Hacker News";
    return "Reddit";
}

type DiscoveryOpportunity = {
    niche: string;
    projectedRevenue?: number;
    audience?: string;
    niche_score: number;
    safety?: {
        safe: boolean;
        modified: boolean;
        riskScore: number;
        originalName?: string;
    };
};

export default function DiscoveryPage() {
    const { discover, isLoading, error, data } = useDiscover();
    const signalSources = data?.signalSources ?? [];

    const sourceCards = useMemo(() => {
        if (signalSources.length === 0) {
            return [] as Array<TrendSignalSource & { label: string; tone: string }>;
        }

        return signalSources.map((source) => {
            const label = getSourceLabel(source.source);
            const tone =
                source.status === "ok"
                    ? source.transport === "cache_fallback"
                        ? "border-yellow-500/40 bg-yellow-500/10"
                        : "border-emerald-500/40 bg-emerald-500/10"
                    : "border-red-500/40 bg-red-500/10";

            return {
                ...source,
                label,
                tone,
            };
        });
    }, [signalSources]);

    const crossoverCombos = useMemo(() => {
        if (!data || !Array.isArray(data.opportunities)) return [] as Array<{
            key: string;
            title: string;
            estRevenue: number;
            audienceSummary: string;
        }>;

        const opps = [...data.opportunities].filter((o): o is DiscoveryOpportunity =>
            Boolean(o && typeof (o as DiscoveryOpportunity).niche === "string")
        );
        if (opps.length < 2) return [];

        opps.sort((a, b) => (b.projectedRevenue || 0) - (a.projectedRevenue || 0));
        const top = opps.slice(0, 5);

        const combos: Array<{ key: string; title: string; estRevenue: number; audienceSummary: string }> = [];
        for (let i = 0; i < top.length; i++) {
            for (let j = i + 1; j < top.length; j++) {
                const a = top[i];
                const b = top[j];
                const estRevenue = (a.projectedRevenue || 0) + (b.projectedRevenue || 0);
                const audienceSummary = [a.audience, b.audience]
                    .filter((x) => typeof x === "string" && x.trim().length > 0)
                    .join(" × ") || "Cross-over buyer segments";

                combos.push({
                    key: `${a.niche}-${b.niche}`,
                    title: `${shortenNiche(a.niche)} × ${shortenNiche(b.niche)}`,
                    estRevenue,
                    audienceSummary,
                });

                if (combos.length >= 4) break;
            }
            if (combos.length >= 4) break;
        }

        return combos;
    }, [data]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
                        <Activity className="w-8 h-8 text-blue-400" />
                        Trend Discovery
                    </h1>
                    <p className="text-gray-400 mt-2">Discover emerging, highly-profitable print-on-demand niches.</p>
                    {data?.lastUpdated && (
                        <p className="text-xs text-gray-500 mt-1">
                            Last updated: {new Date(data.lastUpdated).toLocaleString()}
                        </p>
                    )}
                </div>
                <button
                    onClick={discover}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    {isLoading ? "Analyzing Markets..." : "Scan Markets"}
                </button>
            </header>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400">
                    {error}
                </div>
            )}

            {data && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
                        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                <DatabaseZap className="w-5 h-5 text-emerald-400" />
                                Source Health
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sourceCards.map((source) => (
                                    <div key={source.source} className={`p-4 rounded-xl border ${source.tone}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold text-white">{source.label}</div>
                                                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                                                    {source.transport === "cache_fallback" ? "Cached fallback" : "Live feed"}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[11px] text-gray-400 uppercase tracking-wide">Confidence</div>
                                                <div className="text-lg font-bold text-white">{Math.round(source.confidence * 100)}%</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                                            <div>
                                                <div className="text-gray-500 uppercase font-semibold mb-1">Status</div>
                                                <div className="text-white">{source.status.replaceAll("_", " ")}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 uppercase font-semibold mb-1">Blend Weight</div>
                                                <div className="text-white">{Math.round((source.normalizedWeight ?? 0) * 100)}%</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                                            <div>
                                                <div className="text-gray-500 uppercase font-semibold mb-1">Tier</div>
                                                <div className="text-white">{(source.tier ?? "tier2").toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 uppercase font-semibold mb-1">Quorum</div>
                                                <div className="text-white">{Math.round((source.agreementScore ?? 0) * 100)}%</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-xs text-gray-400 space-y-1">
                                            <p>
                                                {source.transport === "cache_fallback" && source.cachedAt
                                                    ? `Snapshot: ${new Date(source.cachedAt).toLocaleString()}`
                                                    : `Fetched: ${new Date(source.fetchedAt).toLocaleString()}`}
                                            </p>
                                            {typeof source.cacheAgeMinutes === "number" && (
                                                <p>Cache age: {source.cacheAgeMinutes} min</p>
                                            )}
                                            {source.details && <p>{source.details}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                Signal Confidence
                            </h3>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-4xl font-black text-white">{Math.round((data.signalConfidence ?? 0) * 100)}%</div>
                                    <p className="text-sm text-gray-400 mt-2">Current blend strength across all usable sources.</p>
                                </div>
                                <div className="w-28 h-28 rounded-full border-8 border-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-lg">
                                    {signalSources.filter((source) => source.data.length > 0).length}/{signalSources.length}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                                Blend weight is normalized from source confidence after degraded feeds and cache fallbacks are accounted for.
                            </p>
                        </div>
                    </div>

                    {/* Signals Overview */}
                    <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Detected Cultural Signals
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data.signals.slice(0, 10).map((signal, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700">
                                    {signal}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Opportunities Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {data.opportunities.map((opp, idx) => {
                            const estSales = Math.max(4, Math.round((opp.projectedRevenue || 500) / 60));
                            const annual = (opp.projectedRevenue || 0) * 12;
                            const confidenceLabel = opp.niche_score >= 75 ? "High" : opp.niche_score >= 55 ? "Medium" : "Low";
                            const confidenceColor =
                                confidenceLabel === "High" ? "text-emerald-300" : confidenceLabel === "Medium" ? "text-yellow-300" : "text-red-300";
                            const decisionText = opp.niche_score >= 75 ? "🟢 SELL NOW" : opp.niche_score < 50 ? "🔴 SKIP" : "🟡 TEST";
                            const decisionClass = opp.niche_score >= 75
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : opp.niche_score < 50
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";

                            return (
                                <div
                                    key={idx}
                                    className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-blue-500/60 transition-colors group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                    {opp.niche}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                    <Target className="w-4 h-4" />
                                                    {opp.audience}
                                                </div>
                                                {opp.safety && (
                                                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                                                        {opp.safety.modified ? (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
                                                                🟡 Auto-Rewritten
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                                                🟢 Safe to Sell
                                                            </span>
                                                        )}
                                                        {opp.safety.modified && opp.safety.originalName && (
                                                            <span className="text-[10px] text-gray-500 italic truncate max-w-[180px]" title={opp.safety.originalName}>
                                                                was: {opp.safety.originalName}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className={`inline-block text-xs font-black px-2.5 py-1 rounded-full border ${decisionClass}`}>
                                                    {decisionText}
                                                </div>
                                                <div className="text-sm text-gray-500 uppercase font-semibold">Niche Score</div>
                                                <div className="text-3xl font-black text-white leading-none">
                                                    {opp.niche_score}
                                                    <span className="text-sm text-gray-500 font-normal">/100</span>
                                                </div>
                                                <div className={`text-[11px] font-bold uppercase tracking-widest ${confidenceColor}`}>
                                                    {confidenceLabel} Confidence
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                            {opp.whyItSells}
                                        </p>

                                        <div className="mt-2 p-4 bg-gray-950 border border-gray-800 rounded-xl">
                                            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                <span>Revenue Projection</span>
                                                <span className={confidenceColor}>{confidenceLabel} Confidence</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 text-xs">
                                                <div>
                                                    <div className="text-gray-500 font-semibold uppercase mb-1">Est. Sales / mo</div>
                                                    <div className="text-lg font-bold text-white">{estSales}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 font-semibold uppercase mb-1">Profit / mo</div>
                                                    <div className="text-lg font-bold text-emerald-300">${opp.projectedRevenue}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 font-semibold uppercase mb-1">Annual Est.</div>
                                                    <div className="text-lg font-bold text-emerald-200">${annual}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-800">
                                                <div>
                                                    <div className="text-[11px] text-gray-500 uppercase font-semibold mb-1">Demand</div>
                                                    <div className="text-lg font-medium text-white">{opp.research_demand}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] text-gray-500 uppercase font-semibold mb-1">Competition</div>
                                                    <div className="text-lg font-medium text-white">{opp.research_competition}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] text-gray-500 uppercase font-semibold mb-1">Trend Strength</div>
                                                    <div className="text-lg font-medium text-white flex items-center gap-1">
                                                        {opp.trend_score}
                                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex justify-end">
                                        <Link
                                            href={`/dashboard?niche=${encodeURIComponent(opp.niche || "")}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white uppercase tracking-wide shadow-md shadow-blue-900/40"
                                        >
                                            Develop Full Strategy
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {crossoverCombos.length > 0 && (
                        <div className="p-6 bg-gray-900/60 border border-blue-500/40 rounded-2xl mt-4">
                            <h3 className="text-sm font-semibold text-gray-100 mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                Crossover Concepts (High-Potential Blends)
                            </h3>
                            <p className="text-xs text-gray-400 mb-4">
                                Occasional mashups of your strongest niches that may support multi-angle designs or shared campaigns.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {crossoverCombos.map((combo) => (
                                    <div
                                        key={combo.key}
                                        className="p-4 rounded-xl bg-gray-950 border border-gray-800 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="text-[11px] text-gray-500 uppercase font-semibold mb-1">Combined Niche</div>
                                            <div className="text-sm font-bold text-white mb-1 line-clamp-2">{combo.title}</div>
                                            <p className="text-[11px] text-gray-400 mb-2">{combo.audienceSummary}</p>
                                        </div>
                                        <div className="flex items-center justify-between text-xs mt-1 pt-2 border-t border-gray-800">
                                            <span className="text-gray-500 font-semibold uppercase">Est. Monthly Profit</span>
                                            <span className="text-emerald-300 font-bold">${combo.estRevenue}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!data && !isLoading && !error && (
                <div className="text-center py-24 px-4">
                    <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <Sparkles className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Discover Trends?</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Our AI engine scans Google Trends and Reddit to find untapped, highly profitable print-on-demand niches before they become saturated.
                    </p>
                </div>
            )}
        </div>
    );
}
