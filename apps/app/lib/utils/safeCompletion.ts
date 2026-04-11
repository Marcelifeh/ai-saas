import "server-only";
import { logError } from "./logger";

export async function safeCompletion<T>(
    fn: () => Promise<T>,
    fallbackValue: T
): Promise<{ data: T | null; error: boolean; message?: string }> {
    try {
        const data = await fn();
        return { data, error: false };
    } catch (error: any) {
        logError("AI Completion Error", error);
        // You can customize standard parsing logic or retry logic here.
        return { data: fallbackValue, error: true, message: error.message || "LLM Request Failed" };
    }
}
