"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// Note: removed Next's `server-only` import for script/runtime compatibility.
let db = null;
try {
    // Prefer the monorepo package when available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    db = require("@trendforge/db").prisma;
}
catch (e) {
    // Fallback: lightweight mock to allow script execution when the monorepo
    // package isn't installed. Methods return empty results for non-blocking runs.
    db = {
        sloganPattern: {
            findMany: async () => [],
            findUnique: async () => null,
            upsert: async () => null,
            create: async () => null,
        },
        sloganPerformance: {
            findMany: async () => [],
        },
        marketSignal: {
            findFirst: async () => null,
            create: async () => null,
        },
    };
}
// Re-export the monorepo prisma instance (or fallback mock) for local imports.
exports.prisma = db;
