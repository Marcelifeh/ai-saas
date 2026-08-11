import "server-only";

import type { DynamicNicheProfile } from "./dynamicNicheProfile";
import { chatCompletionSafe } from "./aiGateway";

export interface DynamicDesignInput {
  niche: string;
  slogan: string;
  profile: DynamicNicheProfile;
  style: string;
  garmentBackground: "dark" | "light" | "either";
  printBackground: "transparent" | "solid";
  marketplace?: "amazon_merch" | "etsy" | "general";
}

export interface SloganVisualMeaning {
  literalSubject: string;
  impliedMeaning: string;
  behavioralTruth: string;
  emotionalPayoff: string;
  visualizableAction: string;
  strongestContrast?: string;
}

export interface DynamicVisualConcept {
  coreMessage: string;
  emotionalTone: string[];
  behavioralMoment: string[];
  visualMetaphors: string[];
  relevantObjects: string[];
  environmentalCues: string[];
  typographyPersonality: string[];
  compositionIntent: string;
  focalHierarchy: string[];
  supportingGraphics: string[];
  avoidElements: string[];
  printStrategy: {
    silhouetteStrength: string;
    detailDensity: string;
    contrastNeed: string;
    viewingDistance: string;
  };
}

export interface CompositionPlan {
  primaryFocus: "typography" | "illustration" | "hybrid";
  hierarchy: Array<{
    element: string;
    importance: number;
  }>;
  textTreatment: string;
  illustrationRelationship: string;
  negativeSpaceStrategy: string;
  silhouette: string;
  balance: string;
}

export interface TshirtVisualQuality {
  thumbnailLegibility: number;
  focalClarity: number;
  silhouetteStrength: number;
  textGraphicIntegration: number;
  contrast: number;
  printability: number;
  visualOriginality: number;
  sloganReinforcement: number;
}

export interface VisualFingerprint {
  primarySubject: string;
  compositionType: string;
  metaphorType: string;
  typographyRole: string;
  graphicRelationship: string;
}

export interface VisualComplexityBudget {
  textDominance: number;
  illustrationDominance: number;
  maxPrimarySubjects: number;
  supportingDetailLevel: "minimal" | "controlled" | "moderate";
}

export interface DynamicDesignStrategy {
  slogan: string;
  meaning: SloganVisualMeaning;
  concept: DynamicVisualConcept;
  composition: CompositionPlan;
  complexity: VisualComplexityBudget;
  quality: TshirtVisualQuality;
  visualImpact: number;
  fingerprint: VisualFingerprint;
  diversityPenalty: number;
  qualityGatePassed: boolean;
  batchRepairAttempts: number;
  prompt: string;
}

export interface DynamicStyleVariant {
  style: string;
  prompt: string;
  semanticSignature: string;
}

export interface DesignBatchDiversityMetrics {
  sampleSize: number;
  designCount: number;
  primaryFocusDiversity: number;
  compositionFamilyDiversity: number;
  visualMetaphorDiversity: number;
  supportingObjectOverlap: number;
  typographyRoleDiversity: number;
  fingerprintCollisionRate: number;
  maxFingerprintSimilarity: number;
  averageThumbnailLegibility: number;
  averagePrintability: number;
  averageSloganReinforcement: number;
  averageVisualOriginality: number;
  averageVisualImpact: number;
  commercialQualityScore: number;
  qualityGatePassRate: number;
  collapsedStrategyIndexes: number[];
}

export const VISUAL_ENGINE_VERSION = "dynamic-visual-v3";
export const MIN_VISUAL_BATCH_SIZE = 3;
export const MAX_VISUAL_REPAIR_ATTEMPTS = 2;

export const VISUAL_RELEASE_THRESHOLDS = {
  primaryFocusDiversity: 0.6,
  compositionFamilyDiversity: 0.75,
  visualMetaphorDiversity: 0.6,
  supportingObjectOverlap: 0.3,
  typographyRoleDiversity: 0.6,
  commercialQualityScore: 70,
} as const;

export type VisualReleaseMetric = keyof typeof VISUAL_RELEASE_THRESHOLDS;
export type VisualReleaseStatus = "NOT_EVALUATED" | "INSUFFICIENT_SAMPLE" | "PASS" | "REVIEW";

export interface VisualReleaseWarning {
  metric: VisualReleaseMetric;
  actual: number;
  threshold: number;
  expectation: "minimum" | "maximum";
}

export interface VisualReleaseGate {
  status: VisualReleaseStatus;
  evaluated: boolean;
  passed: boolean;
  sampleSize: number;
  repairAttempts: number;
  maxRepairAttempts: number;
  unresolvedMetrics: VisualReleaseMetric[];
  warnings: VisualReleaseWarning[];
  thresholds: typeof VISUAL_RELEASE_THRESHOLDS;
  reason?: string;
}

export interface VisualBatchReleaseEvaluation {
  validStrategies: DynamicDesignStrategy[];
  metrics: DesignBatchDiversityMetrics | null;
  releaseGate: VisualReleaseGate;
}

export interface DynamicDesignBatchInput {
  niche: string;
  slogans: string[];
  profile: DynamicNicheProfile;
  style?: string;
  garmentBackground?: "dark" | "light" | "either";
  printBackground?: "transparent" | "solid";
  marketplace?: "amazon_merch" | "etsy" | "general";
  userId?: string;
}

type UnscoredStrategy = Pick<DynamicDesignStrategy, "slogan" | "meaning" | "concept" | "composition" | "complexity">;
type EvaluatedStrategy = UnscoredStrategy & { quality: TshirtVisualQuality; fingerprint: VisualFingerprint };

const QUALITY_GATE_MINIMUM = 65;
const PRINTABILITY_MINIMUM = 70;

function cleanString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.replace(/\s+/g, " ").trim() || fallback;
}

function cleanStringArray(value: unknown, fallback: string[] = [], limit = 8): string[] {
  if (!Array.isArray(value)) return fallback;
  const seen = new Set<string>();
  const values: string[] = [];
  for (const item of value) {
    const cleaned = cleanString(item);
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    values.push(cleaned);
    if (values.length >= limit) break;
  }
  return values.length > 0 ? values : fallback;
}

function score(value: unknown, fallback = 70): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function normalizeFocus(value: unknown, fallback: CompositionPlan["primaryFocus"]): CompositionPlan["primaryFocus"] {
  return value === "typography" || value === "illustration" || value === "hybrid" ? value : fallback;
}

function uniqueEvidence(values: Array<string | undefined>, limit = 40): string[] {
  const seen = new Set<string>();
  const evidence: string[] = [];
  for (const value of values) {
    const cleaned = cleanString(value);
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    evidence.push(cleaned);
    if (evidence.length >= limit) break;
  }
  return evidence;
}

/**
 * Behavioral fields are evidence for concept discovery, never an instruction
 * to place every listed object in the artwork.
 */
