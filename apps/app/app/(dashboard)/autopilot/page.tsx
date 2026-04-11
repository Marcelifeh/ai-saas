"use client";

import Link from "next/link";
import { useState } from "react";
import { AutopilotProduct, AutopilotRunResult, useAutopilot } from "../../../hooks/useAutopilot";
import { Bot, DatabaseZap, Rocket, Settings, TrendingUp, Gauge, ArrowUpRight } from "lucide-react";
import { safeJson } from "@/lib/utils/safeJson";

function getSourceLabel(source: "google_trends" | "serpapi_trends" | "reddit" | "hacker_news"): string {
    if (source === "google_trends") return "Google Trends";
    if (source === "serpapi_trends") return "SerpAPI Trends";
    if (source === "hacker_news") return "Hacker News";
    return "Reddit";
}

export default function AutopilotPage() {
    const { runAutopilot, isRunning, error, result } = useAutopilot();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleRun = async () => {
        // Derive a stable workspace identifier from the current session.
        // Next-auth stores the user id on the session; we use it as the workspace key
        // so every user's jobs are scoped correctly (Phase 2 — full WorkspaceMember
        // resolution lives in Phase 3).
        let workspaceId = "ws_default";
        try {
            const sessionRes = await fetch("/api/auth/session");
            if (sessionRes.ok) {
                const sessionData = await safeJson<{ user?: { id?: string } }>(sessionRes);
                if (sessionData?.user?.id) workspaceId = `ws_${sessionData.user.id}`;
            }
        } catch {
            // fall back to default; autopilot API validates from server session
        }
        const data = await runAutopilot(workspaceId);

        const typed = data as AutopilotRunResult | null;
        if (typed && Array.isArray(typed.data) && typed.data.length > 0) {
            setSelectedIndex(0);
        }
    };

    const typedResult = (result ?? null) as AutopilotRunResult | null;

    const products: AutopilotProduct[] = Array.isArray(typedResult?.data) ? typedResult.data! : [];
    const total = products.length;
    const publishCount = products.filter((p) => p.decision === "PUBLISH").length;
    const testCount = products.filter((p) => p.decision === "TEST").length;
    const skipCount = products.filter((p) => p.decision === "SKIP").length;
    const runtimeSeconds = typedResult?.runtimeSeconds ?? null;
    const active = products[selectedIndex] || products[0] || null;
    const signalSources = typedResult?.signalSources ?? [];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-12">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
                    <Bot className="w-8 h-8 text-purple-400" />
                    Autopilot
                </h1>
                <p className="text-gray-400 mt-2">Fully autonomous discovery and generation pipeline.</p>
            </header>

            <div className="space-y-8">
                <div className="p-8 bg-gray-900 border border-gray-800 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -trangray-y-1/2 trangray-x-1/2 pointer-events-none transition-transform group-hover:scale-110" />

                    <h2 className="text-2xl font-bold text-white mb-4 relative z-10 flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-purple-400" />
                        Start Engine
                    </h2>

                    <p className="text-gray-400 mb-8 max-w-md relative z-10 leading-relaxed">
                        Engage the Autopilot system to autonomously scan the internet for emerging trends, isolate the top 15 highest-converting niches, and synthesize thousands of optimized listing combinations automatically.
                    </p>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl mb-6 relative z-10">
                            {error}
                        </div>
                    )}

                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-8 relative z-10">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Run Configuration
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Discovery Engine</span>
                                <span className="text-emerald-400 font-medium tracking-wide">ENABLED</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-gray-800 pt-3">
                                <span className="text-gray-400">Yield Target</span>
                                <span className="text-white font-mono">15 Niches</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-gray-800 pt-3">
                                <span className="text-gray-400">Execution Mode</span>
                                <span className="text-purple-400 font-medium">Synchronous (Phase 2)</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-900/40 hover:shadow-purple-900/60 transition-all disabled:opacity-50 relative z-10 transform hover:-translate-y-1 active:translate-y-0"
                    >
                        {isRunning ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Rocket className="w-6 h-6 fill-current" />
                        )}
                        {isRunning ? "Engine Engaged..." : "INITIATE PIPELINE"}
                    </button>
                </div>

                <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-3xl min-h-[400px] flex flex-col">
                    {!result && !isRunning && (
                        <div className="flex flex-col items-center justify-center text-center flex-1">
                            <div className="w-20 h-20 bg-gray-800/80 rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
                                <Bot className="w-10 h-10 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Awaiting Commands</h3>
                            <p className="text-gray-500 max-w-sm">Run Autopilot to generate a production batch of ranked niches.</p>
                        </div>
                    )}

                    {isRunning && (
                        <div className="flex flex-col items-center justify-center text-center flex-1">
                            <div className="w-20 h-20 relative mb-8">
                                <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
                                <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Bot className="w-8 h-8 text-purple-400 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">Scanning Global Markets</h3>
                            <div className="space-y-2 text-sm text-gray-500 font-mono">
                                <p>INITIALIZING TREND ENGINE_</p>
                                <p className="animate-pulse">FETCHING SIGNALS...</p>
                            </div>
                        </div>
                    )}

                    {typedResult && !isRunning && (
                        <div className="w-full flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Production Run Complete</h3>
                                    {runtimeSeconds && (
                                        <p className="text-xs text-gray-500 mt-1">Runtime: {runtimeSeconds}s</p>
                                    )}
                                </div>
                                <span className="px-4 py-1 rounded-full text-xs font-bold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/40">
                                    {typedResult.productsGenerated ?? total} Generated Listings
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Products</div>
                                    <div className="text-2xl font-black text-white">{total}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-600/50">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">Publish Queue</div>
                                    <div className="text-2xl font-black text-emerald-300">{publishCount}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/60">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-300 mb-1">Test Queue</div>
                                    <div className="text-2xl font-black text-yellow-300">{testCount}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/60">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-red-300 mb-1">Skipped</div>
                                    <div className="text-2xl font-black text-red-300">{skipCount}</div>
                                </div>
                            </div>

                            {signalSources.length > 0 && (
                                <div className="p-5 rounded-2xl bg-gray-950 border border-gray-800">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                            <DatabaseZap className="w-4 h-4 text-cyan-400" />
                                            Source Health
                                        </h4>
                                        <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wide">
                                            Blend confidence {Math.round((typedResult?.signalConfidence ?? 0) * 100)}%
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {signalSources.map((source) => (
                                            <div
                                                key={source.source}
                                                className={`p-4 rounded-xl border ${
                                                    source.status === "ok"
                                                        ? source.transport === "cache_fallback"
                                                            ? "border-yellow-500/40 bg-yellow-500/10"
                                                            : "border-cyan-500/40 bg-cyan-500/10"
                                                        : "border-red-500/40 bg-red-500/10"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="text-sm font-bold text-white">
                                                            {getSourceLabel(source.source)}
                                                        </div>
                                                        <div className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">
                                                            {source.transport === "cache_fallback" ? "Cached fallback" : "Live feed"}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[11px] text-gray-500 uppercase font-semibold">Weight</div>
                                                        <div className="text-lg font-bold text-white">{Math.round((source.normalizedWeight ?? 0) * 100)}%</div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                                    <div>
                                                        <div className="text-gray-500 uppercase font-semibold mb-1">Status</div>
                                                        <div className="text-white">{source.status.replaceAll("_", " ")}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-500 uppercase font-semibold mb-1">Confidence</div>
                                                        <div className="text-white">{Math.round(source.confidence * 100)}%</div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
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
                                                    {typeof source.cacheAgeMinutes === "number" && <p>Cache age: {source.cacheAgeMinutes} min</p>}
                                                    {source.details && <p>{source.details}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-2">
                                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    Opportunity Heatmap
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.slice(0, 8).map((p: AutopilotProduct, idx: number) => {
                                        const isActive = active && active.niche === p.niche;
                                        const statusColor =
                                            p.decision === "PUBLISH"
                                                ? "bg-emerald-500 text-emerald-50"
                                                : p.decision === "SKIP"
                                                ? "bg-red-500 text-red-50"
                                                : "bg-yellow-400 text-yellow-950";
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setSelectedIndex(idx)}
                                                className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[140px] ${
                                                    isActive
                                                        ? "border-emerald-500/70 bg-emerald-500/10 shadow-md shadow-emerald-900/40"
                                                        : "border-gray-800 bg-gray-900/60 hover:border-emerald-500/40 hover:bg-gray-900"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Niche</div>
                                                        <div className="text-sm font-bold text-white line-clamp-2">{p.niche}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Score</div>
                                                        <div className="text-2xl font-black text-white">{p.niche_score}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] mt-auto">
                                                    <span className={`px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${statusColor}`}>
                                                        {p.decision === "PUBLISH" ? "🟢 SELL NOW" : p.decision === "SKIP" ? "🔴 SKIP" : "🟡 TEST"}
                                                    </span>
                                                    <span className="text-emerald-300 font-mono text-xs flex items-center gap-1">
                                                        ${p.projectedRevenue}
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {active && (
                                <div className="mt-6 p-5 rounded-2xl bg-gray-950 border border-gray-800">
                                    <div className="flex flex-wrap justify-between gap-3 mb-3">
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{active.niche}</h4>
                                            <div className="mt-1">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                                    active.decision === "PUBLISH" ? "bg-emerald-500 text-emerald-50" :
                                                    active.decision === "SKIP" ? "bg-red-500 text-red-50" :
                                                    "bg-yellow-400 text-yellow-950"
                                                }`}>
                                                    {active.decision === "PUBLISH" ? "🟢 SELL NOW" : active.decision === "SKIP" ? "🔴 SKIP" : "🟡 TEST"}
                                                </span>
                                            </div>
                                            {active.slogan && (
                                                <p className="text-sm text-emerald-300 mt-1">
                                                    <span className="font-semibold">Slogan:</span> {active.slogan}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Score</div>
                                            <div className="text-3xl font-black text-white">{active.niche_score}</div>
                                            <div className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-300">
                                                <Gauge className="w-3 h-3" />
                                                {(() => {
                                                    const priority = active.publishPriority ?? 0;
                                                    const label = priority >= 75 ? "HIGH" : priority >= 50 ? "MEDIUM" : "LOW";
                                                    return <>CONFIDENCE: {label}</>;
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-800 text-xs">
                                        <div>
                                            <div className="text-gray-500 font-semibold uppercase mb-1">Demand</div>
                                            <div className="text-lg font-bold text-white">{Math.round(active.searchVolume ?? 0)}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 font-semibold uppercase mb-1">Comp Level</div>
                                            <div className="text-lg font-bold text-white">{Math.round(active.competitionDensity ?? 0)}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 font-semibold uppercase mb-1">Trend Strength</div>
                                            <div className="text-lg font-bold text-white">{Math.round(active.trendMomentum ?? active.trend?.score ?? 0)}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 font-semibold uppercase mb-1">Buyer Intent</div>
                                            <div className="text-lg font-bold text-white">{Math.round(active.buyerIntent ?? 0)}</div>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                        <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                                            <div className="text-gray-500 font-semibold uppercase mb-1">Est. Sales / mo</div>
                                            <div className="text-lg font-bold text-white">~{Math.max(4, Math.round((active.projectedRevenue || 500) / 60))}</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                                            <div className="text-gray-500 font-semibold uppercase mb-1">Profit / mo</div>
                                            <div className="text-lg font-bold text-emerald-300">${active.projectedRevenue}</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                                            <div className="text-gray-500 font-semibold uppercase mb-1">Annual Est.</div>
                                            <div className="text-lg font-bold text-emerald-200">${(active.projectedRevenue || 0) * 12}</div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex justify-end">
                                        <Link
                                            href={`/dashboard?niche=${encodeURIComponent(active.niche || "")}`}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 hover:from-emerald-400 hover:to-teal-400 transition-colors"
                                        >
                                            Develop Full Strategy
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
