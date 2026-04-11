import "server-only";
import fs from "node:fs";
import path from "node:path";

type CacheEntry = {
    expiresAt: number;
    values: Record<string, string>;
};

const ENV_CACHE_TTL_MS = 60 * 1000;
let cachedEnvFile: CacheEntry | null = null;

function getCandidateEnvPaths(): string[] {
    const cwd = process.cwd();

    return [
        path.join(cwd, ".env.local"),
        path.join(cwd, ".env"),
        path.join(cwd, "apps", "app", ".env.local"),
        path.join(cwd, "apps", "app", ".env"),
    ].filter((value, index, list) => list.indexOf(value) === index);
}

function normalizeEnvValue(rawValue: string): string {
    const trimmed = rawValue.trim();

    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"'))
        || (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
}

function parseEnvFile(envText: string): Record<string, string> {
    const values: Record<string, string> = {};

    for (const line of envText.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }

        const separatorIndex = trimmed.indexOf("=");
        if (separatorIndex <= 0) {
            continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        const rawValue = trimmed.slice(separatorIndex + 1);
        if (!key) {
            continue;
        }

        values[key] = normalizeEnvValue(rawValue);
    }

    return values;
}

function readEnvFileValues(): Record<string, string> {
    if (cachedEnvFile && cachedEnvFile.expiresAt > Date.now()) {
        return cachedEnvFile.values;
    }

    for (const envPath of getCandidateEnvPaths()) {
        try {
            if (!fs.existsSync(envPath)) {
                continue;
            }

            const values = parseEnvFile(fs.readFileSync(envPath, "utf8"));
            cachedEnvFile = {
                expiresAt: Date.now() + ENV_CACHE_TTL_MS,
                values,
            };
            return values;
        } catch {
            continue;
        }
    }

    cachedEnvFile = {
        expiresAt: Date.now() + ENV_CACHE_TTL_MS,
        values: {},
    };

    return cachedEnvFile.values;
}

export function getServerEnv(name: string): string | undefined {
    const directValue = process.env[name]?.trim();
    if (directValue) {
        return directValue;
    }

    const fallbackValue = readEnvFileValues()[name];
    return fallbackValue?.trim() || undefined;
}

export function hasServerEnv(name: string): boolean {
    return Boolean(getServerEnv(name));
}