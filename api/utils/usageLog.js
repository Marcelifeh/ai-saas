const workspaceUsageLog = [];

function logUsageActivity(workspaceId, userId, action, creditsUsed) {
    workspaceUsageLog.push({
        workspaceId,
        userId,
        action,
        creditsUsed,
        timestamp: Date.now()
    });
}

function getWorkspaceUsage(workspaceId) {
    return workspaceUsageLog.filter(log => log.workspaceId === workspaceId);
}

module.exports = { logUsageActivity, getWorkspaceUsage };
