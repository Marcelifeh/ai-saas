async function createCustomer({ email, userId }) {
    // Stripe implementation goes here later
    return { customerId: "mock_customer_" + userId };
}

async function createCheckoutSession({ customerId, plan }) {
    // Stripe Checkout will go here later
    return {
        url: "/?billing-success=true&mock=true"
    };
}

async function handleWebhook(event) {
    // Stripe webhook processing later
    // MOCK: instantly activate the plan from the event payload
    return {
        handled: true,
        planActivated: true,
        userId: event.userId || "demo-user",
        plan: event.plan || "pro"
    };
}

module.exports = { createCustomer, createCheckoutSession, handleWebhook };
