const { PLANS } = require("./plans");
const { CREDIT_COSTS } = require("./creditCosts");
const { getWorkspace } = require("./workspaceStore");
const { consumeWorkspaceCredits, consumeWorkspaceQuota } = require("./workspaceUsage");
const { logUsageActivity } = require("./usageLog");
const { getUserWorkspace } = require("./userWorkspace");

function enforceUsage(userId, action) {
    const workspaceId = getUserWorkspace(userId);
    const ws = getWorkspace(workspaceId);

    if (!ws) {
        return { allowed: false, error: "Workspace not found", action: "Contact support" };
    }

    const plan = PLANS[ws.plan];
    const cost = CREDIT_COSTS[action];

    if (!cost) {
        return { allowed: true };
    }

    if (ws.creditsRemaining < cost) {
        return {
            allowed: false,
            error: "Not enough team credits",
            action: "Upgrade workspace plan"
        };
    }

    if (action === "bulkFactoryRun" && (ws.bulkRunsUsed || 0) >= plan.maxBulkRuns) {
        return {
            allowed: false,
            error: "Team bulk run limit reached",
            action: "Upgrade workspace plan"
        };
    }

    if (action === "autopilotRun" && (ws.autopilotRunsUsed || 0) >= plan.maxAutopilotRuns) {
        return {
            allowed: false,
            error: "Team autopilot limit reached",
            action: "Upgrade workspace plan"
        };
    }

    // Deduct credits
    consumeWorkspaceCredits(workspaceId, cost);
    if (action === "bulkFactoryRun" || action === "autopilotRun") {
        consumeWorkspaceQuota(workspaceId, action);
    }

    // Log the team activity for Analytics dashboard
    logUsageActivity(workspaceId, userId, action, cost);

    const updatedWs = getWorkspace(workspaceId);

    return {
        allowed: true,
        usage: {
            creditsRemaining: updatedWs.creditsRemaining,
            bulkRunsUsed: updatedWs.bulkRunsUsed || 0,
            autopilotRunsUsed: updatedWs.autopilotRunsUsed || 0
        }
    };
}

module.exports = { enforceUsage };
