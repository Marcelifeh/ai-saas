"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordMerchOutcomeFeedback = recordMerchOutcomeFeedback;
exports.getPersistedSalesSignalsForRankedSlogans = getPersistedSalesSignalsForRankedSlogans;
exports.mergeSalesSignalsInputs = mergeSalesSignalsInputs;
// server-only removed for script runtime
const prisma_1 = require("../../lib/db/prisma");
const FEEDBACK_LOOKBACK_DAYS = 180;
const EXACT_MATCH_WEIGHT = 0.58;
const PATTERN_WEIGHT = 0.22;
const TAG_WEIGHT = 0.12;
const NICHE_WEIGHT = 0.08;
function normalizeKey(value) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function normalizePlatform(value) {
    return value?.toLowerCase().trim() || "amazon";
}
function normalizeTags(tags) {
    if (!Array.isArray(tags))
        return [];
    return [...new Set(tags.map((tag) => tag.toLowerCase().trim()).filter(Boolean))].slice(0, 20);
}
function sanitizeCount(value) {
    if (typeof value !== "number" || Number.isNaN(value))
        return 0;
    return Math.max(0, Math.round(value));
}
function sanitizeMoney(value) {
    if (typeof value !== "number" || Number.isNaN(value))
        return 0;
    return Math.max(0, Math.round(value * 100) / 100);
}
function toObservedAt(value) {
    if (!value)
        return new Date();
    const observedAt = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(observedAt.getTime())) {
        throw new Error("Invalid observedAt timestamp");
    }
    return observedAt;
}
function inferPattern(slogan) {
    const lower = slogan.toLowerCase();
    if (lower.includes(">"))
        return "contrast";
    if (/plot twist/.test(lower))
        return "plot_twist";
    if (/not .* just /.test(lower))
        return "not_x_just_y";
    if (/still .* still /.test(lower))
        return "still";
    if (/^built for /.test(lower) || / built me$/.test(lower))
        return "built_for";
    if (/^i am /.test(lower))
        return "identity";
    if (/\. no apologies\.$|\. full volume\.$/.test(lower))
        return "declaration";
    return undefined;
}
function createBucket() {
    return {
        impressions: 0,
        clicks: 0,
        orders: 0,
        favorites: 0,
        rows: 0,
    };
}
function computeRecencyWeight(observedAt) {
    const ageDays = Math.max(0, (Date.now() - observedAt.getTime()) / 86400000);
    return Math.max(0.35, Math.exp(-ageDays / 90));
}
function appendRow(bucket, row) {
    const weight = computeRecencyWeight(row.observedAt);
    bucket.impressions += row.impressions * weight;
    bucket.clicks += row.clicks * weight;
    bucket.orders += row.orders * weight;
    bucket.favorites += row.favorites * weight;
    bucket.rows += weight;
}
function bucketToSignal(bucket) {
    if (!bucket)
        return undefined;
    const impressions = Math.round(bucket.impressions);
    const clicks = Math.round(bucket.clicks);
    const orders = Math.round(bucket.orders);
    const favorites = Math.round(bucket.favorites);
    const evidenceMagnitude = impressions + clicks * 4 + orders * 12 + favorites * 2;
    if (evidenceMagnitude <= 0)
        return undefined;
    const ctr = impressions > 0 ? roundMetric((clicks / impressions) * 100) : undefined;
    const conversionRate = clicks > 0
        ? roundMetric((orders / clicks) * 100)
        : impressions > 0
            ? roundMetric((orders / impressions) * 100)
            : undefined;
    return {
        ctr,
        conversionRate,
        favorites,
        confidence: roundConfidence(Math.max(0.18, Math.min(1, Math.log10(1 + evidenceMagnitude) / 2.6))),
        evidenceCount: Math.max(1, Math.round(bucket.rows)),
        impressions,
        clicks,
        orders,
    };
}
function roundMetric(value) {
    return Math.round(value * 100) / 100;
}
function roundConfidence(value) {
    return Math.round(value * 100) / 100;
}
function blendSignals(layers) {
    let ctrTotal = 0;
    let ctrWeight = 0;
    let conversionTotal = 0;
    let conversionWeight = 0;
    let favoriteTotal = 0;
    let favoriteWeight = 0;
    let confidenceTotal = 0;
    let confidenceWeight = 0;
    let evidenceCount = 0;
    let impressions = 0;
    let clicks = 0;
    let orders = 0;
    for (const layer of layers) {
        if (!layer.signal)
            continue;
        const reliability = layer.signal.confidence ?? 0.5;
        const weight = layer.baseWeight * Math.max(0.1, reliability);
        if (weight <= 0)
            continue;
        if (typeof layer.signal.ctr === "number") {
            ctrTotal += layer.signal.ctr * weight;
            ctrWeight += weight;
        }
        if (typeof layer.signal.conversionRate === "number") {
            conversionTotal += layer.signal.conversionRate * weight;
            conversionWeight += weight;
        }
        if (typeof layer.signal.favorites === "number") {
            favoriteTotal += layer.signal.favorites * weight;
            favoriteWeight += weight;
        }
        confidenceTotal += reliability * layer.baseWeight;
        confidenceWeight += layer.baseWeight;
        evidenceCount += layer.signal.evidenceCount ?? 0;
        impressions += layer.signal.impressions ?? 0;
        clicks += layer.signal.clicks ?? 0;
        orders += layer.signal.orders ?? 0;
    }
    if (ctrWeight === 0 && conversionWeight === 0 && favoriteWeight === 0) {
        return undefined;
    }
    return {
        ctr: ctrWeight > 0 ? roundMetric(ctrTotal / ctrWeight) : undefined,
        conversionRate: conversionWeight > 0 ? roundMetric(conversionTotal / conversionWeight) : undefined,
        favorites: favoriteWeight > 0 ? Math.round(favoriteTotal / favoriteWeight) : undefined,
        confidence: confidenceWeight > 0 ? roundConfidence(confidenceTotal / confidenceWeight) : undefined,
        evidenceCount: evidenceCount || undefined,
        impressions: impressions || undefined,
        clicks: clicks || undefined,
        orders: orders || undefined,
    };
}
function normalizeExistingSignals(input) {
    const signals = new Map();
    if (Array.isArray(input)) {
        for (const entry of input) {
            if (!entry || typeof entry !== "object")
                continue;
            const candidate = entry;
            if (typeof candidate.slogan !== "string" || !candidate.slogan.trim())
                continue;
            signals.set(normalizeKey(candidate.slogan), {
                slogan: candidate.slogan,
                signal: {
                    ctr: asOptionalNumber(candidate.ctr),
                    conversionRate: asOptionalNumber(candidate.conversionRate),
                    favorites: asOptionalNumber(candidate.favorites),
                    confidence: asOptionalNumber(candidate.confidence),
                    evidenceCount: asOptionalNumber(candidate.evidenceCount),
                    impressions: asOptionalNumber(candidate.impressions),
                    clicks: asOptionalNumber(candidate.clicks),
                    orders: asOptionalNumber(candidate.orders),
                },
            });
        }
        return signals;
    }
    if (!input || typeof input !== "object") {
        return signals;
    }
    for (const [key, value] of Object.entries(input)) {
        if (!value || typeof value !== "object")
            continue;
        const candidate = value;
        signals.set(normalizeKey(key), {
            slogan: key,
            signal: {
                ctr: asOptionalNumber(candidate.ctr),
                conversionRate: asOptionalNumber(candidate.conversionRate),
                favorites: asOptionalNumber(candidate.favorites),
                confidence: asOptionalNumber(candidate.confidence),
                evidenceCount: asOptionalNumber(candidate.evidenceCount),
                impressions: asOptionalNumber(candidate.impressions),
                clicks: asOptionalNumber(candidate.clicks),
                orders: asOptionalNumber(candidate.orders),
            },
        });
    }
    return signals;
}
function asOptionalNumber(value) {
    return typeof value === "number" && !Number.isNaN(value) ? value : undefined;
}
function isMissingFeedbackTableError(err) {
    if (!err || typeof err !== "object")
        return false;
    const candidate = err;
    if (candidate.code !== "P2021")
        return false;
    return typeof candidate.message === "string" ? candidate.message.includes("MerchOutcomeFeedback") : true;
}
/**
 * Fire-and-forget: updates SloganPattern.score for the observed pattern after
 * real sales data arrives. CTR / conversion vs. benchmarks adjusts the score
 * via a Bayesian-ish weighted update so future runEliteSloganEngine calls
 * promote proven patterns and demote duds.
 *
 * Benchmarks (Merch on Demand norms):
 *   CTR:        avg ~2%; good ≥3%; great ≥5%
 *   Conversion: avg ~4%; good ≥6%; great ≥9%
 */
