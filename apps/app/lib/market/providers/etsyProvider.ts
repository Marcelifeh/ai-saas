import { MarketData } from "./types";
import { getServerEnv } from "@/lib/utils/serverEnv";

function getMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((left, right) => left - right);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function extractEtsyPrice(item: any): number {
    const detected = item?.rich_snippet?.bottom?.detected_extensions;
    if (typeof detected?.price_from === "number" && typeof detected?.price_to === "number") {
        return (detected.price_from + detected.price_to) / 2;
    }

    if (typeof detected?.price_from === "number") {
        return detected.price_from;
    }

    return 0;
}

function extractEtsyReviews(item: any): number {
    const detected = item?.rich_snippet?.bottom?.detected_extensions;
    if (typeof detected?.reviews === "number") {
        return detected.reviews;
    }

    return 0;
}

/**
 * Etsy Market Data Provider v1.3
 * Uses SerpAPI to fetch live search results.
 * Implements Institutional Sniper Logic: Median Filter + 10k Cap.
 */
export async function fetchEtsyData(keyword: string): Promise<MarketData> {
    const apiKey = getServerEnv("SERPAPI_API_KEY");

    // FALLBACK IF API KEY MISSING
    if (!apiKey) {
        return mockEtsyFallback(keyword);
    }

    try {
        const params = new URLSearchParams({
            engine: "google",
            q: `site:etsy.com/listing ${keyword}`,
            api_key: apiKey,
            google_domain: "google.com",
            num: "20",
        });

        const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
            headers: { Accept: "application/json" },
            cache: "no-store",
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.organic_results || data?.error) {
            console.warn(`[EtsyProvider] Live API Error: ${data?.error || `HTTP ${response.status}` || "No results"}. Falling back to Mock.`);
            return mockEtsyFallback(keyword);
        }

        const rawResults = (data.organic_results || []).filter((item: any) => {
            const link = typeof item?.link === "string" ? item.link : "";
            return link.includes("etsy.com/listing");
        });
        const listingsRaw = data.search_information?.total_results || 0;
        
        // 1. Institutional Cap: 15k Listing limit for Etsy
        const listings = Math.min(listingsRaw, 15000);

        // 2. Outlier-Resistant Median Filter (Top 20 results)
        const sample = rawResults.slice(0, 20);
        const prices = sample.map(extractEtsyPrice).filter((value: number) => value > 0);
        const reviews = sample.map(extractEtsyReviews).filter((value: number) => value > 0);

        return {
            keyword,
            listings,
            avgPrice: getMedian(prices) || 24.99, // Fallback to standard POD price if none detected
            avgReviews: getMedian(reviews),
            reviewVelocity: Math.floor(getMedian(reviews) * 0.05), // Velocity proxy from static reviews
            topTitles: sample.slice(0, 5).map((p: any) => p.title),
            platform: "etsy",
            confidence: "real",
        };
    } catch (err) {
        console.error("[EtsyProvider] Network Error. Falling back to Mock.", err);
        return mockEtsyFallback(keyword);
    }
}

/**
 * v1.1 Simulation Fallback (Heuristic Logic)
 */
function mockEtsyFallback(keyword: string): MarketData {
    const lower = keyword.toLowerCase();
    const isSaturated = /gift|dog|nurse|teacher|mama/.test(lower);
    
    const listings = isSaturated 
        ? Math.floor(Math.random() * 5000) + 5000 
        : Math.floor(Math.random() * 1000) + 100;
        
    const avgReviews = isSaturated
        ? Math.floor(Math.random() * 2000) + 800
        : Math.floor(Math.random() * 250) + 100;

    return {
        keyword,
        listings,
        avgPrice: 24.99,
        avgReviews,
        reviewVelocity: Math.floor(avgReviews * 0.04),
        topTitles: [],
        platform: "etsy",
        confidence: "mock",
    };
}
