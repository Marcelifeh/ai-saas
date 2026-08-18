import { useState } from "react";
import { safeJson } from "@/lib/utils/safeJson";

type CoreStrategyResponse = {
    success?: boolean;
    error?: string;
    plan?: string;
    usedTokens24h?: number;
    limitTokens24h?: number;
    data?: unknown;
};

type CoreBulkDiscoverResponse = {
    success?: boolean;
    error?: string;
    plan?: string;
    usedTokens24h?: number;
    limitTokens24h?: number;
    niches?: { niche: string }[];
};

type CoreChunkResponse = {
    success?: boolean;
    error?: string;
    plan?: string;
    usedTokens24h?: number;
    limitTokens24h?: number;
    products?: unknown[];
};

type CoreSloganResponse = {
    success?: boolean;
    error?: string;
    plan?: string;
    usedTokens24h?: number;
    limitTokens24h?: number;
    data?: unknown;
};

type ChunkNiche = { niche: string };

export type DesignMode = "AUTO" | "TEXT_ONLY" | "HYBRID" | "CHARACTER" | "CARTOON" | "ILLUSTRATION_ONLY";

type ListingRepackageInput = {
    niche: string;
    slogan: string;
    audience?: string;
    profile: Record<string, unknown>;
    visualStrategy?: Record<string, unknown>;
    marketTerms?: string[];
    purchaseMotives?: string[];
    marketplace: "amazon_merch" | "etsy" | "general";
    visualStyle?: string;
};

type SalesFeedbackInput = {
    niche: string;
    platform?: string;
    slogan: string;
    pattern?: string;
    tags?: string[];
    audience?: string;
    style?: string;
    productTitle?: string;
    impressions?: number;
    clicks?: number;
    orders?: number;
    favorites?: number;
    revenue?: number;
    refunds?: number;
    observedAt?: string;
    visualBatchMetrics?: Record<string, unknown>;
    visualStrategyMetrics?: Record<string, unknown>;
    visualReleaseGate?: Record<string, unknown>;
};

