import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET environment variable is required in production.");
}

/**
 * Retrieves the JWT token from the request cookies.
 * getToken is more reliable than getServerSession in App Router route handlers
 * because it reads the cookie directly from the incoming request object.
 */
async function getAuthToken(req: NextRequest | Request) {
    try {
        const token = await getToken({
            req: req as NextRequest,
            secret: NEXTAUTH_SECRET,
            secureCookie: process.env.NODE_ENV === "production",
        });
        if (!token) return null;
        // Shape it to match the session.user interface the rest of the code expects
        return {
            user: {
                id: token.sub as string | undefined,
                name: token.name as string | undefined,
                email: token.email as string | undefined,
                image: token.picture as string | undefined,
            },
        };
    } catch {
        return null;
    }
}

// Basic shape of the context passed into wrapped handlers
export interface RouteContext {
    req: NextRequest | Request;
    session: any;
}

export type AuthedHandler = (ctx: RouteContext) => Promise<Response> | Response;

/**
 * Ensures the caller is authenticated and attaches the NextAuth session.
 * Workspace membership enforcement can be layered on later from this single point.
 */
export function withWorkspaceAuth(handler: AuthedHandler) {
    return async function wrapped(req: NextRequest | Request): Promise<Response> {
        const session = await getAuthToken(req);
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        return handler({ req, session });
    };
}

export type GuardedHandler = (ctx: RouteContext) => Promise<Response> | Response;

/**
 * Placeholder rate limit wrapper. In Phase 1 it is a no-op, but centralizing here
 * allows a future implementation (IP/workspace based) without touching all routes.
 */
export function withRateLimit(handler: GuardedHandler) {
    return async function wrapped(req: NextRequest | Request): Promise<Response> {
        // TODO: Implement per-user/workspace rate limiting.
        return handler({ req, session: await getAuthToken(req) });
    };
}

/**
 * Placeholder usage/plan guard. Currently passes through but will enforce
 * workspace plans and quotas in a later phase.
 */
export function withUsageGuard(handler: GuardedHandler) {
    return async function wrapped(req: NextRequest | Request): Promise<Response> {
        const session = await getAuthToken(req);
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // TODO: Check workspace plan & usage before allowing the call.
        return handler({ req, session });
    };
}
