import type {
  DynamicNicheProfile,
  ExpressionRecoveryContext,
  RhetoricalFamily,
} from "./dynamicNicheProfile";
import { classifyRhetoricalFamily } from "./dynamicNicheProfile";

export interface CreativeDirectionInput {
  rawDirection?: string;
  styleOrTone?: string;
  referenceExamples?: string[];
  negativeConstraints?: string[];
}

export interface CreativeDirectionBrief {
  sourcePresent: boolean;
  desiredQualities: string[];
  voiceAttributes: string[];
  conceptualMoves: string[];
  referenceAttributes: string[];
  negativeConstraints: string[];
}

export interface ExpressionWorthinessAssessment {
  slogan: string;
  conceptKey: string;
  rhetoricalFamily: RhetoricalFamily;
  selfRecognition: number;
  identityProjection: number;
  insiderResonance: number;
  conceptualTransformation: number;
  naturalness: number;
  wearability: number;
  creativeConstraintAlignment: number;
  expressionMode: "SYMBOLIC_EXPRESSION" | "DECORATIVE_DESCRIPTION";
  diagnosticTraits: Array<
    | "DESCRIPTIVE"
    | "ATMOSPHERIC"
    | "DECORATIVE"
    | "POETIC"
    | "GENERIC_MYSTICAL"
    | "VISUAL_CAPTION"
    | "AUDIENCE_DESCRIPTION"
    | "IDENTITY_BEARING"
    | "SOCIALLY_SIGNALABLE"
    | "NATURALLY_SPEAKABLE"
  >;
  score: number;
  reasons: string[];
}

export const EXPRESSION_WORTHINESS_RELEASE = Object.freeze({
  score: 60,
  conceptualTransformation: 50,
  naturalness: 60,
  wearability: 60,
  creativeConstraintAlignment: 60,
});

export function isExpressionWorthy(
  assessment: ExpressionWorthinessAssessment,
): boolean {
  return assessment.score >= EXPRESSION_WORTHINESS_RELEASE.score &&
    assessment.expressionMode === "SYMBOLIC_EXPRESSION" &&
    assessment.conceptualTransformation >= EXPRESSION_WORTHINESS_RELEASE.conceptualTransformation &&
    assessment.naturalness >= EXPRESSION_WORTHINESS_RELEASE.naturalness &&
    assessment.wearability >= EXPRESSION_WORTHINESS_RELEASE.wearability &&
    assessment.creativeConstraintAlignment >= EXPRESSION_WORTHINESS_RELEASE.creativeConstraintAlignment;
}

export function buildExpressionRecoveryContext(
  assessments: ExpressionWorthinessAssessment[],
  creativeDirection: CreativeDirectionBrief,
  attempt = 1,
): ExpressionRecoveryContext {
  const dimensions = [
    "selfRecognition",
    "identityProjection",
    "insiderResonance",
    "conceptualTransformation",
    "naturalness",
    "wearability",
    "creativeConstraintAlignment",
  ] as const;
  const averages = dimensions.map((dimension) => ({
    dimension,
    average: assessments.length === 0
      ? 0
      : assessments.reduce((sum, assessment) => sum + assessment[dimension], 0) / assessments.length,
  }));
  return {
    attempt,
    minimumExpressionTarget: EXPRESSION_WORTHINESS_RELEASE.score,
    dominantWeakDimensions: averages
      .filter(({ average }) => average < EXPRESSION_WORTHINESS_RELEASE.score)
      .sort((a, b) => a.average - b.average)
      .slice(0, 4)
      .map(({ dimension }) => dimension),
    rejectedExpressionTendencies: [...new Set(assessments.flatMap((assessment) => assessment.reasons))]
      .filter(Boolean)
      .slice(0, 12),
    bindingNegativeConstraints: creativeDirection.negativeConstraints.slice(0, 16),
    excludedConceptKeys: [...new Set(assessments.map((assessment) => assessment.conceptKey).filter(Boolean))]
      .slice(0, 40),
  };
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function cleanStringArray(value: unknown, limit = 10): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(cleanString).filter(Boolean))].slice(0, limit);
}

function numericScore(value: unknown): number | undefined {
  if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return undefined;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  return Math.max(0, Math.min(100, Math.round(numeric <= 1 ? numeric * 100 : numeric)));
}

