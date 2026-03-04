const { createWorkspace } = require("./workspaceStore");

const userWorkspaceMap = new Map();

function assignUserToWorkspace(userId, workspaceId) {
    let list = userWorkspaceMap.get(userId) || [];
    if (!list.includes(workspaceId)) {
        list.push(workspaceId);
    }
    userWorkspaceMap.set(userId, list);
}

function getUserWorkspaces(userId) {
    let list = userWorkspaceMap.get(userId);
    if (!list || list.length === 0) {
        // Auto-create personal workspace if none exists
        const ws = createWorkspace(userId, "personal", "My Workspace");
        assignUserToWorkspace(userId, ws.id);
        return [ws.id];
    }
    return list;
}

function getUserWorkspace(userId) {
    const list = getUserWorkspaces(userId);
    return list[0];
}

module.exports = { assignUserToWorkspace, getUserWorkspace, getUserWorkspaces };
