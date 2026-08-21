import type { DynamicNicheProfile } from "./dynamicNicheProfile";

export interface CreativeEvidenceContext {
  snapshotId?: string;
  contentHash?: string;
  trendSignals?: string[];
  buyerLanguage?: string[];
  culturalSignals?: string[];
  purchaseSignals?: string[];
}

export interface CreativeTerritory {
  id: string;
  premise: string;
  humanTruth: string;
  evidence: string[];
  dimensionCoverage: string[];
  emotionalPayoff?: string;
  tension?: string;
  confidence: number;
}

export interface SemanticEligibilityAssessment {
  slogan: string;
  eligible: boolean;
  truthGrounding: number;
  productIndependence: number;
  intersectionIntegrity: number;
  semanticCoherence: number;
  unsupportedInferenceRisk: number;
  reasons: string[];
}

export const SEMANTIC_ELIGIBILITY_THRESHOLDS = Object.freeze({
  truthGrounding: 65,
  productIndependence: 70,
  intersectionIntegrity: 60,
  semanticCoherence: 65,
  unsupportedInferenceRisk: 35,
});

export function isSemanticallyEligibleAssessment(
  assessment: Pick<SemanticEligibilityAssessment,
    "truthGrounding" | "productIndependence" | "intersectionIntegrity" | "semanticCoherence" | "unsupportedInferenceRisk">,
): boolean {
  return assessment.truthGrounding >= SEMANTIC_ELIGIBILITY_THRESHOLDS.truthGrounding &&
    assessment.productIndependence >= SEMANTIC_ELIGIBILITY_THRESHOLDS.productIndependence &&
    assessment.intersectionIntegrity >= SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity &&
    assessment.semanticCoherence >= SEMANTIC_ELIGIBILITY_THRESHOLDS.semanticCoherence &&
    assessment.unsupportedInferenceRisk <= SEMANTIC_ELIGIBILITY_THRESHOLDS.unsupportedInferenceRisk;
}

function clampScore(value: unknown, fallback = 50): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function cleanStringArray(value: unknown, limit = 8): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(cleanString).filter(Boolean))].slice(0, limit);
}

async function callJson<T>(prompt: string, temperature = 0.15): Promise<Partial<T>> {
  const { chatCompletionSafe } = await import("./aiGateway");
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature,
    max_tokens: 2600,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Return only valid JSON. Do not include markdown, comments, chain-of-thought, or explanatory prose outside the requested JSON.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) return {};
  try {
    return JSON.parse(content) as Partial<T>;
  } catch {
    return {};
  }
}

/**
 * Discovers grounded semantic territories, not reusable slogan structures.
 * A territory explains WHAT human truth can be expressed; it never prescribes
 * HOW the sentence must be written.
 */
export async function discoverCreativeTerritories(
  profile: DynamicNicheProfile,
  evidence?: CreativeEvidenceContext,
  count = 8,
): Promise<CreativeTerritory[]> {
  const prompt = `
Discover ${count} distinct creative territories for a commercial t-shirt slogan engine.

NICHE:
${profile.niche}

AUDIENCE:
${profile.audience}

NICHE DIMENSIONS:
${JSON.stringify(profile.dimensions)}

LATENT LIFESTYLE MODEL:
${JSON.stringify(profile.latentLifestyleModel ?? {}, null, 2)}

BEHAVIORAL PROFILE:
${JSON.stringify({
    rituals: profile.rituals,
    microRituals: profile.microRituals ?? [],
    contradictions: profile.contradictions,
    frustrations: profile.frustrations,
    statusSignals: profile.statusSignals,
    insiderLanguage: profile.insiderLanguage,
    embarrassingTruths: profile.embarrassingTruths,
    obsessions: profile.obsessions,
  }, null, 2)}

MARKET EVIDENCE (supporting context only; never force a term):
${JSON.stringify(evidence ?? {}, null, 2)}

A creative territory is a grounded HUMAN TRUTH or semantic premise. It is NOT a slogan, phrase frame, rhetorical formula, sentence opening, pun template, or keyword cluster.

Requirements:
- Every territory must be supported by the profile or supplied evidence.
- Preserve all meaningful dimensions of compound/crossover niches.
- Prefer repeated behavior, private decisions, tensions, involuntary habits, status signals, unspoken rules, emotional rewards, and recognizable consequences.
- Do not invent an activity merely because it sounds thematic.
- Do not describe buying, finding, wearing, gifting, printing, or promoting merchandise unless commerce itself is genuinely the niche behavior.
- Do not prescribe wording such as “X over Y”, “My X”, “More X than Y”, or any other sentence skeleton.
- Territories should be semantically different enough that a final portfolio can explore different truths rather than paraphrasing one observation.
- Evidence arrays must contain short references to supplied profile/evidence facts, never invented citations.

Return JSON only:
{
  "territories": [
    {
      "id": "territory_1",
      "premise": "",
      "humanTruth": "",
      "evidence": [],
      "dimensionCoverage": [],
      "emotionalPayoff": "",
      "tension": "",
      "confidence": 0
    }
  ]
}`;

  const response = await callJson<{ territories?: unknown }>(prompt, 0.35);
  const raw = Array.isArray(response.territories) ? response.territories : [];

  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    .map((item, index) => ({
      id: cleanString(item.id) || `territory_${index + 1}`,
      premise: cleanString(item.premise),
      humanTruth: cleanString(item.humanTruth),
      evidence: cleanStringArray(item.evidence),
      dimensionCoverage: cleanStringArray(item.dimensionCoverage),
      emotionalPayoff: cleanString(item.emotionalPayoff) || undefined,
      tension: cleanString(item.tension) || undefined,
      confidence: clampScore(item.confidence, 60),
    }))
    .filter((territory) => territory.premise && territory.humanTruth && territory.evidence.length > 0)
    .slice(0, count);
}

