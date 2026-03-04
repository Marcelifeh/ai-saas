const { requireAuth } = require("../utils/sessionManager");
const { generateWorkspaceInsights } = require("../utils/insightEngine");

module.exports = requireAuth(async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { session } = req.platformContext;
        const workspaceId = session.activeWorkspaceId;

        const insights = generateWorkspaceInsights(workspaceId);

        return res.status(200).json({
            success: true,
            insights
        });
    } catch (e) {
        console.error("Insights API Error:", e);
        return res.status(500).json({ error: "Failed to generate AI insights" });
    }
});
