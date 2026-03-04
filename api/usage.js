const { getUserWorkspace } = require("./utils/userWorkspace");
const { getWorkspace } = require("./utils/workspaceStore");
const { PLANS } = require("./utils/plans");
const { requireAuth } = require("./utils/sessionManager");

module.exports = requireAuth(async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    const { user } = req.platformContext;
    const userId = user.id;
    const workspaceId = getUserWorkspace(userId);
    const ws = getWorkspace(workspaceId);
    const plan = PLANS[ws.plan];

    res.json({
        success: true,
        usage: {
            creditsRemaining: ws.creditsRemaining,
            bulkRunsUsed: ws.bulkRunsUsed || 0,
            autopilotRunsUsed: ws.autopilotRunsUsed || 0
        },
        plan,
        workspaceId,
        members: ws.members
    });
});
