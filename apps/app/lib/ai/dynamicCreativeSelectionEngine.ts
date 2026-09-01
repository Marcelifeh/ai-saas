import type { CompositionType, DynamicNicheProfile, RecoveryContext } from "./dynamicNicheProfile";
import type { CreativeDirectionBrief } from "./expressionWorthiness";
import { runStructuredIndexedVerifier } from "./structuredVerifier";
import {
  blindReadingVerifierRowSchema,
  compoundIntersectionVerifierRowSchema,
  semanticEligibilityVerifierRowSchema,
} from "./verifierSchemas";

export interface VerifierExecutionDiagnostics {
  verifierBatchCount: number;
  verifierFormatRepairAttemptCount: number;
  verifierResponseShapes: string[];
}

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
  /** Validated references to original niche/audience/market inputs, never profile output. */
  evidenceRefs?: string[];
  groundingBasis?: "market_corroborated" | "niche_supported_inference";
  dimensionCoverage: string[];
  emotionalPayoff?: string;
  tension?: string;
  confidence: number;
  compositionType?: CompositionType;
  sharedPremise?: string;
  axisContributions?: Array<{ axis: string; contribution: string }>;
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
  axisPresence?: Array<{ axis: string; presence: number }>;
  sharedPremise?: string;
  sharedPremiseSupport?: number;
  mutualDependence?: number;
  adjacencyRisk?: number;
  contextDependenceRisk?: number;
  compositionType?: CompositionType;
  reasons: string[];
}

