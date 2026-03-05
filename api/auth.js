/**
 * Auth Router — Vercel Hobby Consolidation
 * Covers: /api/auth/demo, /api/workspace/list, /api/workspace/switch, /api/workspace/invite
 */

const { authProvider } = require('./utils/authProvider');
const { requireAuth } = require('./utils/sessionManager');
const { getUserById } = require('./utils/userStore');
const { getUserWorkspaces } = require('./utils/userWorkspace');
const { getWorkspace, updateWorkspace } = require('./utils/workspaceStore');
const { eventBus, PlatformEvents } = require('./utils/eventBus');

// ─── Route Dispatcher ─────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
    const url = (req.url || '').split('?')[0];

    if (url === '/api/auth/demo') return handleDemo(req, res);
    if (url === '/api/workspace/list') return requireAuth(handleWorkspaceList)(req, res);
    if (url === '/api/workspace/switch') return requireAuth(handleWorkspaceSwitch)(req, res);
    if (url === '/api/workspace/invite') return requireAuth(handleWorkspaceInvite)(req, res);

    return res.status(404).json({ error: 'Not found' });
};

// ─── /api/auth/demo ───────────────────────────────────────────────────────────
async function handleDemo(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const user = getUserById('demo-user');
    if (!user) return res.status(404).json({ error: 'Demo user not found' });

    const session = authProvider.issueSessionToken(user, user.defaultWorkspaceId, 'owner');

    return res.status(200).json({
        success: true,
        token: session.token,
        workspaceId: user.defaultWorkspaceId
    });
}

// ─── /api/workspace/list ──────────────────────────────────────────────────────
async function handleWorkspaceList(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { user, session } = req.platformContext;
        const userId = user.id;

        const workspaceIds = getUserWorkspaces(userId);
        const workspaces = workspaceIds.map(id => {
            const ws = getWorkspace(id);
            if (!ws) return null;
            return {
                id: ws.id,
                name: ws.name || 'Untitled Workspace',
                type: ws.type || 'personal',
                plan: ws.plan || 'free',
                isActive: id === session.activeWorkspaceId,
                memberCount: ws.members ? ws.members.length : 1
            };
        }).filter(Boolean);

        return res.status(200).json({ success: true, workspaces });
    } catch (e) {
        console.error('Fetch Workspaces Error:', e);
        return res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
}

// ─── /api/workspace/switch ────────────────────────────────────────────────────
async function handleWorkspaceSwitch(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { targetWorkspaceId } = req.body;
        const { user, session } = req.platformContext;
        const userId = user.id;

        if (!targetWorkspaceId) return res.status(400).json({ error: 'Missing targetWorkspaceId' });

        const allowedWorkspaces = getUserWorkspaces(userId);
        if (!allowedWorkspaces.includes(targetWorkspaceId)) {
            return res.status(403).json({ error: 'Forbidden: You do not belong to this workspace.' });
        }

        const workspace = getWorkspace(targetWorkspaceId);
        if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

        const memberRecord = workspace.members.find(m => m.userId === userId);
        const role = memberRecord ? memberRecord.role : 'member';

        const authHeader = req.headers?.authorization || '';
        if (authHeader.startsWith('Bearer ')) {
            authProvider.revokeToken(authHeader.split(' ')[1]);
        }

        const newSession = authProvider.issueSessionToken(user, targetWorkspaceId, role);

        eventBus.emit(PlatformEvents.WORKSPACE_SWITCHED, {
            userId,
            previousWorkspaceId: session.activeWorkspaceId,
            newWorkspaceId: targetWorkspaceId
        });

        return res.status(200).json({
            success: true,
            activeWorkspaceId: targetWorkspaceId,
            token: newSession.token,
            workspace: { id: workspace.id, name: workspace.name, plan: workspace.plan, type: workspace.type }
        });
    } catch (e) {
        console.error('Workspace Switch Error:', e);
        return res.status(500).json({ error: 'Failed to switch workspace' });
    }
}

// ─── /api/workspace/invite ────────────────────────────────────────────────────
async function handleWorkspaceInvite(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { workspaceId, userId } = req.body;
    if (!workspaceId || !userId) return res.status(400).json({ error: 'Missing parameters' });

    const ws = getWorkspace(workspaceId);
    if (!ws) return res.status(404).json({ error: 'Workspace not found' });
    if (ws.members.find(m => m.userId === userId)) return res.status(400).json({ error: 'User already in workspace' });

    ws.members.push({ userId, role: 'member' });
    updateWorkspace(workspaceId, ws);

    return res.json({ success: true, message: 'User invited successfully' });
}
