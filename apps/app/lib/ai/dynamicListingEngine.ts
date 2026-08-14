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
  rankedSearchTerms?: RankedSearchTerm[];
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
  bulletSeoQuality: number;
  keywordNaturalness: number;
  giftIntent: number;
  repetitionScore: number;
  readability: number;
  complianceConfidence: number;
  claimGrounding: number;
  listingQualityScore: number;
}

export type SearchTermUsage = "BACKEND_ONLY" | "CUSTOMER_COPY" | "BOTH";
export type SearchTermSource = "market" | "profile" | "derived";

export interface RankedSearchTerm {
  term: string;
  relevance: number;
  confidence: number;
  naturalLanguageFit: number;
  evidenceSupport: number;
  source: SearchTermSource;
  usage: SearchTermUsage;
}

export interface BulletSeoContext {
  rankedSearchTerms: RankedSearchTerm[];
  nicheEvidence: string[];
  buyerEvidence: string[];
  behavioralEvidence: string[];
}

export interface BulletKeywordMetrics {
  availableHighValueTerms: number;
  usedHighValueTerms: number;
  keywordCoverage: number;
  exactPhraseDuplicates: number;
  naturalnessScore: number;
  groundedKeywordCount: number;
  groundingScore: number;
  readabilityScore: number;
  bulletSeoQuality: number;
}

export interface ListingSeoAudit {
  titleCoverage: number;
  bulletCoverage: number;
  backendCoverage: number;
  buyerIntent: number;
  naturalness: number;
  duplicatePhraseRate: number;
  unsupportedTerms: number;
  overallScore: number;
  bulletKeywords: string[];
  rankedSearchTerms: RankedSearchTerm[];
  bulletMetrics: BulletKeywordMetrics;
}

export type ListingEvidenceSource = "niche" | "slogan" | "audience" | "behavior" | "market" | "purchase_motive" | "visual";

export interface ListingEvidenceItem {
  id: string;
  source: ListingEvidenceSource;
  text: string;
}

export interface EvaluatedListingClaim {
  claim: string;
  evidenceIds: string[];
  supported: boolean;
  supportScore: number;
  unsupportedTerms: string[];
  reason?: string;
}

export interface ListingClaimGrounding {
  score: number;
  attributionCoverage: number;
  evidenceCatalogSize: number;
  claims: EvaluatedListingClaim[];
  unsupportedClaims: EvaluatedListingClaim[];
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
  seoAudit: ListingSeoAudit;
  grounding: ListingClaimGrounding;
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

export const LISTING_ENGINE_VERSION = "dynamic-listing-v3";
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
  "a", "after", "amidst", "an", "and", "another", "are", "around", "as", "at", "be", "before", "by", "end", "even", "for", "from", "in", "into", "is", "it", "keep", "last", "long", "measure", "measured", "more", "of", "on", "one", "or", "over", "plan", "pre", "shape", "that", "the", "their", "this", "those", "to", "under", "when", "whether", "while", "who", "whose", "with", "you", "your",
]);

const LISTING_FUNCTION_WORDS = new Set([
  "acknowledge", "apparel", "appreciate", "artwork", "balanc", "balance", "built", "car", "care", "casual", "celebrat", "celebrate", "cherish", "clothing", "commercial", "commitment", "dedicat", "dedicate", "dedication", "design", "easy", "everyday", "express", "expression", "fellow", "find", "graphic", "great", "head", "humor", "humorous", "ideal", "importance", "inspir", "inspired", "joy", "know", "love", "made", "merch", "message", "nurtur", "nurture", "original", "perfect", "pod", "product", "recogniz", "recognize", "reflect", "relevant", "shirt", "shirts", "slipp", "speak", "tee", "tees", "testament", "thoughtful", "t-shirt", "understand", "unique", "way", "wear", "wearing", "worn",
]);

const MATERIAL_CLAIM_TERMS = new Set([
  "activity", "birthday", "bookstore", "class", "club", "competition", "conference", "costume", "event", "expo", "festival", "goal", "holiday", "library", "market", "meetup", "office", "party", "profession", "school", "space", "store", "studio", "tournament", "trip", "venue", "workplace", "workshop",
]);

