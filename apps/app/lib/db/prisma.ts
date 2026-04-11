// Use @prisma/client directly. The generated client lives at the monorepo root
// node_modules because prisma generate was run from the root workspace.
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => new PrismaClient();

declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma: ReturnType<typeof prismaClientSingleton> =
    globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
