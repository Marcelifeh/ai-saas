const { authProvider } = require('../api/utils/authProvider');

async function testApi() {
    // 1. Generate token using the default dev_secret_key_84920
    const user = { id: 'demo-user', defaultWorkspaceId: 'ws_demo_001' };
    const { token } = authProvider.issueSessionToken(user, 'ws_demo_001');

    console.log("Auth Token Generated");

    // 2. Fetch from live API
    console.log("--- Testing /api/bulk-generate live endpoint ---");
    try {
        const res = await fetch('https://ai-saas-ivory-three.vercel.app/api/bulk-generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-workspace-id': 'ws_demo_001',
                'Content-Type': 'application/json'
            }
        });

        const text = await res.text();
        console.log(`HTTP Status: ${res.status}`);
        console.log(`Raw Response: ${text}`);

        if (res.status === 500) {
            console.log("\nDetailed Error captured from 500 response", JSON.parse(text));
        }

    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testApi();