async function updatePatternScoreFromFeedback(niche, slogan, pattern, impressions, clicks, orders) {
    // Require meaningful evidence before adjusting scores
    if (impressions < 20 && clicks < 5)
        return;
    const patternKey = (pattern?.trim().toLowerCase() || inferPattern(slogan)?.toLowerCase())?.slice(0, 80);
    if (!patternKey)
        return;
    const nicheKey = normalizeKey(niche);
    // Compute a performance multiplier: 1.0 = neutral, >1 = good, <1 = underperforming
    let performanceFactor = 1.0;
    if (impressions > 0) {
        const ctr = clicks / impressions;
        if (ctr >= 0.05)
            performanceFactor += 0.35;
        else if (ctr >= 0.03)
            performanceFactor += 0.15;
        else if (ctr < 0.01)
            performanceFactor -= 0.30;
        else if (ctr < 0.02)
            performanceFactor -= 0.15;
    }
    if (clicks > 0) {
        const convRate = orders / clicks;
        if (convRate >= 0.09)
            performanceFactor += 0.20;
        else if (convRate >= 0.06)
            performanceFactor += 0.10;
        else if (convRate < 0.02)
            performanceFactor -= 0.15;
    }
    performanceFactor = Math.max(0.3, Math.min(2.5, performanceFactor));
    try {
        const existing = await prisma_1.prisma.sloganPattern.findUnique({
            where: { niche_pattern: { niche: nicheKey, pattern: patternKey } },
        });
        if (existing) {
            // Bayesian-ish update: old score keeps 75% weight, new evidence 25%
            const newScore = Math.max(0.1, Math.min(5.0, existing.score * 0.75 + performanceFactor * 0.25));
            await prisma_1.prisma.sloganPattern.update({
                where: { niche_pattern: { niche: nicheKey, pattern: patternKey } },
                data: { score: newScore, uses: { increment: 1 } },
            });
        }
        else {
            await prisma_1.prisma.sloganPattern.create({
                data: {
                    niche: nicheKey,
                    pattern: patternKey,
                    score: performanceFactor,
                    uses: 1,
                    lastSlogan: slogan.slice(0, 120),
                },
            });
        }
    }
    catch (_) {
        // Non-blocking — pattern scoring is best-effort
    }
}
async function recordMerchOutcomeFeedback(input) {
    const niche = input.niche.trim();
    const slogan = input.slogan.trim();
    if (!input.userId || !niche || !slogan) {
        throw new Error("userId, niche, and slogan are required");
    }
    try {
        const record = await prisma_1.prisma.merchOutcomeFeedback.create({
            data: {
                userId: input.userId,
                niche,
                nicheKey: normalizeKey(niche),
                platform: normalizePlatform(input.platform),
                slogan,
                sloganKey: normalizeKey(slogan),
                pattern: input.pattern?.trim() || inferPattern(slogan) || null,
                tags: normalizeTags(input.tags),
                audience: input.audience?.trim() || null,
                style: input.style?.trim() || null,
                productTitle: input.productTitle?.trim() || null,
                impressions: sanitizeCount(input.impressions),
                clicks: sanitizeCount(input.clicks),
                orders: sanitizeCount(input.orders),
                favorites: sanitizeCount(input.favorites),
                revenue: sanitizeMoney(input.revenue),
                refunds: sanitizeCount(input.refunds),
                observedAt: toObservedAt(input.observedAt),
            },
        });
        // Autonomous learning loop: update pattern score from real performance.
        // Non-blocking — never delay the response on this.
        updatePatternScoreFromFeedback(niche, slogan, input.pattern?.trim() || null, sanitizeCount(input.impressions), sanitizeCount(input.clicks), sanitizeCount(input.orders)).catch(() => { });
        return record;
    }
    catch (err) {
        if (isMissingFeedbackTableError(err)) {
            throw new Error("Sales feedback tables are not available yet. Apply the Prisma schema changes before recording outcomes.");
        }
        throw err;
    }
}
async function getPersistedSalesSignalsForRankedSlogans(params) {
    if (!params.userId)
        return {};
    const targets = params.rankedSlogans
        .map((entry) => ({
        slogan: entry.slogan?.trim() || "",
        pattern: entry.pattern?.trim(),
        tags: normalizeTags(entry.tags),
    }))
        .filter((entry) => Boolean(entry.slogan));
    if (targets.length === 0)
        return {};
    const nicheKey = normalizeKey(params.niche);
    const platform = normalizePlatform(params.platform);
    const sloganKeys = [...new Set(targets.map((entry) => normalizeKey(entry.slogan)))];
    const cutoff = new Date(Date.now() - FEEDBACK_LOOKBACK_DAYS * 86400000);
    try {
        const rows = await prisma_1.prisma.merchOutcomeFeedback.findMany({
            where: {
                userId: params.userId,
                platform,
                observedAt: { gte: cutoff },
                OR: [
                    { sloganKey: { in: sloganKeys } },
                    { nicheKey },
                ],
            },
            select: {
                sloganKey: true,
                nicheKey: true,
                pattern: true,
                tags: true,
                impressions: true,
                clicks: true,
                orders: true,
                favorites: true,
                observedAt: true,
            },
            orderBy: { observedAt: "desc" },
            take: 500,
        });
        const exactBuckets = new Map();
        const patternBuckets = new Map();
        const nicheBucket = createBucket();
        for (const row of rows) {
            const key = row.sloganKey;
            if (sloganKeys.includes(key)) {
                const bucket = exactBuckets.get(key) || createBucket();
                appendRow(bucket, row);
                exactBuckets.set(key, bucket);
            }
            if (row.nicheKey !== nicheKey) {
                continue;
            }
            appendRow(nicheBucket, row);
            if (row.pattern) {
                const patternBucket = patternBuckets.get(row.pattern) || createBucket();
                appendRow(patternBucket, row);
                patternBuckets.set(row.pattern, patternBucket);
            }
        }
        const results = {};
        for (const target of targets) {
            const exactSignal = bucketToSignal(exactBuckets.get(normalizeKey(target.slogan)));
            const patternSignal = target.pattern ? bucketToSignal(patternBuckets.get(target.pattern)) : undefined;
            const tagBucket = createBucket();
            if (target.tags.length > 0) {
                for (const row of rows) {
                    if (row.nicheKey !== nicheKey)
                        continue;
                    if (!row.tags.some((tag) => target.tags.includes(tag)))
                        continue;
                    appendRow(tagBucket, row);
                }
            }
            const tagSignal = target.tags.length > 0 ? bucketToSignal(tagBucket) : undefined;
            const nicheSignal = bucketToSignal(nicheBucket);
            const learnedSignal = blendSignals([
                { signal: exactSignal, baseWeight: EXACT_MATCH_WEIGHT },
                { signal: patternSignal, baseWeight: PATTERN_WEIGHT },
                { signal: tagSignal, baseWeight: TAG_WEIGHT },
                { signal: nicheSignal, baseWeight: NICHE_WEIGHT },
            ]);
            if (learnedSignal) {
                results[target.slogan] = learnedSignal;
            }
        }
        return results;
    }
    catch (err) {
        if (isMissingFeedbackTableError(err)) {
            return {};
        }
        throw err;
    }
}
function mergeSalesSignalsInputs(existing, learned) {
    const existingSignals = normalizeExistingSignals(existing);
    const learnedEntries = Object.entries(learned);
    if (existingSignals.size === 0 && learnedEntries.length === 0)
        return existing;
    if (existingSignals.size === 0)
        return learned;
    if (learnedEntries.length === 0)
        return existing;
    const merged = new Map();
    for (const [key, entry] of existingSignals.entries()) {
        merged.set(key, entry);
    }
    for (const [slogan, signal] of learnedEntries) {
        const normalizedKey = normalizeKey(slogan);
        const existingEntry = merged.get(normalizedKey);
        if (!existingEntry) {
            merged.set(normalizedKey, { slogan, signal });
            continue;
        }
        merged.set(normalizedKey, {
            slogan: existingEntry.slogan,
            signal: blendSignals([
                { signal: existingEntry.signal, baseWeight: 0.35 },
                { signal, baseWeight: 0.65 },
            ]) || signal,
        });
    }
    return Object.fromEntries([...merged.values()].map((entry) => [entry.slogan, entry.signal]));
}
