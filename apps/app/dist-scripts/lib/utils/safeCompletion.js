"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeCompletion = safeCompletion;
// server-only removed for script runtime
const logger_1 = require("./logger");
async function safeCompletion(fn, fallbackValue) {
    try {
        const data = await fn();
        return { data, error: false };
    }
    catch (error) {
        (0, logger_1.logError)("AI Completion Error", error);
        // You can customize standard parsing logic or retry logic here.
        return { data: fallbackValue, error: true, message: error.message || "LLM Request Failed" };
    }
}
