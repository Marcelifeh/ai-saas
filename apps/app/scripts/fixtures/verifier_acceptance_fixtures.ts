export interface OfflineVerifierModelResponse {
  content: string;
  finishReason?: string | null;
}

export function compoundJudgmentRow(index: number, overrides: Record<string, unknown> = {}) {
  return {
    index,
    sharedPremise: "Preparation turns discipline into repeatable progress",
    axisSupport: [
      { axis: "Gym Lovers", support: 84, presence: 76 },
      { axis: "Meal Preppers", support: 86, presence: 78 },
    ],
    sharedPremiseSupport: 84,
    mutualDependence: 82,
    adjacencyRisk: 12,
    contextDependenceRisk: 18,
    unsupportedInferenceRisk: 10,
    intersectionPreservation: 85,
    reasons: [],
    ...overrides,
  };
}

function jsonResponse(rows: unknown[]): OfflineVerifierModelResponse {
  return { content: JSON.stringify({ assessments: rows }) };
}

const missingScoreRow = compoundJudgmentRow(0) as Record<string, unknown>;
delete missingScoreRow.mutualDependence;

const finiteResponse = JSON.stringify({ assessments: [compoundJudgmentRow(0)] });
const nonFiniteResponse = finiteResponse.replace('"mutualDependence":82', '"mutualDependence":1e309');

export const verifierAcceptanceFixtures = {
  valid: {
    expectedCount: 2,
    response: jsonResponse([compoundJudgmentRow(0), compoundJudgmentRow(1)]),
  },
  truncatedJson: {
    expectedCount: 1,
    response: { content: '{"assessments":[{"index":0', finishReason: "length" } satisfies OfflineVerifierModelResponse,
  },
  malformedJson: {
    expectedCount: 1,
    response: { content: '{"assessments":[{"index":0}' } satisfies OfflineVerifierModelResponse,
  },
  missingCandidateRow: {
    expectedCount: 2,
    response: jsonResponse([compoundJudgmentRow(0)]),
  },
  duplicateCandidateIndex: {
    expectedCount: 2,
    response: jsonResponse([compoundJudgmentRow(0), compoundJudgmentRow(0)]),
  },
  unexpectedCandidateIndex: {
    expectedCount: 1,
    response: jsonResponse([compoundJudgmentRow(7)]),
  },
  missingRequiredScore: {
    expectedCount: 1,
    response: jsonResponse([missingScoreRow]),
  },
  nonFiniteScore: {
    expectedCount: 1,
    response: { content: nonFiniteResponse } satisfies OfflineVerifierModelResponse,
  },
  numericStringScore: {
    expectedCount: 1,
    response: { assessments: [{ index: 0, score: "72" }] },
  },
  compositionLabelMismatch: {
    expectedCount: 1,
    response: jsonResponse([compoundJudgmentRow(0, { compositionType: "CULTURAL_INTERSECTION" })]),
  },
  emptyResponse: {
    expectedCount: 1,
    response: { content: "" } satisfies OfflineVerifierModelResponse,
  },
  repairSucceeds: {
    expectedCount: 1,
    responses: [
      jsonResponse([]),
      jsonResponse([compoundJudgmentRow(0)]),
    ],
  },
  repairAlsoFails: {
    expectedCount: 1,
    responses: [
      { content: "{}" } satisfies OfflineVerifierModelResponse,
      { content: '{"assessments":[' } satisfies OfflineVerifierModelResponse,
    ],
  },
} as const;

/**
 * Reconstructed only from the sanitized historical diagnostic: candidate 3
 * returned a conflicting composition label. This is not represented as the
 * missing raw provider response.
 */
export const reconstructedGymFailureSignature = {
  expectedCount: 4,
  response: jsonResponse([
    compoundJudgmentRow(0),
    compoundJudgmentRow(1),
    compoundJudgmentRow(2),
    compoundJudgmentRow(3, { compositionType: "CULTURAL_INTERSECTION" }),
  ]),
};

export const offlineCreativeOrchestrationFixture = {
  profile: {
    niche: "Gym Lovers × Meal Preppers",
    status: "SUFFICIENT",
    composition: {
      kind: "compound" as const,
      axes: ["Gym Lovers", "Meal Preppers"],
      compositionType: "BEHAVIORAL_INTERSECTION" as const,
      sharedPremise: "Preparation is part of disciplined progress",
      confidence: 88,
    },
    secondaryComposition: {
      kind: "compound" as const,
      axes: ["Gym Lovers", "Meal Preppers"],
      compositionType: "RITUAL_INTERSECTION" as const,
      sharedPremise: "Repeated preparation structures the week",
      confidence: 73,
    },
  },
  territories: [
    { id: "discipline", premise: "Progress is prepared before it is performed" },
  ],
  expressionIntents: [
    { id: "identity", type: "IDENTITY_CLAIM", premise: "Preparation signals disciplined identity" },
  ],
  candidates: [
    { slogan: "Progress Starts Before Monday", territoryId: "discipline", intentId: "identity" },
    { slogan: "Gym Life", territoryId: "discipline", intentId: "identity" },
  ],
  semanticResponse: {
    content: JSON.stringify({
      assessments: [
        {
          index: 0,
          truthGrounding: 84,
          productIndependence: 88,
          intersectionIntegrity: 82,
          semanticCoherence: 86,
          unsupportedInferenceRisk: 12,
          axisGrounding: [
            { axis: "Gym Lovers", grounding: 82 },
            { axis: "Meal Preppers", grounding: 84 },
          ],
          reasons: [],
        },
        {
          index: 1,
          truthGrounding: 55,
          productIndependence: 78,
          intersectionIntegrity: 20,
          semanticCoherence: 70,
          unsupportedInferenceRisk: 18,
          axisGrounding: [
            { axis: "Gym Lovers", grounding: 78 },
            { axis: "Meal Preppers", grounding: 8 },
          ],
          reasons: ["One-axis collapse"],
        },
      ],
    }),
  } satisfies OfflineVerifierModelResponse,
  expressionWorthinessResponse: {
    content: JSON.stringify({
      assessments: [
        {
          index: 0,
          conceptKey: "progress begins in preparation",
          selfRecognition: 82,
          identityProjection: 80,
          insiderResonance: 76,
          conceptualTransformation: 78,
          naturalness: 84,
          wearability: 82,
          creativeConstraintAlignment: 88,
          expressionMode: "SYMBOLIC_EXPRESSION",
          diagnosticTraits: ["IDENTITY_BEARING", "SOCIALLY_SIGNALABLE", "NATURALLY_SPEAKABLE"],
          reasons: [],
        },
      ],
    }),
  } satisfies OfflineVerifierModelResponse,
};
