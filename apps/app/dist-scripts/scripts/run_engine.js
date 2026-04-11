"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
const fs = require("fs");
const path = require("path");
// Load .env and .env.local from repo root into process.env
const envPaths = [
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(process.cwd(), "../../.env.local"),
    path.resolve(__dirname, "../../../../.env"),
    path.resolve(__dirname, "../../../../.env.local")
];

for (const envPath of envPaths) {
    try {
        if (fs.existsSync(envPath)) {
            const raw = fs.readFileSync(envPath, "utf8");
            for (const line of raw.split(/\r?\n/)) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith("#"))
                    continue;
                const eq = trimmed.indexOf("=");
                if (eq === -1)
                    continue;
                const key = trimmed.slice(0, eq).trim();
                let val = trimmed.slice(eq + 1).trim();
                if (val.startsWith("\"") && val.endsWith("\""))
                    val = val.slice(1, -1);
                process.env[key] = val; // Force overwrite
            }
        }
    } catch (e) {
        // ignore
    }
}
async function main() {
    // import after env is loaded
    // dynamic import so ESM loader and ts-node/esm handle the module correctly
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const engine = await Promise.resolve().then(() => __importStar(require("../lib/ai/sloganEngine")));
    const { generateHighPotentialSlogans, generateDynamicSlogans, expandPatternFamilies, buildFromPatterns } = engine;
    const niche = process.argv[2] || "Pickleball";
    const audience = "players";
    if (process.env.OPENAI_API_KEY) {
        console.log("OPENAI_API_KEY detected — running full elite pipeline (live LLM)");
        const res = await generateHighPotentialSlogans({ niche, audience, execMode: "elite", cacheTtlSec: 0 });
        console.log("Top slogans:", res.slogans);
        if (res.ranked && res.ranked.length > 0) {
            console.log("Top ranked (head):");
            console.table(res.ranked.slice(0, 12).map((r) => ({ slogan: r.slogan, score: r.score, bucket: r.bucket })));
        }
        return;
    }
    console.log("OPENAI_API_KEY not set — running mock pipeline to exercise pattern expansion flow.");
    const base = generateDynamicSlogans({ niche, audience, mode: "viral" });
    console.log(`Base generated candidates (${base.length}):`);
    console.table(base.slice(0, 20).map((s) => ({ slogan: s })));
    // Try expandPatternFamilies — will return [] without key; use mock patterns as fallback
    let patterns = await expandPatternFamilies(niche, 6).catch(() => []);
    if (!patterns || patterns.length === 0) {
        patterns = [
            "[ANCHOR] Rules Apply",
            "Dink Responsibly",
            "Just One More Game",
            "Kitchen Violator",
            "Serve First Talk Later",
            "Sorry I Was Serving",
        ];
    }
    console.log("Pattern templates:", patterns);
    const expanded = buildFromPatterns(patterns, niche);
    console.log(`Expanded candidates from patterns (${expanded.length}):`);
    console.table(expanded.slice(0, 30).map((s) => ({ slogan: s })));
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