export function collectVisualEvidence(profile: DynamicNicheProfile): string[] {
  const lifestyle = profile.latentLifestyleModel;
  return uniqueEvidence([
    ...(lifestyle?.participationHabits ?? []),
    ...(lifestyle?.seasonalBehaviors ?? []),
    ...(lifestyle?.comfortObjects ?? []),
    ...(lifestyle?.collectionHabits ?? []),
    ...(lifestyle?.involuntaryBehaviors ?? []),
    ...(lifestyle?.environments ?? []),
    ...(lifestyle?.recurringObjects ?? []),
    ...(lifestyle?.privateRituals ?? []),
    ...(lifestyle?.tensions ?? []),
    ...(lifestyle?.repeatedDecisions ?? []),
    ...(lifestyle?.tinyFrustrations ?? []),
    ...(lifestyle?.smallVictories ?? []),
    ...(lifestyle?.unspokenRules ?? []),
    ...(lifestyle?.observableScenes.flatMap((scene) => [
      scene.doing,
      scene.before,
      scene.after,
      ...scene.recurringObjects,
      ...scene.environmentalConditions,
    ]) ?? []),
    ...(profile.microRituals ?? []),
    ...profile.rituals,
    ...profile.contradictions,
    ...profile.frustrations,
    ...profile.statusSignals,
    ...profile.embarrassingTruths,
  ]);
}

export function deriveVisualComplexityBudget(
  slogan: string,
  _concept?: DynamicVisualConcept,
): VisualComplexityBudget {
  void _concept;
  const words = slogan.trim().split(/\s+/).filter(Boolean).length;
  const textDominance = words >= 7 ? 0.75 : words >= 5 ? 0.6 : words >= 3 ? 0.45 : 0.3;

  return {
    textDominance,
    illustrationDominance: Number((1 - textDominance).toFixed(2)),
    maxPrimarySubjects: words >= 6 ? 1 : 2,
    supportingDetailLevel: words >= 7 ? "minimal" : words >= 4 ? "controlled" : "moderate",
  };
}

function fallbackMeaning(slogan: string, profile: DynamicNicheProfile): SloganVisualMeaning {
  const evidence = collectVisualEvidence(profile);
  const behavioralTruth = evidence[0] ?? profile.contradictions[0] ?? `The wearer recognizes a specific truth in “${slogan}”`;
  const strongestContrast = profile.contradictions[0] ?? profile.latentLifestyleModel?.tensions[0];
  return {
    literalSubject: slogan,
    impliedMeaning: strongestContrast ?? behavioralTruth,
    behavioralTruth,
    emotionalPayoff: profile.latentLifestyleModel?.emotionalRewards[0] ?? profile.purchaseMotives[0] ?? "insider recognition",
    visualizableAction: `Show the concrete cause-and-effect in this behavior: ${behavioralTruth}`,
    strongestContrast,
  };
}

function fallbackConcept(meaning: SloganVisualMeaning, profile: DynamicNicheProfile): DynamicVisualConcept {
  const lifestyle = profile.latentLifestyleModel;
  const objects = uniqueEvidence([...(lifestyle?.comfortObjects ?? []), ...(lifestyle?.recurringObjects ?? [])], 2);
  const environments = uniqueEvidence(lifestyle?.environments ?? [], 1);
  return {
    coreMessage: meaning.impliedMeaning,
    emotionalTone: uniqueEvidence(lifestyle?.emotionalRewards ?? [], 2).length > 0
      ? uniqueEvidence(lifestyle?.emotionalRewards ?? [], 2)
      : [meaning.emotionalPayoff],
    behavioralMoment: [meaning.behavioralTruth],
    visualMetaphors: meaning.strongestContrast ? [meaning.strongestContrast] : [],
    relevantObjects: objects,
    environmentalCues: environments,
    typographyPersonality: ["Match the exact words' cadence, attitude, and emotional emphasis"],
    compositionIntent: `Make this action or relationship understandable before all text is read: ${meaning.visualizableAction}`,
    focalHierarchy: [meaning.visualizableAction, "exact slogan text"],
    supportingGraphics: uniqueEvidence([...objects, ...environments], 2),
    avoidElements: ["broad niche symbols that do not explain this slogan", "decorative filler", "generic stock-vector treatment"],
    printStrategy: {
      silhouetteStrength: "one recognizable outer shape with separated major masses",
      detailDensity: "reserve detail for the meaning-bearing interaction",
      contrastNeed: "strong separation between text, focal action, and garment",
      viewingDistance: "readable first at marketplace thumbnail size, then rewarding up close",
    },
  };
}

function fallbackComposition(slogan: string, meaning: SloganVisualMeaning): CompositionPlan {
  const words = slogan.trim().split(/\s+/).filter(Boolean).length;
  const primaryFocus: CompositionPlan["primaryFocus"] = words >= 7 ? "typography" : "hybrid";
  return {
    primaryFocus,
    hierarchy: [
      { element: meaning.visualizableAction, importance: 100 },
      { element: "exact slogan text", importance: words >= 7 ? 95 : 85 },
    ],
    textTreatment: "Use scale, weight, spacing, and emphasis to express the slogan's spoken rhythm",
    illustrationRelationship: `The typography and image must jointly demonstrate: ${meaning.visualizableAction}`,
    negativeSpaceStrategy: "Protect the focal relationship and keep counters and word shapes open at thumbnail size",
    silhouette: "A cohesive isolated chest-print shape determined by the focal action",
    balance: "Weight elements according to meaning and reading order, not a default symmetrical template",
  };
}

function normalizeMeaning(value: unknown, fallback: SloganVisualMeaning): SloganVisualMeaning {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    literalSubject: cleanString(raw.literalSubject, fallback.literalSubject),
    impliedMeaning: cleanString(raw.impliedMeaning, fallback.impliedMeaning),
    behavioralTruth: cleanString(raw.behavioralTruth, fallback.behavioralTruth),
    emotionalPayoff: cleanString(raw.emotionalPayoff, fallback.emotionalPayoff),
    visualizableAction: cleanString(raw.visualizableAction, fallback.visualizableAction),
    strongestContrast: cleanString(raw.strongestContrast, fallback.strongestContrast),
  };
}

function normalizeConcept(value: unknown, fallback: DynamicVisualConcept): DynamicVisualConcept {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const rawPrint = raw.printStrategy && typeof raw.printStrategy === "object"
    ? raw.printStrategy as Record<string, unknown>
    : {};
  return {
    coreMessage: cleanString(raw.coreMessage, fallback.coreMessage),
    emotionalTone: cleanStringArray(raw.emotionalTone, fallback.emotionalTone, 4),
    behavioralMoment: cleanStringArray(raw.behavioralMoment, fallback.behavioralMoment, 4),
    visualMetaphors: cleanStringArray(raw.visualMetaphors, fallback.visualMetaphors, 4),
    relevantObjects: cleanStringArray(raw.relevantObjects, fallback.relevantObjects, 4),
    environmentalCues: cleanStringArray(raw.environmentalCues, fallback.environmentalCues, 3),
    typographyPersonality: cleanStringArray(raw.typographyPersonality, fallback.typographyPersonality, 4),
    compositionIntent: cleanString(raw.compositionIntent, fallback.compositionIntent),
    focalHierarchy: cleanStringArray(raw.focalHierarchy, fallback.focalHierarchy, 5),
    supportingGraphics: cleanStringArray(raw.supportingGraphics, fallback.supportingGraphics, 4),
    avoidElements: cleanStringArray(raw.avoidElements, fallback.avoidElements, 8),
    printStrategy: {
      silhouetteStrength: cleanString(rawPrint.silhouetteStrength, fallback.printStrategy.silhouetteStrength),
      detailDensity: cleanString(rawPrint.detailDensity, fallback.printStrategy.detailDensity),
      contrastNeed: cleanString(rawPrint.contrastNeed, fallback.printStrategy.contrastNeed),
      viewingDistance: cleanString(rawPrint.viewingDistance, fallback.printStrategy.viewingDistance),
    },
  };
}

