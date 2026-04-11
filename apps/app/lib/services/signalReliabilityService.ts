import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { globalCache } from "@/lib/utils/cache";
import { hasServerEnv } from "@/lib/utils/serverEnv";

export type ReliableSignalSourceName = "google_trends" | "serpapi_trends" | "reddit" | "hacker_news";
export type PersistentSnapshotStatus = "live" | "cached" | "degraded";
export type PersistentSnapshotTransport = "live" | "cache_fallback";
export type PersistentSourceHealthStatus = "healthy" | "degraded" | "blocked";
export type ReliableSourceTier = "tier1" | "tier2" | "tier3";

export interface SourceHealthState {
    source: ReliableSignalSourceName;
    status: PersistentSourceHealthStatus;
    failureCount: number;
    lastSuccess?: string;
    lastFailure?: string;
    cooldownUntil?: string;
    lastError?: string;
}

export interface PersistentSignalSnapshot {
    source: ReliableSignalSourceName;
    snapshotKey: string;
    data: string[];
    confidence: number;
    fetchedAt: string;
    expiresAt: string;
    status: PersistentSnapshotStatus;
    transport: PersistentSnapshotTransport;
    details?: string;
    ageMinutes: number;
    cacheAgeMinutes?: number;
    cachedAt?: string;
}

export interface SignalReliabilityOverviewItem extends SourceHealthState {
    tier: ReliableSourceTier;
    snapshotStatus?: PersistentSnapshotStatus;
    snapshotTransport?: PersistentSnapshotTransport;
    snapshotConfidence?: number;
    snapshotFetchedAt?: string;
    snapshotExpiresAt?: string;
    snapshotAgeMinutes?: number;
    snapshotDetails?: string;
    configured: boolean;
}

const SIGNAL_HEALTH_BLOCK_THRESHOLD = 3;
const SIGNAL_HEALTH_COOLDOWN_MS = 15 * 60 * 1000;
const SIGNAL_CACHE_WARNING_MINUTES = 30;
const CONFIDENCE_DECAY_LAMBDA = -Math.log(0.2) / (24 * 60);
const SIGNAL_TABLE_MEMORY_KEY = "signal_reliability_tables_available";
const STALE_WARNING_KEY_PREFIX = "signal_cache_warning";
export const RELIABLE_SIGNAL_SOURCE_ORDER: ReliableSignalSourceName[] = ["google_trends", "serpapi_trends", "reddit", "hacker_news"];
export const RELIABLE_SIGNAL_SOURCE_TIERS: Record<ReliableSignalSourceName, ReliableSourceTier> = {
    google_trends: "tier1",
    serpapi_trends: "tier1",
    reddit: "tier2",
    hacker_news: "tier2",
};

function roundConfidence(value: number): number {
    return Math.round(Math.max(0, value) * 100) / 100;
}

function isMissingSignalTableError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const maybe = err as { code?: string; message?: string };
    if (maybe.code !== "P2021") {
        return false;
    }

    return typeof maybe.message === "string"
        ? maybe.message.includes("SignalSnapshot") || maybe.message.includes("SignalSourceHealth")
        : true;
}

function markSignalTablesUnavailable(): void {
    globalCache.set(SIGNAL_TABLE_MEMORY_KEY, false, 5 * 60 * 1000);
}

function markSignalTablesAvailable(): void {
    globalCache.set(SIGNAL_TABLE_MEMORY_KEY, true, 5 * 60 * 1000);
}

function shouldUsePersistentSignalTables(): boolean {
    const cached = globalCache.get(SIGNAL_TABLE_MEMORY_KEY);
    return cached !== false;
}

function defaultHealth(source: ReliableSignalSourceName): SourceHealthState {
    return {
        source,
        status: "healthy",
        failureCount: 0,
    };
}

function toJsonArray(data: string[]): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

function toIso(value?: Date | null): string | undefined {
    return value ? value.toISOString() : undefined;
}

function computeAgeMinutes(from: Date): number {
    return Math.max(0, Math.round((Date.now() - from.getTime()) / 60000));
}

function computeDecayedConfidence(baseConfidence: number, ageMinutes: number): number {
    return roundConfidence(baseConfidence * Math.exp(-CONFIDENCE_DECAY_LAMBDA * ageMinutes));
}

function maybeWarnAboutStaleCache(source: ReliableSignalSourceName, ageMinutes: number, details?: string): void {
    if (ageMinutes < SIGNAL_CACHE_WARNING_MINUTES) {
        return;
    }

    const warningKey = `${STALE_WARNING_KEY_PREFIX}:${source}`;
    if (globalCache.get(warningKey)) {
        return;
    }

    globalCache.set(warningKey, true, 30 * 60 * 1000);
    console.warn("signal_cache_stale", {
        source,
        ageMinutes,
        details,
    });
}

export async function getSourceHealth(source: ReliableSignalSourceName): Promise<SourceHealthState> {
    if (!shouldUsePersistentSignalTables()) {
        return defaultHealth(source);
    }

    try {
        const health = await prisma.signalSourceHealth.findUnique({
            where: { source },
        });
        markSignalTablesAvailable();

        if (!health) {
            return defaultHealth(source);
        }

        return {
            source,
            status: (health.status as PersistentSourceHealthStatus) || "healthy",
            failureCount: health.failureCount,
            lastSuccess: toIso(health.lastSuccess),
            lastFailure: toIso(health.lastFailure),
            cooldownUntil: toIso(health.cooldownUntil),
            lastError: health.lastError ?? undefined,
        };
    } catch (err: unknown) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return defaultHealth(source);
        }

        console.error("signal_health_read_failed", { source, err });
        return defaultHealth(source);
    }
}

