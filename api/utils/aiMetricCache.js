/**
 * AI Metric Cache — Phase 36
 *
 * Caches AI-estimated market signals per niche with a 12-hour TTL.
 * Prevents score drift from AI temperature variance and reduces API cost.
 *
 * Provenance: metricsSource = "ai_estimated" | "simulated"
 */

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours in ms

// In-process memory cache (persists across requests within same server instance)
const _cache = new Map();

/**
 * Get cached AI metrics for a niche
 * @param {string} niche
 * @returns {object|null} Cached metrics or null if miss/expired
 */
function getAiMetrics(niche) {
    const key = (niche || '').toLowerCase().trim();
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
        _cache.delete(key);
        return null;
    }
    return entry.data;
}

/**
 * Store AI metrics for a niche
 * @param {string} niche
 * @param {object} metrics - The metrics to cache
 */
function setAiMetrics(niche, metrics) {
    const key = (niche || '').toLowerCase().trim();
    _cache.set(key, {
        timestamp: Date.now(),
        data: { ...metrics, metricsSource: 'ai_estimated' }
    });
}

/**
 * Clear all cached metrics (for testing)
 */
function clearCache() {
    _cache.clear();
}

/**
 * Get cache stats (for debugging)
 */
function getCacheStats() {
    return {
        size: _cache.size,
        keys: Array.from(_cache.keys()),
        ttlHours: CACHE_TTL / (60 * 60 * 1000)
    };
}

module.exports = { getAiMetrics, setAiMetrics, clearCache, getCacheStats };
