import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  aggregateSemanticRejections,
  assessDynamicProfileEvidence,
  buildRecoveryContext,
  isSemanticallyEligibleAssessment,
  normalizeEligibilityScoreRecord,
  requiresIntersectionIntegrity,
  SEMANTIC_ELIGIBILITY_THRESHOLDS,
  type CreativeTerritory,
  type SemanticEligibilityAssessment,
} from "../lib/ai/dynamicCreativeSelectionEngine";
import type { DynamicNicheProfile, RecoveryContext } from "../lib/ai/dynamicNicheProfile";
import { runBoundedSemanticRecovery } from "../lib/ai/semanticEligibilityRecovery";

const thresholdPassing = {
  truthGrounding: SEMANTIC_ELIGIBILITY_THRESHOLDS.truthGrounding,
  productIndependence: SEMANTIC_ELIGIBILITY_THRESHOLDS.productIndependence,
  intersectionIntegrity: SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity,
  semanticCoherence: SEMANTIC_ELIGIBILITY_THRESHOLDS.semanticCoherence,
  unsupportedInferenceRisk: SEMANTIC_ELIGIBILITY_THRESHOLDS.unsupportedInferenceRisk,
};

function assessment(
  slogan: string,
  scores: Partial<Record<keyof typeof thresholdPassing, number>> = {},
  intersectionApplicable = true,
): SemanticEligibilityAssessment {
  const merged = { ...thresholdPassing, ...scores };
  return {
    slogan,
    ...merged,
    intersectionApplicable,
    eligible: isSemanticallyEligibleAssessment(merged, { intersectionRequired: intersectionApplicable }),
    axisGrounding: intersectionApplicable ? [{ axis: "test axis", grounding: merged.intersectionIntegrity }] : [],
    reasons: [],
  };
}

const baseProfile: DynamicNicheProfile = {
  niche: "Careful Indoor Plant Collectors",
  nicheComposition: { kind: "single", axes: ["indoor plant collecting"] },
  dimensions: ["indoor plant collecting"],
  audience: "indoor plant collectors",
  rituals: ["checking leaf undersides during morning watering"],
  microRituals: ["turning a pot toward the brighter window"],
  contradictions: ["makes room for one more plant after declaring the shelf full"],
  frustrations: ["finding a new leaf with a damaged edge"],
  statusSignals: ["recognizing a cutting before its label"],
  insiderLanguage: ["propagation"],
  embarrassingTruths: ["checks new growth before checking messages"],
  obsessions: ["tracking every unfurling leaf"],
  visualCulture: ["watering can beside a crowded shelf"],
  purchaseMotives: ["recognition of repeated plant-care behavior"],
  latentLifestyleModel: {
    observableScenes: [{
      who: "a collector",
      where: "beside a bright window",
      doing: "checks leaves while watering",
      before: "moves the pot",
      after: "records new growth",
      recurringObjects: ["watering can", "plant journal"],
      environmentalConditions: ["morning light"],
      socialContext: [],
      emotionalStates: ["quiet pride"],
    }],
    privateRituals: ["checks every new leaf before breakfast"],
    participationHabits: ["rotates pots toward changing light"],
    involuntaryBehaviors: ["pauses at the shelf to inspect new growth"],
    seasonalBehaviors: [],
    comfortObjects: ["uses the same small watering can"],
    collectionHabits: ["labels and dates new cuttings"],
    environments: ["bright window"],
    recurringObjects: ["watering can", "plant journal"],
    socialInteractions: ["trades rooted cuttings"],
    tensions: ["limited shelf space against another promising cutting"],
    identitySignals: ["knows each plant's watering rhythm"],
    repeatedDecisions: ["moves pots as the light changes"],
    tinyFrustrations: ["a leaf catches while moving the pot"],
    smallVictories: ["a cutting grows its first root"],
    unspokenRules: ["inspect a new plant before placing it near the collection"],
    emotionalRewards: ["noticing a new leaf first"],
  },
};

const compoundProfile: DynamicNicheProfile = {
  ...baseProfile,
  niche: "Plant Collectors × Strength Trainers",
  nicheComposition: { kind: "compound", axes: ["plant collecting", "strength training"] },
  dimensions: ["plant collecting", "strength training"],
};

