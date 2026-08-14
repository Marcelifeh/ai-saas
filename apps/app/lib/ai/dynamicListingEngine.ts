import "server-only";

import type { DynamicNicheProfile } from "./dynamicNicheProfile";
import type { DynamicDesignStrategy } from "./dynamicDesignPrompt";
import { chatCompletionSafe } from "./aiGateway";
import { checkCompliance } from "../services/complianceEngine";

export type ListingMarketplace = "amazon_merch" | "etsy" | "general";

export interface DynamicListingInput {
  niche: string;
  slogan: string;
  audience?: string;
  profile: DynamicNicheProfile;
  visualStrategy?: DynamicDesignStrategy;
  marketTerms?: string[];
  purchaseMotives?: string[];
  marketplace: ListingMarketplace;
  visualStyle?: string;
  configuredBrand?: string | null;
  userId?: string;
}

export interface ListingQualityMetrics {
  buyerIdentityAlignment: number;
  nicheSpecificity: number;
  behavioralRelevance: number;
  searchIntentCoverage: number;
  keywordNaturalness: number;
  giftIntent: number;
  repetitionScore: number;
  readability: number;
  complianceConfidence: number;
  listingQualityScore: number;
}

export interface ListingQualityGate {
  status: "PASS" | "REVIEW";
  passed: boolean;
  threshold: number;
  repairAttempts: number;
  maxRepairAttempts: number;
  warnings: string[];
}

export interface ListingBrandStrategy {
  source: "configured" | "generated_candidate" | "none";
  label: "Configured Brand" | "Generated Brand Candidate" | "No Brand Configured";
  verified: boolean;
  warning?: string;
}

export interface DynamicListingResult {
  title: string;
  brand: string | null;
  brandStrategy: ListingBrandStrategy;
  bullets: string[];
  description: string;
  searchTerms: string[];
  marketplace: ListingMarketplace;
  quality: ListingQualityMetrics;
  qualityGate: ListingQualityGate;
  compliance: {
    safe: boolean;
    confidence: number;
    riskLevel: string;
    warnings: string[];
  };
  engineVersion: string;
}

export interface ListingDraft {
  title: string;
  brandCandidate: string | null;
  bullets: string[];
  description: string;
  searchTerms: string[];
}

export const LISTING_ENGINE_VERSION = "dynamic-listing-v1";
export const LISTING_QUALITY_THRESHOLD = 70;
export const MAX_LISTING_REPAIR_ATTEMPTS = 1;

const GENERIC_PHRASES = [
  "unique design",
  "perfect for everyone",
  "stand out from the crowd",
  "adds a unique touch",
  "embrace the",
  "show off your",
  "resonate with your",
];

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is", "it", "of", "on", "or", "that", "the", "their", "this", "to", "with", "who", "your",
]);

function cleanString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.replace(/\s+/g, " ").trim() || fallback;
}

function cleanStringArray(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => cleanString(item)).filter(Boolean))].slice(0, limit);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^-+|-+$/g, ""))
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function overlapScore(copy: string, evidence: string[], baseline: number): number {
  const copyTokens = new Set(tokenize(copy));
  const evidenceTokens = [...new Set(evidence.flatMap(tokenize))];
  if (evidenceTokens.length === 0) return baseline;
  const matched = evidenceTokens.filter((token) => copyTokens.has(token)).length;
  return clamp(baseline + (matched / Math.min(evidenceTokens.length, 18)) * (100 - baseline));
}

function collectBehavioralEvidence(profile: DynamicNicheProfile): string[] {
  const lifestyle = profile.latentLifestyleModel;
  return cleanStringArray([
    ...(profile.rituals ?? []),
    ...(profile.microRituals ?? []),
    ...(lifestyle?.participationHabits ?? []),
    ...(lifestyle?.seasonalBehaviors ?? []),
    ...(lifestyle?.collectionHabits ?? []),
    ...(lifestyle?.privateRituals ?? []),
    ...(lifestyle?.involuntaryBehaviors ?? []),
    ...(lifestyle?.identitySignals ?? []),
    ...(profile.statusSignals ?? []),
  ], 18);
}

