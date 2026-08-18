"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// Use the package-local generated client so Windows builds do not rewrite
// the shared root node_modules Prisma engine during app prebuild.
const client_1 = require("../../../../packages/db/generated/client");
const prismaClientSingleton = () => new client_1.PrismaClient();
exports.prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = exports.prisma;
