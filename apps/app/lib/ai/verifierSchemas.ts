import { z } from "zod";
import { strictVerifierScoreSchema } from "./structuredVerifier";

const candidateIndexSchema = z.number().int().nonnegative();
const reasonsSchema = z.array(z.string());

export const semanticEligibilityVerifierRowSchema = z.object({
  index: candidateIndexSchema,
  truthGrounding: strictVerifierScoreSchema,
  productIndependence: strictVerifierScoreSchema,
  intersectionIntegrity: strictVerifierScoreSchema,
  semanticCoherence: strictVerifierScoreSchema,
  unsupportedInferenceRisk: strictVerifierScoreSchema,
  axisGrounding: z.array(z.object({
    axis: z.string().min(1),
    grounding: strictVerifierScoreSchema,
  }).strict()),
  reasons: reasonsSchema,
}).strict();

export type SemanticEligibilityVerifierRow = z.infer<typeof semanticEligibilityVerifierRowSchema>;

export const blindReadingVerifierRowSchema = z.object({
  index: candidateIndexSchema,
  expressedPremise: z.string(),
  semanticCues: z.array(z.string()),
  genericityRisk: strictVerifierScoreSchema,
}).strict();

export type BlindReadingVerifierRow = z.infer<typeof blindReadingVerifierRowSchema>;

const compoundIntersectionJudgmentSchema = z.object({
  index: candidateIndexSchema,
  sharedPremise: z.string(),
  axisSupport: z.array(z.object({
    axis: z.string().min(1),
    support: strictVerifierScoreSchema,
    presence: strictVerifierScoreSchema,
  }).strict()),
  sharedPremiseSupport: strictVerifierScoreSchema,
  mutualDependence: strictVerifierScoreSchema,
  adjacencyRisk: strictVerifierScoreSchema,
  contextDependenceRisk: strictVerifierScoreSchema,
  unsupportedInferenceRisk: strictVerifierScoreSchema,
  intersectionPreservation: strictVerifierScoreSchema,
  reasons: reasonsSchema,
}).strict();

function omitAuthoritativeCompositionMetadata(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const {
    compositionType: _compositionType,
    compositionHypothesis: _compositionHypothesis,
    compositionHypothesisId: _compositionHypothesisId,
    ...judgment
  } = value as Record<string, unknown>;
  return judgment;
}

// Composition metadata belongs to the pipeline. Explicitly discard any
// model-authored copy before validating the judgment-only contract.
export const compoundIntersectionVerifierRowSchema = z.preprocess(
  omitAuthoritativeCompositionMetadata,
  compoundIntersectionJudgmentSchema,
);

export type CompoundIntersectionVerifierRow = z.infer<typeof compoundIntersectionVerifierRowSchema>;

export const expressionIntentVerifierRowSchema = z.object({
  index: candidateIndexSchema,
  groundedness: strictVerifierScoreSchema,
  humanWearReason: strictVerifierScoreSchema,
  distinctiveHumanMeaning: strictVerifierScoreSchema,
  socialSignalSpecificity: strictVerifierScoreSchema,
  productIndependence: strictVerifierScoreSchema,
  intersectionPreservation: strictVerifierScoreSchema,
  decorativeDescriptionRisk: strictVerifierScoreSchema,
  unsupportedInferenceRisk: strictVerifierScoreSchema,
  reasons: reasonsSchema,
}).strict();

export const expressionWorthinessVerifierRowSchema = z.object({
  index: candidateIndexSchema,
  conceptKey: z.string(),
  selfRecognition: strictVerifierScoreSchema,
  identityProjection: strictVerifierScoreSchema,
  insiderResonance: strictVerifierScoreSchema,
  conceptualTransformation: strictVerifierScoreSchema,
  naturalness: strictVerifierScoreSchema,
  wearability: strictVerifierScoreSchema,
  creativeConstraintAlignment: strictVerifierScoreSchema,
  expressionMode: z.enum(["SYMBOLIC_EXPRESSION", "DECORATIVE_DESCRIPTION"]),
  diagnosticTraits: z.array(z.enum([
    "DESCRIPTIVE",
    "ATMOSPHERIC",
    "DECORATIVE",
    "POETIC",
    "GENERIC_MYSTICAL",
    "VISUAL_CAPTION",
    "AUDIENCE_DESCRIPTION",
    "IDENTITY_BEARING",
    "SOCIALLY_SIGNALABLE",
    "NATURALLY_SPEAKABLE",
  ])),
  reasons: reasonsSchema,
}).strict();

export const creativeBriefVerifierRowSchema = z.object({
  index: candidateIndexSchema,
  conceptualTransformation: strictVerifierScoreSchema,
  creativeConstraintAlignment: strictVerifierScoreSchema,
  reasons: reasonsSchema,
}).strict();
