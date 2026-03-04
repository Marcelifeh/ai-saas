const billingDB = new Map();

function getBilling(userId) {
    if (!billingDB.has(userId)) {
        billingDB.set(userId, {
            customerId: null,
            subscriptionId: null,
            plan: "free",
            status: "inactive"
        });
    }
    return billingDB.get(userId);
}

function updateBilling(userId, updates) {
    const record = getBilling(userId);
    Object.assign(record, updates);
    billingDB.set(userId, record);
    return record;
}

module.exports = { getBilling, updateBilling };