async function callJson<T extends Record<string, unknown>>(
  prompt: string,
  temperature = 0.1,
): Promise<Partial<T>> {
  const { chatCompletionSafe } = await import("./aiGateway");
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature,
    max_tokens: 2600,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Return only valid JSON. Do not include markdown, hidden reasoning, or prose outside the requested JSON.",
      },
      { role: "user", content: prompt },
    ],
  });

  if (response.error) throw new Error(response.message || "Expression-quality request failed");
  const choice = response.data?.choices?.[0];
  if (choice?.finish_reason === "length") throw new Error("Expression-quality response exceeded its output budget");
  const content = choice?.message?.content;
  if (!content) throw new Error("Expression-quality request returned no JSON content");
  try {
    return JSON.parse(content) as Partial<T>;
  } catch {
    throw new Error("Expression-quality request returned malformed JSON");
  }
}

export function emptyCreativeDirectionBrief(): CreativeDirectionBrief {
  return {
    sourcePresent: false,
    desiredQualities: [],
    voiceAttributes: [],
    conceptualMoves: [],
    referenceAttributes: [],
    negativeConstraints: [],
  };
}

function normalizedPhrase(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function normalizeCreativeDirectionBrief(
  response: Record<string, unknown>,
  explicitNegativeConstraints: string[] = [],
  referenceExamples: string[] = [],
): CreativeDirectionBrief {
  const normalizedExamples = new Set(referenceExamples.map(normalizedPhrase).filter(Boolean));
  const abstractOnly = (value: unknown) => cleanStringArray(value).filter((attribute) => (
    !normalizedExamples.has(normalizedPhrase(attribute))
  ));
  const desiredQualities = abstractOnly(response.desiredQualities);
  const voiceAttributes = abstractOnly(response.voiceAttributes);
  const conceptualMoves = abstractOnly(response.conceptualMoves);
  const referenceAttributes = abstractOnly(response.referenceAttributes);
  const inferredNegatives = cleanStringArray(response.negativeConstraints, 12);
  const negativeConstraints = [...new Set([
    ...cleanStringArray(explicitNegativeConstraints, 12),
    ...inferredNegatives,
  ])].slice(0, 16);
  return {
    sourcePresent: response.sourcePresent === true ||
      desiredQualities.length > 0 ||
      voiceAttributes.length > 0 ||
      conceptualMoves.length > 0 ||
      referenceAttributes.length > 0 ||
      negativeConstraints.length > 0,
    desiredQualities,
    voiceAttributes,
    conceptualMoves,
    referenceAttributes,
    negativeConstraints,
  };
}

/**
 * Converts user direction and references into latent creative properties. The
 * returned brief deliberately contains no reference wording, so downstream
 * generation can honor the intent without copying an example.
 */
export async function interpretCreativeDirection(
  input: CreativeDirectionInput,
): Promise<CreativeDirectionBrief> {
  const rawDirection = cleanString(input.rawDirection);
  const styleOrTone = cleanString(input.styleOrTone);
  const referenceExamples = cleanStringArray(input.referenceExamples, 8);
  const explicitNegativeConstraints = cleanStringArray(input.negativeConstraints, 12);
  if (!rawDirection && !styleOrTone && referenceExamples.length === 0 && explicitNegativeConstraints.length === 0) {
    return emptyCreativeDirectionBrief();
  }

  const response = await callJson<{
    sourcePresent?: unknown;
    desiredQualities?: unknown;
    voiceAttributes?: unknown;
    conceptualMoves?: unknown;
    referenceAttributes?: unknown;
    negativeConstraints?: unknown;
  }>(`
Extract the user's slogan-level creative direction into an abstract brief.

RAW IDEA / DIRECTION:
${rawDirection || "Not supplied"}

STYLE OR TONE FIELD:
${styleOrTone || "Not supplied"}

USER REFERENCE EXAMPLES:
${JSON.stringify(referenceExamples)}

EXPLICIT NEGATIVE CONSTRAINTS:
${JSON.stringify(explicitNegativeConstraints)}

Rules:
- Separate the subject/niche from the requested creative treatment.
- Do not infer audience behavior, rituals, facts, or market evidence.
- Do not generate slogans, phrase frames, sentence openings, or rewrites.
- Never return wording from a reference example.
- Translate examples only into latent attributes: voice, point of view, emotional posture, degree of indirectness, conceptual transformation, identity relationship, and rhetorical energy.
- Preserve every explicit negative creative constraint by meaning. Do not soften, invert, or discard it.
- Ignore purely visual rendering instructions unless they also constrain the slogan voice.
- If the input contains only a topic and no creative direction, return empty arrays and sourcePresent false.

Return JSON only:
{
  "sourcePresent": false,
  "desiredQualities": [],
  "voiceAttributes": [],
  "conceptualMoves": [],
  "referenceAttributes": [],
  "negativeConstraints": []
}`);

  return normalizeCreativeDirectionBrief(
    response as Record<string, unknown>,
    explicitNegativeConstraints,
    referenceExamples,
  );
}

function stemConceptToken(token: string): string {
  if (token.length > 5 && token.endsWith("ing")) {
    let stem = token.slice(0, -3);
    if (/([b-df-hj-np-tv-z])\1$/.test(stem)) stem = stem.slice(0, -1);
    if (/(?:ac|at|bl|iz|iv|ov|ur|us)$/.test(stem)) stem += "e";
    return stem;
  }
  if (token.length > 4 && token.endsWith("ied")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && token.endsWith("es") && /(?:s|x|z|ch|sh)es$/.test(token)) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

/** A grammatical-form-tolerant fallback key; AI concept labels handle broader paraphrases. */
export function semanticConceptKey(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’“”'"`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(stemConceptToken)
    .join(" ");
}

export function scoreExpressionWorthiness(scores: {
  selfRecognition: number;
  identityProjection: number;
  insiderResonance: number;
  conceptualTransformation: number;
  naturalness: number;
  wearability: number;
  creativeConstraintAlignment: number;
}): number {
  const core =
    scores.selfRecognition * 0.22 +
    scores.identityProjection * 0.17 +
    scores.insiderResonance * 0.16 +
    scores.conceptualTransformation * 0.18 +
    scores.naturalness * 0.14 +
    scores.wearability * 0.13;
  const constraintPenalty = Math.max(0, 70 - scores.creativeConstraintAlignment) * 0.45;
  return Math.max(0, Math.min(100, Math.round(core - constraintPenalty)));
}

async function assessExpressionBatch(
  profile: DynamicNicheProfile,
  slogans: string[],
  creativeDirection: CreativeDirectionBrief,
): Promise<ExpressionWorthinessAssessment[]> {
  const response = await callJson<{ assessments?: unknown }>(`
Act as a commercial creative-quality judge. These candidates have already passed semantic eligibility. Do not re-run the truth gate and do not require behavioral evidence to appear as literal surface syntax.

NICHE: ${profile.niche}
AUDIENCE: ${profile.audience}

PROFILE HYPOTHESES (context, not proof):
${JSON.stringify({
    insiderLanguage: profile.insiderLanguage,
    statusSignals: profile.statusSignals,
    identitySignals: profile.latentLifestyleModel?.identitySignals ?? [],
    emotionalRewards: profile.latentLifestyleModel?.emotionalRewards ?? [],
    tensions: profile.latentLifestyleModel?.tensions ?? [],
  }, null, 2)}

USER CREATIVE BRIEF (preference, never evidence):
${JSON.stringify(creativeDirection, null, 2)}

Score each candidate independently from 0-100:
- selfRecognition: a member feels personally seen, whether through behavior, attitude, status, taste, or implication.
- identityProjection: the line lets a wearer project a desirable or knowingly honest identity.
- insiderResonance: it rewards belonging or shared understanding without requiring obscure jargon.
- conceptualTransformation: it turns source truth into a fresh expressive idea instead of naming or summarizing it.
- naturalness: it sounds intentionally human, idiomatic, and complete in its chosen rhetorical mode.
- wearability: someone would choose to put this exact expression on their body; do not reduce this to word count.
- creativeConstraintAlignment: it follows the user brief, especially every negative constraint. If no user brief exists, score neutral alignment as 70.

Also classify expressionMode from the actual phrase:
- SYMBOLIC_EXPRESSION: transforms grounded meaning into a human-facing identity, attitude, role, affiliation, observation, recognition, status, or social signal.
- DECORATIVE_DESCRIPTION: mainly depicts mood, scenery, motifs, poetic atmosphere, visual styling, or niche subject matter.

Do not infer expressionMode from generator metadata; none is supplied. A compact identity or insider phrase can be SYMBOLIC_EXPRESSION without a verb or explicit behavior.

Return every applicable diagnosticTrait from this exact list: DESCRIPTIVE, ATMOSPHERIC, DECORATIVE, POETIC, GENERIC_MYSTICAL, VISUAL_CAPTION, AUDIENCE_DESCRIPTION, IDENTITY_BEARING, SOCIALLY_SIGNALABLE, NATURALLY_SPEAKABLE.

Allow many rhetorical families: observation, identity signal, declaration, confession, command, question, contrast, understatement, wordplay, metaphor, and fragment when intentionally natural. No family is inherently superior. A slogan may express grounded truth indirectly; do not demand a visible action, ritual, object, or first-person pronoun.

Calibration:
- A clear negative-constraint violation must score creativeConstraintAlignment 0-25.
- A probable or partial violation must score creativeConstraintAlignment below 55.
- Do not award 70 neutral alignment when a user brief exists; inspect it candidate by candidate.
- A broad topic label decorated with an adjective, approval word, rhyme, or seasonal noun scores conceptualTransformation at most 35.
- A recognizable catchphrase with niche nouns substituted scores conceptualTransformation at most 40.
- Cute spelling, decorative rhyme, and generic approval language are not insider resonance unless the brief explicitly asks for them.
- Wearability is elective identity value, not merely brevity or readability.
- Use the full 0-100 range and do not default most dimensions to rounded neutral scores.

For conceptKey, state the minimal underlying proposition in plain neutral words. Collapse tense, grammatical person, command/gerund form, and cosmetic wording. It is only a grouping label, not a slogan and not a rewrite.

Do not reward copying the user's reference wording; the brief contains attributes only. Keep reasons under 12 words.

CANDIDATES:
${JSON.stringify(slogans.map((slogan, index) => ({ index, slogan })))}

Return JSON only:
{
  "assessments": [{
    "index": 0,
    "conceptKey": "",
    "selfRecognition": 0,
    "identityProjection": 0,
    "insiderResonance": 0,
    "conceptualTransformation": 0,
    "naturalness": 0,
    "wearability": 0,
    "creativeConstraintAlignment": 0,
    "expressionMode": "DECORATIVE_DESCRIPTION",
    "diagnosticTraits": [],
    "reasons": []
  }]
}`);

  const raw = Array.isArray(response.assessments) ? response.assessments : [];
  const byIndex = new Map<number, Record<string, unknown>>();
  for (const value of raw) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const record = value as Record<string, unknown>;
    const index = Number(record.index);
    if (Number.isInteger(index) && index >= 0 && index < slogans.length && !byIndex.has(index)) {
      byIndex.set(index, record);
    }
  }
  if (byIndex.size !== slogans.length) {
    throw new Error(`Expression judge returned ${byIndex.size}/${slogans.length} complete indexed rows`);
  }

  return slogans.map((slogan, index) => {
    const record = byIndex.get(index) as Record<string, unknown>;
    const scoreNames = [
      "selfRecognition",
      "identityProjection",
      "insiderResonance",
      "conceptualTransformation",
      "naturalness",
      "wearability",
      "creativeConstraintAlignment",
    ] as const;
    const normalized = Object.fromEntries(scoreNames.map((name) => [name, numericScore(record[name])])) as Record<typeof scoreNames[number], number | undefined>;
    if (Object.values(normalized).some((score) => score === undefined)) {
      throw new Error(`Expression judge returned invalid scores for candidate ${index}`);
    }
    const scores = normalized as Record<typeof scoreNames[number], number>;
    const expressionMode = record.expressionMode === "SYMBOLIC_EXPRESSION"
      ? "SYMBOLIC_EXPRESSION" as const
      : "DECORATIVE_DESCRIPTION" as const;
    const allowedTraits = new Set([
      "DESCRIPTIVE",
      "ATMOSPHERIC",
      "DECORATIVE",
      "POETIC",
      "GENERIC_MYSTICAL",
      "VISUAL_CAPTION",
      "AUDIENCE_DESCRIPTION",
      "IDENTITY_BEARING",
      "SOCIALLY_SIGNALABLE",
      "NATURALLY_SPEAKABLE",
    ] as const);
    const diagnosticTraits = cleanStringArray(record.diagnosticTraits, 10)
      .filter((trait): trait is ExpressionWorthinessAssessment["diagnosticTraits"][number] => (
        allowedTraits.has(trait as ExpressionWorthinessAssessment["diagnosticTraits"][number])
      ));
    const returnedConcept = cleanString(record.conceptKey);
    return {
      slogan,
      conceptKey: semanticConceptKey(returnedConcept || slogan),
      rhetoricalFamily: classifyRhetoricalFamily(slogan),
      ...scores,
      expressionMode,
      diagnosticTraits,
      score: scoreExpressionWorthiness(scores),
      reasons: cleanStringArray(record.reasons, 4),
    };
  });
}

async function verifyCreativeBriefBatch(
  slogans: string[],
  creativeDirection: CreativeDirectionBrief,
): Promise<Array<{
  slogan: string;
  conceptualTransformation: number;
  creativeConstraintAlignment: number;
  reasons: string[];
}>> {
  const response = await callJson<{ assessments?: unknown }>(`
Act as a narrow adversarial verifier for creative originality and user-brief compliance. Do not score semantic truth, niche coverage, brevity, or general marketability. Do not rewrite candidates.

BINDING USER CREATIVE BRIEF:
${JSON.stringify(creativeDirection, null, 2)}

For each candidate:
- Score conceptualTransformation from 0-100: has source meaning become a fresh expressive concept, or is this category-label decoration, obvious rhyme, generic approval wording, or a familiar catchphrase with nouns substituted?
- Score creativeConstraintAlignment from 0-100 against every desired attribute and negative constraint.
- Any clear negative-constraint violation caps creativeConstraintAlignment at 25.
- Any probable or partial violation caps it below 55.
- A topic noun plus an adjective, season word, rhyme, or approval word cannot score above 35 for conceptualTransformation.
- A recognizable catchphrase rewrite cannot score above 40 for conceptualTransformation.
- Do not infer compliance from shortness, niche keywords, or grammatical correctness.
- Keep reasons factual and under 12 words.

CANDIDATES:
${JSON.stringify(slogans.map((slogan, index) => ({ index, slogan })))}

Return JSON only:
{
  "assessments": [{
    "index": 0,
    "conceptualTransformation": 0,
    "creativeConstraintAlignment": 0,
    "reasons": []
  }]
}`,
  0.02);

  const raw = Array.isArray(response.assessments) ? response.assessments : [];
  const byIndex = new Map<number, Record<string, unknown>>();
  for (const value of raw) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const record = value as Record<string, unknown>;
    const index = Number(record.index);
    if (Number.isInteger(index) && index >= 0 && index < slogans.length && !byIndex.has(index)) {
      byIndex.set(index, record);
    }
  }
  if (byIndex.size !== slogans.length) {
    throw new Error(`Creative-brief verifier returned ${byIndex.size}/${slogans.length} complete indexed rows`);
  }

  return slogans.map((slogan, index) => {
    const record = byIndex.get(index) as Record<string, unknown>;
    const conceptualTransformation = numericScore(record.conceptualTransformation);
    const creativeConstraintAlignment = numericScore(record.creativeConstraintAlignment);
    if (conceptualTransformation === undefined || creativeConstraintAlignment === undefined) {
      throw new Error(`Creative-brief verifier returned invalid scores for candidate ${index}`);
    }
    return {
      slogan,
      conceptualTransformation,
      creativeConstraintAlignment,
      reasons: cleanStringArray(record.reasons, 3),
    };
  });
}

