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
  const metrics = result.pipelineMetrics;
  console.table([{
    profile: metrics?.profileStatus ?? (result.dynamicProfile ? "UNKNOWN" : "NOT_CREATED"),
    nicheStructure: result.dynamicProfile?.nicheComposition?.kind ?? "UNKNOWN",
    territories: metrics?.territoryCount ?? result.creativeTerritories?.length ?? 0,
    generated: metrics?.rawCandidateCount ?? 0,
    deduplicated: metrics?.deduplicatedCandidateCount ?? 0,
    compressed: metrics?.compressedCandidateCount ?? 0,
    eligibleFirstPass: metrics?.eligibleFirstPassCount ?? 0,
    recoveryAttempts: metrics?.recoveryAttemptCount ?? 0,
    eligibleFinal: metrics?.eligibleCount ?? 0,
    ranked: metrics?.rankedCount ?? result.ranked.length,
    error: result.error ?? "NONE",
  }]);
  if (metrics) console.log("Rejection dimensions:", metrics.rejectionReasonCounts);
  if (result.ranked.length === 0) {
    console.table((result.creativeTerritories ?? []).slice(0, 5).map((territory) => ({
      premise: territory.premise,
      humanTruth: territory.humanTruth,
      dimensions: territory.dimensionCoverage.join(" | "),
    })));
    console.table((result.semanticEligibility ?? []).slice(0, 8).map((assessment) => ({
      slogan: assessment.slogan,
      truth: assessment.truthGrounding,
      product: assessment.productIndependence,
      intersection: assessment.intersectionIntegrity,
      coherence: assessment.semanticCoherence,
      risk: assessment.unsupportedInferenceRisk,
      axes: assessment.axisGrounding.map((axis) => `${axis.axis}:${axis.grounding}`).join(" | "),
      reasons: assessment.reasons.join("; "),
    })));
  }
  console.table(
    result.ranked.slice(0, 5).map((entry) => ({
      slogan: entry.slogan,
      score: entry.score,
      family: entry.rhetoricalFamily,
      thumbnail: entry.thumbnailReadabilityScore,
      truth: entry.truthScore,
      recognition: entry.recognitionProbability,
      axes: result.semanticEligibility
        ?.find((assessment) => assessment.slogan === entry.slogan)
        ?.axisGrounding.map((axis) => `${axis.axis}:${axis.grounding}`).join(" | ") ?? "",
    })),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
