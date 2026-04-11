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

const PLAN_CARDS: Array<{
    id: string;
    name: string;
    monthlyPrice: string;
    yearlyPrice: string;
    badge?: string;
    description: string;
    dailyTokens: number;
    highlight?: boolean;
    features: string[];
}> = [
    {
        id: "free",
        name: "Free",
        monthlyPrice: "$0/mo",
        yearlyPrice: "$0/yr",
        description: "For exploring TrendForge and running light research sprints.",
        dailyTokens: 50_000,
        features: [
            "Daily AI allowance tuned for solo sellers",
            "Strategy Factory access",
            "Trend Discovery & basic Bulk Factory",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        monthlyPrice: "$10/mo",
        yearlyPrice: "$110/yr",
        badge: "Most Popular",
        description: "For active sellers running multi\u2011niche campaigns and bulk testing.",
        dailyTokens: 1_000_000,
        highlight: true,
        features: [
            "20\u00d7 daily AI allowance vs Free",
            "Priority access for Bulk Factory & Autopilot",
            "Richer Trend Discovery & crossover concepts",
        ],
    },
];

export default function SettingsPage() {
    const [plan, setPlan] = useState<string | null>(null);
    const [usage, setUsage] = useState<UsageSummary | null>(null);
    const [limits, setLimits] = useState<PlanLimits | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/usage");
                const data: UsageResponse = await safeJson<UsageResponse>(res);

                if (!res.ok || !data.success) {
                    throw new Error(data.error || "Failed to load billing data");
                }

                if (cancelled) return;
                setPlan(data.plan ?? "free");
                setUsage(data.usage ?? null);
                setLimits(data.limits ?? null);
            } catch (err: unknown) {
                if (cancelled) return;
                if (err instanceof Error) {
                    setError(err.message || "Failed to load billing data");
                } else {
                    setError("Failed to load billing data");
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

    const normalizedPlan = (plan || "free").toLowerCase();

    async function startCheckout(targetPlan: string) {
        setIsRedirecting(true);
        setError(null);
        try {
            const res = await fetch("/api/billing/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan: targetPlan }),
            });

            const data = (await safeJson(res)) as { success?: boolean; url?: string; error?: string };

            if (!res.ok || !data.url) {
                throw new Error(data.error || "Failed to start checkout");
            }

            window.location.href = data.url;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to start checkout");
            } else {
                setError("Failed to start checkout");
            }
            setIsRedirecting(false);
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Workspace & Billing
                </h1>
                <p className="text-gray-400 text-sm max-w-2xl">
                    Review your current plan, daily AI allowance, and upgrade options tailored for how you run Strategy Factory,
                    Bulk Factory, Trend Discovery, and Autopilot.
                </p>
            </header>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <section className="p-5 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">Current plan</div>
                    <div className="text-lg font-semibold text-white">
                        {normalizedPlan === "pro" ? "Pro" : "Free"} plan
                    </div>
                    {limits && (
                        <div className="mt-1 text-xs text-gray-400">
                            Daily AI allowance: {limits.totalTokens24h.toLocaleString()} tokens
                        </div>
                    )}
                    {usage?.status === "degraded" && (
                        <div className="mt-2 text-xs text-amber-300">
                            {usage.degradedReason || "Usage telemetry is temporarily delayed while the system retries."}
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-500">
                    {isLoading ? "Checking usage limits…" : "Plan limits are applied across all AI‑heavy features."}
                </div>
            </section>

            {/* Billing period toggle */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-colors ${
                        billingPeriod === "monthly"
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                >
                    Monthly
                </button>
                <button
                    type="button"
                    onClick={() => setBillingPeriod("yearly")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-colors ${
                        billingPeriod === "yearly"
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                >
                    Yearly
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-[9px] font-black text-black tracking-widest normal-case">
                        Save $10
                    </span>
                </button>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PLAN_CARDS.map((card) => {
                    const isCurrent =
                        normalizedPlan === card.id ||
                        (normalizedPlan === "pro_yearly" && card.id === "pro");
                    const displayPrice =
                        billingPeriod === "yearly" ? card.yearlyPrice : card.monthlyPrice;
                    const checkoutPlan = billingPeriod === "yearly" ? "pro_yearly" : "pro";
                    return (
                        <div
                            key={card.id}
                            className={`relative p-6 rounded-2xl border bg-gray-900/60 flex flex-col gap-4 ${
                                card.highlight
                                    ? "border-emerald-500/60 shadow-lg shadow-emerald-900/40"
                                    : "border-gray-800"
                            }`}
                        >
                            {card.badge && (
                                <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-black tracking-widest uppercase text-black">
                                    {card.badge}
                                </span>
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{card.name}</h2>
                                <div className="text-2xl font-black text-emerald-300 mb-2">{displayPrice}</div>
                                {card.id === "pro" && billingPeriod === "yearly" && (
                                    <div className="text-[11px] text-gray-400 -mt-1 mb-2">
                                        ≈ $9.17/mo · billed annually
                                    </div>
                                )}
                                <p className="text-xs text-gray-400">{card.description}</p>
                            </div>
                            <div className="pt-2 text-xs text-gray-300">
                                <div className="font-semibold mb-1">Daily AI allowance</div>
                                <div className="text-sm font-bold text-white">
                                    {card.dailyTokens.toLocaleString()} tokens / day
                                </div>
                            </div>
                            <ul className="mt-2 space-y-1 text-xs text-gray-300">
                                {card.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2">
                                        <span className="mt-0.5 h-1 w-1 rounded-full bg-emerald-400" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    disabled={
                                        isCurrent || (card.id === "pro" && isRedirecting)
                                    }
                                    onClick={
                                        !isCurrent && card.id === "pro"
                                            ? () => startCheckout(checkoutPlan)
                                            : undefined
                                    }
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors border ${
                                        isCurrent || (card.id === "pro" && isRedirecting)
                                            ? "bg-gray-800 border-gray-700 text-gray-400 cursor-default"
                                            : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white"
                                    }`}
                                >
                                    {isCurrent
                                        ? "Current Plan"
                                        : card.id === "free"
                                        ? "Stay on Free"
                                        : isRedirecting
                                        ? "Redirecting to Stripe…"
                                        : billingPeriod === "yearly"
                                        ? "Upgrade to Pro Yearly"
                                        : "Upgrade to Pro"}
                                </button>
                                <span className="text-[10px] text-gray-500 text-right">
                                    Upgrades are applied instantly for new Strategy, Bulk, and Autopilot runs.
                                </span>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
