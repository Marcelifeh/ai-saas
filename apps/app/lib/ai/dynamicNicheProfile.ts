import type { CreativeDirectionBrief } from "./expressionWorthiness";
import type { ExpressionIntent } from "./expressionIntent";

export type IdentityDirection =
  | "proud_participant"
  | "reluctant_participant"
  | "aspiring_participant"
  | "self_deprecating_outsider";

export interface LifestyleScene {
  who: string;
  where: string;
  doing: string;
  before: string;
  after: string;
  recurringObjects: string[];
  environmentalConditions: string[];
  socialContext: string[];
  emotionalStates: string[];
}

export interface LatentLifestyleModel {
  identityDirection?: IdentityDirection;
  observableScenes: LifestyleScene[];
  privateRituals: string[];
  /** Repeated ways members engage with the core activity or interest. */
  participationHabits?: string[];
  /** Automatic, barely noticed responses and habits triggered by niche situations. */
  involuntaryBehaviors?: string[];
  /** Calendar-, season-, event-, or time-triggered changes in behavior. */
  seasonalBehaviors?: string[];
  /** Objects actively used for comfort during the behavior, not decorative topic symbols. */
  comfortObjects?: string[];
  /** Repeated acquiring, curating, organizing, preserving, or upgrading behavior. */
  collectionHabits?: string[];
  environments: string[];
  recurringObjects: string[];
  socialInteractions: string[];
  tensions: string[];
  identitySignals: string[];
  repeatedDecisions: string[];
  tinyFrustrations: string[];
  smallVictories: string[];
  unspokenRules: string[];
  emotionalRewards: string[];
  sharedMeanings?: string[];
  culturalCodes?: string[];
  aestheticCodes?: string[];
  symbolicAssociations?: string[];
}

export const COMPOSITION_TYPES = [
  "BEHAVIORAL_INTERSECTION",
  "IDENTITY_INTERSECTION",
  "CULTURAL_INTERSECTION",
  "AESTHETIC_INTERSECTION",
  "RITUAL_INTERSECTION",
  "SYMBOLIC_INTERSECTION",
] as const;

export type CompositionType = typeof COMPOSITION_TYPES[number];

export interface NicheComposition {
  kind: "single" | "compound";
  axes: string[];
  compositionType?: CompositionType;
  sharedPremise?: string;
  axisRoles?: Array<{ axis: string; contribution: string }>;
  evidenceRefs?: string[];
  confidence?: number;
  compositionConfidence?: number;
  alternativeCompositionTypes?: Array<{
    compositionType: CompositionType;
    confidence: number;
    sharedPremise: string;
    axisRoles?: Array<{ axis: string; contribution: string }>;
    evidenceRefs?: string[];
  }>;
}

export interface RecoveryContext {
  attempt: number;
  dominantFailureDimensions: string[];
  profileHypotheses: string[];
  territoryHypotheses: string[];
  corroboratedTruths: string[];
  rejectedSemanticTendencies: string[];
  alreadyGeneratedCandidateFingerprints: string[];
  evidenceConstraints: {
    snapshotId?: string;
    contentHash?: string;
    trendSignalCount: number;
    buyerLanguageCount: number;
    culturalSignalCount: number;
    purchaseSignalCount: number;
  };
}

export interface ExpressionRecoveryContext {
  attempt: number;
  minimumExpressionTarget: number;
  dominantWeakDimensions: string[];
  rejectedExpressionTendencies: string[];
  bindingNegativeConstraints: string[];
  excludedConceptKeys: string[];
}

export type DynamicNicheProfile = {
  niche: string;
  nicheComposition?: NicheComposition;
  dimensions: string[];
  audience: string;
  rituals: string[];
  microRituals?: string[];
  contradictions: string[];
  frustrations: string[];
  statusSignals: string[];
  insiderLanguage: string[];
  embarrassingTruths: string[];
  obsessions: string[];
  visualCulture: string[];
  purchaseMotives: string[];
  /**
   * Optional so cached profiles and callers that still construct the legacy
   * flat shape remain valid. Newly inferred profiles always populate it.
   */
  latentLifestyleModel?: LatentLifestyleModel;
};


export interface DynamicProfileEvidenceContext {
  snapshotId?: string;
  contentHash?: string;
  trendSignals?: string[];
  buyerLanguage?: string[];
  culturalSignals?: string[];
  purchaseSignals?: string[];
}

export interface DynamicSloganGenerationOptions {
  creativeTerritories?: Array<{
    id: string;
    premise: string;
    humanTruth: string;
    evidence: string[];
    evidenceRefs?: string[];
    groundingBasis?: "market_corroborated" | "niche_supported_inference";
    dimensionCoverage: string[];
    emotionalPayoff?: string;
    tension?: string;
    confidence: number;
    compositionType?: CompositionType;
    sharedPremise?: string;
    axisContributions?: Array<{ axis: string; contribution: string }>;
  }>;
  excludeSlogans?: string[];
  recoveryContext?: RecoveryContext;
  expressionRecoveryContext?: ExpressionRecoveryContext;
  creativeDirection?: CreativeDirectionBrief;
  expressionIntents?: ExpressionIntent[];
  originalUserDirection?: string;
}

export type SloganLayoutMode = "compact" | "standard" | "statement";

export interface SloganLengthBudget {
  idealWords: number;
  maxWords: number;
  idealCharacters: number;
  maxCharacters: number;
  targetReadTimeMs: number;
}

export interface AdaptiveBrevityEvaluation {
  score: number;
  passes: boolean;
  wordCount: number;
  characterCount: number;
  visualWidth: number;
}

export interface CompressionMeaningRetention {
  originalTruth: number;
  compressedTruth: number;
  originalSpecificity: number;
  compressedSpecificity: number;
  truthRetentionRatio: number;
  specificityRetentionRatio: number;
  evidenceOverlapRatio: number;
  preservesActionEvidence: boolean;
  preservesMeaning: boolean;
}

export interface DynamicCompressionAttempt extends CompressionMeaningRetention {
  original: string;
  compressed: string;
}

export type SelfRevelationClassification =
  | "description"
  | "self_revelation"
  | "uncertain";

export interface SelfRevelationAssessment {
  slogan: string;
  classification: SelfRevelationClassification;
  confidence: number;
  score: number;
  reason: string;
}

export function applySelfRevelationScoreCap(
  score: number,
  assessment: SelfRevelationAssessment,
  minimumConfidence = 80,
  descriptiveCap = 68,
): number {
  return assessment.classification === "description" &&
    assessment.confidence >= minimumConfidence
    ? Math.min(score, descriptiveCap)
    : score;
}

export interface DynamicRankingWeights {
  truth: number;
  authenticity: number;
  recognition: number;
  recognitionProbability: number;
  selfRevelation: number;
  semanticCompression: number;
  brevity: number;
  visualWidth: number;
  contradiction: number;
}

export type RhetoricalFamily =
  | "COMMAND"
  | "COMPARISON"
  | "CONFESSION"
  | "CONTRAST"
  | "IDENTITY"
  | "OBSERVATION"
  | "PRIORITY"
  | "QUESTION"
  | "WARNING";

export interface StructuralFingerprint {
  family: RhetoricalFamily;
  pattern: string;
  opening: string;
}

export interface StructuralDiversityMetrics {
  structuralFingerprint: string;
  rhetoricalFamily: RhetoricalFamily;
  lexicalOpening: string;
  structuralDiversityPenalty: number;
}

type DynamicProfileJson = Partial<Omit<DynamicNicheProfile, "niche">>;

const SIGNAL_STOP_WORDS = new Set([
  "game",
  "games",
  "gamer",
  "gamers",
  "gaming",
  "app",
  "apps",
  "cozy",
  "content",
  "culture",
  "community",
  "crime",
  "fan",
  "fans",
  "people",
  "player",
  "players",
  "sarcastic",
  "thing",
  "things",
  "true",
  "video",
  "videos",
]);

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeNicheComposition(value: unknown): NicheComposition | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  const kind = safeString(record.kind).toLowerCase();
  if (kind !== "single" && kind !== "compound") return undefined;
  const axes = safeStringArray(record.axes);
  if (kind === "compound" && axes.length < 2) return undefined;
  const compositionType = COMPOSITION_TYPES.includes(record.compositionType as CompositionType)
    ? record.compositionType as CompositionType
    : undefined;
  const rawAxisRoles = Array.isArray(record.axisRoles) ? record.axisRoles : [];
  const axisRoles = rawAxisRoles.flatMap((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const role = value as Record<string, unknown>;
    const axis = safeString(role.axis);
    const contribution = safeString(role.contribution);
    return axis && contribution ? [{ axis, contribution }] : [];
  });
  const rawConfidence = Number(record.confidence);
  const rawCompositionConfidence = Number(record.compositionConfidence);
  const alternativeCompositionTypes = (Array.isArray(record.alternativeCompositionTypes)
    ? record.alternativeCompositionTypes
    : []).flatMap((value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return [];
      const alternative = value as Record<string, unknown>;
      const alternativeType = COMPOSITION_TYPES.includes(alternative.compositionType as CompositionType)
        ? alternative.compositionType as CompositionType
        : undefined;
      const rawAlternativeConfidence = Number(alternative.confidence);
      const sharedPremise = safeString(alternative.sharedPremise);
      if (!alternativeType || !Number.isFinite(rawAlternativeConfidence) || !sharedPremise) return [];
      const alternativeAxisRoles = (Array.isArray(alternative.axisRoles)
        ? alternative.axisRoles
        : []).flatMap((value) => {
          if (!value || typeof value !== "object" || Array.isArray(value)) return [];
          const role = value as Record<string, unknown>;
          const axis = safeString(role.axis);
          const contribution = safeString(role.contribution);
          return axis && contribution ? [{ axis, contribution }] : [];
        });
      return [{
        compositionType: alternativeType,
        confidence: Math.max(0, Math.min(100, Math.round(rawAlternativeConfidence <= 1
          ? rawAlternativeConfidence * 100
          : rawAlternativeConfidence))),
        sharedPremise,
        axisRoles: alternativeAxisRoles.length > 0 ? alternativeAxisRoles : undefined,
        evidenceRefs: safeStringArray(alternative.evidenceRefs),
      }];
    }).slice(0, 2);
  const confidence = Number.isFinite(rawCompositionConfidence)
    ? Math.max(0, Math.min(100, Math.round(rawCompositionConfidence <= 1
      ? rawCompositionConfidence * 100
      : rawCompositionConfidence)))
    : Number.isFinite(rawConfidence)
      ? Math.max(0, Math.min(100, Math.round(rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence)))
      : undefined;
  return {
    kind,
    axes,
    compositionType,
    sharedPremise: safeString(record.sharedPremise) || undefined,
    axisRoles: axisRoles.length > 0 ? axisRoles : undefined,
    evidenceRefs: safeStringArray(record.evidenceRefs),
    confidence,
    compositionConfidence: confidence,
    alternativeCompositionTypes: alternativeCompositionTypes.length > 0
      ? alternativeCompositionTypes
      : undefined,
  };
}

export function canonicalSloganKey(slogan: string): string {
  return slogan
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’“”'"`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function dedupeCanonicalSlogans(slogans: string[]): string[] {
  const seen = new Set<string>();
  return slogans.filter((slogan) => {
    const key = canonicalSloganKey(slogan);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function safeStringArray(value: unknown, limit = 12): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean))]
    .slice(0, limit);
}

function safeIdentityDirection(value: unknown): IdentityDirection | undefined {
  if (
    value === "proud_participant" ||
    value === "reluctant_participant" ||
    value === "aspiring_participant" ||
    value === "self_deprecating_outsider"
  ) {
    return value;
  }
  return undefined;
}

