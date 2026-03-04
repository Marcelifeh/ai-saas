const { discoverHighPotentialKeywords } = require("./utils/advancedDiscovery");
const { enforceUsage } = require('./utils/usageGuard');
const { requireAuth } = require('./utils/sessionManager');

module.exports = requireAuth(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { niche, workspaceId } = req.body;

        if (!niche) {
            return res.status(400).json({ error: 'Missing niche', action: 'Provide a niche to analyze' });
        }

        const { user } = req.platformContext;
        const userId = user.id;

        // Protect API with Usage Guard (using advancedDiscovery action)
        const guard = enforceUsage(userId, "advancedDiscovery");

        if (!guard.allowed) {
            return res.status(403).json(guard);
        }

        const results = discoverHighPotentialKeywords(niche);

        return res.status(200).json({
            success: true,
            niche,
            topKeywords: results,
            workspaceCreditsRemaining: guard.usage.creditsRemaining,
            usage: guard.usage
        });
    } catch (e) {
        console.error("Advanced Discovery Error:", e);
        return res.status(500).json({ error: "Failed to run advanced discovery" });
    }
});
