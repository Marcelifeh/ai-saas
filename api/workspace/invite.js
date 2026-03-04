const { getWorkspace, updateWorkspace } = require("../utils/workspaceStore");
const { requireAuth } = require("../utils/sessionManager");

module.exports = requireAuth(async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { workspaceId, userId } = req.body;

    if (!workspaceId || !userId) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const ws = getWorkspace(workspaceId);

    if (!ws) {
        return res.status(404).json({ error: "Workspace not found" });
    }

    // Check if user is already a member
    if (ws.members.find(m => m.userId === userId)) {
        return res.status(400).json({ error: "User already in workspace" });
    }

    ws.members.push({
        userId,
        role: "member" // default role, could be "designer" etc.
    });

    updateWorkspace(workspaceId, ws);

    res.json({ success: true, message: "User invited successfully" });
});
