// Advanced HTTP Context Resolver for Enterprise Scale
const { getPlanDetails } = require('./plans.js');
const { getWorkspace } = require('./workspaceStore.js'); // Assuming getWorkspace is exported here
const { authProvider } = require('./authProvider.js');
const { getUserById } = require('./userStore.js');

/**
 * Validates a request, extracts identity, and binds a full operational context.
 * Used internally by secure middleware.
 * @param {Request|Object} req - The incoming request
 * @returns {Object} context - The heavily decorated platform context
 */
async function resolveRequestContext(req) {
    if (!req) throw new Error("Request unresolvable");

    // 1. Extract Bearer Token & Workspace Identity
    // In production, Next.js / Express headers come via req.headers[] or req.headers.get()
    const authHeader = req.headers?.authorization || (req.headers && req.headers.get && req.headers.get('authorization')) || '';
    const workspaceId = req.headers?.['x-workspace-id'] || (req.headers && req.headers.get && req.headers.get('x-workspace-id')) || null;

    if (!authHeader.startsWith('Bearer ')) {
        console.warn(`[AUTH] Missing or malformed token`);
        throw new Error("401 Unauthorized: Missing Session");
    }

    const token = authHeader.split(' ')[1];
    const session = authProvider.validateToken(token);

    if (!session) {
        console.warn(`[AUTH] Invalid or expired token`);
        throw new Error("401 Unauthorized: Expired/Invalid Session");
    }

    // 2. Resolve User
    const user = getUserById(session.userId);
    if (!user) {
        throw new Error("404 User Not Found");
    }

    // 3. Resolve Workspace
    const targetWorkspaceId = workspaceId || session.activeWorkspaceId || user.defaultWorkspaceId;

    if (!targetWorkspaceId) {
        throw new Error("400 Bad Request: No Workspace Context Bound");
    }

    const workspace = getWorkspace(targetWorkspaceId);
    if (!workspace) {
        throw new Error("404 Workspace Not Found");
    }

    // 4. Validate Membership
    const memberRecord = workspace.members.find(m => m.userId === user.id);
    if (!memberRecord) {
        console.warn(`[AUTH] User ${user.id} attempted to access unowned workspace ${targetWorkspaceId}`);
        throw new Error("403 Forbidden: Not a Workspace Member");
    }

    // 5. Build Enterprise Billing Payload
    const plan = getPlanDetails(workspace.plan || workspace.planTier || 'free');

    // 6. Return Unified Context Box
    // Everything the pipeline needs to safely execute.
    return {
        user,
        workspace,
        role: memberRecord.role,
        plan,
        usage: {
            creditsRemaining: workspace.creditsRemaining,
            bulkRunsLeft: Math.max(0, plan.maxBulkRuns - (workspace.bulkRunsUsed || 0)),
            autopilotRunsLeft: Math.max(0, plan.maxAutopilotRuns - (workspace.autopilotRunsUsed || 0))
        },
        session
    };
}

module.exports = {
    resolveRequestContext
};
