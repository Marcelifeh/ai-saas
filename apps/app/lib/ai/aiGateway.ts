import "server-only";
import OpenAI from "openai";
import { env } from "@/env";
import { logError } from "../utils/logger";
import { recordAIUsage, type AIUsageRecord } from "../services/usageService";

let clientInstance: OpenAI | null = null;

function getClient(): OpenAI {
    if (!env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY environment variable. API requests cannot proceed.");
    }
    if (!clientInstance) {
        clientInstance = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }
    return clientInstance;
}

export interface ChatCompletionSafeResult<T> {
    data: T | null;
    error: boolean;
    message?: string;
}

export type ChatCompletionParams = OpenAI.Chat.ChatCompletionCreateParamsNonStreaming;

export interface ChatCompletionOptions extends ChatCompletionParams {
    usageContext?: Pick<AIUsageRecord, "userId" | "workspaceId" | "feature">;
}

/**
 * Wrapper around OpenAI chat.completions.create that standardizes error
 * handling and records token usage when available.
 */
export async function chatCompletionSafe(
    options: ChatCompletionOptions
): Promise<ChatCompletionSafeResult<OpenAI.Chat.ChatCompletion>> {
    try {
        const { usageContext, ...params } = options;
        const client = getClient();
        const completion = await client.chat.completions.create(params);

        if (usageContext && completion.usage) {
            await recordAIUsage({
                ...usageContext,
                model: params.model,
                tokensIn: completion.usage.prompt_tokens ?? undefined,
                tokensOut: completion.usage.completion_tokens ?? undefined,
            });
        }

        return { data: completion, error: false };
    } catch (error: any) {
        logError("AI Chat Completion Error", error);
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
    try {
        const { usageContext, input, model = "text-embedding-3-small" } = options;
        const client = getClient();
        const response = await client.embeddings.create({ input, model });

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
        logError("AI Embedding Error", error);
        return {
            data: null,
            error: true,
            message: error?.message || "Embedding Request Failed",
        };
    }
}
