/**
 * Analytics Router — Vercel Hobby Consolidation
 * Covers: /api/analytics/insights, /api/analytics/workspace, /api/usage,
 *         /api/billing/create-checkout-session, /api/billing/webhook
 */

const { requireAuth } = require('./utils/sessionManager');
const { generateWorkspaceInsights } = require('./utils/insightEngine');
const { getWorkspaceAnalytics } = require('./utils/analyticsEngine');
const { getPerformanceMetrics } = require('./utils/performanceEngine');
const { getUserWorkspace } = require('./utils/userWorkspace');
const { getWorkspace, updateWorkspace } = require('./utils/workspaceStore');
const { PLANS } = require('./utils/plans');
const { getBilling, updateBilling } = require('./utils/billingStore');
const { createCustomer, createCheckoutSession, handleWebhook } = require('./utils/billingProvider');

// ─── Route Dispatcher ─────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
    const url = (req.url || '').split('?')[0];

    if (url === '/api/analytics/insights') return requireAuth(handleInsights)(req, res);
    if (url === '/api/analytics/workspace') return requireAuth(handleWorkspaceAnalytics)(req, res);
    if (url === '/api/usage') return requireAuth(handleUsage)(req, res);
    if (url === '/api/billing/create-checkout-session') return requireAuth(handleCheckout)(req, res);
    if (url === '/api/billing/webhook') return handleBillingWebhook(req, res);

    return res.status(404).json({ error: 'Not found' });
};

// ─── /api/analytics/insights ──────────────────────────────────────────────────
async function handleInsights(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { session } = req.platformContext;
        const workspaceId = session.activeWorkspaceId;
        const insights = generateWorkspaceInsights(workspaceId);
        return res.status(200).json({ success: true, insights });
    } catch (e) {
        console.error('Insights API Error:', e);
        return res.status(500).json({ error: 'Failed to generate AI insights' });
    }
}

// ─── /api/analytics/workspace ─────────────────────────────────────────────────
async function handleWorkspaceAnalytics(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { workspace, plan } = req.platformContext;
    const analytics = getWorkspaceAnalytics(workspace.id);
    const performance = getPerformanceMetrics();

    return res.json({
        success: true,
        workspace: {
            name: workspace.name || 'Team Workspace',
            plan: workspace.plan,
            creditsRemaining: workspace.creditsRemaining,
            monthlyCredits: plan.monthlyCredits
        },
        analytics,
        performance
    });
}

// ─── /api/usage ───────────────────────────────────────────────────────────────
async function handleUsage(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { user } = req.platformContext;
    const userId = user.id;
    const workspaceId = getUserWorkspace(userId);
    const ws = getWorkspace(workspaceId);
    const plan = PLANS[ws.plan];

    return res.json({
        success: true,
        usage: {
            creditsRemaining: ws.creditsRemaining,
            bulkRunsUsed: ws.bulkRunsUsed || 0,
            autopilotRunsUsed: ws.autopilotRunsUsed || 0
        },
        plan,
        workspaceId,
        members: ws.members
    });
}

// ─── /api/billing/create-checkout-session ─────────────────────────────────────
async function handleCheckout(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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

        const session = await createCheckoutSession({ customerId: billing.customerId, plan });

        const planKey = plan ? plan.toLowerCase() : 'pro';
        if (PLANS[planKey]) {
            updateBilling(workspaceId, { plan: planKey, status: 'active' });
            updateWorkspace(workspaceId, { plan: planKey, creditsRemaining: PLANS[planKey].monthlyCredits });
        }

        return res.json({ url: session.url });
    } catch (err) {
        console.error('Checkout Error:', err);
        return res.status(500).json({ error: 'Checkout creation failed', action: 'Try again or contact support' });
    }
}

// ─── /api/billing/webhook ─────────────────────────────────────────────────────
async function handleBillingWebhook(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const event = req.body;
    try {
        const result = await handleWebhook(event);

        if (result.planActivated) {
            const workspaceId = result.workspaceId || result.userId || 'demo-user';
            const planKey = (result.plan || 'free').toLowerCase();

            updateBilling(workspaceId, { plan: planKey, status: 'active' });
            if (PLANS[planKey]) {
                updateWorkspace(workspaceId, { plan: planKey, creditsRemaining: PLANS[planKey].monthlyCredits });
            }
        }

        return res.json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err);
        return res.status(500).json({ error: 'Webhook handler failed' });
    }
}
