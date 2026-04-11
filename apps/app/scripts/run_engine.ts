const fs = require("fs");
const path = require("path");

// Load .env from repo root into process.env (lightweight loader so no extra deps required)
try {
  const rootEnv = path.resolve(__dirname, "../../.env");
  if (fs.existsSync(rootEnv)) {
    const raw = fs.readFileSync(rootEnv, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (val.startsWith("\"") && val.endsWith("\"")) val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
} catch (e) {
  // non-blocking
}

async function main() {
  // import after env is loaded
  // dynamic import so ESM loader and ts-node/esm handle the module correctly
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const engine = await import("../lib/ai/sloganEngine");
  const { generateHighPotentialSlogans, generateDynamicSlogans, expandPatternFamilies, buildFromPatterns } = engine;
  const niche = process.argv[2] || "Pickleball";
  const audience = "players";

  if (process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY detected — running full elite pipeline (live LLM)");
    const res = await generateHighPotentialSlogans({ niche, audience, execMode: "elite", cacheTtlSec: 0 } as any);
    console.log("Top slogans:", res.slogans);
    if (res.ranked && res.ranked.length > 0) {
      console.log("Top ranked (head):");
      console.table(res.ranked.slice(0, 12).map((r: any) => ({ slogan: r.slogan, score: r.score, bucket: r.bucket })));
    }
    return;
  }

  console.log("OPENAI_API_KEY not set — running mock pipeline to exercise pattern expansion flow.");
  const base = generateDynamicSlogans({ niche, audience, mode: "viral" } as any);
  console.log(`Base generated candidates (${base.length}):`);
  console.table(base.slice(0, 20).map((s: any) => ({ slogan: s })));

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
  console.table(expanded.slice(0, 30).map((s: any) => ({ slogan: s })));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