function normalizeComposition(value: unknown, fallback: CompositionPlan): CompositionPlan {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const hierarchy = Array.isArray(raw.hierarchy)
    ? raw.hierarchy.map((item) => {
      const entry = item && typeof item === "object" ? item as Record<string, unknown> : {};
      return {
        element: cleanString(entry.element),
        importance: score(entry.importance, 50),
      };
    }).filter((item) => item.element).slice(0, 6)
    : [];

  return {
    primaryFocus: normalizeFocus(raw.primaryFocus, fallback.primaryFocus),
    hierarchy: hierarchy.length > 0 ? hierarchy : fallback.hierarchy,
    textTreatment: cleanString(raw.textTreatment, fallback.textTreatment),
    illustrationRelationship: cleanString(raw.illustrationRelationship, fallback.illustrationRelationship),
    negativeSpaceStrategy: cleanString(raw.negativeSpaceStrategy, fallback.negativeSpaceStrategy),
    silhouette: cleanString(raw.silhouette, fallback.silhouette),
    balance: cleanString(raw.balance, fallback.balance),
  };
}

function normalizeQuality(value: unknown): TshirtVisualQuality {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    // Missing evaluator output must fail visibly instead of masquerading as a pass.
    thumbnailLegibility: score(raw.thumbnailLegibility, 55),
    focalClarity: score(raw.focalClarity, 55),
    silhouetteStrength: score(raw.silhouetteStrength, 55),
    textGraphicIntegration: score(raw.textGraphicIntegration, 55),
    contrast: score(raw.contrast, 55),
    printability: score(raw.printability, 55),
    visualOriginality: score(raw.visualOriginality, 55),
    sloganReinforcement: score(raw.sloganReinforcement, 55),
  };
}

function fallbackFingerprint(strategy: UnscoredStrategy): VisualFingerprint {
  return {
    primarySubject: strategy.composition.hierarchy[0]?.element ?? strategy.meaning.visualizableAction,
    compositionType: strategy.composition.silhouette,
    metaphorType: strategy.concept.visualMetaphors[0] ?? "literal behavioral action",
    typographyRole: strategy.composition.primaryFocus,
    graphicRelationship: strategy.composition.illustrationRelationship,
  };
}

function normalizeFingerprint(value: unknown, fallback: VisualFingerprint): VisualFingerprint {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    primarySubject: cleanString(raw.primarySubject, fallback.primarySubject),
    compositionType: cleanString(raw.compositionType, fallback.compositionType),
    metaphorType: cleanString(raw.metaphorType, fallback.metaphorType),
    typographyRole: cleanString(raw.typographyRole, fallback.typographyRole),
    graphicRelationship: cleanString(raw.graphicRelationship, fallback.graphicRelationship),
  };
}

function visualImpact(quality: TshirtVisualQuality): number {
  return Math.round(
    quality.thumbnailLegibility * 0.16 +
    quality.focalClarity * 0.14 +
    quality.silhouetteStrength * 0.12 +
    quality.textGraphicIntegration * 0.15 +
    quality.contrast * 0.1 +
    quality.printability * 0.13 +
    quality.visualOriginality * 0.08 +
    quality.sloganReinforcement * 0.12,
  );
}

function passesQualityGate(quality: TshirtVisualQuality): boolean {
  return quality.thumbnailLegibility >= QUALITY_GATE_MINIMUM &&
    quality.focalClarity >= QUALITY_GATE_MINIMUM &&
    quality.silhouetteStrength >= QUALITY_GATE_MINIMUM &&
    quality.textGraphicIntegration >= QUALITY_GATE_MINIMUM &&
    quality.contrast >= QUALITY_GATE_MINIMUM &&
    quality.printability >= PRINTABILITY_MINIMUM &&
    quality.visualOriginality >= QUALITY_GATE_MINIMUM &&
    quality.sloganReinforcement >= QUALITY_GATE_MINIMUM;
}

function fingerprintKey(fingerprint: VisualFingerprint): string {
  return Object.values(fingerprint)
    .map((value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim())
    .join("|");
}

function fingerprintTokens(value: string): Set<string> {
  const stopWords = new Set([
    "a", "an", "and", "as", "at", "by", "for", "from", "in", "into", "of", "on", "the", "to", "with",
    "art", "artwork", "composition", "design", "element", "graphic", "illustration", "layout", "slogan", "text", "typography", "visual",
  ]);
  return new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2 && !stopWords.has(token)));
}