const EXPRESSION_BATCH_SIZE = 10;

export async function assessExpressionWorthiness(
  profile: DynamicNicheProfile,
  slogans: string[],
  creativeDirection: CreativeDirectionBrief = emptyCreativeDirectionBrief(),
): Promise<ExpressionWorthinessAssessment[]> {
  const batches: string[][] = [];
  for (let index = 0; index < slogans.length; index += EXPRESSION_BATCH_SIZE) {
    batches.push(slogans.slice(index, index + EXPRESSION_BATCH_SIZE));
  }
  const primary = (await Promise.all(
    batches.map((batch) => assessExpressionBatch(profile, batch, creativeDirection)),
  )).flat();
  if (!creativeDirection.sourcePresent) return primary;

  const focused = (await Promise.all(
    batches.map((batch) => verifyCreativeBriefBatch(batch, creativeDirection)),
  )).flat();
  return primary.map((assessment, index) => {
    const verifier = focused[index];
    if (!verifier || verifier.slogan !== assessment.slogan) {
      throw new Error(`Creative-brief verifier candidate alignment failed at index ${index}`);
    }
    const merged = {
      ...assessment,
      conceptualTransformation: Math.min(
        assessment.conceptualTransformation,
        verifier.conceptualTransformation,
      ),
      creativeConstraintAlignment: Math.min(
        assessment.creativeConstraintAlignment,
        verifier.creativeConstraintAlignment,
      ),
      reasons: [...new Set([...assessment.reasons, ...verifier.reasons])].slice(0, 6),
    };
    return {
      ...merged,
      score: scoreExpressionWorthiness(merged),
    };
  });
}

export function dedupeByExpressionConcept<T extends { slogan: string; score: number; expressionWorthiness?: ExpressionWorthinessAssessment }>(
  candidates: T[],
): T[] {
  const seenConcepts = new Set<string>();
  const seenGrammaticalVariants = new Set<string>();
  return candidates.filter((candidate) => {
    const conceptKey = candidate.expressionWorthiness?.conceptKey || semanticConceptKey(candidate.slogan);
    const grammaticalVariantKey = semanticConceptKey(candidate.slogan);
    if (
      !conceptKey ||
      seenConcepts.has(conceptKey) ||
      seenGrammaticalVariants.has(grammaticalVariantKey)
    ) return false;
    seenConcepts.add(conceptKey);
    seenGrammaticalVariants.add(grammaticalVariantKey);
    return true;
  });
}
