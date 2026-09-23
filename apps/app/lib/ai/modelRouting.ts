import { AsyncLocalStorage } from "node:async_hooks";

export type ModelCapabilityTier = "FAST" | "BALANCED" | "REASONING";
export type ReasoningLevel = "LOW" | "MEDIUM" | "HIGH";
export type RoutingStrategy = "CONTROL" | "BALANCED_FIRST" | "REASONING_HEAVY";
export type AITaskType = "EXTRACTION" | "NORMALIZATION" | "NICHE_DECOMPOSITION" |
  "PROFILE_REASONING" | "COMPOSITION_INFERENCE" | "TERRITORY_GENERATION" |
  "EXPRESSION_INTENT" | "SLOGAN_GENERATION" | "COMPRESSION" | "SEMANTIC_VERIFICATION" |
  "INTERSECTION_VERIFICATION" | "EXPRESSION_VERIFICATION" | "INTENT_VERIFICATION" |
  "PROVENANCE_VERIFICATION" | "STRUCTURAL_EVALUATION" | "LISTING" | "DESIGN" | "RECOVERY" | "OTHER";
export interface AIComplexityContext {
  isCompound?: boolean;
  /** Confidence and survivor rates are normalized to [0, 1]. */
  compositionConfidence?: number;
  evidenceConfidence?: number;
  unresolvedEvidenceFacts?: number;
  primaryAttemptFailed?: boolean;
  semanticSurvivorRate?: number;
  expressionWorthyRate?: number;
  verifierConflict?: boolean;
}
export interface AITaskContext { taskType: AITaskType; complexity?: AIComplexityContext; repairCount?: number }
const scope = new AsyncLocalStorage<{ strategy?: RoutingStrategy; complexity?: AIComplexityContext }>();
export function withModelRouting<T>(strategy: RoutingStrategy, work: () => T): T {
  return scope.run({ ...scope.getStore(), strategy }, work);
}
export function withAIComplexity<T>(complexity: AIComplexityContext, work: () => T): T {
  return scope.run({ ...scope.getStore(), complexity: { ...scope.getStore()?.complexity, ...complexity } }, work);
}
export function routingStrategy(env: Record<string, string | undefined> = process.env): RoutingStrategy {
  return scope.getStore()?.strategy ?? (env.AI_MODEL_ROUTING_ENABLED === "true" ? "BALANCED_FIRST" : "CONTROL");
}
// Preserve the precise pre-routing defaults and overrides, including the older compound verifier.
export const legacyModels = {
  utility: "gpt-4o-mini",
  creative: () => process.env.OPENAI_SLOGAN_CREATIVE_MODEL?.trim() || "gpt-4.1",
  verifier: () => process.env.OPENAI_SLOGAN_VERIFIER_MODEL?.trim() || "gpt-4.1",
  intersection: () => process.env.OPENAI_SLOGAN_VERIFIER_MODEL?.trim() || "gpt-4o",
  embedding: "text-embedding-3-small",
};
const defaults: Record<ModelCapabilityTier, string> = {
  FAST: "gpt-4o-mini-2024-07-18", BALANCED: "gpt-4.1-2025-04-14", REASONING: "o3-2025-04-16",
};
const fast = new Set<AITaskType>(["EXTRACTION", "NORMALIZATION", "OTHER"]);
const verifiers = new Set<AITaskType>(["SEMANTIC_VERIFICATION", "INTERSECTION_VERIFICATION", "EXPRESSION_VERIFICATION", "INTENT_VERIFICATION", "PROVENANCE_VERIFICATION"]);
const escalatable = new Set<AITaskType>(["COMPOSITION_INFERENCE", "NICHE_DECOMPOSITION", "EXPRESSION_INTENT", "TERRITORY_GENERATION", "PROFILE_REASONING"]);
function effort(value: string | undefined, fallback: ReasoningLevel): ReasoningLevel {
  const upper = value?.toUpperCase();
  if (!upper) return fallback;
  if (upper !== "LOW" && upper !== "MEDIUM" && upper !== "HIGH") throw new Error("Invalid AI reasoning configuration");
  return upper;
}
export function routeModel(task: AITaskContext, legacyModel: string, env: Record<string, string | undefined> = process.env) {
  const strategy = routingStrategy(env);
  const context = { ...scope.getStore()?.complexity, ...task.complexity };
  if (strategy === "CONTROL") return { enabled: false, modelName: legacyModel, modelTier: "CONTROL" as const, reasoningLevel: undefined };
  let modelTier: ModelCapabilityTier = fast.has(task.taskType) ? "FAST" : verifiers.has(task.taskType) || task.taskType === "RECOVERY" ? "REASONING" : "BALANCED";
  const difficult = context.isCompound && ((context.compositionConfidence ?? 1) < 0.6 || (context.evidenceConfidence ?? 1) < 0.5 || (context.unresolvedEvidenceFacts ?? 0) > 2 || context.verifierConflict);
  const recovery = context.primaryAttemptFailed && !fast.has(task.taskType);
  if ((escalatable.has(task.taskType) && difficult) || recovery) modelTier = "REASONING";
  if (strategy === "REASONING_HEAVY") modelTier = modelTier === "FAST" ? "BALANCED" : "REASONING";
  const reasoningLevel = effort(
    task.taskType === "RECOVERY" || recovery ? env.AI_REASONING_RECOVERY : verifiers.has(task.taskType) ? env.AI_REASONING_VERIFIER : env.AI_REASONING_DEFAULT,
    task.taskType === "RECOVERY" || recovery || (context.isCompound && (context.compositionConfidence ?? 1) < 0.35) ? "HIGH" : modelTier === "FAST" ? "LOW" : "MEDIUM",
  );
  return { enabled: true, modelTier, modelName: env[`AI_MODEL_${modelTier}`]?.trim() || defaults[modelTier], reasoningLevel };
}

export interface ModelCapabilities { reasoning: boolean; temperature: boolean; strict: boolean; completionTokens: boolean }
// Provider compatibility belongs here, never in semantic routing. Unknown overrides fail closed.
export function modelCapabilities(model: string, env: Record<string, string | undefined> = process.env): ModelCapabilities {
  const overrides = JSON.parse(env.AI_MODEL_CAPABILITIES_JSON || "{}") as Record<string, ModelCapabilities>;
  const configured = overrides[model];
  if (configured && [configured.reasoning, configured.temperature, configured.strict, configured.completionTokens].every(x => typeof x === "boolean")) return configured;
  if (/^o3(?:-2025-04-16)?$/.test(model)) return { reasoning: true, temperature: false, strict: true, completionTokens: true };
  if (/^gpt-4\.1(?:-2025-04-14)?$|^gpt-4o-mini(?:-2024-07-18)?$|^gpt-4o(?:-2024-08-06|-2024-11-20)?$/.test(model)) return { reasoning: false, temperature: true, strict: true, completionTokens: false };
  throw new Error("Configured AI model requires an explicit capability entry");
}
export function profileComplexity(profile: { nicheComposition?: { kind: string; compositionConfidence?: number; confidence?: number } }): AIComplexityContext {
  const composition = profile.nicheComposition;
  return { isCompound: composition?.kind === "compound", compositionConfidence: composition?.compositionConfidence === undefined ? undefined : composition.compositionConfidence / 100 };
}
