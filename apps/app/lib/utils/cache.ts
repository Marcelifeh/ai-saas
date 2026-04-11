import "server-only";
import IORedis from "ioredis";

// ---------------------------------------------------------------------------
// Design: memory-first, Redis write-through for durability across restarts.
//
// set()  → writes to in-process Map immediately (synchronous),
//          then fires a background SETEX to Redis (no await required by callers).
// get()  → reads from in-process Map first (O(1), zero latency).
//          On a cold-start cache miss, falls back to a synchronous-looking stub
//          that kicks an async warm-through; use getAsync() if you need Redis
//          reads to be awaited.
// getAsync() → checks Redis when in-process Map misses,
//              useful on cold starts or cross-process reads.
// ---------------------------------------------------------------------------

class MemoryCache {
    private store = new Map<string, { value: unknown; expiry: number }>();

    set(key: string, value: unknown, ttlMs: number): void {
        this.store.set(key, { value, expiry: Date.now() + ttlMs });
    }

    get(key: string): unknown | null {
        const item = this.store.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.store.delete(key);
            return null;
        }
        return item.value;
    }
}

type CacheValue = unknown;

class Cache {
    private redis: IORedis | null = null;
    private readonly memory = new MemoryCache();
    private redisDown = false;

    constructor() {
        const url = process.env.REDIS_URL;
        if (url) {
            try {
                this.redis = new IORedis(url, {
                    lazyConnect: true,
                    enableOfflineQueue: false,
                    maxRetriesPerRequest: 1,
                    connectTimeout: 2000,
                    retryStrategy: () => null, // disable automatic reconnect
                });
                this.redis.on("error", () => {
                    this.redisDown = true;
                });
                this.redis.on("connect", () => {
                    this.redisDown = false;
                });
            } catch {
                this.redis = null;
            }
        }
    }

    /** Synchronous write — callers do NOT need to await.
     *  Writes to memory immediately; persists to Redis in the background. */
    set(key: string, value: CacheValue, ttlMs: number): void {
        this.memory.set(key, value, ttlMs);
        this.persistToRedis(key, value, ttlMs);
    }

    /** Synchronous read from the in-process memory layer.
     *  Zero latency — safe to call anywhere. Returns null on cold-start misses. */
    get(key: string): CacheValue | null {
        return this.memory.get(key);
    }

    /** Async read — checks Redis when the in-process memory layer misses.
     *  Use this on server cold-starts or in cross-process scenarios. */
    async getAsync(key: string): Promise<CacheValue | null> {
        const inMemory = this.memory.get(key);
        if (inMemory !== null) return inMemory;

        if (!this.redis || this.redisDown) return null;
        try {
            const raw = await this.redis.get(key);
            if (raw === null) return null;
            return JSON.parse(raw) as CacheValue;
        } catch {
            return null;
        }
    }

    private persistToRedis(key: string, value: CacheValue, ttlMs: number): void {
        if (!this.redis || this.redisDown) return;
        const ttlSec = Math.max(1, Math.ceil(ttlMs / 1000));
        this.redis.setex(key, ttlSec, JSON.stringify(value)).catch(() => {
            this.redisDown = true;
        });
    }
}

export const globalCache = new Cache();
