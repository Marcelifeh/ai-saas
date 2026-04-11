"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().optional(),
    DIRECT_URL: zod_1.z.string().optional(),
    NEXTAUTH_SECRET: zod_1.z.string().optional(),
    NEXTAUTH_URL: zod_1.z.string().url().optional(),
    OPENAI_API_KEY: zod_1.z.string().optional(),
    GOOGLE_CLIENT_ID: zod_1.z.string().optional(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().optional(),
    GITHUB_CLIENT_ID: zod_1.z.string().optional(),
    GITHUB_CLIENT_SECRET: zod_1.z.string().optional(),
    SERPAPI_API_KEY: zod_1.z.string().optional(),
    REDIS_URL: zod_1.z.string().optional(),
    USE_QUEUE: zod_1.z.string().optional(),
});
exports.env = envSchema.parse(process.env);
