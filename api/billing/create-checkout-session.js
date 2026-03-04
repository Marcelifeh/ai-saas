const { getBilling, updateBilling } = require("../utils/billingStore");
const { createCustomer, createCheckoutSession } = require("../utils/billingProvider");
const { getUserWorkspace } = require("../utils/userWorkspace");
const { updateWorkspace } = require("../utils/workspaceStore");
const { PLANS } = require("../utils/plans");
const { requireAuth } = require("../utils/sessionManager");

module.exports = requireAuth(async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { plan, email } = req.body;
        const { user } = req.platformContext;
        const userId = user.id;
        const workspaceId = getUserWorkspace(userId);

        let billing = getBilling(workspaceId);

        if (!billing.customerId) {
            const customer = await createCustomer({ email, userId: workspaceId });
            billing = updateBilling(workspaceId, { customerId: customer.customerId });
        }

        const session = await createCheckoutSession({
            customerId: billing.customerId,
            plan
        });

        // MOCK: Auto-sync billing since we don't have a real webhook firing yet
        // In production, the Stripe webhook (api/billing/webhook.js) handles this.
        const planKey = plan ? plan.toLowerCase() : "pro";
        if (PLANS[planKey]) {
            updateBilling(workspaceId, { plan: planKey, status: "active" });
            updateWorkspace(workspaceId, {
                plan: planKey,
                creditsRemaining: PLANS[planKey].monthlyCredits
            });
        }

        res.json({ url: session.url });

    } catch (err) {
        console.error("Checkout Error:", err);
        res.status(500).json({
            error: "Checkout creation failed",
            action: "Try again or contact support"
        });
    }
});
