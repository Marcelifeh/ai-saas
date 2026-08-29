import type { DynamicNicheProfile, RecoveryContext } from "./dynamicNicheProfile";

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
  intersectionApplicable: boolean;
  truthGrounding: number;
  productIndependence: number;
  intersectionIntegrity: number;
  semanticCoherence: number;
  unsupportedInferenceRisk: number;
  axisGrounding: Array<{ axis: string; grounding: number }>;
  reasons: string[];
}

export type SemanticEligibilityFailureDimension =
  | "truthGrounding"
  | "productIndependence"
  | "intersectionIntegrity"
  | "semanticCoherence"
  | "unsupportedInferenceRisk";

export type SemanticRejectionCounts = Record<SemanticEligibilityFailureDimension, number>;

export interface ProfileEvidenceAssessment {
  status: "SUFFICIENT" | "INSUFFICIENT";
  observableSceneCount: number;
  behavioralTruthCount: number;
  behavioralSourceCount: number;
  compoundAxisCount: number;
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
  options: {
    intersectionRequired?: boolean;
    expectedAxisCount?: number;
    axisGroundingScores?: number[];
  } = {},
): boolean {
  const scores = Object.values(assessment);
  if (!scores.every((score) => typeof score === "number" && Number.isFinite(score))) return false;
  const intersectionRequired = options.intersectionRequired ?? true;
  const expectedAxisCount = options.expectedAxisCount ?? 0;
  const axisGroundingPasses = !intersectionRequired || expectedAxisCount === 0 || (
    options.axisGroundingScores?.length === expectedAxisCount &&
    options.axisGroundingScores.every((score) => (
      Number.isFinite(score) && score >= SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity
    ))
  );
  return assessment.truthGrounding >= SEMANTIC_ELIGIBILITY_THRESHOLDS.truthGrounding &&
    assessment.productIndependence >= SEMANTIC_ELIGIBILITY_THRESHOLDS.productIndependence &&
    (!intersectionRequired || assessment.intersectionIntegrity >= SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity) &&
    axisGroundingPasses &&
    assessment.semanticCoherence >= SEMANTIC_ELIGIBILITY_THRESHOLDS.semanticCoherence &&
    assessment.unsupportedInferenceRisk <= SEMANTIC_ELIGIBILITY_THRESHOLDS.unsupportedInferenceRisk;
}

export function requiresIntersectionIntegrity(profile: DynamicNicheProfile): boolean {
  return profile.nicheComposition?.kind === "compound" &&
    (profile.nicheComposition.axes?.length ?? 0) >= 2;
}

export function assessDynamicProfileEvidence(profile: DynamicNicheProfile): ProfileEvidenceAssessment {
  const lifestyle = profile.latentLifestyleModel;
  const scenes = lifestyle?.observableScenes ?? [];
  const observableSceneCount = scenes.filter((scene) => (
    Boolean(scene.doing.trim()) &&
    Boolean(scene.where.trim() || scene.before.trim() || scene.after.trim()) &&
    (scene.recurringObjects.length + scene.environmentalConditions.length + scene.socialContext.length > 0)
  )).length;
  const behavioralSources = [
    profile.rituals,
    profile.microRituals ?? [],
    lifestyle?.privateRituals ?? [],
    lifestyle?.participationHabits ?? [],
    lifestyle?.involuntaryBehaviors ?? [],
    lifestyle?.seasonalBehaviors ?? [],
    lifestyle?.collectionHabits ?? [],
    lifestyle?.repeatedDecisions ?? [],
    lifestyle?.tinyFrustrations ?? [],
    lifestyle?.smallVictories ?? [],
    lifestyle?.unspokenRules ?? [],
  ].filter((values) => values.some((value) => value.trim().length > 0));
  const behavioralTruthCount = new Set(
    behavioralSources.flat().map((value) => value.trim().toLowerCase()).filter(Boolean),
  ).size;
  const compoundAxisCount = profile.nicheComposition?.kind === "compound"
    ? profile.nicheComposition.axes.length
    : 0;
  const reasons: string[] = [];
  if (observableSceneCount === 0) reasons.push("No causally complete observable scene");
  if (behavioralTruthCount < 4) reasons.push("Too few supported behavioral truths");
  if (behavioralSources.length < 2) reasons.push("Behavioral evidence lacks source diversity");
  if (profile.nicheComposition?.kind === "compound" && compoundAxisCount < 2) {
    reasons.push("Compound niche axes are unresolved");
  }
  return {
    status: reasons.length === 0 ? "SUFFICIENT" : "INSUFFICIENT",
    observableSceneCount,
    behavioralTruthCount,
    behavioralSourceCount: behavioralSources.length,
    compoundAxisCount,
    reasons,
  };
}