function collectIdentityEvidence(input: DynamicListingInput): string[] {
  return cleanStringArray([
    input.audience ?? "",
    input.profile.audience,
    ...(input.profile.dimensions ?? []),
    ...(input.profile.statusSignals ?? []),
    ...(input.profile.latentLifestyleModel?.identitySignals ?? []),
  ], 12);
}

function collectMarketTerms(input: DynamicListingInput): string[] {
  return cleanStringArray([
    ...(input.marketTerms ?? []),
    ...(input.profile.insiderLanguage ?? []),
    input.niche,
  ], 20);
}

function marketplaceDirections(marketplace: ListingMarketplace): string {
  if (marketplace === "amazon_merch") {
    return "Package for Amazon Merch: natural buyer-led title, two identity/purchase bullets, concise product description, and specific backend search phrases without repetition or keyword stuffing.";
  }
  if (marketplace === "etsy") {
    return "Package for Etsy: human search title, gift and occasion relevance only when supported, two concise buyer-facing bullets, a warm description, and specific discoverability tags.";
  }
  return "Package for a general POD storefront: clear buyer-led title, two useful bullets, concise description, and portable high-intent search phrases.";
}

function buildGenerationPrompt(input: DynamicListingInput, repairWarnings: string[] = []): string {
  const behavior = collectBehavioralEvidence(input.profile);
  const identities = collectIdentityEvidence(input);
  const marketTerms = collectMarketTerms(input);
  const purchaseMotives = cleanStringArray(input.purchaseMotives ?? input.profile.purchaseMotives, 10);
  const visualMeaning = input.visualStrategy?.meaning;
  const visualConcept = input.visualStrategy?.concept;

  return `Create marketplace listing copy for this exact winning product.

MARKETPLACE:
${input.marketplace}
${marketplaceDirections(input.marketplace)}

WINNING PRODUCT:
Niche: ${input.niche}
Exact slogan: ${input.slogan}
Audience evidence: ${identities.join(" | ") || "Use only the supplied niche/profile evidence"}
Purchase motives: ${purchaseMotives.join(" | ") || "identity recognition"}
Behavioral evidence: ${behavior.join(" | ")}
Market language evidence: ${marketTerms.join(" | ")}
Behavioral truth: ${visualMeaning?.behavioralTruth ?? "Infer from the exact slogan and profile"}
Implied meaning: ${visualMeaning?.impliedMeaning ?? "Infer from the exact slogan and profile"}
Visual concept: ${visualConcept?.coreMessage ?? "No visual strategy supplied"}
Visual story: ${visualMeaning?.visualizableAction ?? "No visual strategy supplied"}
Rendering style: ${input.visualStyle ?? "unspecified"} (rendering context only; never lead with this unless it materially helps a buyer distinguish the product)
Configured brand: ${cleanString(input.configuredBrand) || "NONE"}

QUALITY CONTRACT:
- Build the title around WHO BUYS and WHY: buyer identity, niche, purchase/occasion intent, then optional design style.
- Make each bullet specific: first recognition and identity; second genuine purchase, use, or gift relevance.
- Description sequence: recognition, emotional relevance, use occasion, then genuine gift relevance.
- Treat behavioral and market fields as evidence. Select only the smallest useful set; do not dump every phrase into the copy.
- Search terms must combine real market language, buyer intent, subculture identity, and occasion. Do not invent professions or buyer identities.
- Use gift language only when the supplied purchase motives explicitly support gifting. Otherwise omit gift framing entirely.
- The listing must describe THIS winner and reinforce its behavioral truth, not a generic shirt in the category.
- Do not quote or awkwardly repeat the slogan in every field.
- Do not keyword-stuff or repeat concepts.
- Never use: "unique design", "perfect for everyone", "stand out from the crowd", "adds a unique touch", "embrace the", "show off your", "resonate with your", or generic AI marketing filler.
- Do not use brands, copyrighted properties, unverifiable claims, materials, fit, shipping, or production promises.
- If no configured brand exists, a brandCandidate is only an unverified naming candidate. It must not be presented as cleared or seller-owned.
${repairWarnings.length > 0 ? `\nREPAIR THESE QUALITY FAILURES:\n- ${repairWarnings.join("\n- ")}` : ""}

Return valid JSON only:
{
  "title": "",
  "brandCandidate": null,
  "bullets": ["", ""],
  "description": "",
  "searchTerms": [""]
}`.trim();
}

