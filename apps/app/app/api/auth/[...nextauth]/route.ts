import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export { authOptions };

export function auth() {
    return getServerSession(authOptions);
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
