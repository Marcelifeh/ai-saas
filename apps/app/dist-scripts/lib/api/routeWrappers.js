"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWorkspaceAuth = withWorkspaceAuth;
exports.withWorkerOrWorkspaceAuth = withWorkerOrWorkspaceAuth;
exports.requireWorkspaceMembership = requireWorkspaceMembership;
exports.withRateLimit = withRateLimit;
exports.withUsageGuard = withUsageGuard;
const server_1 = require("next/server");
const jwt_1 = require("next-auth/jwt");
const prisma_1 = require("../../lib/db/prisma");
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET environment variable is required in production.");
}
/**
 * Retrieves the JWT token from the request cookies.
 * getToken is more reliable than getServerSession in App Router route handlers
 * because it reads the cookie directly from the incoming request object.
 */
async function getAuthToken(req) {
    try {
        const token = await (0, jwt_1.getToken)({
            req: req,
            secret: NEXTAUTH_SECRET,
            secureCookie: process.env.NODE_ENV === "production",
        });
        if (!token)
            return null;
        // Shape it to match the session.user interface the rest of the code expects
        return {
            user: {
                id: token.sub,
                name: token.name,
                email: token.email,
                image: token.picture,
            },
        };
    }
    catch {
        return null;
    }
}
/**
 * Ensures the caller is authenticated and attaches the NextAuth session.
 * Workspace membership enforcement can be layered on later from this single point.
 */
function withWorkspaceAuth(handler) {
    return async function wrapped(req) {
        const session = await getAuthToken(req);
        if (!session) {
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        return handler({ req, session });
    };
}
function hasValidWorkerSecret(req) {
    const configuredSecret = process.env.WORKER_SECRET;
    if (!configuredSecret)
        return false;
    return req.headers.get("x-worker-secret") === configuredSecret;
}
function withWorkerOrWorkspaceAuth(handler) {
    return async function wrapped(req) {
        if (hasValidWorkerSecret(req)) {
            return handler({
                req,
                session: {
                    isWorker: true,
                    user: {
                        id: "system",
                        name: "Autopilot Worker",
                    },
                },
            });
        }
        const session = await getAuthToken(req);
        if (!session) {
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        return handler({ req, session });
    };
}
async function requireWorkspaceMembership(userId, workspaceId) {
    if (!userId) {
        return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const membership = await prisma_1.prisma.workspaceMember.findFirst({
        where: {
            userId,
            workspaceId,
        },
    });
    if (!membership) {
        return server_1.NextResponse.json({ success: false, error: "Workspace access denied" }, { status: 403 });
    }
    return null;
}
/**
 * Placeholder rate limit wrapper. In Phase 1 it is a no-op, but centralizing here
 * allows a future implementation (IP/workspace based) without touching all routes.
 */
function withRateLimit(handler) {
    return async function wrapped(req) {
        const session = await getAuthToken(req);
        if (!session) {
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        // TODO: Implement per-user/workspace rate limiting.
        return handler({ req, session });
    };
}
/**
 * Placeholder usage/plan guard. Currently passes through but will enforce
 * workspace plans and quotas in a later phase.
 */
function withUsageGuard(handler) {
    return async function wrapped(req) {
        const session = await getAuthToken(req);
        if (!session) {
            return server_1.NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        // TODO: Check workspace plan & usage before allowing the call.
        return handler({ req, session });
    };
}