/**
 * Semantic eligibility is deliberately separate from quality ranking.
 * Fatal truth/product/intersection defects cannot be averaged away by humor,
 * brevity, cleverness, or visual appeal.
 */
export async function assessSemanticEligibility(
  profile: DynamicNicheProfile,
  slogans: string[],
  territories: CreativeTerritory[],
  evidence?: CreativeEvidenceContext,
): Promise<SemanticEligibilityAssessment[]> {
  if (slogans.length === 0) return [];

  const prompt = `
Act as an adversarial semantic eligibility judge for t-shirt slogan candidates.
Do NOT rewrite or improve any candidate. Determine whether each candidate is allowed to enter quality ranking.

NICHE:
${profile.niche}

AUDIENCE:
${profile.audience}

DIMENSIONS:
${JSON.stringify(profile.dimensions)}

GROUND TRUTH PROFILE:
${JSON.stringify({
    latentLifestyleModel: profile.latentLifestyleModel ?? {},
    rituals: profile.rituals,
    microRituals: profile.microRituals ?? [],
    contradictions: profile.contradictions,
    frustrations: profile.frustrations,
    statusSignals: profile.statusSignals,
    insiderLanguage: profile.insiderLanguage,
    embarrassingTruths: profile.embarrassingTruths,
    obsessions: profile.obsessions,
  }, null, 2)}

GROUNDED CREATIVE TERRITORIES:
${JSON.stringify(territories, null, 2)}

MARKET EVIDENCE (corroboration only):
${JSON.stringify(evidence ?? {}, null, 2)}

Judge five independent properties from 0-100:
1. truthGrounding — implied behavior/claim follows from the supplied truth model or evidence.
2. productIndependence — meaning expresses identity, behavior, observation, tension, affiliation, or humor without depending on the merchandise carrying it.
3. intersectionIntegrity — for compound niches, preserves the meaningful intersection rather than collapsing to only one dimension. For a genuinely single-axis niche, score semantic niche coverage instead.
4. semanticCoherence — natural human meaning rather than token stitching, marketing copy, or a category description.
5. unsupportedInferenceRisk — probability the line invents a ritual, profession, event, use case, relationship, or behavior not supported by the supplied evidence. HIGHER IS WORSE.

A candidate is eligible only when ALL are true:
- truthGrounding >= 65
- productIndependence >= 70
- intersectionIntegrity >= 60
- semanticCoherence >= 65
- unsupportedInferenceRisk <= 35

Important:
- Do not reject merely because a familiar word or sentence shape appears.
- Do not approve merely because niche keywords appear.
- Merchandise language is acceptable only if the merchandise itself is genuinely the semantic subject supported by the niche; otherwise it is product-meta leakage.
- Do not reward cleverness, rhyme, brevity, positivity, or marketability here. This stage tests truth eligibility only.
- Keep reasons factual and under 12 words each.

CANDIDATES:
${JSON.stringify(slogans.map((slogan, index) => ({ index, slogan })))}

Return JSON only:
{
  "assessments": [
    {
      "index": 0,
      "truthGrounding": 0,
      "productIndependence": 0,
      "intersectionIntegrity": 0,
      "semanticCoherence": 0,
      "unsupportedInferenceRisk": 0,
      "reasons": []
    }
  ]
}`;

  const response = await callJson<{ assessments?: unknown }>(prompt, 0.05);
  const raw = Array.isArray(response.assessments) ? response.assessments : [];
  const byIndex = new Map<number, Record<string, unknown>>();
  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const record = item as Record<string, unknown>;
    const index = Number(record.index);
    if (Number.isInteger(index) && index >= 0 && index < slogans.length && !byIndex.has(index)) {
      byIndex.set(index, record);
    }
  }

  return slogans.map((slogan, index) => {
    const item = byIndex.get(index) ?? {};
    const truthGrounding = clampScore(item.truthGrounding);
    const productIndependence = clampScore(item.productIndependence);
    const intersectionIntegrity = clampScore(item.intersectionIntegrity);
    const semanticCoherence = clampScore(item.semanticCoherence);
    const unsupportedInferenceRisk = clampScore(item.unsupportedInferenceRisk, 50);
    const eligible = isSemanticallyEligibleAssessment({
      truthGrounding,
      productIndependence,
      intersectionIntegrity,
      semanticCoherence,
      unsupportedInferenceRisk,
    });

    return {
      slogan,
      eligible,
      truthGrounding,
      productIndependence,
      intersectionIntegrity,
      semanticCoherence,
      unsupportedInferenceRisk,
      reasons: cleanStringArray(item.reasons, 4),
    };
  });
}
