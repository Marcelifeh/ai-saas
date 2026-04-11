require('dotenv').config();
const { discoverTrends } = require('../api/utils/trendEngine');

async function testDiscovery() {
    console.log("Running V2 Discovery Engine with Cultural Subreddits...");
    try {
        const result = await discoverTrends();
        console.log("\n--- Top 15 Final Real Niches Generated ---");
        result.niches.slice(0, 15).forEach((n, i) => {
            console.log(`${i + 1}. ${n.niche} (Score: ${n.finalScore})`);
        });
    } catch (e) {
        console.error("Discovery failed", e);
    }
}

testDiscovery();