function tokenSimilarity(left: string, right: string): number {
  const a = fingerprintTokens(left);
  const b = fingerprintTokens(right);
  if (a.size === 0 || b.size === 0) return left.trim().toLowerCase() === right.trim().toLowerCase() ? 1 : 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function fingerprintSimilarity(left: VisualFingerprint, right: VisualFingerprint): number {
  return (
    tokenSimilarity(left.primarySubject, right.primarySubject) * 0.25 +
    tokenSimilarity(left.compositionType, right.compositionType) * 0.25 +
    tokenSimilarity(left.metaphorType, right.metaphorType) * 0.2 +
    tokenSimilarity(left.typographyRole, right.typographyRole) * 0.1 +
    tokenSimilarity(left.graphicRelationship, right.graphicRelationship) * 0.2
  );
}

function semanticClusterCount(values: string[], similarityThreshold = 0.65): number {
  const representatives: string[] = [];
  for (const value of values) {
    if (!representatives.some((representative) => tokenSimilarity(value, representative) >= similarityThreshold)) {
      representatives.push(value);
    }
  }
  return representatives.length;
}

function arrayOverlap(left: string[], right: string[]): number {
  const a = new Set(left.map((value) => value.toLowerCase().trim()).filter(Boolean));
  const b = new Set(right.map((value) => value.toLowerCase().trim()).filter(Boolean));
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function averageDefined(values: Array<number | null | undefined>): number | null {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (valid.length === 0) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function roundedRatio(value: number): number {
  return Number(Math.max(0, Math.min(1, value)).toFixed(3));
}

function findCollapsedStrategyIndexes(
  strategies: Array<{ fingerprint: VisualFingerprint }>,
  threshold = 0.65,
): number[] {
  const collapsed = new Set<number>();
  for (let right = 1; right < strategies.length; right += 1) {
    for (let left = 0; left < right; left += 1) {
      if (fingerprintSimilarity(strategies[left].fingerprint, strategies[right].fingerprint) >= threshold) {
        collapsed.add(right);
        break;
      }
    }
  }
  return [...collapsed];
}

function compositionDescriptor(
  strategy: Pick<DynamicDesignStrategy, "fingerprint" | "composition">,
): string {
  return [
    strategy.fingerprint.compositionType,
    strategy.composition.silhouette,
    strategy.composition.balance,
    strategy.composition.negativeSpaceStrategy,
    strategy.composition.illustrationRelationship,
  ].join(" | ");
}

function typographyRoleDescriptor(
  strategy: Pick<DynamicDesignStrategy, "fingerprint" | "composition" | "concept">,
): string {
  return [
    strategy.fingerprint.typographyRole,
    strategy.composition.textTreatment,
    strategy.composition.illustrationRelationship,
    ...strategy.concept.typographyPersonality,
  ].join(" | ");
}

function repeatedAxisIndexes(values: string[], similarityThreshold = 0.65): number[] {
  const representatives: string[] = [];
  const repeated: number[] = [];
  values.forEach((value, index) => {
    if (representatives.some((representative) => tokenSimilarity(value, representative) >= similarityThreshold)) {
      repeated.push(index);
    } else {
      representatives.push(value);
    }
  });
  return repeated;
}

function findBatchCollapseRepairIndexes(
  strategies: Array<Pick<DynamicDesignStrategy, "fingerprint" | "composition" | "concept">>,
): number[] {
  const count = strategies.length;
  if (count < 2) return [];
  const repair = new Set<number>();
  const compositions = strategies.map(compositionDescriptor);
  const metaphors = strategies.map((strategy) => strategy.fingerprint.metaphorType);
  const typographyRoles = strategies.map(typographyRoleDescriptor);

  const addMinimumAxisRepairs = (values: string[], targetUnique: number) => {
    const needed = Math.max(0, targetUnique - semanticClusterCount(values));
    repeatedAxisIndexes(values).slice(0, needed).forEach((index) => repair.add(index));
  };

  addMinimumAxisRepairs(compositions, Math.ceil(count * VISUAL_RELEASE_THRESHOLDS.compositionFamilyDiversity));
  addMinimumAxisRepairs(metaphors, Math.ceil(count * VISUAL_RELEASE_THRESHOLDS.visualMetaphorDiversity));
  addMinimumAxisRepairs(typographyRoles, Math.ceil(count * VISUAL_RELEASE_THRESHOLDS.typographyRoleDiversity));

  const focusCount = new Set(strategies.map((strategy) => strategy.composition.primaryFocus)).size;
  if (focusCount / Math.min(3, count) < VISUAL_RELEASE_THRESHOLDS.primaryFocusDiversity) {
    const firstUnused = strategies.findIndex((_, index) => index > 0 && !repair.has(index));
    repair.add(firstUnused >= 0 ? firstUnused : 1);
  }

  let objectRepairCount = 0;
  for (let right = 1; right < count; right += 1) {
    const rightObjects = [...strategies[right].concept.relevantObjects, ...strategies[right].concept.supportingGraphics];
    for (let left = 0; left < right; left += 1) {
      const leftObjects = [...strategies[left].concept.relevantObjects, ...strategies[left].concept.supportingGraphics];
      if (arrayOverlap(leftObjects, rightObjects) > VISUAL_RELEASE_THRESHOLDS.supportingObjectOverlap) {
        repair.add(right);
        objectRepairCount += 1;
        break;
      }
    }
    if (objectRepairCount >= 2) break;
  }

  for (const index of findCollapsedStrategyIndexes(strategies).slice(0, Math.ceil(count * 0.2))) {
    repair.add(index);
  }

  return [...repair]
    .sort((left, right) => left - right)
    .slice(0, Math.ceil(count * 0.5));
}

function profileForPrompt(profile: DynamicNicheProfile): Record<string, unknown> {
  return {
    audience: profile.audience,
    contradictions: profile.contradictions,
    statusSignals: profile.statusSignals,
    embarrassingTruths: profile.embarrassingTruths,
    visualCulture: profile.visualCulture,
    purchaseMotives: profile.purchaseMotives,
    lifestyle: profile.latentLifestyleModel,
  };
}

async function generateUnscoredStrategies(input: DynamicDesignBatchInput): Promise<UnscoredStrategy[]> {
  const evidence = collectVisualEvidence(input.profile);
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 8000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a commercial apparel concept director. Return valid JSON only. Discover visual ideas from behavioral meaning; never use niche templates or reusable composition formulas.",
      },
      {
        role: "user",
        content: `Design STYLE-NEUTRAL visual strategies for this batch of t-shirt slogans.

NICHE: ${input.niche}
SLOGANS: ${JSON.stringify(input.slogans)}
BEHAVIORAL PROFILE: ${JSON.stringify(profileForPrompt(input.profile))}
VISUAL EVIDENCE: ${JSON.stringify(evidence)}
SELECTED RENDERING STYLE (reserved for a later transformation; do not let it invent the idea): ${input.style ?? "Bold Graphic"}

For EACH slogan, reason in this order:
1. What is its literal subject?
2. What does the wearer really mean?
3. What concrete behavior, contradiction, joke, status signal, ritual, or emotional truth does THIS line express?
4. What visible action or relationship demonstrates that meaning before the viewer finishes reading?
5. What composition follows from that meaning and the slogan's length and rhythm?

Treat profile fields as evidence. Select only the smallest number of cues that materially strengthen this slogan. Never dump an evidence list into the artwork.
The slogan must control the art more strongly than the broad niche.
Do not default to centered badges, stacked text, arched headlines, circular emblems, text-above-icon, big-text-plus-object, mascots, banners, or small-star filler. Use one only when the specific meaning genuinely requires it.
Create meaningfully different visual concepts across the batch—not the same layout with different props.

Return this exact JSON shape:
{
  "strategies": [
    {
      "index": 0,
      "slogan": "exact input slogan",
      "meaning": {
        "literalSubject": "",
        "impliedMeaning": "",
        "behavioralTruth": "",
        "emotionalPayoff": "",
        "visualizableAction": "a concrete drawable action or relationship, not an art-style phrase",
        "strongestContrast": ""
      },
      "concept": {
        "coreMessage": "",
        "emotionalTone": [],
        "behavioralMoment": [],
        "visualMetaphors": [],
        "relevantObjects": [],
        "environmentalCues": [],
        "typographyPersonality": [],
        "compositionIntent": "",
        "focalHierarchy": [],
        "supportingGraphics": [],
        "avoidElements": [],
        "printStrategy": {
          "silhouetteStrength": "",
          "detailDensity": "",
          "contrastNeed": "",
          "viewingDistance": ""
        }
      },
      "composition": {
        "primaryFocus": "typography|illustration|hybrid",
        "hierarchy": [{ "element": "", "importance": 0 }],
        "textTreatment": "",
        "illustrationRelationship": "describe an actual interaction, not graphics sitting near text",
        "negativeSpaceStrategy": "",
        "silhouette": "",
        "balance": ""
      }
    }
  ]
}`,
      },
    ],
    usageContext: input.userId ? { userId: input.userId, feature: "strategy.single" } : undefined,
  });

  const content = response.data?.choices[0]?.message?.content;
  let rawStrategies: unknown[] = [];
  if (content) {
    try {
      const parsed = JSON.parse(content) as { strategies?: unknown[] };
      rawStrategies = Array.isArray(parsed.strategies) ? parsed.strategies : [];
    } catch {
      rawStrategies = [];
    }
  }

  return input.slogans.map((slogan, index) => {
    const byIndex = rawStrategies.find((value) => {
      if (!value || typeof value !== "object") return false;
      const item = value as Record<string, unknown>;
      return item.index === index || cleanString(item.slogan).toLowerCase() === slogan.toLowerCase();
    });
    const raw = byIndex && typeof byIndex === "object" ? byIndex as Record<string, unknown> : {};
    const meaningFallback = fallbackMeaning(slogan, input.profile);
    const meaning = normalizeMeaning(raw.meaning, meaningFallback);
    const conceptFallback = fallbackConcept(meaning, input.profile);
    const concept = normalizeConcept(raw.concept, conceptFallback);
    const compositionFallback = fallbackComposition(slogan, meaning);
    return {
      slogan,
      meaning,
      concept,
      composition: normalizeComposition(raw.composition, compositionFallback),
      complexity: deriveVisualComplexityBudget(slogan, concept),
    };
  });
}

