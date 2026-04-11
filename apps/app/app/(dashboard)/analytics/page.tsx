"use client";

import { useEffect, useState } from "react";
import { TrendSignalSource } from "../../../hooks/useDiscover";
import { safeJson } from "@/lib/utils/safeJson";

type SignalHealthOverview = {
    source: TrendSignalSource["source"];
    tier: "tier1" | "tier2" | "tier3";
    status: "healthy" | "degraded" | "blocked";
    failureCount: number;
    lastSuccess?: string;
    lastFailure?: string;
    cooldownUntil?: string;
    lastError?: string;
    snapshotStatus?: "live" | "cached" | "degraded";
    snapshotTransport?: "live" | "cache_fallback";
    snapshotConfidence?: number;
    snapshotFetchedAt?: string;
    snapshotExpiresAt?: string;
    snapshotAgeMinutes?: number;
    snapshotDetails?: string;
    configured: boolean;
};

function getSourceLabel(source: SignalHealthOverview["source"]): string {
    if (source === "google_trends") return "Google Trends";
    if (source === "serpapi_trends") return "SerpAPI Trends";
    if (source === "hacker_news") return "Hacker News";
    return "Reddit";
}

type UsageSummary = {
    totalTokens24h: number;
    totalTokens30d: number;
    byFeature24h: Record<string, number>;
    status: "healthy" | "degraded";
    dataSource: "database" | "fallback";
    degradedReason?: string;
};

type PlanLimits = {
    totalTokens24h: number;
    perFeature24h?: Record<string, number>;
};

interface UsageResponse {
    success: boolean;
    usage?: UsageSummary;
    plan?: string;
    limits?: PlanLimits;
    usageStatus?: "healthy" | "degraded";
    error?: string;
}

interface SignalHealthResponse {
    success: boolean;
    sources?: SignalHealthOverview[];
    error?: string;
}

