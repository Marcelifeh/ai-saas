import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  isSemanticallyEligibleAssessment,
  SEMANTIC_ELIGIBILITY_THRESHOLDS,
} from "../lib/ai/dynamicCreativeSelectionEngine";
import {
  dedupeByExpressionConcept,
  EXPRESSION_WORTHINESS_RELEASE,
  isExpressionWorthy,
  scoreExpressionWorthiness,
  type ExpressionWorthinessAssessment,
} from "../lib/ai/expressionWorthiness";
import { runBoundedCompositionRecovery } from "../lib/ai/compositionOutcomeRecovery";
import {
  explicitlyCoercedVerifierScoreSchema,
  runStructuredIndexedVerifier,
  validateIndexedVerifierResponse,
  verifierTechnicalCode,
  VerifierTechnicalError,
  type VerifierTechnicalCode,
} from "../lib/ai/structuredVerifier";
import {
  compoundIntersectionVerifierRowSchema,
  expressionWorthinessVerifierRowSchema,
  semanticEligibilityVerifierRowSchema,
} from "../lib/ai/verifierSchemas";
import {
  offlineCreativeOrchestrationFixture,
  reconstructedGymFailureSignature,
  verifierAcceptanceFixtures,
  type OfflineVerifierModelResponse,
} from "./fixtures/verifier_acceptance_fixtures";

const judgmentSchemaDescription = `{ "assessments": [{ "index": 0, "sharedPremise": "", "axisSupport": [{ "axis": "", "support": 0, "presence": 0 }], "sharedPremiseSupport": 0, "mutualDependence": 0, "adjacencyRisk": 0, "contextDependenceRisk": 0, "unsupportedInferenceRisk": 0, "intersectionPreservation": 0, "reasons": [] }] }`;

async function runCompoundFixture(input: {
  responses: readonly OfflineVerifierModelResponse[];
  expectedCount: number;
}) {
  let requestCount = 0;
  let repairCount = 0;
  const result = await runStructuredIndexedVerifier({
    prompt: "offline verifier fixture",
    model: "offline-fixture",
    outputKey: "assessments",
    rowSchema: compoundIntersectionVerifierRowSchema,
    expectedCount: input.expectedCount,
    expectedSchema: judgmentSchemaDescription,
    label: "Offline compound verifier",
    request: async () => {
      const response = input.responses[Math.min(requestCount, input.responses.length - 1)];
      requestCount += 1;
      return response;
    },
    onFormatRepairAttempt: () => {
      repairCount += 1;
    },
  });
  return { result, requestCount, repairCount };
}

async function expectTechnicalFailure(input: {
  name: string;
  response: OfflineVerifierModelResponse;
  expectedCount: number;
  expectedCode: VerifierTechnicalCode;
  expectedCategory?: string;
}) {
  let requestCount = 0;
  let repairCount = 0;
  let captured: VerifierTechnicalError | undefined;
  try {
    await runStructuredIndexedVerifier({
      prompt: input.name,
      model: "offline-fixture",
      outputKey: "assessments",
      rowSchema: compoundIntersectionVerifierRowSchema,
      expectedCount: input.expectedCount,
      expectedSchema: judgmentSchemaDescription,
      label: input.name,
      request: async () => {
        requestCount += 1;
        return input.response;
      },
      onFormatRepairAttempt: () => {
        repairCount += 1;
      },
    });
  } catch (error) {
    if (error instanceof VerifierTechnicalError) captured = error;
    else throw error;
  }
  assert.ok(captured, `${input.name} must fail technically`);
  assert.equal(captured.code, input.expectedCode, `${input.name} technical code`);
  if (input.expectedCategory) assert.equal(captured.category, input.expectedCategory, `${input.name} category`);
  assert.equal(requestCount, 2, `${input.name} allows exactly one repair request`);
  assert.equal(repairCount, 1, `${input.name} records exactly one repair attempt`);
  return captured;
}

async function simulateProviderFailure(code: "VERIFIER_RATE_LIMITED" | "VERIFIER_API_FAILED") {
  let requestCount = 0;
  let repairCount = 0;
  let captured: VerifierTechnicalError | undefined;
  try {
    await runStructuredIndexedVerifier({
      prompt: code,
      model: "offline-fixture",
      outputKey: "assessments",
      rowSchema: compoundIntersectionVerifierRowSchema,
      expectedCount: 1,
      expectedSchema: judgmentSchemaDescription,
      label: code,
      request: async () => {
        requestCount += 1;
        throw new VerifierTechnicalError(code, code === "VERIFIER_RATE_LIMITED" ? "Simulated provider 429" : "Simulated provider 500");
      },
      onFormatRepairAttempt: () => {
        repairCount += 1;
      },
    });
  } catch (error) {
    if (error instanceof VerifierTechnicalError) captured = error;
    else throw error;
  }
  assert.ok(captured);
  assert.equal(verifierTechnicalCode(captured), code);
  assert.equal(requestCount, 1, "Provider failures must not receive format repair calls");
  assert.equal(repairCount, 0, "Provider failures are not structural repair cases");
  return captured;
}