function cleanString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.replace(/\s+/g, " ").trim() || fallback;
}

function cleanStringArray(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .map((item) => cleanString(item))
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clampUnit(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^-+|-+$/g, ""))
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function normalizeToken(token: string): string {
  const aliases: Record<string, string> = {
    candlelit: "candlelight",
    choices: "choice",
    dawn: "sunrise",
    bed: "sleep",
    page: "chapter",
    novel: "book",
    novels: "book",
    nightly: "night",
    routine: "ritual",
  };
  if (aliases[token]) return aliases[token];
  if (token.length > 5 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 5 && token.endsWith("ves")) return `${token.slice(0, -3)}f`;
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  if (token.length > 4 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 4 && token.endsWith("es") && !token.endsWith("ses")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

function materialTokens(value: string): string[] {
  return [...new Set(tokenize(value).map(normalizeToken).filter((token) => !STOP_WORDS.has(token) && !LISTING_FUNCTION_WORDS.has(token)))];
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
    ...(profile.contradictions ?? []),
    ...(profile.frustrations ?? []),
    ...(profile.embarrassingTruths ?? []),
    ...(profile.obsessions ?? []),
    ...(profile.visualCulture ?? []),
    ...(lifestyle?.comfortObjects ?? []),
    ...(lifestyle?.environments ?? []),
    ...(lifestyle?.recurringObjects ?? []),
    ...(lifestyle?.tensions ?? []),
    ...(lifestyle?.repeatedDecisions ?? []),
    ...(lifestyle?.tinyFrustrations ?? []),
    ...(lifestyle?.smallVictories ?? []),
    ...(lifestyle?.unspokenRules ?? []),
    ...(lifestyle?.emotionalRewards ?? []),
  ], 40);
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

export function rankListingSearchTerms(input: DynamicListingInput): RankedSearchTerm[] {
  const explicitTerms = cleanStringArray(input.marketTerms, 40);
  const profileTerms = cleanStringArray(input.profile.insiderLanguage, 20);
  const derivedTerms = cleanStringArray([
    input.niche,
    ...(input.profile.dimensions ?? []),
    ...collectIdentityEvidence(input),
  ], 20);
  const supplied = new Map(
    (input.rankedSearchTerms ?? [])
      .filter((entry) => cleanString(entry?.term))
      .map((entry) => [cleanString(entry.term).toLowerCase(), entry]),
  );
  const candidates = new Map<string, { term: string; source: SearchTermSource }>();
  const add = (terms: string[], source: SearchTermSource) => terms.forEach((term) => {
    const key = term.toLowerCase();
    if (!candidates.has(key)) candidates.set(key, { term, source });
  });
  add(explicitTerms, "market");
  add(profileTerms, "profile");
  add(derivedTerms, "derived");
  for (const entry of input.rankedSearchTerms ?? []) {
    const term = cleanString(entry?.term);
    if (term && !candidates.has(term.toLowerCase())) candidates.set(term.toLowerCase(), { term, source: entry.source });
  }

  const productCatalog = buildListingEvidenceCatalog(input).filter((item) => item.source !== "market");
  const productTokens = new Set(productCatalog.flatMap((item) => materialTokens(item.text)));

  return [...candidates.values()].map(({ term, source }) => {
    const tokens = materialTokens(term);
    const supportedTokens = tokens.filter((token) => productTokens.has(token)).length;
    const evidenceSupport = tokens.length > 0 ? supportedTokens / tokens.length : 0;
    const wordCount = tokenize(term).length;
    const unsupportedMaterialTerms = tokens.filter((token) => MATERIAL_CLAIM_TERMS.has(token) && !productTokens.has(token));
    const phraseShape = wordCount >= 2 && wordCount <= 6 ? 0.94 : wordCount === 1 || wordCount === 7 ? 0.72 : 0.52;
    const naturalLanguageFit = clampUnit(phraseShape - unsupportedMaterialTerms.length * 0.25);
    const existing = supplied.get(term.toLowerCase());
    const inferredRelevance = clampUnit((source === "market" ? 0.66 : source === "profile" ? 0.60 : 0.56) + evidenceSupport * 0.34);
    const inferredConfidence = clampUnit((source === "market" ? 0.68 : source === "profile" ? 0.64 : 0.60) + evidenceSupport * 0.32);
    const relevance = existing ? clampUnit(existing.relevance * 0.7 + inferredRelevance * 0.3) : inferredRelevance;
    const confidence = existing ? clampUnit(existing.confidence * 0.7 + inferredConfidence * 0.3) : inferredConfidence;
    const customerCopyEligible = relevance >= 0.7
      && confidence >= 0.65
      && naturalLanguageFit >= 0.7
      && evidenceSupport >= 0.7;
    const usage: SearchTermUsage = customerCopyEligible
      ? (source === "market" ? "BOTH" : "CUSTOMER_COPY")
      : "BACKEND_ONLY";
    return {
      term,
      source,
      relevance,
      confidence,
      naturalLanguageFit,
      evidenceSupport,
      usage,
    };
  }).sort((a, b) =>
    (b.relevance * b.confidence * b.naturalLanguageFit)
    - (a.relevance * a.confidence * a.naturalLanguageFit),
  );
}

export function buildBulletSeoContext(input: DynamicListingInput): BulletSeoContext {
  return {
    rankedSearchTerms: rankListingSearchTerms(input),
    nicheEvidence: cleanStringArray([input.niche, ...(input.profile.dimensions ?? [])], 12),
    buyerEvidence: collectIdentityEvidence(input),
    behavioralEvidence: collectBehavioralEvidence(input.profile),
  };
}

export function selectBulletKeywords(context: BulletSeoContext, maxTerms = 6): string[] {
  const eligible = context.rankedSearchTerms
    .filter((entry) => entry.usage !== "BACKEND_ONLY")
    .filter((entry) => entry.relevance >= 0.7 && entry.confidence >= 0.65)
    .filter((entry) => entry.naturalLanguageFit >= 0.7 && entry.evidenceSupport >= 0.7);
  const validatedSearchLanguage = eligible.filter((entry) => entry.source !== "derived");
  const selectedPool = validatedSearchLanguage.length >= 2 ? validatedSearchLanguage : eligible;
  return selectedPool
    .slice(0, maxTerms)
    .map((entry) => entry.term);
}

function exactPhraseCount(copy: string, phrase: string): number {
  const haystack = copy.toLowerCase();
  const needle = phrase.toLowerCase();
  if (!needle) return 0;
  let count = 0;
  let offset = 0;
  while ((offset = haystack.indexOf(needle, offset)) >= 0) {
    count += 1;
    offset += needle.length;
  }
  return count;
}

export function evaluateBulletKeywordMetrics(
  draft: ListingDraft,
  bulletKeywords: string[],
  groundingScore: number,
): BulletKeywordMetrics {
  const bulletCopy = draft.bullets.join(" ");
  const usedTerms = bulletKeywords.filter((term) => exactPhraseCount(bulletCopy, term) > 0);
  const exactPhraseDuplicates = bulletKeywords.filter((term) => draft.bullets.filter((bullet) => exactPhraseCount(bullet, term) > 0).length > 1).length;
  const keywordCoverage = bulletKeywords.length > 0 ? clamp((usedTerms.length / bulletKeywords.length) * 100) : 100;
  const totalWords = Math.max(1, tokenize(bulletCopy).length);
  const keywordWords = usedTerms.reduce((sum, term) => sum + tokenize(term).length, 0);
  const keywordDensity = keywordWords / totalWords;
  const genericLeadCount = draft.bullets.filter((bullet) => /^(?:ideal|great|perfect)\s+for\b/i.test(bullet)).length;
  const naturalnessScore = clamp(100 - Math.max(0, keywordDensity - 0.38) * 180 - exactPhraseDuplicates * 24 - genericLeadCount * 14);
  const readabilityScore = clamp(100 - draft.bullets.reduce((penalty, bullet) => {
    const words = tokenize(bullet).length;
    return penalty + Math.max(0, words - 48) * 1.5 + (words < 8 ? 12 : 0);
  }, 0));
  const groundedKeywordCount = usedTerms.length;
  const bulletSeoQuality = clamp(
    keywordCoverage * 0.35
    + naturalnessScore * 0.30
    + groundingScore * 0.25
    + readabilityScore * 0.10,
  );
  return {
    availableHighValueTerms: bulletKeywords.length,
    usedHighValueTerms: usedTerms.length,
    keywordCoverage,
    exactPhraseDuplicates,
    naturalnessScore,
    groundedKeywordCount,
    groundingScore: clamp(groundingScore),
    readabilityScore,
    bulletSeoQuality,
  };
}

export function buildListingEvidenceCatalog(input: DynamicListingInput): ListingEvidenceItem[] {
  const items: ListingEvidenceItem[] = [];
  const seen = new Set<string>();
  const add = (prefix: string, source: ListingEvidenceSource, values: string[]) => {
    let index = 0;
    for (const value of values) {
      const text = cleanString(value);
      const key = text.toLowerCase();
      if (!text || seen.has(key)) continue;
      seen.add(key);
      index += 1;
      items.push({ id: `${prefix}${index}`, source, text });
    }
  };

  add("N", "niche", [input.niche]);
  add("S", "slogan", [input.slogan]);
  add("A", "audience", collectIdentityEvidence(input));
  add("B", "behavior", collectBehavioralEvidence(input.profile));
  add("M", "market", collectMarketTerms(input));
  add("P", "purchase_motive", cleanStringArray(input.purchaseMotives ?? input.profile.purchaseMotives, 10));
  add("V", "visual", cleanStringArray([
    input.visualStrategy?.meaning.behavioralTruth ?? "",
    input.visualStrategy?.meaning.impliedMeaning ?? "",
    input.visualStrategy?.meaning.visualizableAction ?? "",
    input.visualStrategy?.concept.coreMessage ?? "",
    ...(input.visualStrategy?.concept.behavioralMoment ?? []),
  ], 10));
  return items;
}

function listingClaimFragments(draft: ListingDraft): string[] {
  const descriptionClaims = draft.description
    .split(/(?<=[.!?])\s+/)
    .map((claim) => cleanString(claim))
    .filter(Boolean);
  return [...new Set([
    cleanString(draft.title),
    ...draft.bullets.map((claim) => cleanString(claim)),
    ...descriptionClaims,
    ...draft.searchTerms.map((claim) => cleanString(claim)),
  ].filter(Boolean))];
}

function claimMatchScore(left: string, right: string): number {
  const leftTokens = new Set(materialTokens(left));
  const rightTokens = new Set(materialTokens(right));
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return intersection / Math.max(1, union);
}

function bestEvidenceIdsForClaim(claim: string, catalog: ListingEvidenceItem[], limit = 12): string[] {
  const uncovered = new Set(materialTokens(claim));
  const available = catalog.map((evidence) => ({ evidence, tokens: new Set(materialTokens(evidence.text)) }));
  const selected: string[] = [];
  while (selected.length < limit && uncovered.size > 0) {
    const best = available
      .filter((entry) => !selected.includes(entry.evidence.id))
      .map((entry) => ({
        ...entry,
        coverage: [...uncovered].filter((token) => entry.tokens.has(token)).length,
        score: claimMatchScore(claim, entry.evidence.text),
      }))
      .filter((entry) => entry.coverage > 0)
      .sort((a, b) => b.coverage - a.coverage || b.score - a.score)[0];
    if (!best) break;
    selected.push(best.evidence.id);
    best.tokens.forEach((token) => uncovered.delete(token));
  }
  return selected;
}

export function evaluateClaimGrounding(input: DynamicListingInput, draft: ListingDraft): ListingClaimGrounding {
  const catalog = buildListingEvidenceCatalog(input);
  const catalogById = new Map(catalog.map((item) => [item.id, item]));
  const fragments = listingClaimFragments(draft);
  const catalogTokens = new Set(catalog.flatMap((item) => materialTokens(item.text)));
  const nonMarketTokens = new Set(catalog.filter((item) => item.source !== "market").flatMap((item) => materialTokens(item.text)));

  const claims = fragments.map<EvaluatedListingClaim>((claim) => {
    const supportingEvidence = bestEvidenceIdsForClaim(claim, catalog, 8)
      .map((id) => catalogById.get(id))
      .filter((item): item is ListingEvidenceItem => Boolean(item));
    const claimTokens = materialTokens(claim);
    const novelTerms = claimTokens.filter((token) => !catalogTokens.has(token));
    const unsupportedTerms = claimTokens.filter((token) =>
      (MATERIAL_CLAIM_TERMS.has(token) || /(?:ologist|ographer|maker)$/.test(token))
      && !nonMarketTokens.has(token),
    );
    if (
      !nonMarketTokens.has("challenge")
      && /\b(?:community|fitness|group|workout)\s+challenges?\b/i.test(claim)
    ) {
      unsupportedTerms.push("challenge");
    }
    if (!nonMarketTokens.has("choice") && /\bcostume\s+choices?\b/i.test(claim)) {
      unsupportedTerms.push("choice");
    }
    const supportScore = claimTokens.length === 0
      ? (supportingEvidence.length > 0 ? 100 : 0)
      : clamp(((claimTokens.length - novelTerms.length) / claimTokens.length) * 100);
    const supported = supportingEvidence.length > 0 && unsupportedTerms.length === 0;
    return {
      claim,
      evidenceIds: supportingEvidence.map((item) => item.id),
      supported,
      supportScore,
      unsupportedTerms,
      reason: supportingEvidence.length === 0
        ? "No supporting profile, market, slogan, purchase, or visual evidence was found."
        : unsupportedTerms.length > 0
          ? `Unsupported material terms: ${unsupportedTerms.join(", ")}`
          : undefined,
    };
  });

  const mappedClaims = claims.filter((claim) => claim.evidenceIds.length > 0).length;
  const supportedClaims = claims.filter((claim) => claim.supported).length;
  return {
    score: claims.length > 0 ? clamp((supportedClaims / claims.length) * 100) : 0,
    attributionCoverage: claims.length > 0 ? clamp((mappedClaims / claims.length) * 100) : 0,
    evidenceCatalogSize: catalog.length,
    claims,
    unsupportedClaims: claims.filter((claim) => !claim.supported),
  };
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
  const evidenceCatalog = buildListingEvidenceCatalog(input);
  const bulletSeoContext = buildBulletSeoContext(input);
  const bulletKeywords = selectBulletKeywords(bulletSeoContext);

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

EVIDENCE CATALOG:
${evidenceCatalog.map((item) => `[${item.id}] [${item.source}] ${item.text}`).join("\n")}

RANKED SEARCH LANGUAGE:
${bulletSeoContext.rankedSearchTerms.map((entry) => `${entry.term} | relevance ${entry.relevance.toFixed(2)} | confidence ${entry.confidence.toFixed(2)} | natural-fit ${entry.naturalLanguageFit.toFixed(2)} | evidence ${entry.evidenceSupport.toFixed(2)} | ${entry.usage}`).join("\n") || "No ranked search terms supplied"}

BULLET SEO CONTEXT:
Customer-copy terms: ${bulletKeywords.join(" | ") || "No term cleared the customer-copy evidence threshold"}
- Write exactly two marketplace bullet points.
- Integrate the supplied customer-copy terms naturally, prioritizing higher-ranked phrases.
- Preserve the exact wording of each selected phrase so coverage is auditable; connect phrases with natural prose rather than paraphrasing them away.
- When four or more customer-copy terms are available, naturally use at least three across the two bullets; otherwise use every term that fits without stuffing.
- Do not use BACKEND_ONLY phrases in title, bullets, or description.
- Do not simply list keywords or repeat the same exact search phrase across both bullets.
- Each bullet must communicate a different buyer or behavioral angle supported by the evidence catalog.
- Preserve readability and purchase intent; fewer natural phrases are better than keyword stuffing.

QUALITY CONTRACT:
- Build the title around WHO BUYS and WHY: buyer identity, niche, purchase/occasion intent, then optional design style.
- Make each bullet specific and distinct; determine its angle dynamically from buyer, behavioral, slogan, and purchase evidence.
- Description sequence: recognition, emotional relevance, use occasion, then genuine gift relevance.
- Treat behavioral and market fields as evidence. Select only the smallest useful set; do not dump every phrase into the copy.
- Every material buyer identity, behavior, object, environment, event, profession, use occasion, and search phrase must be supported by one or more IDs from the evidence catalog.
- Do not invent plausible events or contexts such as expos, community events, challenges, costume activities, workplaces, or venues unless an evidence item explicitly supports them.
- If a phrase cannot be grounded, remove it from the listing instead of describing it as plausible.
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

function cleanBannedFiller(value: string): string {
  return value
    .replace(/\bembrace the\b/gi, (match) => match[0] === "E" ? "Recognize the" : "recognize the")
    .replace(/\bshow off your\b/gi, (match) => match[0] === "S" ? "Express your" : "express your")
    .replace(/\bresonate with your\b/gi, (match) => match[0] === "R" ? "Reflect your" : "reflect your")
    .replace(/\bstand out from the crowd\b/gi, "express the niche identity")
    .replace(/\badds a unique touch\b/gi, "supports the message")
    .replace(/\bunique design\b/gi, "design")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanRepairedDraft(draft: ListingDraft): ListingDraft {
  return {
    ...draft,
    title: cleanBannedFiller(draft.title),
    bullets: draft.bullets.map(cleanBannedFiller),
    description: cleanBannedFiller(draft.description),
    searchTerms: draft.searchTerms.map(cleanBannedFiller),
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

  const draft: ListingDraft = {
    title: `${titleSubject} Shirt for ${identity}`.replace(/\s+/g, " ").slice(0, 160),
    brandCandidate: null,
    bullets: [
      `For ${identity} who recognize ${firstBehavior.toLowerCase()}.`,
      genuineGift
        ? `A relevant gift for ${identity} inspired by ${secondBehavior.toLowerCase()}.`
        : `Built around ${secondBehavior.toLowerCase()} for everyday wear.`,
    ],
    description: `Made for ${identity} who recognize ${firstBehavior.toLowerCase()}. The message turns ${secondBehavior.toLowerCase()} into an easy-to-wear expression of the niche.`,
    searchTerms: cleanStringArray(marketTerms, input.marketplace === "etsy" ? 13 : 8),
  };
  return draft;
}

function removeUnsupportedFragments(input: DynamicListingInput, draft: ListingDraft): ListingDraft {
  const fallback = createEvidenceFallback(input);
  const unsupported = new Set(evaluateClaimGrounding(input, draft).unsupportedClaims.map((claim) => claim.claim));
  const descriptionSentences = draft.description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => cleanString(sentence))
    .filter((sentence) => sentence && !unsupported.has(sentence));
  const bullets = draft.bullets.filter((bullet) => !unsupported.has(bullet));
  const searchTerms = draft.searchTerms.filter((term) => !unsupported.has(term));
  const title = unsupported.has(draft.title) ? fallback.title : draft.title;

  return normalizeDraft({
    ...draft,
    title,
    bullets: [...bullets, ...fallback.bullets].slice(0, 2),
    description: descriptionSentences.join(" ") || fallback.description,
    searchTerms: [...searchTerms, ...fallback.searchTerms],
  }, input);
}

function removeUnsupportedGiftClaims(input: DynamicListingInput, draft: ListingDraft): ListingDraft {
  const fallback = createEvidenceFallback(input);
  const containsGift = (value: string) => /\bgift(?:s|ing)?\b/i.test(value);
  const description = draft.description
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !containsGift(sentence))
    .join(" ");
  return normalizeDraft({
    ...draft,
    title: containsGift(draft.title) ? fallback.title : draft.title,
    bullets: [...draft.bullets.filter((bullet) => !containsGift(bullet)), ...fallback.bullets].slice(0, 2),
    description: description || fallback.description,
    searchTerms: [...draft.searchTerms.filter((term) => !containsGift(term)), ...fallback.searchTerms],
  }, input);
}

function sanitizeRepairedDraft(input: DynamicListingInput, draft: ListingDraft, warnings: string[]): ListingDraft {
  let sanitized = cleanRepairedDraft(draft);
  const supportsGift = cleanStringArray(input.purchaseMotives ?? input.profile.purchaseMotives, 10)
    .some((motive) => /gift|give|occasion|birthday|holiday/i.test(motive));
  const introducedUnsupportedGift = !supportsGift
    && /\bgift(?:s|ing)?\b/i.test([sanitized.title, ...sanitized.bullets, sanitized.description, ...sanitized.searchTerms].join(" "));
  if (introducedUnsupportedGift || warnings.some((warning) => /gift language/i.test(warning))) {
    sanitized = removeUnsupportedGiftClaims(input, sanitized);
  }
  sanitized = removeUnsupportedFragments(input, sanitized);
  return sanitized;
}

async function requestDraft(input: DynamicListingInput, repairWarnings: string[] = []): Promise<ListingDraft | null> {
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature: repairWarnings.length > 0 ? 0.35 : 0.65,
    max_tokens: 1400,
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
    const draft = normalizeDraft(parseJsonPayload(response.data.choices[0].message.content || "{}"), input);
    return repairWarnings.length > 0 ? sanitizeRepairedDraft(input, draft, repairWarnings) : draft;
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
  claimGrounding = 100,
  suppliedBulletMetrics?: BulletKeywordMetrics,
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
  const bulletKeywords = selectBulletKeywords(buildBulletSeoContext(input));
  const bulletMetrics = suppliedBulletMetrics ?? evaluateBulletKeywordMetrics(draft, bulletKeywords, claimGrounding);

  const buyerIdentityAlignment = overlapScore(fullCopy, identityEvidence, 48);
  const nicheSpecificity = overlapScore(fullCopy, [input.niche, ...input.profile.dimensions, ...marketEvidence], 42);
  const behavioralRelevance = overlapScore(fullCopy, behaviorEvidence, 38);
  const searchIntentCoverage = overlapScore(draft.searchTerms.join(" "), marketEvidence, 45);
  const keywordNaturalness = clamp(96 - longTerms * 10 - repetitionScore * 0.55);
  const giftIntent = genuineGiftMotive ? (mentionsGift ? 92 : 64) : (mentionsGift ? 42 : 88);
  const readability = clamp(96 - genericCount * 12 - Math.max(0, draft.title.length - 150) * 0.2 - Math.max(0, wordCount - 190) * 0.25);

  const listingQualityScore = clamp(
    buyerIdentityAlignment * 0.15
    + nicheSpecificity * 0.13
    + behavioralRelevance * 0.14
    + searchIntentCoverage * 0.08
    + bulletMetrics.bulletSeoQuality * 0.10
    + keywordNaturalness * 0.08
    + giftIntent * 0.06
    + readability * 0.06
    + complianceConfidence * 0.05
    + claimGrounding * 0.15
    - repetitionScore * 0.08,
  );

  return {
    buyerIdentityAlignment,
    nicheSpecificity,
    behavioralRelevance,
    searchIntentCoverage,
    bulletSeoQuality: bulletMetrics.bulletSeoQuality,
    keywordNaturalness,
    giftIntent,
    repetitionScore,
    readability,
    complianceConfidence: clamp(complianceConfidence),
    claimGrounding: clamp(claimGrounding),
    listingQualityScore,
  };
}

function evaluateListingSeoAudit(
  input: DynamicListingInput,
  draft: ListingDraft,
  quality: ListingQualityMetrics,
  grounding: ListingClaimGrounding,
  bulletMetrics: BulletKeywordMetrics,
): ListingSeoAudit {
  const rankedSearchTerms = rankListingSearchTerms(input);
  const bulletKeywords = selectBulletKeywords({
    rankedSearchTerms,
    nicheEvidence: cleanStringArray([input.niche, ...(input.profile.dimensions ?? [])], 12),
    buyerEvidence: collectIdentityEvidence(input),
    behavioralEvidence: collectBehavioralEvidence(input.profile),
  });
  const titleTerms = bulletKeywords.slice(0, 4);
  const titleCoverage = titleTerms.length > 0
    ? clamp((titleTerms.filter((term) => exactPhraseCount(draft.title, term) > 0).length / titleTerms.length) * 100)
    : 100;
  const backendCandidates = rankedSearchTerms
    .filter((entry) => entry.relevance >= 0.7 && entry.confidence >= 0.65)
    .slice(0, input.marketplace === "etsy" ? 13 : 8);
  const backendCopy = draft.searchTerms.join(" | ");
  const backendCoverage = backendCandidates.length > 0
    ? clamp((backendCandidates.filter((entry) => exactPhraseCount(backendCopy, entry.term) > 0).length / backendCandidates.length) * 100)
    : 100;
  const fields = [draft.title, ...draft.bullets, draft.description, ...draft.searchTerms];
  const phraseOccurrences = rankedSearchTerms.slice(0, 12).map((entry) =>
    fields.reduce((count, field) => count + exactPhraseCount(field, entry.term), 0),
  );
  const allOccurrences = phraseOccurrences.reduce((sum, count) => sum + count, 0);
  const repeatedOccurrences = phraseOccurrences.reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const duplicatePhraseRate = allOccurrences > 0 ? clamp((repeatedOccurrences / allOccurrences) * 100) : 0;
  const unsupportedTerms = new Set(grounding.unsupportedClaims.flatMap((claim) => claim.unsupportedTerms)).size;
  const naturalness = clamp((quality.keywordNaturalness + bulletMetrics.naturalnessScore) / 2);
  const overallScore = clamp(
    titleCoverage * 0.15
    + bulletMetrics.keywordCoverage * 0.30
    + backendCoverage * 0.25
    + quality.buyerIdentityAlignment * 0.15
    + naturalness * 0.15
    - duplicatePhraseRate * 0.10
    - unsupportedTerms * 8,
  );
  return {
    titleCoverage,
    bulletCoverage: bulletMetrics.keywordCoverage,
    backendCoverage,
    buyerIntent: quality.buyerIdentityAlignment,
    naturalness,
    duplicatePhraseRate,
    unsupportedTerms,
    overallScore,
    bulletKeywords,
    rankedSearchTerms,
    bulletMetrics,
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
  const grounding = evaluateClaimGrounding(input, draft);
  const bulletClaims = grounding.claims.filter((claim) => draft.bullets.includes(claim.claim));
  const bulletGrounding = bulletClaims.length > 0
    ? clamp((bulletClaims.filter((claim) => claim.supported).length / bulletClaims.length) * 100)
    : 0;
  const bulletKeywords = selectBulletKeywords(buildBulletSeoContext(input));
  const bulletMetrics = evaluateBulletKeywordMetrics(draft, bulletKeywords, bulletGrounding);
  const quality = evaluateListingQuality(input, draft, complianceConfidence, grounding.score, bulletMetrics);
  const seoAudit = evaluateListingSeoAudit(input, draft, quality, grounding, bulletMetrics);
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
    ...(bulletMetrics.availableHighValueTerms >= 2 && bulletMetrics.keywordCoverage < 50
      ? [`Integrate more grounded customer-copy search language into the bullets (${bulletMetrics.usedHighValueTerms}/${bulletMetrics.availableHighValueTerms} high-value terms used).`]
      : []),
    ...(bulletMetrics.exactPhraseDuplicates > 0 ? ["Use each exact customer-copy search phrase in only one bullet."] : []),
    ...(bulletMetrics.naturalnessScore < 70 ? ["Rewrite bullet search phrases as natural buyer-facing sentences rather than keyword lists."] : []),
    ...(quality.repetitionScore > 24 ? ["Reduce repeated concepts across listing fields."] : []),
    ...(unsupportedGift ? ["Remove gift language because the supplied purchase motives do not support gifting."] : []),
    ...(styleLedTitle ? ["Lead the title with buyer identity or niche intent, not the rendering style."] : []),
    ...grounding.unsupportedClaims.slice(0, 8).map((claim) => claim.unsupportedTerms.length > 0
      ? `Ground or remove claim “${claim.claim}” (unsupported: ${claim.unsupportedTerms.join(", ")}).`
      : `Remove or rewrite ungrounded claim “${claim.claim}”.`),
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
    seoAudit,
    grounding,
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
    seoAudit: listing.seoAudit,
    grounding: listing.grounding,
    qualityGate: listing.qualityGate,
    compliance: listing.compliance,
    marketplace: listing.marketplace,
    engineVersion: listing.engineVersion,
  };
}