function parseJsonPayload(text: string): unknown {
  return JSON.parse(text.replace(/```json/gi, "").replace(/```/g, "").trim());
}

function normalizeDraft(value: unknown, input: DynamicListingInput): ListingDraft {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const maxTerms = input.marketplace === "etsy" ? 13 : input.marketplace === "amazon_merch" ? 8 : 10;
  const title = cleanString(raw.title).slice(0, input.marketplace === "etsy" ? 140 : 200);
  const bullets = cleanStringArray(raw.bullets, 2);
  const description = cleanString(raw.description).slice(0, 1200);
  const searchTerms = cleanStringArray(raw.searchTerms, maxTerms);
  const candidate = cleanString(raw.brandCandidate);

  return {
    title,
    brandCandidate: candidate || null,
    bullets,
    description,
    searchTerms,
  };
}

function createEvidenceFallback(input: DynamicListingInput): ListingDraft {
  const identity = cleanString(input.audience) || cleanString(input.profile.audience) || cleanString(input.niche);
  const behavior = collectBehavioralEvidence(input.profile);
  const motives = cleanStringArray(input.purchaseMotives ?? input.profile.purchaseMotives, 4);
  const marketTerms = collectMarketTerms(input);
  const titleSubject = cleanString(input.niche).replace(/\b(fans|lovers|enthusiasts)\s+of\s+/gi, "").slice(0, 90);
  const firstBehavior = behavior[0] || input.slogan;
  const secondBehavior = behavior[1] || motives[0] || "everyday niche rituals";
  const genuineGift = motives.find((motive) => /gift|give|occasion|birthday|holiday/i.test(motive));

  return {
    title: `${titleSubject} Shirt for ${identity}`.replace(/\s+/g, " ").slice(0, 160),
    brandCandidate: null,
    bullets: [
      `For ${identity} who recognize ${firstBehavior.toLowerCase()}.`,
      genuineGift
        ? `A relevant gift for ${identity} inspired by ${secondBehavior.toLowerCase()}.`
        : `Built around ${secondBehavior.toLowerCase()} for everyday wear and niche occasions.`,
    ],
    description: `Made for ${identity} who recognize ${firstBehavior.toLowerCase()}. The message turns ${secondBehavior.toLowerCase()} into an easy-to-wear expression of the niche for everyday use and shared occasions.`,
    searchTerms: cleanStringArray(marketTerms, input.marketplace === "etsy" ? 13 : 8),
  };
}

async function requestDraft(input: DynamicListingInput, repairWarnings: string[] = []): Promise<ListingDraft | null> {
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature: repairWarnings.length > 0 ? 0.35 : 0.65,
    max_tokens: 1200,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a behavior-first POD listing strategist. Marketplace changes packaging, never product meaning. Return JSON only.",
      },
      { role: "user", content: buildGenerationPrompt(input, repairWarnings) },
    ],
    usageContext: input.userId ? { userId: input.userId, feature: "strategy.single" } : undefined,
  });

  if (response.error || !response.data) return null;
  try {
    return normalizeDraft(parseJsonPayload(response.data.choices[0].message.content || "{}"), input);
  } catch {
    return null;
  }
}

function calculateRepetitionScore(draft: ListingDraft): number {
  const fields = [draft.title, ...draft.bullets, draft.description, ...draft.searchTerms];
  const tokenCounts = new Map<string, number>();
  fields.forEach((field) => {
    new Set(tokenize(field)).forEach((token) => tokenCounts.set(token, (tokenCounts.get(token) ?? 0) + 1));
  });
  if (tokenCounts.size === 0) return 100;
  const overused = [...tokenCounts.values()].filter((count) => count >= 4).length;
  return clamp((overused / tokenCounts.size) * 100);
}

function genericPhraseWarnings(draft: ListingDraft): string[] {
  const copy = [draft.title, ...draft.bullets, draft.description].join(" ").toLowerCase();
  return GENERIC_PHRASES.filter((phrase) => copy.includes(phrase)).map((phrase) => `Remove generic phrase “${phrase}”.`);
}

