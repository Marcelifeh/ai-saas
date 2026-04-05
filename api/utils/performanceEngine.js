const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(require('os').tmpdir(), 'saas_run_history.json');

function loadHistory() {
    try {
        if (fs.existsSync(DB_FILE)) {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }
    } catch (e) {
        console.error("Failed to load history DB", e);
    }
    return [];
}

function saveHistory(history) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history DB", e);
    }
}

let runHistory = loadHistory();

function logRun(result) {
    runHistory.push(result);
    saveHistory(runHistory);
}

function getRunHistory() {
    return runHistory;
}

function getPerformanceMetrics() {
    if (!runHistory.length) {
        return {
            avgNicheScore: 0,
            publishReadyRate: 0,
            totalRevenueProjection: 0,
            roiScore: 0,
            profitabilityTier: "low"
        };
    }

    const total = runHistory.length;

    const avgScore = runHistory.reduce((sum, r) => sum + (r.nicheScore || 0), 0) / total;

    const publishReady = runHistory.filter(r => r.decision === "publish" || r.decision === "investigate").length / total;

    const revenue = runHistory.reduce((sum, r) => sum + (r.projectedRevenue || 0), 0);

    // Simplistic ROI assuming 1 run = 1 compute unit
    const creditsConsumed = Math.max(1, total);
    const roiScore = Math.round(revenue / creditsConsumed);

    let profitabilityTier = "low";
    if (roiScore >= 1200) profitabilityTier = "high";
    else if (roiScore >= 500) profitabilityTier = "medium";

    return {
        avgNicheScore: Math.round(avgScore),
        publishReadyRate: Math.round(publishReady * 100),
        totalRevenueProjection: Math.round(revenue),
        roiScore,
        profitabilityTier
    };
}

module.exports = { logRun, getRunHistory, getPerformanceMetrics };
