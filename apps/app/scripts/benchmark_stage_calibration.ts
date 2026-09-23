import fs from "node:fs";
import path from "node:path";
import { getNicheEvidence, verifyEvidenceIntegrity } from "../lib/services/marketEvidenceService";
import { inferNicheComposition, buildDynamicNicheProfile, generateSlogansFromDynamicProfile } from "../lib/ai/dynamicNicheProfile";
import { discoverCreativeTerritories, assessDynamicProfileEvidence, assessSemanticEligibility } from "../lib/ai/dynamicCreativeSelectionEngine";
import { emptyCreativeDirectionBrief, assessExpressionWorthiness, isExpressionWorthy } from "../lib/ai/expressionWorthiness";
import { planAndValidateExpressionIntents } from "../lib/ai/expressionIntent";
import { withModelRouting, legacyModels, routeModel, type RoutingStrategy } from "../lib/ai/modelRouting";
import { captureAIRun, aggregateAICalls } from "../lib/ai/aiTelemetry";
import { calibrationCases, classifyCalibrationFailure, contentHash, freezeCopy } from "./calibration_support";

const folder = path.resolve(process.env.AI_CALIBRATION_OUTPUT || "artifacts/stage-calibration");
fs.mkdirSync(folder, { recursive: true });
const caseIndex = Number(process.argv.find(arg => arg.startsWith("--case="))?.split("=")[1] ?? 0);
if (!calibrationCases[caseIndex]) throw new Error("Invalid case index");
const niche = calibrationCases[caseIndex];
const save = (name: string, data: unknown) => fs.writeFileSync(path.join(folder, `${caseIndex}-${name}.json`), JSON.stringify(data, null, 2));
const codeFiles: Record<string, string> = {};
function collect(dir: string) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) collect(file); else if (file.endsWith(".ts")) codeFiles[file.replaceAll("\\", "/")] = fs.readFileSync(file, "utf8");
} }
collect("lib/ai"); collect("lib/services");
for (const file of ["scripts/benchmark_stage_calibration.ts", "scripts/calibration_support.ts"]) codeFiles[file] = fs.readFileSync(file, "utf8");
const codeFingerprint = contentHash(codeFiles);
const policy = {
  controlCreative: legacyModels.creative(), controlVerifier: legacyModels.verifier(), controlIntersection: legacyModels.intersection(),
  challenger: withModelRouting("REASONING_HEAVY", () => routeModel({ taskType: "SLOGAN_GENERATION" }, legacyModels.creative())),
  semantic: withModelRouting("BALANCED_FIRST", () => routeModel({ taskType: "SEMANTIC_VERIFICATION" }, legacyModels.verifier())),
  expression: withModelRouting("BALANCED_FIRST", () => routeModel({ taskType: "EXPRESSION_VERIFICATION" }, legacyModels.verifier())),
  capabilities: process.env.AI_MODEL_CAPABILITIES_JSON ?? "{}",
  reasoning: [process.env.AI_REASONING_DEFAULT, process.env.AI_REASONING_VERIFIER, process.env.AI_REASONING_RECOVERY],
};
const policyFingerprint = contentHash(policy);
let currentStage = "COMPOSITION_INFERENCE";
async function frozenEvidence(): Promise<Awaited<ReturnType<typeof getNicheEvidence>>> {
  const file = path.join(folder, `${caseIndex}-evidence.json`);
  if (fs.existsSync(file)) {
    const saved = JSON.parse(fs.readFileSync(file, "utf8"));
    if (saved.niche !== niche || contentHash(saved.data) !== saved.hash || !verifyEvidenceIntegrity(saved.data)) throw new Error("Frozen evidence integrity failed");
    return freezeCopy(saved.data);
  }
  const evidence = await getNicheEvidence(niche);
  if (!verifyEvidenceIntegrity(evidence)) throw new Error("Evidence integrity failed");
  fs.writeFileSync(file, JSON.stringify({ niche, data: evidence, hash: contentHash(evidence) }, null, 2), { flag: "wx" });
  return freezeCopy(evidence);
}
async function measured<T>(name: string, strategy: RoutingStrategy, work: () => Promise<T>) {
  const captured = await captureAIRun(async () => {
    try { return { value: await withModelRouting(strategy, work) }; }
    catch (error: any) { return { failure: String(error?.code ?? (/malformed|no JSON|output budget|structure/i.test(error?.message ?? "") ? "FORMAT_FAILURE" : "API_FAILED")) }; }
  }, (runId, calls, durationMs) => save(`${name}-partial`, { runId, calls, stage: currentStage, codeFingerprint, policyFingerprint, summary: aggregateAICalls(calls, durationMs) }));
  const failed = captured.calls.filter(call => !call.success).at(-1);
  const outcome = { ...captured, codeFingerprint, policyFingerprint, policy,
    failureCategory: captured.result.failure ? classifyCalibrationFailure({ error: captured.result.failure, taskType: failed?.taskType ?? currentStage, errorCategory: failed?.errorCategory }) : null };
  save(name, outcome);
  return outcome;
}
async function prepare() {
  const file = path.join(folder, `${caseIndex}-snapshot.json`);
  if (fs.existsSync(file)) throw new Error("Frozen snapshot already exists; choose a new output folder to refresh");
  const outcome = await measured("prepare", "CONTROL", async () => {
    const marketEvidence = await frozenEvidence();
    if (!verifyEvidenceIntegrity(marketEvidence)) throw new Error("Evidence integrity failed");
    const evidence = { snapshotId: marketEvidence.id, contentHash: marketEvidence.contentHash,
      trendSignals: marketEvidence.trendSignals.map(row => row.phrase), buyerLanguage: marketEvidence.buyerLanguage.map(row => row.phrase),
      culturalSignals: marketEvidence.culturalSignals.map(row => row.phrase), purchaseSignals: marketEvidence.purchaseSignals.map(row => row.phrase) };
    currentStage = "COMPOSITION_INFERENCE";
    const composition = await inferNicheComposition({ niche, evidence });
    currentStage = "PROFILE_REASONING";
    const profile = await buildDynamicNicheProfile(niche, undefined, evidence, composition);
    if (assessDynamicProfileEvidence(profile).status !== "SUFFICIENT") throw Object.assign(new Error("Insufficient frozen profile"), { code: "CREATIVE_ZERO" });
    currentStage = "TERRITORY_GENERATION";
    const creativeDirection = emptyCreativeDirectionBrief();
    const territories = await discoverCreativeTerritories(profile, evidence, 8, creativeDirection);
    currentStage = "EXPRESSION_INTENT";
    const planned = await planAndValidateExpressionIntents({ profile, territories, evidence, creativeDirection });
    if (!territories.length || (composition.kind === "compound" && !planned.intents.length)) throw Object.assign(new Error("No eligible frozen input"), { code: "CREATIVE_ZERO" });
    return { niche, marketEvidence, evidence, composition, profile, territories, creativeDirection, intents: planned.intents };
  });
  if (outcome.result.value) {
    const snapshot = { data: outcome.result.value, hash: contentHash(outcome.result.value), codeFingerprint, policyFingerprint };
    fs.writeFileSync(file, JSON.stringify(snapshot, null, 2), { flag: "wx" });
    console.log("FROZEN_SNAPSHOT_CREATED");
  } else { console.log(`PREPARE_FAILED:${outcome.failureCategory}`); process.exitCode = 2; }
}
async function experiment() {
  if (fs.readdirSync(folder).some(name => name.startsWith(`${caseIndex}-generator-`) || name.startsWith(`${caseIndex}-arm-`))) {
    throw new Error("Experiment already started; choose a new output folder to rerun");
  }
  const snapshot = JSON.parse(fs.readFileSync(path.join(folder, `${caseIndex}-snapshot.json`), "utf8"));
  if (snapshot.hash !== contentHash(snapshot.data) || !verifyEvidenceIntegrity(snapshot.data.marketEvidence)) throw new Error("Frozen input integrity failed");
  if (snapshot.codeFingerprint !== codeFingerprint || snapshot.policyFingerprint !== policyFingerprint) throw new Error("Code/configuration changed after freeze; prepare a new experiment");
  const data = freezeCopy(snapshot.data);
  // Two independent generations, then reuse each exact phrase batch across evaluators.
  // This isolates judgments without feeding one evaluator's output into another.
  const pools: Record<string, string[]> = {};
  for (const generator of ["CONTROL", "REASONING_HEAVY"] as const) {
    currentStage = "SLOGAN_GENERATION";
    const generated = await measured(`generator-${generator}`, generator, () => generateSlogansFromDynamicProfile(freezeCopy(data.profile), 32, {
      creativeTerritories: freezeCopy(data.territories), expressionIntents: freezeCopy(data.intents), creativeDirection: freezeCopy(data.creativeDirection),
    }));
    if (!generated.result.value) { save("blocked", { category: generated.failureCategory, snapshotHash: snapshot.hash }); process.exitCode = 2; return; }
    pools[generator] = [...new Set(generated.result.value)];
  }
  const arms = [
    { id: "A", generator: "CONTROL", semantic: "CONTROL", expression: "CONTROL" },
    { id: "B", generator: "REASONING_HEAVY", semantic: "CONTROL", expression: "CONTROL" },
    { id: "C", generator: "CONTROL", semantic: "BALANCED_FIRST", expression: "BALANCED_FIRST" },
    { id: "D", generator: "REASONING_HEAVY", semantic: "BALANCED_FIRST", expression: "BALANCED_FIRST" },
    { id: "E", generator: "CONTROL", semantic: "CONTROL", expression: "BALANCED_FIRST" },
  ] as const;
  const semanticCache = new Map<string, Awaited<ReturnType<typeof assessSemanticEligibility>>>();
  for (const arm of arms) {
    const candidates = freezeCopy(pools[arm.generator]);
    const outcome = await measured(`arm-${arm.id}`, "CONTROL", async () => {
      currentStage = "SEMANTIC_VERIFICATION";
      const semanticKey = `${arm.generator}:${arm.semantic}`;
      let semantic = semanticCache.get(semanticKey);
      if (!semantic) {
        semantic = await withModelRouting(arm.semantic, () => assessSemanticEligibility(freezeCopy(data.profile), [...candidates], freezeCopy(data.territories), freezeCopy(data.evidence)));
        semanticCache.set(semanticKey, freezeCopy(semantic));
      }
      const survivors = candidates.filter(candidate => semantic.some(row => row.slogan === candidate && row.eligible));
      currentStage = "EXPRESSION_VERIFICATION";
      const expression = await withModelRouting(arm.expression, () => assessExpressionWorthiness(freezeCopy(data.profile), [...survivors], freezeCopy(data.creativeDirection)));
      return { snapshotHash: snapshot.hash, candidateHash: contentHash(candidates), candidates, semantic, expression,
        expressionWorthy: expression.filter(isExpressionWorthy).map(row => row.slogan), arm, reusedSemanticFrom: arm.id === "E" ? "A" : null,
        scope: "STAGE_CALIBRATION_ONLY_NO_RECOVERY_COMPRESSION_OR_PRODUCTION_RELEASE" };
    });
    console.log(JSON.stringify({ arm: arm.id, failure: outcome.failureCategory, worthy: outcome.result.value?.expressionWorthy.length }));
    if (outcome.failureCategory === "PROVIDER_RATE_LIMIT") break;
  }
}
async function main() {
  if (process.argv.includes("--freeze-evidence")) { await frozenEvidence(); console.log("ORIGINAL_EVIDENCE_FROZEN"); return; }
  if (!process.argv.includes("--prepare") && !process.argv.includes("--run")) {
    save("plan", { niche, codeFingerprint, policyFingerprint, arms: ["A: control/control", "B: stronger generator/control evaluator", "C: control/stronger evaluator", "D: stronger/stronger", "E: control semantic + stronger expression"], status: "PLAN_ONLY" });
    return;
  }
  const timeout = setTimeout(() => { save("timeout", { category: "TIMEOUT", observedStage: currentStage, codeFingerprint, policyFingerprint }); process.exit(2); }, Number(process.env.AI_CALIBRATION_TIMEOUT_MS || 300000));
  try { if (process.argv.includes("--prepare")) await prepare(); else await experiment(); }
  finally { clearTimeout(timeout); }
}
main().catch(() => { console.error("CALIBRATION_INPUT_OR_CONFIG_FAILED"); process.exitCode = 2; });
