"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalCache = void 0;
// server-only removed for script runtime
const ioredis_1 = __importDefault(require("ioredis"));
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
    constructor() {
        this.store = new Map();
    }
    set(key, value, ttlMs) {
        this.store.set(key, { value, expiry: Date.now() + ttlMs });
    }
    get(key) {
        const item = this.store.get(key);
        if (!item)
            return null;
        if (Date.now() > item.expiry) {
            this.store.delete(key);
            return null;
        }
        return item.value;
    }
}
class Cache {
    constructor() {
        this.redis = null;
        this.memory = new MemoryCache();
        this.redisDown = false;
        const url = process.env.REDIS_URL;
        if (url) {
            try {
                this.redis = new ioredis_1.default(url, {
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
            }
            catch {
                this.redis = null;
            }
        }
    }
    /** Synchronous write — callers do NOT need to await.
     *  Writes to memory immediately; persists to Redis in the background. */
    set(key, value, ttlMs) {
        this.memory.set(key, value, ttlMs);
        this.persistToRedis(key, value, ttlMs);
    }
    /** Synchronous read from the in-process memory layer.
     *  Zero latency — safe to call anywhere. Returns null on cold-start misses. */
    get(key) {
        return this.memory.get(key);
    }
    /** Async read — checks Redis when the in-process memory layer misses.
     *  Use this on server cold-starts or in cross-process scenarios. */
    async getAsync(key) {
        const inMemory = this.memory.get(key);
        if (inMemory !== null)
            return inMemory;
        if (!this.redis || this.redisDown)
            return null;
        try {
            const raw = await this.redis.get(key);
            if (raw === null)
                return null;
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    persistToRedis(key, value, ttlMs) {
        if (!this.redis || this.redisDown)
            return;
        const ttlSec = Math.max(1, Math.ceil(ttlMs / 1000));
        this.redis.setex(key, ttlSec, JSON.stringify(value)).catch(() => {
            this.redisDown = true;
        });
    }
}
exports.globalCache = new Cache();