function safeLifestyleScene(value: unknown): LifestyleScene | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const scene = value as Record<string, unknown>;
  const normalized = {
    who: safeString(scene.who),
    where: safeString(scene.where),
    doing: safeString(scene.doing),
    before: safeString(scene.before),
    after: safeString(scene.after),
    recurringObjects: safeStringArray(scene.recurringObjects, 8),
    environmentalConditions: safeStringArray(scene.environmentalConditions, 8),
    socialContext: safeStringArray(scene.socialContext, 8),
    emotionalStates: safeStringArray(scene.emotionalStates, 8),
  };

  return Object.values(normalized).some((entry) => Array.isArray(entry) ? entry.length > 0 : Boolean(entry))
    ? normalized
    : null;
}

function safeLifestyleScenes(value: unknown, limit = 8): LifestyleScene[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(safeLifestyleScene)
    .filter((scene): scene is LifestyleScene => scene !== null)
    .slice(0, limit);
}

function safeLatentLifestyleModel(value: unknown): LatentLifestyleModel {
  const model = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

  return {
    identityDirection: safeIdentityDirection(model.identityDirection),
    observableScenes: safeLifestyleScenes(model.observableScenes),
    privateRituals: safeStringArray(model.privateRituals),
    participationHabits: safeStringArray(model.participationHabits),
    involuntaryBehaviors: safeStringArray(model.involuntaryBehaviors),
    seasonalBehaviors: safeStringArray(model.seasonalBehaviors),
    comfortObjects: safeStringArray(model.comfortObjects),
    collectionHabits: safeStringArray(model.collectionHabits),
    environments: safeStringArray(model.environments),
    recurringObjects: safeStringArray(model.recurringObjects),
    socialInteractions: safeStringArray(model.socialInteractions),
    tensions: safeStringArray(model.tensions),
    identitySignals: safeStringArray(model.identitySignals),
    repeatedDecisions: safeStringArray(model.repeatedDecisions),
    tinyFrustrations: safeStringArray(model.tinyFrustrations),
    smallVictories: safeStringArray(model.smallVictories),
    unspokenRules: safeStringArray(model.unspokenRules),
    emotionalRewards: safeStringArray(model.emotionalRewards),
    sharedMeanings: safeStringArray(model.sharedMeanings),
    culturalCodes: safeStringArray(model.culturalCodes),
    aestheticCodes: safeStringArray(model.aestheticCodes),
    symbolicAssociations: safeStringArray(model.symbolicAssociations),
  };
}

export function normalizeDynamicNicheProfile(
  niche: string,
  audience: string | undefined,
  value: unknown,
  inferredComposition?: NicheComposition,
): DynamicNicheProfile {
  const json = value && typeof value === "object" && !Array.isArray(value)
    ? value as DynamicProfileJson
    : {};

  const parsedComposition = safeNicheComposition(json.nicheComposition);
  const explicitCompoundAxes = niche.split("×").map((axis) => axis.trim()).filter(Boolean);
  const nicheComposition = inferredComposition ?? (explicitCompoundAxes.length >= 2
    ? {
        kind: "compound" as const,
        axes: explicitCompoundAxes,
      }
    : parsedComposition);

  return {
    niche,
    nicheComposition,
    dimensions: safeStringArray(json.dimensions),
    audience: safeString(json.audience) || audience?.trim() || niche,
    rituals: safeStringArray(json.rituals),
    microRituals: safeStringArray(json.microRituals),
    contradictions: safeStringArray(json.contradictions),
    frustrations: safeStringArray(json.frustrations),
    statusSignals: safeStringArray(json.statusSignals),
    insiderLanguage: safeStringArray(json.insiderLanguage),
    embarrassingTruths: safeStringArray(json.embarrassingTruths),
    obsessions: safeStringArray(json.obsessions),
    visualCulture: safeStringArray(json.visualCulture),
    purchaseMotives: safeStringArray(json.purchaseMotives),
    latentLifestyleModel: safeLatentLifestyleModel(json.latentLifestyleModel),
  };
}

