"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatCompletionSafe = chatCompletionSafe;
exports.createEmbeddingsSafe = createEmbeddingsSafe;
// server-only removed for script runtime
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../../env");
const logger_1 = require("../utils/logger");
const usageService_1 = require("../services/usageService");
let clientInstance = null;
function getClient() {
    if (!env_1.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY environment variable. API requests cannot proceed.");
    }
    if (!clientInstance) {
        clientInstance = new openai_1.default({ apiKey: env_1.env.OPENAI_API_KEY });
    }
    return clientInstance;
}
/**
 * Wrapper around OpenAI chat.completions.create that standardizes error
 * handling and records token usage when available.
 */
async function chatCompletionSafe(options) {
    try {
        const { usageContext, ...params } = options;
        const client = getClient();
        const completion = await client.chat.completions.create(params);
        if (usageContext && completion.usage) {
            await (0, usageService_1.recordAIUsage)({
                ...usageContext,
                model: params.model,
                tokensIn: completion.usage.prompt_tokens ?? undefined,
                tokensOut: completion.usage.completion_tokens ?? undefined,
            });
        }
        return { data: completion, error: false };
    }
    catch (error) {
        (0, logger_1.logError)("AI Chat Completion Error", error);
        return {
            data: null,
            error: true,
            message: error?.message || "LLM Request Failed",
        };
    }
}
async function createEmbeddingsSafe(options) {
    try {
        const { usageContext, input, model = "text-embedding-3-small" } = options;
        const client = getClient();
        const response = await client.embeddings.create({ input, model });
        if (usageContext && response.usage) {
            const usage = response.usage;
            await (0, usageService_1.recordAIUsage)({
                ...usageContext,
                model,
                tokensIn: usage.prompt_tokens ?? undefined,
                tokensOut: usage.total_tokens ?? undefined,
            });
        }
        return { data: response, error: false };
    }
    catch (error) {
        (0, logger_1.logError)("AI Embedding Error", error);
        return {
            data: null,
            error: true,
            message: error?.message || "Embedding Request Failed",
        };
    }
}
