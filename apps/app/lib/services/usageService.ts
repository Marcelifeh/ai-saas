"use server";

import "server-only";
import { prisma } from "@/lib/db/prisma";

let usageMetricTableAvailable = true;
let usageMetricRetryAfter = 0;
let usageMetricFailureCount = 0;
let usageMetricWarningLogged = false;
let usageMetricDegradedReason: string | null = null;
let usageMetricVerificationInFlight: Promise<boolean> | null = null;

const USAGE_BACKOFF_BASE_MS = 1_000;
const USAGE_BACKOFF_MAX_MS = 30_000;

export type UsageDataStatus = "healthy" | "degraded";
export type UsageDataSource = "database" | "fallback";

export interface AIUsageRecord {
    userId?: string;
    workspaceId?: string;
    feature: string;
    model: string;
    tokensIn?: number;
    tokensOut?: number;
}

export interface AIUsageSummary {
    userId: string;
    totalTokens24h: number;
    totalTokens30d: number;
    byFeature24h: Record<string, number>;
    status: UsageDataStatus;
    dataSource: UsageDataSource;
    degradedReason?: string;
}

export interface PlanLimits {
    totalTokens24h: number;
    perFeature24h?: Record<string, number>;
}

export interface UsageGuardResult {
    allowed: boolean;
    reason?: string;
    plan?: string;
    limitTokens24h?: number;
    usedTokens24h?: number;
}

function isMissingUsageMetricTableError(err: unknown): boolean {
    // Only treat as a genuine "table missing" if Prisma returns P2021 specifically
    // for the UsageMetric table. Broader message-string matching causes false positives
    // when pgbouncer surfaces connection errors that happen to mention the table name.
    if (!err || typeof err !== "object") return false;
    const maybe = err as { code?: string; message?: string };
    if (maybe.code !== "P2021") return false;
    // If there's a message, confirm it's about UsageMetric (not some other table).
    if (typeof maybe.message === "string") {
        return maybe.message.includes("UsageMetric");
    }
    return true;
}

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }

    if (err && typeof err === "object" && "message" in err && typeof (err as { message?: unknown }).message === "string") {
        return (err as { message: string }).message;
    }

    return "Unknown runtime error";
}

async function usageMetricTableExists(): Promise<boolean> {
    if (usageMetricVerificationInFlight) {
        return usageMetricVerificationInFlight;
    }

    // Use a proper Prisma model query instead of raw SQL against information_schema.
    // Raw SQL queries against information_schema fail silently through PgBouncer in
    // transaction mode (the .catch() clause returns false, incorrectly reporting the
    // table as missing). A Prisma count() goes through the same pooled path as every
    // other query and is reliable.
    usageMetricVerificationInFlight = prisma.usageMetric
        .count()
        .then(() => true)          // any row count (including 0) means the table exists
        .catch((err: unknown) => {
            const maybe = err as { code?: string };
            if (maybe.code === "P2021") {
                // Definitively does not exist.
                return false;
            }
            // Connection error, timeout, etc. — not a schema problem.
            // Treat as transient so we don't enter degraded mode for a connectivity blip.
            console.warn("usage_metric_table_verify_failed", {
                reason: getErrorMessage(err),
                note: "Treated as transient — table assumed present.",
            });
            return true;
        })
        .finally(() => {
            usageMetricVerificationInFlight = null;
        });

    return usageMetricVerificationInFlight as Promise<boolean>;
}

function markUsageMetricUnavailable(reasonOverride?: string): void {
    usageMetricTableAvailable = false;
    usageMetricFailureCount += 1;
    const cappedDelay = Math.min(USAGE_BACKOFF_MAX_MS, USAGE_BACKOFF_BASE_MS * 2 ** Math.min(usageMetricFailureCount - 1, 5));
    const jitter = Math.floor(Math.random() * cappedDelay);
    const retryDelay = Math.max(USAGE_BACKOFF_BASE_MS, jitter);
    usageMetricRetryAfter = Date.now() + retryDelay;
    usageMetricDegradedReason = reasonOverride || "UsageMetric table is temporarily unavailable in the runtime database connection.";

    const logPayload = {
        status: "degraded",
        dataSource: "fallback",
        retryInMs: retryDelay,
        failureCount: usageMetricFailureCount,
        reason: usageMetricDegradedReason,
    };

    if (!usageMetricWarningLogged) {
        usageMetricWarningLogged = true;
        console.warn("usage_metric_degraded", logPayload);
    } else {
        console.info("usage_metric_retry_scheduled", logPayload);
    }
}

function markUsageMetricAvailable(): void {
    if (!usageMetricTableAvailable || usageMetricFailureCount > 0) {
        console.info("usage_metric_recovered", {
            status: "healthy",
            dataSource: "database",
        });
    }

    usageMetricTableAvailable = true;
    usageMetricRetryAfter = 0;
    usageMetricFailureCount = 0;
    usageMetricWarningLogged = false;
    usageMetricDegradedReason = null;
}

function shouldSkipUsageMetricAccess(): boolean {
    if (usageMetricTableAvailable) {
        return false;
    }

    if (Date.now() >= usageMetricRetryAfter) {
        usageMetricTableAvailable = true;
        return false;
    }

    return true;
}

function zeroUsage(userId: string, status: UsageDataStatus = "healthy", degradedReason?: string): AIUsageSummary {
    return {
        userId,
        totalTokens24h: 0,
        totalTokens30d: 0,
        byFeature24h: {},
        status,
        dataSource: status === "healthy" ? "database" : "fallback",
        degradedReason,
    };
}

