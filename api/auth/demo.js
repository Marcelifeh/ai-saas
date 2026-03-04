const { authProvider } = require('../utils/authProvider');
const { requireAuth } = require('../utils/sessionManager');
const { getUserById } = require('../utils/userStore');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Automatically issue a token for the demo-user
    const user = getUserById("demo-user");
    if (!user) return res.status(404).json({ error: 'Demo user not found' });

    const session = authProvider.issueSessionToken(user, user.defaultWorkspaceId, 'owner');

    return res.status(200).json({
        success: true,
        token: session.token,
        workspaceId: user.defaultWorkspaceId
    });
};
