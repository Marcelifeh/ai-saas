/**
 * Pluggable Cache Adapter for Trend Intelligence
 * Support for data freshness signals.
 */

class TrendCache {
    constructor() {
        this.cache = new Map();
    }

    get(key) {
        if (this.cache.has(key)) {
            const entry = this.cache.get(key);
            if (Date.now() < entry.expiresAt) {
                return entry.value;
            } else {
                this.cache.delete(key); // clear stale entry
            }
        }
        return null;
    }

    set(key, value, ttlMs) {
        const now = Date.now();
        this.cache.set(key, {
            value,
            fetchedAt: now,
            expiresAt: now + ttlMs
        });
    }

    clear() {
        this.cache.clear();
    }
}

// Export a singleton memory cache by default
const memoryCache = new TrendCache();

module.exports = { TrendCache, cache: memoryCache };