export function evaluateListingQuality(
  input: DynamicListingInput,
  draft: ListingDraft,
  complianceConfidence: number,
): ListingQualityMetrics {
  const fullCopy = [draft.title, ...draft.bullets, draft.description, ...draft.searchTerms].join(" ");
  const identityEvidence = collectIdentityEvidence(input);
  const behaviorEvidence = collectBehavioralEvidence(input.profile);
  const marketEvidence = collectMarketTerms(input);
  const motiveEvidence = cleanStringArray(input.purchaseMotives ?? input.profile.purchaseMotives, 10);
  const repetitionScore = calculateRepetitionScore(draft);
  const genericCount = genericPhraseWarnings(draft).length;
  const longTerms = draft.searchTerms.filter((term) => tokenize(term).length > 5).length;
  const wordCount = tokenize([draft.title, ...draft.bullets, draft.description].join(" ")).length;
  const genuineGiftMotive = motiveEvidence.some((motive) => /gift|give|occasion|birthday|holiday/i.test(motive));
  const mentionsGift = /\bgift\b/i.test(fullCopy);

  const buyerIdentityAlignment = overlapScore(fullCopy, identityEvidence, 48);
  const nicheSpecificity = overlapScore(fullCopy, [input.niche, ...input.profile.dimensions, ...marketEvidence], 42);
  const behavioralRelevance = overlapScore(fullCopy, behaviorEvidence, 38);
  const searchIntentCoverage = overlapScore(draft.searchTerms.join(" "), marketEvidence, 45);
  const keywordNaturalness = clamp(96 - longTerms * 10 - repetitionScore * 0.55);
  const giftIntent = genuineGiftMotive ? (mentionsGift ? 92 : 64) : (mentionsGift ? 42 : 88);
  const readability = clamp(96 - genericCount * 12 - Math.max(0, draft.title.length - 150) * 0.2 - Math.max(0, wordCount - 190) * 0.25);

  const listingQualityScore = clamp(
    buyerIdentityAlignment * 0.18
    + nicheSpecificity * 0.17
    + behavioralRelevance * 0.18
    + searchIntentCoverage * 0.14
    + keywordNaturalness * 0.1
    + giftIntent * 0.08
    + readability * 0.08
    + complianceConfidence * 0.07
    - repetitionScore * 0.08,
  );

  return {
    buyerIdentityAlignment,
    nicheSpecificity,
    behavioralRelevance,
    searchIntentCoverage,
    keywordNaturalness,
    giftIntent,
    repetitionScore,
    readability,
    complianceConfidence: clamp(complianceConfidence),
    listingQualityScore,
  };
}

