import type { CreativeDirectionBrief } from "./expressionWorthiness";
import type { CompositionType, DynamicNicheProfile } from "./dynamicNicheProfile";

export const EXPRESSION_INTENT_TYPES = [
  "IDENTITY_CLAIM",
  "ROLE_REFRAME",
  "INSIDER_LABEL",
  "STATUS_SIGNAL",
  "AFFILIATION",
  "DEFIANT_REFRAME",
  "CHARACTERIZATION",
  "OBSERVATIONAL_WIT",
  "MYTHIC_REFRAME",
  "RITUAL_RECOGNITION",
  "TENSION",
  "SELF_DESCRIPTION",
] as const;

export type ExpressionIntentType = typeof EXPRESSION_INTENT_TYPES[number];

export interface ExpressionIntent {
  id: string;
  territoryId: string;
  groundedPremise: string;
  intentType: ExpressionIntentType;
  humanMeaning: string;
  whySomeoneWouldWearThis: string;
  supportedByPremise: string[];
  sourceEvidenceRefs: string[];
  socialSignal: string;
  identityTarget: string;
  confidence: number;
  intentFingerprint: string;
}

export interface ExpressionIntentAssessment {
  intentId: string;
  eligible: boolean;
  groundedness: number;
  humanWearReason: number;
  distinctiveHumanMeaning: number;
  socialSignalSpecificity: number;
  productIndependence: number;
  intersectionPreservation: number;
  decorativeDescriptionRisk: number;
  unsupportedInferenceRisk: number;
  reasons: string[];
}

export interface ExpressionIntentTerritory {
  id: string;
  premise: string;
  humanTruth: string;
  evidenceRefs?: string[];
  compositionType?: CompositionType;
  sharedPremise?: string;
  axisContributions?: Array<{ axis: string; contribution: string }>;
}

export interface ExpressionIntentEvidence {
  trendSignals?: string[];
  buyerLanguage?: string[];
  culturalSignals?: string[];
  purchaseSignals?: string[];
}

export const EXPRESSION_INTENT_THRESHOLDS = Object.freeze({
  groundedness: 65,
  humanWearReason: 60,
  distinctiveHumanMeaning: 60,
  socialSignalSpecificity: 60,
  productIndependence: 70,
  intersectionPreservation: 60,
  decorativeDescriptionRisk: 35,
  unsupportedInferenceRisk: 35,
});

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function cleanStringArray(value: unknown, limit = 12): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(cleanString).filter(Boolean))].slice(0, limit);
}

function score(value: unknown): number | undefined {
  if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return undefined;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  return Math.max(0, Math.min(100, Math.round(numeric <= 1 ? numeric * 100 : numeric)));
}

export function expressionIntentFingerprint(intent: Pick<ExpressionIntent,
  "intentType" | "humanMeaning" | "socialSignal" | "identityTarget">): string {
  const meaning = [intent.humanMeaning, intent.socialSignal, intent.identityTarget]
    .join(" ")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 2 && !["the", "and", "for", "with", "that", "this"].includes(token))
    .slice(0, 18)
    .sort()
    .join(" ");
  return `${intent.intentType.toLowerCase()}:${meaning}`;
}

export function isExpressionIntentEligible(
  assessment: Omit<ExpressionIntentAssessment, "intentId" | "eligible" | "reasons">,
): boolean {
  return assessment.groundedness >= EXPRESSION_INTENT_THRESHOLDS.groundedness &&
    assessment.humanWearReason >= EXPRESSION_INTENT_THRESHOLDS.humanWearReason &&
    assessment.distinctiveHumanMeaning >= EXPRESSION_INTENT_THRESHOLDS.distinctiveHumanMeaning &&
    assessment.socialSignalSpecificity >= EXPRESSION_INTENT_THRESHOLDS.socialSignalSpecificity &&
    assessment.productIndependence >= EXPRESSION_INTENT_THRESHOLDS.productIndependence &&
    assessment.intersectionPreservation >= EXPRESSION_INTENT_THRESHOLDS.intersectionPreservation &&
    assessment.decorativeDescriptionRisk <= EXPRESSION_INTENT_THRESHOLDS.decorativeDescriptionRisk &&
    assessment.unsupportedInferenceRisk <= EXPRESSION_INTENT_THRESHOLDS.unsupportedInferenceRisk;
}

