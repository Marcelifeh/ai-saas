import "server-only";

export function logError(context: string, error: any) {
    console.error(`[ERROR - ${context}]`, error?.message || error);
}

export function logInfo(context: string, message: string) {
    console.log(`[INFO - ${context}]`, message);
}