export function aggregateSemanticRejections(
  assessments: SemanticEligibilityAssessment[],
): SemanticRejectionCounts {
  const counts: SemanticRejectionCounts = {
    truthGrounding: 0,
    productIndependence: 0,
    intersectionIntegrity: 0,
    semanticCoherence: 0,
    unsupportedInferenceRisk: 0,
  };
  for (const assessment of assessments) {
    if (assessment.truthGrounding < SEMANTIC_ELIGIBILITY_THRESHOLDS.truthGrounding) counts.truthGrounding += 1;
    if (assessment.productIndependence < SEMANTIC_ELIGIBILITY_THRESHOLDS.productIndependence) counts.productIndependence += 1;
    if (assessment.intersectionApplicable && (
      assessment.intersectionIntegrity < SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity ||
      assessment.axisGrounding.some((axis) => axis.grounding < SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity)
    )) {
      counts.intersectionIntegrity += 1;
    }
    if (assessment.semanticCoherence < SEMANTIC_ELIGIBILITY_THRESHOLDS.semanticCoherence) counts.semanticCoherence += 1;
    if (assessment.unsupportedInferenceRisk > SEMANTIC_ELIGIBILITY_THRESHOLDS.unsupportedInferenceRisk) counts.unsupportedInferenceRisk += 1;
  }
  return counts;
}

const recoveryGuidance: Record<SemanticEligibilityFailureDimension, string> = {
  truthGrounding: "Previous candidates described identity or mood instead of a supported observable ritual, repeated decision, tension, or consequence.",
  productIndependence: "Previous candidates depended on merchandise, wearing, buying, printing, or promotional language.",
  intersectionIntegrity: "Previous candidates collapsed a compound niche to one axis or stitched unrelated axis language together.",
  semanticCoherence: "Previous candidates stacked concepts unnaturally or read like category and marketing descriptions.",
  unsupportedInferenceRisk: "Previous candidates invented behaviors, roles, events, or use cases absent from the supplied evidence.",
};

export function buildRecoveryContext(input: {
  attempt: number;
  profile: DynamicNicheProfile;
  territories: CreativeTerritory[];
  assessments: SemanticEligibilityAssessment[];
  evidence?: CreativeEvidenceContext;
  alreadyGeneratedCandidateFingerprints: string[];
}): RecoveryContext {
  const failures = aggregateSemanticRejections(input.assessments);
  const dominantFailureDimensions = (Object.entries(failures) as Array<[SemanticEligibilityFailureDimension, number]>)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dimension]) => dimension);
  const lifestyle = input.profile.latentLifestyleModel;
  const supportedProfileTruths = [
    ...(lifestyle?.privateRituals ?? []),
    ...(lifestyle?.participationHabits ?? []),
    ...(lifestyle?.involuntaryBehaviors ?? []),
    ...(lifestyle?.repeatedDecisions ?? []),
    ...(lifestyle?.tinyFrustrations ?? []),
    ...(lifestyle?.smallVictories ?? []),
    ...(input.profile.microRituals ?? []),
  ].filter(Boolean).slice(0, 16);
  return {
    attempt: input.attempt,
    dominantFailureDimensions,
    supportedProfileTruths,
    territoryTruths: input.territories.map((territory) => territory.humanTruth).filter(Boolean).slice(0, 12),
    rejectedSemanticTendencies: dominantFailureDimensions.map((dimension) => recoveryGuidance[dimension]),
    alreadyGeneratedCandidateFingerprints: [...new Set(input.alreadyGeneratedCandidateFingerprints)].slice(0, 80),
    evidenceConstraints: {
      snapshotId: input.evidence?.snapshotId,
      contentHash: input.evidence?.contentHash,
      trendSignalCount: input.evidence?.trendSignals?.length ?? 0,
      buyerLanguageCount: input.evidence?.buyerLanguage?.length ?? 0,
      culturalSignalCount: input.evidence?.culturalSignals?.length ?? 0,
      purchaseSignalCount: input.evidence?.purchaseSignals?.length ?? 0,
    },
  };
}

