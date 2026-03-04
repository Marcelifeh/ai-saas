const { handleWebhook } = require("../utils/billingProvider");
const { updateBilling } = require("../utils/billingStore");
const { updateWorkspace } = require("../utils/workspaceStore");
const { PLANS } = require("../utils/plans");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const event = req.body;

    try {
        const result = await handleWebhook(event);

        if (result.planActivated) {
            // MOCK: In production, Stripe returns customer profile which maps to workspaceId
            const workspaceId = result.workspaceId || result.userId || "demo-user";
            const plan = result.plan;
            const planKey = plan ? plan.toLowerCase() : "free";

            updateBilling(workspaceId, {
                plan: planKey,
                status: "active"
            });

            if (PLANS[planKey]) {
                updateWorkspace(workspaceId, {
                    plan: planKey,
                    creditsRemaining: PLANS[planKey].monthlyCredits
                });
            }
        }

        res.json({ received: true });
    } catch (err) {
        console.error("Webhook Error:", err);
        res.status(500).json({ error: "Webhook handler failed" });
    }
};