export function isSourceInCooldown(health: SourceHealthState): boolean {
    if (!health.cooldownUntil) {
        return false;
    }

    return new Date(health.cooldownUntil).getTime() > Date.now();
}

export async function recordSourceSuccess(source: ReliableSignalSourceName): Promise<void> {
    if (!shouldUsePersistentSignalTables()) {
        return;
    }

    try {
        await prisma.signalSourceHealth.upsert({
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
    } catch (err: unknown) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return;
        }

        console.error("signal_health_success_write_failed", { source, err });
    }
}

export async function recordSourceFailure(source: ReliableSignalSourceName, errorMessage: string): Promise<SourceHealthState> {
    const now = new Date();
    const current = await getSourceHealth(source);
    const nextFailureCount = current.failureCount + 1;
    const nextStatus: PersistentSourceHealthStatus = nextFailureCount >= SIGNAL_HEALTH_BLOCK_THRESHOLD ? "blocked" : "degraded";
    const cooldownUntil = nextStatus === "blocked" ? new Date(now.getTime() + SIGNAL_HEALTH_COOLDOWN_MS) : null;

    const next: SourceHealthState = {
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
        await prisma.signalSourceHealth.upsert({
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
    } catch (err: unknown) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return next;
        }

        console.error("signal_health_failure_write_failed", { source, err });
    }

    return next;
}

export async function persistSignalSnapshot(snapshot: {
    source: ReliableSignalSourceName;
    snapshotKey: string;
    data: string[];
    confidence: number;
    fetchedAt: Date;
    expiresAt: Date;
    status?: PersistentSnapshotStatus;
    transport?: PersistentSnapshotTransport;
    details?: string;
}): Promise<void> {
    if (!shouldUsePersistentSignalTables()) {
        return;
    }

    try {
        await prisma.signalSnapshot.upsert({
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
    } catch (err: unknown) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return;
        }

        console.error("signal_snapshot_write_failed", { source: snapshot.source, err });
    }
}

export async function getPersistentSignalSnapshot(source: ReliableSignalSourceName, snapshotKey: string, details?: string): Promise<PersistentSignalSnapshot | null> {
    if (!shouldUsePersistentSignalTables()) {
        return null;
    }

    try {
        const snapshot = await prisma.signalSnapshot.findUnique({
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

        const data = (snapshot.data as any[]).filter((value: any): value is string => typeof value === "string" && value.trim().length > 0);
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
    } catch (err: unknown) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return null;
        }

        console.error("signal_snapshot_read_failed", { source, err });
        return null;
    }
}

function isConfiguredSource(source: ReliableSignalSourceName): boolean {
    if (source === "serpapi_trends") {
        return hasServerEnv("SERPAPI_API_KEY");
    }

    return true;
}

export async function getSignalReliabilityOverview(): Promise<SignalReliabilityOverviewItem[]> {
    const fallback = RELIABLE_SIGNAL_SOURCE_ORDER.map((source) => ({
        ...defaultHealth(source),
        tier: RELIABLE_SIGNAL_SOURCE_TIERS[source],
        configured: isConfiguredSource(source),
    }));

    if (!shouldUsePersistentSignalTables()) {
        return fallback;
    }

    try {
        const [healthRows, snapshotRows] = await Promise.all([
            prisma.signalSourceHealth.findMany({
                where: { source: { in: RELIABLE_SIGNAL_SOURCE_ORDER } },
            }),
            prisma.signalSnapshot.findMany({
                where: { source: { in: RELIABLE_SIGNAL_SOURCE_ORDER } },
            }),
        ]);
        markSignalTablesAvailable();

        const healthMap = new Map<ReliableSignalSourceName, any>(healthRows.map((row: any) => [row.source as ReliableSignalSourceName, row]));
        const snapshotMap = new Map<ReliableSignalSourceName, any>(snapshotRows.map((row: any) => [row.source as ReliableSignalSourceName, row]));

        return RELIABLE_SIGNAL_SOURCE_ORDER.map((source) => {
            const health = healthMap.get(source);
            const snapshot = snapshotMap.get(source);
            const ageMinutes = snapshot ? computeAgeMinutes(snapshot.fetchedAt) : undefined;
            const confidence = snapshot && ageMinutes !== undefined ? computeDecayedConfidence(snapshot.confidence, ageMinutes) : undefined;

            return {
                source,
                tier: RELIABLE_SIGNAL_SOURCE_TIERS[source],
                status: (health?.status as PersistentSourceHealthStatus) || "healthy",
                failureCount: health?.failureCount ?? 0,
                lastSuccess: toIso(health?.lastSuccess),
                lastFailure: toIso(health?.lastFailure),
                cooldownUntil: toIso(health?.cooldownUntil),
                lastError: health?.lastError ?? undefined,
                snapshotStatus: snapshot?.status as PersistentSnapshotStatus | undefined,
                snapshotTransport: snapshot?.transport as PersistentSnapshotTransport | undefined,
                snapshotConfidence: confidence,
                snapshotFetchedAt: toIso(snapshot?.fetchedAt),
                snapshotExpiresAt: toIso(snapshot?.expiresAt),
                snapshotAgeMinutes: ageMinutes,
                snapshotDetails: snapshot?.details ?? undefined,
                configured: isConfiguredSource(source),
            };
        });
    } catch (err: unknown) {
        if (isMissingSignalTableError(err)) {
            markSignalTablesUnavailable();
            return fallback;
        }

        console.error("signal_reliability_overview_failed", err);
        return fallback;
    }
}