/** Round-robin by semantic purpose so lexical variation cannot dominate intent selection. */
export function selectDiverseExpressionIntents(
  intents: ExpressionIntent[],
  limit = 20,
): ExpressionIntent[] {
  const seen = new Set<string>();
  const groups = new Map<ExpressionIntentType, ExpressionIntent[]>();
  for (const intent of intents.sort((a, b) => b.confidence - a.confidence)) {
    if (!intent.intentFingerprint || seen.has(intent.intentFingerprint)) continue;
    seen.add(intent.intentFingerprint);
    const group = groups.get(intent.intentType) ?? [];
    group.push(intent);
    groups.set(intent.intentType, group);
  }
  const selected: ExpressionIntent[] = [];
  const orderedGroups = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  for (let depth = 0; selected.length < limit; depth += 1) {
    let added = false;
    for (const [, group] of orderedGroups) {
      const intent = group[depth];
      if (!intent) continue;
      selected.push(intent);
      added = true;
      if (selected.length >= limit) break;
    }
    if (!added) break;
  }
  return selected;
}

async function callJson<T extends Record<string, unknown>>(
  prompt: string,
  temperature: number,
  model: string,
): Promise<Partial<T>> {
  const { chatCompletionSafe } = await import("./aiGateway");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await chatCompletionSafe({
      model,
      temperature,
      max_tokens: 5200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return only valid JSON. No markdown, hidden reasoning, or prose outside JSON." },
        { role: "user", content: prompt },
      ],
    });
    if (response.error) {
      const message = response.message || "Expression-intent request failed";
      if (/\b429\b|rate limit/i.test(message) && attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        continue;
      }
      throw new Error(message);
    }
    const choice = response.data?.choices?.[0];
    if (choice?.finish_reason === "length") throw new Error("Expression-intent response exceeded its output budget");
    const content = choice?.message?.content;
    if (!content) throw new Error("Expression-intent request returned no JSON");
    try {
      return JSON.parse(content) as Partial<T>;
    } catch {
      throw new Error("Expression-intent request returned malformed JSON");
    }
  }
  throw new Error("Expression-intent request exhausted retries");
}

export function activeCompositionHypotheses(profile: DynamicNicheProfile): Array<{
  compositionType?: CompositionType;
  confidence: number;
  sharedPremise?: string;
}> {
  const composition = profile.nicheComposition;
  if (composition?.kind !== "compound" || !composition.compositionType) return [];
  const primaryConfidence = composition.compositionConfidence ?? composition.confidence ?? 100;
  const primary = {
    compositionType: composition.compositionType,
    confidence: primaryConfidence,
    sharedPremise: composition.sharedPremise,
  };
  const secondary = (composition.alternativeCompositionTypes ?? [])[0];
  const considerSecondary = Boolean(secondary) && (
    primaryConfidence < 65 || (primaryConfidence - (secondary?.confidence ?? 0)) <= 15
  );
  return considerSecondary && secondary ? [primary, secondary] : [primary];
}

