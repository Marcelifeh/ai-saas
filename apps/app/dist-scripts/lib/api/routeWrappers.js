"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWorkspaceAuth = withWorkspaceAuth;
exports.withRateLimit = withRateLimit;
exports.withUsageGuard = withUsageGuard;
const server_1 = require("next/server");
const route_1 = require("../../app/api/auth/[...nextauth]/route");
/**
 * Ensures the caller is authenticated and attaches the NextAuth session.
 * Workspace membership enforcement can be layered on later from this single point.
 */
function withWorkspaceAuth(handler) {
    return async function wrapped(req) {
        const session = await (0, route_1.auth)();
        if (!session) {
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        return handler({ req, session });
    };
}
/**
 * Placeholder rate limit wrapper. In Phase 1 it is a no-op, but centralizing here
 * allows a future implementation (IP/workspace based) without touching all routes.
 */
function withRateLimit(handler) {
    return async function wrapped(req) {
        // TODO: Implement per-user/workspace rate limiting.
        return handler({ req, session: await (0, route_1.auth)() });
    };
}
/**
 * Placeholder usage/plan guard. Currently passes through but will enforce
 * workspace plans and quotas in a later phase.
 */
function withUsageGuard(handler) {
    return async function wrapped(req) {
        const session = await (0, route_1.auth)();
        if (!session) {
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        // TODO: Check workspace plan & usage before allowing the call.
        return handler({ req, session });
    };
}
