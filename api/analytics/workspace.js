const { getWorkspaceAnalytics } = require("../utils/analyticsEngine");
const { getPerformanceMetrics } = require("../utils/performanceEngine");
const { requireAuth } = require("../utils/sessionManager");

module.exports = requireAuth(async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { workspace, plan } = req.platformContext;

    const analytics = getWorkspaceAnalytics(workspace.id);
    const performance = getPerformanceMetrics();

    res.json({
        success: true,
        workspace: {
            name: workspace.name || "Team Workspace",
            plan: workspace.plan,
            creditsRemaining: workspace.creditsRemaining,
            monthlyCredits: plan.monthlyCredits
        },
        analytics,
        performance
    });
});