export async function planAndValidateExpressionIntents(input: {
  profile: DynamicNicheProfile;
  territories: ExpressionIntentTerritory[];
  evidence?: ExpressionIntentEvidence;
  creativeDirection: CreativeDirectionBrief;
  limit?: number;
}): Promise<{ intents: ExpressionIntent[]; assessments: ExpressionIntentAssessment[] }> {
  if (input.profile.nicheComposition?.kind !== "compound") return { intents: [], assessments: [] };
  const model = process.env.OPENAI_SLOGAN_CREATIVE_MODEL?.trim() || "gpt-4.1";
  const indexedEvidence = [
    ...(input.evidence?.trendSignals ?? []).map((value, index) => ({ ref: `trend:${index}`, value })),
    ...(input.evidence?.buyerLanguage ?? []).map((value, index) => ({ ref: `buyer:${index}`, value })),
    ...(input.evidence?.culturalSignals ?? []).map((value, index) => ({ ref: `culture:${index}`, value })),
    ...(input.evidence?.purchaseSignals ?? []).map((value, index) => ({ ref: `purchase:${index}`, value })),
  ];
  const allowedEvidenceRefs = new Set(["niche", "audience", ...indexedEvidence.map((item) => item.ref)]);
  const territoryIds = new Set(input.territories.map((territory) => territory.id));
  const territoryById = new Map(input.territories.map((territory) => [territory.id, territory]));
  const compositionHypotheses = activeCompositionHypotheses(input.profile);
  const planned = await callJson<{ intents?: unknown }>(`
Plan human expression intents for a compound-niche slogan system. An intent explains WHY someone would wear or say an idea, never HOW a sentence is phrased.

ORIGINAL SOURCES:
${JSON.stringify({ niche: input.profile.niche, audience: input.profile.audience, indexedEvidence }, null, 2)}

BOUNDED COMPOSITION HYPOTHESES:
${JSON.stringify(compositionHypotheses, null, 2)}

GROUNDED TERRITORIES (model hypotheses whose evidence refs must be checked against original sources):
${JSON.stringify(input.territories, null, 2)}

USER CREATIVE DIRECTION (preference, never evidence):
${JSON.stringify(input.creativeDirection, null, 2)}

Allowed semantic intent types:
${JSON.stringify(EXPRESSION_INTENT_TYPES)}

Create up to ${Math.max(8, Math.min(24, input.limit ?? 20))} distinct intents. Infer supported intent types dynamically; do not map composition types to fixed intents and do not force every type.

Rules:
- No slogan wording, phrase examples, sentence frames, puns, rhyme plans, or templates.
- Each intent must emerge from a territory and preserve why both axes matter.
- whySomeoneWouldWearThis must state a credible identity, social, recognition, affiliation, role, status, attitude, or wit payoff.
- humanMeaning must contain a specific conceptual change or social proposition that only the joint premise justifies. Generic calls to embrace mystery, uniqueness, magic, belonging, confidence, or outsider status are not complete intents.
- socialSignal must make clear what a viewer or fellow insider would understand about the wearer; vague appreciation is insufficient.
- Reject visual depiction, atmosphere, poetic scenery, generic mysticism, or niche description as the entire human meaning.
- Do not invent behavior, identity, lore, status, or relationships.
- supportedByPremise must contain exact territory IDs. sourceEvidenceRefs must contain only exact original source refs.
- Seek semantic diversity across supported human purposes, not lexical variations of one purpose.

Return JSON only:
{
  "intents": [{
    "id": "intent_1",
    "territoryId": "territory_1",
    "intentType": "IDENTITY_CLAIM",
    "humanMeaning": "",
    "whySomeoneWouldWearThis": "",
    "supportedByPremise": ["territory_1"],
    "sourceEvidenceRefs": ["niche"],
    "socialSignal": "",
    "identityTarget": "",
    "confidence": 0
  }]
}`,
  0.55,
  model);

  const intents = (Array.isArray(planned.intents) ? planned.intents : []).flatMap((value, index) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const record = value as Record<string, unknown>;
    const intentType = EXPRESSION_INTENT_TYPES.includes(record.intentType as ExpressionIntentType)
      ? record.intentType as ExpressionIntentType
      : undefined;
    const territoryId = cleanString(record.territoryId);
    const humanMeaning = cleanString(record.humanMeaning);
    const whySomeoneWouldWearThis = cleanString(record.whySomeoneWouldWearThis);
    const socialSignal = cleanString(record.socialSignal);
    const identityTarget = cleanString(record.identityTarget);
    const confidence = score(record.confidence);
    const supportedByPremise = cleanStringArray(record.supportedByPremise)
      .filter((ref) => territoryIds.has(ref));
    const sourceEvidenceRefs = cleanStringArray(record.sourceEvidenceRefs)
      .filter((ref) => allowedEvidenceRefs.has(ref));
    if (!intentType || !territoryId || !territoryIds.has(territoryId) || !humanMeaning ||
      !whySomeoneWouldWearThis || !socialSignal || !identityTarget || confidence === undefined ||
      supportedByPremise.length === 0 || sourceEvidenceRefs.length === 0) return [];
    const intent: ExpressionIntent = {
      id: cleanString(record.id) || `intent_${index + 1}`,
      territoryId,
      groundedPremise: territoryById.get(territoryId)?.premise ?? "",
      intentType,
      humanMeaning,
      whySomeoneWouldWearThis,
      supportedByPremise,
      sourceEvidenceRefs,
      socialSignal,
      identityTarget,
      confidence,
      intentFingerprint: "",
    };
    intent.intentFingerprint = expressionIntentFingerprint(intent);
    return [intent];
  });
  const diverse = selectDiverseExpressionIntents(intents, input.limit ?? 20);
  if (diverse.length === 0) return { intents: [], assessments: [] };

  const assessments: ExpressionIntentAssessment[] = [];
  const verifierModel = process.env.OPENAI_SLOGAN_VERIFIER_MODEL?.trim() || "gpt-4.1";
  // Keep verification bounded while enforcing an exact completeness contract.
  // Partial model validation is never accepted as evidence.
  for (let start = 0; start < diverse.length; start += 4) {
    const batch = diverse.slice(start, start + 4);
    const evaluated = await callJson<{ assessments?: unknown }>(`
Act as an adversarial expression-intent eligibility judge. Judge the actual intent claims; intentType labels and confidence are not evidence.

ORIGINAL SOURCES (authoritative):
${JSON.stringify({ niche: input.profile.niche, audience: input.profile.audience, indexedEvidence }, null, 2)}

COMPOUND AXES:
${JSON.stringify(input.profile.nicheComposition?.axes ?? [])}

TERRITORY PREMISES (hypotheses, not self-validating evidence):
${JSON.stringify(input.territories.map((territory) => ({
    id: territory.id,
    premise: territory.premise,
    evidenceRefs: territory.evidenceRefs,
  })), null, 2)}

Score 0-100:
- groundedness: the intended human claim follows conservatively from original sources;
- humanWearReason: a real person has a plausible identity, social, recognition, role, affiliation, status, attitude, or wit reason to express it;
- distinctiveHumanMeaning: the intent contains a specific conceptual transformation or proposition rather than generic mystery, uniqueness, magic, belonging, confidence, or outsider language;
- socialSignalSpecificity: another person could understand a particular stance, role, affiliation, recognition, or status from the intended meaning;
- productIndependence: meaning exists without merchandise;
- intersectionPreservation: removing either axis materially changes the intent;
- decorativeDescriptionRisk: HIGH when it merely depicts motifs, atmosphere, mood, scenery, aesthetics, or niche subject matter;
- unsupportedInferenceRisk: HIGH when identity, behavior, lore, status, or relationship is invented.

Do not award scores because metadata calls something an identity claim. A supported compact identity or insider intent needs no explicit behavior. Do not score wording quality; no wording exists yet.

INTENTS:
${JSON.stringify(batch.map((intent, index) => ({ index, ...intent })), null, 2)}

Return JSON only:
{
  "assessments": [{
    "index": 0,
    "groundedness": 0,
    "humanWearReason": 0,
    "distinctiveHumanMeaning": 0,
    "socialSignalSpecificity": 0,
    "productIndependence": 0,
    "intersectionPreservation": 0,
    "decorativeDescriptionRisk": 0,
    "unsupportedInferenceRisk": 0,
    "reasons": []
  }]
}`,
    0.03,
    verifierModel);
    const raw = Array.isArray(evaluated.assessments) ? evaluated.assessments : [];
    const byIndex = new Map<number, Record<string, unknown>>();
    for (const value of raw) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const record = value as Record<string, unknown>;
      const index = Number(record.index);
      if (Number.isInteger(index) && index >= 0 && index < batch.length) byIndex.set(index, record);
    }
    if (byIndex.size !== batch.length) throw new Error(`Intent evaluator returned ${byIndex.size}/${batch.length} rows`);
    batch.forEach((intent, index) => {
      const record = byIndex.get(index) as Record<string, unknown>;
      const values = {
        groundedness: score(record.groundedness),
        humanWearReason: score(record.humanWearReason),
        distinctiveHumanMeaning: score(record.distinctiveHumanMeaning),
        socialSignalSpecificity: score(record.socialSignalSpecificity),
        productIndependence: score(record.productIndependence),
        intersectionPreservation: score(record.intersectionPreservation),
        decorativeDescriptionRisk: score(record.decorativeDescriptionRisk),
        unsupportedInferenceRisk: score(record.unsupportedInferenceRisk),
      };
      if (Object.values(values).some((value) => value === undefined)) {
        throw new Error(`Intent evaluator returned invalid scores for ${intent.id}`);
      }
      const normalized = values as Record<keyof typeof values, number>;
      assessments.push({
        intentId: intent.id,
        eligible: isExpressionIntentEligible(normalized),
        ...normalized,
        reasons: cleanStringArray(record.reasons, 4),
      });
    });
  }

  const eligibleIds = new Set(assessments.filter((assessment) => assessment.eligible).map((assessment) => assessment.intentId));
  return {
    intents: diverse.filter((intent) => eligibleIds.has(intent.id)),
    assessments,
  };
}
