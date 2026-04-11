"use client";

import { useEffect, useState } from "react";
import { safeJson } from "@/lib/utils/safeJson";

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

export function AiUsageWidget() {
    const [usage, setUsage] = useState<UsageSummary | null>(null);
    const [plan, setPlan] = useState<string | null>(null);
    const [limits, setLimits] = useState<PlanLimits | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/usage");
                const data: UsageResponse = await safeJson<UsageResponse>(res);

                if (!res.ok || !data.success || !data.usage) {
                    throw new Error(data.error || "Failed to load usage");
                }

                if (cancelled) return;
                setUsage(data.usage);
                setPlan(data.plan ?? null);
                setLimits(data.limits ?? null);
            } catch (err: unknown) {
                if (cancelled) return;
                if (err instanceof Error) {
                    setError(err.message || "Failed to load usage");
                } else {
                    setError("Failed to load usage");
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

    if (isLoading && !usage) {
        return (
            <div className="mb-4 inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-800" />
                <div className="space-y-2">
                    <div className="h-3 w-32 bg-gray-800 rounded-full" />
                    <div className="h-2 w-24 bg-gray-800 rounded-full" />
                </div>
            </div>
        );
    }

    if (error || !usage) {
        return null;
    }

    const used = usage.totalTokens24h;
    const limit = limits?.totalTokens24h ?? null;
    const percent = limit ? Math.min(100, Math.round((used / limit) * 100)) : null;

    const planLabel = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Current";

    return (
        <div className={`mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 rounded-2xl border shadow-lg ${
            percent !== null && percent >= 90
                ? 'bg-gradient-to-r from-red-900/40 via-slate-900 to-slate-950 border-red-500/40 shadow-red-900/20'
                : percent !== null && percent >= 70
                ? 'bg-gradient-to-r from-yellow-900/30 via-slate-900 to-slate-950 border-yellow-500/30 shadow-yellow-900/10'
                : 'bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-950 border-emerald-500/30 shadow-emerald-900/20'
        }`}>
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold border ${
                    percent !== null && percent >= 90
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : percent !== null && percent >= 70
                        ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}>
                    ⚡
                </div>
                <div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${
                        percent !== null && percent >= 90 ? 'text-red-300/90' : percent !== null && percent >= 70 ? 'text-yellow-300/90' : 'text-emerald-300/80'
                    }`}>AI usage today</div>
                    <div className="text-sm font-semibold text-gray-100">
                        {limit
                            ? `${used.toLocaleString()} / ${limit.toLocaleString()} tokens on your ${planLabel} plan`
                            : `${used.toLocaleString()} tokens used in the last 24h`}
                    </div>
                    {usage.status === "degraded" && (
                        <div className="mt-1 text-[10px] text-amber-300/90">
                            {usage.degradedReason || "Usage telemetry is temporarily delayed while the system retries."}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-64">
                {percent !== null && (
                    <>
                        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${
                                    percent >= 90 ? 'bg-red-400' : percent >= 70 ? 'bg-yellow-400' : 'bg-emerald-400'
                                }`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-medium ${
                                percent >= 90 ? 'text-red-300' : percent >= 70 ? 'text-yellow-300' : 'text-gray-400'
                            }`}>{percent}% used</span>
                            {percent >= 80 && (
                                <a
                                    href="/settings"
                                    className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md border transition-colors ${
                                        percent >= 90
                                            ? 'bg-red-500/20 text-red-200 border-red-500/40 hover:bg-red-500/30'
                                            : 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40 hover:bg-yellow-500/30'
                                    }`}
                                >
                                    {percent >= 90 ? '⚠ Upgrade Now' : '↑ Upgrade'}
                                </a>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