async function callAIJson<T extends Record<string, unknown>>(
  prompt: string,
  temperature = 0.35,
  model = "gpt-4o-mini",
): Promise<Partial<T>> {
  const { chatCompletionSafe } = await import("./aiGateway");
  const response = await chatCompletionSafe({
    model,
    temperature,
    max_tokens: 5200,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Return only valid JSON. Do not include markdown, comments, or explanatory text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  if (response.error) throw new Error(response.message || "Dynamic profile request failed");
  const choice = response.data?.choices?.[0];
  if (choice?.finish_reason === "length") {
    throw new Error("Dynamic profile response exceeded its output budget");
  }
  const content = choice?.message?.content;
  if (!content) throw new Error("Dynamic profile returned no JSON content");

  try {
    return JSON.parse(content) as Partial<T>;
  } catch {
    throw new Error("Dynamic profile returned malformed JSON");
  }
}

export interface NicheCompositionInferenceInput {
  niche: string;
  audience?: string;
  originalUserBrief?: string;
  creativeDirection?: CreativeDirectionBrief;
  evidence?: DynamicProfileEvidenceContext;
}

export async function inferNicheComposition(
  input: NicheCompositionInferenceInput,
): Promise<NicheComposition> {
  const indexedEvidence = [
    ...(input.evidence?.trendSignals ?? []).map((value, index) => ({ ref: `trend:${index}`, value })),
    ...(input.evidence?.buyerLanguage ?? []).map((value, index) => ({ ref: `buyer:${index}`, value })),
    ...(input.evidence?.culturalSignals ?? []).map((value, index) => ({ ref: `culture:${index}`, value })),
    ...(input.evidence?.purchaseSignals ?? []).map((value, index) => ({ ref: `purchase:${index}`, value })),
  ];
  const explicitAxes = input.niche.split("×").map((axis) => axis.trim()).filter(Boolean);
  const compositionModel = process.env.OPENAI_SLOGAN_CREATIVE_MODEL?.trim() || "gpt-4.1";
  const response = await callAIJson<Record<string, unknown>>(`
Infer the semantic composition of this niche before profile generation.

NICHE:
${input.niche}

EXPLICIT COMPOUND AXES (authoritative when two or more are supplied):
${JSON.stringify(explicitAxes)}

AUDIENCE CONTEXT:
${input.audience?.trim() || "Not supplied"}

ORIGINAL USER BRIEF:
${input.originalUserBrief?.trim() || "Not supplied"}

VERIFIED SOURCE EVIDENCE:
${JSON.stringify({ niche: input.niche, audience: input.audience ?? "", indexedEvidence }, null, 2)}

CREATIVE-DIRECTION ATTRIBUTES AND NEGATIVE CONSTRAINTS (interpretive context only; never evidence):
${JSON.stringify(input.creativeDirection ?? {}, null, 2)}

Classify the strongest shared semantic relationship between the axes. Composition types are semantic models, never slogan structures:
- BEHAVIORAL_INTERSECTION: the axes jointly cause or alter a repeated action, decision, consequence, or participation pattern.
- IDENTITY_INTERSECTION: the axes combine into a self-concept, affiliation, role, status, or projected identity whose meaning depends on both.
- CULTURAL_INTERSECTION: shared lore, language, norms, community shorthand, tradition, media code, or subcultural knowledge binds the axes.
- AESTHETIC_INTERSECTION: a coherent taste system, visual grammar, atmosphere, material language, or style code binds the axes.
- RITUAL_INTERSECTION: a recurring ceremony, observance, preparation, seasonal practice, or socially meaningful routine binds the axes.
- SYMBOLIC_INTERSECTION: mythology, metaphor, archetype, emblematic meaning, superstition, or conceptual symbolism binds the axes.

Rules:
- Classify as compound only when removing an axis materially changes the shared premise or creative justification.
- Do not assume every compound is behavioral.
- Select one primary compositionType from the list for a compound niche. Do not create hybrid labels.
- Evaluate every composition type before selecting the primary. Activity axes that jointly describe what people repeatedly do should normally favor BEHAVIORAL_INTERSECTION or RITUAL_INTERSECTION unless original evidence shows that identity, culture, aesthetics, or symbolism is the stronger relationship.
- Return calibrated confidence for the primary and up to two plausible alternatives. Alternatives are bounded semantic hypotheses, not extra labels to force into every territory.
- Every alternative must independently explain both axis contributions and cite the original source evidence that supports its premise. An alternative without both axes or source support is not recoverable.
- Describe each axis's semantic contribution without requiring literal keywords in eventual slogans.
- sharedPremise must explain the emergent relationship, not restate "A plus B".
- Cite only exact evidence refs: "niche", "audience", or IDs from indexedEvidence. Creative direction cannot be cited as evidence.
- Profile claims do not exist yet and cannot be used as support.
- Negative constraints may disambiguate intended meaning but cannot manufacture a relationship.

Return JSON only:
{
  "kind": "single",
  "axes": [],
  "compositionType": null,
  "sharedPremise": "",
  "axisRoles": [{ "axis": "", "contribution": "" }],
  "evidenceRefs": [],
  "compositionConfidence": 0,
  "alternativeCompositionTypes": [{
    "compositionType": "CULTURAL_INTERSECTION",
    "confidence": 0,
    "sharedPremise": "",
    "axisRoles": [{ "axis": "", "contribution": "" }],
    "evidenceRefs": []
  }]
}`,
  0.08, compositionModel);

  const parsed = safeNicheComposition(response);
  if (!parsed) throw new Error("Composition classifier returned an invalid composition");
  const kind = explicitAxes.length >= 2 ? "compound" as const : parsed.kind;
  const axes = explicitAxes.length >= 2 ? explicitAxes : parsed.axes;
  const allowedRefs = new Set(["niche", "audience", ...indexedEvidence.map((item) => item.ref)]);
  const evidenceRefs = (parsed.evidenceRefs ?? []).filter((ref) => allowedRefs.has(ref));
  if (kind === "single") {
    return {
      kind: "single",
      axes: [],
      evidenceRefs,
    };
  }
  if (kind === "compound") {
    if (axes.length < 2) throw new Error("Composition classifier did not resolve compound axes");
    if (!parsed.compositionType) throw new Error("Composition classifier omitted the compound composition type");
    if (!parsed.sharedPremise) throw new Error("Composition classifier omitted the shared compound premise");
    const roleAxes = new Set((parsed.axisRoles ?? []).map((role) => role.axis.toLowerCase()));
    if (!axes.every((axis) => roleAxes.has(axis.toLowerCase()))) {
      throw new Error("Composition classifier omitted one or more axis contributions");
    }
    if (evidenceRefs.length === 0) throw new Error("Composition classifier cited no original source evidence");
  }
  return {
    ...parsed,
    kind,
    axes,
    evidenceRefs,
    alternativeCompositionTypes: (parsed.alternativeCompositionTypes ?? [])
      .filter((alternative) => alternative.compositionType !== parsed.compositionType)
      .map((alternative) => ({
        ...alternative,
        evidenceRefs: (alternative.evidenceRefs ?? []).filter((ref) => allowedRefs.has(ref)),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2),
  };
}

export async function buildDynamicNicheProfile(
  niche: string,
  audience?: string,
  evidence?: DynamicProfileEvidenceContext,
  inferredComposition?: NicheComposition,
): Promise<DynamicNicheProfile> {
  const prompt = `
Analyze this t-shirt niche as a real human subculture.

NICHE:
${niche}

AUDIENCE / SUBCULTURE QUALIFIER:
${audience?.trim() || "Not supplied; infer the narrowest plausible participating audience."}

MARKET / COMMUNITY EVIDENCE (supporting context only; never force a term or invent behavior from it):
${JSON.stringify(evidence ?? {}, null, 2)}

INFERRED COMPOSITION MODEL (authoritative semantic structure; do not reclassify it):
${JSON.stringify(inferredComposition ?? { kind: "single", axes: [] }, null, 2)}

Return ONLY valid JSON:
{
  "nicheComposition": {
    "kind": "single",
    "axes": [],
    "compositionType": null,
    "sharedPremise": "",
    "axisRoles": [],
    "evidenceRefs": [],
    "confidence": 0
  },
  "dimensions": [],
  "audience": "",
  "latentLifestyleModel": {
    "identityDirection": "proud_participant",
    "observableScenes": [
      {
        "who": "",
        "where": "",
        "doing": "",
        "before": "",
        "after": "",
        "recurringObjects": [],
        "environmentalConditions": [],
        "socialContext": [],
        "emotionalStates": []
      }
    ],
    "privateRituals": [],
    "participationHabits": [],
    "involuntaryBehaviors": [],
    "seasonalBehaviors": [],
    "comfortObjects": [],
    "collectionHabits": [],
    "environments": [],
    "recurringObjects": [],
    "socialInteractions": [],
    "tensions": [],
    "identitySignals": [],
    "repeatedDecisions": [],
    "tinyFrustrations": [],
    "smallVictories": [],
    "unspokenRules": [],
    "emotionalRewards": [],
    "sharedMeanings": [],
    "culturalCodes": [],
    "aestheticCodes": [],
    "symbolicAssociations": []
  },
  "rituals": [],
  "microRituals": [],
  "contradictions": [],
  "frustrations": [],
  "statusSignals": [],
  "insiderLanguage": [],
  "embarrassingTruths": [],
  "obsessions": [],
  "visualCulture": [],
  "purchaseMotives": []
}

Rules:
- Do not create slogans.
- Copy the supplied inferred composition model exactly. It was classified from original inputs before profile inference and must not be replaced by a behavior-first interpretation.
- Build the latentLifestyleModel first. Use the legacy arrays to summarize and corroborate that model, not as a substitute for it.
- Infer a lifestyle, not a bag of related topics or keywords.
- Calibrate detail to evidence. Never invent rituals, objects, jargon, social behavior, or scenes merely to fill a field or meet a count target. For a sparse or unusual niche, return fewer high-confidence items and leave unsupported arrays empty.
- Discover what members recognize that outsiders rarely notice. Depending on compositionType, that may be behavior, ritual, identity, cultural shorthand, aesthetic grammar, symbolism, status, tension, or shared meaning.
- participationHabits must capture repeated ways members consume, practice, maintain, prepare for, or return to the core activity. This is the niche-agnostic equivalent of fields such as reading habits, training habits, viewing habits, care habits, or collecting routines; name the actual behavior rather than the category.
- involuntaryBehaviors must capture automatic, barely noticed actions or decisions triggered by a niche situation. Each item should expose a tiny cause-and-response, interruption, reflex, repeated mistake, or private accommodation—not summarize an activity, aesthetic, or planned routine.
- seasonalBehaviors must capture behavior that changes with a supported season, holiday, event cycle, weather pattern, or time of day. Leave it empty when the niche has no credible temporal trigger. Do not return seasonal imagery by itself.
- comfortObjects must contain objects members actively handle or arrange while doing the behavior. Connect each object to its use in a scene; exclude decorative symbols and generic aesthetic props.
- collectionHabits must capture repeated acquiring, curating, organizing, preserving, displaying, upgrading, or scarcity-driven behavior. Leave it empty when collecting is not supported by the niche.
- These behavioral facets are evidence, not mandatory quotas. Never invent entries merely to populate the arrays.
- Prefer facet entries that a meaningful share of the narrow audience would recognize from their own life. Reserve unusual but low-frequency details for observableScenes instead of presenting them as common habits.
- Judge behavioral evidence by likely self-recognition, not by how clever its thematic association sounds.
- For involuntaryBehaviors, ask which tiny actions would make another member smile because they have caught themselves doing exactly that. Prefer accidental self-revelation over an observer's description of the niche.
- For a behaviorally rich niche, return at least 5 observableScenes. For a sparse niche, return only the scenes supported by the niche and audience. Each scene must describe one coherent recurring moment, including who is present, where it happens, what is being done, what tends to happen before and after, and the relevant objects, conditions, social context, and emotions.
- Scenes must be causally coherent. Do not combine details merely because they all relate to the broad category.
- Infer environments and recurringObjects from the observableScenes. Prefer places and objects the audience actually encounters over decorative symbols associated with the topic.
- tensions must express lived conflicts between compatible forces, choices, roles, or rewards. They are behavioral source material, not prewritten jokes.
- repeatedDecisions must capture choices the audience makes again and again. smallVictories must capture what they quietly take pride in. unspokenRules must capture insider expectations that members follow without explaining.
- identitySignals may show belonging through behavior, taste, timing, knowledge, preparation, choices, symbolism, or culturally legible self-presentation.
- Classify identityDirection from the audience's relationship to the behavior, not from a hardcoded niche-name lookup. When the evidence supports a direction, return exactly one of: proud_participant, reluctant_participant, aspiring_participant, or self_deprecating_outsider. If the relationship is genuinely ambiguous, omit identityDirection rather than defaulting to proud participation.
- Keep identity direction consistent across the model. A proud-participant niche should not be defined by repeatedly failing or avoiding the core behavior; an aspiring or reluctant niche may support that contradiction.
- Extract concrete behaviors, rituals, contradictions, pain points, status signals, insider language, embarrassing truths, obsessions, and visual culture.
- Do not use generic marketing words.
- Do not force keywords.
- Treat supplied market/community evidence as corroboration, not as permission to fabricate rituals. Prefer profile facts supported by both niche meaning and evidence.
- Preserve every meaningful dimension in compound niches.
- For BEHAVIORAL_INTERSECTION and RITUAL_INTERSECTION compounds, infer only scenes where the axes interact causally. Do not join separate axis behaviors.
- For IDENTITY_INTERSECTION, CULTURAL_INTERSECTION, AESTHETIC_INTERSECTION, or SYMBOLIC_INTERSECTION compounds, do not invent behavior merely to make the intersection observable. Populate sharedMeanings, identitySignals, culturalCodes, aestheticCodes, symbolicAssociations, statusSignals, insiderLanguage, visualCulture, tensions, and emotionalRewards only when supported as conservative hypotheses.
- Every compound field must serve the inferred sharedPremise. Keep fields sparse rather than converting symbolic, cultural, identity, or aesthetic meaning into a fictional ritual.
- Treat the niche and audience together. Separate content interest, humor style, media behavior, role, and setting when they are distinct axes.
- Dimensions must describe distinct behavioral or cultural axes, not synonyms for the category.
- For behaviorally rich niches, return at least 6 rituals and 8 microRituals. Sparse niches may return fewer. Most rituals must be observable, repeated actions with a context, trigger, or consequence; microRituals must be small "that's me" moments, not category summaries.
- Prefer consumption behavior and community rituals over pretending the wearer performs the profession or activity shown in the content.
- Humor about sensitive subject matter must target the viewer's habits, algorithms, commentary, or absurd decisions—not victims or harm.
- For visually rich niches, return at least 6 visualCulture items; sparse niches may return fewer. Make them concrete objects, interfaces, textures, tools, settings, or recurring visual details inferred from the rituals.
- Avoid unsupported mood-only abstractions like relaxing, comfort, vibes, self-care, or community. For nonbehavioral compositions, a meaning may instead be grounded by a coherent identity, cultural, aesthetic, or symbolic relationship that depends on both axes.
- Do not return broad interests or aesthetics by themselves. Attach every detail to the sharedPremise and the relevant source axes; require a repeated behavior or scene only for behavioral and ritual claims.
- Every ritual must name an action. Other fields may name grounded identity, cultural, aesthetic, or symbolic meaning without fabricating an action.
- Prefer oddly specific subculture behavior over category labels.
- For rituals, ask: what do they repeatedly do that outsiders would not immediately understand?
- For microRituals, ask: what tiny action, interruption, excuse, object, time of day, or social habit would make someone in the niche instantly say "that's me"?
- For contradictions, ask: what behavior makes outsiders laugh or say "why would you do that?"
- For statusSignals, ask: how do members quietly signal expertise or taste?
- For insiderLanguage, include subculture terms, mechanics, acronyms, UI words, genre labels, and phrases outsiders may not know.
- For embarrassingTruths, ask: what would members admit only to each other?
- For obsessions, ask: what do they spend too much time doing, collecting, organizing, optimizing, checking, or avoiding?
- If a field sounds like a mood board, rewrite it as a behavior.
- visualCulture must name objects and interfaces the audience actually handles or sees during those rituals; avoid legacy, decorative, or literal topic symbols unless the profile supports them. Do not use wall art, posters, skulls, blood, weapons, bodies, or crime-scene props as filler.
`;

  const json = await callAIJson<DynamicProfileJson>(prompt);
  return normalizeDynamicNicheProfile(niche, audience, json, inferredComposition);
}

export async function generateSlogansFromDynamicProfile(
  profile: DynamicNicheProfile,
  count = 20,
  options: DynamicSloganGenerationOptions = {},
): Promise<string[]> {
  const compositionType = profile.nicheComposition?.compositionType;
  const behaviorLed = !compositionType ||
    compositionType === "BEHAVIORAL_INTERSECTION" ||
    compositionType === "RITUAL_INTERSECTION";
  const compositionSourcePriority = behaviorLed
    ? "Prioritize supported shared scenes, rituals, decisions, tensions, consequences, and insider mechanics. The joint behavior or observance must remain semantically intact, although it need not be narrated literally."
    : `This is ${compositionType}. Prioritize the classified sharedPremise, axisRoles, sharedMeanings, identitySignals, culturalCodes, aestheticCodes, symbolicAssociations, statusSignals, tensions, and emotionalRewards. Behavioral fields are secondary hypotheses, not mandatory creative material. Do not invent a scene to justify an identity, cultural, aesthetic, or symbolic expression.`;
  const creativeModel = process.env.OPENAI_SLOGAN_CREATIVE_MODEL?.trim() || "gpt-4.1";
  const expressionIntents = options.expressionIntents ?? [];
  if (profile.nicheComposition?.kind === "compound" && expressionIntents.length === 0) {
    throw new Error("Compound generation requires at least one eligible expression intent");
  }
  if (profile.nicheComposition?.kind === "compound") {
    const maxPerIntent = Math.max(2, Math.ceil(count / expressionIntents.length) + 1);
    const compoundResponse = await callAIJson<{ candidates?: unknown }>(`
Realize eligible human expression intents as original t-shirt slogans for a compound niche.

ORIGINAL USER DIRECTION (no reference-example wording):
${options.originalUserDirection?.trim() || "Not supplied"}

ABSTRACT CREATIVE ATTRIBUTES AND BINDING NEGATIVE CONSTRAINTS:
${JSON.stringify(options.creativeDirection ?? {}, null, 2)}

COMPOSITION MODEL:
${JSON.stringify(profile.nicheComposition, null, 2)}

ELIGIBLE EXPRESSION INTENTS:
${JSON.stringify(expressionIntents, null, 2)}

PREVIOUS FINGERPRINTS / EXCLUSIONS:
${JSON.stringify((options.excludeSlogans ?? []).slice(0, 60), null, 2)}

${options.recoveryContext ? `SEMANTIC RECOVERY FEEDBACK:
${JSON.stringify(options.recoveryContext, null, 2)}` : ""}

${options.expressionRecoveryContext ? `EXPRESSION RECOVERY FEEDBACK:
${JSON.stringify(options.expressionRecoveryContext, null, 2)}` : ""}

Write ${count} candidates. Every candidate must realize exactly one supplied intent and return its exact intentId.

Rules:
- Realize WHY a person would wear or say the intent. Do not summarize the niche, territory, premise, or metadata.
- The phrase itself must communicate the intent's humanMeaning, socialSignal, identityTarget, and intersection. Metadata will not accompany it downstream.
- Preserve why both axes are indispensable, but literal axis names are optional.
- Do not invent behavior, lore, status, identity, or relationships beyond original sources.
- Do not turn symbolic, identity, or cultural meaning into atmospheric poetry, visual captions, mystical adjective stacks, motif lists, or noun decoration. Instead make the supported human identity, role, affiliation, attitude, recognition, status, or observation socially legible.
- A compact label or fragment is valid when naturally speakable and identity-bearing; no explicit verb or behavior is required.
- Honor every negative constraint. Reference examples were abstracted upstream and are unavailable; do not reconstruct familiar wording.
- Use varied rhetorical families based on intent meaning, never reusable phrase templates.
- Generate no more than ${maxPerIntent} candidates for one intent. Cover distinct intent fingerprints before adding another realization of an intent.
- Do not reuse excluded concepts, sentence frames, or openings.
- Return slogan wording only inside the requested JSON objects.

Return JSON only:
{
  "candidates": [{ "intentId": "intent_1", "slogan": "" }]
}`,
    0.85,
    creativeModel);
    const validIntentIds = new Set(expressionIntents.map((intent) => intent.id));
    const intentCounts = new Map<string, number>();
    const slogans = (Array.isArray(compoundResponse.candidates) ? compoundResponse.candidates : [])
      .flatMap((value) => {
        if (!value || typeof value !== "object" || Array.isArray(value)) return [];
        const record = value as Record<string, unknown>;
        const intentId = safeString(record.intentId);
        const slogan = safeString(record.slogan);
        if (!validIntentIds.has(intentId) || !slogan) return [];
        const used = intentCounts.get(intentId) ?? 0;
        if (used >= maxPerIntent) return [];
        intentCounts.set(intentId, used + 1);
        return [slogan];
      });
    if (slogans.length === 0) throw new Error("Compound intent realization returned no traceable candidates");
    return safeStringArray(slogans, count);
  }
  const prompt = `
You are writing original t-shirt slogans from a dynamic niche profile.

NICHE:
${profile.niche}

AUDIENCE:
${profile.audience}

NICHE COMPOSITION:
${JSON.stringify(profile.nicheComposition ?? { kind: "single", axes: [] }, null, 2)}

COMPOSITION-AWARE SOURCE PRIORITY:
${compositionSourcePriority}

LATENT LIFESTYLE MODEL:
${JSON.stringify(profile.latentLifestyleModel || safeLatentLifestyleModel(undefined), null, 2)}

DIMENSIONS:
${profile.dimensions.join(", ")}

RITUALS:
${profile.rituals.join("\n")}

MICRO-RITUALS:
${(profile.microRituals || []).join("\n")}

CONTRADICTIONS:
${profile.contradictions.join("\n")}

FRUSTRATIONS:
${profile.frustrations.join("\n")}

STATUS SIGNALS:
${profile.statusSignals.join("\n")}

INSIDER LANGUAGE:
${profile.insiderLanguage.join(", ")}

EMBARRASSING TRUTHS:
${profile.embarrassingTruths.join("\n")}

OBSESSIONS:
${profile.obsessions.join("\n")}

VISUAL CULTURE:
${profile.visualCulture.join(", ")}

PURCHASE MOTIVES:
${profile.purchaseMotives.join("\n")}

USER CREATIVE BRIEF (creative preference only; never behavioral evidence):
${JSON.stringify(options.creativeDirection ?? {
    sourcePresent: false,
    desiredQualities: [],
    voiceAttributes: [],
    conceptualMoves: [],
    referenceAttributes: [],
    negativeConstraints: [],
  }, null, 2)}

PREVIOUS / EXCLUDED CANDIDATES (avoid semantic duplicates; do not imitate them):
${JSON.stringify((options.excludeSlogans ?? []).slice(0, 30))}

${options.recoveryContext ? `REJECTION-AWARE RECOVERY CONTEXT:
${JSON.stringify(options.recoveryContext, null, 2)}

This is a bounded recovery attempt after the hard semantic gate rejected the prior batch. Generate fresh semantic premises from corroborated truths and conservative implications of the original niche/audience. Treat profileHypotheses and territoryHypotheses as creative leads requiring independent plausibility, not as proof. Correct the listed failure tendencies without copying prior wording. Candidate fingerprints are exclusion signals, not phrase suggestions.` : ""}

${options.expressionRecoveryContext ? `EXPRESSION-WORTHINESS RECOVERY CONTEXT:
${JSON.stringify(options.expressionRecoveryContext, null, 2)}

This is one bounded creative-quality recovery after the previous candidates passed semantic eligibility but failed to become worthwhile expressions. Generate genuinely new concepts from the same grounded source material. Correct the weak dimensions and rejected tendencies without copying prior wording, reconstructing excluded concepts, or adopting a shared sentence frame. Binding negative constraints remain release conditions.` : ""}

TASK:
Write ${count} original t-shirt slogans.

Rules:
- Do NOT use reusable slogan templates or imitate recurring merchandising formulas.
- Do NOT write generic identity labels.
- Do not talk about finding, buying, wearing, gifting, printing, or promoting the merchandise carrying the slogan unless commerce itself is genuinely part of the niche truth.
- Every implied behavior, identity, role, affiliation, status, or use-case must be supported by the original niche/audience and an eligible expression intent.
- The user creative brief controls expression, not factual grounding. Honor every negative constraint throughout the batch.
- Reference attributes describe why examples appealed; never reconstruct, closely paraphrase, or imitate reference wording.
- Treat negative creative constraints as binding release conditions. Before returning, silently discard and replace any candidate that credibly violates one.
- When the brief asks for insider, identity-rich, or conceptually transformed expression, a broad topic noun plus a seasonal adjective, approval word, decorative rhyme, or familiar catchphrase rewrite is insufficient.
- Use grounded source material to create a new stance, identity signal, double meaning, conceptual substitution, or socially recognizable implication. Do not merely decorate category labels.
- When recovery feedback is supplied, respond directly to its dominant failure dimensions. Do not evade the feedback by becoming more generic.
- For a compound niche, every returned candidate must preserve the inferred sharedPremise and each axis contribution in one coherent emergent meaning. Literal axis names and independent lexical recoverability are not required.
- Use compositionType to determine what kind of meaning must survive. Behavioral and ritual intersections require a supported joint action or observance. Identity, cultural, aesthetic, and symbolic intersections may instead express self-concept, lore, shorthand, taste grammar, mythology, status, or conceptual reframing without an explicit behavioral scene.
- Apply the removal test: if removing either axis would not materially change the candidate's meaning or creative justification, discard it as one-axis collapse. Also discard simple adjacency, decorative axis props, or unrelated concatenation.
- Do NOT write category descriptions or product taglines such as "[interest], [mood]" or "[category] meets [comfort]".
- Do NOT write unsupported mood descriptions about comfort, ambience, escape, relaxation, self-care, or community. A nonbehavioral shared meaning is valid when it is conservatively supported by the source axes.
- Treat the composition-aware source priority above as authoritative. Use other profile fields only as supporting hypotheses.
- Each slogan must be traceable to the shared premise or to a conservative implication of original niche/audience evidence. Grounding may remain latent and does not require profile-token overlap.
- Favor evidence likely to be recognized by a meaningful share of the specific audience over obscure cleverness or topic-word combinations.
- Let the strongest composition-relevant meaning determine the rhetoric. Invent the wording and sentence structure for this niche; do not translate evidence into a recurring frame.
- Prefer expressive transformation of a grounded truth over description of the audience. Observable moments are one valid source, not mandatory surface syntax.
- Combine only details that belong to the same shared premise. Do not splice unrelated objects, actions, or symbols for superficial specificity.
- Preserve identityDirection when it is relevant, but do not force behavioral success/failure syntax onto identity, cultural, aesthetic, or symbolic compositions.
- Draw across different composition-relevant meanings so the batch explores the intersection rather than repeating one discovery.
- Do not copy source phrases mechanically. Synthesize their lived truth into short, natural language.
- Express the recognizable meaning or identity consequence of a grounded truth; do not merely pair the topic with an opinion.
- Prefer precise insider recognition over broad statements of interest or personality; use micro-rituals only when the composition is behavior- or ritual-led.
- Do not imply the wearer performs a profession when the profile says they consume, watch, read, listen, scroll, or discuss it.
- For sensitive topics, joke about audience behavior, platform culture, implausible decisions, or bad excuses—not victims, suspects, gore, harm, or violence.
- Avoid fandom nicknames, show-specific catchphrases, branded community labels, or slogans that require a specific podcast/show/creator fandom to understand.
- At least three quarters of the slogans should work without naming the niche or its broad category.
- No more than one quarter of slogans may include broad category labels from the niche such as "true crime", "crime", "murder", "sports", "fashion", "pets", or equivalent topic names.
- Before returning, discard slogans whose main meaning is only "I like this topic" or "this topic is dramatic/funny/interesting"; replace them with a supported identity stance, cultural shorthand, conceptual reframing, symbolic transformation, aesthetic code, ritual, repeated choice, or insider consequence appropriate to compositionType.
- Prefer repurposed insider language, mechanics, symbols, myths, taste codes, or category terms when they produce genuine recognition rather than decoration.
- Prefer precise composition-relevant meaning over vibe words.
- Vary rhetorical structure across the batch. Mix observations, confessions, commands, questions, priorities, contrasts, and identity lines when the profile supports them.
- Do not repeat the same grammatical frame with different nouns. In particular, generate no more than two comparisons, confessions, identity statements, commands, or questions.
- Vary sentence openings. Do not begin multiple slogans with the same word.
- Preserve the strongest complete semantic concept in this stage; a downstream adaptive pass handles length and visual fit.
- Do not optimize against a fixed word or character count here.
- Keep slogans wearable and human.
- Reward self-recognition, identity projection, insider resonance, conceptual transformation, naturalness, and wearability. Allow multiple rhetorical families; do not force every line into confession or narrated behavior.
- Freshness must come from the transformed idea, not from inserting niche nouns into a common caption, rhyme, or pop-culture phrase.
- Prefer lived truth over cleverness, but do not confuse truth with literal profile-word overlap.
- Return ONLY JSON:
{ "slogans": [] }
`;

  const json = await callAIJson<{ slogans?: unknown }>(prompt, 0.8, creativeModel);
  return safeStringArray(json.slogans, count);
}

export function deriveSloganLengthBudget(
  profile: DynamicNicheProfile,
  layout: SloganLayoutMode = "standard",
): SloganLengthBudget {
  const dimensionCount = Math.max(profile.dimensions?.length ?? 1, 1);
  const lifestyle = profile.latentLifestyleModel;
  const evidenceCount =
    (profile.microRituals?.length ?? 0) +
    (lifestyle?.participationHabits?.length ?? 0) +
    (lifestyle?.involuntaryBehaviors?.length ?? 0) +
    (lifestyle?.seasonalBehaviors?.length ?? 0) +
    (lifestyle?.collectionHabits?.length ?? 0) +
    (lifestyle?.tensions.length ?? 0) +
    (profile.insiderLanguage?.length ?? 0) +
    (lifestyle?.unspokenRules.length ?? 0);

  const complexityAdjustment = Math.min(dimensionCount - 1, 2);
  const evidenceAdjustment = evidenceCount >= 12 ? -1 : 0;

  const base =
    layout === "compact"
      ? { idealWords: 3, maxWords: 5, idealCharacters: 24, maxCharacters: 34 }
      : layout === "statement"
        ? { idealWords: 6, maxWords: 8, idealCharacters: 38, maxCharacters: 52 }
        : { idealWords: 4, maxWords: 6, idealCharacters: 30, maxCharacters: 42 };

  return {
    idealWords: Math.max(2, base.idealWords + complexityAdjustment + evidenceAdjustment),
    maxWords: Math.min(8, base.maxWords + complexityAdjustment),
    idealCharacters: base.idealCharacters + complexityAdjustment * 4,
    maxCharacters: base.maxCharacters + complexityAdjustment * 4,
    targetReadTimeMs: layout === "compact" ? 900 : 1300,
  };
}

export function deriveDynamicRankingWeights(
  layout: SloganLayoutMode = "standard",
): DynamicRankingWeights {
  if (layout === "compact") {
    return {
      truth: 0.12,
      authenticity: 0.08,
      recognition: 0.08,
      recognitionProbability: 0.15,
      selfRevelation: 0.20,
      semanticCompression: 0.10,
      brevity: 0.15,
      visualWidth: 0.12,
      contradiction: 0,
    };
  }
  if (layout === "statement") {
    return {
      truth: 0.20,
      authenticity: 0.10,
      recognition: 0.08,
      recognitionProbability: 0.15,
      selfRevelation: 0.18,
      semanticCompression: 0.08,
      brevity: 0.05,
      visualWidth: 0.03,
      contradiction: 0.13,
    };
  }
  return {
    truth: 0.16,
    authenticity: 0.12,
    recognition: 0.10,
    recognitionProbability: 0.18,
    selfRevelation: 0.20,
    semanticCompression: 0.12,
    brevity: 0.12,
    visualWidth: 0,
    contradiction: 0,
  };
}

export async function compressDynamicSlogansWithDiagnostics(
  profile: DynamicNicheProfile,
  slogans: string[],
  budget: SloganLengthBudget,
  creativeDirection?: CreativeDirectionBrief,
): Promise<DynamicCompressionAttempt[]> {
  if (slogans.length === 0) return [];

  const prompt = `
Compress the following t-shirt slogan candidates.

NICHE:
${profile.niche}

AUDIENCE:
${profile.audience}

TARGET:
- Ideal word count: ${budget.idealWords}
- Absolute maximum words: ${budget.maxWords}
- Ideal character count: ${budget.idealCharacters}
- Absolute maximum characters: ${budget.maxCharacters}
- Target reading time: ${budget.targetReadTimeMs} milliseconds

USER CREATIVE BRIEF (preference only; never evidence):
${JSON.stringify(creativeDirection ?? {
    sourcePresent: false,
    desiredQualities: [],
    voiceAttributes: [],
    conceptualMoves: [],
    referenceAttributes: [],
    negativeConstraints: [],
  }, null, 2)}

RULES:
- Preserve the specific behavior, contradiction, ritual, or insider truth.
- Preserve the intended conceptual transformation, voice, and all negative creative constraints.
- Grounding may be implicit. Do not add literal action words merely to make the source behavior visible.
- Preserve any trigger, involuntary response, private accommodation, repeated mistake, or revealing consequence that makes the candidate recognizable.
- Do not turn an accidental self-revelation into a thematic caption or activity description.
- Remove explanatory wording and sentence-like setup.
- Remove grammatical filler such as "my favorite", "while", "the one filled with", and unnecessary setup.
- Do not use reusable slogan templates.
- Do not replace specific behaviors with broad niche labels.
- Do not force rhyme, alliteration, or punctuation.
- Each result must remain understandable without the niche title.
- Return one compressed version per input, in the same order.
- Do not copy or imitate a fixed rewrite; synthesize from each input's behavioral evidence.
- Return JSON only.

INPUT:
${JSON.stringify(slogans)}

OUTPUT:
{
  "slogans": []
}
`;

  const response = await callAIJson<{ slogans?: unknown }>(prompt);
  const compressedValues = Array.isArray(response.slogans) ? response.slogans : [];

  return slogans.map((original, index) => {
    const compressed = safeString(compressedValues[index]);
    return {
      original,
      compressed,
      ...evaluateCompressionMeaningRetention(original, compressed, profile),
    };
  });
}

export async function compressDynamicSlogans(
  profile: DynamicNicheProfile,
  slogans: string[],
  budget: SloganLengthBudget,
  creativeDirection?: CreativeDirectionBrief,
): Promise<string[]> {
  const attempts = await compressDynamicSlogansWithDiagnostics(profile, slogans, budget, creativeDirection);
  return attempts
    .filter((attempt) => attempt.preservesMeaning)
    .map((attempt) => attempt.compressed);
}

export async function classifyDynamicSelfRevelation(
  profile: DynamicNicheProfile,
  slogans: string[],
): Promise<SelfRevelationAssessment[]> {
  if (slogans.length === 0) return [];

  const lifestyle = profile.latentLifestyleModel;
  const prompt = `
Classify each t-shirt slogan candidate for this audience.

NICHE:
${profile.niche}

AUDIENCE:
${profile.audience}

HIGH-RECOGNITION BEHAVIORAL EVIDENCE:
${JSON.stringify({
    involuntaryBehaviors: lifestyle?.involuntaryBehaviors ?? [],
    participationHabits: lifestyle?.participationHabits ?? [],
    seasonalBehaviors: lifestyle?.seasonalBehaviors ?? [],
    collectionHabits: lifestyle?.collectionHabits ?? [],
    privateRituals: lifestyle?.privateRituals ?? [],
    repeatedDecisions: lifestyle?.repeatedDecisions ?? [],
    tinyFrustrations: lifestyle?.tinyFrustrations ?? [],
    microRituals: profile.microRituals ?? [],
  }, null, 2)}

For each candidate choose exactly one classification:
A = DESCRIPTION: sounds like an observer summarizing an activity, theme, atmosphere, aesthetic, or marketing concept.
B = SELF_REVELATION: sounds like the wearer accidentally exposing a repeated habit, private decision, reflex, small failure, accommodation, consequence, or oddly recognizable moment.

Judge self-recognition, not cleverness, prettiness, sentiment, or niche keywords. A short line can still be a description. A self-revelation should feel like something audience members catch themselves doing or privately admit. Do not rewrite the slogans.

Return one assessment per input in the same order. Confidence is an integer from 0 to 100. Keep each reason under 12 words.

INPUT:
${JSON.stringify(slogans.map((slogan, index) => ({ index, slogan })))}

Return JSON only:
{
  "assessments": [
    { "index": 0, "classification": "A", "confidence": 0, "reason": "" }
  ]
}
`;

  const response = await callAIJson<{ assessments?: unknown }>(prompt, 0.05);
  const rawAssessments = Array.isArray(response.assessments)
    ? response.assessments.filter((value): value is Record<string, unknown> => (
      Boolean(value) && typeof value === "object" && !Array.isArray(value)
    ))
    : [];
  const byIndex = new Map<number, Record<string, unknown>>();
  for (const assessment of rawAssessments) {
    const index = Number(assessment.index);
    if (Number.isInteger(index) && index >= 0 && index < slogans.length && !byIndex.has(index)) {
      byIndex.set(index, assessment);
    }
  }

  return slogans.map((slogan, index) => {
    const assessment = byIndex.get(index) ?? rawAssessments[index];
    const label = safeString(assessment?.classification).toUpperCase();
    const classification: SelfRevelationClassification =
      /^(?:B|SELF[_ -]?REVELATION)\b/.test(label)
        ? "self_revelation"
        : /^(?:A|DESCRIPTION)\b/.test(label)
          ? "description"
          : "uncertain";
    const rawConfidence = Number(assessment?.confidence);
    const confidence = Number.isFinite(rawConfidence)
      ? Math.max(0, Math.min(100, Math.round(rawConfidence)))
      : 50;
    const score = classification === "self_revelation"
      ? confidence
      : classification === "description"
        ? 100 - confidence
        : 50;

    return {
      slogan,
      classification,
      confidence,
      score,
      reason: safeString(assessment?.reason).slice(0, 120),
    };
  });
}

const bannedPatternLeakage = [
  /\bjust one more\b/i,
  /\bpowered by\b/i,
  /\bmode\b/i,
  /\benergy\b/i,
  /\bvibes?\b/i,
  /\blove language\b/i,
  /\bofficial\b/i,
  /\baddict\b/i,
  /\bwarrior\b/i,
  /\bmvp\b/i,
  /\bhustler\b/i,
  /\beat\s+sleep\b/i,
  /\bbuilt for\b/i,
  /\bno drama\b/i,
  /\bguilty pleasure\b/i,
  /\bfurbab(?:y|ies)\b/i,
  /\bfur bab(?:y|ies)\b/i,
  /\bliving that\b/i,
  /\blives matter\b/i,
  /\bvictims?\b/i,
  /\bsuspects?\b/i,
  /\bgore\b/i,
  /\bmurderinos?\b/i,
  /\bswifties?\b/i,
  /\bpotterheads?\b/i,
  /\btrekkies?\b/i,
  /\bwhovians?\b/i,
  /\bbeyhive\b/i,
  /\bbarbz\b/i,
  /\blittle monsters\b/i,
  /\b[a-z0-9-]+\s+(?:army|hive|nation|stans?|fandom)\b/i,
  /\b(?:team|club|crew|squad)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/,
];

export function rejectsPatternLeakage(slogan: string): boolean {
  return bannedPatternLeakage.some((rx) => rx.test(slogan));
}

function lifestyleSceneSignals(scene: LifestyleScene): string[] {
  return [
    scene.who,
    scene.where,
    scene.doing,
    scene.before,
    scene.after,
    ...scene.recurringObjects,
    ...scene.environmentalConditions,
    ...scene.socialContext,
    ...scene.emotionalStates,
  ].filter(Boolean);
}

function latentLifestyleSignals(profile: DynamicNicheProfile): string[] {
  const model = profile.latentLifestyleModel;
  if (!model) return [];

  return [
    ...model.observableScenes.flatMap(lifestyleSceneSignals),
    ...model.privateRituals,
    ...(model.participationHabits ?? []),
    ...(model.involuntaryBehaviors ?? []),
    ...(model.seasonalBehaviors ?? []),
    ...(model.comfortObjects ?? []),
    ...(model.collectionHabits ?? []),
    ...model.environments,
    ...model.recurringObjects,
    ...model.socialInteractions,
    ...model.tensions,
    ...model.identitySignals,
    ...model.repeatedDecisions,
    ...model.tinyFrustrations,
    ...model.smallVictories,
    ...model.unspokenRules,
    ...model.emotionalRewards,
  ].filter(Boolean);
}

function profileSignals(profile: DynamicNicheProfile): string[] {
  return [
    ...profile.dimensions,
    ...latentLifestyleSignals(profile),
    ...profile.rituals,
    ...(profile.microRituals || []),
    ...profile.contradictions,
    ...profile.frustrations,
    ...profile.statusSignals,
    ...profile.insiderLanguage,
    ...profile.embarrassingTruths,
    ...profile.obsessions,
    ...profile.visualCulture,
    ...profile.purchaseMotives,
  ].filter(Boolean);
}

function signalWordHitCount(slogan: string, signals: string[]): number {
  const text = slogan.toLowerCase();
  return signals.filter((signal) => {
    const normalized = signal.toLowerCase().trim();
    if (!normalized) return false;
    if (text.includes(normalized)) return true;

    const words = normalized.split(/\s+/).filter((word) => word.length > 3 && !SIGNAL_STOP_WORDS.has(word));
    return words.some((word) => {
      if (text.includes(word)) return true;
      const stems = [
        word.replace(/ating$/i, ""),
        word.replace(/izing$/i, "iz"),
        word.replace(/(?:ing|tion|sion|ed|es|s)$/i, ""),
      ];
      return stems.some((stem) => stem.length > 3 && text.includes(stem));
    });
  }).length;
}

function nicheStopWords(profile: DynamicNicheProfile): Set<string> {
  return new Set([
    ...SIGNAL_STOP_WORDS,
    ...profile.niche.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2),
    ...profile.audience.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2),
    "family",
    "families",
    "fashion",
    "sports",
    "retro",
    "vintage",
    "exotic",
    "pets",
    "pet",
    "dog",
    "dogs",
    "mom",
    "moms",
    "jersey",
    "jerseys",
  ]);
}

function distinctiveSignalHitCount(slogan: string, signals: string[], profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const stopWords = nicheStopWords(profile);

  return signals.filter((signal) => {
    const normalized = signal.toLowerCase().trim();
    if (!normalized) return false;
    if (normalized.length > 12 && text.includes(normalized)) return true;

    const tokens = normalized
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 3 && !stopWords.has(word));
    if (tokens.length === 0) return false;

    const hits = tokens.filter((word) => {
      if (text.includes(word)) return true;
      const stem = word.replace(/(?:ing|ed|es|s)$/i, "");
      return stem.length > 3 && text.includes(stem);
    }).length;

    return tokens.length === 1 ? hits === 1 : hits >= 2;
  }).length;
}

function shortSignalHitCount(slogan: string, signals: string[]): number {
  const text = slogan.toLowerCase();
  return signals.filter((signal) => {
    const words = signal.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 2 && !SIGNAL_STOP_WORDS.has(word));
    return words.some((word) => text.includes(word));
  }).length;
}

