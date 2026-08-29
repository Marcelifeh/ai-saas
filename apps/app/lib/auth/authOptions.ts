import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { env } from "@/env";
import { prisma } from "@/lib/db/prisma";

type AuthPersistenceStep = "user_upsert" | "workspace_upsert" | "membership_lookup" | "membership_create";

class AuthPersistenceError extends Error {
    readonly step: AuthPersistenceStep;
    readonly originalError: unknown;

    constructor(step: AuthPersistenceStep, originalError: unknown) {
        super(`Authentication persistence failed during ${step}`);
        this.name = "AuthPersistenceError";
        this.step = step;
        this.originalError = originalError;
    }
}

function persistenceErrorDetails(err: unknown) {
    const step = err instanceof AuthPersistenceError ? err.step : "unknown";
    const originalError = err instanceof AuthPersistenceError ? err.originalError : err;
    const candidate = originalError && typeof originalError === "object"
        ? originalError as { code?: unknown; name?: unknown; message?: unknown }
        : {};
    const prismaCode = typeof candidate.code === "string" ? candidate.code : "unknown";
    const errorName = typeof candidate.name === "string" ? candidate.name : "UnknownError";
    const message = typeof candidate.message === "string" ? candidate.message : "";

    let category = "database_unknown";
    if (prismaCode === "P1000" || message.includes("Authentication failed")) category = "database_authentication";
    else if (prismaCode === "P1001" || message.includes("Can't reach database server")) category = "database_unreachable";
    else if (prismaCode === "P1002" || /timed? out/i.test(message)) category = "database_timeout";
    else if (prismaCode === "P1003") category = "database_missing";
    else if (prismaCode === "P2021") category = "database_table_missing";
    else if (prismaCode === "P2022") category = "database_column_missing";

    return { step, category, errorName, prismaCode };
}

function isPrismaConnectionError(err: unknown): boolean {
    return persistenceErrorDetails(err).category === "database_unreachable";
}

async function persistStep<T>(step: AuthPersistenceStep, operation: () => Promise<T>): Promise<T> {
    try {
        return await operation();
    } catch (err: unknown) {
        throw new AuthPersistenceError(step, err);
    }
}

async function ensureUserAndWorkspace(user: { email?: string | null; name?: string | null; image?: string | null }) {
    if (!user.email) return null;
    const email = user.email;

    const dbUser = await persistStep("user_upsert", () => prisma.user.upsert({
        where: { email },
        update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
        },
        create: {
            email,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
        },
    }));

    const workspaceId = `ws_${dbUser.id}`;
    await persistStep("workspace_upsert", () => prisma.workspace.upsert({
        where: { id: workspaceId },
        update: {},
        create: {
            id: workspaceId,
            name: `${dbUser.name || "My"} Workspace`,
            ownerId: dbUser.id,
        },
    }));

    const existingMember = await persistStep("membership_lookup", () => prisma.workspaceMember.findFirst({
        where: {
            userId: dbUser.id,
            workspaceId,
        },
    }));

    if (!existingMember) {
        await persistStep("membership_create", () => prisma.workspaceMember.create({
            data: {
                userId: dbUser.id,
                workspaceId,
                role: "owner",
            },
        }));
    }

    return dbUser;
}

export const authOptions: NextAuthOptions = {
    providers: [
        ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? [GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        })] : []),
        ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET ? [GithubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        })] : []),
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;
            try {
                await ensureUserAndWorkspace(user);
            } catch (err: unknown) {
                const details = persistenceErrorDetails(err);
                if (isPrismaConnectionError(err) && process.env.NODE_ENV !== "production") {
                    console.warn("auth_persistence_unavailable", {
                        ...details,
                        note: "Allowing local sign-in; start the database to persist users and workspaces.",
                    });
                    return true;
                }

                console.error("auth_sign_in_persistence_failed", details);
                return false;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (!user && token.sub) {
                return token;
            }

            try {
                const dbUser = await ensureUserAndWorkspace({
                    email: user?.email ?? token.email,
                    name: user?.name ?? token.name,
                    image: user?.image ?? token.picture,
                });

                if (dbUser) {
                    token.sub = dbUser.id;
                }
            } catch (err: unknown) {
                const details = persistenceErrorDetails(err);
                if (isPrismaConnectionError(err) && process.env.NODE_ENV !== "production") {
                    console.warn("auth_jwt_persistence_unavailable", {
                        ...details,
                        note: "Keeping the JWT session alive without refreshing database-backed user metadata.",
                    });
                    token.sub = token.sub ?? user?.id ?? token.email ?? undefined;
                    return token;
                }

                console.error("auth_jwt_persistence_failed", details);
                throw new Error(`Authentication persistence failed during ${details.step}`);
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-expect-error - next-auth default Session type does not declare user.id
                session.user.id = token.sub;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};
