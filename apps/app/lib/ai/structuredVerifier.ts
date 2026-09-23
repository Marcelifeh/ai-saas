import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { modelCapabilities, routeModel, type AITaskType } from "./modelRouting";
import { recordVerifierStructuralFailure, type AICallTelemetry } from "./aiTelemetry";

export const strictVerifierScoreSchema = z.number().finite().min(0).max(100);
export const explicitlyCoercedVerifierScoreSchema = z.union([
  strictVerifierScoreSchema,
  z.string().regex(/^\d+(?:\.\d+)?$/).transform(Number).pipe(strictVerifierScoreSchema),
]);

export type VerifierTechnicalCode =
  | "VERIFIER_FORMAT_FAILED"
  | "VERIFIER_INCOMPLETE"
  | "VERIFIER_RATE_LIMITED"
  | "VERIFIER_API_FAILED";

export type VerifierFormatCategory =
  | "TRUNCATED_JSON"
  | "MALFORMED_JSON"
  | "UNEXPECTED_STRUCTURE"
  | "MISSING_ROW"
  | "DUPLICATE_INDEX"
  | "INVALID_INDEX"
  | "INVALID_ROW";

export class VerifierTechnicalError extends Error {
  readonly code: VerifierTechnicalCode;
  readonly category?: VerifierFormatCategory;

  constructor(code: VerifierTechnicalCode, message: string, category?: VerifierFormatCategory) {
    super(message);
    this.name = "VerifierTechnicalError";
    this.code = code;
    this.category = category;
  }
}

export function verifierTechnicalCode(error: unknown): VerifierTechnicalCode | undefined {
  return error instanceof VerifierTechnicalError ? error.code : undefined;
}

export interface IndexedVerifierRow {
  index: number;
}

export interface ValidatedVerifierBatch<T extends IndexedVerifierRow> {
  rows: T[];
  responseShape: string;
}

function responseShape(value: unknown, outputKey: string): string {
  if (Array.isArray(value)) return "array-root";
  if (!value || typeof value !== "object") return typeof value;
  const record = value as Record<string, unknown>;
  const output = record[outputKey];
  return `${outputKey}:${Array.isArray(output) ? `array(${output.length})` : typeof output}`;
}

export function validateIndexedVerifierResponse<T extends IndexedVerifierRow>(input: {
  response: unknown;
  outputKey: string;
  rowSchema: z.ZodType<T>;
  expectedCount: number;
  label: string;
}): ValidatedVerifierBatch<T> {
  const shape = responseShape(input.response, input.outputKey);
  if (!input.response || typeof input.response !== "object" || Array.isArray(input.response)) {
    throw new VerifierTechnicalError(
      "VERIFIER_FORMAT_FAILED",
      `${input.label} returned an unexpected root structure`,
      "UNEXPECTED_STRUCTURE",
    );
  }
  const rawRows = (input.response as Record<string, unknown>)[input.outputKey];
  if (!Array.isArray(rawRows)) {
    throw new VerifierTechnicalError(
      "VERIFIER_FORMAT_FAILED",
      `${input.label} omitted the ${input.outputKey} array`,
      "UNEXPECTED_STRUCTURE",
    );
  }

  const rows: T[] = [];
  const indices = new Set<number>();
  for (const rawRow of rawRows) {
    const parsed = input.rowSchema.safeParse(rawRow);
    if (!parsed.success) {
      throw new VerifierTechnicalError(
        "VERIFIER_FORMAT_FAILED",
        `${input.label} returned an invalid required field`,
        "INVALID_ROW",
      );
    }
    const row = parsed.data;
    if (row.index < 0 || row.index >= input.expectedCount) {
      throw new VerifierTechnicalError(
        "VERIFIER_FORMAT_FAILED",
        `${input.label} returned an out-of-range candidate index`,
        "INVALID_INDEX",
      );
    }
    if (indices.has(row.index)) {
      throw new VerifierTechnicalError(
        "VERIFIER_INCOMPLETE",
        `${input.label} returned a duplicate candidate index`,
        "DUPLICATE_INDEX",
      );
    }
    indices.add(row.index);
    rows.push(row);
  }
  if (rows.length !== input.expectedCount ||
      !Array.from({ length: input.expectedCount }, (_, index) => index).every((index) => indices.has(index))) {
    throw new VerifierTechnicalError(
      "VERIFIER_INCOMPLETE",
      `${input.label} returned an incomplete indexed batch`,
      "MISSING_ROW",
    );
  }
  return { rows: rows.sort((left, right) => left.index - right.index), responseShape: shape };
}

