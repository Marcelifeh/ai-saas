import type { NicheComposition } from "./dynamicNicheProfile";
import {
  EXPRESSION_WORTHINESS_RELEASE,
  type ExpressionWorthinessAssessment,
} from "./expressionWorthiness";

export const MIN_RECOVERY_COMPOSITION_CONFIDENCE = 60;

export type CreativeFailureStage =
  | "PROFILE_INSUFFICIENT_EVIDENCE"
  | "NO_ELIGIBLE_INTENTS"
  | "NO_SEMANTIC_SURVIVORS"
  | "NO_EXPRESSION_WORTHY_SURVIVORS"
  | "GENERATION_EXHAUSTED";

export interface CompositionAttemptCounts {
  generatedCount: number;
  semanticSurvivorCount: number;
  expressionWorthyCount: number;
  rankedCount: number;
}

export interface CompositionRecoveryDiagnostics {
  primaryComposition?: NicheComposition["compositionType"];
  secondaryComposition?: NicheComposition["compositionType"];
  primaryRankedCount: number;
  secondaryAttemptUsed: boolean;
  secondaryRankedCount: number;
  primary: CompositionAttemptCounts;
  secondary?: CompositionAttemptCounts;
  dominantSemanticFailures: string[];
  dominantExpressionFailures: string[];
  failureStage?: CreativeFailureStage;
}

function normalizedPremise(value: string | undefined): string {
  return (value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Materialize at most one independently source-supported alternative.
 * Classifier output is only a proposal: both axes and original evidence must
 * still be present before the alternative can drive a creative attempt.
 */
export function selectSupportedSecondaryComposition(
  primary: NicheComposition | undefined,
): NicheComposition | undefined {
  if (!primary || primary.kind !== "compound" || primary.axes.length < 2) return undefined;

  const primaryPremise = normalizedPremise(primary.sharedPremise);
  const axes = new Set(primary.axes.map((axis) => axis.toLowerCase()));
  const alternative = (primary.alternativeCompositionTypes ?? []).find((candidate) => {
    if (candidate.compositionType === primary.compositionType) return false;
    if (candidate.confidence < MIN_RECOVERY_COMPOSITION_CONFIDENCE) return false;
    if (!candidate.sharedPremise || normalizedPremise(candidate.sharedPremise) === primaryPremise) return false;
    if ((candidate.evidenceRefs ?? []).length === 0) return false;
    const roleAxes = new Set((candidate.axisRoles ?? []).map((role) => role.axis.toLowerCase()));
    return axes.size === roleAxes.size && [...axes].every((axis) => roleAxes.has(axis));
  });

  if (!alternative) return undefined;
  return {
    kind: "compound",
    axes: [...primary.axes],
    compositionType: alternative.compositionType,
    sharedPremise: alternative.sharedPremise,
    axisRoles: alternative.axisRoles,
    evidenceRefs: alternative.evidenceRefs,
    confidence: alternative.confidence,
    compositionConfidence: alternative.confidence,
  };
}

export interface BoundedCompositionRecoveryResult<T> {
  result: T;
  secondaryAttemptUsed: boolean;
  secondaryResult?: T;
}

/** Runs no more than one secondary attempt and only after outcome failure. */
export async function runBoundedCompositionRecovery<T>(input: {
  primaryResult: T;
  secondaryComposition?: NicheComposition;
  releasedCount: (result: T) => number;
  runSecondary: (composition: NicheComposition) => Promise<T>;
}): Promise<BoundedCompositionRecoveryResult<T>> {
  if (input.releasedCount(input.primaryResult) > 0 || !input.secondaryComposition) {
    return { result: input.primaryResult, secondaryAttemptUsed: false };
  }
  const secondaryResult = await input.runSecondary(input.secondaryComposition);
  return {
    result: secondaryResult,
    secondaryAttemptUsed: true,
    secondaryResult,
  };
}

export function dominantSemanticFailures(counts: Record<string, number> | undefined): string[] {
  return Object.entries(counts ?? {})
    .filter(([, count]) => count > 0)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 4)
    .map(([dimension]) => dimension);
}

export function dominantExpressionFailures(
  assessments: ExpressionWorthinessAssessment[] | undefined,
): string[] {
  const failures: Record<string, number> = {};
  for (const assessment of assessments ?? []) {
    if (assessment.score < EXPRESSION_WORTHINESS_RELEASE.score) failures.score = (failures.score ?? 0) + 1;
    if (assessment.expressionMode !== "SYMBOLIC_EXPRESSION") failures.expressionMode = (failures.expressionMode ?? 0) + 1;
    for (const dimension of [
      "conceptualTransformation",
      "naturalness",
      "wearability",
      "creativeConstraintAlignment",
    ] as const) {
      if (assessment[dimension] < EXPRESSION_WORTHINESS_RELEASE[dimension]) {
        failures[dimension] = (failures[dimension] ?? 0) + 1;
      }
    }
  }
  return dominantSemanticFailures(failures);
}

export function mergeReleasedItems<T>(
  primary: T[],
  secondary: T[],
  conceptKey: (item: T) => string,
): T[] {
  const seen = new Set<string>();
  return [...primary, ...secondary].filter((item) => {
    const key = conceptKey(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
