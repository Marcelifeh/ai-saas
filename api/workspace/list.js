const { requireAuth } = require("../utils/sessionManager");
const { getUserWorkspaces } = require("../utils/userWorkspace");
const { getWorkspace } = require("../utils/workspaceStore");

module.exports = requireAuth(async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { user, session } = req.platformContext;
        const userId = user.id;

        const workspaceIds = getUserWorkspaces(userId);
        const workspaces = workspaceIds.map(id => {
            const ws = getWorkspace(id);
            if (!ws) return null;
            return {
                id: ws.id,
                name: ws.name || "Untitled Workspace",
                type: ws.type || "personal",
                plan: ws.plan || "free",
                isActive: id === session.activeWorkspaceId,
                memberCount: ws.members ? ws.members.length : 1
            };
        }).filter(Boolean);

        return res.status(200).json({
            success: true,
            workspaces
        });
    } catch (e) {
        console.error("Fetch Workspaces Error:", e);
        return res.status(500).json({ error: "Failed to fetch workspaces" });
    }
});
