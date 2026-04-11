"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerEnv = getServerEnv;
exports.hasServerEnv = hasServerEnv;
// server-only removed for script runtime
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const ENV_CACHE_TTL_MS = 60 * 1000;
let cachedEnvFile = null;
function getCandidateEnvPaths() {
    const cwd = process.cwd();
    return [
        node_path_1.default.join(cwd, ".env.local"),
        node_path_1.default.join(cwd, ".env"),
        node_path_1.default.join(cwd, "apps", "app", ".env.local"),
        node_path_1.default.join(cwd, "apps", "app", ".env"),
    ].filter((value, index, list) => list.indexOf(value) === index);
}
function normalizeEnvValue(rawValue) {
    const trimmed = rawValue.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"'))
        || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}
function parseEnvFile(envText) {
    const values = {};
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
function readEnvFileValues() {
    if (cachedEnvFile && cachedEnvFile.expiresAt > Date.now()) {
        return cachedEnvFile.values;
    }
    for (const envPath of getCandidateEnvPaths()) {
        try {
            if (!node_fs_1.default.existsSync(envPath)) {
                continue;
            }
            const values = parseEnvFile(node_fs_1.default.readFileSync(envPath, "utf8"));
            cachedEnvFile = {
                expiresAt: Date.now() + ENV_CACHE_TTL_MS,
                values,
            };
            return values;
        }
        catch {
            continue;
        }
    }
    cachedEnvFile = {
        expiresAt: Date.now() + ENV_CACHE_TTL_MS,
        values: {},
    };
    return cachedEnvFile.values;
}
function getServerEnv(name) {
    const directValue = process.env[name]?.trim();
    if (directValue) {
        return directValue;
    }
    const fallbackValue = readEnvFileValues()[name];
    return fallbackValue?.trim() || undefined;
}
function hasServerEnv(name) {
    return Boolean(getServerEnv(name));
}
