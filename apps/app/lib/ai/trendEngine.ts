import "server-only";
import { globalCache } from "../utils/cache";
import { getServerEnv } from "@/lib/utils/serverEnv";
import { getDynamicContext } from "./trendContext";
import { chatCompletionSafe, createEmbeddingsSafe } from "./aiGateway";
import {
    RELIABLE_SIGNAL_SOURCE_TIERS,
    getPersistentSignalSnapshot,
    getSourceHealth,
    isSourceInCooldown,
    persistSignalSnapshot,
    recordSourceFailure,
    recordSourceSuccess,
} from "../services/signalReliabilityService";

const GOOGLE_TRENDS_CACHE_KEY = "google_trends_source_v1";
const GOOGLE_TRENDS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const GOOGLE_TRENDS_SNAPSHOT_KEY = "daily_us_trends";
const SERPAPI_TRENDS_SNAPSHOT_KEY = "trending_now_us";
const SERPAPI_TRENDS_TTL_MS = 60 * 60 * 1000;
const REDDIT_SNAPSHOT_KEY = "hot_titles_top3";
const REDDIT_SNAPSHOT_TTL_MS = 90 * 60 * 1000;
const HACKER_NEWS_SNAPSHOT_KEY = "top_stories_titles";
const HACKER_NEWS_TTL_MS = 45 * 60 * 1000;

// v1.2 Institutional Signal Weights
const SIGNAL_WEIGHTS = {
    google_trends: 0.6,
    serpapi_trends: 0.6,
    reddit: 0.35,
    hacker_news: 0.05,
} as const;

const SOURCE_TIER_MULTIPLIER = {
    tier1: 1,
    tier2: 0.74,
    tier3: 0.55,
} as const;

export type TrendSignalSourceName = "google_trends" | "serpapi_trends" | "reddit" | "hacker_news";
export type TrendSignalSourceStatus = "ok" | "blocked" | "rate_limited" | "invalid_payload" | "error" | "cooldown";
export type TrendSignalTransport = "live" | "cache_fallback";
export type TrendSignalSourceTier = "tier1" | "tier2" | "tier3";

export interface TrendSignalSourceResult {
    source: TrendSignalSourceName;
    tier: TrendSignalSourceTier;
    status: TrendSignalSourceStatus;
    data: string[];
    confidence: number;
    normalizedWeight?: number;
    agreementScore?: number;
    fetchedAt: string;
    transport: TrendSignalTransport;
    cachedAt?: string;
    cacheAgeMinutes?: number;
    details?: string;
}

function buildSourceResult(
    source: TrendSignalSourceName,
    status: TrendSignalSourceStatus,
    data: string[],
    confidence: number,
    details?: string,
): TrendSignalSourceResult {
    return {
        source,
        tier: RELIABLE_SIGNAL_SOURCE_TIERS[source],
        status,
        data,
        confidence,
        fetchedAt: new Date().toISOString(),
        transport: "live",
        details,
    };
}

function roundConfidence(value: number): number {
    return Math.round(value * 100) / 100;
}

function appendDetails(primary: string, secondary?: string): string {
    return secondary ? `${primary} ${secondary}` : primary;
}

function computeSignalAgreement(source: TrendSignalSourceResult, peers: TrendSignalSourceResult[]): number {
    const sourceTerms = new Set(source.data.slice(0, 12).map(cleanText).filter(Boolean));
    if (sourceTerms.size === 0) {
        return 0;
    }

    const scores = peers
        .filter((peer) => peer.source !== source.source && peer.data.length > 0)
        .map((peer) => {
            const peerTerms = new Set(peer.data.slice(0, 12).map(cleanText).filter(Boolean));
            if (peerTerms.size === 0) {
                return 0;
            }

            let overlap = 0;
            sourceTerms.forEach((term) => {
                if (peerTerms.has(term)) {
                    overlap += 1;
                }
            });

            const denominator = Math.max(sourceTerms.size, peerTerms.size);
            return denominator > 0 ? overlap / denominator : 0;
        });

    if (scores.length === 0) {
        return 0;
    }

    return roundConfidence(Math.max(...scores));
}

function rebalanceSourceConfidence(sources: TrendSignalSourceResult[]): TrendSignalSourceResult[] {
    const activeTier1Count = sources.filter((source) => source.tier === "tier1" && source.data.length > 0).length;
    const activeSourceCount = sources.filter((source) => source.data.length > 0).length;

    return sources.map((source) => {
        const agreementScore = computeSignalAgreement(source, sources);
        let adjustedConfidence = source.confidence * SOURCE_TIER_MULTIPLIER[source.tier];

        if (source.tier === "tier1") {
            adjustedConfidence *= 1 + agreementScore * 0.25;
        }

        if (source.tier === "tier2" && activeTier1Count === 0 && activeSourceCount === 1) {
            adjustedConfidence *= 0.7;
        }

        if (source.transport === "cache_fallback" && activeTier1Count === 0 && source.tier === "tier1") {
            adjustedConfidence *= 1.1;
        }

        return {
            ...source,
            agreementScore,
            confidence: roundConfidence(Math.min(1, adjustedConfidence)),
        };
    });
}

