import { z } from "zod";

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
}

export type VerifierRequest = (prompt: string) => Promise<VerifierModelResponse>;

async function defaultVerifierRequest(input: {
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
}): Promise<VerifierModelResponse> {
  const { chatCompletionSafe } = await import("./aiGateway");
  const response = await chatCompletionSafe({
    model: input.model,
    temperature: input.temperature,
    max_tokens: input.maxTokens,
    response_format: { type: "json_object" },
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
  return {
    content: response.data?.choices?.[0]?.message?.content ?? "",
    finishReason: response.data?.choices?.[0]?.finish_reason,
  };
}

function parseVerifierJson(content: string, finishReason?: string | null): unknown {
  if (!content.trim()) {
    throw new VerifierTechnicalError("VERIFIER_INCOMPLETE", "Verifier returned no JSON content", "TRUNCATED_JSON");
  }
  if (finishReason === "length") {
    throw new VerifierTechnicalError("VERIFIER_INCOMPLETE", "Verifier JSON was truncated", "TRUNCATED_JSON");
  }
  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new VerifierTechnicalError("VERIFIER_FORMAT_FAILED", "Verifier returned malformed JSON", "MALFORMED_JSON");
  }
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
  temperature?: number;
  maxTokens?: number;
  outputKey: string;
  rowSchema: z.ZodType<T>;
  expectedCount: number;
  expectedSchema: string;
  label: string;
  request?: VerifierRequest;
  onFormatRepairAttempt?: () => void;
  onInitialResponseShape?: (shape: string) => void;
}): Promise<StructuredVerifierResult<T>> {
  const request = input.request ?? ((prompt) => defaultVerifierRequest({
    prompt,
    model: input.model,
    temperature: input.temperature ?? 0.02,
    maxTokens: input.maxTokens ?? 3200,
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
  }

  const repairPrompt = `
Correct a structurally invalid verifier response. Do not reconsider or change the judgments. Do not add explanations.

EXPECTED OUTPUT KEY: ${input.outputKey}
EXPECTED CANDIDATE INDICES: ${JSON.stringify(Array.from({ length: input.expectedCount }, (_, index) => index))}
EXPECTED SCHEMA:
${input.expectedSchema}

VALIDATION FAILURE:
${initialError.code}: ${initialError.category ?? "UNKNOWN"}

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
      throw new VerifierTechnicalError(
        error.code === "VERIFIER_INCOMPLETE" ? "VERIFIER_INCOMPLETE" : "VERIFIER_FORMAT_FAILED",
        `${input.label} repair did not satisfy the schema`,
        error.category,
      );
    }
    throw new VerifierTechnicalError("VERIFIER_FORMAT_FAILED", `${input.label} repair failed`);
  }
}