function parseFeatureFromType(type: string): string | null {
    if (!type.startsWith("ai:")) return null;
    const parts = type.split(":");
    return parts.length >= 3 ? parts[1] : null;
}

async function handleUsageMetricFailure(err: unknown): Promise<boolean> {
    if (!isMissingUsageMetricTableError(err)) {
        return false;
    }

    const exists = await usageMetricTableExists();
    if (exists) {
        // Table exists — the P2021 was transient (connection blip, schema cache lag).
        // Allow the next request to retry immediately rather than entering degraded mode.
        console.info("usage_metric_transient_schema_error", {
            originalError: getErrorMessage(err),
            note: "Table confirmed present; retrying on next request.",
        });
        return true;
    }

    markUsageMetricUnavailable();
    return true;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
    admin: {
        totalTokens24h: Number.MAX_SAFE_INTEGER,
    },
    free: {
        totalTokens24h: 50_000,
        perFeature24h: {
            "strategy.single": 25_000,
            "factory.bulkChunk": 30_000,
            "factory.autopilotChunk": 35_000,
            "discovery.generateNiches": 20_000,
            "discovery.enrichNiches": 20_000,
        },
    },
    pro: {
        totalTokens24h: 1_000_000,
    },
    pro_yearly: {
        totalTokens24h: 1_000_000,
    },
};

export async function recordAIUsage(record: AIUsageRecord): Promise<void> {
    const totalTokens = (record.tokensIn ?? 0) + (record.tokensOut ?? 0);
    if (totalTokens <= 0 || shouldSkipUsageMetricAccess()) return;

    const userId = record.userId || "system";
    const type = `ai:${record.feature}:${record.model}:tokens`;

    try {
        await prisma.usageMetric.create({
            data: {
                userId,
                type,
                value: totalTokens,
            },
        });
        markUsageMetricAvailable();
    } catch (err: unknown) {
        if (await handleUsageMetricFailure(err)) {
            return;
        }
        console.error("Failed to record AI usage", err);
    }
}

export async function getAIUsageSummaryForUser(userId: string): Promise<AIUsageSummary> {
    const now = new Date();
    const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const since30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (shouldSkipUsageMetricAccess()) {
        return zeroUsage(userId, "degraded", usageMetricDegradedReason ?? "Usage metric storage is temporarily unavailable.");
    }

    try {
        const metrics = await prisma.usageMetric.findMany({
            where: {
                userId,
                createdAt: { gte: since30d },
                type: { startsWith: "ai:" },
            },
        });

        let totalTokens24h = 0;
        let totalTokens30d = 0;
        const byFeature24h: Record<string, number> = {};

        for (const metric of metrics) {
            totalTokens30d += metric.value;
            if (metric.createdAt >= since24h) {
                totalTokens24h += metric.value;
                const feature = parseFeatureFromType(metric.type) || "unknown";
                byFeature24h[feature] = (byFeature24h[feature] || 0) + metric.value;
            }
        }

        markUsageMetricAvailable();
        return {
            userId,
            totalTokens24h,
            totalTokens30d,
            byFeature24h,
            status: "healthy",
            dataSource: "database",
        };
    } catch (err: unknown) {
        if (await handleUsageMetricFailure(err)) {
            return zeroUsage(userId, "degraded", usageMetricDegradedReason ?? "Usage metric storage is temporarily unavailable.");
        }
        console.error("Failed to aggregate AI usage", err);
        return zeroUsage(userId, "degraded", "Usage metric aggregation failed unexpectedly.");
    }
}

async function getUserPlan(userId: string): Promise<string> {
    // Admin exemption: bypass all limits
    if (process.env.DISABLE_USAGE_LIMITS === "true") return "admin";
    const adminIds = (process.env.ADMIN_USER_IDS || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    if (adminIds.includes(userId)) return "admin";

    try {
        const activeSub = await prisma.subscription.findFirst({
            where: { userId, status: "active" },
            orderBy: { currentPeriodEnd: "desc" },
        });

        return activeSub?.plan || "free";
    } catch {
        return "free";
    }
}

export async function getUserPlanAndLimits(userId: string): Promise<{ plan: string; limits: PlanLimits }> {
    const plan = await getUserPlan(userId);
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    return { plan, limits };
}

export async function ensureUsageAllowed(userId: string, feature: string): Promise<UsageGuardResult> {
    try {
        const [plan, summary] = await Promise.all([
            getUserPlan(userId),
            getAIUsageSummaryForUser(userId),
        ]);

        const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

        if (summary.totalTokens24h >= limits.totalTokens24h) {
            return {
                allowed: false,
                reason: "Daily AI usage limit reached for your plan.",
                plan,
                limitTokens24h: limits.totalTokens24h,
                usedTokens24h: summary.totalTokens24h,
            };
        }

        const perFeature = limits.perFeature24h || {};
        const featureLimit = perFeature[feature];
        if (featureLimit && (summary.byFeature24h[feature] || 0) >= featureLimit) {
            return {
                allowed: false,
                reason: "Daily limit for " + feature + " reached on your plan.",
                plan,
                limitTokens24h: featureLimit,
                usedTokens24h: summary.byFeature24h[feature] || 0,
            };
        }

        return { allowed: true };
    } catch (err: unknown) {
        console.error("Usage guard failed; allowing request by default", err);
        return { allowed: true };
    }
}
