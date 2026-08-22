/* eslint-disable no-console */
const fs = require("fs");
const Module = require("module");
const path = require("path");
const tsconfigPaths = require("tsconfig-paths");

// The script is commonly invoked from the monorepo root. Register the app's
// existing alias contract before loading any application modules.
tsconfigPaths.register({
  baseUrl: path.resolve(__dirname, ".."),
  paths: { "@/*": ["./*"] },
});

// Load local environment values before importing the server-only AI modules.
try {
  const envPaths = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../.env.local"),
    path.resolve(__dirname, "../.env"),
  ];
  const envPath = envPaths.find((candidate: string) => fs.existsSync(candidate));
  if (envPath) {
    const raw = fs.readFileSync(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
} catch {
  // Environment loading is best-effort; the app schema reports missing values.
}

const originalModuleLoad = Module._load;
Module._load = function patchedModuleLoad(request: string, parent: unknown, isMain: boolean) {
  if (request === "server-only") return {};
  return originalModuleLoad.call(this, request, parent, isMain);
};

async function main() {
  const { generateHighPotentialSlogans } = await import("../lib/ai/sloganEngine");
  const niche = process.argv.slice(2).join(" ").trim() || "Pickleball";
  const audience = process.env.SLOGAN_AUDIENCE?.trim() || undefined;

  const result = await generateHighPotentialSlogans({
    niche,
    audience,
    execMode: "elite",
    context: "design_studio",
    cacheTtlSec: 0,
  });

  console.log(`Niche: ${niche}`);
  if (audience) console.log(`Audience: ${audience}`);
  console.log(`Evidence snapshot: ${result.evidenceSnapshotId ?? "unavailable"}`);
  console.log(`Creative territories: ${result.creativeTerritories?.length ?? 0}`);
  console.log(`Eligible candidates: ${result.semanticEligibility?.filter((item) => item.eligible).length ?? 0}`);
  console.table(
    result.ranked.slice(0, 12).map((entry) => ({
      slogan: entry.slogan,
      score: entry.score,
      family: entry.rhetoricalFamily,
      thumbnail: entry.thumbnailReadabilityScore,
      truth: entry.truthScore,
      recognition: entry.recognitionProbability,
    })),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