export function passesDimensionCoverage(
  slogan: string,
  profile: DynamicNicheProfile,
): boolean {
  const broadHits = signalWordHitCount(slogan, profileSignals(profile));
  const insiderHits = shortSignalHitCount(slogan, profile.insiderLanguage);

  return broadHits >= 2 || (broadHits >= 1 && insiderHits >= 1);
}

export function dynamicSpecificityScore(slogan: string, profile: DynamicNicheProfile): number {
  const hits = signalWordHitCount(slogan, profileSignals(profile));
  return Math.min(100, hits * 22);
}

export function truthResonanceScore(slogan: string, profile: DynamicNicheProfile): number {
  const lifestyle = profile.latentLifestyleModel;
  const truthSignals = [
    ...(lifestyle?.observableScenes.flatMap(lifestyleSceneSignals) || []),
    ...(lifestyle?.privateRituals || []),
    ...(lifestyle?.participationHabits || []),
    ...(lifestyle?.involuntaryBehaviors || []),
    ...(lifestyle?.seasonalBehaviors || []),
    ...(lifestyle?.comfortObjects || []),
    ...(lifestyle?.collectionHabits || []),
    ...(lifestyle?.socialInteractions || []),
    ...(lifestyle?.tensions || []),
    ...(lifestyle?.identitySignals || []),
    ...(lifestyle?.repeatedDecisions || []),
    ...(lifestyle?.tinyFrustrations || []),
    ...(lifestyle?.smallVictories || []),
    ...(lifestyle?.unspokenRules || []),
    ...(lifestyle?.emotionalRewards || []),
    ...profile.rituals,
    ...(profile.microRituals || []),
    ...profile.contradictions,
    ...profile.frustrations,
    ...profile.statusSignals,
    ...profile.insiderLanguage,
    ...profile.embarrassingTruths,
    ...profile.obsessions,
  ];
  const hits = signalWordHitCount(slogan, truthSignals);
  return Math.min(100, hits * 24);
}

