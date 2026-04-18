import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { env } from "@/env";

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