interface VerifierModelResponse {
  content: string;
  finishReason?: string | null;
  telemetry?: AICallTelemetry;
}

export type VerifierRequest = (prompt: string) => Promise<VerifierModelResponse>;

async function defaultVerifierRequest(input: {
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  taskType: AITaskType;
  responseFormat?: ReturnType<typeof zodResponseFormat>;
  repairCount: number;
}): Promise<VerifierModelResponse> {
  const { chatCompletionSafe } = await import("./aiGateway");
  const response = await chatCompletionSafe({
    aiTask: { taskType: input.taskType, repairCount: input.repairCount },
    model: input.model,
    temperature: input.temperature,
    max_tokens: input.maxTokens,
    response_format: input.responseFormat ?? { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Return only the requested JSON. Do not include markdown, comments, chain-of-thought, or prose outside the JSON.",
      },
      { role: "user", content: input.prompt },
    ],
  });
  if (response.error) {
    const message = response.message || "Verifier request failed";
    const rateLimited = /\b429\b|rate limit|no credits remaining/i.test(message);
    throw new VerifierTechnicalError(
      rateLimited ? "VERIFIER_RATE_LIMITED" : "VERIFIER_API_FAILED",
      rateLimited ? "Verifier request was rate limited" : "Verifier API request failed",
    );
  }
  if (response.data?.choices?.[0]?.message?.refusal && routeModel({ taskType: input.taskType }, input.model).enabled) {
    throw new VerifierTechnicalError("VERIFIER_API_FAILED", "Verifier declined the request");
  }
  return {
    content: response.data?.choices?.[0]?.message?.content ?? "",
    finishReason: response.data?.choices?.[0]?.finish_reason,
    telemetry: response.telemetry,
  };
}

function parseVerifierJson(content: string, finishReason?: string | null): unknown {
  if (!content.trim()) {
    throw new VerifierTechnicalError("VERIFIER_INCOMPLETE", "Verifier returned no JSON content", "TRUNCATED_JSON");
  }
  if (finishReason === "length") {
    throw new VerifierTechnicalError("VERIFIER_INCOMPLETE", "Verifier JSON was truncated", "TRUNCATED_JSON");
  }
  const clean = content.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(clean) as unknown;
  } catch {
    throw new VerifierTechnicalError("VERIFIER_FORMAT_FAILED", "Verifier returned malformed JSON", "MALFORMED_JSON");
  }
}

/** Non-indexed classification uses the same bounded structural-only repair policy. */
export async function runStructuredObjectVerifier<T>(input: {
  prompt: string; model: string; taskType: AITaskType; schema: z.ZodType<T>;
  temperature: number; maxTokens: number;
}): Promise<T> {
  let prompt = input.prompt;
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await defaultVerifierRequest({ ...input, prompt,
      responseFormat: zodResponseFormat(input.schema, "classification"), repairCount: attempt,
    });
    try {
      const value = parseVerifierJson(response.content, response.finishReason);
      const parsed = input.schema.safeParse(value);
      if (parsed.success) return parsed.data;
      throw new VerifierTechnicalError("VERIFIER_FORMAT_FAILED", "Classification schema failed", "INVALID_ROW");
    } catch (error) {
      recordVerifierStructuralFailure(response.telemetry);
      if (!(error instanceof VerifierTechnicalError) || attempt === 1) throw error;
      prompt = `Repair only the structure of this classification. Preserve its judgments. Return the required schema. Original response:\n${response.content.slice(0, 12000)}`;
    }
  }
  throw new VerifierTechnicalError("VERIFIER_FORMAT_FAILED", "Classification repair failed");
}

export interface StructuredVerifierResult<T extends IndexedVerifierRow> {
  rows: T[];
  formatRepairAttempts: number;
  initialResponseShape: string;
}

