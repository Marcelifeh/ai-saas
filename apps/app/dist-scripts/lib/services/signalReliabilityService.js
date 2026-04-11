"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RELIABLE_SIGNAL_SOURCE_TIERS = exports.RELIABLE_SIGNAL_SOURCE_ORDER = void 0;
exports.getSourceHealth = getSourceHealth;
exports.isSourceInCooldown = isSourceInCooldown;
exports.recordSourceSuccess = recordSourceSuccess;
exports.recordSourceFailure = recordSourceFailure;
exports.persistSignalSnapshot = persistSignalSnapshot;
exports.getPersistentSignalSnapshot = getPersistentSignalSnapshot;
exports.getSignalReliabilityOverview = getSignalReliabilityOverview;
// server-only removed for script runtime
const prisma_1 = require("../../lib/db/prisma");
const cache_1 = require("../../lib/utils/cache");
const serverEnv_1 = require("../../lib/utils/serverEnv");
const SIGNAL_HEALTH_BLOCK_THRESHOLD = 3;
const SIGNAL_HEALTH_COOLDOWN_MS = 15 * 60 * 1000;
const SIGNAL_CACHE_WARNING_MINUTES = 30;
const CONFIDENCE_DECAY_LAMBDA = -Math.log(0.2) / (24 * 60);
const SIGNAL_TABLE_MEMORY_KEY = "signal_reliability_tables_available";
const STALE_WARNING_KEY_PREFIX = "signal_cache_warning";
exports.RELIABLE_SIGNAL_SOURCE_ORDER = ["google_trends", "serpapi_trends", "reddit", "hacker_news"];
exports.RELIABLE_SIGNAL_SOURCE_TIERS = {
    google_trends: "tier1",
    serpapi_trends: "tier1",
    reddit: "tier2",
    hacker_news: "tier2",
};
function roundConfidence(value) {
    return Math.round(Math.max(0, value) * 100) / 100;
}
function isMissingSignalTableError(err) {
    if (!err || typeof err !== "object")
        return false;
    const maybe = err;
    if (maybe.code !== "P2021") {
        return false;
    }
    return typeof maybe.message === "string"
        ? maybe.message.includes("SignalSnapshot") || maybe.message.includes("SignalSourceHealth")
        : true;
}
function markSignalTablesUnavailable() {
    cache_1.globalCache.set(SIGNAL_TABLE_MEMORY_KEY, false, 5 * 60 * 1000);
}
function markSignalTablesAvailable() {
    cache_1.globalCache.set(SIGNAL_TABLE_MEMORY_KEY, true, 5 * 60 * 1000);
}
function shouldUsePersistentSignalTables() {
    const cached = cache_1.globalCache.get(SIGNAL_TABLE_MEMORY_KEY);
    return cached !== false;
}
function defaultHealth(source) {
    return {
        source,
        status: "healthy",
        failureCount: 0,
    };
}
function toJsonArray(data) {
    return JSON.parse(JSON.stringify(data));
}
function toIso(value) {
    return value ? value.toISOString() : undefined;
}
function computeAgeMinutes(from) {
    return Math.max(0, Math.round((Date.now() - from.getTime()) / 60000));
}
function computeDecayedConfidence(baseConfidence, ageMinutes) {
    return roundConfidence(baseConfidence * Math.exp(-CONFIDENCE_DECAY_LAMBDA * ageMinutes));
}
function maybeWarnAboutStaleCache(source, ageMinutes, details) {
    if (ageMinutes < SIGNAL_CACHE_WARNING_MINUTES) {
        return;
    }
    const warningKey = `${STALE_WARNING_KEY_PREFIX}:${source}`;
    if (cache_1.globalCache.get(warningKey)) {
        return;
    }
    cache_1.globalCache.set(warningKey, true, 30 * 60 * 1000);
    console.warn("signal_cache_stale", {
        source,
        ageMinutes,
        details,
    });
}
async function getSourceHealth(source) {
    if (!shouldUsePersistentSignalTables()) {
        return defaultHealth(source);
    }
    try {
        const health = await prisma_1.prisma.signalSourceHealth.findUnique({
            where: { source },
        });
        markSignalTablesAvailable();
        if (!health) {
            return defaultHealth(source);
        }
        return {
            source,
            status: health.status || "healthy",
            failureCount: health.failureCount,
            lastSuccess: toIso(health.lastSuccess),
            lastFailure: toIso(health.lastFailure),
            cooldownUntil: toIso(health.cooldownUntil),
            lastError: health.lastError ?? undefined,
        };
    }
    catch (err) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return defaultHealth(source);
        }
        console.error("signal_health_read_failed", { source, err });
        return defaultHealth(source);
    }
}
function isSourceInCooldown(health) {
    if (!health.cooldownUntil) {
        return false;
    }
    return new Date(health.cooldownUntil).getTime() > Date.now();
}
async function recordSourceSuccess(source) {
    if (!shouldUsePersistentSignalTables()) {
        return;
    }
    try {
        await prisma_1.prisma.signalSourceHealth.upsert({
            where: { source },
            update: {
                status: "healthy",
                failureCount: 0,
                lastSuccess: new Date(),
                cooldownUntil: null,
                lastError: null,
            },
            create: {
                source,
                status: "healthy",
                failureCount: 0,
                lastSuccess: new Date(),
            },
        });
        markSignalTablesAvailable();
    }
    catch (err) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return;
        }
        console.error("signal_health_success_write_failed", { source, err });
    }
}
async function recordSourceFailure(source, errorMessage) {
    const now = new Date();
    const current = await getSourceHealth(source);
    const nextFailureCount = current.failureCount + 1;
    const nextStatus = nextFailureCount >= SIGNAL_HEALTH_BLOCK_THRESHOLD ? "blocked" : "degraded";
    const cooldownUntil = nextStatus === "blocked" ? new Date(now.getTime() + SIGNAL_HEALTH_COOLDOWN_MS) : null;
    const next = {
        source,
        status: nextStatus,
        failureCount: nextFailureCount,
        lastSuccess: current.lastSuccess,
        lastFailure: now.toISOString(),
        cooldownUntil: cooldownUntil?.toISOString(),
        lastError: errorMessage,
    };
    if (!shouldUsePersistentSignalTables()) {
        return next;
    }
    try {
        await prisma_1.prisma.signalSourceHealth.upsert({
            where: { source },
            update: {
                status: nextStatus,
                failureCount: nextFailureCount,
                lastFailure: now,
                cooldownUntil,
                lastError: errorMessage,
            },
            create: {
                source,
                status: nextStatus,
                failureCount: nextFailureCount,
                lastFailure: now,
                cooldownUntil,
                lastError: errorMessage,
            },
        });
        markSignalTablesAvailable();
    }
    catch (err) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return next;
        }
        console.error("signal_health_failure_write_failed", { source, err });
    }
    return next;
}
async function persistSignalSnapshot(snapshot) {
    if (!shouldUsePersistentSignalTables()) {
        return;
    }
    try {
        await prisma_1.prisma.signalSnapshot.upsert({
            where: {
                source_snapshotKey: {
                    source: snapshot.source,
                    snapshotKey: snapshot.snapshotKey,
                },
            },
            update: {
                data: toJsonArray(snapshot.data),
                confidence: snapshot.confidence,
                fetchedAt: snapshot.fetchedAt,
                expiresAt: snapshot.expiresAt,
                status: snapshot.status ?? "live",
                transport: snapshot.transport ?? "live",
                details: snapshot.details,
            },
            create: {
                source: snapshot.source,
                snapshotKey: snapshot.snapshotKey,
                data: toJsonArray(snapshot.data),
                confidence: snapshot.confidence,
                fetchedAt: snapshot.fetchedAt,
                expiresAt: snapshot.expiresAt,
                status: snapshot.status ?? "live",
                transport: snapshot.transport ?? "live",
                details: snapshot.details,
            },
        });
        markSignalTablesAvailable();
    }
    catch (err) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return;
        }
        console.error("signal_snapshot_write_failed", { source: snapshot.source, err });
    }
}
async function getPersistentSignalSnapshot(source, snapshotKey, details) {
    if (!shouldUsePersistentSignalTables()) {
        return null;
    }
    try {
        const snapshot = await prisma_1.prisma.signalSnapshot.findUnique({
            where: {
                source_snapshotKey: {
                    source,
                    snapshotKey,
                },
            },
        });
        markSignalTablesAvailable();
        if (!snapshot || !Array.isArray(snapshot.data)) {
            return null;
        }
        const data = snapshot.data.filter((value) => typeof value === "string" && value.trim().length > 0);
        if (data.length === 0) {
            return null;
        }
        const ageMinutes = computeAgeMinutes(snapshot.fetchedAt);
        const confidence = computeDecayedConfidence(snapshot.confidence, ageMinutes);
        maybeWarnAboutStaleCache(source, ageMinutes, details ?? snapshot.details ?? undefined);
        return {
            source,
            snapshotKey,
            data,
            confidence,
            fetchedAt: new Date().toISOString(),
            expiresAt: snapshot.expiresAt.toISOString(),
            status: ageMinutes > SIGNAL_CACHE_WARNING_MINUTES ? "degraded" : "cached",
            transport: "cache_fallback",
            details: details ?? snapshot.details ?? undefined,
            ageMinutes,
            cacheAgeMinutes: ageMinutes,
            cachedAt: snapshot.fetchedAt.toISOString(),
        };
    }
    catch (err) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return null;
        }
        console.error("signal_snapshot_read_failed", { source, err });
        return null;
    }
}
function isConfiguredSource(source) {
    if (source === "serpapi_trends") {
        return (0, serverEnv_1.hasServerEnv)("SERPAPI_API_KEY");
    }
    return true;
}
async function getSignalReliabilityOverview() {
    const fallback = exports.RELIABLE_SIGNAL_SOURCE_ORDER.map((source) => ({
        ...defaultHealth(source),
        tier: exports.RELIABLE_SIGNAL_SOURCE_TIERS[source],
        configured: isConfiguredSource(source),
    }));
    if (!shouldUsePersistentSignalTables()) {
        return fallback;
    }
    try {
        const [healthRows, snapshotRows] = await Promise.all([
            prisma_1.prisma.signalSourceHealth.findMany({
                where: { source: { in: exports.RELIABLE_SIGNAL_SOURCE_ORDER } },
            }),
            prisma_1.prisma.signalSnapshot.findMany({
                where: { source: { in: exports.RELIABLE_SIGNAL_SOURCE_ORDER } },
            }),
        ]);
        markSignalTablesAvailable();
        const healthMap = new Map(healthRows.map((row) => [row.source, row]));
        const snapshotMap = new Map(snapshotRows.map((row) => [row.source, row]));
        return exports.RELIABLE_SIGNAL_SOURCE_ORDER.map((source) => {
            const health = healthMap.get(source);
            const snapshot = snapshotMap.get(source);
            const ageMinutes = snapshot ? computeAgeMinutes(snapshot.fetchedAt) : undefined;
            const confidence = snapshot && ageMinutes !== undefined ? computeDecayedConfidence(snapshot.confidence, ageMinutes) : undefined;
            return {
                source,
                tier: exports.RELIABLE_SIGNAL_SOURCE_TIERS[source],
                status: health?.status || "healthy",
                failureCount: health?.failureCount ?? 0,
                lastSuccess: toIso(health?.lastSuccess),
                lastFailure: toIso(health?.lastFailure),
                cooldownUntil: toIso(health?.cooldownUntil),
                lastError: health?.lastError ?? undefined,
                snapshotStatus: snapshot?.status,
                snapshotTransport: snapshot?.transport,
                snapshotConfidence: confidence,
                snapshotFetchedAt: toIso(snapshot?.fetchedAt),
                snapshotExpiresAt: toIso(snapshot?.expiresAt),
                snapshotAgeMinutes: ageMinutes,
                snapshotDetails: snapshot?.details ?? undefined,
                configured: isConfiguredSource(source),
            };
        });
    }
    catch (err) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return fallback;
        }
        console.error("signal_reliability_overview_failed", err);
        return fallback;
    }
}