function normalizeSourceWeights(sources: TrendSignalSourceResult[]): TrendSignalSourceResult[] {
    const totalConfidence = sources.reduce((sum, source) => {
        if (source.data.length === 0 || source.confidence <= 0) {
            return sum;
        }

        return sum + source.confidence;
    }, 0);

    return sources.map((source) => ({
        ...source,
        normalizedWeight:
            totalConfidence > 0 && source.data.length > 0 && source.confidence > 0
                ? roundConfidence(source.confidence / totalConfidence)
                : 0,
    }));
}

function calculateSignalConfidence(sources: TrendSignalSourceResult[]): number {
    const activeSources = sources.filter((source) => source.data.length > 0);
    if (activeSources.length === 0) {
        return 0;
    }

    const total = activeSources.reduce((sum, source) => sum + source.confidence, 0);
    return roundConfidence(total / activeSources.length);
}

function getCachedGoogleTrendsFallback(details: string, status: TrendSignalSourceStatus): TrendSignalSourceResult | null {
    const cached = globalCache.get(GOOGLE_TRENDS_CACHE_KEY) as TrendSignalSourceResult | null;
    if (!cached || !Array.isArray(cached.data) || cached.data.length === 0) {
        return null;
    }

    const cachedAt = cached.cachedAt || cached.fetchedAt;
    const ageMinutes = Math.max(1, Math.round((Date.now() - new Date(cachedAt).getTime()) / 60000));

    return {
        ...cached,
        status: cached.status === "ok" ? "ok" : status,
        confidence: roundConfidence(Math.max(0.35, cached.confidence * 0.75)),
        fetchedAt: new Date().toISOString(),
        transport: "cache_fallback",
        cachedAt,
        cacheAgeMinutes: ageMinutes,
        details: `${details} Using cached Google Trends snapshot from ${ageMinutes} minute${ageMinutes === 1 ? "" : "s"} ago.`,
    };
}

async function getPersistentSourceFallback(
    source: TrendSignalSourceName,
    snapshotKey: string,
    details: string,
    status: TrendSignalSourceStatus,
): Promise<TrendSignalSourceResult | null> {
    const snapshot = await getPersistentSignalSnapshot(source, snapshotKey, details);
    if (!snapshot) {
        return null;
    }

    return {
        source,
        tier: RELIABLE_SIGNAL_SOURCE_TIERS[source],
        status,
        data: snapshot.data,
        confidence: snapshot.confidence,
        normalizedWeight: 0,
        fetchedAt: snapshot.fetchedAt,
        transport: snapshot.transport,
        cachedAt: snapshot.cachedAt,
        cacheAgeMinutes: snapshot.cacheAgeMinutes,
        details: appendDetails(
            details,
            `Using persisted snapshot from ${snapshot.ageMinutes} minute${snapshot.ageMinutes === 1 ? "" : "s"} ago.`,
        ),
    };
}

function extractSerpApiQueries(payload: unknown): string[] {
    if (!payload || typeof payload !== "object") return [];
    const p = payload as Record<string, unknown>;

    // Format A (classic): trending_searches[].query
    if (Array.isArray(p.trending_searches) && p.trending_searches.length > 0) {
        const queries = (p.trending_searches as Array<Record<string, unknown>>)
            .map((item) => (item?.query ?? item?.title) as string | undefined)
            .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
            .slice(0, 20);
        if (queries.length > 0) return queries;
    }

    // Format B (newer SerpAPI): trending_now_shows_searches[n].queries[].query
    if (Array.isArray(p.trending_now_shows_searches) && p.trending_now_shows_searches.length > 0) {
        const queries: string[] = [];
        for (const item of p.trending_now_shows_searches as Array<Record<string, unknown>>) {
            const title = typeof item?.title === "string" ? item.title.trim() : "";
            if (title) queries.push(title);
            if (Array.isArray(item?.queries)) {
                for (const q of item.queries as Array<Record<string, unknown>>) {
                    const qStr = typeof q?.query === "string" ? q.query.trim() : "";
                    if (qStr) queries.push(qStr);
                }
            }
        }
        const deduped = [...new Set(queries)].slice(0, 20);
        if (deduped.length > 0) return deduped;
    }

    // Format C: realtime_trending_searches[].title
    if (Array.isArray(p.realtime_trending_searches) && p.realtime_trending_searches.length > 0) {
        const queries = (p.realtime_trending_searches as Array<Record<string, unknown>>)
            .map((item) => (item?.title ?? item?.query) as string | undefined)
            .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
            .slice(0, 20);
        if (queries.length > 0) return queries;
    }

    return [];
}