export interface EmergentIntersectionAssessment {
  sharedPremise: string;
  compositionType: CompositionType;
  axisSupport: Array<{ axis: string; support: number; presence: number }>;
  sharedPremiseSupport: number;
  mutualDependence: number;
  adjacencyRisk: number;
  contextDependenceRisk: number;
  unsupportedInferenceRisk: number;
  intersectionPreservation: number;
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
  behavioralHypothesisCount: number;
  behavioralFacetCount: number;
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

export function isEmergentIntersectionPreserved(
  assessment: Pick<EmergentIntersectionAssessment,
    "axisSupport" | "sharedPremiseSupport" | "mutualDependence" | "adjacencyRisk" |
    "contextDependenceRisk" | "unsupportedInferenceRisk" | "intersectionPreservation">,
  expectedAxisCount: number,
): boolean {
  const values = [
    assessment.sharedPremiseSupport,
    assessment.mutualDependence,
    assessment.adjacencyRisk,
    assessment.contextDependenceRisk,
    assessment.unsupportedInferenceRisk,
    assessment.intersectionPreservation,
    ...assessment.axisSupport.flatMap((axis) => [axis.support, axis.presence]),
  ];
  if (!values.every((value) => Number.isFinite(value))) return false;
  return assessment.axisSupport.length === expectedAxisCount &&
    assessment.axisSupport.every((axis) => axis.support >= SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity) &&
    assessment.sharedPremiseSupport >= SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity &&
    assessment.mutualDependence >= SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity &&
    assessment.intersectionPreservation >= SEMANTIC_ELIGIBILITY_THRESHOLDS.intersectionIntegrity &&
    assessment.adjacencyRisk <= SEMANTIC_ELIGIBILITY_THRESHOLDS.unsupportedInferenceRisk &&
    assessment.contextDependenceRisk <= SEMANTIC_ELIGIBILITY_THRESHOLDS.unsupportedInferenceRisk &&
    assessment.unsupportedInferenceRisk <= SEMANTIC_ELIGIBILITY_THRESHOLDS.unsupportedInferenceRisk;
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
  const behavioralHypothesisCount = new Set(
    behavioralSources.flat().map((value) => value.trim().toLowerCase()).filter(Boolean),
  ).size;
  const compoundAxisCount = profile.nicheComposition?.kind === "compound"
    ? profile.nicheComposition.axes.length
    : 0;
  const compositionType = profile.nicheComposition?.compositionType;
  const requiresBehavioralProfile = profile.nicheComposition?.kind !== "compound" ||
    compositionType === "BEHAVIORAL_INTERSECTION" || compositionType === "RITUAL_INTERSECTION";
  const semanticSources = compositionType === "IDENTITY_INTERSECTION"
    ? [lifestyle?.identitySignals ?? [], lifestyle?.sharedMeanings ?? [], profile.statusSignals, lifestyle?.emotionalRewards ?? [], lifestyle?.tensions ?? [], lifestyle?.culturalCodes ?? [], profile.insiderLanguage, profile.visualCulture]
    : compositionType === "CULTURAL_INTERSECTION"
      ? [lifestyle?.culturalCodes ?? [], profile.insiderLanguage, lifestyle?.sharedMeanings ?? [], lifestyle?.unspokenRules ?? [], lifestyle?.socialInteractions ?? [], lifestyle?.symbolicAssociations ?? [], profile.statusSignals, profile.visualCulture]
      : compositionType === "AESTHETIC_INTERSECTION"
        ? [lifestyle?.aestheticCodes ?? [], profile.visualCulture, lifestyle?.sharedMeanings ?? [], lifestyle?.recurringObjects ?? [], profile.statusSignals, lifestyle?.symbolicAssociations ?? [], lifestyle?.identitySignals ?? []]
        : compositionType === "SYMBOLIC_INTERSECTION"
          ? [lifestyle?.symbolicAssociations ?? [], lifestyle?.sharedMeanings ?? [], lifestyle?.identitySignals ?? [], lifestyle?.emotionalRewards ?? [], lifestyle?.tensions ?? [], lifestyle?.culturalCodes ?? [], lifestyle?.aestheticCodes ?? [], profile.visualCulture, profile.insiderLanguage, profile.statusSignals]
          : behavioralSources;
  const semanticHypothesisCount = new Set(semanticSources.flat().map((value) => value.trim().toLowerCase()).filter(Boolean)).size;
  const semanticFacetCount = semanticSources.filter((values) => values.some((value) => value.trim().length > 0)).length;
  const reasons: string[] = [];
  if (requiresBehavioralProfile) {
    if (observableSceneCount === 0) reasons.push("No causally complete observable scene");
    if (behavioralHypothesisCount < 4) reasons.push("Too few plausible behavioral hypotheses");
    if (behavioralSources.length < 2) reasons.push("Behavioral profile lacks facet diversity");
  } else {
    if (!profile.nicheComposition?.sharedPremise) reasons.push("Compound shared premise is unresolved");
    const roleAxes = new Set((profile.nicheComposition?.axisRoles ?? []).map((role) => role.axis.toLowerCase()));
    if (!profile.nicheComposition?.axes.every((axis) => roleAxes.has(axis.toLowerCase()))) {
      reasons.push("One or more compound axis contributions are unresolved");
    }
    if (semanticHypothesisCount < 2) reasons.push("Too few composition-relevant semantic hypotheses");
    if (semanticFacetCount < 1) reasons.push("Semantic profile has no composition-relevant facet");
  }
  if (profile.nicheComposition?.kind === "compound" && compoundAxisCount < 2) {
    reasons.push("Compound niche axes are unresolved");
  }
  return {
    status: reasons.length === 0 ? "SUFFICIENT" : "INSUFFICIENT",
    observableSceneCount,
    behavioralHypothesisCount: requiresBehavioralProfile ? behavioralHypothesisCount : semanticHypothesisCount,
    behavioralFacetCount: requiresBehavioralProfile ? behavioralSources.length : semanticFacetCount,
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
  truthGrounding: "Previous candidates expressed a premise unsupported by the original niche, audience, or corroborating evidence.",
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
  const profileHypotheses = [
    ...(lifestyle?.privateRituals ?? []),
    ...(lifestyle?.participationHabits ?? []),
    ...(lifestyle?.involuntaryBehaviors ?? []),
    ...(lifestyle?.repeatedDecisions ?? []),
    ...(lifestyle?.tinyFrustrations ?? []),
    ...(lifestyle?.smallVictories ?? []),
    ...(input.profile.microRituals ?? []),
    ...(lifestyle?.sharedMeanings ?? []),
    ...(lifestyle?.culturalCodes ?? []),
    ...(lifestyle?.aestheticCodes ?? []),
    ...(lifestyle?.symbolicAssociations ?? []),
    ...(lifestyle?.identitySignals ?? []),
  ].filter(Boolean).slice(0, 16);
  return {
    attempt: input.attempt,
    dominantFailureDimensions,
    profileHypotheses,
    territoryHypotheses: input.territories.map((territory) => territory.humanTruth).filter(Boolean).slice(0, 12),
    corroboratedTruths: input.territories
      .filter((territory) => territory.groundingBasis === "market_corroborated")
      .map((territory) => territory.humanTruth)
      .filter(Boolean)
      .slice(0, 12),
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

export function validateTerritoryEvidenceRefs(
  refs: unknown,
  evidence?: CreativeEvidenceContext,
): string[] {
  const allowed = new Set([
    "niche",
    "audience",
    ...(evidence?.trendSignals ?? []).map((_, index) => `trend:${index}`),
    ...(evidence?.buyerLanguage ?? []).map((_, index) => `buyer:${index}`),
    ...(evidence?.culturalSignals ?? []).map((_, index) => `culture:${index}`),
    ...(evidence?.purchaseSignals ?? []).map((_, index) => `purchase:${index}`),
  ]);
  return cleanStringArray(refs).filter((ref) => allowed.has(ref));
}

async function callJson<T>(
  prompt: string,
  temperature = 0.15,
  model = "gpt-4o-mini",
): Promise<Partial<T>> {
  const { chatCompletionSafe } = await import("./aiGateway");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await chatCompletionSafe({
      model,
      temperature,
      max_tokens: 5200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Return only valid JSON. Do not include markdown, comments, chain-of-thought, or explanatory prose outside the requested JSON.",
        },
        { role: "user", content: prompt },
      ],
    });

    if (response.error) {
      const message = response.message || "Creative selection request failed";
      if (/\b429\b|rate limit/i.test(message) && attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        continue;
      }
      throw new Error(message);
    }
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
  throw new Error("Creative selection request exhausted retries");
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
  creativeDirection?: CreativeDirectionBrief,
): Promise<CreativeTerritory[]> {
  const composition = profile.nicheComposition;
  const primaryConfidence = composition?.compositionConfidence ?? composition?.confidence ?? 100;
  const strongestAlternative = composition?.alternativeCompositionTypes?.[0];
  const exploreAlternative = Boolean(strongestAlternative) && (
    primaryConfidence < 65 || primaryConfidence - (strongestAlternative?.confidence ?? 0) <= 15
  );
  const boundedCompositionHypotheses = [
    composition?.compositionType
      ? {
          compositionType: composition.compositionType,
          confidence: primaryConfidence,
          sharedPremise: composition.sharedPremise,
        }
      : undefined,
    exploreAlternative ? strongestAlternative : undefined,
  ].filter(Boolean);
  const allowedCompositionTypes = new Set(boundedCompositionHypotheses
    .map((hypothesis) => hypothesis?.compositionType)
    .filter(Boolean));
  const indexedEvidence = [
    ...(evidence?.trendSignals ?? []).map((value, index) => ({ ref: `trend:${index}`, value })),
    ...(evidence?.buyerLanguage ?? []).map((value, index) => ({ ref: `buyer:${index}`, value })),
    ...(evidence?.culturalSignals ?? []).map((value, index) => ({ ref: `culture:${index}`, value })),
    ...(evidence?.purchaseSignals ?? []).map((value, index) => ({ ref: `purchase:${index}`, value })),
  ];
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

BOUNDED COMPOSITION HYPOTHESES FOR TERRITORY EXPLORATION:
${JSON.stringify(boundedCompositionHypotheses, null, 2)}

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

ORIGINAL EVIDENCE SOURCES:
${JSON.stringify({
    niche: profile.niche,
    audience: profile.audience,
    indexedMarketEvidence: indexedEvidence,
  }, null, 2)}

USER CREATIVE BRIEF (expression preference only; never evidence):
${JSON.stringify(creativeDirection ?? {}, null, 2)}

A creative territory is a grounded HUMAN TRUTH or semantic premise. It is NOT a slogan, phrase frame, rhetorical formula, sentence opening, pun template, or keyword cluster.

Requirements:
- Every territory must be supported by the profile or supplied evidence.
- Treat the dynamic profile as a set of model-inferred creative hypotheses, not independent evidence. A claim does not become grounded merely because it appears in the profile.
- For each territory, cite only exact evidence reference IDs from ORIGINAL EVIDENCE SOURCES. Use "niche" or "audience" only when the premise is a conservative implication of that explicit input.
- A compound niche label by itself can support an emergent conceptual, symbolic, aesthetic, or identity relationship that follows directly from both axes. It does NOT prove that an organized community, recurring event, themed activity, contest, tradition, ritual, status hierarchy, insider language, or shared behavior exists. Those concrete claims require direct original evidence beyond model-authored profile hypotheses.
- Set groundingBasis to market_corroborated when at least one market evidence ref directly supports the premise; otherwise use niche_supported_inference.
- The user creative brief may shape expression-worthiness but cannot ground a behavioral claim.
- Preserve all meaningful dimensions of compound/crossover niches.
- For a compound niche, every territory must arise from the intersection and dimensionCoverage must contain every exact nicheComposition axis. Do not admit a premise that merely serves one axis.
- Copy one listed bounded compositionType and its corresponding sharedPremise into each compound territory. Give one axisContribution for every exact axis.
- When bounded composition hypotheses contains a secondary interpretation, a territory may choose either listed compositionType when that interpretation produces the stronger source-supported relationship. Choose exactly one per territory; do not blend labels or explore any unlisted type.
- Derive each compound territory from the strongest shared semantic relationship between the axes. BEHAVIORAL_INTERSECTION and RITUAL_INTERSECTION require a supported joint action or observance. IDENTITY_INTERSECTION may use self-concept, affiliation, role, or status; CULTURAL_INTERSECTION may use lore, norms, language, or community shorthand; AESTHETIC_INTERSECTION may use coherent taste or visual grammar; SYMBOLIC_INTERSECTION may use mythology, metaphor, archetype, or emblematic meaning.
- Do not convert identity, cultural, aesthetic, or symbolic relationships into fictional behaviors. Behavior is one semantic family, not the universal bridge.
- Apply the removal test: removing either axis must materially alter the premise or its creative justification.
- Reject parallel comparison, generic belonging, one-axis collapse, decoration, mood/setting adjacency, and “X plus Y” summaries.
- Prefer grounded tensions, meanings, status signals, unspoken rules, emotional rewards, identity projections, cultural shorthand, conceptual reframings, and—when compositionType calls for it—repeated behavior or ritual.
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
      "evidenceRefs": [],
      "groundingBasis": "niche_supported_inference",
      "dimensionCoverage": [],
      "emotionalPayoff": "",
      "tension": "",
      "confidence": 0,
      "compositionType": "IDENTITY_INTERSECTION",
      "sharedPremise": "",
      "axisContributions": [{ "axis": "", "contribution": "" }]
    }
  ]
}`;

  const territoryModel = process.env.OPENAI_SLOGAN_CREATIVE_MODEL?.trim() || "gpt-4.1";
  const response = await callJson<{ territories?: unknown }>(prompt, 0.35, territoryModel);
  const raw = Array.isArray(response.territories) ? response.territories : [];

  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    .map((item, index) => {
      const evidenceRefs = validateTerritoryEvidenceRefs(item.evidenceRefs, evidence);
      const requestedGroundingBasis = cleanString(item.groundingBasis);
      const hasMarketReference = evidenceRefs.some((ref) => !["niche", "audience"].includes(ref));
      return {
        id: cleanString(item.id) || `territory_${index + 1}`,
        premise: cleanString(item.premise),
        humanTruth: cleanString(item.humanTruth),
        evidence: cleanStringArray(item.evidence),
        evidenceRefs,
        groundingBasis: hasMarketReference && requestedGroundingBasis === "market_corroborated"
          ? "market_corroborated" as const
          : "niche_supported_inference" as const,
        dimensionCoverage: cleanStringArray(item.dimensionCoverage),
        emotionalPayoff: cleanString(item.emotionalPayoff) || undefined,
        tension: cleanString(item.tension) || undefined,
        confidence: clampScore(item.confidence, 60),
        compositionType: allowedCompositionTypes.has(cleanString(item.compositionType) as CompositionType)
          ? cleanString(item.compositionType) as CompositionType
          : profile.nicheComposition?.compositionType,
        sharedPremise: cleanString(item.sharedPremise) || profile.nicheComposition?.sharedPremise,
        axisContributions: Array.isArray(item.axisContributions)
          ? item.axisContributions.flatMap((value) => {
              if (!value || typeof value !== "object" || Array.isArray(value)) return [];
              const contribution = value as Record<string, unknown>;
              const axis = cleanString(contribution.axis);
              const meaning = cleanString(contribution.contribution);
              return axis && meaning ? [{ axis, contribution: meaning }] : [];
            })
          : undefined,
      };
    })
    .filter((territory) => (
      territory.premise &&
      territory.humanTruth &&
      // Grounding is established by validated source references. Free-text
      // evidence summaries are model-authored diagnostics and must not become
      // a second, circular eligibility requirement.
      (territory.evidenceRefs?.length ?? 0) > 0 &&
      (!requiresIntersectionIntegrity(profile) || (
        allowedCompositionTypes.has(territory.compositionType) &&
        Boolean(territory.sharedPremise) &&
        profile.nicheComposition!.axes.every((axis) => (
          territory.axisContributions?.some((role) => role.axis.toLowerCase() === axis.toLowerCase())
        ))
      ))
    ))
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
  verifierDiagnostics?: VerifierExecutionDiagnostics,
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

MODEL-INFERRED PROFILE HYPOTHESES (creative leads, not independent evidence):
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

CREATIVE TERRITORIES (their profile-derived claims are not independent evidence):
${JSON.stringify(territories, null, 2)}

ORIGINAL GROUNDING SOURCES:
${JSON.stringify({
    niche: profile.niche,
    audience: profile.audience,
    marketEvidence: evidence ?? {},
  }, null, 2)}

Judge five independent properties from 0-100:
1. truthGrounding — the candidate's implied proposition follows conservatively from original sources; behavior is not required when the proposition is identity-, culture-, aesthetic-, ritual-, or symbolism-led.
2. productIndependence — meaning expresses identity, behavior, observation, tension, affiliation, or humor without depending on the merchandise carrying it.
3. intersectionIntegrity — for compound niches, preserves the meaningful intersection rather than collapsing to only one dimension. For a genuinely single-axis niche, score semantic niche coverage instead.
4. semanticCoherence — natural human meaning rather than token stitching, marketing copy, or a category description.
5. unsupportedInferenceRisk — probability the line invents a ritual, profession, event, use case, relationship, or behavior not supported by the supplied evidence. HIGHER IS WORSE.

EVIDENCE PROVENANCE RULES:
- A profile or territory statement produced by a model is a hypothesis, not proof of itself.
- Do not raise truthGrounding merely because candidate wording overlaps a profile field or territory.
- Grounding may come from a conservative implication of the explicit niche/audience or corroboration in original market evidence.
- Indirect, metaphorical, identity-led, or attitudinal expression may be grounded without repeating behavior words. Judge the implied proposition, not surface token overlap.
- If a specific behavior exists only as an uncorroborated model inference, reflect that uncertainty in truthGrounding and unsupportedInferenceRisk.
- Treat a bare compound niche label as support for its conservative emergent meaning, not as proof of organized events, themed activities, contests, traditions, rituals, group norms, status hierarchies, or recurring behavior. Unsupported concrete crossover claims must fail grounding even when both axis words appear.

INTERSECTION APPLICABILITY:
${requiresIntersectionIntegrity(profile)
    ? `This is a ${profile.nicheComposition?.compositionType} compound niche with shared premise ${JSON.stringify(profile.nicheComposition?.sharedPremise ?? "")}. intersectionIntegrity is a required hard gate and must preserve the emergent relationship and all supplied axes naturally. For every candidate, return axisGrounding with exactly one entry for each axis in this order: ${JSON.stringify(profile.nicheComposition?.axes ?? [])}. Score whether the candidate's actual premise is semantically supported by that axis, not whether the axis word appears. Literal axis presence, profile-token overlap, and explicit behavior are not requirements. Removing either axis must materially change the meaning or creative justification.`
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

  if (verifierDiagnostics) verifierDiagnostics.verifierBatchCount += 1;
  const verified = await runStructuredIndexedVerifier({
    prompt,
    model: "gpt-4o-mini",
    temperature: 0.05,
    outputKey: "assessments",
    rowSchema: semanticEligibilityVerifierRowSchema,
    expectedCount: slogans.length,
    expectedSchema: `{ "assessments": [{ "index": 0, "truthGrounding": 0, "productIndependence": 0, "intersectionIntegrity": 0, "semanticCoherence": 0, "unsupportedInferenceRisk": 0, "axisGrounding": [{ "axis": "", "grounding": 0 }], "reasons": [] }] }`,
    label: "Semantic eligibility verifier",
    onFormatRepairAttempt: () => {
      if (verifierDiagnostics) verifierDiagnostics.verifierFormatRepairAttemptCount += 1;
    },
    onInitialResponseShape: (shape) => verifierDiagnostics?.verifierResponseShapes.push(`semantic:${shape}`),
  });

  const intersectionApplicable = requiresIntersectionIntegrity(profile);

  return slogans.map((slogan, index) => {
    const item = verified.rows[index];
    const scores = normalizeEligibilityScoreRecord(item);
    if (!scores) throw new Error(`Eligibility evaluator returned invalid scores for candidate ${index}`);
    const { truthGrounding, productIndependence, intersectionIntegrity, semanticCoherence, unsupportedInferenceRisk } = scores;
    const axisGrounding = item.axisGrounding.map((axis) => ({
      axis: axis.axis,
      grounding: axis.grounding,
    }));
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
      reasons: item.reasons.slice(0, 4),
    };
  });
}

