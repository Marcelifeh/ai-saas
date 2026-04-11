import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().optional(),
    DIRECT_URL: z.string().optional(),
    NEXTAUTH_SECRET: z.string().optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    OPENAI_API_KEY: z.string().optional(),

    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    SERPAPI_API_KEY: z.string().optional(),

    REDIS_URL: z.string().optional(),
    USE_QUEUE: z.string().optional(),
});

export const env = envSchema.parse(process.env);