export function behavioralContradictionScore(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const contradictionHits = signalWordHitCount(slogan, [
    ...(profile.latentLifestyleModel?.tensions || []),
    ...profile.contradictions,
    ...profile.embarrassingTruths,
  ]);
  const contrastMarker = /[?,;:/]|\bbut\b|\bnot\b|\binstead\b|\bbefore\b|\blater\b|\bmore like\b|\bover\b|\bunfinished\b|\boptional\b|\bwait\b|\bwithout\b|\bavoids?\b/.test(text) ? 18 : 0;

  return Math.min(100, contradictionHits * 38 + contrastMarker);
}

export function ritualRecognitionScore(slogan: string, profile: DynamicNicheProfile): number {
  const ritualHits = signalWordHitCount(slogan, [
    ...(profile.latentLifestyleModel?.observableScenes.flatMap(lifestyleSceneSignals) || []),
    ...(profile.latentLifestyleModel?.privateRituals || []),
    ...(profile.latentLifestyleModel?.participationHabits || []),
    ...(profile.latentLifestyleModel?.involuntaryBehaviors || []),
    ...(profile.latentLifestyleModel?.seasonalBehaviors || []),
    ...(profile.latentLifestyleModel?.collectionHabits || []),
    ...(profile.latentLifestyleModel?.repeatedDecisions || []),
    ...(profile.latentLifestyleModel?.smallVictories || []),
    ...(profile.latentLifestyleModel?.unspokenRules || []),
    ...profile.rituals,
    ...(profile.microRituals || []),
    ...profile.obsessions,
    ...profile.statusSignals,
  ]);

  return Math.min(100, ritualHits * 30);
}

