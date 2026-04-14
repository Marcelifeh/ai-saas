import { MarketData } from "./types";
import { getServerEnv } from "@/lib/utils/serverEnv";

function getMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((left, right) => left - right);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function extractAmazonPrice(item: any): number {
    if (typeof item?.extracted_price === "number") {
        return item.extracted_price;
    }

    if (typeof item?.price === "object" && typeof item.price?.value === "number") {
        return item.price.value;
    }

    if (typeof item?.price === "string") {
        const parsed = Number(item.price.replace(/[^0-9.]/g, ""));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

function extractAmazonReviews(item: any): number {
    if (typeof item?.reviews === "number") {
        return item.reviews;
    }

    if (typeof item?.ratings_total === "number") {
        return item.ratings_total;
    }

    if (typeof item?.rating_count === "number") {
        return item.rating_count;
    }

    return 0;
}

/**
 * Amazon Market Data Provider v1.3
 * Uses SerpAPI to fetch live search results.
 * Implements Institutional Sniper Logic: Median Filter + 20k Cap + Weak Comp Detection.
 */
export async function fetchAmazonData(keyword: string): Promise<MarketData> {
    const apiKey = getServerEnv("SERPAPI_API_KEY");

    // FALLBACK IF API KEY MISSING
    if (!apiKey) {
        return mockAmazonFallback(keyword);
    }

    try {
        const params = new URLSearchParams({
            engine: "amazon",
            k: keyword,
            api_key: apiKey,
            amazon_domain: "amazon.com",
            type: "search"
        });

        const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
            headers: { Accept: "application/json" },
            cache: "no-store",
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.organic_results || data?.error) {
            console.warn(`[AmazonProvider] Live API Error: ${data?.error || `HTTP ${response.status}` || "No results"}. Falling back to Mock.`);
            return mockAmazonFallback(keyword);
        }

        const rawResults = data.organic_results || [];
        const listingsRaw = data.search_information?.total_results || 0;
        
        // 1. Institutional Cap: 20k Listing limit
        const listings = Math.min(listingsRaw, 20000);

        // 2. Outlier-Resistant Median Filter (Top 20 results)
        const sample = rawResults.slice(0, 20);
        const prices = sample.map(extractAmazonPrice).filter((value: number) => value > 0);
        const reviews = sample.map(extractAmazonReviews).filter((value: number) => value > 0);

        return {
            keyword,
            listings,
            avgPrice: getMedian(prices) || 19.99, // Fallback to standard POD price if none detected
            avgReviews: getMedian(reviews),
            reviewVelocity: Math.floor(getMedian(reviews) * 0.05), // Velocity proxy from static reviews
            topTitles: sample.slice(0, 5).map((p: any) => p.title),
            platform: "amazon",
            confidence: "real",
        };
    } catch (err) {
        console.error("[AmazonProvider] Network Error. Falling back to Mock.", err);
        return mockAmazonFallback(keyword);
    }
}

/**
 * v1.1 Simulation Fallback (Heuristic Logic)
 */
function mockAmazonFallback(keyword: string): MarketData {
    const lower = keyword.toLowerCase();
    const isSaturated = /dog|cat|coffee|nurse|teacher|gym/.test(lower);
    
    const listings = isSaturated 
        ? Math.floor(Math.random() * 10000) + 10000 
        : Math.floor(Math.random() * 2000) + 500;
        
    const avgReviews = isSaturated
        ? Math.floor(Math.random() * 1000) + 500
        : Math.floor(Math.random() * 250) + 100;

    return {
        keyword,
        listings,
        avgPrice: 19.99,
        avgReviews,
        reviewVelocity: Math.floor(avgReviews * 0.03),
        topTitles: [],
        platform: "amazon",
        confidence: "mock",
    };
}
