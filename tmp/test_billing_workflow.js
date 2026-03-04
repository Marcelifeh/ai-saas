const billingStore = require('../api/utils/billingStore');
const billingProvider = require('../api/utils/billingProvider');
const priceMap = require('../api/utils/priceMap');

const createCheckoutSession = require('../api/billing/create-checkout-session');
const webhook = require('../api/billing/webhook');
const usageStore = require('../api/utils/usageStore');

console.log("Syntax check passed: all billing modules loaded.");

// Test getBilling and getUserUsage synchronization
const userId = "demo-user";
const usageInit = usageStore.getUserUsage(userId);
console.log("Initial usage plan directly maps to billing:", usageInit.plan);

// Test checkout mock call
const req = { method: "POST", body: { plan: "Pro", email: "test@example.com" } };
const res = {
    status: (code) => res,
    json: (data) => console.log("Checkout Route Response:", data)
};

createCheckoutSession(req, res).then(() => {
    // Expecting mock billing sync to activate pro
    const billingAfter = billingStore.getBilling(userId);
    console.log("Billing plan activated via mock:", billingAfter.plan, "status:", billingAfter.status);
    const usageAfter = usageStore.getUserUsage(userId);
    console.log("Usage store synced to:", usageAfter.plan, "credits:", usageAfter.creditsRemaining);
}).catch(console.error);