// Four rows keeps structured responses well below the observed 7/8 truncation boundary.
const ELIGIBILITY_BATCH_SIZE = 4;

async function assessCompoundIntersectionBatch(
  profile: DynamicNicheProfile,
  slogans: string[],
  _territories: CreativeTerritory[],
  evidence?: CreativeEvidenceContext,
  verifierDiagnostics?: VerifierExecutionDiagnostics,
): Promise<Array<EmergentIntersectionAssessment & { slogan: string; reasons: string[] }>> {
  const axes = profile.nicheComposition?.axes ?? [];
  const verifierModel = process.env.OPENAI_SLOGAN_VERIFIER_MODEL?.trim() || "gpt-4o";
  const blindPrompt = `
Read these candidate phrases in isolation. You are not given a niche, audience, profile, source axes, or creative brief.

For each candidate, state only the minimal proposition and semantic cues actually communicated by its words or broadly established idiom. Do not guess a hidden niche and do not enrich generic language with external context.

CANDIDATES:
${JSON.stringify(slogans.map((slogan, index) => ({ index, slogan })))}

Return JSON only:
{
  "readings": [{ "index": 0, "expressedPremise": "", "semanticCues": [], "genericityRisk": 0 }]
}`;
  if (verifierDiagnostics) verifierDiagnostics.verifierBatchCount += 1;
  const blindReading = await runStructuredIndexedVerifier({
    prompt: blindPrompt,
    model: "gpt-4o-mini",
    temperature: 0.02,
    outputKey: "readings",
    rowSchema: blindReadingVerifierRowSchema,
    expectedCount: slogans.length,
    expectedSchema: `{ "readings": [{ "index": 0, "expressedPremise": "", "semanticCues": [], "genericityRisk": 0 }] }`,
    label: "Blind reading verifier",
    onFormatRepairAttempt: () => {
      if (verifierDiagnostics) verifierDiagnostics.verifierFormatRepairAttemptCount += 1;
    },
    onInitialResponseShape: (shape) => verifierDiagnostics?.verifierResponseShapes.push(`blind:${shape}`),
  });
  const prompt = `
Act as a narrow, adversarial compound-niche integrity verifier. Do not rewrite candidates and do not score humor, brevity, marketability, or general niche relevance.

COMPOUND NICHE:
${profile.niche}

REQUIRED AXES IN EXACT ORDER:
${JSON.stringify(axes)}

COMPOSITION TYPE AND CLASSIFIED SHARED PREMISE (interpretive hypothesis, not proof):
${JSON.stringify({
    compositionType: profile.nicheComposition?.compositionType,
    sharedPremise: profile.nicheComposition?.sharedPremise,
    axisRoles: profile.nicheComposition?.axisRoles,
  }, null, 2)}

ORIGINAL SOURCE EVIDENCE (authoritative):
${JSON.stringify({ niche: profile.niche, audience: profile.audience, marketEvidence: evidence ?? {} }, null, 2)}

BLIND CANDIDATE READINGS (created without seeing the niche; authoritative for what the words actually communicate):
${JSON.stringify(blindReading.rows, null, 2)}

For each candidate:
- State the candidate's minimal sharedPremise: the proposition a wearer or insider would understand, without copying candidate wording.
- Separately score axis PRESENCE and axis SUPPORT. Presence means literal/lexical recoverability. Support means whether the candidate's emergent premise genuinely depends on and is justified by the axis. Low presence must not lower support when compact metaphor, identity, cultural shorthand, aesthetic code, ritual, or symbolism preserves the axis semantically.
- Score sharedPremiseSupport: whether original sources authorize that joint premise. Profile and territory claims can guide interpretation but cannot prove themselves.
- Score mutualDependence with the removal test: would removing either axis materially change the candidate's meaning or creative justification?
- Score adjacencyRisk HIGH for simple juxtaposition, decoration, generic mood, token stitching, or independent one-axis meanings. HIGHER IS WORSE.
- Score contextDependenceRisk HIGH when axis support or the shared intersection appears only after the niche/profile is revealed and is absent from the blind candidate reading. Generic identity, confidence, mystery, celebration, or outsider language normally has high context-dependence unless the candidate itself adds a distinctive emergent semantic cue. HIGHER IS WORSE.
- Score unsupportedInferenceRisk HIGH when the clever connection requires an invented fact, behavior, relationship, lore, or audience claim. HIGHER IS WORSE.
- Score intersectionPreservation for the emergent intersection itself, not for surface mention of source terms.
- Use the supplied compositionType internally. Do not return or reclassify it. Explicit behavior is required only for BEHAVIORAL_INTERSECTION; a supported observance is required for RITUAL_INTERSECTION. Do not impose behavior syntax on identity, cultural, aesthetic, or symbolic intersections.
- Do not award an axis merely because it exists in the niche, profile, territory, or prompt.
- Reject one-axis collapse even when both axis words are present. Allow a compact expression that names neither axis when support, mutual dependence, and source grounding are strong.
- Keep reasons factual and under 12 words.

Hard thresholds are unchanged: every axis support, sharedPremiseSupport, mutualDependence, and intersectionPreservation must be at least 60; adjacencyRisk, contextDependenceRisk, and unsupportedInferenceRisk must be at most 35. Axis presence has no threshold.

CANDIDATES:
${JSON.stringify(slogans.map((slogan, index) => ({ index, slogan })))}

Return JSON only:
{
  "assessments": [
    {
      "index": 0,
      "sharedPremise": "",
      "axisSupport": [{ "axis": "", "support": 0, "presence": 0 }],
      "sharedPremiseSupport": 0,
      "mutualDependence": 0,
      "adjacencyRisk": 0,
      "contextDependenceRisk": 0,
      "unsupportedInferenceRisk": 0,
      "intersectionPreservation": 0,
      "reasons": []
    }
  ]
}`;

  if (verifierDiagnostics) verifierDiagnostics.verifierBatchCount += 1;
  const verified = await runStructuredIndexedVerifier({
    prompt,
    model: verifierModel,
    temperature: 0.02,
    outputKey: "assessments",
    rowSchema: compoundIntersectionVerifierRowSchema,
    expectedCount: slogans.length,
    expectedSchema: `{ "assessments": [{ "index": 0, "sharedPremise": "", "axisSupport": [{ "axis": "", "support": 0, "presence": 0 }], "sharedPremiseSupport": 0, "mutualDependence": 0, "adjacencyRisk": 0, "contextDependenceRisk": 0, "unsupportedInferenceRisk": 0, "intersectionPreservation": 0, "reasons": [] }] }`,
    label: "Compound intersection verifier",
    onFormatRepairAttempt: () => {
      if (verifierDiagnostics) verifierDiagnostics.verifierFormatRepairAttemptCount += 1;
    },
    onInitialResponseShape: (shape) => verifierDiagnostics?.verifierResponseShapes.push(`compound:${shape}`),
  });

  return slogans.map((slogan, index) => {
      const item = verified.rows[index];
      const compositionType = profile.nicheComposition?.compositionType as CompositionType;
      const scoreFields = {
        sharedPremiseSupport: numericScore(item.sharedPremiseSupport),
        mutualDependence: numericScore(item.mutualDependence),
        adjacencyRisk: numericScore(item.adjacencyRisk),
        contextDependenceRisk: numericScore(item.contextDependenceRisk),
        unsupportedInferenceRisk: numericScore(item.unsupportedInferenceRisk),
        intersectionPreservation: numericScore(item.intersectionPreservation),
      };
      if (Object.values(scoreFields).some((score) => score === undefined)) {
        throw new Error(`Compound verifier returned invalid emergent scores for candidate ${index}`);
      }
      const axisSupport = item.axisSupport;
      if (axisSupport.length !== axes.length || !axes.every((axis, axisIndex) => (
        axisSupport[axisIndex]?.axis.toLowerCase() === axis.toLowerCase()
      ))) {
        throw new Error(`Compound verifier returned invalid ordered axis support for candidate ${index}`);
      }
      const scale = (value: number | undefined) => clampScore((value as number) <= 1 ? (value as number) * 100 : value);
      return {
        slogan,
        sharedPremise: cleanString(item.sharedPremise),
        compositionType,
        axisSupport,
        sharedPremiseSupport: scale(scoreFields.sharedPremiseSupport),
        mutualDependence: scale(scoreFields.mutualDependence),
        adjacencyRisk: scale(scoreFields.adjacencyRisk),
        contextDependenceRisk: scale(scoreFields.contextDependenceRisk),
        unsupportedInferenceRisk: scale(scoreFields.unsupportedInferenceRisk),
        intersectionPreservation: scale(scoreFields.intersectionPreservation),
        reasons: item.reasons.slice(0, 4),
      };
    });
}