async function fetchSerpApiTrendingQueries(apiKey: string): Promise<
    | { ok: true; queries: string[] }
    | { ok: false; status: TrendSignalSourceStatus; details: string }
> {
    const params = new URLSearchParams({
        engine: "google_trends_trending_now",
        geo: "US",
        hl: "en",
        api_key: apiKey,
    });

    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const details = typeof payload?.error === "string" ? payload.error : `SerpAPI responded with status ${response.status}.`;
        return {
            ok: false,
            status: response.status === 429 ? "rate_limited" : "error",
            details,
        };
    }

    const queries = extractSerpApiQueries(payload);
    if (queries.length === 0) {
        const keys = payload ? Object.keys(payload as object).join(", ") : "null";
        console.warn("serpapi_empty_response", { responseKeys: keys });
        return {
            ok: false,
            status: "invalid_payload",
            details: `SerpAPI returned no recognizable trending results. Top-level keys: [${keys}]`,
        };
    }

    return { ok: true, queries };
}

async function getGoogleProxyFallback(details: string): Promise<TrendSignalSourceResult | null> {
    const serpApiKey = getServerEnv("SERPAPI_API_KEY");
    if (!serpApiKey) {
        return null;
    }

    const proxyResponse = await fetchSerpApiTrendingQueries(serpApiKey);
    if (!proxyResponse.ok) {
        return null;
    }

    const liveResult = buildSourceResult(
        "google_trends",
        "ok",
        proxyResponse.queries,
        0.94,
        `${details} Recovered through the SerpAPI Google Trends proxy.`,
    );

    globalCache.set(GOOGLE_TRENDS_CACHE_KEY, liveResult, GOOGLE_TRENDS_CACHE_TTL_MS);
    await persistSignalSnapshot({
        source: "google_trends",
        snapshotKey: GOOGLE_TRENDS_SNAPSHOT_KEY,
        data: liveResult.data,
        confidence: liveResult.confidence,
        fetchedAt: new Date(liveResult.fetchedAt),
        expiresAt: new Date(Date.now() + GOOGLE_TRENDS_CACHE_TTL_MS),
        status: "live",
        transport: "live",
        details: liveResult.details,
    });
    await recordSourceSuccess("google_trends");

    return liveResult;
}

type HackerNewsStory = {
    title?: string;
    score?: number;
};

/**************************************************************
 * UTILITIES
 **************************************************************/

function cleanText(str: string): string {
    return str
        .replace(/[^\w\s]/gi, "")
        .toLowerCase()
        .trim();
}

function unique(arr: string[]): string[] {
    return [...new Set(arr)];
}

/**************************************************************
 * VECTOR UTILS
 **************************************************************/

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    return dot / (magA * magB);
}

/**************************************************************
 * GOOGLE TRENDS INGESTION
 **************************************************************/

