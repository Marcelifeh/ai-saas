const { bulkDiscover } = require('./apps/app/dist-scripts/services/factoryService');

async function testDiscovery() {
    console.log("Starting Revenue Intelligence Discovery Test...");
    try {
        const result = await bulkDiscover();
        console.log("\n--- Discovery Result ---");
        console.log(`Total Winners: ${result.niches.length}`);
        
        result.niches.slice(0, 3).forEach((n, i) => {
            console.log(`\nWinner #${i + 1}: ${n.niche}`);
            console.log(`- Opportunity Score: ${n.opportunityScore} (${n.confidence})`);
            console.log(`- Amazon Listings: ${n.amazonListings}`);
            console.log(`- Etsy Listings: ${n.etsyListings}`);
            console.log(`- Strategic Insight: ${n.insight.substring(0, 100)}...`);
        });
        
    } catch (err) {
        console.error("Discovery Test Failed:", err);
    }
}

testDiscovery();
