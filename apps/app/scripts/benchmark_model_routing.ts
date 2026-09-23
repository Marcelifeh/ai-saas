import fs from "node:fs";
import path from "node:path";
import { randomUUID, randomInt, createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { withModelRouting, routeModel, legacyModels, type RoutingStrategy, type AITaskType } from "../lib/ai/modelRouting";
import { captureAIRun, aggregateAICalls } from "../lib/ai/aiTelemetry";
import { generateHighPotentialSlogans, type SloganEngineResult } from "../lib/ai/sloganEngine";
import { evaluateStructuralDerivativeness } from "../lib/ai/dynamicNicheProfile";

export const benchmarkCases = [
  "Pumpkin spice and fall coffee humor", "Oktoberfest Sourdough Enthusiasts", "Black Cats × Halloween",
  "Gym Lovers × Meal Preppers", "Ceramic Artists × Tea Ritualists", "Indoor Plant Collectors",
  "Queer Identity × Birdwatching", "Sunday Coffee Ritual × Crossword Solving", "Pottery",
];
const strategies: RoutingStrategy[] = ["CONTROL", "BALANCED_FIRST", "REASONING_HEAVY"];
const output = path.resolve(process.env.AI_BENCHMARK_OUTPUT || "artifacts/model-routing");
const mean = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
const rate = <T>(rows: T[], predicate: (row: T) => boolean) => rows.length ? rows.filter(predicate).length / rows.length : null;
export function benchmarkMetrics(result: SloganEngineResult) {
  const metrics = result.pipelineMetrics;
  const semantic = result.semanticEligibility ?? [], expression = result.expressionWorthiness ?? [];
  return {
    profileStatus: metrics?.profileStatus ?? "NOT_CREATED", composition: result.dynamicProfile?.nicheComposition ?? null,
    compositionConfidence: result.dynamicProfile?.nicheComposition?.compositionConfidence ?? null,
    territoryCount: metrics?.territoryCount ?? 0, eligibleIntentCount: metrics?.eligibleExpressionIntentCount ?? 0,
    generatedCount: metrics?.rawCandidateCount ?? 0, semanticSurvivors: metrics?.eligibleCount ?? 0,
    intersectionTransformSurvivors: null,
    expressionWorthySurvivors: metrics?.expressionWorthyCount ?? 0, rankedCount: result.ranked.length,
    secondaryRecoveryUsed: result.compositionRecovery?.secondaryAttemptUsed ?? false,
    compositionRecovery: result.compositionRecovery ?? null,
    semanticRecoveryAttempts: metrics?.recoveryAttemptCount ?? 0,
    expressionRecoveryAttempts: metrics?.expressionRecoveryAttemptCount ?? 0,
    generationExhausted: result.error === "GENERATION_EXHAUSTED", error: result.error ?? null,
    verifierStructuralFailures: result.error === "VERIFIER_INCOMPLETE" || result.error === "VERIFIER_FORMAT_FAILED" ? 1 : 0,
    repairAttempts: metrics?.verifierFormatRepairAttemptCount ?? 0,
    quality: {
      // No validated contamination label exists. Never substitute keyword heuristics.
      subcultureContaminationRate: null,
      unsupportedInferenceRate: rate(semantic, row => row.unsupportedInferenceRisk > 35),
      meanTruthGrounding: mean(semantic.map(row => row.truthGrounding)),
      metaDescriptionRate: rate(expression, row => row.diagnosticTraits.includes("META_DESCRIPTION") || (row.metaDescriptionRisk ?? 0) >= 50),
      categoryMashupCaptionRate: null,
      structuralDerivativeness: result.ranked.map(row => ({ slogan: row.slogan, assessment: evaluateStructuralDerivativeness(row.slogan) })),
      averageSelfRecognition: mean(expression.map(row => row.selfRecognition)),
      averageIdentityProjection: mean(expression.map(row => row.identityProjection)),
      averageConceptualTransformation: mean(expression.map(row => row.conceptualTransformation)),
      averageWearability: mean(expression.map(row => row.wearability)),
    },
  };
}
const save = (file: string, value: unknown) => fs.writeFileSync(path.join(output, file), JSON.stringify(value, null, 2));

async function worker() {
  const index = Number(process.env.AI_BENCHMARK_CASE), strategy = process.env.AI_BENCHMARK_STRATEGY as RoutingStrategy;
  if (!benchmarkCases[index] || !strategies.includes(strategy)) throw new Error("Invalid benchmark worker input");
  const fingerprint = createHash("sha256");
  for (const name of ["modelRouting.ts", "aiGateway.ts", "structuredVerifier.ts", "sloganEngine.ts", "dynamicNicheProfile.ts", "expressionWorthiness.ts"]) fingerprint.update(fs.readFileSync(path.resolve("lib/ai", name), "utf8"));
  const codeFingerprint = fingerprint.digest("hex");
  const captured = await captureAIRun(async () => {
    try { return await withModelRouting(strategy, () => generateHighPotentialSlogans({ niche: benchmarkCases[index], execMode: "elite", cacheTtlSec: 0 })); }
    catch { return null; }
  }, (runId, calls, durationMs) => save(`${index}-${strategy}.partial.json`, {
    benchmark: benchmarkCases[index], strategy, runId, codeFingerprint, calls,
    telemetry: aggregateAICalls(calls, durationMs), status: "IN_PROGRESS", candidates: [],
  }));
  const result = captured.result;
  save(`${index}-${strategy}.json`, { benchmark: benchmarkCases[index], strategy, scope: "authoritative_slogan_pipeline",
    codeFingerprint,
    runId: captured.runId, telemetry: captured.summary, calls: captured.calls,
    metrics: result ? benchmarkMetrics(result) : null,
    status: !result ? "TECHNICAL_FAILURE" : result.error ? (/VERIFIER|FAILED/.test(result.error) ? "TECHNICAL_FAILURE" : "CREATIVE_FAILURE") : "COMPLETED",
    candidates: result?.ranked.slice(0, 8).map(row => row.slogan) ?? [],
    evidenceContentHash: result?.evidenceContentHash ?? null,
  });
}

async function runChild(index: number, strategy: RoutingStrategy) {
  const timeout = Number(process.env.AI_BENCHMARK_TIMEOUT_MS || 300000);
  return new Promise<void>(resolve => {
    const child = spawn(process.execPath, [path.resolve("scripts/model_routing_runner.cjs"), "benchmark_model_routing", "--worker"], {
      cwd: process.cwd(), env: { ...process.env, AI_BENCHMARK_CASE: String(index), AI_BENCHMARK_STRATEGY: strategy, AI_BENCHMARK_OUTPUT: output },
      windowsHide: true, stdio: "ignore",
    });
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill(); }, timeout);
    child.once("exit", () => {
      clearTimeout(timer);
      const file = `${index}-${strategy}.json`;
      if (!fs.existsSync(path.join(output, file))) {
        const partialFile = path.join(output, `${index}-${strategy}.partial.json`);
        const partial = fs.existsSync(partialFile) ? JSON.parse(fs.readFileSync(partialFile, "utf8")) : {};
        save(file, { benchmark: benchmarkCases[index], strategy, metrics: null, telemetry: null, ...partial,
          status: "TECHNICAL_FAILURE", error: timedOut ? "PIPELINE_TIMEOUT" : "WORKER_FAILED", candidates: [], usageIncomplete: true, timeoutMs: timedOut ? timeout : null });
      }
      console.log(JSON.stringify({ benchmark: index + 1, strategy, status: JSON.parse(fs.readFileSync(path.join(output, file), "utf8")).status }));
      resolve();
    });
    child.once("error", () => { clearTimeout(timer); save(`${index}-${strategy}.json`, { benchmark: benchmarkCases[index], strategy, status: "TECHNICAL_FAILURE", error: "WORKER_START_FAILED", candidates: [] }); resolve(); });
  });
}