async function evaluateAndReviseStrategies(
  input: DynamicDesignBatchInput,
  strategies: UnscoredStrategy[],
): Promise<EvaluatedStrategy[]> {
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature: 0.25,
    max_tokens: 8000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a strict commercial t-shirt art director and prepress reviewer. Return valid JSON only. Revise weak concepts before assigning honest final scores.",
      },
      {
        role: "user",
        content: `Quality-gate this batch of style-neutral apparel strategies.

NICHE: ${input.niche}
GARMENT: ${input.garmentBackground ?? "either"}
PRINT BACKGROUND: ${input.printBackground ?? "transparent"}
MARKETPLACE: ${input.marketplace ?? "general"}
STRATEGIES: ${JSON.stringify(strategies)}

For each strategy, evaluate:
- thumbnailLegibility: does the basic design still read around 150–250 px?
- focalClarity: is there one obvious visual destination?
- silhouetteStrength: does it form a recognizable isolated printable shape?
- textGraphicIntegration: does the illustration interact with the message instead of sitting underneath it?
- contrast: will major forms separate on the requested garment?
- printability: are shapes, line weights, separations, and detail density suitable for apparel?
- visualOriginality: is this a distinct concept rather than stock clip art or a familiar formula?
- sloganReinforcement: does the visual make this exact slogan stronger?

Any score below 65 (or printability below 70) is a failed gate. First revise the meaning-bearing concept and composition so it passes; then score the FINAL revised version honestly.
Respect each supplied complexity budget. Do not solve weakness by adding more objects or detail.
Audit the whole batch for concept diversity. If fingerprints repeat in subject, composition, metaphor, typography role, or text/graphic relationship, revise the weaker concept. Style changes do not count as concept diversity.
Keep every revision grounded in its original slogan and behavioral evidence. Do not introduce niche-template imagery.

Return this exact JSON shape:
{
  "strategies": [
    {
      "index": 0,
      "meaning": { "literalSubject": "", "impliedMeaning": "", "behavioralTruth": "", "emotionalPayoff": "", "visualizableAction": "", "strongestContrast": "" },
      "concept": {
        "coreMessage": "", "emotionalTone": [], "behavioralMoment": [], "visualMetaphors": [], "relevantObjects": [], "environmentalCues": [], "typographyPersonality": [], "compositionIntent": "", "focalHierarchy": [], "supportingGraphics": [], "avoidElements": [],
        "printStrategy": { "silhouetteStrength": "", "detailDensity": "", "contrastNeed": "", "viewingDistance": "" }
      },
      "composition": { "primaryFocus": "typography|illustration|hybrid", "hierarchy": [{ "element": "", "importance": 0 }], "textTreatment": "", "illustrationRelationship": "", "negativeSpaceStrategy": "", "silhouette": "", "balance": "" },
      "quality": { "thumbnailLegibility": 0, "focalClarity": 0, "silhouetteStrength": 0, "textGraphicIntegration": 0, "contrast": 0, "printability": 0, "visualOriginality": 0, "sloganReinforcement": 0 },
      "fingerprint": { "primarySubject": "", "compositionType": "", "metaphorType": "", "typographyRole": "", "graphicRelationship": "" }
    }
  ]
}`,
      },
    ],
    usageContext: input.userId ? { userId: input.userId, feature: "strategy.single" } : undefined,
  });

  const content = response.data?.choices[0]?.message?.content;
  let revisions: unknown[] = [];
  if (content) {
    try {
      const parsed = JSON.parse(content) as { strategies?: unknown[] };
      revisions = Array.isArray(parsed.strategies) ? parsed.strategies : [];
    } catch {
      revisions = [];
    }
  }

  return strategies.map((strategy, index) => {
    const revision = revisions.find((value) => value && typeof value === "object" && (value as Record<string, unknown>).index === index);
    const raw = revision && typeof revision === "object" ? revision as Record<string, unknown> : {};
    const meaning = normalizeMeaning(raw.meaning, strategy.meaning);
    const concept = normalizeConcept(raw.concept, strategy.concept);
    const composition = normalizeComposition(raw.composition, strategy.composition);
    const revised = { ...strategy, meaning, concept, composition, complexity: deriveVisualComplexityBudget(strategy.slogan, concept) };
    return {
      ...revised,
      quality: normalizeQuality(raw.quality),
      fingerprint: normalizeFingerprint(raw.fingerprint, fallbackFingerprint(revised)),
    };
  });
}

async function repairCollapsedStrategies(
  input: DynamicDesignBatchInput,
  strategies: EvaluatedStrategy[],
  repairIndexes: number[],
): Promise<EvaluatedStrategy[]> {
  if (repairIndexes.length === 0) return strategies;
  const repairSet = new Set(repairIndexes);
  const compactBatch = strategies.map((strategy, index) => ({
    index,
    slogan: strategy.slogan,
    primaryFocus: strategy.composition.primaryFocus,
    fingerprint: strategy.fingerprint,
    supportingGraphics: strategy.concept.supportingGraphics,
  }));
  const targets = strategies
    .map((strategy, index) => ({
      index,
      slogan: strategy.slogan,
      meaning: strategy.meaning,
      concept: strategy.concept,
      composition: strategy.composition,
      complexity: strategy.complexity,
    }))
    .filter((strategy) => repairSet.has(strategy.index));
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature: 0.65,
    max_tokens: 8000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a commercial apparel concept-diversity director. Return valid JSON only. Repair semantic repetition without using a menu of layout templates or changing the slogans.",
      },
      {
        role: "user",
        content: `Repair the collapsed visual strategies in this style-neutral t-shirt batch.

NICHE: ${input.niche}
BEHAVIORAL EVIDENCE: ${JSON.stringify(collectVisualEvidence(input.profile))}
CURRENT BATCH AUDIT: ${JSON.stringify(compactBatch)}
REPAIR TARGETS: ${JSON.stringify(targets)}

The target indexes failed one or more batch-level diversity gates. Revise only those indexes, using each slogan's own behavioral meaning to discover a different visual relationship.

The repaired FULL batch must satisfy:
- primary-focus diversity of at least ${VISUAL_RELEASE_THRESHOLDS.primaryFocusDiversity}
- at least ${Math.ceil(strategies.length * VISUAL_RELEASE_THRESHOLDS.compositionFamilyDiversity)} semantically distinct composition families
- at least ${Math.ceil(strategies.length * VISUAL_RELEASE_THRESHOLDS.visualMetaphorDiversity)} semantically distinct visual metaphors
- at least ${Math.ceil(strategies.length * VISUAL_RELEASE_THRESHOLDS.typographyRoleDiversity)} semantically distinct typography roles
- supporting-object overlap no higher than ${VISUAL_RELEASE_THRESHOLDS.supportingObjectOverlap}; an object may repeat only when its action or relationship is materially different
- no combined fingerprint should substantially duplicate an earlier strategy

These are diversity constraints, not a request to assign canned layouts. Derive each new composition from its slogan's meaning, rhythm, contrast, and visualizable action. Change the underlying relationship, silhouette, reading path, and typography function—not merely the fingerprint wording. Respect the existing complexity budget and do not add detail to manufacture novelty.

Return ONLY the repaired targets:
{
  "revisions": [
    {
      "index": 0,
      "concept": {
        "coreMessage": "", "emotionalTone": [], "behavioralMoment": [], "visualMetaphors": [], "relevantObjects": [], "environmentalCues": [], "typographyPersonality": [], "compositionIntent": "", "focalHierarchy": [], "supportingGraphics": [], "avoidElements": [],
        "printStrategy": { "silhouetteStrength": "", "detailDensity": "", "contrastNeed": "", "viewingDistance": "" }
      },
      "composition": { "primaryFocus": "typography|illustration|hybrid", "hierarchy": [{ "element": "", "importance": 0 }], "textTreatment": "", "illustrationRelationship": "", "negativeSpaceStrategy": "", "silhouette": "", "balance": "" },
      "fingerprint": { "primarySubject": "", "compositionType": "concise semantic family", "metaphorType": "", "typographyRole": "", "graphicRelationship": "" }
    }
  ]
}`,
      },
    ],
    usageContext: input.userId ? { userId: input.userId, feature: "strategy.single" } : undefined,
  });

  const content = response.data?.choices[0]?.message?.content;
  let revisions: unknown[] = [];
  if (content) {
    try {
      const parsed = JSON.parse(content) as { revisions?: unknown[] };
      revisions = Array.isArray(parsed.revisions) ? parsed.revisions : [];
    } catch {
      revisions = [];
    }
  }

  return strategies.map((strategy, index) => {
    if (!repairSet.has(index)) return strategy;
    const revision = revisions.find((value) => value && typeof value === "object" && (value as Record<string, unknown>).index === index);
    if (!revision || typeof revision !== "object") return strategy;
    const raw = revision as Record<string, unknown>;
    const concept = normalizeConcept(raw.concept, strategy.concept);
    const composition = normalizeComposition(raw.composition, strategy.composition);
    const revised = {
      ...strategy,
      concept,
      composition,
      complexity: deriveVisualComplexityBudget(strategy.slogan, concept),
    };
    return {
      ...revised,
      quality: strategy.quality,
      fingerprint: normalizeFingerprint(raw.fingerprint, fallbackFingerprint(revised)),
    };
  });
}

