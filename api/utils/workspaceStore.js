const workspaceDB = new Map();

// Mock initial data setup for the platform
workspaceDB.set('ws_demo_001', {
    id: 'ws_demo_001',
    name: 'Personal Workspace',
    type: 'personal',
    ownerId: 'demo-user',
    plan: 'free',
    creditsRemaining: 50,
    bulkRunsUsed: 0,
    autopilotRunsUsed: 0,
    members: [{ userId: 'demo-user', role: 'owner' }],
    createdAt: new Date()
});

workspaceDB.set('ws_demo_002', {
    id: 'ws_demo_002',
    name: 'Demo Company',
    type: 'enterprise',
    ownerId: 'demo-user',
    plan: 'pro',
    creditsRemaining: 500,
    bulkRunsUsed: 0,
    autopilotRunsUsed: 0,
    members: [{ userId: 'demo-user', role: 'owner' }],
    createdAt: new Date()
});

function createWorkspace(ownerId, type = "personal", name = "My Workspace") {
    const id = "ws_" + Date.now();

    workspaceDB.set(id, {
        id,
        name,
        type,
        ownerId,
        plan: type === "enterprise" ? "pro" : "free",
        creditsRemaining: type === "enterprise" ? 500 : 50,
        bulkRunsUsed: 0,
        autopilotRunsUsed: 0,
        members: [
            { userId: ownerId, role: "owner" }
        ],
        createdAt: new Date()
    });

    return workspaceDB.get(id);
}

function getWorkspace(workspaceId) {
    return workspaceDB.get(workspaceId);
}

function updateWorkspace(workspaceId, updates) {
    const ws = workspaceDB.get(workspaceId);
    if (ws) {
        Object.assign(ws, updates);
        workspaceDB.set(workspaceId, ws);
    }
    return ws;
}

module.exports = { createWorkspace, getWorkspace, updateWorkspace };
