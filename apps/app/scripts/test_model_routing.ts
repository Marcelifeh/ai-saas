import assert from "node:assert/strict";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { routeModel, withModelRouting, withAIComplexity, modelCapabilities, profileComplexity, type AITaskType } from "../lib/ai/modelRouting";
import { aggregateAICalls, captureAIRun, recordAICall } from "../lib/ai/aiTelemetry";
import { estimateModelCost } from "../lib/ai/modelPricing";
import * as schemas from "../lib/ai/verifierSchemas";

async function main() {
  const env = { AI_MODEL_ROUTING_ENABLED: "true" };
  const route = (taskType: AITaskType) => routeModel({ taskType }, "legacy", env);
  for (const task of ["EXTRACTION", "NORMALIZATION"] as const) assert.equal(route(task).modelTier, "FAST");
  for (const task of ["SLOGAN_GENERATION", "PROFILE_REASONING", "EXPRESSION_INTENT", "COMPRESSION", "LISTING", "DESIGN"] as const) assert.equal(route(task).modelTier, "BALANCED");
  for (const task of ["SEMANTIC_VERIFICATION", "INTERSECTION_VERIFICATION", "EXPRESSION_VERIFICATION", "RECOVERY"] as const) assert.equal(route(task).modelTier, "REASONING");
  assert.equal(routeModel({ taskType: "EXPRESSION_INTENT", complexity: { isCompound: true, compositionConfidence: 0.3 } }, "legacy", env).modelTier, "REASONING");
  assert.equal(routeModel({ taskType: "PROFILE_REASONING", complexity: { isCompound: false, compositionConfidence: 0.1 } }, "legacy", env).modelTier, "BALANCED");
  assert.equal(routeModel({ taskType: "COMPOSITION_INFERENCE", complexity: { isCompound: true, compositionConfidence: 0.9 } }, "legacy", env).modelTier, "BALANCED");
  assert.equal(profileComplexity({ nicheComposition: { kind: "compound", compositionConfidence: 70 } }).compositionConfidence, 0.7);
  const routingSource = await import("node:fs").then(fs => fs.readFileSync(require.resolve("../lib/ai/modelRouting"), "utf8"));
  for (const niche of ["Pumpkin spice", "Oktoberfest", "Halloween", "Meal Preppers", "Birdwatching"]) assert.equal(routingSource.includes(niche), false);
  for (const [taskType, tier] of [["EXTRACTION", "FAST"], ["SLOGAN_GENERATION", "BALANCED"], ["SEMANTIC_VERIFICATION", "REASONING"]] as const) {
    assert.equal(routeModel({ taskType }, "legacy", { ...env, [`AI_MODEL_${tier}`]: "operator-pinned-snapshot" }).modelName, "operator-pinned-snapshot");
  }
  assert.equal(routeModel({ taskType: "SEMANTIC_VERIFICATION" }, "legacy", { ...env, AI_MODEL_REASONING: "pinned-snapshot" }).modelName, "pinned-snapshot");
  assert.equal(routeModel({ taskType: "SEMANTIC_VERIFICATION" }, "legacy", {}).modelName, "legacy");
  assert.equal(routeModel({ taskType: "SEMANTIC_VERIFICATION" }, "legacy", { AI_MODEL_ROUTING_ENABLED: "false" }).enabled, false);
  assert.throws(() => modelCapabilities("unknown-model"), /capability/);
  const parallel = await Promise.all([
    withModelRouting("CONTROL", async () => { await Promise.resolve(); return route("SEMANTIC_VERIFICATION"); }),
    withModelRouting("REASONING_HEAVY", async () => { await Promise.resolve(); return route("SLOGAN_GENERATION"); }),
  ]);
  assert.deepEqual(parallel.map(x => x.modelTier), ["CONTROL", "REASONING"]);
  withModelRouting("BALANCED_FIRST", () => withAIComplexity({ primaryAttemptFailed: true }, () => assert.equal(route("EXPRESSION_INTENT").reasoningLevel, "HIGH")));
  assert.equal(route("EXPRESSION_INTENT").modelTier, "BALANCED");
  const pricing = { test: { inputPerMillion: 2, outputPerMillion: 8, cachedInputPerMillion: 1 } };
  assert.equal(estimateModelCost("test", 1000, 100, 200, pricing), 0.0026);
  assert.equal(estimateModelCost("missing", 1000, 100, 0, pricing), null);
  const captured = await captureAIRun(async () => recordAICall({
    taskType: "SEMANTIC_VERIFICATION", modelTier: "REASONING", modelName: "test", latencyMs: 42,
    inputTokens: 1000, outputTokens: 100, cachedInputTokens: 200, retryCount: null, repairCount: 0, success: true,
    ...({ prompt: "SECRET_SENTINEL", apiKey: "SECRET_SENTINEL" } as object),
  }));
  assert.equal(captured.calls[0].latencyMs, 42);
  assert.equal(captured.summary.callsByTask.SEMANTIC_VERIFICATION, 1);
  assert.equal(JSON.stringify(captured).includes("SECRET_SENTINEL"), false);
  assert.deepEqual(aggregateAICalls(captured.calls, 50), aggregateAICalls(captured.calls, 50));
  const pricedCalls = [{ ...captured.calls[0], estimatedCost: 0.1 }, { ...captured.calls[0], estimatedCost: 0.2 }];
  assert.ok(Math.abs(aggregateAICalls(pricedCalls, 50).estimatedAICostPerRun! - 0.3) < 1e-12);
  assert.equal(aggregateAICalls(pricedCalls, 50).inputTokens, 2000);
  for (const schema of [schemas.semanticEligibilityVerifierRowSchema, schemas.blindReadingVerifierRowSchema,
    schemas.compoundIntersectionJudgmentSchema, schemas.expressionIntentVerifierRowSchema,
    schemas.expressionWorthinessVerifierRowSchema.required({ metaDescriptionRisk: true }), schemas.creativeBriefVerifierRowSchema]) {
    const format = zodResponseFormat(z.object({ assessments: z.array(schema) }).strict(), "test");
    assert.equal(format.json_schema.strict, true);
  }
  console.log("MODEL ROUTING: PASS");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
