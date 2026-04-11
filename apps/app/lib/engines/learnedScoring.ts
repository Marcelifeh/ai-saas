import "server-only";
import { extractPattern, getTopPatterns } from "./patternMemory";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoredSlogan {
    text: string;
    /** Composite score: base heuristics + learned performance boost */
    score: number;
    /** Points added from DB performance data (ctr/conversion/score) */
    learnedBoost: number;
    /** Structural pattern key e.g. "contrast_over", "identity_declaration" */
    pattern: string;
    /** True if this slogan has real DB evidence backing it */
    hasEvidenced: boolean;
}

// ─── Learned Boost ────────────────────────────────────────────────────────────

/**
 * Returns the score boost earned by a slogan's structural pattern
 * based on past CTR and conversion data stored in SloganPattern.
 *
 * Weights:
 *   CTR × 50      — engagement signal (e.g. 5% CTR → +2.5)
 *   Conversion × 100 — sales proof   (e.g. 8% conv → +8.0)
 *   (score − 1) × 20 — Bayesian factor above/below neutral
 *
 * Capped at +25 bonus / -15 penalty to prevent data outliers dominating.
 */
export async function getLearnedBoost(slogan: string, niche?: string): Promise<number> {
    const pattern = extractPattern(slogan);
    const nicheKey = (niche || "global").trim().toLowerCase().slice(0, 60);

    try {
        const patterns = await getTopPatterns(nicheKey, 50);
        const record = patterns.find((p) => p.pattern === pattern);

        if (!record) return 0;

        const ctrBoost = record.ctr * 50;
        const convBoost = record.conversion * 100;
        const scoreAdj = (record.score - 1.0) * 20;

        return Math.round(Math.max(-15, Math.min(25, ctrBoost + convBoost + scoreAdj)));
    } catch {
        return 0;
    }
}

// ─── Ranking Engine ───────────────────────────────────────────────────────────

/**
 * Build a pattern boost map for a niche from a single DB fetch.
 * More efficient than calling getLearnedBoost() per-slogan.
 */
async function buildBoostMap(niche: string): Promise<Map<string, number>> {
    const patterns = await getTopPatterns(niche, 50);
    const map = new Map<string, number>();
    for (const record of patterns) {
        const ctrBoost = record.ctr * 50;
        const convBoost = record.conversion * 100;
        const scoreAdj = (record.score - 1.0) * 20;
        const boost = Math.round(Math.max(-15, Math.min(25, ctrBoost + convBoost + scoreAdj)));
        map.set(record.pattern, boost);
    }
    return map;
}

/**
 * Base heuristic score for a slogan (no DB required).
 * Real CTR/conversion data stacks on top via learnedBoost.
 */
function baseHeuristicScore(slogan: string): number {
    let score = 0;

    const words = slogan.split(/\s+/).length;
    if (words >= 2 && words <= 6) score += 15;
    else if (words <= 8) score += 8;

    if (/[!?]/.test(slogan)) score += 8;
    if (/[&+]/.test(slogan)) score += 4;

    // Emotion triggers
    if (/(obsessed|addicted|passionate|devotee|proud|living for|always|never|still)/i.test(slogan)) score += 10;

    // Identity structure
    if (/\b(person|parent|lover|fan|maker|creator|runner|rider|reader)\b/i.test(slogan)) score += 8;

    // Contrast / tension (high converting structure)
    if (/ over | not | vs | > /i.test(slogan)) score += 12;

    return score;
}

/**
 * Rank an array of raw slogan strings using heuristics + learned DB signals.
 *
 * Uses a single DB fetch for the whole batch — O(1) Supabase round trip.
 * Falls back gracefully if DB is unavailable.
 */
export async function rankSlogans(slogans: string[], niche: string): Promise<ScoredSlogan[]> {
    let boostMap = new Map<string, number>();
    try {
        boostMap = await buildBoostMap(niche);
    } catch {
        // Fallback to pure heuristics — non-blocking
    }

    const scored: ScoredSlogan[] = slogans.map((text) => {
        const pattern = extractPattern(text);
        const learnedBoost = boostMap.get(pattern) ?? 0;
        const base = baseHeuristicScore(text);
        return {
            text,
            score: base + learnedBoost,
            learnedBoost,
            pattern,
            hasEvidenced: learnedBoost > 0,
        };
    });

    return scored.sort((a, b) => b.score - a.score);
}

/**
 * Return only the top-performing slogans.
 * Default: top 10% of the ranked list, with a floor of 4.
 *
 * These are the ONLY slogans forwarded to product generation,
 * listing creation, and export — closing the loop on the learning system.
 */
export function selectWinners<T extends { score: number }>(
    ranked: T[],
    percentage = 0.1,
): T[] {
    if (ranked.length === 0) return ranked;
    const cutoff = Math.max(4, Math.ceil(ranked.length * percentage));
    return ranked.slice(0, cutoff);
}

/**
 * Full pipeline: rank → select winners.
 * Convenience wrapper for autopilot and factory callers.
 */
export async function getWinningSlogans(
    slogans: string[],
    niche: string,
    percentage = 0.1,
): Promise<ScoredSlogan[]> {
    if (slogans.length === 0) return [];
    try {
        const ranked = await rankSlogans(slogans, niche);
        return selectWinners(ranked, percentage);
    } catch {
        // If scoring fails entirely, return unmodified (never drop slogans)
        return slogans.map((text) => ({
            text,
            score: 0,
            learnedBoost: 0,
            pattern: extractPattern(text),
            hasEvidenced: false,
        }));
    }
}
