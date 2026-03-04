const { getWorkspaceUsage } = require("./usageLog");

function getWorkspaceAnalytics(workspaceId) {
    const logs = getWorkspaceUsage(workspaceId);

    const totalActions = logs.length;
    const totalCredits = logs.reduce((sum, log) => sum + (log.creditsUsed || 0), 0);

    const byUser = {};
    const byAction = {};
    const featuresByCount = {};

    logs.forEach(log => {
        byUser[log.userId] = (byUser[log.userId] || 0) + 1;
        byAction[log.action] = (byAction[log.action] || 0) + 1;
        featuresByCount[log.action] = (featuresByCount[log.action] || 0) + 1;
    });

    const timeline = logs.map(log => ({
        time: log.timestamp,
        action: log.action
    }));

    // Find highest member activity
    let topMember = { user: 'None', actions: 0 };
    for (const [user, actions] of Object.entries(byUser)) {
        if (actions > topMember.actions) topMember = { user, actions };
    }

    return {
        totalActions,
        totalCreditsUsed: totalCredits,
        topMember,
        memberActivity: byUser,
        featureUsage: byAction,
        timeline
    };
}

module.exports = { getWorkspaceAnalytics };