function normalizeQualityWithFallback(value: unknown, fallback: TshirtVisualQuality): TshirtVisualQuality {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    thumbnailLegibility: score(raw.thumbnailLegibility, fallback.thumbnailLegibility),
    focalClarity: score(raw.focalClarity, fallback.focalClarity),
    silhouetteStrength: score(raw.silhouetteStrength, fallback.silhouetteStrength),
    textGraphicIntegration: score(raw.textGraphicIntegration, fallback.textGraphicIntegration),
    contrast: score(raw.contrast, fallback.contrast),
    printability: score(raw.printability, fallback.printability),
    visualOriginality: score(raw.visualOriginality, fallback.visualOriginality),
    sloganReinforcement: score(raw.sloganReinforcement, fallback.sloganReinforcement),
  };
}

async function auditRepairedStrategyQuality(
  input: DynamicDesignBatchInput,
  strategies: EvaluatedStrategy[],
  repairedIndexes: number[],
): Promise<EvaluatedStrategy[]> {
  if (repairedIndexes.length === 0) return strategies;
  const repairedSet = new Set(repairedIndexes);
  const targets = strategies
    .map((strategy, index) => ({
      index,
      slogan: strategy.slogan,
      visualizableAction: strategy.meaning.visualizableAction,
      concept: strategy.concept,
      composition: strategy.composition,
      complexity: strategy.complexity,
    }))
    .filter((strategy) => repairedSet.has(strategy.index));
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature: 0.1,
    max_tokens: 2200,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a strict apparel prepress evaluator. Return valid JSON only. Score the supplied final concepts honestly; do not reward complexity or decorative detail.",
      },
      {
        role: "user",
        content: `Run a final quality audit on the strategies changed by diversity repair.

GARMENT: ${input.garmentBackground ?? "either"}
TARGETS: ${JSON.stringify(targets)}

Score 0-100 for thumbnail legibility, focal clarity, silhouette strength, text/graphic integration, contrast, printability, visual originality, and slogan reinforcement. A simple, bold, meaning-rich concept should outscore a busy concept. Complexity and object count earn no positive credit. Return only:
{
  "scores": [
    { "index": 0, "quality": { "thumbnailLegibility": 0, "focalClarity": 0, "silhouetteStrength": 0, "textGraphicIntegration": 0, "contrast": 0, "printability": 0, "visualOriginality": 0, "sloganReinforcement": 0 } }
  ]
}`,
      },
    ],
    usageContext: input.userId ? { userId: input.userId, feature: "strategy.single" } : undefined,
  });
  const content = response.data?.choices[0]?.message?.content;
  let scores: unknown[] = [];
  if (content) {
    try {
      const parsed = JSON.parse(content) as { scores?: unknown[] };
      scores = Array.isArray(parsed.scores) ? parsed.scores : [];
    } catch {
      scores = [];
    }
  }

  return strategies.map((strategy, index) => {
    if (!repairedSet.has(index)) return strategy;
    const result = scores.find((value) => value && typeof value === "object" && (value as Record<string, unknown>).index === index);
    const raw = result && typeof result === "object" ? result as Record<string, unknown> : {};
    return { ...strategy, quality: normalizeQualityWithFallback(raw.quality, strategy.quality) };
  });
}

function backgroundInstruction(input: DynamicDesignInput): string {
  if (input.printBackground === "transparent") {
    return "Transparent background; preserve clean isolated edges and do not simulate transparency with a checkerboard.";
  }
  const garment = input.garmentBackground === "dark" ? "dark" : input.garmentBackground === "light" ? "light" : "requested";
  return `Use a deliberate solid background suitable for the ${garment} garment context.`;
}

function marketplaceInstruction(marketplace: DynamicDesignInput["marketplace"]): string {
  if (marketplace === "amazon_merch") return "Optimize immediate readability and click-stopping contrast for an Amazon Merch thumbnail.";
  if (marketplace === "etsy") return "Keep the result giftable and intentional at an Etsy listing thumbnail without turning it into a poster scene.";
  return "Make the design versatile for a general commercial POD listing thumbnail.";
}

