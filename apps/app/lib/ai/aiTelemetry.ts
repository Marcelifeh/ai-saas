import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { estimateModelCost, readModelPricing } from "./modelPricing";
import type { AITaskType, ModelCapabilityTier, ReasoningLevel } from "./modelRouting";

export interface AICallTelemetry {
  runId: string; taskType: AITaskType; modelTier: ModelCapabilityTier | "CONTROL";
  modelName: string; servedModelName?: string; reasoningLevel?: ReasoningLevel; latencyMs: number;
  inputTokens: number; outputTokens: number; cachedInputTokens: number;
  usageReported?: boolean;
  retryCount: number | null; repairCount: number; success: boolean;
  errorCategory?: "RATE_LIMITED" | "API_FAILED" | "INCOMPLETE" | "REFUSAL" | "CONFIGURATION" | "STRUCTURAL_FAILURE";
  estimatedCost: number | null;
}
type RunProgress = (runId: string, calls: AICallTelemetry[], durationMs: number) => void;
const runs = new AsyncLocalStorage<{ runId: string; calls: AICallTelemetry[]; started: number; onProgress?: RunProgress }>();
export function recordAICall(call: Omit<AICallTelemetry, "runId" | "estimatedCost">): AICallTelemetry {
  const run = runs.getStore();
  // Allowlist every field; no prompts, error messages, or provider payloads enter telemetry.
  let estimatedCost: number | null = null;
  try { if (call.usageReported !== false) estimatedCost = estimateModelCost(call.modelName, call.inputTokens, call.outputTokens, call.cachedInputTokens, readModelPricing()); } catch { /* Bad pricing must not alter creative behavior. */ }
  const record: AICallTelemetry = {
    runId: run?.runId ?? randomUUID(), taskType: call.taskType, modelTier: call.modelTier,
    modelName: call.modelName, servedModelName: call.servedModelName, reasoningLevel: call.reasoningLevel, latencyMs: call.latencyMs,
    inputTokens: call.inputTokens, outputTokens: call.outputTokens, cachedInputTokens: call.cachedInputTokens,
    usageReported: call.usageReported,
    retryCount: call.retryCount, repairCount: call.repairCount, success: call.success,
    errorCategory: call.errorCategory, estimatedCost,
  };
  run?.calls.push(record);
  try { if (run) run.onProgress?.(run.runId, run.calls, Date.now() - run.started); } catch { /* Observability must not change pipeline outcomes. */ }
  console.info("[AI_CALL]", JSON.stringify(record));
  return record;
}
export function recordVerifierStructuralFailure(call?: AICallTelemetry): void {
  if (!call) return;
  call.success = false;
  call.errorCategory = "STRUCTURAL_FAILURE";
  const run = runs.getStore();
  try { if (run) run.onProgress?.(run.runId, run.calls, Date.now() - run.started); } catch { /* Non-blocking telemetry. */ }
  console.info("[AI_VERIFIER_VALIDATION]", JSON.stringify({ runId: call.runId, taskType: call.taskType, modelName: call.modelName, errorCategory: call.errorCategory }));
}
export function aggregateAICalls(calls: AICallTelemetry[], durationMs: number) {
  const callsByTier: Record<string, number> = {};
  const callsByTask: Record<string, number> = {};
  for (const call of calls) { callsByTier[call.modelTier] = (callsByTier[call.modelTier] ?? 0) + 1; callsByTask[call.taskType] = (callsByTask[call.taskType] ?? 0) + 1; }
  return { totalAICalls: calls.length, callsByTier, callsByTask,
    totalProviderAttempts: calls.some(c => c.retryCount === null) ? null : calls.reduce((n, c) => n + 1 + (c.retryCount ?? 0), 0),
    inputTokens: calls.reduce((n, c) => n + c.inputTokens, 0), outputTokens: calls.reduce((n, c) => n + c.outputTokens, 0),
    estimatedAICostPerRun: calls.some(c => c.estimatedCost === null) ? null : calls.reduce((n, c) => n + (c.estimatedCost ?? 0), 0),
    aiLatencyMs: calls.reduce((n, c) => n + c.latencyMs, 0), pipelineDurationMs: durationMs,
    repairAttempts: calls.reduce((n, c) => n + c.repairCount, 0),
    verifierStructuralFailures: calls.filter(c => c.errorCategory === "STRUCTURAL_FAILURE").length,
  };
}
export async function captureAIRun<T>(work: () => Promise<T>, onProgress?: RunProgress) {
  const run = { runId: randomUUID(), calls: [] as AICallTelemetry[], started: Date.now(), onProgress };
  return runs.run(run, async () => {
    try { const result = await work(); return { result, runId: run.runId, calls: run.calls, summary: aggregateAICalls(run.calls, Date.now() - run.started) }; }
    finally { console.info("[AI_RUN]", JSON.stringify({ runId: run.runId, ...aggregateAICalls(run.calls, Date.now() - run.started) })); }
  });
}
export async function withAIRun<T>(work: () => Promise<T>): Promise<T> {
  return runs.getStore() ? work() : (await captureAIRun(work)).result;
}
