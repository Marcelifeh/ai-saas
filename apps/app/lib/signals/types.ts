import "server-only";
import type { TrendSignalSourceResult, TrendSignalSourceTier } from "@/lib/ai/trendEngine";

// ---------------------------------------------------------------------------
// TrendSource — formal typed contract for every signal provider.
//
// Each provider (Google Trends, SerpAPI, Reddit, HackerNews …) must implement
// this interface so the registry can treat them uniformly: fetch, health-check,
// and apply freshness-weighted blending without knowing provider internals.
// ---------------------------------------------------------------------------

export interface TrendSource {
    /** Stable identifier — used for logging, caching, health tracking. */
    readonly name: string;

    /** Signal quality tier matching signalReliabilityService tiers. */
    readonly tier: TrendSignalSourceTier;

    /** Fetch the latest signals from this provider. Should never throw —
     *  return an error-state `TrendSignalSourceResult` on failure. */
    fetch(): Promise<TrendSignalSourceResult>;

    /** Optional liveness probe.  Returns true when the source is reachable. */
    healthCheck?(): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// BlendedSignal — output of the registry's freshness-weighted blend.
// ---------------------------------------------------------------------------

export interface BlendedSignal {
    /** Deduped trend terms, ordered by composite score descending. */
    terms: string[];

    /** Per-source diagnostics with composite scores applied. */
    sources: Array<TrendSignalSourceResult & {
        freshnessWeight: number;
        compositeScore: number;
    }>;

    /** Weighted average confidence across all active sources. */
    blendedConfidence: number;

    /** ISO timestamp of when this blend was computed. */
    blendedAt: string;
}
