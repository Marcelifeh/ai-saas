// Simple User Data Store for Identity management
// In production, this binds to Postgres / MongoDB.

const usersDB = new Map();

// Mock initial data setup for the platform
usersDB.set('demo-user', {
    id: 'demo-user',
    email: 'creator@example.com',
    name: 'Demo Creator',
    defaultWorkspaceId: 'ws_demo_001',
    createdAt: Date.now()
});

function getUserById(userId) {
    if (!userId) return null;
    return usersDB.get(String(userId)) || null;
}

function getUserByEmail(email) {
    for (const user of usersDB.values()) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
            return user;
        }
    }
    return null;
}

function createUser(email, name) {
    const existing = getUserByEmail(email);
    if (existing) throw new Error("Email already registered");

    const id = 'usr_' + Math.random().toString(36).substr(2, 9);
    const user = {
        id,
        email,
        name: name || email.split('@')[0],
        defaultWorkspaceId: null, // Will be bound during workspace creation
        createdAt: Date.now()
    };

    usersDB.set(id, user);
    return user;
}

function updateUser(id, updates) {
    const user = getUserById(id);
    if (!user) return null;

    const updated = { ...user, ...updates };
    usersDB.set(id, updated);
    return updated;
}

module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser
};
