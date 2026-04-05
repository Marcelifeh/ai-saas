const { getWorkspace, updateWorkspace } = require("./workspaceStore");

function consumeWorkspaceCredits(workspaceId, amount) {
    const ws = getWorkspace(workspaceId);

    if (!ws) {
        return { allowed: false, reason: "Workspace not found" };
    }

    if (ws.creditsRemaining < amount) {
        return {
            allowed: false,
            reason: "Not enough team credits"
        };
    }

    ws.creditsRemaining -= amount;
    updateWorkspace(workspaceId, ws);

    return {
        allowed: true,
        remaining: ws.creditsRemaining
    };
}

function consumeWorkspaceQuota(workspaceId, type) {
    const ws = getWorkspace(workspaceId);

    if (!ws) {
        return { allowed: false, reason: "Workspace not found" };
    }

    if (type === 'bulkRun') {
        ws.bulkRunsUsed = (ws.bulkRunsUsed || 0) + 1;
    } else if (type === 'autopilotRun') {
        ws.autopilotRunsUsed = (ws.autopilotRunsUsed || 0) + 1;
    }

    updateWorkspace(workspaceId, ws);
    return { allowed: true };
}

module.exports = { consumeWorkspaceCredits, consumeWorkspaceQuota };
