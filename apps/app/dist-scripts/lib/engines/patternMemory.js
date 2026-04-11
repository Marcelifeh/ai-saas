"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPattern = extractPattern;
exports.recordSloganPerformance = recordSloganPerformance;
exports.getTopPatterns = getTopPatterns;
exports.getGlobalTopPatterns = getGlobalTopPatterns;
// server-only removed for script runtime
const prisma_1 = require("../../lib/db/prisma");
// ─── Pattern Extraction ───────────────────────────────────────────────────────
/**
 * Normalize a slogan into a structural pattern key.
 * Captures sentence *type*, not word choice — lets the system learn that
 * "contrast_over" patterns convert better than "built_for" etc.
 */
function extractPattern(slogan) {
    const lower = slogan.toLowerCase().trim();
    if (/\bvs\.?\b/.test(lower) || / > /.test(lower))
        return "comparison";
    if (lower.includes(" not ") && lower.includes(" just "))
        return "not_x_just_y";
    if (/plot twist/.test(lower))
        return "plot_twist";
    if (/^still\b/.test(lower))
        return "still";
    if (/^built for\b/.test(lower) || /\bbuilt me$/.test(lower))
        return "built_for";
    if (/^(i am|i'm)\b/.test(lower))
        return "identity_declaration";
    if (/\. no apologies\.$|\. full volume\.$/.test(lower))
        return "declaration";
    if (/^(not your|not a typical|not just a)\b/.test(lower))
        return "not_your";
    if (lower.includes(" over "))
        return "contrast_over";
    if (/^(fueled by|powered by|running on)\b/.test(lower))
        return "fueled_by";
    if (/^\w+\. \w+\. \w+\.?$/.test(lower))
        return "triple_noun";
    if (/^(zero|no) [a-z]+/.test(lower))
        return "zero_noun";
    if (/\bmode\b/.test(lower))
        return "mode";
    if (/\bvibes?\b/.test(lower))
        return "vibes";
    if (/[?]$/.test(lower))
        return "rhetorical_question";
    if (lower.split(/\s+/).length <= 3)
        return "short_punch";
    if (lower.includes(" and "))
        return "compound";
    return "statement";
}
// ─── Core Operations ──────────────────────────────────────────────────────────
/**
 * Record or update raw performance signals for a slogan pattern.
 * Accumulates impressions/clicks/sales and recomputes CTR + conversion rate.
 * Uses upsert — safe to call repeatedly.
 */
async function recordSloganPerformance(input) {
    const pattern = extractPattern(input.slogan);
    const nicheKey = input.niche.trim().toLowerCase().slice(0, 60);
    const imp = Math.max(0, Math.round(input.impressions ?? 0));
    const clk = Math.max(0, Math.round(input.clicks ?? 0));
    const sal = Math.max(0, Math.round(input.sales ?? 0));
    try {
        const existing = await prisma_1.prisma.sloganPattern.findUnique({
            where: { niche_pattern: { niche: nicheKey, pattern } },
        });
        const totalImp = (existing?.impressions ?? 0) + imp;
        const totalClk = (existing?.clicks ?? 0) + clk;
        const totalSal = (existing?.sales ?? 0) + sal;
        const ctr = totalImp > 0 ? totalClk / totalImp : 0;
        const conversion = totalClk > 0 ? totalSal / totalClk : 0;
        // Bayesian score update: blends old score (75%) with new evidence (25%)
        // Benchmark: CTR ≥5% = great, Conversion ≥9% = great → performanceFactor >1
        let performanceFactor = 1.0;
        if (totalImp > 0) {
            if (ctr >= 0.05)
                performanceFactor += 0.35;
            else if (ctr >= 0.03)
                performanceFactor += 0.15;
            else if (ctr < 0.01)
                performanceFactor -= 0.30;
            else if (ctr < 0.02)
                performanceFactor -= 0.15;
        }
        if (totalClk > 0) {
            if (conversion >= 0.09)
                performanceFactor += 0.20;
            else if (conversion >= 0.06)
                performanceFactor += 0.10;
            else if (conversion < 0.02)
                performanceFactor -= 0.15;
        }
        performanceFactor = Math.max(0.3, Math.min(2.5, performanceFactor));
        const newScore = existing
            ? Math.max(0.1, Math.min(5.0, existing.score * 0.75 + performanceFactor * 0.25))
            : performanceFactor;
        await prisma_1.prisma.sloganPattern.upsert({
            where: { niche_pattern: { niche: nicheKey, pattern } },
            update: {
                impressions: { increment: imp },
                clicks: { increment: clk },
                sales: { increment: sal },
                ctr,
                conversion,
                score: newScore,
                uses: { increment: 1 },
                lastSlogan: input.slogan.slice(0, 120),
            },
            create: {
                niche: nicheKey,
                pattern,
                impressions: imp,
                clicks: clk,
                sales: sal,
                ctr,
                conversion,
                score: performanceFactor,
                uses: 1,
                lastSlogan: input.slogan.slice(0, 120),
            },
        });
    }
    catch (err) {
        // Non-blocking — pattern memory is always additive, never blocking
        console.warn("[patternMemory] recordSloganPerformance failed:", err);
    }
}
/**
 * Fetch top-performing patterns for a niche ordered by composite score.
 * Used by the Learned Scoring engine to boost future slogan runs.
 */
async function getTopPatterns(niche, limit = 20) {
    const nicheKey = niche.trim().toLowerCase().slice(0, 60);
    try {
        return (await prisma_1.prisma.sloganPattern.findMany({
            where: { niche: nicheKey },
            orderBy: [{ score: "desc" }, { uses: "desc" }],
            take: limit,
        }));
    }
    catch {
        return [];
    }
}
/**
 * Fetch global patterns (cross-niche) for cold-start situations.
 */
async function getGlobalTopPatterns(limit = 10) {
    try {
        return (await prisma_1.prisma.sloganPattern.findMany({
            where: { uses: { gte: 3 } },
            orderBy: [{ score: "desc" }, { ctr: "desc" }],
            take: limit,
        }));
    }
    catch {
        return [];
    }
}