export function finalizeDynamicListing(input: DynamicListingInput, draft: ListingDraft, repairAttempts = 0): DynamicListingResult {
  const configuredBrand = cleanString(input.configuredBrand);
  const brand = configuredBrand || draft.brandCandidate;
  const brandStrategy: ListingBrandStrategy = configuredBrand
    ? {
        source: "configured",
        label: "Configured Brand",
        verified: false,
        warning: "Configured seller brand — confirm trademark ownership and marketplace eligibility before publishing.",
      }
    : brand
      ? {
          source: "generated_candidate",
          label: "Generated Brand Candidate",
          verified: false,
          warning: "Unverified brand candidate — run trademark and marketplace checks before use.",
        }
      : {
          source: "none",
          label: "No Brand Configured",
          verified: false,
          warning: "Configure your seller brand in Settings before publishing.",
        };

  const complianceReport = checkCompliance({
    niche: input.niche,
    slogan: input.slogan,
    title: draft.title,
    brandName: brand ?? undefined,
    description: draft.description,
    bullet_point_1: draft.bullets[0],
    bullet_point_2: draft.bullets[1],
    amazonListing: { title: draft.title, description: draft.description, bulletPoint1: draft.bullets[0], bulletPoint2: draft.bullets[1], keywords: draft.searchTerms },
  });
  const platformKey = input.marketplace === "amazon_merch" ? "amazon" : input.marketplace === "etsy" ? "etsy" : null;
  const platformApproved = platformKey ? complianceReport.platforms[platformKey].approved : complianceReport.safe;
  const complianceWarnings = [...new Set([
    ...complianceReport.violations.map((violation) => violation.reason),
    ...complianceReport.suggestions,
  ])];
  const complianceConfidence = complianceReport.safe && platformApproved
    ? clamp(100 - complianceWarnings.length * 7)
    : clamp(45 - complianceWarnings.length * 8);
  const quality = evaluateListingQuality(input, draft, complianceConfidence);
  const purchaseMotives = cleanStringArray(input.purchaseMotives ?? input.profile.purchaseMotives, 10);
  const supportsGift = purchaseMotives.some((motive) => /gift|give|occasion|birthday|holiday/i.test(motive));
  const listingCopy = [draft.title, ...draft.bullets, draft.description, ...draft.searchTerms].join(" ");
  const unsupportedGift = !supportsGift && /\bgift(?:s|ing)?\b/i.test(listingCopy);
  const visualStyle = cleanString(input.visualStyle).toLowerCase();
  const styleLedTitle = Boolean(visualStyle) && draft.title.toLowerCase().startsWith(visualStyle);
  const warnings = [
    ...genericPhraseWarnings(draft),
    ...(draft.bullets.length < 2 ? ["Provide two specific buyer-facing bullets."] : []),
    ...(draft.searchTerms.length < 4 ? ["Add more specific marketplace search intent."] : []),
    ...(quality.repetitionScore > 24 ? ["Reduce repeated concepts across listing fields."] : []),
    ...(unsupportedGift ? ["Remove gift language because the supplied purchase motives do not support gifting."] : []),
    ...(styleLedTitle ? ["Lead the title with buyer identity or niche intent, not the rendering style."] : []),
    ...(quality.listingQualityScore < LISTING_QUALITY_THRESHOLD ? [`Raise listing quality to ${LISTING_QUALITY_THRESHOLD} or higher.`] : []),
    ...(!complianceReport.safe || !platformApproved ? ["Resolve compliance warnings before publishing."] : []),
  ];
  const passed = warnings.length === 0;

  return {
    title: draft.title,
    brand,
    brandStrategy,
    bullets: draft.bullets,
    description: draft.description,
    searchTerms: draft.searchTerms,
    marketplace: input.marketplace,
    quality,
    qualityGate: {
      status: passed ? "PASS" : "REVIEW",
      passed,
      threshold: LISTING_QUALITY_THRESHOLD,
      repairAttempts,
      maxRepairAttempts: MAX_LISTING_REPAIR_ATTEMPTS,
      warnings,
    },
    compliance: {
      safe: complianceReport.safe && platformApproved,
      confidence: complianceConfidence,
      riskLevel: platformKey ? complianceReport.platforms[platformKey].riskLevel : complianceReport.riskLevel,
      warnings: complianceWarnings,
    },
    engineVersion: LISTING_ENGINE_VERSION,
  };
}

export async function generateDynamicListing(input: DynamicListingInput): Promise<DynamicListingResult> {
  const firstDraft = await requestDraft(input) ?? createEvidenceFallback(input);
  let result = finalizeDynamicListing(input, firstDraft, 0);

  if (!result.qualityGate.passed) {
    const repairedDraft = await requestDraft(input, result.qualityGate.warnings);
    if (repairedDraft) {
      const repaired = finalizeDynamicListing(input, repairedDraft, 1);
      if (
        (repaired.qualityGate.passed && !result.qualityGate.passed)
        || (repaired.compliance.safe && !result.compliance.safe)
        || repaired.quality.listingQualityScore >= result.quality.listingQualityScore
      ) {
        result = repaired;
      }
    }
  }

  return result;
}

export function toLegacyListingShape(listing: DynamicListingResult) {
  return {
    title: listing.title,
    brandName: listing.brand ?? "",
    brandStrategy: listing.brandStrategy,
    bulletPoint1: listing.bullets[0] ?? "",
    bulletPoint2: listing.bullets[1] ?? "",
    description: listing.description,
    keywords: listing.searchTerms,
    quality: listing.quality,
    qualityGate: listing.qualityGate,
    compliance: listing.compliance,
    marketplace: listing.marketplace,
    engineVersion: listing.engineVersion,
  };
}