function exportReview() {
  // Existing identities and any human scores must never be regenerated by resume/export.
  if (fs.existsSync(path.join(output, "human-review.blinded.json"))) return;
  const rows: unknown[] = [], key: unknown[] = [];
  for (let index = 0; index < benchmarkCases.length; index++) {
    // Independently blind each pair; the public file never contains strategy/model names.
    for (const challenger of strategies.slice(1)) {
      const pairing = randomInt(2) ? ["CONTROL", challenger] : [challenger, "CONTROL"];
      const pairId = randomUUID();
      pairing.forEach((strategy, side) => {
        const file = path.join(output, `${index}-${strategy}.json`);
        if (!fs.existsSync(file)) return;
        const result = JSON.parse(fs.readFileSync(file, "utf8"));
        for (const candidate of result.candidates ?? []) {
          const id = randomUUID();
          rows.push({ id, pairId, benchmark: benchmarkCases[index], candidate, system: side ? "B" : "A", humanScore: { nicheTruth: null, selfRecognition: null, originality: null, naturalWearability: null, purchaseAppeal: null, overallPreference: null }, overallPreference: null, wouldChooseForShirt: null, expressionJudgment: null, reviewScale: "1–5 (higher is better)" });
          key.push({ id, strategy });
        }
      });
    }
  }
  save("human-review.blinded.json", rows);
  save("human-review.key.private.json", key);
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  if (process.argv.includes("--worker")) { await worker(); return; }
  if (process.argv.includes("--export-review")) { exportReview(); return; }
  if (process.argv.includes("--live")) {
    const jobs = benchmarkCases.flatMap((_, index) => strategies.map(strategy => ({ index, strategy })));
    const existing = jobs.filter(job => fs.existsSync(path.join(output, `${job.index}-${job.strategy}.json`)));
    if (existing.length && !process.argv.includes("--resume")) throw new Error("Use a fresh output directory or --resume to preserve benchmark artifacts");
    const pending = jobs.filter(job => !fs.existsSync(path.join(output, `${job.index}-${job.strategy}.json`)));
    const concurrency = Math.max(1, Math.min(3, Number(process.env.AI_BENCHMARK_CONCURRENCY || 1)));
    await Promise.all(Array.from({ length: concurrency }, async () => {
      while (pending.length) {
        const job = pending.shift();
        if (job) await runChild(job.index, job.strategy);
      }
    }));
    exportReview();
  } else {
    const tasks: AITaskType[] = ["EXTRACTION", "COMPOSITION_INFERENCE", "PROFILE_REASONING", "TERRITORY_GENERATION", "EXPRESSION_INTENT", "SLOGAN_GENERATION", "SEMANTIC_VERIFICATION", "INTERSECTION_VERIFICATION", "EXPRESSION_VERIFICATION", "RECOVERY"];
    const matrix = benchmarkCases.flatMap(benchmark => strategies.map(strategy => ({ benchmark, strategy,
      routes: withModelRouting(strategy, () => tasks.map(taskType => ({ taskType, ...routeModel({ taskType }, taskType === "SEMANTIC_VERIFICATION" ? legacyModels.utility : legacyModels.creative()) }))),
    })));
    save("matrix.offline.json", { status: "OFFLINE_POLICY_REPLAY", matrix, expectedRuns: 27, noQualityClaims: true });
    console.log("Offline routing matrix passed: 9 cases × 3 strategies. This replay tests policy only; use --live for quality measurements.");
  }
}
main().catch(() => { console.error("MODEL BENCHMARK FAILED"); process.exitCode = 1; });
