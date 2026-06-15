import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { env } from "@/env";
import { prisma } from "@/lib/db/prisma";

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (err && typeof err === "object" && "message" in err && typeof (err as { message?: unknown }).message === "string") {
        return (err as { message: string }).message;
    }
    return "Unknown auth persistence error";
}

function isPrismaConnectionError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const maybe = err as { code?: string; message?: string };
    return maybe.code === "P1001" || (typeof maybe.message === "string" && maybe.message.includes("Can't reach database server"));
}

async function ensureUserAndWorkspace(user: { email?: string | null; name?: string | null; image?: string | null }) {
    if (!user.email) return null;

    const dbUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
        },
        create: {
            email: user.email,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
        },
    });

    const workspaceId = `ws_${dbUser.id}`;
    await prisma.workspace.upsert({
        where: { id: workspaceId },
        update: {},
        create: {
            id: workspaceId,
            name: `${dbUser.name || "My"} Workspace`,
            ownerId: dbUser.id,
        },
    });

    const existingMember = await prisma.workspaceMember.findFirst({
        where: {
            userId: dbUser.id,
            workspaceId,
        },
    });

    if (!existingMember) {
        await prisma.workspaceMember.create({
            data: {
                userId: dbUser.id,
                workspaceId,
                role: "owner",
            },
        });
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
                const message = getErrorMessage(err);
                if (isPrismaConnectionError(err) && process.env.NODE_ENV !== "production") {
                    console.warn("auth_persistence_unavailable", {
                        email: user.email,
                        reason: message,
                        note: "Allowing local sign-in; start the database to persist users and workspaces.",
                    });
                    return true;
                }

                console.error("auth_sign_in_persistence_failed", {
                    email: user.email,
                    reason: message,
                });
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
                const message = getErrorMessage(err);
                if (isPrismaConnectionError(err) && process.env.NODE_ENV !== "production") {
                    console.warn("auth_jwt_persistence_unavailable", {
                        email: user?.email ?? token.email,
                        reason: message,
                        note: "Keeping the JWT session alive without refreshing database-backed user metadata.",
                    });
                    token.sub = token.sub ?? user?.id ?? token.email ?? undefined;
                    return token;
                }

                throw err;
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