export function useFactory() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSloganRefreshing, setIsSloganRefreshing] = useState(false);
    const [isListingRefreshing, setIsListingRefreshing] = useState(false);
    const [isDesignRefreshing, setIsDesignRefreshing] = useState(false);

    const generateSingleStrategy = async (prompt: string, platform?: string, audience?: string, style?: string, designMode: DesignMode = "AUTO") => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/core", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "generateStrategy", prompt, platform, audience, style, designMode })
            });
            const json: unknown = await safeJson(res);
            const result = json as CoreStrategyResponse;

            if (res.status === 429) {
                const plan = result.plan || "current";
                const used = typeof result.usedTokens24h === "number" ? result.usedTokens24h : undefined;
                const limit = typeof result.limitTokens24h === "number" ? result.limitTokens24h : undefined;

                let message = result.error || "You've hit today's AI usage limit.";
                if (used !== undefined && limit !== undefined) {
                    message = `You've used ${used.toLocaleString()} of ${limit.toLocaleString()} AI tokens today on your ${plan} plan. Visit Billing to upgrade and unlock more runs.`;
                } else if (result.plan) {
                    message = `You've hit today's AI usage limit on your ${result.plan} plan. Visit Billing to upgrade and unlock more runs.`;
                }

                throw new Error(message);
            }

            if (!res.ok || !result.success) throw new Error((result as any).details || result.error || "Generation failed");
            return result.data;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An unexpected error occurred");
            } else {
                setError("An unexpected error occurred");
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const bulkDiscover = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/core", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "bulkDiscover" })
            });
            const json: unknown = await safeJson(res);
            const result = json as CoreBulkDiscoverResponse;

            if (res.status === 429) {
                const plan = result.plan || "current";
                const used = typeof result.usedTokens24h === "number" ? result.usedTokens24h : undefined;
                const limit = typeof result.limitTokens24h === "number" ? result.limitTokens24h : undefined;

                let message = result.error || "You've hit today's AI usage limit.";
                if (used !== undefined && limit !== undefined) {
                    message = `You've used ${used.toLocaleString()} of ${limit.toLocaleString()} AI tokens today on your ${plan} plan. Visit Billing to upgrade and unlock more runs.`;
                } else if (result.plan) {
                    message = `You've hit today's AI usage limit on your ${result.plan} plan. Visit Billing to upgrade and unlock more runs.`;
                }

                throw new Error(message);
            }

            if (!res.ok || !result.success) throw new Error((result as any).details || result.error || "Bulk discovery failed");
            return result.niches;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An unexpected error occurred");
            } else {
                setError("An unexpected error occurred");
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const generateChunk = async (niches: ChunkNiche[], isAutopilot: boolean = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/core", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "chunkGenerate", niches, isAutopilot })
            });
            const json: unknown = await safeJson(res);
            const result = json as CoreChunkResponse;

            if (res.status === 429) {
                const plan = result.plan || "current";
                const used = typeof result.usedTokens24h === "number" ? result.usedTokens24h : undefined;
                const limit = typeof result.limitTokens24h === "number" ? result.limitTokens24h : undefined;

                let message = result.error || "You've hit today's AI usage limit.";
                if (used !== undefined && limit !== undefined) {
                    message = `You've used ${used.toLocaleString()} of ${limit.toLocaleString()} AI tokens today on your ${plan} plan. Visit Billing to upgrade and unlock more runs.`;
                } else if (result.plan) {
                    message = `You've hit today's AI usage limit on your ${result.plan} plan. Visit Billing to upgrade and unlock more runs.`;
                }

                throw new Error(message);
            }

            if (!res.ok || !result.success) throw new Error((result as any).details || result.error || "Chunk generation failed");
            return result.products;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An unexpected error occurred");
            } else {
                setError("An unexpected error occurred");
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const recordSalesFeedback = async (payload: SalesFeedbackInput) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/factory/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json: unknown = await safeJson(res);
            const result = json as CoreStrategyResponse;

            if (!res.ok || !result.success) {
                throw new Error(result.error || "Failed to record sales feedback");
            }

            return result.data;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An unexpected error occurred");
            } else {
                setError("An unexpected error occurred");
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const regenerateSlogans = async (prompt: string, platform?: string, audience?: string, style?: string, excludeSlogans?: string[], designMode: DesignMode = "AUTO") => {
        setIsSloganRefreshing(true);
        setError(null);
        try {
            const res = await fetch("/api/factory/slogans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, platform, audience, style, excludeSlogans, designMode }),
            });
            const json: unknown = await safeJson(res);
            const result = json as CoreSloganResponse;

            if (res.status === 429) {
                const plan = result.plan || "current";
                const used = typeof result.usedTokens24h === "number" ? result.usedTokens24h : undefined;
                const limit = typeof result.limitTokens24h === "number" ? result.limitTokens24h : undefined;

                let message = result.error || "You've hit today's AI usage limit.";
                if (used !== undefined && limit !== undefined) {
                    message = `You've used ${used.toLocaleString()} of ${limit.toLocaleString()} AI tokens today on your ${plan} plan. Visit Billing to upgrade and unlock more runs.`;
                } else if (result.plan) {
                    message = `You've hit today's AI usage limit on your ${result.plan} plan. Visit Billing to upgrade and unlock more runs.`;
                }

                throw new Error(message);
            }

            if (!res.ok || !result.success) throw new Error(result.error || "Slogan regeneration failed");
            return result.data;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An unexpected error occurred");
            } else {
                setError("An unexpected error occurred");
            }
            return null;
        } finally {
            setIsSloganRefreshing(false);
        }
    };

    const regenerateDesigns = async (payload: {
        niche: string;
        slogans: string[];
        profile: Record<string, unknown>;
        style?: string;
        platform?: string;
        designMode: DesignMode;
        subjectOverride?: "AUTO" | "NO_PERSON" | "INCLUDE_PERSON";
    }) => {
        setIsDesignRefreshing(true);
        setError(null);
        try {
            const res = await fetch("/api/factory/designs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await safeJson<CoreStrategyResponse>(res);
            if (!res.ok || !json.success) throw new Error(json.error || "Design regeneration failed");
            return json.data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Design regeneration failed");
            return null;
        } finally {
            setIsDesignRefreshing(false);
        }
    };

    const repackageListing = async (payload: ListingRepackageInput) => {
        setIsListingRefreshing(true);
        setError(null);
        try {
            const res = await fetch("/api/factory/listing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await safeJson<CoreStrategyResponse>(res);
            if (!res.ok || !json.success) throw new Error(json.error || "Listing optimization failed");
            return json.data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Listing optimization failed");
            return null;
        } finally {
            setIsListingRefreshing(false);
        }
    };

    return { generateSingleStrategy, bulkDiscover, generateChunk, recordSalesFeedback, regenerateSlogans, regenerateDesigns, repackageListing, isLoading, isSloganRefreshing, isDesignRefreshing, isListingRefreshing, error };
}
