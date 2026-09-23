import "server-only";
import OpenAI from "openai";
import { env } from "@/env";
import { logError } from "../utils/logger";
import { recordAIUsage, type AIUsageRecord } from "../services/usageService";
import { legacyModels, modelCapabilities, routeModel, type AITaskContext } from "./modelRouting";
import { recordAICall, type AICallTelemetry } from "./aiTelemetry";
import { AsyncLocalStorage } from "node:async_hooks";

let clientInstance: OpenAI | null = null;
const transportAttempts = new AsyncLocalStorage<{ count: number }>();

function getClient(): OpenAI {
    if (!env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY environment variable. API requests cannot proceed.");
    }
    if (!clientInstance) {
        clientInstance = new OpenAI({ apiKey: env.OPENAI_API_KEY, fetch: async (url, init) => {
            const counter = transportAttempts.getStore();
            if (counter) counter.count += 1;
            return fetch(url, init);
        } });
    }
    return clientInstance;
}

export interface ChatCompletionSafeResult<T> {
    data: T | null;
    error: boolean;
    message?: string;
    telemetry?: AICallTelemetry;
}

export type ChatCompletionParams = OpenAI.Chat.ChatCompletionCreateParamsNonStreaming;

export interface ChatCompletionOptions extends ChatCompletionParams {
    aiTask?: AITaskContext;
    usageContext?: Pick<AIUsageRecord, "userId" | "workspaceId" | "feature">;
}

/**
 * Wrapper around OpenAI chat.completions.create that standardizes error
 * handling and records token usage when available.
 */
export async function chatCompletionSafe(
    options: ChatCompletionOptions
): Promise<ChatCompletionSafeResult<OpenAI.Chat.ChatCompletion>> {
    const started = Date.now();
    const { usageContext, aiTask = { taskType: "OTHER" }, ...params } = options;
    let selected: ReturnType<typeof routeModel> | undefined;
    let dispatched = false;
    let recorded = false;
    const attempts = { count: 0 };
    try {
        selected = routeModel(aiTask, params.model);
        if (selected.enabled) {
            const capabilities = modelCapabilities(selected.modelName);
            params.model = selected.modelName;
            if (!capabilities.temperature) delete params.temperature;
            if (capabilities.reasoning) params.reasoning_effort = selected.reasoningLevel?.toLowerCase() as "low" | "medium" | "high";
            else delete params.reasoning_effort;
            if (capabilities.completionTokens && params.max_tokens != null) {
                // Reasoning shares the completion budget. Keep visible-output headroom bounded.
                params.max_completion_tokens = params.max_tokens + 8192;
                delete params.max_tokens;
            }
        }
        const client = getClient();
        dispatched = true;
        const completion = await transportAttempts.run(attempts, () => client.chat.completions.create(params));
        const choice = completion.choices[0];
        const telemetry = recordAICall({ taskType: aiTask.taskType, ...selected,
            servedModelName: completion.model,
            reasoningLevel: params.reasoning_effort ? selected.reasoningLevel : undefined,
            latencyMs: Date.now() - started, inputTokens: completion.usage?.prompt_tokens ?? 0,
            outputTokens: completion.usage?.completion_tokens ?? 0,
            usageReported: !!completion.usage,
            cachedInputTokens: completion.usage?.prompt_tokens_details?.cached_tokens ?? 0,
            retryCount: Math.max(0, attempts.count - 1), repairCount: aiTask.repairCount ?? 0,
            success: !!choice && !choice.message.refusal && choice.finish_reason !== "length",
            errorCategory: choice?.message.refusal ? "REFUSAL" : !choice || choice.finish_reason === "length" ? "INCOMPLETE" : undefined,
        });
        recorded = true;

        if (usageContext && completion.usage) {
            await recordAIUsage({
                ...usageContext,
                model: params.model,
                tokensIn: completion.usage.prompt_tokens ?? undefined,
                tokensOut: completion.usage.completion_tokens ?? undefined,
            });
        }

        return { data: completion, error: false, telemetry };
    } catch (error: any) {
        if (!recorded) recordAICall({ taskType: aiTask.taskType, modelTier: selected?.modelTier ?? "CONTROL",
            modelName: selected?.modelName ?? options.model, reasoningLevel: params.reasoning_effort ? selected?.reasoningLevel : undefined,
            latencyMs: Date.now() - started, inputTokens: 0, outputTokens: 0, cachedInputTokens: 0,
            usageReported: false,
            retryCount: Math.max(0, attempts.count - 1), repairCount: aiTask.repairCount ?? 0, success: false,
            errorCategory: !dispatched ? "CONFIGURATION" : error?.status === 429 ? "RATE_LIMITED" : "API_FAILED",
        });
        logError("AI Chat Completion Error", { status: error?.status, category: "API_FAILED" });
        return {
            data: null,
            error: true,
            message: error?.message || "LLM Request Failed",
        };
    }
}

export interface EmbeddingOptions {
    input: string[];
    model?: string;
    usageContext?: Pick<AIUsageRecord, "userId" | "workspaceId" | "feature">;
}

export async function createEmbeddingsSafe(
    options: EmbeddingOptions
): Promise<ChatCompletionSafeResult<any>> {
    const started = Date.now();
    const attempts = { count: 0 };
    const modelName = options.model ?? legacyModels.embedding;
    let recorded = false;
    try {
        const { usageContext, input, model = legacyModels.embedding } = options;
        const client = getClient();
        const response = await transportAttempts.run(attempts, () => client.embeddings.create({ input, model }));
        recordAICall({ taskType: "OTHER", modelTier: "CONTROL", modelName,
            latencyMs: Date.now() - started, inputTokens: response.usage.prompt_tokens,
            usageReported: true,
            outputTokens: 0, cachedInputTokens: 0, retryCount: Math.max(0, attempts.count - 1), repairCount: 0, success: true,
        });
        recorded = true;

        if (usageContext && (response as any).usage) {
            const usage = (response as any).usage;
            await recordAIUsage({
                ...usageContext,
                model,
                tokensIn: usage.prompt_tokens ?? undefined,
                tokensOut: usage.total_tokens ?? undefined,
            });
        }

        return { data: response, error: false };
    } catch (error: any) {
        if (!recorded) recordAICall({ taskType: "OTHER", modelTier: "CONTROL", modelName,
            latencyMs: Date.now() - started, inputTokens: 0, outputTokens: 0, cachedInputTokens: 0,
            usageReported: false,
            retryCount: Math.max(0, attempts.count - 1), repairCount: 0, success: false,
            errorCategory: error?.status === 429 ? "RATE_LIMITED" : "API_FAILED",
        });
        logError("AI Embedding Error", { status: error?.status, category: "API_FAILED" });
        return {
            data: null,
            error: true,
            message: error?.message || "Embedding Request Failed",
        };
    }
}