export async function getGoogleTrends(): Promise<TrendSignalSourceResult> {
    const health = await getSourceHealth("google_trends");
    if (isSourceInCooldown(health)) {
        const cooldownFallback = await getPersistentSourceFallback(
            "google_trends",
            GOOGLE_TRENDS_SNAPSHOT_KEY,
            `Google Trends is in cooldown until ${health.cooldownUntil}.`,
            "cooldown",
        );
        if (cooldownFallback) {
            return cooldownFallback;
        }
        return buildSourceResult("google_trends", "cooldown", [], 0.05, `Google Trends is in cooldown until ${health.cooldownUntil}.`);
    }

    try {
        // Use the public Google Trends RSS feed — bypasses the JS-rendered
        // page that the google-trends-api npm package scrapes and gets blocked.
        const rssResponse = await fetch("https://trends.google.com/trending/rss?geo=US", {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; TrendForge/1.0)",
                Accept: "application/rss+xml, application/xml, text/xml, */*",
            },
            cache: "no-store",
        });

        if (!rssResponse.ok) {
            const status: TrendSignalSourceStatus = rssResponse.status === 429 ? "rate_limited" : "blocked";
            const details = `Google Trends RSS returned HTTP ${rssResponse.status}.`;
            const proxyFallback = await getGoogleProxyFallback(details);
            if (proxyFallback) return proxyFallback;
            await recordSourceFailure("google_trends", details);
            const persistentFallback = await getPersistentSourceFallback("google_trends", GOOGLE_TRENDS_SNAPSHOT_KEY, details, status);
            if (persistentFallback) return persistentFallback;
            const cachedFallback = getCachedGoogleTrendsFallback(details, status);
            if (cachedFallback) return cachedFallback;
            return buildSourceResult("google_trends", status, [], 0.15, details);
        }

        const rssText = await rssResponse.text();

        // If Google returned an HTML page (bot-check), fall through to SerpAPI proxy
        if (!rssText || rssText.trimStart().toLowerCase().startsWith("<html") || rssText.trimStart().startsWith("<!DOCTYPE")) {
            const details = "Google Trends RSS returned HTML (bot detection page).";
            const proxyFallback = await getGoogleProxyFallback(details);
            if (proxyFallback) return proxyFallback;
            await recordSourceFailure("google_trends", details);
            const persistentFallback = await getPersistentSourceFallback("google_trends", GOOGLE_TRENDS_SNAPSHOT_KEY, details, "blocked");
            if (persistentFallback) return persistentFallback;
            const cachedFallback = getCachedGoogleTrendsFallback(details, "blocked");
            if (cachedFallback) return cachedFallback;
            return buildSourceResult("google_trends", "blocked", [], 0.15, details);
        }

        // Parse <title> from each <item> block in the RSS feed
        const itemBlocks = [...rssText.matchAll(/<item>([\s\S]*?)<\/item>/g)];
        const keywords = itemBlocks
            .map((m) => {
                const t = m[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>([^<]*?)<\/title>/);
                return t ? (t[1] ?? t[2] ?? "").trim() : "";
            })
            .filter(Boolean);

        if (keywords.length === 0) {
            const details = "Google Trends RSS returned no item titles.";
            await recordSourceFailure("google_trends", details);
            const proxyFallback = await getGoogleProxyFallback(details);
            if (proxyFallback) return proxyFallback;
            const persistentFallback = await getPersistentSourceFallback("google_trends", GOOGLE_TRENDS_SNAPSHOT_KEY, details, "invalid_payload");
            if (persistentFallback) return persistentFallback;
            const cachedFallback = getCachedGoogleTrendsFallback(details, "invalid_payload");
            if (cachedFallback) return cachedFallback;
            return buildSourceResult("google_trends", "invalid_payload", [], 0.2, details);
        }

        const liveResult = buildSourceResult("google_trends", "ok", keywords.slice(0, 20), 1.0);
        globalCache.set(GOOGLE_TRENDS_CACHE_KEY, liveResult, GOOGLE_TRENDS_CACHE_TTL_MS);
        await persistSignalSnapshot({
            source: "google_trends",
            snapshotKey: GOOGLE_TRENDS_SNAPSHOT_KEY,
            data: liveResult.data,
            confidence: liveResult.confidence,
            fetchedAt: new Date(liveResult.fetchedAt),
            expiresAt: new Date(Date.now() + GOOGLE_TRENDS_CACHE_TTL_MS),
            status: "live",
            transport: "live",
        });
        await recordSourceSuccess("google_trends");
        return liveResult;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown Google Trends error";
        const status: TrendSignalSourceStatus = message.includes("429") ? "rate_limited" : "error";
        console.warn("google_trends_fetch_failed", {
            source: "google_trends",
            status,
            details: message,
        });
        const proxyFallback = await getGoogleProxyFallback(message);
        if (proxyFallback) {
            return proxyFallback;
        }
        await recordSourceFailure("google_trends", message);
        const persistentFallback = await getPersistentSourceFallback(
            "google_trends",
            GOOGLE_TRENDS_SNAPSHOT_KEY,
            message,
            status,
        );
        if (persistentFallback) {
            return persistentFallback;
        }
        const cachedFallback = getCachedGoogleTrendsFallback(message, status);
        if (cachedFallback) {
            return cachedFallback;
        }
        return buildSourceResult("google_trends", status, [], 0.1, message);
    }
}

/**
 * REVENUE INTELLIGENCE UPGRADE: Fetch Global Trends (US, UK, CA)
 */
async function getGoogleTrendsGlobal(): Promise<TrendSignalSourceResult> {
    const geos = ["US", "GB", "CA"];
    const results = await Promise.all(geos.map(async (geo) => {
        try {
            const res = await fetch(`https://trends.google.com/trending/rss?geo=${geo}`);
            if (!res.ok) return [];
            const text = await res.text();
            const items = text.match(/<title>(.*?)<\/title>/g) || [];
            return items.slice(1).map(i => i.replace(/<\/?title>/g, "").trim());
        } catch { return []; }
    }));

    const combined = Array.from(new Set(results.flat())).filter(t => t.length > 0);
    
    if (combined.length === 0) {
        return buildSourceResult("google_trends", "error", [], 0, "No global trends found");
    }

    return buildSourceResult("google_trends", "ok", combined, 1.0, `Global fetch: ${geos.join(", ")}`);
}

