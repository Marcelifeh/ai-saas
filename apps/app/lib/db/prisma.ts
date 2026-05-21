// Use the package-local generated client so Windows builds do not rewrite
// the shared root node_modules Prisma engine during app prebuild.
import { PrismaClient } from "../../../../packages/db/generated/client";

const prismaClientSingleton = () => new PrismaClient();

declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma: ReturnType<typeof prismaClientSingleton> =
    globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