function clampScore(value: unknown, fallback = 50): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function numericScore(value: unknown): number | undefined {
  if (typeof value !== "number" && (typeof value !== "string" || value.trim() === "")) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function normalizeEligibilityScoreRecord(record: Record<string, unknown>): {
  truthGrounding: number;
  productIndependence: number;
  intersectionIntegrity: number;
  semanticCoherence: number;
  unsupportedInferenceRisk: number;
} | undefined {
  const raw = {
    truthGrounding: numericScore(record.truthGrounding),
    productIndependence: numericScore(record.productIndependence),
    intersectionIntegrity: numericScore(record.intersectionIntegrity),
    semanticCoherence: numericScore(record.semanticCoherence),
    unsupportedInferenceRisk: numericScore(record.unsupportedInferenceRisk),
  };
  if (Object.values(raw).some((value) => value === undefined)) return undefined;
  const values = Object.values(raw) as number[];
  const scale = values.every((value) => value >= 0 && value <= 1) ? 100 : 1;
  return {
    truthGrounding: clampScore((raw.truthGrounding as number) * scale),
    productIndependence: clampScore((raw.productIndependence as number) * scale),
    intersectionIntegrity: clampScore((raw.intersectionIntegrity as number) * scale),
    semanticCoherence: clampScore((raw.semanticCoherence as number) * scale),
    unsupportedInferenceRisk: clampScore((raw.unsupportedInferenceRisk as number) * scale),
  };
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

  if (response.error) throw new Error(response.message || "Creative selection request failed");
  const choice = response.data?.choices?.[0];
  if (choice?.finish_reason === "length") {
    throw new Error("Creative selection response exceeded its output budget");
  }
  const content = choice?.message?.content;
  if (!content) throw new Error("Creative selection returned no JSON content");
  try {
    return JSON.parse(content) as Partial<T>;
  } catch {
    throw new Error("Creative selection returned malformed JSON");
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

NICHE COMPOSITION:
${JSON.stringify(profile.nicheComposition ?? { kind: "single", axes: [] }, null, 2)}

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
- For a compound niche, every territory must arise from the intersection and dimensionCoverage must contain every exact nicheComposition axis. Do not admit a premise that merely serves one axis.
- A compound territory must state a causal behavioral bridge: how one axis changes a ritual, decision, tension, identity signal, or consequence in the other, or how one shared action inherently expresses both.
- Reject parallel comparisons, generic belonging, mood/setting adjacency, aesthetic props, and “X plus Y” summaries as territory premises.
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
async function assessSemanticEligibilityBatch(
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

NICHE COMPOSITION:
${JSON.stringify(profile.nicheComposition ?? { kind: "single", axes: [] }, null, 2)}

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

INTERSECTION APPLICABILITY:
${requiresIntersectionIntegrity(profile)
    ? `This is a compound niche. intersectionIntegrity is a required hard gate and must preserve all supplied axes naturally. For every candidate, return axisGrounding with exactly one entry for each axis in this order: ${JSON.stringify(profile.nicheComposition?.axes ?? [])}. Score whether the candidate's actual premise expresses that axis, not whether the axis appears somewhere in the profile.`
    : "This is a single niche. Score intersectionIntegrity for diagnostic niche coverage, but it is not an eligibility requirement."}

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
      "axisGrounding": [{ "axis": "", "grounding": 0 }],
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

  if (byIndex.size !== slogans.length) {
    throw new Error(`Eligibility evaluator returned ${byIndex.size}/${slogans.length} complete indexed rows`);
  }

  const intersectionApplicable = requiresIntersectionIntegrity(profile);

  return slogans.map((slogan, index) => {
    const item = byIndex.get(index) as Record<string, unknown>;
    const scores = normalizeEligibilityScoreRecord(item);
    if (!scores) throw new Error(`Eligibility evaluator returned invalid scores for candidate ${index}`);
    const { truthGrounding, productIndependence, intersectionIntegrity, semanticCoherence, unsupportedInferenceRisk } = scores;
    const rawAxisGrounding = Array.isArray(item.axisGrounding) ? item.axisGrounding : [];
    const axisGrounding = rawAxisGrounding.flatMap((value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return [];
      const record = value as Record<string, unknown>;
      const axis = cleanString(record.axis);
      const grounding = numericScore(record.grounding);
      return axis && grounding !== undefined ? [{ axis, grounding: clampScore(grounding <= 1 ? grounding * 100 : grounding) }] : [];
    });
    const expectedAxisCount = intersectionApplicable ? profile.nicheComposition?.axes.length ?? 0 : 0;
    if (intersectionApplicable && axisGrounding.length !== expectedAxisCount) {
      throw new Error(`Eligibility evaluator returned ${axisGrounding.length}/${expectedAxisCount} compound-axis scores for candidate ${index}`);
    }
    const eligible = isSemanticallyEligibleAssessment({
      truthGrounding,
      productIndependence,
      intersectionIntegrity,
      semanticCoherence,
      unsupportedInferenceRisk,
    }, {
      intersectionRequired: intersectionApplicable,
      expectedAxisCount,
      axisGroundingScores: axisGrounding.map((axis) => axis.grounding),
    });

    return {
      slogan,
      eligible,
      intersectionApplicable,
      truthGrounding,
      productIndependence,
      intersectionIntegrity,
      semanticCoherence,
      unsupportedInferenceRisk,
      axisGrounding,
      reasons: cleanStringArray(item.reasons, 4),
    };
  });
}

const ELIGIBILITY_BATCH_SIZE = 12;

async function assessCompoundIntersectionBatch(
  profile: DynamicNicheProfile,
  slogans: string[],
  territories: CreativeTerritory[],
): Promise<Array<{
  slogan: string;
  intersectionIntegrity: number;
  axisGrounding: Array<{ axis: string; grounding: number }>;
}>> {
  const axes = profile.nicheComposition?.axes ?? [];
  const prompt = `
Act as a narrow, adversarial compound-niche integrity verifier. Do not rewrite candidates and do not score humor, brevity, marketability, or general niche relevance.

COMPOUND NICHE:
${profile.niche}

REQUIRED AXES IN EXACT ORDER:
${JSON.stringify(axes)}

GROUNDED TERRITORIES:
${JSON.stringify(territories.map((territory) => ({
    humanTruth: territory.humanTruth,
    evidence: territory.evidence,
    dimensionCoverage: territory.dimensionCoverage,
  })), null, 2)}

For each candidate:
- Score each axis from 0-100 based only on meaning actually expressed by the candidate.
- Do not award an axis because it exists in the niche, profile, or territory context.
- A tone modifier does not substitute for the underlying activity/culture axis.
- A broad association, decorative symbol, or adjacent lifestyle cue is insufficient.
- The premise must arise naturally from a behavior, ritual, tension, decision, identity signal, or consequence at the intersection.
- Score intersectionIntegrity no higher than the weakest axis and lower it further for token stitching or unrelated concatenation.
- Keep reasons factual and under 12 words.

Score calibration for every axis:
- 80-100: the axis is explicit and central to the candidate's lived premise.
- 60-79: the axis is clearly implied by a concrete behavior or insider signal.
- 30-59: the candidate is merely related to the axis or uses an adjacent symbol.
- 0-29: the axis is absent, contradicted, or supplied only by external context.

CANDIDATES:
${JSON.stringify(slogans.map((slogan, index) => ({ index, slogan })))}

Return JSON only:
{
  "assessments": [
    {
      "index": 0,
      "intersectionIntegrity": 0,
      "axisGrounding": [{ "axis": "", "grounding": 0 }],
      "reasons": []
    }
  ]
}`;

  const response = await callJson<{ assessments?: unknown }>(prompt, 0.02);
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
    throw new Error(`Compound verifier returned ${byIndex.size}/${slogans.length} complete indexed rows`);
  }

  return slogans.map((slogan, index) => {
    const item = byIndex.get(index) as Record<string, unknown>;
    const rawIntegrity = numericScore(item.intersectionIntegrity);
    if (rawIntegrity === undefined) throw new Error(`Compound verifier returned invalid integrity for candidate ${index}`);
    const rawAxisGrounding = Array.isArray(item.axisGrounding) ? item.axisGrounding : [];
    const axisGrounding = rawAxisGrounding.flatMap((value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return [];
      const record = value as Record<string, unknown>;
      const axis = cleanString(record.axis);
      const grounding = numericScore(record.grounding);
      return axis && grounding !== undefined ? [{ axis, grounding: clampScore(grounding <= 1 ? grounding * 100 : grounding) }] : [];
    });
    if (axisGrounding.length !== axes.length) {
      throw new Error(`Compound verifier returned ${axisGrounding.length}/${axes.length} axis scores for candidate ${index}`);
    }
    return {
      slogan,
      intersectionIntegrity: clampScore(rawIntegrity <= 1 ? rawIntegrity * 100 : rawIntegrity),
      axisGrounding,
    };
  });
}

export async function assessSemanticEligibility(
  profile: DynamicNicheProfile,
  slogans: string[],
  territories: CreativeTerritory[],
  evidence?: CreativeEvidenceContext,
): Promise<SemanticEligibilityAssessment[]> {
  if (slogans.length === 0) return [];
  const batches: string[][] = [];
  for (let index = 0; index < slogans.length; index += ELIGIBILITY_BATCH_SIZE) {
    batches.push(slogans.slice(index, index + ELIGIBILITY_BATCH_SIZE));
  }
  const assessedBatches = await Promise.all(
    batches.map((batch) => assessSemanticEligibilityBatch(profile, batch, territories, evidence)),
  );
  const assessments = assessedBatches.flat();
  if (!requiresIntersectionIntegrity(profile)) return assessments;

  const focusedBatches = await Promise.all(
    batches.map((batch) => assessCompoundIntersectionBatch(profile, batch, territories)),
  );
  const focused = focusedBatches.flat();
  const expectedAxisCount = profile.nicheComposition?.axes.length ?? 0;
  return assessments.map((assessment, index) => {
    const focusedAssessment = focused[index];
    if (!focusedAssessment || focusedAssessment.slogan !== assessment.slogan) {
      throw new Error(`Compound verifier candidate alignment failed at index ${index}`);
    }
    const axisGrounding = assessment.axisGrounding.map((axis, axisIndex) => ({
      axis: profile.nicheComposition?.axes[axisIndex] ?? axis.axis,
      grounding: Math.min(axis.grounding, focusedAssessment.axisGrounding[axisIndex]?.grounding ?? 0),
    }));
    const intersectionIntegrity = Math.min(
      assessment.intersectionIntegrity,
      focusedAssessment.intersectionIntegrity,
      ...axisGrounding.map((axis) => axis.grounding),
    );
    return {
      ...assessment,
      intersectionIntegrity,
      axisGrounding,
      eligible: isSemanticallyEligibleAssessment({
        truthGrounding: assessment.truthGrounding,
        productIndependence: assessment.productIndependence,
        intersectionIntegrity,
        semanticCoherence: assessment.semanticCoherence,
        unsupportedInferenceRisk: assessment.unsupportedInferenceRisk,
      }, {
        intersectionRequired: true,
        expectedAxisCount,
        axisGroundingScores: axisGrounding.map((axis) => axis.grounding),
      }),
    };
  });
}