export async function getSerpApiTrends(): Promise<TrendSignalSourceResult> {
    const serpApiKey = getServerEnv("SERPAPI_API_KEY");

    if (!serpApiKey) {
        const details = "SerpAPI is not configured on the server.";
        const fallback = await getPersistentSourceFallback("serpapi_trends", SERPAPI_TRENDS_SNAPSHOT_KEY, details, "error");
        if (fallback) {
            return fallback;
        }
        return buildSourceResult("serpapi_trends", "error", [], 0.05, details);
    }

    const health = await getSourceHealth("serpapi_trends");
    if (isSourceInCooldown(health)) {
        const cooldownFallback = await getPersistentSourceFallback(
            "serpapi_trends",
            SERPAPI_TRENDS_SNAPSHOT_KEY,
            `SerpAPI Trends is in cooldown until ${health.cooldownUntil}.`,
            "cooldown",
        );
        if (cooldownFallback) {
            return cooldownFallback;
        }
        return buildSourceResult("serpapi_trends", "cooldown", [], 0.05, `SerpAPI Trends is in cooldown until ${health.cooldownUntil}.`);
    }

    try {
        const response = await fetchSerpApiTrendingQueries(serpApiKey);

        if (!response.ok) {
            await recordSourceFailure("serpapi_trends", response.details);
            const fallback = await getPersistentSourceFallback(
                "serpapi_trends",
                SERPAPI_TRENDS_SNAPSHOT_KEY,
                response.details,
                response.status,
            );
            if (fallback) {
                return fallback;
            }
            return buildSourceResult("serpapi_trends", response.status, [], response.status === "invalid_payload" ? 0.15 : 0.1, response.details);
        }

        const liveResult = buildSourceResult("serpapi_trends", "ok", response.queries, 0.92);
        await persistSignalSnapshot({
            source: "serpapi_trends",
            snapshotKey: SERPAPI_TRENDS_SNAPSHOT_KEY,
            data: liveResult.data,
            confidence: liveResult.confidence,
            fetchedAt: new Date(liveResult.fetchedAt),
            expiresAt: new Date(Date.now() + SERPAPI_TRENDS_TTL_MS),
            status: "live",
            transport: "live",
        });
        await recordSourceSuccess("serpapi_trends");
        return liveResult;
    } catch (err: unknown) {
        const details = err instanceof Error ? err.message : "Unknown SerpAPI error";
        await recordSourceFailure("serpapi_trends", details);
        const fallback = await getPersistentSourceFallback("serpapi_trends", SERPAPI_TRENDS_SNAPSHOT_KEY, details, "error");
        if (fallback) {
            return fallback;
        }
        return buildSourceResult("serpapi_trends", "error", [], 0.1, details);
    }
}

/**************************************************************
 * REDDIT TREND SCRAPER
 **************************************************************/

const SUBREDDITS = [
    "popculturechat",
    "hobbies",
    "CasualConversation",
    "memes",
    "AskReddit",
    "nostalgia",
    "gaming",
    "careerguidance"
];

export async function getRedditTrends(): Promise<TrendSignalSourceResult> {
    const health = await getSourceHealth("reddit");
    if (isSourceInCooldown(health)) {
        const cooldownFallback = await getPersistentSourceFallback(
            "reddit",
            REDDIT_SNAPSHOT_KEY,
            `Reddit source is in cooldown until ${health.cooldownUntil}.`,
            "cooldown",
        );
        if (cooldownFallback) {
            return cooldownFallback;
        }
        return buildSourceResult("reddit", "cooldown", [], 0.05, `Reddit source is in cooldown until ${health.cooldownUntil}.`);
    }

    const titles: string[] = [];
    const sources = SUBREDDITS.slice(0, 3); // Max 3 to respect speed limits

    await Promise.allSettled(sources.map(async (sub) => {
        try {
            const res = await fetch(
                `https://www.reddit.com/r/${sub}/hot.json?limit=15`
            );
            const json = await res.json();
            if (json && json.data && json.data.children) {
                json.data.children.forEach((post: any) => {
                    titles.push(post.data.title);
                });
            }
        } catch (err) {
            console.error(`Reddit error for r/${sub}:`, err);
        }
    }));

    const status: TrendSignalSourceStatus = titles.length > 0 ? "ok" : "error";
    const confidence = titles.length > 0 ? 0.7 : 0.2;
    const details = titles.length > 0 ? undefined : "Reddit returned no usable titles.";

    if (titles.length > 0) {
        const liveResult = buildSourceResult("reddit", status, titles, confidence, details);
        await persistSignalSnapshot({
            source: "reddit",
            snapshotKey: REDDIT_SNAPSHOT_KEY,
            data: liveResult.data,
            confidence: liveResult.confidence,
            fetchedAt: new Date(liveResult.fetchedAt),
            expiresAt: new Date(Date.now() + REDDIT_SNAPSHOT_TTL_MS),
            status: "live",
            transport: "live",
            details,
        });
        await recordSourceSuccess("reddit");
        return liveResult;
    }

    await recordSourceFailure("reddit", details ?? "Reddit returned no usable titles.");
    const fallback = await getPersistentSourceFallback(
        "reddit",
        REDDIT_SNAPSHOT_KEY,
        details ?? "Reddit returned no usable titles.",
        "error",
    );
    if (fallback) {
        return fallback;
    }

    return buildSourceResult("reddit", status, titles, confidence, details);
}

