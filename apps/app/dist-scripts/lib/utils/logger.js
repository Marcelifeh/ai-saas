"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = logError;
exports.logInfo = logInfo;
require("server-only");
function logError(context, error) {
    console.error(`[ERROR - ${context}]`, error?.message || error);
}
function logInfo(context, message) {
    console.log(`[INFO - ${context}]`, message);
}