export default function AnalyticsPage() {
    const [usage, setUsage] = useState<UsageSummary | null>(null);
    const [plan, setPlan] = useState<string | null>(null);
    const [limits, setLimits] = useState<PlanLimits | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [signalSources, setSignalSources] = useState<SignalHealthOverview[]>([]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                const [usageRes, signalRes] = await Promise.all([
                    fetch("/api/usage"),
                    fetch("/api/analytics/insights?view=source-health"),
                ]);
                const data: UsageResponse = await safeJson<UsageResponse>(usageRes);
                const signalData: SignalHealthResponse = await safeJson<SignalHealthResponse>(signalRes);

                if (!usageRes.ok || !data.success || !data.usage) {
                    throw new Error(data.error || "Failed to load usage analytics");
                }

                if (cancelled) return;
                setUsage(data.usage);
                setPlan(data.plan ?? null);
                setLimits(data.limits ?? null);
                setSignalSources(signalData.success && Array.isArray(signalData.sources) ? signalData.sources : []);
            } catch (err: unknown) {
                if (cancelled) return;
                if (err instanceof Error) {
                    setError(err.message || "Failed to load usage analytics");
                } else {
                    setError("Failed to load usage analytics");
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const planLabel = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Current";
    const usedToday = usage?.totalTokens24h ?? 0;
    const limitToday = limits?.totalTokens24h ?? null;
    const used30d = usage?.totalTokens30d ?? 0;
    const remainingToday = limitToday != null ? Math.max(0, limitToday - usedToday) : null;

    const featureEntries = usage ? Object.entries(usage.byFeature24h) : [];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                    Workspace Analytics
                </h1>
                <p className="text-gray-400 text-sm max-w-2xl">
                    Monitor how your workspace is consuming AI capacity across Strategy Factory, Bulk Factory, Trend Discovery, and Autopilot.
                </p>
            </header>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            {usage?.status === "degraded" && (
                <div className="p-4 bg-amber-900/20 border border-amber-500/40 rounded-xl text-amber-300 text-sm">
                    {usage.degradedReason || "Usage telemetry is temporarily degraded. Totals may be delayed while the system retries."}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Plan</div>
                    <div className="text-lg font-semibold text-white">{planLabel} plan</div>
                    {limitToday != null && (
                        <div className="mt-1 text-xs text-gray-400">
                            Daily AI allowance: {limitToday.toLocaleString()} tokens
                        </div>
                    )}
                </div>

                <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">AI tokens today</div>
                    <div className="text-2xl font-black text-emerald-400">{usedToday.toLocaleString()}</div>
                    {remainingToday != null && (
                        <div className="mt-1 text-xs text-gray-400">
                            {remainingToday > 0
                                ? `${remainingToday.toLocaleString()} tokens remaining before throttling`
                                : "Daily allowance reached"}
                        </div>
                    )}
                    {limitToday != null && (() => {
                        const pct = Math.min(100, Math.round((usedToday / limitToday) * 100));
                        return (
                            <div className="mt-2">
                                <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${
                                            pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-yellow-400' : 'bg-emerald-400'
                                        }`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{pct}% of daily allowance</div>
                            </div>
                        );
                    })()}
                </div>

                <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">AI tokens (30 days)</div>
                    <div className="text-2xl font-black text-blue-400">{used30d.toLocaleString()}</div>
                    <div className="mt-1 text-xs text-gray-400">Rolling 30‑day usage across all AI features.</div>
                </div>
            </div>

            <section className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-widest">Signal reliability</h2>
                    <span className="text-xs text-gray-500">Persistent source health and snapshot state</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {signalSources.map((source) => (
                        <div
                            key={source.source}
                            className={`p-4 rounded-2xl border ${
                                !source.configured
                                    ? "border-gray-700 bg-gray-950"
                                    : source.status === "healthy"
                                    ? "border-emerald-500/40 bg-emerald-500/10"
                                    : source.status === "blocked"
                                    ? "border-red-500/40 bg-red-500/10"
                                    : "border-yellow-500/40 bg-yellow-500/10"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <div className="text-sm font-bold text-white">{getSourceLabel(source.source)}</div>
                                    <div className="text-[11px] uppercase tracking-wide text-gray-400 mt-1">
                                        {source.tier.toUpperCase()} · {source.snapshotTransport === "cache_fallback" ? "Cached" : "Live"}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Snapshot confidence</div>
                                    <div className="text-lg font-bold text-white">
                                        {source.snapshotConfidence != null ? `${Math.round(source.snapshotConfidence * 100)}%` : "--"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <div className="text-gray-500 uppercase font-semibold mb-1">Health</div>
                                    <div className="text-white">{source.configured ? source.status : "not configured"}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 uppercase font-semibold mb-1">Failures</div>
                                    <div className="text-white">{source.failureCount}</div>
                                </div>
                            </div>

                            <div className="mt-4 text-xs text-gray-400 space-y-1">
                                {source.lastSuccess && <p>Last success: {new Date(source.lastSuccess).toLocaleString()}</p>}
                                {source.lastFailure && <p>Last failure: {new Date(source.lastFailure).toLocaleString()}</p>}
                                {source.cooldownUntil && <p>Cooldown until: {new Date(source.cooldownUntil).toLocaleString()}</p>}
                                {typeof source.snapshotAgeMinutes === "number" && <p>Snapshot age: {source.snapshotAgeMinutes} min</p>}
                                {source.lastError && <p>{source.lastError}</p>}
                                {source.snapshotDetails && <p>{source.snapshotDetails}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-widest">Usage by feature (last 24h)</h2>
                    {isLoading && (
                        <span className="text-xs text-gray-500">Refreshing…</span>
                    )}
                </div>

                {featureEntries.length === 0 ? (
                    <p className="text-sm text-gray-500">No AI activity recorded in the last 24 hours.</p>
                ) : (
                    <div className="space-y-2">
                        {featureEntries.map(([feature, value]) => {
                            const total = usedToday || 1;
                            const pct = Math.round((value / total) * 100);
                            return (
                                <div key={feature} className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between text-xs text-gray-300">
                                        <span className="font-medium">{feature}</span>
                                        <span className="text-gray-400">
                                            {value.toLocaleString()} tokens · {pct}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                                            style={{ width: `${Math.min(100, pct)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Upgrade CTA — shown when >80% of daily quota is consumed */}
            {limitToday != null && usedToday / limitToday >= 0.8 && (
                <section className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                    usedToday / limitToday >= 0.95
                        ? 'bg-red-900/20 border-red-500/40'
                        : 'bg-yellow-900/20 border-yellow-500/40'
                }`}>
                    <div>
                        <div className={`text-sm font-bold mb-1 ${
                            usedToday / limitToday >= 0.95 ? 'text-red-300' : 'text-yellow-300'
                        }`}>
                            {usedToday / limitToday >= 0.95
                                ? '⚠️ You\'re nearly out of AI capacity for today'
                                : '📈 You\'re approaching your daily AI limit'}
                        </div>
                        <p className="text-xs text-gray-400 max-w-lg">
                            Upgrade to Pro for 5× the daily token allowance — enough to run Autopilot, Bulk Factory, and Trend Discovery without throttling.
                        </p>
                    </div>
                    <a
                        href="/settings"
                        className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${
                            usedToday / limitToday >= 0.95
                                ? 'bg-red-600 hover:bg-red-500'
                                : 'bg-yellow-600 hover:bg-yellow-500'
                        }`}
                    >
                        Upgrade to Pro
                    </a>
                </section>
            )}
        </div>
    );
}
