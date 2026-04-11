import { useEffect, useState } from "react";
import { safeJson } from "@/lib/utils/safeJson";

const STORAGE_KEY_DISCOVERY = "tf_discovery_state_v1";

export type TrendSignalSource = {
    source: "google_trends" | "serpapi_trends" | "reddit" | "hacker_news";
    tier?: "tier1" | "tier2" | "tier3";
    status: "ok" | "blocked" | "rate_limited" | "invalid_payload" | "error" | "cooldown";
    data: string[];
    confidence: number;
    normalizedWeight?: number;
    agreementScore?: number;
    fetchedAt: string;
    transport: "live" | "cache_fallback";
    cachedAt?: string;
    cacheAgeMinutes?: number;
    details?: string;
};

type DiscoveryOpportunity = {
    niche: string;
    projectedRevenue?: number;
    audience?: string;
    niche_score: number;
    whyItSells?: string;
    research_demand?: number;
    research_competition?: number;
    trend_score?: number;
    safety?: {
        safe: boolean;
        modified: boolean;
        riskScore: number;
        originalName?: string;
    };
};

type DiscoveryData = {
    opportunities: DiscoveryOpportunity[];
    signals: string[];
    signalSources: TrendSignalSource[];
    signalConfidence: number;
    lastUpdated?: string;
};

function normalizeDiscoveryData(value: unknown): DiscoveryData | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const saved = value as {
        opportunities?: unknown;
        signals?: unknown;
        signalSources?: unknown;
        signalConfidence?: unknown;
        lastUpdated?: unknown;
    };

    if (!Array.isArray(saved.opportunities) || !Array.isArray(saved.signals)) {
        return null;
    }

    return {
        opportunities: saved.opportunities as DiscoveryOpportunity[],
        signals: saved.signals.filter((signal): signal is string => typeof signal === "string"),
        signalSources: Array.isArray(saved.signalSources) ? (saved.signalSources as TrendSignalSource[]) : [],
        signalConfidence: typeof saved.signalConfidence === "number" ? saved.signalConfidence : 0,
        lastUpdated: typeof saved.lastUpdated === "string" ? saved.lastUpdated : undefined,
    };
}

export function useDiscover() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<DiscoveryData | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY_DISCOVERY);
            if (!raw) return;
            const saved = JSON.parse(raw);
            const normalized = normalizeDiscoveryData(saved);
            if (normalized) {
                setData(normalized);
            }
        } catch (err) {
            console.error("Failed to restore discovery state", err);
        }
    }, []);

    const discover = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/discover", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const result: unknown = await safeJson(res);

            const parsed = result as {
                success?: boolean;
                error?: string;
                plan?: string;
                usedTokens24h?: number;
                limitTokens24h?: number;
                opportunities?: DiscoveryOpportunity[];
                signals?: string[];
                signalSources?: TrendSignalSource[];
                signalConfidence?: number;
                lastUpdated?: string;
            };

            if (res.status === 429) {
                const plan = parsed.plan || "current";
                const used = typeof parsed.usedTokens24h === "number" ? parsed.usedTokens24h : undefined;
                const limit = typeof parsed.limitTokens24h === "number" ? parsed.limitTokens24h : undefined;

                let message = parsed.error || "You've hit today's AI usage limit.";
                if (used !== undefined && limit !== undefined) {
                    message = `You've used ${used.toLocaleString()} of ${limit.toLocaleString()} AI tokens today on your ${plan} plan. Visit Billing to upgrade and unlock more runs.`;
                } else if (parsed.plan) {
                    message = `You've hit today's AI usage limit on your ${parsed.plan} plan. Visit Billing to upgrade and unlock more runs.`;
                }

                throw new Error(message);
            }

            if (!res.ok || !parsed.success) {
                throw new Error((parsed as any).details || parsed.error || "Failed to load discoveries");
            }

            const payload: DiscoveryData = {
                opportunities: parsed.opportunities ?? [],
                signals: parsed.signals ?? [],
                signalSources: parsed.signalSources ?? [],
                signalConfidence: parsed.signalConfidence ?? 0,
                lastUpdated: parsed.lastUpdated
            };

            setData(payload);

            try {
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(STORAGE_KEY_DISCOVERY, JSON.stringify(payload));
                }
            } catch (err) {
                console.error("Failed to persist discovery state", err);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An unexpected error occurred");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { discover, isLoading, error, data };
}