export async function getHackerNewsTrends(): Promise<TrendSignalSourceResult> {
    const health = await getSourceHealth("hacker_news");
    if (isSourceInCooldown(health)) {
        const cooldownFallback = await getPersistentSourceFallback(
            "hacker_news",
            HACKER_NEWS_SNAPSHOT_KEY,
            `Hacker News is in cooldown until ${health.cooldownUntil}.`,
            "cooldown",
        );
        if (cooldownFallback) {
            return cooldownFallback;
        }
        return buildSourceResult("hacker_news", "cooldown", [], 0.05, `Hacker News is in cooldown until ${health.cooldownUntil}.`);
    }

    try {
        const idsResponse = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
            headers: {
                Accept: "application/json",
            },
            next: { revalidate: 900 },
        });

        if (!idsResponse.ok) {
            const details = `Hacker News IDs responded with status ${idsResponse.status}.`;
            await recordSourceFailure("hacker_news", details);
            const fallback = await getPersistentSourceFallback("hacker_news", HACKER_NEWS_SNAPSHOT_KEY, details, "error");
            if (fallback) {
                return fallback;
            }
            return buildSourceResult("hacker_news", "error", [], 0.1, details);
        }

        const ids = (await idsResponse.json()) as unknown;
        if (!Array.isArray(ids) || ids.length === 0) {
            const details = "Hacker News returned no top story IDs.";
            await recordSourceFailure("hacker_news", details);
            const fallback = await getPersistentSourceFallback("hacker_news", HACKER_NEWS_SNAPSHOT_KEY, details, "invalid_payload");
            if (fallback) {
                return fallback;
            }
            return buildSourceResult("hacker_news", "invalid_payload", [], 0.12, details);
        }

        const topIds = ids.slice(0, 15);
        const stories = await Promise.allSettled(
            topIds.map(async (id) => {
                const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
                    headers: {
                        Accept: "application/json",
                    },
                    next: { revalidate: 900 },
                });

                if (!storyResponse.ok) {
                    return null;
                }

                return (await storyResponse.json()) as HackerNewsStory | null;
            }),
        );

        const titles = stories
            .filter((story): story is PromiseFulfilledResult<HackerNewsStory | null> => story.status === "fulfilled")
            .map((story) => story.value)
            .filter((story): story is HackerNewsStory => Boolean(story && typeof story.title === "string" && story.title.trim().length > 0))
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .map((story) => story.title!.trim())
            .slice(0, 12);

        if (titles.length === 0) {
            const details = "Hacker News returned no usable story titles.";
            await recordSourceFailure("hacker_news", details);
            const fallback = await getPersistentSourceFallback("hacker_news", HACKER_NEWS_SNAPSHOT_KEY, details, "error");
            if (fallback) {
                return fallback;
            }
            return buildSourceResult("hacker_news", "error", [], 0.12, details);
        }

        const liveResult = buildSourceResult("hacker_news", "ok", titles, 0.66);
        await persistSignalSnapshot({
            source: "hacker_news",
            snapshotKey: HACKER_NEWS_SNAPSHOT_KEY,
            data: liveResult.data,
            confidence: liveResult.confidence,
            fetchedAt: new Date(liveResult.fetchedAt),
            expiresAt: new Date(Date.now() + HACKER_NEWS_TTL_MS),
            status: "live",
            transport: "live",
        });
        await recordSourceSuccess("hacker_news");
        return liveResult;
    } catch (err: unknown) {
        const details = err instanceof Error ? err.message : "Unknown Hacker News error";
        await recordSourceFailure("hacker_news", details);
        const fallback = await getPersistentSourceFallback("hacker_news", HACKER_NEWS_SNAPSHOT_KEY, details, "error");
        if (fallback) {
            return fallback;
        }
        return buildSourceResult("hacker_news", "error", [], 0.1, details);
    }
}

/**************************************************************
 * TREND AGGREGATOR
 **************************************************************/

export interface AggregatedTrendSignals {
    timestamp: Date;
    signals: string[];
    sources: TrendSignalSourceResult[];
    signalConfidence: number;
}

/**
 * AGGREGATED TREND SIGNALS
 * Refactored to use User-prescribed weights: Google (0.5), Reddit (0.3), HN (0.2)
 */
