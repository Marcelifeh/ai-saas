export type DataConfidence = "mock" | "real";

export interface MarketData {
    keyword: string;
    listings: number;
    avgPrice: number;
    avgReviews: number;
    reviewVelocity: number; // Avg reviews gained in last 30d (simulated)
    topTitles: string[];
    platform: "amazon" | "etsy";
    confidence: DataConfidence;
}

export interface AggregatedMarketData {
    keyword: string;
    amazon: MarketData;
    etsy: MarketData;
    combinedConfidence: DataConfidence;
}

export type NicheStatus = "PASS" | "WATCHLIST" | "DROP";

export interface OpportunityScoreResult {
    niche: string;
    demandScore: number;       // 0-100
    competitionScore: number;  // 0-100
    intentScore: number;       // 0-100
    velocityScore: number;     // 0-100
    noveltyScore: number;      // 0-100
    finalOpportunityScore: number; // 0-100
    status: NicheStatus;
    confidence: DataConfidence;
    opportunityReasons: string[]; // v1.3 human-readable justifications
    details?: string;
}