export function communityAuthenticityScore(slogan: string, profile: DynamicNicheProfile): number {
  const hits = signalWordHitCount(slogan, [
    ...(profile.latentLifestyleModel?.identitySignals || []),
    ...(profile.latentLifestyleModel?.socialInteractions || []),
    ...(profile.latentLifestyleModel?.unspokenRules || []),
    ...profile.insiderLanguage,
    ...profile.statusSignals,
    ...profile.embarrassingTruths,
  ]);
  return Math.min(100, hits * 34 + (passesDimensionCoverage(slogan, profile) ? 18 : 0));
}

export function insiderWordplayScore(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const insiderHits = shortSignalHitCount(slogan, [
    ...(profile.latentLifestyleModel?.identitySignals || []),
    ...(profile.latentLifestyleModel?.unspokenRules || []),
    ...profile.insiderLanguage,
    ...profile.statusSignals,
    ...profile.obsessions,
  ]);
  const hasRepurposedPhrase = /\bmore like\b|\bnot just\b|\bnot\b|\bover\b|[?>]/i.test(slogan);
  const hasAcronym = /\b[A-Z]{2,5}\b/.test(slogan);
  const hasDecorOrCollectingTwist = /\bdecor|collect|display|nook|avatar|pixel|endgame|gear\b/i.test(text);

  return Math.min(
    100,
    insiderHits * 26 +
      (hasRepurposedPhrase ? 20 : 0) +
      (hasAcronym ? 18 : 0) +
      (hasDecorOrCollectingTwist ? 12 : 0),
  );
}

const genericMoodWords = [
  "comfort",
  "cozy",
  "haven",
  "escape",
  "relax",
  "relaxing",
  "relaxation",
  "self-care",
  "peaceful",
  "ambience",
  "ambient",
  "no pressure",
  "happy place",
];

const categoryDescriptionWords = [
  "modern",
  "comfort",
  "cozy",
  "chill",
  "aesthetic",
  "community",
  "frames",
  "conversation starter",
  "fashion statement",
  "timeless",
  "ultimate",
];

const explanatoryDescriptionPatterns = [
  /\bi\s+find\s+humou?r\s+in\b/i,
  /\bi\s+(?:like|love|enjoy|prefer)\s+(?:this|the|my)?\s*[a-z\s-]*(?:because|for|so)\b/i,
  /\bobsessed\s+with\s+[a-z\s-]+\s+and\s+[a-z\s-]+(?:\s*[,!.]?|\s+no regrets)\b/i,
  /\bobsessed\s+with\s+[a-z\s-]+,\s+not\s+[a-z\s-]+\b/i,
  /\bmy favorite\s+(?:case|episode|clip|story)\??\s+the one\b/i,
  /\bthe only\s+(?:drama|chaos|content|thing)\s+i\s+need\b/i,
];

const concreteBehaviorWords = [
  "arranging",
  "binging",
  "binge",
  "decorating",
  "checking",
  "commenting",
  "collecting",
  "scrolling",
  "sharing",
  "watching",
  "organizing",
  "sorting",
  "fishing",
  "farming",
  "crafting",
  "grinding",
  "watering",
  "building",
  "placing",
  "moving",
  "avoiding",
  "skipping",
  "quest",
  "inventory",
  "furniture",
  "farm",
  "pets",
  "villagers",
  "daily",
  "snacks",
  "pajamas",
  "algorithm",
  "comments",
  "clips",
  "watch",
  "history",
  "autoplay",
  "rewind",
  "rewinding",
  "pause",
  "pausing",
  "podcast",
  "playlist",
  "episode",
  "dinner",
  "wine",
  "group chat",
  "search history",
  "midnight",
  "3am",
  "3 am",
];

const instantRecognitionWords = [
  "comments",
  "comment",
  "autoplay",
  "algorithm",
  "scroll",
  "scrolling",
  "rewind",
  "rewinding",
  "pause",
  "pausing",
  "playlist",
  "podcast",
  "episode",
  "clip",
  "clips",
  "search history",
  "group chat",
  "dinner",
  "wine",
  "snacks",
  "midnight",
  "late-night",
  "3am",
  "3 am",
  "wait",
  "can't",
  "forgot",
  "sent",
  "sending",
];

function broadCategoryLabelCount(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const niche = profile.niche.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const words = niche
    .split(/\s+/)
    .filter((word) => word.length > 3 && !["fans", "sarcastic", "short", "form", "apps"].includes(word));
  const phraseHits = [
    "true crime",
    "short form",
    "short-form",
    "video apps",
  ].filter((phrase) => niche.includes(phrase.replace("-", " ")) && text.includes(phrase)).length;
  const wordHits = new Set(words.filter((word) => text.includes(word))).size;
  return phraseHits * 2 + wordHits;
}

function hasConcreteBehaviorEvidence(slogan: string, profile: DynamicNicheProfile): boolean {
  return ritualRecognitionScore(slogan, profile) >= 30 ||
    truthResonanceScore(slogan, profile) >= 50 ||
    concreteBehaviorWords.some((word) => slogan.toLowerCase().includes(word));
}

function explanatoryDescriptionPenalty(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const hasBehavior = hasConcreteBehaviorEvidence(slogan, profile);
  let penalty = explanatoryDescriptionPatterns.some((pattern) => pattern.test(slogan)) ? 18 : 0;
  if (/^i\s+(?:am|find|like|love|enjoy|prefer|watch)\b/i.test(slogan) && !hasBehavior) penalty += 10;
  if (/^obsessed with\b/i.test(slogan)) penalty += ritualRecognitionScore(slogan, profile) < 30 ? 18 : 10;
  if (/\b(inappropriate places|no regrets|everyone knows)\b/i.test(text)) penalty += 8;
  return Math.min(35, penalty);
}

export function explanatoryLanguagePenalty(slogan: string): number {
  const lower = slogan.toLowerCase().trim();
  const words = lower.split(/\s+/).filter(Boolean);
  let penalty = 0;

  const clauseMarkers = [
    "while",
    "because",
    "whenever",
    "filled with",
    "the one",
    "as i",
  ];
  const descriptiveOpenings = [
    /^creating\b/,
    /^reading by\b/,
    /^finding\b/,
    /^sipping\b/,
    /^my favorite\b/,
  ];

  penalty += clauseMarkers.filter((marker) => lower.includes(marker)).length * 8;
  penalty += descriptiveOpenings.filter((pattern) => pattern.test(lower)).length * 8;
  if (words.length >= 8) penalty += 12;
  if ((lower.match(/,/g) ?? []).length >= 2) penalty += 8;

  return Math.min(penalty, 40);
}

export function semanticCompressionScore(
  slogan: string,
  profile: DynamicNicheProfile,
): number {
  const lifestyle = profile.latentLifestyleModel;
  const genericTerms = nicheStopWords(profile);
  const evidenceTerms = [...new Set([
    ...(profile.insiderLanguage ?? []),
    ...(profile.microRituals ?? []),
    ...(profile.rituals ?? []),
    ...(lifestyle?.privateRituals ?? []),
    ...(lifestyle?.participationHabits ?? []),
    ...(lifestyle?.involuntaryBehaviors ?? []),
    ...(lifestyle?.seasonalBehaviors ?? []),
    ...(lifestyle?.comfortObjects ?? []),
    ...(lifestyle?.collectionHabits ?? []),
    ...(lifestyle?.recurringObjects ?? []),
    ...(lifestyle?.environments ?? []),
    ...(lifestyle?.repeatedDecisions ?? []),
    ...(lifestyle?.smallVictories ?? []),
    ...(lifestyle?.observableScenes.flatMap((scene) => [
      scene.doing,
      scene.before,
      scene.after,
      ...scene.recurringObjects,
      ...scene.environmentalConditions,
    ]) ?? []),
  ]
    .flatMap((value) => value.toLowerCase().split(/\W+/))
    .filter((word) => word.length >= 4 && !genericTerms.has(word)))];

  const sloganTerms = new Set(
    slogan.toLowerCase().split(/\W+/).filter(Boolean),
  );
  const matchedEvidence = evidenceTerms.filter((term) => sloganTerms.has(term)).length;
  const wordCount = Math.max(sloganTerms.size, 1);

  return Math.min(100, Math.round((matchedEvidence / wordCount) * 180));
}