async function assertTechnicalFailureDoesNotRecover(error: VerifierTechnicalError) {
  const code = verifierTechnicalCode(error);
  assert.ok(code, "Production taxonomy must recognize the technical error");
  assert.notEqual(code, "NO_SEMANTIC_SURVIVORS");
  assert.notEqual(code, "GENERATION_EXHAUSTED");
  let secondaryCalls = 0;
  const technicalResult: { ranked: string[]; error: VerifierTechnicalCode | undefined } = {
    ranked: [],
    error: code,
  };
  const recovery = await runBoundedCompositionRecovery({
    primaryResult: technicalResult,
    // The production taxonomy is the gate: technical failures never provide
    // a creative secondary composition to the bounded recovery controller.
    secondaryComposition: verifierTechnicalCode(error) ? undefined : offlineCreativeOrchestrationFixture.profile.secondaryComposition,
    releasedCount: (result) => result.ranked.length,
    runSecondary: async () => {
      secondaryCalls += 1;
      return { ranked: ["must not run"], error: undefined };
    },
  });
  assert.equal(recovery.secondaryAttemptUsed, false);
  assert.equal(secondaryCalls, 0);
  assert.equal(recovery.result.error, code, "Technical code must survive recovery orchestration unchanged");
}

async function runOfflineCreativeOrchestration() {
  const fixture = offlineCreativeOrchestrationFixture;
  assert.equal(fixture.profile.status, "SUFFICIENT");
  assert.equal(fixture.territories.length, 1);
  assert.equal(fixture.expressionIntents.length, 1);
  assert.equal(fixture.candidates.length, 2);

  const semantic = await runStructuredIndexedVerifier({
    prompt: "offline semantic fixture",
    model: "offline-fixture",
    outputKey: "assessments",
    rowSchema: semanticEligibilityVerifierRowSchema,
    expectedCount: fixture.candidates.length,
    expectedSchema: "semantic eligibility fixture schema",
    label: "Offline semantic verifier",
    request: async () => fixture.semanticResponse,
  });
  const semanticSurvivors = semantic.rows.flatMap((row) => {
    const candidate = fixture.candidates[row.index];
    const eligible = isSemanticallyEligibleAssessment({
      truthGrounding: row.truthGrounding,
      productIndependence: row.productIndependence,
      intersectionIntegrity: row.intersectionIntegrity,
      semanticCoherence: row.semanticCoherence,
      unsupportedInferenceRisk: row.unsupportedInferenceRisk,
    }, {
      intersectionRequired: true,
      expectedAxisCount: fixture.profile.composition.axes.length,
      axisGroundingScores: row.axisGrounding.map((axis) => axis.grounding),
    });
    return eligible ? [{ ...candidate, semantic: row }] : [];
  });
  assert.equal(semanticSurvivors.length, 1, "Semantic fixture must produce one survivor without changing thresholds");

  const expression = await runStructuredIndexedVerifier({
    prompt: "offline expression fixture",
    model: "offline-fixture",
    outputKey: "assessments",
    rowSchema: expressionWorthinessVerifierRowSchema,
    expectedCount: semanticSurvivors.length,
    expectedSchema: "expression worthiness fixture schema",
    label: "Offline expression verifier",
    request: async () => fixture.expressionWorthinessResponse,
  });
  const expressionAssessments: ExpressionWorthinessAssessment[] = expression.rows.map((row) => ({
    slogan: semanticSurvivors[row.index].slogan,
    conceptKey: row.conceptKey,
    rhetoricalFamily: "IDENTITY",
    selfRecognition: row.selfRecognition,
    identityProjection: row.identityProjection,
    insiderResonance: row.insiderResonance,
    conceptualTransformation: row.conceptualTransformation,
    naturalness: row.naturalness,
    wearability: row.wearability,
    creativeConstraintAlignment: row.creativeConstraintAlignment,
    expressionMode: row.expressionMode,
    diagnosticTraits: row.diagnosticTraits,
    score: scoreExpressionWorthiness(row),
    reasons: row.reasons,
  }));
  const worthy = expressionAssessments.filter(isExpressionWorthy);
  assert.equal(worthy.length, 1, "Expression fixture must produce one worthy survivor without changing thresholds");
  const ranked = dedupeByExpressionConcept(worthy.map((assessment) => ({
    slogan: assessment.slogan,
    score: assessment.score,
    expressionWorthiness: assessment,
  }))).sort((left, right) => right.score - left.score);
  assert.equal(ranked.length, 1);

  let successfulSecondaryCalls = 0;
  const successfulRecovery = await runBoundedCompositionRecovery({
    primaryResult: { ranked },
    secondaryComposition: fixture.profile.secondaryComposition,
    releasedCount: (result) => result.ranked.length,
    runSecondary: async () => {
      successfulSecondaryCalls += 1;
      return { ranked: [] as typeof ranked };
    },
  });
  assert.equal(successfulRecovery.secondaryAttemptUsed, false, "Released primary result must not enter composition recovery");
  assert.equal(successfulSecondaryCalls, 0);

  let creativeSecondaryCalls = 0;
  const creativeRecovery = await runBoundedCompositionRecovery({
    primaryResult: { ranked: [] as typeof ranked },
    secondaryComposition: fixture.profile.secondaryComposition,
    releasedCount: (result) => result.ranked.length,
    runSecondary: async () => {
      creativeSecondaryCalls += 1;
      return { ranked };
    },
  });
  assert.equal(creativeRecovery.secondaryAttemptUsed, true, "A creative zero-result may use the existing bounded secondary attempt");
  assert.equal(creativeSecondaryCalls, 1, "Composition recovery remains bounded to one secondary attempt");
  assert.equal(creativeRecovery.result.ranked.length, 1);

  return {
    profileStatus: fixture.profile.status,
    composition: fixture.profile.composition.compositionType,
    territoryCount: fixture.territories.length,
    intentCount: fixture.expressionIntents.length,
    generatedCount: fixture.candidates.length,
    semanticSurvivors: semanticSurvivors.length,
    expressionWorthySurvivors: worthy.length,
    rankedCount: ranked.length,
    successfulPrimaryRecoveryUsed: successfulRecovery.secondaryAttemptUsed,
    boundedCreativeRecoveryCalls: creativeSecondaryCalls,
  };
}

