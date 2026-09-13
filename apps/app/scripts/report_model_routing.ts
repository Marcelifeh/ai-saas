import fs from "node:fs";
import path from "node:path";
import { estimateModelCost, readModelPricing } from "../lib/ai/modelPricing";

const folder = path.resolve(process.env.AI_BENCHMARK_OUTPUT || "artifacts/model-routing-live");
const files = fs.readdirSync(folder).filter(file => /^\d+-(?:CONTROL|BALANCED_FIRST|REASONING_HEAVY)\.json$/.test(file));
const results = files.map(file => ({ ...JSON.parse(fs.readFileSync(path.join(folder, file), "utf8")), file }));
const pricing = readModelPricing();
const round = (value: number | null) => value === null ? "unmeasured" : String(Math.round(value * 1000) / 1000);
const average = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
const cost = (result: any): number | null => {
  if (!Array.isArray(result.calls)) return null;
  if (result.calls.some((call: any) => call.usageReported === false || (!call.success && call.inputTokens === 0 && call.outputTokens === 0))) return null;
  const values = result.calls.map((call: any) => estimateModelCost(call.modelName, call.inputTokens, call.outputTokens, call.cachedInputTokens, pricing));
  return values.some((value: number | null) => value === null) ? null : values.reduce((a: number, b: number) => a + b, 0);
};
const strategies = ["CONTROL", "BALANCED_FIRST", "REASONING_HEAVY"];
const comparisons = results.filter(result => result.strategy !== "CONTROL").map(result => {
  const control = results.find(row => row.benchmark === result.benchmark && row.strategy === "CONTROL");
  const delta = (a: number | null | undefined, b: number | null | undefined) => a == null || b == null ? null : a - b;
  return { benchmark: result.benchmark, strategy: result.strategy,
    sameEvidence: !!control && control.evidenceContentHash === result.evidenceContentHash,
    bothCompleted: !!control && control.status === "COMPLETED" && result.status === "COMPLETED",
    costDeltaUSD: control ? delta(cost(result), cost(control)) : null,
    latencyDeltaMs: delta(result.telemetry?.pipelineDurationMs, control?.telemetry?.pipelineDurationMs),
    aiCallDelta: delta(result.telemetry?.totalAICalls, control?.telemetry?.totalAICalls),
    qualityDeltas: Object.fromEntries(["unsupportedInferenceRate", "metaDescriptionRate", "categoryMashupCaptionRate", "meanTruthGrounding", "averageSelfRecognition", "averageIdentityProjection", "averageConceptualTransformation", "averageWearability"].map(key => [key, delta(result.metrics?.quality?.[key], control?.metrics?.quality?.[key])])),
  };
});
const summary = { attemptedRuns: results.length, expectedRuns: 27, acceptance: "NOT SAFE TO DEPLOY",
  humanPreference: null, contamination: null, pricingSnapshot: pricing, comparisons,
  strategies: strategies.map(strategy => {
    const rows = results.filter(result => result.strategy === strategy);
    return { strategy, runs: rows.length, completed: rows.filter(row => row.status === "COMPLETED").length,
      technicalFailures: rows.filter(row => row.status === "TECHNICAL_FAILURE").length,
      creativeFailures: rows.filter(row => row.status === "CREATIVE_FAILURE").length,
      meanCostUSD: average(rows.filter(row => row.status === "COMPLETED").map(cost).filter((value): value is number => value !== null)),
      meanDurationMs: average(rows.filter(row => row.status === "COMPLETED").map(row => row.telemetry?.pipelineDurationMs).filter((value): value is number => typeof value === "number")),
      meanAICalls: average(rows.filter(row => row.status === "COMPLETED").map(row => row.telemetry?.totalAICalls).filter((value): value is number => typeof value === "number")),
      formatRepairs: rows.reduce((sum, row) => sum + (row.telemetry?.repairAttempts ?? 0), 0),
      ranked: rows.reduce((sum, row) => sum + (row.metrics?.rankedCount ?? 0), 0),
    };
  }),
};
fs.writeFileSync(path.join(folder, "comparison.json"), JSON.stringify(summary, null, 2));
const lines = ["# CONTROL / challenger benchmark results", "", "**NOT SAFE TO DEPLOY.** Human scoring and release acceptance are incomplete. More survivors are not proof of better quality.", "",
  `${results.length}/27 runs have artifacts. Prices below are reconstructed estimates from recorded usage and the dated centralized price table, not provider invoices. Runs without usage cannot establish billed cost. Early artifacts predate final telemetry/schema refinements; this matrix is exploratory.`, "",
  "| Benchmark | Strategy | Status | Ranked | Calls | Seconds | Est. USD | Repairs |",
  "|---|---|---|---:|---:|---:|---:|---:|",
  ...results.sort((a,b) => a.file.localeCompare(b.file)).map(row => `| ${row.benchmark} | ${row.strategy} | ${row.metrics?.error ?? row.error ?? row.status} | ${row.metrics?.rankedCount ?? "—"} | ${row.telemetry?.totalAICalls ?? "—"} | ${round(row.telemetry ? row.telemetry.pipelineDurationMs / 1000 : null)} | ${round(cost(row))} | ${row.telemetry?.repairAttempts ?? "—"} |`), "",
  "## Interpretation limits", "",
  "One stochastic run per niche/arm; models judge their own arm's candidates, so score-scale differences are not independent quality evidence. The matrix exercises slogan creation and verification, excluding downstream design/listing. Upstream source caches can be stale. Evidence hashes are recorded and unequal hashes flagged in comparison.json. No threshold calibration, human preference, or contamination result is inferred from these scores. Blinded reviewers must see only the review fixture, not model-labelled artifacts.", "",
  "## Strategy totals", "", "Averages below use completed runs only, with different niche mixes. Use paired deltas in comparison.json for comparisons; these averages are not causal estimates.", "",
  ...summary.strategies.map(row => `- ${row.strategy}: ${row.completed} completed, ${row.creativeFailures} creative failures, ${row.technicalFailures} technical failures; average ${round(row.meanAICalls)} calls, ${round(row.meanDurationMs === null ? null : row.meanDurationMs / 1000)} s, estimated $${round(row.meanCostUSD)}; ${row.formatRepairs} repairs.`),
];
fs.writeFileSync(path.join(folder, "COMPARISON.md"), lines.join("\n") + "\n");
console.log(JSON.stringify({ attemptedRuns: summary.attemptedRuns, strategies: summary.strategies }, null, 2));
