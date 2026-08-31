import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  aggregateSemanticRejections,
  assessDynamicProfileEvidence,
  buildRecoveryContext,
  isEmergentIntersectionPreserved,
  isSemanticallyEligibleAssessment,
  normalizeEligibilityScoreRecord,
  requiresIntersectionIntegrity,
  SEMANTIC_ELIGIBILITY_THRESHOLDS,
  validateTerritoryEvidenceRefs,
  type CreativeTerritory,
  type SemanticEligibilityAssessment,
} from "../lib/ai/dynamicCreativeSelectionEngine";
import type { DynamicNicheProfile, RecoveryContext } from "../lib/ai/dynamicNicheProfile";
import type { CompositionType } from "../lib/ai/dynamicNicheProfile";
import { runBoundedSemanticRecovery } from "../lib/ai/semanticEligibilityRecovery";
import {
  buildExpressionRecoveryContext,
  dedupeByExpressionConcept,
  isExpressionWorthy,
  normalizeCreativeDirectionBrief,
  scoreExpressionWorthiness,
  semanticConceptKey,
  EXPRESSION_WORTHINESS_RELEASE,
} from "../lib/ai/expressionWorthiness";
import {
  activeCompositionHypotheses,
  expressionIntentFingerprint,
  isExpressionIntentEligible,
  selectDiverseExpressionIntents,
  EXPRESSION_INTENT_THRESHOLDS,
  type ExpressionIntent,
} from "../lib/ai/expressionIntent";

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

  const emergent = (overrides: Partial<{
    compositionType: CompositionType;
    supports: number[];
    presences: number[];
    shared: number;
    dependence: number;
    adjacency: number;
    contextRisk: number;
    risk: number;
    preservation: number;
  }> = {}) => {
    const supports = overrides.supports ?? [82, 84];
    const presences = overrides.presences ?? [75, 75];
    return isEmergentIntersectionPreserved({
      axisSupport: supports.map((support, index) => ({
        axis: `axis ${index + 1}`,
        support,
        presence: presences[index] ?? 0,
      })),
      sharedPremiseSupport: overrides.shared ?? 80,
      mutualDependence: overrides.dependence ?? 80,
      adjacencyRisk: overrides.adjacency ?? 15,
      contextDependenceRisk: overrides.contextRisk ?? 15,
      unsupportedInferenceRisk: overrides.risk ?? 20,
      intersectionPreservation: overrides.preservation ?? 82,
    }, 2);
  };

  assert.equal(emergent({ shared: 30, dependence: 25, adjacency: 80 }), false, "1. compound adjacency rejected");
  assert.equal(emergent({ supports: [85, 40] }), false, "2. one-axis collapse rejected");
  assert.equal(emergent({ compositionType: "CULTURAL_INTERSECTION", risk: 70, preservation: 40 }), false, "3. forced behavior intersection rejected when the invented scene lacks support");
  assert.equal(emergent({ compositionType: "BEHAVIORAL_INTERSECTION" }), true, "4. genuine behavioral intersection accepted");
  assert.equal(emergent({ compositionType: "IDENTITY_INTERSECTION", presences: [35, 30] }), true, "5. identity intersection accepted without literal syntax");
  assert.equal(emergent({ compositionType: "CULTURAL_INTERSECTION", presences: [25, 20] }), true, "6. cultural intersection accepted");
  assert.equal(emergent({ compositionType: "SYMBOLIC_INTERSECTION", presences: [15, 10] }), true, "7. symbolic intersection accepted");
  assert.equal(emergent({ presences: [0, 0], supports: [88, 86], shared: 90, dependence: 88 }), true, "8. compact emergent phrase accepted even when neither axis is named");
  assert.equal(emergent({ risk: 75 }), false, "9. unsupported clever phrase rejected");
  assert.equal(emergent({ presences: [0, 0], contextRisk: 80 }), false, "Context-supplied intersection must be rejected");
  assert.equal(isSemanticallyEligibleAssessment({ ...thresholdPassing, intersectionIntegrity: 0 }, { intersectionRequired: false }), true, "10. single-niche behavior remains unchanged");
  assert.deepEqual(SEMANTIC_ELIGIBILITY_THRESHOLDS, {
    truthGrounding: 65,
    productIndependence: 70,
    intersectionIntegrity: 60,
    semanticCoherence: 65,
    unsupportedInferenceRisk: 35,
  }, "Semantic thresholds must remain unchanged");
  assert.deepEqual(EXPRESSION_WORTHINESS_RELEASE, {
    score: 60,
    conceptualTransformation: 50,
    naturalness: 60,
    wearability: 60,
    creativeConstraintAlignment: 60,
  }, "Expression-worthiness thresholds must remain unchanged");

  const passingIntentScores = {
    groundedness: 80,
    humanWearReason: 78,
    distinctiveHumanMeaning: 75,
    socialSignalSpecificity: 72,
    productIndependence: 90,
    intersectionPreservation: 75,
    decorativeDescriptionRisk: 15,
    unsupportedInferenceRisk: 20,
  };
  assert.equal(isExpressionIntentEligible(passingIntentScores), true, "Grounded human expression intent must pass");
  assert.equal(isExpressionIntentEligible({ ...passingIntentScores, decorativeDescriptionRisk: 80 }), false, "Decorative-description intent must fail");
  assert.equal(isExpressionIntentEligible({ ...passingIntentScores, unsupportedInferenceRisk: 80 }), false, "Unsupported identity intent must fail");
  assert.deepEqual(EXPRESSION_INTENT_THRESHOLDS, {
    groundedness: 65,
    humanWearReason: 60,
    distinctiveHumanMeaning: 60,
    socialSignalSpecificity: 60,
    productIndependence: 70,
    intersectionPreservation: 60,
    decorativeDescriptionRisk: 35,
    unsupportedInferenceRisk: 35,
  });

  const makeIntent = (id: string, intentType: ExpressionIntent["intentType"], humanMeaning: string): ExpressionIntent => {
    const intent: ExpressionIntent = {
      id,
      territoryId: "territory_1",
      groundedPremise: "supported shared premise",
      intentType,
      humanMeaning,
      whySomeoneWouldWearThis: `Signals ${humanMeaning}`,
      supportedByPremise: ["territory_1"],
      sourceEvidenceRefs: ["niche"],
      socialSignal: humanMeaning,
      identityTarget: "participating insider",
      confidence: 80,
      intentFingerprint: "",
    };
    intent.intentFingerprint = expressionIntentFingerprint(intent);
    return intent;
  };
  const intentA = makeIntent("a", "IDENTITY_CLAIM", "chosen outsider affiliation");
  const intentADuplicate = { ...intentA, id: "a2" };
  const intentB = makeIntent("b", "ROLE_REFRAME", "misread symbol becomes companion role");
  const intentC = makeIntent("c", "OBSERVATIONAL_WIT", "insiders recognize the superstition reversal");
  const diverseIntents = selectDiverseExpressionIntents([intentA, intentADuplicate, intentB, intentC], 10);
  assert.equal(diverseIntents.length, 3, "Intent fingerprint deduplication must remove semantic duplicates");
  assert.equal(new Set(diverseIntents.map((intent) => intent.intentType)).size, 3, "Intent selection must preserve semantic-purpose diversity");

  const lowConfidenceProfile: DynamicNicheProfile = {
    ...compoundProfile,
    nicheComposition: {
      kind: "compound",
      axes: ["axis a", "axis b"],
      compositionType: "BEHAVIORAL_INTERSECTION",
      sharedPremise: "shared activity",
      compositionConfidence: 54,
      alternativeCompositionTypes: [{
        compositionType: "CULTURAL_INTERSECTION",
        confidence: 48,
        sharedPremise: "shared cultural code",
      }],
    },
  };
  assert.equal(activeCompositionHypotheses(lowConfidenceProfile).length, 2, "Low-confidence composition must expose one bounded secondary interpretation");
  assert.equal(activeCompositionHypotheses({
    ...lowConfidenceProfile,
    nicheComposition: {
      ...lowConfidenceProfile.nicheComposition!,
      compositionConfidence: 90,
      alternativeCompositionTypes: [{
        compositionType: "CULTURAL_INTERSECTION",
        confidence: 40,
        sharedPremise: "weak alternative",
      }],
    },
  }).length, 1, "High-confidence composition must not branch");
  assert.equal(activeCompositionHypotheses({
    ...compoundProfile,
    nicheComposition: {
      kind: "single",
      axes: [],
      compositionType: "IDENTITY_INTERSECTION",
      compositionConfidence: 90,
    },
  }).length, 0, "Single niches must never enter compound composition branching");

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
  const identityProfile: DynamicNicheProfile = {
    ...compoundProfile,
    nicheComposition: {
      kind: "compound",
      axes: ["night-animal affiliation", "seasonal folklore"],
      compositionType: "IDENTITY_INTERSECTION",
      sharedPremise: "an outsider-coded seasonal identity",
      axisRoles: [
        { axis: "night-animal affiliation", contribution: "outsider-coded affinity" },
        { axis: "seasonal folklore", contribution: "mythic cultural identity" },
      ],
    },
    rituals: [],
    microRituals: [],
    statusSignals: ["projects knowing affinity", "signals outsider confidence"],
    latentLifestyleModel: {
      ...baseProfile.latentLifestyleModel!,
      observableScenes: [],
      privateRituals: [],
      participationHabits: [],
      involuntaryBehaviors: [],
      repeatedDecisions: [],
      identitySignals: ["claims outsider-coded belonging", "projects nocturnal confidence"],
      sharedMeanings: ["misunderstood symbols become chosen identity", "seasonal folklore becomes self-definition"],
    },
  };
  assert.equal(assessDynamicProfileEvidence(identityProfile).status, "SUFFICIENT", "Identity composition must not require an invented behavioral scene");

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
  assert.ok(recoveryContext.profileHypotheses.length > 0);
  assert.deepEqual(recoveryContext.corroboratedTruths, [], "Uncorroborated profile claims must not be relabeled as evidence");
  assert.ok(recoveryContext.rejectedSemanticTendencies.every((value) => !value.includes("More X")));

  assert.deepEqual(
    validateTerritoryEvidenceRefs(["buyer:0", "profile:0", "niche", "invented:9"], {
      buyerLanguage: ["new leaf"],
    }),
    ["buyer:0", "niche"],
    "Territory provenance may reference original inputs, never model profile output",
  );

  const creativeBrief = normalizeCreativeDirectionBrief({
    sourcePresent: true,
    desiredQualities: ["dry self-aware confidence"],
    referenceAttributes: ["Embracing Black Cat Flair", "identity projection through understated attitude"],
    negativeConstraints: ["avoid generic affirmations"],
  }, ["no cute pet-owner language"], ["Embracing Black Cat Flair"]);
  assert.deepEqual(creativeBrief.referenceAttributes, ["identity projection through understated attitude"]);
  assert.ok(creativeBrief.negativeConstraints.includes("no cute pet-owner language"));
  assert.ok(creativeBrief.negativeConstraints.includes("avoid generic affirmations"));

  assert.equal(
    semanticConceptKey("Embracing Black Cat Flair"),
    semanticConceptKey("Embrace Black Cat Flair"),
    "Gerund and imperative variants must share a downstream concept key",
  );
  assert.deepEqual(
    dedupeByExpressionConcept([
      { slogan: "Embracing Black Cat Flair", score: 91 },
      { slogan: "Embrace Black Cat Flair", score: 88 },
      { slogan: "Night Shift Familiar", score: 84 },
    ]).map((candidate) => candidate.slogan),
    ["Embracing Black Cat Flair", "Night Shift Familiar"],
  );

  const expressionStrong = scoreExpressionWorthiness({
    selfRecognition: 88,
    identityProjection: 92,
    insiderResonance: 84,
    conceptualTransformation: 91,
    naturalness: 90,
    wearability: 94,
    creativeConstraintAlignment: 95,
  });
  const expressionWeak = scoreExpressionWorthiness({
    selfRecognition: 45,
    identityProjection: 38,
    insiderResonance: 40,
    conceptualTransformation: 25,
    naturalness: 58,
    wearability: 52,
    creativeConstraintAlignment: 30,
  });
  assert.ok(expressionStrong > expressionWeak, "Expression-worthiness must reward commercial creative strength");
  const weakExpressionAssessment = {
    slogan: "Broad Topic Approved",
    conceptKey: "broad topic approval",
    rhetoricalFamily: "OBSERVATION" as const,
    selfRecognition: 40,
    identityProjection: 45,
    insiderResonance: 30,
    conceptualTransformation: 25,
    naturalness: 65,
    wearability: 60,
    creativeConstraintAlignment: 25,
    expressionMode: "DECORATIVE_DESCRIPTION" as const,
    diagnosticTraits: ["DECORATIVE" as const],
    score: expressionWeak,
    reasons: ["Generic approval wording", "Violates non-cutesy constraint"],
  };
  assert.equal(isExpressionWorthy(weakExpressionAssessment), false);
  assert.equal(isExpressionWorthy({
    ...weakExpressionAssessment,
    slogan: "Compact Insider Identity",
    selfRecognition: 85,
    identityProjection: 88,
    insiderResonance: 82,
    conceptualTransformation: 75,
    naturalness: 80,
    wearability: 84,
    creativeConstraintAlignment: 85,
    expressionMode: "SYMBOLIC_EXPRESSION",
    diagnosticTraits: ["IDENTITY_BEARING", "SOCIALLY_SIGNALABLE", "NATURALLY_SPEAKABLE"],
    score: 82,
  }), true, "Short identity expression must remain viable without an explicit behavior");
  assert.equal(isExpressionWorthy({
    ...weakExpressionAssessment,
    score: 90,
    conceptualTransformation: 90,
    naturalness: 90,
    wearability: 90,
    creativeConstraintAlignment: 90,
    expressionMode: "DECORATIVE_DESCRIPTION",
  }), false, "Atmospheric decorative language must fail even when numeric scores are high");
  const expressionRecoveryContext = buildExpressionRecoveryContext(
    [weakExpressionAssessment],
    creativeBrief,
  );
  assert.ok(expressionRecoveryContext.dominantWeakDimensions.includes("conceptualTransformation"));
  assert.ok(expressionRecoveryContext.bindingNegativeConstraints.includes("no cute pet-owner language"));
  assert.deepEqual(expressionRecoveryContext.excludedConceptKeys, ["broad topic approval"]);

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
  const expressionSource = fs.readFileSync(path.join(root, "ai", "expressionWorthiness.ts"), "utf8");
  const intentSource = fs.readFileSync(path.join(root, "ai", "expressionIntent.ts"), "utf8");

  for (const forbidden of [
    "Wearability: Phrases humans actually say (e.g.",
    "Generate POD slogan candidates",
    "Generate one commercially safe POD slogan candidate",
    "Patterns: INSIDER_JOKE",
  ]) {
    assert.ok(!factorySource.includes(forbidden), `Factory must not contain parallel slogan template prompt: ${forbidden}`);
  }
  assert.ok(activeGenerationSource.includes("REJECTION-AWARE RECOVERY CONTEXT"));
  assert.ok(activeGenerationSource.includes("Every implied behavior, identity, role, affiliation, status, or use-case must be supported"));
  assert.ok(activeGenerationSource.includes("does not require profile-token overlap"));
  assert.ok(selectionSource.includes("MODEL-INFERRED PROFILE HYPOTHESES"));
  assert.ok(!selectionSource.includes("GROUND TRUTH PROFILE"));
  assert.ok(expressionSource.includes("Allow many rhetorical families"));
  assert.ok(expressionSource.includes("especially every negative constraint"));
  assert.ok(expressionSource.includes("A compact identity or insider phrase can be SYMBOLIC_EXPRESSION without a verb or explicit behavior"));
  assert.ok(intentSource.includes("An intent explains WHY someone would wear or say an idea, never HOW a sentence is phrased"));
  assert.ok(intentSource.includes("No slogan wording, phrase examples, sentence frames, puns, rhyme plans, or templates"));
  assert.ok(!intentSource.includes("Black Cats"), "Expression intent production code must not contain niche-specific answers");
  assert.ok(sloganEngineSource.includes("semanticQualityPrior * 0.35 + expressionWorthiness.score * 0.65"));
  assert.ok(sloganEngineSource.includes("EXPRESSION_RECOVERY_SUCCEEDED"));
  assert.ok(sloganEngineSource.includes("cacheDisabled = input.cacheTtlSec === 0"));
  assert.ok(sloganEngineSource.includes("runBoundedSemanticRecovery"));
  assert.ok(selectionSource.includes("assessCompoundIntersectionBatch"), "Compound niches require a focused second verifier");
  assert.ok(selectionSource.includes("Axis presence has no threshold"), "Compound verifier must separate lexical presence from semantic preservation");
  assert.ok(!selectionSource.includes("causal behavioral bridge"), "Territory generation must not assume every compound is behavioral");
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