function normalizedActionStem(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/ies$/, "y")
    .replace(/ing$/, "")
    .replace(/ed$/, "")
    .replace(/es$/, "")
    .replace(/s$/, "");
}

function behavioralActionStems(profile: DynamicNicheProfile): string[] {
  const lifestyle = profile.latentLifestyleModel;
  const behavioralPhrases = [
    ...profile.rituals,
    ...(profile.microRituals ?? []),
    ...profile.obsessions,
    ...(lifestyle?.observableScenes.flatMap((scene) => [scene.doing, scene.before, scene.after]) ?? []),
    ...(lifestyle?.privateRituals ?? []),
    ...(lifestyle?.participationHabits ?? []),
    ...(lifestyle?.involuntaryBehaviors ?? []),
    ...(lifestyle?.seasonalBehaviors ?? []),
    ...(lifestyle?.collectionHabits ?? []),
    ...(lifestyle?.repeatedDecisions ?? []),
    ...(lifestyle?.smallVictories ?? []),
    ...(lifestyle?.unspokenRules ?? []),
  ].filter(Boolean);
  const stems = new Set<string>();

  for (const phrase of behavioralPhrases) {
    const words = phrase.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const leadingStem = normalizedActionStem(words[0] ?? "");
    if (leadingStem.length >= 4) stems.add(leadingStem);
    for (const word of words) {
      if (!/(?:ing|ed)$/.test(word)) continue;
      const stem = normalizedActionStem(word);
      if (stem.length >= 4) stems.add(stem);
    }
  }

  return [...stems];
}

function containsProfileActionEvidence(text: string, actionStems: string[]): boolean {
  const candidateStems = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(normalizedActionStem)
    .filter((stem) => stem.length >= 4);

  return candidateStems.some((candidate) => actionStems.some((evidence) => (
    candidate.startsWith(evidence) || evidence.startsWith(candidate)
  )));
}

function retentionRatio(compressed: number, original: number): number {
  if (original <= 0) return 1;
  return Math.round((compressed / original) * 100) / 100;
}

export function evaluateCompressionMeaningRetention(
  original: string,
  compressed: string,
  profile: DynamicNicheProfile,
  minimumRetention = 0.7,
): CompressionMeaningRetention {
  const originalTruth = truthResonanceScore(original, profile);
  const compressedTruth = truthResonanceScore(compressed, profile);
  const originalSpecificity = dynamicSpecificityScore(original, profile);
  const compressedSpecificity = dynamicSpecificityScore(compressed, profile);
  const truthRetentionRatio = retentionRatio(compressedTruth, originalTruth);
  const specificityRetentionRatio = retentionRatio(compressedSpecificity, originalSpecificity);
  const originalEvidenceSignals = profileSignals(profile).filter((signal) => (
    signalWordHitCount(original, [signal]) > 0
  ));
  const retainedEvidenceSignals = originalEvidenceSignals.filter((signal) => (
    signalWordHitCount(compressed, [signal]) > 0
  ));
  const evidenceOverlapRatio = originalEvidenceSignals.length === 0
    ? 1
    : Math.round((retainedEvidenceSignals.length / originalEvidenceSignals.length) * 100) / 100;
  const actionStems = behavioralActionStems(profile);
  const originalHasActionEvidence = containsProfileActionEvidence(original, actionStems);
  const preservesActionEvidence = !originalHasActionEvidence ||
    containsProfileActionEvidence(compressed, actionStems);
  const compositionType = profile.nicheComposition?.compositionType;
  const allowsEmergentCompression = profile.nicheComposition?.kind === "compound" &&
    Boolean(compositionType) &&
    !["BEHAVIORAL_INTERSECTION", "RITUAL_INTERSECTION"].includes(compositionType as CompositionType);
  const preservesMeaning = Boolean(compressed.trim()) &&
    (allowsEmergentCompression || (
      truthRetentionRatio >= minimumRetention &&
      specificityRetentionRatio >= minimumRetention &&
      evidenceOverlapRatio >= minimumRetention &&
      preservesActionEvidence
    ));

  return {
    originalTruth,
    compressedTruth,
    originalSpecificity,
    compressedSpecificity,
    truthRetentionRatio,
    specificityRetentionRatio,
    evidenceOverlapRatio,
    preservesActionEvidence,
    preservesMeaning,
  };
}

export function genericMoodPenalty(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const moodHits = genericMoodWords.filter((word) => text.includes(word)).length;
  if (moodHits === 0) return 0;

  const truth = truthResonanceScore(slogan, profile);
  const specificity = dynamicSpecificityScore(slogan, profile);
  const truthOffset = truth >= 45 || specificity >= 50 ? 10 : 0;

  return Math.max(0, Math.min(30, moodHits * 10 - truthOffset));
}

export function categoryDescriptionPenalty(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const words = text.split(/[^a-z0-9-]+/).filter(Boolean);
  const categoryHits = categoryDescriptionWords.filter((word) => text.includes(word)).length;
  if (categoryHits === 0) return 0;

  const hasListOrTaglineShape = /[,;:/+&]|\band\b|\bwith\b|\bmeets\b|\bgoals?\b/.test(text);
  const hasBehavior = concreteBehaviorWords.some((word) => text.includes(word));
  const hasTruth = truthResonanceScore(slogan, profile) >= 45 || dynamicSpecificityScore(slogan, profile) >= 50;

  let penalty = 0;
  if (hasListOrTaglineShape && !hasBehavior) penalty += 15;
  if (categoryHits >= 2 && !hasBehavior) penalty += 10;
  if (words.length <= 5 && categoryHits >= 2 && !hasTruth) penalty += 8;
  if (/\b(no toxicity allowed|no sweat|no pressure|modern comfort|cozy frames)\b/i.test(text)) penalty += 12;

  return Math.min(35, penalty);
}

export function screenshotProbabilityScore(slogan: string, profile: DynamicNicheProfile): number {
  const words = slogan.trim().split(/\s+/).filter(Boolean).length;
  const brevity = words <= 4 ? 90 : Math.max(35, 100 - words * 10);
  const tension =
    behavioralContradictionScore(slogan, profile) * 0.30 +
    ritualRecognitionScore(slogan, profile) * 0.25 +
    insiderWordplayScore(slogan, profile) * 0.25 +
    truthResonanceScore(slogan, profile) * 0.15;
  return Math.round(Math.min(100, brevity * 0.3 + tension));
}

