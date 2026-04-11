import { useEffect, useState } from "react";
import { TrendSignalSource } from "./useDiscover";
import { safeJson } from "@/lib/utils/safeJson";

const STORAGE_KEY_AUTOPILOT = "tf_autopilot_state_v1";

export type AutopilotProduct = {
    decision?: string;
    niche?: string;
    niche_score?: number;
    projectedRevenue?: number;
    publishPriority?: number;
    searchVolume?: number;
    competitionDensity?: number;
    trendMomentum?: number;
    trend?: { score?: number };
    buyerIntent?: number;
    slogan?: string;
};

export type AutopilotRunResult = {
    success?: boolean;
    error?: string;
    plan?: string;
    usedTokens24h?: number;
    limitTokens24h?: number;
    runtimeSeconds?: number;
    productsGenerated?: number;
    signalConfidence?: number;
    signalSources?: TrendSignalSource[];
    data?: AutopilotProduct[];
};

export function useAutopilot() {
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AutopilotRunResult | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY_AUTOPILOT);
            if (!raw) return;
            const saved = JSON.parse(raw) as unknown;
            if (saved && typeof saved === "object") {
                setResult(saved as AutopilotRunResult);
            }
        } catch (err) {
            console.error("Failed to restore autopilot state", err);
        }
    }, []);

    const runAutopilot = async (workspaceId: string) => {
        setIsRunning(true);
        setError(null);
        try {
            const startedAt = Date.now();
            const res = await fetch("/api/autopilot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workspaceId })
            });
            const data: unknown = await safeJson(res);

            const parsed = data as AutopilotRunResult & Record<string, unknown>;

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
                throw new Error(parsed.error || "Autopilot failed to start");
            }
            const enriched = {
                ...parsed,
                runtimeSeconds: parsed.runtimeSeconds ?? Math.max(1, Math.round((Date.now() - startedAt) / 1000))
            };

            setResult(enriched);
            try {
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(STORAGE_KEY_AUTOPILOT, JSON.stringify(enriched));
                }
            } catch (err) {
                console.error("Failed to persist autopilot state", err);
            }
            return enriched;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An unexpected error occurred");
            } else {
                setError("An unexpected error occurred");
            }
            return null;
        } finally {
            setIsRunning(false);
        }
    };

    return { runAutopilot, isRunning, error, result };
}
