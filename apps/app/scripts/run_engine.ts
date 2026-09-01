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
  const args = process.argv.slice(2);
  const summaryOnly = process.env.SLOGAN_BENCHMARK_SUMMARY === "1" || args.includes("--summary");
  const niche = args.filter((argument) => argument !== "--summary").join(" ").trim() || "Pickleball";
  const audience = process.env.SLOGAN_AUDIENCE?.trim() || undefined;
  const parseStringArrayEnv = (name: string): string[] => {
    const raw = process.env[name]?.trim();
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
        : [];
    } catch {
      throw new Error(`${name} must be a JSON string array`);
    }
  };
  const creativeDirection = process.env.SLOGAN_CREATIVE_DIRECTION?.trim() || undefined;
  const creativeExamples = parseStringArrayEnv("SLOGAN_CREATIVE_EXAMPLES_JSON");
  const negativeCreativeConstraints = parseStringArrayEnv("SLOGAN_NEGATIVE_CONSTRAINTS_JSON");
  const excludeSlogans = parseStringArrayEnv("SLOGAN_EXCLUSIONS_JSON");

  const result = await generateHighPotentialSlogans({
    niche,
    audience,
    creativeDirection,
    creativeExamples,
    negativeCreativeConstraints,
    excludeSlogans,
    execMode: "elite",
    context: "design_studio",
    cacheTtlSec: 0,
  });

  console.log(`Niche: ${niche}`);
  if (audience) console.log(`Audience: ${audience}`);
  console.log(`Evidence snapshot: ${result.evidenceSnapshotId ?? "unavailable"}`);
  console.log("Creative brief:", result.creativeDirection ?? "unavailable");
  const metrics = result.pipelineMetrics;
  const compositionRecovery = result.compositionRecovery;
  console.table([{
    profile: metrics?.profileStatus ?? (result.dynamicProfile ? "UNKNOWN" : "NOT_CREATED"),
    nicheStructure: result.dynamicProfile?.nicheComposition?.kind ?? "UNKNOWN",
    compositionType: result.dynamicProfile?.nicheComposition?.compositionType ?? "SINGLE",
    compositionConfidence: result.dynamicProfile?.nicheComposition?.compositionConfidence ?? "",
    secondaryComposition: result.dynamicProfile?.nicheComposition?.alternativeCompositionTypes?.[0]?.compositionType ?? "",
    territories: metrics?.territoryCount ?? result.creativeTerritories?.length ?? 0,
    expressionIntents: metrics?.eligibleExpressionIntentCount ?? result.expressionIntents?.length ?? 0,
    generated: metrics?.rawCandidateCount ?? 0,
    deduplicated: metrics?.deduplicatedCandidateCount ?? 0,
    compressed: metrics?.compressedCandidateCount ?? 0,
    eligibleFirstPass: metrics?.eligibleFirstPassCount ?? 0,
    recoveryAttempts: metrics?.recoveryAttemptCount ?? 0,
    eligibleFinal: metrics?.eligibleCount ?? 0,
    ranked: metrics?.rankedCount ?? result.ranked.length,
    expressionAssessed: metrics?.expressionAssessedCount ?? 0,
    expressionWorthy: metrics?.expressionWorthyCount ?? 0,
    expressionRecovery: metrics?.expressionRecoveryAttemptCount ?? 0,
    distinctConcepts: metrics?.distinctConceptCount ?? 0,
    error: result.error ?? "NONE",
    failureStage: result.failureStage ?? "NONE",
    secondaryAttemptUsed: compositionRecovery?.secondaryAttemptUsed ?? false,
    secondaryRanked: compositionRecovery?.secondaryRankedCount ?? 0,
    verifierBatches: metrics?.verifierBatchCount ?? 0,
    verifierFormatRepairs: metrics?.verifierFormatRepairAttemptCount ?? 0,
    verifierShapes: metrics?.verifierResponseShapes.join(" | ") ?? "",
  }]);
  if (metrics) console.log("Rejection dimensions:", metrics.rejectionReasonCounts);
  if (compositionRecovery) console.log("Composition recovery:", compositionRecovery);
  const failedDiagnostics = (result.diagnostics ?? []).filter((diagnostic) => !diagnostic.ok);
  if (failedDiagnostics.length > 0) console.log("Failed pipeline diagnostics:", failedDiagnostics);
  const intentDistribution = (result.expressionIntents ?? []).reduce<Record<string, number>>((counts, intent) => {
    counts[intent.intentType] = (counts[intent.intentType] ?? 0) + 1;
    return counts;
  }, {});
  console.log("Expression intent distribution:", intentDistribution);
  if (summaryOnly) {
    console.log("BENCHMARK_SUMMARY", JSON.stringify({
      niche,
      profile: metrics?.profileStatus ?? (result.dynamicProfile ? "UNKNOWN" : "NOT_CREATED"),
      nicheStructure: result.dynamicProfile?.nicheComposition?.kind ?? "UNKNOWN",
      compositionType: result.dynamicProfile?.nicheComposition?.compositionType ?? "SINGLE",
      compositionConfidence: result.dynamicProfile?.nicheComposition?.compositionConfidence ?? null,
      secondaryComposition: result.dynamicProfile?.nicheComposition?.alternativeCompositionTypes?.[0] ?? null,
      attemptedSecondaryComposition: compositionRecovery?.secondaryComposition ?? null,
      territoryCount: metrics?.territoryCount ?? result.creativeTerritories?.length ?? 0,
      expressionIntentCount: metrics?.eligibleExpressionIntentCount ?? result.expressionIntents?.length ?? 0,
      intentDistribution,
      generatedCount: metrics?.rawCandidateCount ?? 0,
      semanticSurvivors: metrics?.eligibleCount ?? 0,
      expressionWorthySurvivors: metrics?.expressionWorthyCount ?? 0,
      rankedCount: metrics?.rankedCount ?? result.ranked.length,
      dominantRejections: metrics?.rejectionReasonCounts ?? {},
      dominantExpressionFailures: compositionRecovery?.dominantExpressionFailures ?? [],
      primaryAttempt: compositionRecovery?.primary ?? null,
      secondaryAttemptUsed: compositionRecovery?.secondaryAttemptUsed ?? false,
      secondaryAttempt: compositionRecovery?.secondary ?? null,
      verifierBatches: metrics?.verifierBatchCount ?? 0,
      verifierFormatRepairAttempts: metrics?.verifierFormatRepairAttemptCount ?? 0,
      verifierResponseShapes: metrics?.verifierResponseShapes ?? [],
      rankedSample: result.ranked.slice(0, 5).map((entry) => entry.slogan),
      error: result.error ?? null,
      failureStage: result.failureStage ?? null,
    }));
    return;
  }
  console.table((result.expressionIntents ?? []).slice(0, 12).map((intent) => ({
    type: intent.intentType,
    humanMeaning: intent.humanMeaning,
    wearReason: intent.whySomeoneWouldWearThis,
    socialSignal: intent.socialSignal,
    confidence: intent.confidence,
  })));
  const expressionAssessments = result.expressionWorthiness ?? [];
  const diagnosticFloor = 60;
  const dimensionFailures = [
    "selfRecognition",
    "identityProjection",
    "insiderResonance",
    "conceptualTransformation",
    "naturalness",
    "wearability",
    "creativeConstraintAlignment",
  ].reduce<Record<string, number>>((counts, dimension) => {
    counts[dimension] = expressionAssessments.filter((assessment) => (
      Number(assessment[dimension as keyof typeof assessment]) < diagnosticFloor
    )).length;
    return counts;
  }, {});
  const traitDistribution = expressionAssessments
    .flatMap((assessment) => assessment.diagnosticTraits)
    .reduce<Record<string, number>>((counts, trait) => {
      counts[trait] = (counts[trait] ?? 0) + 1;
      return counts;
    }, {});
  console.log("Expression dimension failures (<60 diagnostic floor):", dimensionFailures);
  console.log("Expression trait distribution:", traitDistribution);
  const isWorthy = (assessment: (typeof expressionAssessments)[number]) => (
    assessment.expressionMode === "SYMBOLIC_EXPRESSION" &&
    assessment.score >= 60 &&
    assessment.conceptualTransformation >= 50 &&
    assessment.naturalness >= 60 &&
    assessment.wearability >= 60 &&
    assessment.creativeConstraintAlignment >= 60
  );
  const sample = (values: typeof expressionAssessments) => values.slice(0, 5).map((assessment) => ({
    slogan: assessment.slogan,
    mode: assessment.expressionMode,
    score: assessment.score,
    recognition: assessment.selfRecognition,
    identity: assessment.identityProjection,
    insider: assessment.insiderResonance,
    transformation: assessment.conceptualTransformation,
    naturalness: assessment.naturalness,
    wearability: assessment.wearability,
    alignment: assessment.creativeConstraintAlignment,
    traits: assessment.diagnosticTraits.join(" | "),
  }));
  console.log("Rejected decorative-description sample:");
  console.table(sample(expressionAssessments.filter((assessment) => assessment.expressionMode === "DECORATIVE_DESCRIPTION")));
  console.log("Semantically valid but expression-weak sample:");
  console.table(sample(expressionAssessments.filter((assessment) => assessment.expressionMode === "SYMBOLIC_EXPRESSION" && !isWorthy(assessment))));
  console.log("Expression-worthy sample:");
  console.table(sample(expressionAssessments.filter(isWorthy)));
  if (result.ranked.length === 0) {
    console.table((result.creativeTerritories ?? []).slice(0, 5).map((territory) => ({
      premise: territory.premise,
      humanTruth: territory.humanTruth,
      sharedPremise: territory.sharedPremise ?? "",
      dimensions: territory.dimensionCoverage.join(" | "),
    })));
    console.table((result.semanticEligibility ?? []).slice(0, 8).map((assessment) => ({
      slogan: assessment.slogan,
      truth: assessment.truthGrounding,
      product: assessment.productIndependence,
      intersection: assessment.intersectionIntegrity,
      sharedSupport: assessment.sharedPremiseSupport ?? "",
      dependence: assessment.mutualDependence ?? "",
      adjacencyRisk: assessment.adjacencyRisk ?? "",
      contextRisk: assessment.contextDependenceRisk ?? "",
      coherence: assessment.semanticCoherence,
      risk: assessment.unsupportedInferenceRisk,
      axes: assessment.axisGrounding.map((axis) => `${axis.axis}:${axis.grounding}`).join(" | "),
      reasons: assessment.reasons.join("; "),
    })));
  }
  console.table(
    result.ranked.slice(0, 10).map((entry) => ({
      slogan: entry.slogan,
      score: entry.score,
      family: entry.rhetoricalFamily,
      thumbnail: entry.thumbnailReadabilityScore,
      truth: entry.truthScore,
      recognition: entry.recognitionProbability,
      expression: entry.expressionWorthinessScore,
      identityProjection: entry.expressionWorthiness?.identityProjection,
      transformation: entry.expressionWorthiness?.conceptualTransformation,
      naturalness: entry.expressionWorthiness?.naturalness,
      wearability: entry.expressionWorthiness?.wearability,
      constraintAlignment: entry.expressionWorthiness?.creativeConstraintAlignment,
      concept: entry.expressionWorthiness?.conceptKey,
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