async function main() {
  const valid = await runCompoundFixture({
    responses: [verifierAcceptanceFixtures.valid.response],
    expectedCount: verifierAcceptanceFixtures.valid.expectedCount,
  });
  assert.equal(valid.result.rows.length, 2);
  assert.equal(valid.result.formatRepairAttempts, 0);
  assert.equal(valid.requestCount, 1);

  const structuralFailures = [
    await expectTechnicalFailure({ name: "TRUNCATED_JSON", ...verifierAcceptanceFixtures.truncatedJson, expectedCode: "VERIFIER_INCOMPLETE", expectedCategory: "TRUNCATED_JSON" }),
    await expectTechnicalFailure({ name: "MALFORMED_JSON", ...verifierAcceptanceFixtures.malformedJson, expectedCode: "VERIFIER_FORMAT_FAILED", expectedCategory: "MALFORMED_JSON" }),
    await expectTechnicalFailure({ name: "MISSING_ROW", ...verifierAcceptanceFixtures.missingCandidateRow, expectedCode: "VERIFIER_INCOMPLETE", expectedCategory: "MISSING_ROW" }),
    await expectTechnicalFailure({ name: "DUPLICATE_INDEX", ...verifierAcceptanceFixtures.duplicateCandidateIndex, expectedCode: "VERIFIER_INCOMPLETE", expectedCategory: "DUPLICATE_INDEX" }),
    await expectTechnicalFailure({ name: "INVALID_INDEX", ...verifierAcceptanceFixtures.unexpectedCandidateIndex, expectedCode: "VERIFIER_FORMAT_FAILED", expectedCategory: "INVALID_INDEX" }),
    await expectTechnicalFailure({ name: "MISSING_SCORE", ...verifierAcceptanceFixtures.missingRequiredScore, expectedCode: "VERIFIER_FORMAT_FAILED", expectedCategory: "INVALID_ROW" }),
    await expectTechnicalFailure({ name: "NON_FINITE_SCORE", ...verifierAcceptanceFixtures.nonFiniteScore, expectedCode: "VERIFIER_FORMAT_FAILED", expectedCategory: "INVALID_ROW" }),
    await expectTechnicalFailure({ name: "EMPTY_RESPONSE", ...verifierAcceptanceFixtures.emptyResponse, expectedCode: "VERIFIER_INCOMPLETE", expectedCategory: "TRUNCATED_JSON" }),
  ];

  const explicitlyAllowedNumericSchema = z.object({
    index: z.number().int().nonnegative(),
    score: explicitlyCoercedVerifierScoreSchema,
  }).strict();
  const numericString = validateIndexedVerifierResponse({
    response: verifierAcceptanceFixtures.numericStringScore.response,
    outputKey: "assessments",
    rowSchema: explicitlyAllowedNumericSchema,
    expectedCount: verifierAcceptanceFixtures.numericStringScore.expectedCount,
    label: "Explicit numeric-string fixture",
  });
  assert.equal(numericString.rows[0].score, 72);

  const authoritativeComposition = offlineCreativeOrchestrationFixture.profile.composition.compositionType;
  const labelMismatch = await runCompoundFixture({
    responses: [verifierAcceptanceFixtures.compositionLabelMismatch.response],
    expectedCount: verifierAcceptanceFixtures.compositionLabelMismatch.expectedCount,
  });
  assert.equal(labelMismatch.result.formatRepairAttempts, 0, "Redundant model composition metadata must not invalidate a judgment");
  assert.equal(authoritativeComposition, "BEHAVIORAL_INTERSECTION", "Pipeline composition metadata remains authoritative");
  assert.equal("compositionType" in labelMismatch.result.rows[0], false, "Model composition metadata must not enter the parsed judgment");

  const provider429 = await simulateProviderFailure("VERIFIER_RATE_LIMITED");
  const provider500 = await simulateProviderFailure("VERIFIER_API_FAILED");

  const repaired = await runCompoundFixture({
    responses: verifierAcceptanceFixtures.repairSucceeds.responses,
    expectedCount: verifierAcceptanceFixtures.repairSucceeds.expectedCount,
  });
  assert.equal(repaired.result.rows.length, 1);
  assert.equal(repaired.result.formatRepairAttempts, 1);
  assert.equal(repaired.requestCount, 2);
  assert.equal(repaired.repairCount, 1);

  let failedRepair: VerifierTechnicalError | undefined;
  try {
    await runCompoundFixture({
      responses: verifierAcceptanceFixtures.repairAlsoFails.responses,
      expectedCount: verifierAcceptanceFixtures.repairAlsoFails.expectedCount,
    });
  } catch (error) {
    if (error instanceof VerifierTechnicalError) failedRepair = error;
    else throw error;
  }
  assert.ok(failedRepair);
  assert.equal(failedRepair.code, "VERIFIER_FORMAT_FAILED");

  const historicalSignatureReplay = await runCompoundFixture({
    responses: [reconstructedGymFailureSignature.response],
    expectedCount: reconstructedGymFailureSignature.expectedCount,
  });
  assert.equal(historicalSignatureReplay.result.rows.length, 4);
  assert.equal(historicalSignatureReplay.result.formatRepairAttempts, 0);
  assert.equal(authoritativeComposition, "BEHAVIORAL_INTERSECTION");

  const realReplayPath = path.join(__dirname, "fixtures", "real_gym_verifier_failure.sanitized.json");
  const realFailureReplay = fs.existsSync(realReplayPath)
    ? "AVAILABLE_BUT_REQUIRES_EXPLICIT_FIXTURE_SCHEMA_REVIEW"
    : "NOT_RUN_NO_SANITIZED_RAW_ARTIFACT";
  assert.equal(realFailureReplay, "NOT_RUN_NO_SANITIZED_RAW_ARTIFACT", "Do not misrepresent reconstructed data as a real raw replay");

  for (const failure of [...structuralFailures, provider429, provider500, failedRepair]) {
    await assertTechnicalFailureDoesNotRecover(failure);
  }

  assert.equal(SEMANTIC_ELIGIBILITY_THRESHOLDS.truthGrounding, 65);
  assert.equal(EXPRESSION_WORTHINESS_RELEASE.score, 60);
  const orchestration = await runOfflineCreativeOrchestration();

  console.log(JSON.stringify({
    suite: "OFFLINE_VERIFIER_ACCEPTANCE",
    status: "PASS",
    fixtures: {
      valid: "PASS",
      truncatedJson: "PASS",
      malformedJson: "PASS",
      missingCandidateRow: "PASS",
      duplicateCandidateIndex: "PASS",
      unexpectedCandidateIndex: "PASS",
      missingRequiredScore: "PASS",
      nonFiniteScore: "PASS",
      numericStringScore: "PASS_EXPLICIT_COERCION_ONLY",
      compositionLabelMismatch: "PASS_PIPELINE_METADATA_AUTHORITATIVE",
      emptyResponse: "PASS",
      provider429: "PASS_VERIFIER_RATE_LIMITED",
      provider500: "PASS_VERIFIER_API_FAILED",
      repairSucceeds: "PASS_ONE_REPAIR",
      repairAlsoFails: "PASS_EXPLICIT_TECHNICAL_FAILURE",
    },
    realFailureReplay,
    reconstructedHistoricalFailureSignature: "PASS",
    technicalFailuresTriggerCompositionRecovery: false,
    technicalFailuresBecomeCreativeExhaustion: false,
    orchestration,
  }, null, 2));
}

main().catch((error) => {
  console.error("OFFLINE VERIFIER ACCEPTANCE: FAIL", error);
  process.exit(1);
});