/** Execute and validate a verifier, with exactly one structural repair attempt. */
export async function runStructuredIndexedVerifier<T extends IndexedVerifierRow>(input: {
  prompt: string;
  model: string;
  taskType?: AITaskType;
  temperature?: number;
  maxTokens?: number;
  outputKey: string;
  rowSchema: z.ZodType<T>;
  /** Provider contract can omit parser-only preprocessors without weakening validation. */
  providerRowSchema?: z.ZodType;
  expectedCount: number;
  expectedSchema: string;
  label: string;
  request?: VerifierRequest;
  onFormatRepairAttempt?: () => void;
  onInitialResponseShape?: (shape: string) => void;
}): Promise<StructuredVerifierResult<T>> {
  const taskType = input.taskType ?? "SEMANTIC_VERIFICATION";
  let responseFormat: ReturnType<typeof zodResponseFormat> | undefined;
  if (!input.request) {
    try {
      const route = routeModel({ taskType }, input.model);
      if (route.enabled && modelCapabilities(route.modelName).strict) {
        responseFormat = zodResponseFormat(z.object({ [input.outputKey]: z.array(input.providerRowSchema ?? input.rowSchema) }).strict(), "verifier_batch");
      }
    } catch {
      throw new VerifierTechnicalError("VERIFIER_API_FAILED", "Verifier structured-output configuration failed");
    }
  }
  let requestCount = 0;
  const request = input.request ?? ((prompt) => defaultVerifierRequest({
    prompt,
    model: input.model,
    temperature: input.temperature ?? 0.02,
    maxTokens: input.maxTokens ?? 3200,
    taskType,
    responseFormat,
    repairCount: requestCount++ === 0 ? 0 : 1,
  }));
  const initial = await request(input.prompt);
  input.onInitialResponseShape?.(
    initial.finishReason === "length" ? "truncated-json" : initial.content.trim().startsWith("{") ? "json-object" : "non-object-text",
  );
  let initialResponse: unknown;
  let initialError: VerifierTechnicalError | undefined;
  try {
    initialResponse = parseVerifierJson(initial.content, initial.finishReason);
    const validated = validateIndexedVerifierResponse({
      response: initialResponse,
      outputKey: input.outputKey,
      rowSchema: input.rowSchema,
      expectedCount: input.expectedCount,
      label: input.label,
    });
    return { rows: validated.rows, formatRepairAttempts: 0, initialResponseShape: validated.responseShape };
  } catch (error) {
    if (!(error instanceof VerifierTechnicalError) ||
        error.code === "VERIFIER_RATE_LIMITED" || error.code === "VERIFIER_API_FAILED") throw error;
    initialError = error;
    recordVerifierStructuralFailure(initial.telemetry);
  }

  const repairPrompt = `
Correct a structurally invalid verifier response. Do not reconsider or change the judgments. Do not add explanations.

EXPECTED OUTPUT KEY: ${input.outputKey}
EXPECTED CANDIDATE INDICES: ${JSON.stringify(Array.from({ length: input.expectedCount }, (_, index) => index))}
EXPECTED SCHEMA:
${input.expectedSchema}

VALIDATION FAILURE:
${initialError.code}: ${initialError.category ?? "UNKNOWN"} (${initialError.message})

ORIGINAL VERIFIER RESPONSE:
${initial.content.slice(0, 12000)}

Return only corrected JSON with every expected candidate exactly once.`;
  input.onFormatRepairAttempt?.();
  let repaired: VerifierModelResponse;
  try {
    repaired = await request(repairPrompt);
  } catch (error) {
    if (error instanceof VerifierTechnicalError) throw error;
    throw new VerifierTechnicalError("VERIFIER_API_FAILED", "Verifier repair request failed");
  }
  try {
    const repairedResponse = parseVerifierJson(repaired.content, repaired.finishReason);
    const validated = validateIndexedVerifierResponse({
      response: repairedResponse,
      outputKey: input.outputKey,
      rowSchema: input.rowSchema,
      expectedCount: input.expectedCount,
      label: input.label,
    });
    return {
      rows: validated.rows,
      formatRepairAttempts: 1,
      initialResponseShape: responseShape(initialResponse, input.outputKey),
    };
  } catch (error) {
    if (error instanceof VerifierTechnicalError) {
      recordVerifierStructuralFailure(repaired.telemetry);
      throw new VerifierTechnicalError(
        error.code === "VERIFIER_INCOMPLETE" ? "VERIFIER_INCOMPLETE" : "VERIFIER_FORMAT_FAILED",
        `${input.label} repair did not satisfy the schema`,
        error.category,
      );
    }
    throw new VerifierTechnicalError("VERIFIER_FORMAT_FAILED", `${input.label} repair failed`);
  }
}
