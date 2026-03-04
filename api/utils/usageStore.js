const { getBilling } = require("./billingStore");

const usageDB = new Map();

function getUserUsage(userId) {
    const billing = getBilling(userId);

    if (!usageDB.has(userId)) {
        usageDB.set(userId, {
            plan: billing.plan || "free",
            creditsRemaining: 50,
            bulkRuns: 0,
            autopilotRuns: 0
        });
    }
    return usageDB.get(userId);
}

function updateUserUsage(userId, updates) {
    const usage = getUserUsage(userId);
    Object.assign(usage, updates);
    usageDB.set(userId, usage);
    return usage;
}

module.exports = { getUserUsage, updateUserUsage };
