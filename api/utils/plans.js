const PLANS = {
    free: {
        name: "Free",
        monthlyCredits: 50,
        maxBulkRuns: 1,
        maxAutopilotRuns: 1,
        trendAccess: false,
        priorityQueue: false
    },
    starter: {
        name: "Starter",
        monthlyCredits: 300,
        maxBulkRuns: 10,
        maxAutopilotRuns: 10,
        trendAccess: true,
        priorityQueue: false
    },
    pro: {
        name: "Pro",
        monthlyCredits: 1000,
        maxBulkRuns: 50,
        maxAutopilotRuns: 50,
        trendAccess: true,
        priorityQueue: true
    }
};

function getPlanDetails(planId) {
    return PLANS[planId] || PLANS['free'];
}

module.exports = { PLANS, getPlanDetails };
