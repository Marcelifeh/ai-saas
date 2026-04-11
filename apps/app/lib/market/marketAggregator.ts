import { fetchAmazonData } from "./providers/amazonProvider";
import { fetchEtsyData } from "./providers/etsyProvider";
import { AggregatedMarketData } from "./providers/types";
import { globalCache } from "../utils/cache";

/**
 * Aggregates market data from different platforms and provides a 
 * unified view of the marketplace.
 * v1.3: Implements platform weighting and confidence synchronization.
 */
export async function getMarketData(keyword: string): Promise<AggregatedMarketData> {
    const cacheKey = `market_data_v1.3:${keyword.toLowerCase().trim()}`;
    const cached = globalCache.get(cacheKey) as AggregatedMarketData | undefined;
    if (cached) return cached;

    // Fetch from all sources in parallel
    const [amazon, etsy] = await Promise.all([
        fetchAmazonData(keyword),
        fetchEtsyData(keyword),
    ]);

    const aggregated: AggregatedMarketData = {
        keyword,
        amazon,
        etsy,
        // Combined confidence is 'real' only if ALL active providers returned real data
        combinedConfidence: (amazon.confidence === "real" && etsy.confidence === "real") ? "real" : "mock"
    };

    // Cache for 4 hours — real market data is expensive and doesn't rotate fast
    globalCache.set(cacheKey, aggregated, 4 * 60 * 60 * 1000);

    return aggregated;
}