export function recognitionLatencyScore(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const microHits = distinctiveSignalHitCount(slogan, [
    ...(profile.latentLifestyleModel?.observableScenes.flatMap(lifestyleSceneSignals) || []),
    ...(profile.latentLifestyleModel?.privateRituals || []),
    ...(profile.latentLifestyleModel?.participationHabits || []),
    ...(profile.latentLifestyleModel?.involuntaryBehaviors || []),
    ...(profile.latentLifestyleModel?.seasonalBehaviors || []),
    ...(profile.latentLifestyleModel?.collectionHabits || []),
    ...(profile.latentLifestyleModel?.repeatedDecisions || []),
    ...(profile.latentLifestyleModel?.tinyFrustrations || []),
    ...(profile.latentLifestyleModel?.smallVictories || []),
    ...(profile.latentLifestyleModel?.unspokenRules || []),
    ...(profile.microRituals || []),
    ...profile.rituals,
    ...profile.embarrassingTruths,
  ], profile);
  const markerHits = Math.min(3, instantRecognitionWords.filter((word) => text.includes(word)).length);
  const hasTemporalOrSocialContext = /\b(?:before|after|during|while|because|until|again|instead|dinner|midnight|3\s?am|late-night|group chat)\b/i.test(text);
  const hasTension = /[?,:]|\b(?:can't|wait|but|not|instead|before|after|forgot|still)\b/i.test(text);
  const words = slogan.trim().split(/\s+/).filter(Boolean).length;
  const concise = words <= 8 ? 12 : words <= 11 ? 6 : -10;
  const explanationPenalty = explanatoryDescriptionPenalty(slogan, profile);
  const noDistinctiveMicroRitualCap = microHits === 0 ? 62 : 100;

  return Math.max(0, Math.min(
    noDistinctiveMicroRitualCap,
    microHits * 26 +
      markerHits * 10 +
      (hasTemporalOrSocialContext ? 14 : 0) +
      (hasTension ? 12 : 0) +
      concise -
      explanationPenalty,
  ));
}

export function recognitionProbabilityScore(
  slogan: string,
  profile: DynamicNicheProfile,
): number {
  const lifestyle = profile.latentLifestyleModel;
  const sharedBehaviorGroups = [
    lifestyle?.involuntaryBehaviors ?? [],
    lifestyle?.participationHabits ?? [],
    lifestyle?.seasonalBehaviors ?? [],
    lifestyle?.collectionHabits ?? [],
    lifestyle?.privateRituals ?? [],
    lifestyle?.repeatedDecisions ?? [],
    lifestyle?.tinyFrustrations ?? [],
    lifestyle?.smallVictories ?? [],
    lifestyle?.unspokenRules ?? [],
    profile.microRituals ?? [],
    profile.rituals,
  ].filter((group) => group.length > 0);
  const sharedSignals = sharedBehaviorGroups.flat();
  const distinctiveHits = Math.min(
    3,
    distinctiveSignalHitCount(slogan, sharedSignals, profile),
  );
  const matchedGroups = Math.min(
    4,
    sharedBehaviorGroups.filter((group) => (
      distinctiveSignalHitCount(slogan, group, profile) > 0
    )).length,
  );
  const objectHits = Math.min(2, signalWordHitCount(slogan, [
    ...(lifestyle?.comfortObjects ?? []),
    ...(lifestyle?.recurringObjects ?? []),
  ]));
  const actionStems = behavioralActionStems(profile);
  const hasActionEvidence = containsProfileActionEvidence(slogan, actionStems);
  const hasProfileCoverage = passesDimensionCoverage(slogan, profile);
  const broadLabelPenalty = Math.min(24, broadCategoryLabelCount(slogan, profile) * 8);
  const explanationPenalty = explanatoryLanguagePenalty(slogan);
  const descriptionPenalty = categoryDescriptionPenalty(slogan, profile);

  let score =
    distinctiveHits * 18 +
    matchedGroups * 10 +
    objectHits * 8 +
    (hasActionEvidence ? 15 : 0) +
    (hasProfileCoverage ? 8 : 0) -
    broadLabelPenalty -
    explanationPenalty -
    descriptionPenalty;

  if (distinctiveHits === 0 && objectHits === 0) score = Math.min(score, 45);
  if (!hasActionEvidence && objectHits === 0 && matchedGroups < 2) score = Math.min(score, 55);

  return Math.max(0, Math.min(100, Math.round(score)));
}

const narrowCharacters = new Set(["i", "l", "I", "t", "f", "j", "r"]);
const wideCharacters = new Set(["m", "w", "M", "W", "O", "Q"]);

export function estimateVisualWidth(slogan: string): number {
  return Math.round([...slogan.trim()].reduce((width, character) => {
    if (character === " ") return width + 0.45;
    if (narrowCharacters.has(character)) return width + 0.55;
    if (wideCharacters.has(character)) return width + 1.35;
    return width + 1;
  }, 0) * 10) / 10;
}

export function evaluateAdaptiveBrevity(
  slogan: string,
  budget: SloganLengthBudget,
): AdaptiveBrevityEvaluation {
  const cleaned = slogan.trim();
  const wordCount = cleaned.split(/\s+/).filter(Boolean).length;
  const characterCount = cleaned.length;
  const visualWidth = estimateVisualWidth(cleaned);
  let score = 100;

  if (wordCount > budget.idealWords) {
    score -= (wordCount - budget.idealWords) * 10;
  }
  if (characterCount > budget.idealCharacters) {
    score -= Math.ceil((characterCount - budget.idealCharacters) / 4) * 5;
  }
  if (visualWidth > budget.maxCharacters) {
    score -= 15;
  }

  const passes =
    wordCount <= budget.maxWords &&
    characterCount <= budget.maxCharacters &&
    visualWidth <= budget.maxCharacters &&
    score >= 55;

  return {
    score: Math.max(0, score),
    passes,
    wordCount,
    characterCount,
    visualWidth,
  };
}

export function adaptiveVisualWidthScore(
  brevity: AdaptiveBrevityEvaluation,
  budget: SloganLengthBudget,
): number {
  if (brevity.visualWidth <= budget.idealCharacters) return 100;
  const availableOverflow = Math.max(
    budget.maxCharacters - budget.idealCharacters,
    1,
  );
  const overflow = brevity.visualWidth - budget.idealCharacters;
  return Math.max(0, Math.round(100 - (overflow / availableOverflow) * 100));
}

export function thumbnailReadabilityScore(slogan: string): number {
  const trimmed = slogan.trim();
  if (!trimmed) return 0;

  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const wordScore =
    words <= 4 ? 100 :
      words <= 6 ? 90 :
        words <= 8 ? 75 :
          words <= 10 ? 55 : 30;
  const visualWidth = estimateVisualWidth(trimmed);
  const widthScore =
    visualWidth <= 26 ? 100 :
      visualWidth <= 38 ? 90 :
        visualWidth <= 52 ? 75 :
          visualWidth <= 66 ? 55 : 30;

  return Math.round(wordScore * 0.55 + widthScore * 0.45);
}

const commandOpeners = new Set([
  "ask",
  "bring",
  "cancel",
  "check",
  "choose",
  "don’t",
  "don't",
  "keep",
  "let",
  "never",
  "pause",
  "read",
  "save",
  "send",
  "skip",
  "stop",
  "trust",
  "watch",
  "wear",
]);

function normalizedWords(slogan: string): string[] {
  return slogan
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9'?]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function classifyRhetoricalFamily(slogan: string): RhetoricalFamily {
  const normalized = normalizedWords(slogan).join(" ");
  const firstWord = normalizedWords(slogan)[0] || "";

  if (/^warning\b/.test(normalized)) return "WARNING";
  if (slogan.includes("?")) return "QUESTION";
  if (/\b(?:more|less|better|worse)\b.+\bthan\b|\bversus\b|>/.test(normalized)) return "COMPARISON";
  if (/\b(?:before|after)\b/.test(normalized)) return "PRIORITY";
  if (commandOpeners.has(firstWord) || /^do not\b/.test(normalized)) return "COMMAND";
  if (/^(?:i|i'm|i've|i'd|me)\b/.test(normalized)) return "CONFESSION";
  if (/^(?:my|our)\b/.test(normalized) || /\bis (?:my|our)\b/.test(normalized)) return "IDENTITY";
  if (/\b(?:but|instead|not|can't|cannot|won't|without|over)\b/.test(normalized)) return "CONTRAST";
  return "OBSERVATION";
}

const structuralWords = new Set([
  "a",
  "after",
  "an",
  "and",
  "are",
  "as",
  "at",
  "before",
  "but",
  "can",
  "can't",
  "do",
  "for",
  "from",
  "in",
  "is",
  "it",
  "more",
  "not",
  "of",
  "on",
  "or",
  "over",
  "than",
  "the",
  "to",
  "with",
  "without",
  "won't",
]);

function genericStructuralPattern(words: string[]): string {
  return words.map((word) => {
    if (/^(?:i|i'm|i've|i'd|me|my|our|their|your|we|you)$/.test(word)) return "<PRON>";
    if (/^\d+$/.test(word)) return "<NUM>";
    if (structuralWords.has(word)) return word.toUpperCase();
    if (word.endsWith("ing")) return "<GERUND>";
    if (word.endsWith("ed")) return "<PAST>";
    return "<WORD>";
  }).join(" ");
}

export function buildStructuralFingerprint(slogan: string): StructuralFingerprint {
  const words = normalizedWords(slogan);
  const normalized = words.join(" ");
  const family = classifyRhetoricalFamily(slogan);
  const opening = words[0] || "";
  let pattern: string;

  if (family === "COMPARISON" && /\b(?:more|less|better|worse)\b.+\bthan\b/.test(normalized)) {
    const comparator = normalized.match(/\b(more|less|better|worse)\b/)?.[1]?.toUpperCase() || "<COMPARE>";
    pattern = `${comparator} <CLAUSE> THAN <CLAUSE>`;
  } else if (family === "PRIORITY") {
    const connector = normalized.includes(" before ") ? "BEFORE" : "AFTER";
    pattern = `<CLAUSE> ${connector} <CLAUSE>`;
  } else if (/\bnot just\b/.test(normalized)) {
    pattern = "<CLAUSE> NOT JUST <CLAUSE>";
  } else if (/\bone\b.+\bat a time\b/.test(normalized)) {
    pattern = "<CLAUSE> ONE <CLAUSE> AT A TIME";
  } else if (family === "CONTRAST" && /\bover\b/.test(normalized)) {
    pattern = "<CLAUSE> OVER <CLAUSE>";
  } else if (family === "WARNING") {
    pattern = "WARNING <CLAUSE>";
  } else if (family === "QUESTION") {
    pattern = `${genericStructuralPattern(words).replace(/(?:<WORD>\s*)+/g, "<CLAUSE> ").trim()} ?`;
  } else if (family === "COMMAND") {
    pattern = `<COMMAND> ${genericStructuralPattern(words.slice(1))}`.trim();
  } else if (family === "CONFESSION") {
    pattern = `<PRON> ${genericStructuralPattern(words.slice(1)).replace(/(?:<WORD>\s*)+/g, "<CLAUSE> ").trim()}`.trim();
  } else if (family === "IDENTITY") {
    pattern = genericStructuralPattern(words).replace(/(?:<WORD>\s*)+/g, "<CLAUSE> ").trim();
  } else {
    pattern = genericStructuralPattern(words);
  }

  return {
    family,
    pattern: `${family}:${pattern}`,
    opening,
  };
}

export function applyStructuralDiversityRanking<
  T extends { slogan: string; score: number; finalScore?: number },
>(candidates: T[]): Array<T & StructuralDiversityMetrics> {
  const remaining = candidates
    .map((candidate, index) => ({
      candidate,
      fingerprint: buildStructuralFingerprint(candidate.slogan),
      index,
    }))
    .sort((a, b) => b.candidate.score - a.candidate.score || a.index - b.index);
  const selected: Array<T & StructuralDiversityMetrics> = [];
  const patternCounts = new Map<string, number>();
  const familyCounts = new Map<RhetoricalFamily, number>();
  const openingCounts = new Map<string, number>();

  while (remaining.length > 0) {
    const evaluated = remaining.map((entry) => {
      const patternCount = patternCounts.get(entry.fingerprint.pattern) || 0;
      const familyCount = familyCounts.get(entry.fingerprint.family) || 0;
      const openingCount = openingCounts.get(entry.fingerprint.opening) || 0;
      const structuralPenalty = patternCount * 28;
      const openingPenalty = openingCount * 16;
      const familyPenalty = familyCount <= 1 ? familyCount * 4 : 8 + (familyCount - 1) * 10;
      const penalty = structuralPenalty + openingPenalty + familyPenalty;

      return {
        ...entry,
        adjustedScore: Math.max(0, Math.round(entry.candidate.score - penalty)),
        penalty,
      };
    }).sort((a, b) =>
      b.adjustedScore - a.adjustedScore ||
      b.candidate.score - a.candidate.score ||
      a.index - b.index
    );

    const winner = evaluated[0];
    const remainingIndex = remaining.findIndex((entry) => entry.index === winner.index);
    remaining.splice(remainingIndex, 1);
    patternCounts.set(winner.fingerprint.pattern, (patternCounts.get(winner.fingerprint.pattern) || 0) + 1);
    familyCounts.set(winner.fingerprint.family, (familyCounts.get(winner.fingerprint.family) || 0) + 1);
    openingCounts.set(winner.fingerprint.opening, (openingCounts.get(winner.fingerprint.opening) || 0) + 1);
    selected.push({
      ...winner.candidate,
      score: winner.adjustedScore,
      finalScore: winner.adjustedScore,
      structuralFingerprint: winner.fingerprint.pattern,
      rhetoricalFamily: winner.fingerprint.family,
      lexicalOpening: winner.fingerprint.opening,
      structuralDiversityPenalty: winner.penalty,
    });
  }

  return selected;
}

export function wearabilityScore(slogan: string): number {
  const trimmed = slogan.trim();
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  if (!trimmed || words > 8 || trimmed.length > 48) return 20;
  if (words <= 5 && trimmed.length <= 34) return 95;
  if (words <= 7 && trimmed.length <= 42) return 80;
  return 55;
}

export function scoreDynamicSlogan(
  slogan: string,
  profile: DynamicNicheProfile,
): number {
  const truth = truthResonanceScore(slogan, profile);
  const contradiction = behavioralContradictionScore(slogan, profile);
  const ritual = ritualRecognitionScore(slogan, profile);
  const insider = insiderWordplayScore(slogan, profile);
  const authenticity = communityAuthenticityScore(slogan, profile);
  const specificity = dynamicSpecificityScore(slogan, profile);
  const moodPenalty = genericMoodPenalty(slogan, profile);
  const categoryPenalty = categoryDescriptionPenalty(slogan, profile);
  const explanationPenalty = explanatoryDescriptionPenalty(slogan, profile);
  const recognitionLatency = recognitionLatencyScore(slogan, profile);
  const recognitionProbability = recognitionProbabilityScore(slogan, profile);
  const thumbnailReadability = thumbnailReadabilityScore(slogan);

  const rawScore = Math.max(0, Math.round(
    truth * 0.14 +
      authenticity * 0.11 +
      recognitionLatency * 0.10 +
      recognitionProbability * 0.16 +
      thumbnailReadability * 0.12 +
      specificity * 0.06 +
      contradiction * 0.14 +
      insider * 0.10 +
      ritual * 0.07 -
      moodPenalty -
      categoryPenalty -
      explanationPenalty,
  ));

  // Keep headroom so "excellent" remains distinguishable from "perfect".
  // The weighted signals are intentionally saturating; compressing the upper
  // range prevents several capped components from turning every survivor into 100.
  const calibratedScore = Math.min(92, Math.round(12 + rawScore * 0.80));
  const broadLabelHits = broadCategoryLabelCount(slogan, profile);
  const hasBehaviorEvidence = hasConcreteBehaviorEvidence(slogan, profile);

  if (moodPenalty > 0 && contradiction < 25 && ritual < 25 && insider < 35) return Math.min(calibratedScore, 72);
  if (contradiction < 25 && ritual < 25 && insider < 35 && truth < 45) return Math.min(calibratedScore, 76);
  if (truth < 35 && authenticity < 35) return Math.min(calibratedScore, 70);
  if (truth < 45 && specificity < 50) return Math.min(calibratedScore, 80);
  if (explanationPenalty > 0 && recognitionLatency < 35) return Math.min(calibratedScore, 68);
  if (recognitionLatency < 30 && ritual < 30 && insider < 35) return Math.min(calibratedScore, 74);
  if (broadLabelHits >= 3 && recognitionLatency < 35) return Math.min(calibratedScore, 72);
  if (broadLabelHits >= 2 && recognitionLatency < 35) return Math.min(calibratedScore, 76);
  if (broadLabelHits >= 2 && recognitionLatency < 65) return Math.min(calibratedScore, 82);
  if (broadLabelHits >= 1 && recognitionLatency < 30 && ritual < 45) return Math.min(calibratedScore, 78);
  if (recognitionLatency < 35) return Math.min(calibratedScore, 78);
  if (recognitionLatency < 45) return Math.min(calibratedScore, 88);
  if (broadLabelHits >= 3 && !hasBehaviorEvidence) return Math.min(calibratedScore, 78);
  if (broadLabelHits >= 2 && !hasBehaviorEvidence) return Math.min(calibratedScore, 82);
  if (broadLabelHits >= 3 && ritual < 30) return Math.min(calibratedScore, 84);
  if (broadLabelHits >= 2 && ritual < 30) return Math.min(calibratedScore, 87);
  return calibratedScore;
}