export function buildDynamicImagePrompt(
  input: DynamicDesignInput,
  meaning: SloganVisualMeaning,
  concept: DynamicVisualConcept,
  composition: CompositionPlan,
  complexity = deriveVisualComplexityBudget(input.slogan, concept),
): string {
  const hierarchy = composition.hierarchy.map((item) => `${item.element} (${item.importance})`).join(", ");
  const supporting = concept.supportingGraphics.length > 0 ? concept.supportingGraphics.join(", ") : "none beyond the meaning-bearing focal relationship";
  const avoid = [...concept.avoidElements, "generic clip-art composition", "random decorative objects", "unrelated filler graphics", "visual clutter", "tiny unreadable text", "generic stock-vector appearance", "brands, logos, copyrighted characters, or trademarks"];

  return `Create an original commercial POD t-shirt graphic.

EXACT TEXT:
"${input.slogan.replace(/"/g, '\\"')}"

NICHE CONTEXT:
${input.niche}

CREATIVE INTENT:
${concept.coreMessage}

BEHAVIORAL TRUTH:
${meaning.behavioralTruth}

VISUAL STORY:
${meaning.visualizableAction}

EMOTIONAL PAYOFF:
${meaning.emotionalPayoff}

ART DIRECTION:
${input.style}
Use this only as the rendering language; preserve the concept and hierarchy above.
Emotional tone: ${concept.emotionalTone.join(", ")}
Typography personality: ${concept.typographyPersonality.join(", ")}

COMPOSITION:
Primary focus: ${composition.primaryFocus}
Hierarchy: ${hierarchy}
Text treatment: ${composition.textTreatment}
Graphic/text relationship: ${composition.illustrationRelationship}
Silhouette: ${composition.silhouette}
Balance: ${composition.balance}
Negative space: ${composition.negativeSpaceStrategy}

COMPLEXITY BUDGET:
Text dominance: ${Math.round(complexity.textDominance * 100)}%
Illustration dominance: ${Math.round(complexity.illustrationDominance * 100)}%
Maximum primary subjects: ${complexity.maxPrimarySubjects}
Supporting detail: ${complexity.supportingDetailLevel}

SUPPORTING VISUAL EVIDENCE:
${supporting}
Use supporting elements selectively. Every graphic must reinforce this slogan's specific behavior, contradiction, ritual, status signal, or punchline.

T-SHIRT REQUIREMENTS:
- immediately readable chest-print composition
- strong visual hierarchy and one obvious focal destination
- recognizable isolated silhouette
- high contrast for a ${input.garmentBackground} garment background
- clean separation of major shapes and limited unnecessary micro-detail
- typography integrated with the illustration
- visually compelling at approximately 150–250 px
- isolated apparel artwork, not a rectangular poster or background scene
- no mockup, model, shirt, hanger, frame, or product photography
- reproduce the exact slogan once, correctly spelled and fully legible
- ${marketplaceInstruction(input.marketplace)}

AVOID:
${avoid.join(", ")}.

BACKGROUND:
${backgroundInstruction(input)}

Commercial-friendly original artwork. Deliver the highest-resolution print-ready composition supported by the image pipeline.`.trim();
}

/**
 * Render one already-approved semantic strategy in multiple styles without
 * invoking concept generation again. Every variant shares the same semantic
 * signature by construction; only ART DIRECTION changes.
 */
export function buildDynamicStyleVariants(
  input: Omit<DynamicDesignInput, "slogan" | "style">,
  strategy: Pick<DynamicDesignStrategy, "slogan" | "meaning" | "concept" | "composition" | "complexity" | "fingerprint">,
  styles: string[],
): DynamicStyleVariant[] {
  const semanticSignature = JSON.stringify({
    slogan: strategy.slogan,
    meaning: strategy.meaning,
    concept: strategy.concept,
    composition: strategy.composition,
    complexity: strategy.complexity,
    fingerprint: strategy.fingerprint,
  });
  const uniqueStyles = [...new Set(styles.map((style) => style.trim()).filter(Boolean))];

  return uniqueStyles.map((style) => ({
    style,
    semanticSignature,
    prompt: buildDynamicImagePrompt(
      { ...input, slogan: strategy.slogan, style },
      strategy.meaning,
      strategy.concept,
      strategy.composition,
      strategy.complexity,
    ),
  }));
}

export function isValidVisualStrategy(strategy: unknown): strategy is DynamicDesignStrategy {
  if (!strategy || typeof strategy !== "object") return false;
  const candidate = strategy as Partial<DynamicDesignStrategy>;
  const composition = candidate.composition;
  const concept = candidate.concept;
  const fingerprint = candidate.fingerprint;
  const quality = candidate.quality;
  const focusIsValid = composition?.primaryFocus === "typography" ||
    composition?.primaryFocus === "illustration" ||
    composition?.primaryFocus === "hybrid";
  const qualityValues = quality ? [
    quality.thumbnailLegibility,
    quality.focalClarity,
    quality.silhouetteStrength,
    quality.textGraphicIntegration,
    quality.contrast,
    quality.printability,
    quality.visualOriginality,
    quality.sloganReinforcement,
  ] : [];

  return Boolean(
    cleanString(candidate.slogan) &&
    focusIsValid &&
    cleanString(composition?.textTreatment) &&
    cleanString(composition?.illustrationRelationship) &&
    cleanString(composition?.silhouette) &&
    cleanString(concept?.coreMessage) &&
    Array.isArray(concept?.visualMetaphors) &&
    cleanString(fingerprint?.primarySubject) &&
    cleanString(fingerprint?.compositionType) &&
    cleanString(fingerprint?.metaphorType) &&
    cleanString(fingerprint?.typographyRole) &&
    cleanString(fingerprint?.graphicRelationship) &&
    qualityValues.length === 8 &&
    qualityValues.every((value) => typeof value === "number" && Number.isFinite(value)) &&
    typeof candidate.visualImpact === "number" && Number.isFinite(candidate.visualImpact),
  );
}

export function analyzeDynamicDesignBatch(candidates: readonly unknown[]): DesignBatchDiversityMetrics | null {
  const strategies = candidates.filter(isValidVisualStrategy);
  const count = strategies.length;
  if (count < MIN_VISUAL_BATCH_SIZE) return null;

  const pairSimilarities: number[] = [];
  const objectOverlaps: number[] = [];
  for (let left = 0; left < count; left += 1) {
    for (let right = left + 1; right < count; right += 1) {
      pairSimilarities.push(fingerprintSimilarity(strategies[left].fingerprint, strategies[right].fingerprint));
      objectOverlaps.push(arrayOverlap(
        [...strategies[left].concept.relevantObjects, ...strategies[left].concept.supportingGraphics],
        [...strategies[right].concept.relevantObjects, ...strategies[right].concept.supportingGraphics],
      ));
    }
  }

  const thumbnail = averageDefined(strategies.map((strategy) => strategy.quality.thumbnailLegibility));
  const printability = averageDefined(strategies.map((strategy) => strategy.quality.printability));
  const reinforcement = averageDefined(strategies.map((strategy) => strategy.quality.sloganReinforcement));
  const originality = averageDefined(strategies.map((strategy) => strategy.quality.visualOriginality));
  const focalClarity = averageDefined(strategies.map((strategy) => strategy.quality.focalClarity));
  const integration = averageDefined(strategies.map((strategy) => strategy.quality.textGraphicIntegration));
  if ([thumbnail, printability, reinforcement, originality, focalClarity, integration].some((value) => value === null)) {
    return null;
  }
  const pairCount = pairSimilarities.length;
  const collisions = pairSimilarities.filter((similarity) => similarity >= 0.65).length;
  const primaryFocusCount = new Set(strategies.map((strategy) => strategy.composition.primaryFocus)).size;

  return {
    sampleSize: count,
    designCount: count,
    primaryFocusDiversity: roundedRatio(primaryFocusCount / Math.min(3, count)),
    compositionFamilyDiversity: roundedRatio(semanticClusterCount(strategies.map(compositionDescriptor)) / count),
    visualMetaphorDiversity: roundedRatio(semanticClusterCount(strategies.map((strategy) => strategy.fingerprint.metaphorType)) / count),
    supportingObjectOverlap: roundedRatio(averageDefined(objectOverlaps) ?? 0),
    typographyRoleDiversity: roundedRatio(semanticClusterCount(strategies.map(typographyRoleDescriptor)) / count),
    fingerprintCollisionRate: roundedRatio(pairCount > 0 ? collisions / pairCount : 0),
    maxFingerprintSimilarity: roundedRatio(pairSimilarities.length > 0 ? Math.max(...pairSimilarities) : 0),
    averageThumbnailLegibility: Math.round(thumbnail!),
    averagePrintability: Math.round(printability!),
    averageSloganReinforcement: Math.round(reinforcement!),
    averageVisualOriginality: Math.round(originality!),
    averageVisualImpact: Math.round(averageDefined(strategies.map((strategy) => strategy.visualImpact))!),
    // Simplicity is not penalized. The three strongest commercial constraints
    // receive 75% of the score; novelty is deliberately capped at 5%.
    commercialQualityScore: Math.round(
      thumbnail! * 0.25 +
      printability! * 0.25 +
      reinforcement! * 0.25 +
      focalClarity! * 0.1 +
      integration! * 0.1 +
      originality! * 0.05,
    ),
    qualityGatePassRate: roundedRatio(strategies.filter((strategy) => strategy.qualityGatePassed).length / count),
    collapsedStrategyIndexes: findBatchCollapseRepairIndexes(strategies),
  };
}

