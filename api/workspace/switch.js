const { requireAuth } = require("../utils/sessionManager");
const { getUserWorkspaces } = require("../utils/userWorkspace");
const { getWorkspace } = require("../utils/workspaceStore");
const { authProvider } = require("../utils/authProvider");
const { eventBus, PlatformEvents } = require("../utils/eventBus");

module.exports = requireAuth(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { targetWorkspaceId } = req.body;
        const { user, session } = req.platformContext;
        const userId = user.id;

        if (!targetWorkspaceId) {
            return res.status(400).json({ error: "Missing targetWorkspaceId" });
        }

        // 1. Server-side validation: MUST belong to workspaceId
        const allowedWorkspaces = getUserWorkspaces(userId);
        if (!allowedWorkspaces.includes(targetWorkspaceId)) {
            return res.status(403).json({ error: "Forbidden: You do not belong to this workspace." });
        }

        const workspace = getWorkspace(targetWorkspaceId);
        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found" });
        }

        const memberRecord = workspace.members.find(m => m.userId === userId);
        const role = memberRecord ? memberRecord.role : 'member';

        // 2. Invalidate stale session and issue new token
        authProvider.revokeToken(session.token); // Assuming token string isn't attached strictly, wait
        // The token string isn't natively exposed in `req.platformContext.session`. 
        // We can extract it from the header again.
        const authHeader = req.headers?.authorization || (req.headers && req.headers.get && req.headers.get('authorization')) || '';
        if (authHeader.startsWith('Bearer ')) {
            authProvider.revokeToken(authHeader.split(' ')[1]);
        }

        const newSession = authProvider.issueSessionToken(user, targetWorkspaceId, role);

        // 3. Fire platform event for decoupling analytics/audit logs
        eventBus.emit(PlatformEvents.WORKSPACE_SWITCHED, {
            userId,
            previousWorkspaceId: session.activeWorkspaceId,
            newWorkspaceId: targetWorkspaceId
        });

        return res.status(200).json({
            success: true,
            activeWorkspaceId: targetWorkspaceId,
            token: newSession.token,
            workspace: {
                id: workspace.id,
                name: workspace.name,
                plan: workspace.plan,
                type: workspace.type
            }
        });

    } catch (e) {
        console.error("Workspace Switch Error:", e);
        return res.status(500).json({ error: "Failed to switch workspace" });
    }
});
