import { createHash } from "node:crypto";

export const calibrationCases = ["Pumpkin spice and fall coffee humor", "Oktoberfest Sourdough Enthusiasts", "Black Cats × Halloween", "Gym Lovers × Meal Preppers", "Ceramic Artists × Tea Ritualists", "Indoor Plant Collectors", "Queer Identity × Birdwatching", "Sunday Coffee Ritual × Crossword Solving", "Pottery"];
export type FailureCategory = "PROFILE_API_FAILURE" | "PROFILE_FORMAT_FAILURE" | "COMPOSITION_FAILURE" | "INTENT_API_FAILURE" | "INTENT_FORMAT_FAILURE" | "GENERATION_API_FAILURE" | "SEMANTIC_VERIFIER_FAILURE" | "EXPRESSION_VERIFIER_FAILURE" | "PROVIDER_RATE_LIMIT" | "TIMEOUT" | "CREATIVE_ZERO";
export function classifyCalibrationFailure(input: { error?: string; taskType?: string; errorCategory?: string }): FailureCategory {
  if (input.error === "PIPELINE_TIMEOUT" || input.error === "TIMEOUT") return "TIMEOUT";
  if (input.errorCategory === "RATE_LIMITED" || input.error === "VERIFIER_RATE_LIMITED") return "PROVIDER_RATE_LIMIT";
  if (["GENERATION_EXHAUSTED", "NO_ELIGIBLE_SLOGANS", "CREATIVE_ZERO"].includes(input.error ?? "")) return "CREATIVE_ZERO";
  if (input.taskType === "COMPOSITION_INFERENCE") return "COMPOSITION_FAILURE";
  if (input.taskType === "PROFILE_REASONING") return input.errorCategory === "STRUCTURAL_FAILURE" || /FORMAT|INCOMPLETE/.test(input.error ?? "") ? "PROFILE_FORMAT_FAILURE" : "PROFILE_API_FAILURE";
  if (["EXPRESSION_INTENT", "INTENT_VERIFICATION"].includes(input.taskType ?? "")) return input.errorCategory === "STRUCTURAL_FAILURE" || /FORMAT|INCOMPLETE/.test(input.error ?? "") ? "INTENT_FORMAT_FAILURE" : "INTENT_API_FAILURE";
  if (["SEMANTIC_VERIFICATION", "INTERSECTION_VERIFICATION"].includes(input.taskType ?? "")) return "SEMANTIC_VERIFIER_FAILURE";
  if (input.taskType === "EXPRESSION_VERIFICATION") return "EXPRESSION_VERIFIER_FAILURE";
  if (input.error === "DYNAMIC_PROFILE_GENERATION_FAILED") return "PROFILE_API_FAILURE";
  return "GENERATION_API_FAILURE";
}
export function contentHash(value: unknown): string { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
export function freezeCopy<T>(value: T): T {
  const copy = JSON.parse(JSON.stringify(value));
  const freeze = (item: any): any => { if (item && typeof item === "object") { Object.values(item).forEach(freeze); Object.freeze(item); } return item; };
  return freeze(copy);
}
export const humanDimensions = ["nicheTruth", "selfRecognition", "originality", "naturalWearability", "purchaseAppeal", "overallPreference"] as const;
export function completedHumanReview(row: any): boolean {
  return humanDimensions.every(key => Number.isInteger(row.humanScore?.[key]) && row.humanScore[key] >= 1 && row.humanScore[key] <= 5) &&
    ["YES", "NO"].includes(row.wouldChooseForShirt) && ["HUMAN EXPRESSION", "CONCEPT DESCRIPTION"].includes(row.expressionJudgment) &&
    ["A", "B", "TIE", "NO_COMPARISON"].includes(row.overallPreference);
}
/** A null denominator/result means unavailable, not a free quality improvement. */
export function qualityEfficiency(gain: number | null, addedCost: number | null, addedSeconds: number | null, failureRate: number | null) {
  return { humanQualityGain: gain,
    gainPerAddedDollar: gain === null || addedCost === null || addedCost <= 0 ? null : gain / addedCost,
    gainPerAddedSecond: gain === null || addedSeconds === null || addedSeconds <= 0 ? null : gain / addedSeconds,
    riskAdjustedGain: gain === null || addedCost === null || addedSeconds === null || failureRate === null || addedCost <= 0 || addedSeconds <= 0 ? null : gain * (1 - failureRate) / (addedCost * addedSeconds),
  };
}
