const { getRunHistory } = require('./performanceEngine');
const { getWorkspaceAnalytics } = require('./analyticsEngine');

function generateWorkspaceInsights(workspaceId) {
    const insights = [];
    const runs = getRunHistory(); // In production, filter by workspaceId
    // const analytics = getWorkspaceAnalytics(workspaceId);

    if (runs.length === 0) {
        return [{ type: 'info', message: "Welcome to TrendForge AI. Run a generation to see strategic insights.", severity: 'info', icon: '✨' }];
    }

    // 1. Strategic Focus
    const nicheCounts = {};
    runs.forEach(r => {
        if (r.niche) nicheCounts[r.niche] = (nicheCounts[r.niche] || 0) + 1;
    });

    let topNiche = null;
    let maxCount = 0;
    for (const [niche, count] of Object.entries(nicheCounts)) {
        if (count > maxCount) { maxCount = count; topNiche = niche; }
    }

    if (topNiche) {
        const percentage = Math.round((maxCount / runs.length) * 100);
        insights.push({
            type: 'focus',
            message: `Your team is concentrating on "${topNiche}" (${percentage}% of activity)`,
            severity: 'info',
            icon: '🎯'
        });
    }

    // 2. Momentum Alert
    // Look for trending scores above 60 to signify emerging momentum
    const trending = runs.find(r => (r.trend && r.trend.score >= 60) || (r.trendMomentum && r.trendMomentum >= 60));
    if (trending) {
        const score = trending.trend?.score || trending.trendMomentum;
        insights.push({
            type: 'momentum',
            message: `Emerging opportunity: "${trending.niche}" shows accelerating trend signals (+${score}%)`,
            severity: 'success',
            icon: '🔥'
        });
    }

    // 3. Opportunity Alert
    // Concepts with high score but not actively published
    const missedOps = runs.filter(r => r.niche_score >= 70 && (!r.decision || r.decision.toLowerCase() !== 'publish'));
    if (missedOps.length > 0) {
        insights.push({
            type: 'opportunity',
            message: `${missedOps.length} high-score concepts exist but are not queued for publishing`,
            severity: 'warning',
            icon: '💡'
        });
    }

    // 4. Efficiency Insight
    const publishReady = runs.filter(r => r.decision && r.decision.toLowerCase() === 'publish').length;
    const rate = Math.round((publishReady / runs.length) * 100);
    if (publishReady > 0) {
        insights.push({
            type: 'efficiency',
            message: `Your pipeline maintains a ${rate}% publish-ready generation rate`,
            severity: 'success',
            icon: '⚡'
        });
    }

    return insights;
}

module.exports = { generateWorkspaceInsights };