const territories: CreativeTerritory[] = [{
  id: "territory_1",
  premise: "Daily checks become an automatic ritual",
  humanTruth: "The audience inspects small changes before starting other tasks",
  evidence: ["checks every new leaf before breakfast"],
  dimensionCoverage: ["indoor plant collecting"],
  confidence: 90,
}];

async function main(): Promise<void> {
  assert.equal(isSemanticallyEligibleAssessment(thresholdPassing), true);
  for (const dimension of ["truthGrounding", "productIndependence", "intersectionIntegrity", "semanticCoherence"] as const) {
    assert.equal(isSemanticallyEligibleAssessment({ ...thresholdPassing, [dimension]: thresholdPassing[dimension] - 1 }), false, `${dimension} below threshold must reject`);
    assert.equal(isSemanticallyEligibleAssessment({ ...thresholdPassing, [dimension]: thresholdPassing[dimension] + 1 }), true, `${dimension} above threshold must pass`);
  }
  assert.equal(isSemanticallyEligibleAssessment({ ...thresholdPassing, unsupportedInferenceRisk: 20 }), true, "Low inference risk must pass");
  assert.equal(isSemanticallyEligibleAssessment({ ...thresholdPassing, unsupportedInferenceRisk: 80 }), false, "High inference risk must reject");

  assert.equal(requiresIntersectionIntegrity(baseProfile), false);
  assert.equal(isSemanticallyEligibleAssessment({ ...thresholdPassing, intersectionIntegrity: 0 }, { intersectionRequired: false }), true);
  assert.equal(requiresIntersectionIntegrity(compoundProfile), true);
  assert.equal(isSemanticallyEligibleAssessment({ ...thresholdPassing, intersectionIntegrity: 59 }, { intersectionRequired: true }), false);
  assert.equal(isSemanticallyEligibleAssessment(thresholdPassing, {
    intersectionRequired: true,
    expectedAxisCount: 2,
    axisGroundingScores: [80, 59],
  }), false, "Every compound axis must independently meet the existing intersection threshold");
  assert.equal(isSemanticallyEligibleAssessment(thresholdPassing, {
    intersectionRequired: true,
    expectedAxisCount: 2,
    axisGroundingScores: [80, 60],
  }), true);

  assert.equal(assessment("Buy This Plant Shirt", { productIndependence: 20 }).eligible, false);
  assert.equal(assessment("Invented midnight greenhouse ritual", { unsupportedInferenceRisk: 80 }).eligible, false);
  assert.equal(assessment("Checked New Growth Before Messages").eligible, true);

  assert.deepEqual(normalizeEligibilityScoreRecord({
    truthGrounding: "0.70",
    productIndependence: 0.8,
    intersectionIntegrity: 0.6,
    semanticCoherence: 0.75,
    unsupportedInferenceRisk: 0.2,
  }), {
    truthGrounding: 70,
    productIndependence: 80,
    intersectionIntegrity: 60,
    semanticCoherence: 75,
    unsupportedInferenceRisk: 20,
  });
  assert.equal(normalizeEligibilityScoreRecord({ ...thresholdPassing, truthGrounding: null }), undefined);
  assert.equal(isSemanticallyEligibleAssessment({ ...thresholdPassing, truthGrounding: Number.NaN }), false);

  const profileEvidence = assessDynamicProfileEvidence(baseProfile);
  assert.equal(profileEvidence.status, "SUFFICIENT");
  assert.equal(assessDynamicProfileEvidence({
    ...baseProfile,
    rituals: [],
    microRituals: [],
    latentLifestyleModel: undefined,
  }).status, "INSUFFICIENT");

  const rejected = [
    assessment("Generic identity", { truthGrounding: 20, semanticCoherence: 40 }),
    assessment("Unsupported behavior", { truthGrounding: 30, unsupportedInferenceRisk: 90 }),
  ];
  const rejectionCounts = aggregateSemanticRejections(rejected);
  assert.equal(rejectionCounts.truthGrounding, 2);
  assert.equal(rejectionCounts.unsupportedInferenceRisk, 1);

  const recoveryContext = buildRecoveryContext({
    attempt: 1,
    profile: baseProfile,
    territories,
    assessments: rejected,
    evidence: { snapshotId: "snapshot-test", buyerLanguage: ["new leaf"] },
    alreadyGeneratedCandidateFingerprints: ["generic identity"],
  });
  assert.equal(recoveryContext.dominantFailureDimensions[0], "truthGrounding");
  assert.ok(recoveryContext.supportedProfileTruths.length > 0);
  assert.ok(recoveryContext.rejectedSemanticTendencies.every((value) => !value.includes("More X")));

  let generateCalls = 0;
  let receivedContext: RecoveryContext | undefined;
  const recovered = await runBoundedSemanticRecovery({
    initialGeneratedCandidates: ["Generic identity"],
    initialCompressedCandidates: ["Generic identity"],
    initialAssessments: rejected.slice(0, 1),
    buildContext: (_attempt, _assessments, fingerprints) => ({
      ...recoveryContext,
      alreadyGeneratedCandidateFingerprints: fingerprints,
    }),
    generate: async (context) => {
      generateCalls += 1;
      receivedContext = context;
      return ["Generic identity", "Checked New Growth Before Messages", "Checked New Growth Before Messages"];
    },
    compress: async (candidates) => candidates,
    assess: async (candidates) => candidates.map((candidate) => assessment(candidate, {}, false)),
  });
  assert.equal(generateCalls, 1, "Zero eligible must trigger one recovery generation");
  assert.ok(receivedContext?.dominantFailureDimensions.includes("truthGrounding"), "Recovery must receive rejection diagnostics");
  assert.deepEqual(recovered.eligibleCandidates, ["Checked New Growth Before Messages"]);
  assert.equal(recovered.attempts[0]?.deduplicatedCandidateCount, 1, "Recovery must dedupe against previous attempts and within its batch");

  let exhaustedCalls = 0;
  const exhausted = await runBoundedSemanticRecovery({
    initialGeneratedCandidates: ["Old"],
    initialCompressedCandidates: ["Old"],
    initialAssessments: [assessment("Old", { truthGrounding: 10 })],
    maxAttempts: 2,
    buildContext: (attempt) => ({ ...recoveryContext, attempt }),
    generate: async () => [`Still weak ${++exhaustedCalls}`],
    compress: async (candidates) => candidates,
    assess: async (candidates) => candidates.map((candidate) => assessment(candidate, { truthGrounding: 10 })),
  });
  assert.equal(exhaustedCalls, 2, "Bounded recovery must terminate at configured maximum");
  assert.equal(exhausted.eligibleCandidates.length, 0, "Exhaustion must not create a fallback slogan");

  const root = path.resolve(__dirname, "..", "lib");
  const factorySource = fs.readFileSync(path.join(root, "services", "factoryService.ts"), "utf8");
  const activeGenerationSource = fs.readFileSync(path.join(root, "ai", "dynamicNicheProfile.ts"), "utf8");
  const sloganEngineSource = fs.readFileSync(path.join(root, "ai", "sloganEngine.ts"), "utf8");
  const selectionSource = fs.readFileSync(path.join(root, "ai", "dynamicCreativeSelectionEngine.ts"), "utf8");
  const recoverySource = fs.readFileSync(path.join(root, "ai", "semanticEligibilityRecovery.ts"), "utf8");

  for (const forbidden of [
    "Wearability: Phrases humans actually say (e.g.",
    "Generate POD slogan candidates",
    "Generate one commercially safe POD slogan candidate",
    "Patterns: INSIDER_JOKE",
  ]) {
    assert.ok(!factorySource.includes(forbidden), `Factory must not contain parallel slogan template prompt: ${forbidden}`);
  }
  assert.ok(activeGenerationSource.includes("REJECTION-AWARE RECOVERY CONTEXT"));
  assert.ok(activeGenerationSource.includes("Every implied behavior or use-case must be supported"));
  assert.ok(sloganEngineSource.includes("runBoundedSemanticRecovery"));
  assert.ok(selectionSource.includes("assessCompoundIntersectionBatch"), "Compound niches require a focused second verifier");
  assert.ok(sloganEngineSource.includes('error: "GENERATION_EXHAUSTED"'));
  assert.ok(factorySource.includes("We couldn't find a sufficiently grounded slogan"));
  assert.ok(!factorySource.includes("No slogans survived semantic eligibility"), "Raw evaluator wording must not reach users");
  assert.ok(!recoverySource.includes("fallback"), "Recovery must not contain a fallback slogan path");
  assert.ok(!factorySource.includes("safeSlogans.length > 0 ? safeSlogans : sloganEngine.slogans"));

  console.log("Creative selection regression gates passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