export async function collectTrendSignals(): Promise<AggregatedTrendSignals> {
    const [google, serpapi, reddit, hackerNews] = await Promise.all([
        getGoogleTrendsGlobal(),
        getSerpApiTrends(),
        getRedditTrends(),
        getHackerNewsTrends(),
    ]);

    // Apply specific weights
    const weighted = [google, serpapi, reddit, hackerNews].map(s => ({
        ...s,
        normalizedWeight: SIGNAL_WEIGHTS[s.source] || 0.2
    }));

    const cleaned = weighted.flatMap(s => s.data.map(cleanText)).filter(Boolean);

    // DEDUPE + CLUSTER logic (Simple dedupe for now)
    const uniqueSignals = Array.from(new Set(cleaned));

    return {
        timestamp: new Date(),
        signals: uniqueSignals.slice(0, 50), // Expanded to 50 signals
        sources: weighted,
        signalConfidence: 0.85,
    };
}

/**************************************************************
 * LLM NICHE GENERATION
 **************************************************************/

export async function generateNiches(signals: string[]): Promise<string[]> {
    const contextSignals = signals.slice(0, 15).join("\n");
    const dynamicContext = getDynamicContext();

    const prompt = `
You are an elite Print-on-Demand (POD) market researcher and trend spotter.

Here are the latest cultural trending signals, extracted from Google Trends and viral Reddit discussions today:
---
${contextSignals}
---

${dynamicContext}

Your exact task is to synthesize these raw signals and generate a JSON array of 30 highly specific, highly profitable, and commercially viable micro-niches for POD apparel (shirts, mugs, hoodies).

CRITICAL RULES FOR NICHES:
1. **NO META-BUSINESS NICHES:** Do NOT generate niches about "entrepreneurs", "job seekers", "side hustles", or "freelancers" unless the signal specifically dictates it. People do not buy shirts about being a "freelance failure". 
2. **USE IDENTITIES & PASSIONS:** Generate niches based on what people proudly identify as (e.g., "Overstimulated Toddler Moms", "Introverted Book Readers Who Love True Crime", "Sarcastic NICU Nurses", "Cozy Gamers Who Need Sleep", "Plant Parents With ADHD").
3. **CROSS-NICHING IS REQUIRED:** Combine two distinct concepts to create a blue-ocean niche. (e.g., "Skateboarding + Vintage Frogs" -> "Retro Frog Skater Aesthetics").
4. **DESIGNABLE:** The niche must be something a graphic designer can easily visualize.
5. **AVOID BASIC CLIQUÉS:** No generic "Dog Mom", "Coffee Lover", or "Gym Rat". Be wildly specific and modern.
6. **ABSOLUTELY NO BRAND NAMES:** Never include trademarked brand or company names (e.g., Costco, Walmart, Target, Starbucks, Nike, Amazon, etc.). Any niche referencing a real brand will be rejected. Use generic descriptors instead (e.g., "Bulk Warehouse Shoppers" instead of "Costco Members").

Output ONLY a raw, valid JSON array of 30 short string phrases. NO markdown blocks. NO explanations. NO formatting. Just the array.
`;

    const completion = await chatCompletionSafe({
        model: "gpt-4o-mini",
        temperature: 0.85,
        messages: [{ role: "user", content: prompt }],
        usageContext: { feature: "discovery.generateNiches" },
    });

    if (completion.error || !completion.data) {
        return ["funny dog shirts", "developer humor", "coffee addict"]; // safe fallback array
    }

    const text = completion.data.choices[0].message.content?.trim() || "[]";

    try {
        let cleanText = text;
        if (cleanText.startsWith('\`\`\`json')) cleanText = cleanText.substring(7);
        if (cleanText.startsWith('\`\`\`')) cleanText = cleanText.substring(3);
        if (cleanText.endsWith('\`\`\`')) cleanText = cleanText.substring(0, cleanText.length - 3);

        const niches = JSON.parse(cleanText.trim());
        return Array.isArray(niches) ? niches.slice(0, 30) : [];
    } catch (e) {
        console.error("Niche parse error on raw output:", text);
        return ["Introverted Bookworms", "Sarcastic Nurses", "Cozy Gamers with Anxiety"];
    }
}

/**************************************************************
 * EMBEDDING GENERATION
 **************************************************************/

async function embedTexts(texts: string[]): Promise<number[][]> {
    if (!texts || texts.length === 0) return [];

    const response = await createEmbeddingsSafe({
        input: texts,
        usageContext: { feature: "discovery.embeddings" },
    });

    if (response.error || !response.data) return [];

    return response.data.data.map((d: { embedding: number[] }) => d.embedding);
}

/**************************************************************
 * SEMANTIC CLUSTERING
 **************************************************************/

export async function clusterNiches(niches: string[]): Promise<string[][]> {
    const embeddings = await embedTexts(niches);

    const clusters: { vector: number[]; items: string[] }[] = [];

    niches.forEach((niche, index) => {
        const vec = embeddings[index];
        if (!vec) return;

        let placed = false;

        for (const cluster of clusters) {
            const similarity = cosineSimilarity(vec, cluster.vector);

            if (similarity > 0.82) {
                cluster.items.push(niche);
                placed = true;
                break;
            }
        }

        if (!placed) {
            clusters.push({
                vector: vec,
                items: [niche],
            });
        }
    });

    return clusters.map((c) => c.items);
}