export function createUnevaluatedVisualReleaseGate(sampleSize = 0): VisualReleaseGate {
  const hasNoStrategies = sampleSize === 0;
  return {
    status: hasNoStrategies ? "NOT_EVALUATED" : "INSUFFICIENT_SAMPLE",
    evaluated: false,
    passed: false,
    sampleSize,
    repairAttempts: 0,
    maxRepairAttempts: MAX_VISUAL_REPAIR_ATTEMPTS,
    unresolvedMetrics: [],
    warnings: [],
    thresholds: VISUAL_RELEASE_THRESHOLDS,
    reason: hasNoStrategies
      ? "Visual strategies have not been generated yet."
      : `At least ${MIN_VISUAL_BATCH_SIZE} valid visual strategies are required for batch-diversity analysis.`,
  };
}

export function evaluateVisualReleaseGate(
  metrics: DesignBatchDiversityMetrics,
  repairAttempts = 0,
  maxRepairAttempts = MAX_VISUAL_REPAIR_ATTEMPTS,
): VisualReleaseGate {
  const warnings: VisualReleaseWarning[] = [];
  const addMinimumWarning = (metric: Exclude<VisualReleaseMetric, "supportingObjectOverlap">) => {
    const actual = metrics[metric];
    const threshold = VISUAL_RELEASE_THRESHOLDS[metric];
    if (actual < threshold) warnings.push({ metric, actual, threshold, expectation: "minimum" });
  };

  addMinimumWarning("primaryFocusDiversity");
  addMinimumWarning("compositionFamilyDiversity");
  addMinimumWarning("visualMetaphorDiversity");
  addMinimumWarning("typographyRoleDiversity");
  addMinimumWarning("commercialQualityScore");
  if (metrics.supportingObjectOverlap > VISUAL_RELEASE_THRESHOLDS.supportingObjectOverlap) {
    warnings.push({
      metric: "supportingObjectOverlap",
      actual: metrics.supportingObjectOverlap,
      threshold: VISUAL_RELEASE_THRESHOLDS.supportingObjectOverlap,
      expectation: "maximum",
    });
  }

  return {
    status: warnings.length === 0 ? "PASS" : "REVIEW",
    evaluated: true,
    passed: warnings.length === 0,
    sampleSize: metrics.sampleSize,
    repairAttempts: Math.max(0, Math.min(maxRepairAttempts, Math.round(repairAttempts))),
    maxRepairAttempts,
    unresolvedMetrics: warnings.map((warning) => warning.metric),
    warnings,
    thresholds: VISUAL_RELEASE_THRESHOLDS,
    reason: warnings.length === 0
      ? "Visual batch passed the commercial quality and diversity release thresholds."
      : "Some concepts remain below the visual release thresholds.",
  };
}

export function evaluateVisualBatchRelease(candidates: readonly unknown[]): VisualBatchReleaseEvaluation {
  const validStrategies = candidates.filter(isValidVisualStrategy);
  if (validStrategies.length < MIN_VISUAL_BATCH_SIZE) {
    return {
      validStrategies,
      metrics: null,
      releaseGate: createUnevaluatedVisualReleaseGate(validStrategies.length),
    };
  }

  const metrics = analyzeDynamicDesignBatch(validStrategies);
  if (!metrics) {
    return {
      validStrategies,
      metrics: null,
      releaseGate: createUnevaluatedVisualReleaseGate(validStrategies.length),
    };
  }

  return {
    validStrategies,
    metrics,
    releaseGate: evaluateVisualReleaseGate(
      metrics,
      Math.max(0, ...validStrategies.map((strategy) => strategy.batchRepairAttempts ?? 0)),
    ),
  };
}

export async function generateDynamicDesignBatch(input: DynamicDesignBatchInput): Promise<DynamicDesignStrategy[]> {
  const slogans = input.slogans.map((slogan) => slogan.trim()).filter(Boolean).slice(0, 12);
  if (slogans.length === 0) return [];

  const normalizedInput: DynamicDesignBatchInput = {
    ...input,
    slogans,
    style: input.style?.trim() || "Bold Graphic",
    garmentBackground: input.garmentBackground ?? "either",
    printBackground: input.printBackground ?? "transparent",
    marketplace: input.marketplace ?? "general",
  };
  const unscored = await generateUnscoredStrategies(normalizedInput);
  let evaluated = await evaluateAndReviseStrategies(normalizedInput, unscored);
  const repairedIndexes = new Set<number>();
  let batchRepairAttempts = 0;
  for (let repairAttempt = 0; repairAttempt < MAX_VISUAL_REPAIR_ATTEMPTS; repairAttempt += 1) {
    const collapsed = findBatchCollapseRepairIndexes(evaluated);
    if (collapsed.length === 0) break;
    batchRepairAttempts += 1;
    collapsed.forEach((index) => repairedIndexes.add(index));
    evaluated = await repairCollapsedStrategies(normalizedInput, evaluated, collapsed);
  }
  if (repairedIndexes.size > 0) {
    evaluated = await auditRepairedStrategyQuality(normalizedInput, evaluated, [...repairedIndexes]);
  }
  const acceptedFingerprints: VisualFingerprint[] = [];

  return evaluated.map((strategy) => {
    const key = fingerprintKey(strategy.fingerprint);
    const exactDuplicates = acceptedFingerprints.filter((fingerprint) => fingerprintKey(fingerprint) === key).length;
    const strongestSimilarity = acceptedFingerprints.reduce(
      (highest, fingerprint) => Math.max(highest, fingerprintSimilarity(strategy.fingerprint, fingerprint)),
      0,
    );
    const similarityPenalty = strongestSimilarity >= 0.82 ? 18 : strongestSimilarity >= 0.65 ? 10 : 0;
    const diversityPenalty = Math.min(30, Math.max(exactDuplicates * 12, similarityPenalty));
    acceptedFingerprints.push(strategy.fingerprint);
    const quality = {
      ...strategy.quality,
      visualOriginality: Math.max(0, strategy.quality.visualOriginality - diversityPenalty),
    };
    const designInput: DynamicDesignInput = {
      niche: normalizedInput.niche,
      slogan: strategy.slogan,
      profile: normalizedInput.profile,
      style: normalizedInput.style!,
      garmentBackground: normalizedInput.garmentBackground!,
      printBackground: normalizedInput.printBackground!,
      marketplace: normalizedInput.marketplace,
    };

    return {
      ...strategy,
      quality,
      visualImpact: visualImpact(quality),
      diversityPenalty,
      qualityGatePassed: passesQualityGate(quality),
      batchRepairAttempts,
      prompt: buildDynamicImagePrompt(designInput, strategy.meaning, strategy.concept, strategy.composition, strategy.complexity),
    };
  });
}