export async function assessSemanticEligibility(
  profile: DynamicNicheProfile,
  slogans: string[],
  territories: CreativeTerritory[],
  evidence?: CreativeEvidenceContext,
  verifierDiagnostics?: VerifierExecutionDiagnostics,
): Promise<SemanticEligibilityAssessment[]> {
  if (slogans.length === 0) return [];
  const batches: string[][] = [];
  for (let index = 0; index < slogans.length; index += ELIGIBILITY_BATCH_SIZE) {
    batches.push(slogans.slice(index, index + ELIGIBILITY_BATCH_SIZE));
  }
  const assessedBatches = await Promise.all(
    batches.map((batch) => assessSemanticEligibilityBatch(profile, batch, territories, evidence, verifierDiagnostics)),
  );
  const assessments = assessedBatches.flat();
  if (!requiresIntersectionIntegrity(profile)) return assessments;

  const focusedBatches = await Promise.all(
    batches.map((batch) => assessCompoundIntersectionBatch(profile, batch, territories, evidence, verifierDiagnostics)),
  );
  const focused = focusedBatches.flat();
  const expectedAxisCount = profile.nicheComposition?.axes.length ?? 0;
  return assessments.map((assessment, index) => {
    const focusedAssessment = focused[index];
    if (!focusedAssessment || focusedAssessment.slogan !== assessment.slogan) {
      throw new Error(`Compound verifier candidate alignment failed at index ${index}`);
    }
    const axisGrounding = focusedAssessment.axisSupport.map((axis) => ({
      axis: axis.axis,
      grounding: axis.support,
    }));
    const intersectionIntegrity = Math.min(
      assessment.intersectionIntegrity,
      focusedAssessment.intersectionPreservation,
      focusedAssessment.sharedPremiseSupport,
      focusedAssessment.mutualDependence,
      ...axisGrounding.map((axis) => axis.grounding),
    );
    const unsupportedInferenceRisk = Math.max(
      assessment.unsupportedInferenceRisk,
      focusedAssessment.unsupportedInferenceRisk,
      focusedAssessment.adjacencyRisk,
      focusedAssessment.contextDependenceRisk,
    );
    const emergentPasses = isEmergentIntersectionPreserved(focusedAssessment, expectedAxisCount);
    return {
      ...assessment,
      intersectionIntegrity,
      axisGrounding,
      axisPresence: focusedAssessment.axisSupport.map((axis) => ({ axis: axis.axis, presence: axis.presence })),
      sharedPremise: focusedAssessment.sharedPremise,
      sharedPremiseSupport: focusedAssessment.sharedPremiseSupport,
      mutualDependence: focusedAssessment.mutualDependence,
      adjacencyRisk: focusedAssessment.adjacencyRisk,
      contextDependenceRisk: focusedAssessment.contextDependenceRisk,
      compositionType: focusedAssessment.compositionType,
      unsupportedInferenceRisk,
      reasons: [...assessment.reasons, ...focusedAssessment.reasons].slice(0, 4),
      eligible: isSemanticallyEligibleAssessment({
        truthGrounding: assessment.truthGrounding,
        productIndependence: assessment.productIndependence,
        intersectionIntegrity,
        semanticCoherence: assessment.semanticCoherence,
        unsupportedInferenceRisk,
      }, {
        intersectionRequired: true,
        expectedAxisCount,
        axisGroundingScores: axisGrounding.map((axis) => axis.grounding),
      }) && emergentPasses,
    };
  });
}