/**************************************************************
 * PROFITABILITY SCORING
 **************************************************************/

function estimateDemand(niche: string): number {
    const demandKeywords = [
        "mom",
        "dad",
        "club",
        "crew",
        "energy",
        "society",
        "gang",
    ];

    let score = 50;

    demandKeywords.forEach((kw) => {
        if (niche.toLowerCase().includes(kw)) score += 5;
    });

    return Math.min(score, 100);
}

function estimateUniqueness(niche: string): number {
    const words = niche.split(" ").length;
    if (words >= 3) return 80;
    if (words === 2) return 70;
    return 60;
}

function estimateCompetition(niche: string): number {
    const saturated = ["dog", "cat", "coffee"];

    for (const word of saturated) {
        if (niche.toLowerCase().includes(word)) return 30;
    }

    return 70;
}

export function scoreNiche(niche: string): number {
    const demand = estimateDemand(niche);
    const uniqueness = estimateUniqueness(niche);
    const competition = estimateCompetition(niche);

    const score =
        demand * 0.3 +
        uniqueness * 0.25 +
        competition * 0.2 +
        Math.random() * 10;

    return Math.round(score);
}

/**************************************************************
 * VIRAL POTENTIAL DETECTION
 **************************************************************/

export async function detectViralPotentials(niches: string[]): Promise<number[]> {
    const prompt = `
Rate the viral meme potential (1-10) of these POD niches.
Return ONLY a valid JSON array of numbers, with exact same length as the input (${niches.length}).

Niches:
${niches.map((n, i) => `${i + 1}. ${n}`).join('\n')}
`;

    const completion = await chatCompletionSafe({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
        usageContext: { feature: "discovery.detectViral" },
    });

    const fallback = niches.map(() => 5);
    if (completion.error || !completion.data) return fallback;

    let text = completion.data.choices[0].message.content?.trim() || "[]";
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);

    try {
        const arr = JSON.parse(text.trim());
        if (Array.isArray(arr) && arr.length === niches.length) return arr;
        return fallback;
    } catch {
        return fallback;
    }
}

/**************************************************************
 * FINAL SCORING PIPELINE
 **************************************************************/

export interface ScoredNiche {
    niche: string;
    cluster: string[];
    profitScore: number;
    viralScore: number;
    finalScore: number;
}

export async function evaluateClusters(clusters: string[][]): Promise<ScoredNiche[]> {
    const results: ScoredNiche[] = [];
    const representatives = clusters.map(c => c[0]);

    const viralScores = await detectViralPotentials(representatives);

    for (let i = 0; i < clusters.length; i++) {
        const representative = representatives[i];
        const cluster = clusters[i];

        const profitScore = scoreNiche(representative);
        const viralScore = viralScores[i] || 5;

        // v1.2 Signal Agreement Boost
        // If a cluster has many signals, it means it's appearing across multiple sources/threads
        const agreementBoost = cluster.length >= 3 ? 10 : 0;

        results.push({
            niche: representative,
            cluster,
            profitScore,
            viralScore,
            finalScore: Math.round((profitScore * 0.7 + viralScore * 3) + agreementBoost),
        });
    }

    return results.sort((a, b) => b.finalScore - a.finalScore);
}

/**************************************************************
 * MASTER DISCOVERY ENGINE
 **************************************************************/

export interface DiscoveryResult {
    timestamp: Date;
    signals: string[];
    signalSources: TrendSignalSourceResult[];
    signalConfidence: number;
    niches: ScoredNiche[];
}

export async function discoverTrends(): Promise<DiscoveryResult> {
    const cached = await globalCache.getAsync('global_trends_v2');
    if (cached) {
        console.log("Serving Discovery Engine from Memory Cache");
        return cached as DiscoveryResult;
    }

    console.log("Collecting signals...");
    const aggregatedSignals = await collectTrendSignals();
    const signals = aggregatedSignals.signals;

    console.log("Generating niches...");
    const niches = await generateNiches(signals);

    console.log("Clustering niches...");
    const clusters = await clusterNiches(niches);

    console.log("Evaluating niches...");
    const scored = await evaluateClusters(clusters);

    const top = scored.slice(0, 15); // Expanded to 15 winners

    const finalData: DiscoveryResult = {
        timestamp: aggregatedSignals.timestamp,
        signals,
        signalSources: aggregatedSignals.sources,
        signalConfidence: aggregatedSignals.signalConfidence,
        niches: top,
    };

    globalCache.set('global_trends_v2', finalData, 30 * 60 * 1000); // Cache for 30 minutes
    return finalData;
}
