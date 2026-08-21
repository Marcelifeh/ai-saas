/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import {
  isSemanticallyEligibleAssessment,
  SEMANTIC_ELIGIBILITY_THRESHOLDS,
} from "../lib/ai/dynamicCreativeSelectionEngine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const passing = {
  truthGrounding: SEMANTIC_ELIGIBILITY_THRESHOLDS.truthGrounding,
  productIndependence: SEMANTIC_ELIGIBILITY_THRESHOLDS.productIndependence,
  intersectionIntegrity: SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity,
  semanticCoherence: SEMANTIC_ELIGIBILITY_THRESHOLDS.semanticCoherence,
  unsupportedInferenceRisk: SEMANTIC_ELIGIBILITY_THRESHOLDS.unsupportedInferenceRisk,
};
assert(isSemanticallyEligibleAssessment(passing), "Threshold-boundary eligible candidate should pass");
assert(!isSemanticallyEligibleAssessment({ ...passing, truthGrounding: passing.truthGrounding - 1 }), "Low truth grounding must hard-fail");
assert(!isSemanticallyEligibleAssessment({ ...passing, productIndependence: passing.productIndependence - 1 }), "Product-meta dependence must hard-fail");
assert(!isSemanticallyEligibleAssessment({ ...passing, intersectionIntegrity: passing.intersectionIntegrity - 1 }), "Crossover collapse must hard-fail");
assert(!isSemanticallyEligibleAssessment({ ...passing, semanticCoherence: passing.semanticCoherence - 1 }), "Semantic incoherence must hard-fail");
assert(!isSemanticallyEligibleAssessment({ ...passing, unsupportedInferenceRisk: passing.unsupportedInferenceRisk + 1 }), "Unsupported behavior must hard-fail");

const root = path.resolve(__dirname, "..", "lib");
const factorySource = fs.readFileSync(path.join(root, "services", "factoryService.ts"), "utf8");
const activeGenerationSource = fs.readFileSync(path.join(root, "ai", "dynamicNicheProfile.ts"), "utf8");

for (const forbidden of [
  "Wearability: Phrases humans actually say (e.g.",
  "Generate POD slogan candidates",
  "Generate one commercially safe POD slogan candidate",
  "Patterns: INSIDER_JOKE",
]) {
  assert(!factorySource.includes(forbidden), `Factory must not contain parallel slogan template prompt: ${forbidden}`);
}

assert(activeGenerationSource.includes("GROUNDED CREATIVE TERRITORIES"), "Dynamic generator must consume grounded creative territories");
assert(activeGenerationSource.includes("Every implied behavior or use-case must be supported"), "Dynamic generator must require grounded behavior");

console.log("Creative selection regression gates passed");
