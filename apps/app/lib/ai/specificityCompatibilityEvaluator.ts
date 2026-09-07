/**
 * Specificity Compatibility Evaluator
 *
 * Enforces provenance-first evidence inheritance to prevent parent-category
 * subculture contamination without hardcoded vocabularies or qualifier lists.
 *
 * Standard:
 * "TrendForge learns defect classes, not bad phrases, niche exceptions,
 *  qualifier lists, or slogan formulas."
 */

export type FactSourceType =
  | "USER_BRIEF"
  | "MARKET_EVIDENCE"
  | "COMMUNITY_EVIDENCE"
  | "INHERITED_CATEGORY"
  | "PIPELINE_DERIVATION";

export type FactSupportStatus =
  | "DIRECT"         // Explicitly provided in user brief or exact niche statement
  | "CORROBORATED"   // Supported across independent external signals (brief + market signals)
  | "INHERITED"      // Anchored to root parent category, compatible with sub-domain
  | "UNVERIFIED"     // Unanchored parent-category concept with no support in qualifiers
  | "INCOMPATIBLE";   // Sub-specialty concept that conflicts with qualifiers

export interface SupportedNicheFact {
  phrase: string;
  sourceType: FactSourceType;
  supportStatus: FactSupportStatus;
  category?: string;
  confidence: number;
  specificityRisk: number; // 0 to 1
  incompatibilityReason?: string;
}

export interface SemanticNicheDecomposition {
  originalNiche: string;
  matchedCategory: string | null;
  qualifiers: string[];
  isQualifiedSubdomain: boolean;
}

const COMMON_STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "for", "with", "in", "of", "to", "on", "at", "by", "from", "about", "is", "are"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

/**
 * Decompose a niche into category core and qualifiers without hardcoded vocabularies.
 * Any non-category, non-stopword token in the niche represents specialized qualification.
 */
export function decomposeSemanticNiche(
  niche: string,
  matchedCategory: string | null,
): SemanticNicheDecomposition {
  const tokens = tokenize(niche);
  const categoryTokens = matchedCategory ? tokenize(matchedCategory) : [];
  const categoryTokenSet = new Set(categoryTokens);

  const qualifiers: string[] = [];
  for (const token of tokens) {
    if (!categoryTokenSet.has(token) && !COMMON_STOP_WORDS.has(token) && token.length > 2) {
      qualifiers.push(token);
    }
  }

  const isQualifiedSubdomain = Boolean(matchedCategory && qualifiers.length > 0);

  return {
    originalNiche: niche,
    matchedCategory,
    qualifiers,
    isQualifiedSubdomain,
  };
}

/**
 * Provenance Invariant:
 * Internal pipeline repetition (e.g. Profile stage repeating a Lexicon fact)
 * does NOT count as independent corroboration. Corroboration requires independent
 * external evidence (USER_BRIEF or MARKET_EVIDENCE).
 */
export function evaluateFactProvenance(
  phrase: string,
  sources: Array<{ sourceType: FactSourceType; text?: string }>,
): FactSupportStatus {
  const externalSources = sources.filter(
    (s) => s.sourceType === "USER_BRIEF" || s.sourceType === "MARKET_EVIDENCE"
  );
  if (externalSources.length >= 2) return "CORROBORATED";
  if (externalSources.some((s) => s.sourceType === "USER_BRIEF")) return "DIRECT";
  if (externalSources.some((s) => s.sourceType === "MARKET_EVIDENCE")) return "CORROBORATED";
  if (sources.some((s) => s.sourceType === "INHERITED_CATEGORY" || s.sourceType === "COMMUNITY_EVIDENCE")) {
    return "INHERITED";
  }
  return "UNVERIFIED";
}

/**
 * Evaluates whether candidate inherited facts from a parent category are
 * compatible with the specialized qualifiers of a sub-niche.
 */
export function evaluateSpecificityCompatibility(
  candidates: Array<{ phrase: string; category?: string; initialConfidence?: number }>,
  niche: string,
  matchedCategory: string | null,
  rawSignals: string[] = [],
): SupportedNicheFact[] {
  const decomposition = decomposeSemanticNiche(niche, matchedCategory);
  const normalizedRawSignals = rawSignals.map((sig) => sig.toLowerCase());
  const qualifierSet = new Set(decomposition.qualifiers.map((q) => q.toLowerCase()));
  const categoryTokenSet = matchedCategory ? new Set(tokenize(matchedCategory)) : new Set<string>();

  return candidates.map((candidate) => {
    const phrase = candidate.phrase.trim();
    const phraseLower = phrase.toLowerCase();
    const phraseTokens = tokenize(phraseLower);

    // If there is no parent category inheritance or niche is not a qualified subdomain,
    // all facts from the category are directly inherited.
    if (!decomposition.isQualifiedSubdomain || !matchedCategory) {
      return {
        phrase,
        sourceType: "COMMUNITY_EVIDENCE",
        supportStatus: "INHERITED",
        category: candidate.category,
        confidence: candidate.initialConfidence ?? 0.8,
        specificityRisk: 0,
      };
    }

    // 1. Direct or Corroborated match in qualifiers or raw market signals
    const hasQualifierOverlap = phraseTokens.some((t) => qualifierSet.has(t));
    const hasRawSignalSupport = normalizedRawSignals.some(
      (sig) => sig.includes(phraseLower) || phraseTokens.some((t) => t.length > 3 && sig.includes(t))
    );

    if (hasQualifierOverlap || hasRawSignalSupport) {
      return {
        phrase,
        sourceType: "MARKET_EVIDENCE",
        supportStatus: "CORROBORATED",
        category: candidate.category,
        confidence: Math.max(0.85, candidate.initialConfidence ?? 0.85),
        specificityRisk: 0.1,
      };
    }

    // 2. Category Universal Anchor:
    // Does the candidate phrase explicitly carry the core category token(s)?
    // (e.g., "morning coffee", "coffee mug", "running shoes", "gardening tools")
    const isCategoryAnchored = phraseTokens.some((t) => categoryTokenSet.has(t));

    if (isCategoryAnchored) {
      return {
        phrase,
        sourceType: "INHERITED_CATEGORY",
        supportStatus: "INHERITED",
        category: candidate.category,
        confidence: Math.min(0.7, candidate.initialConfidence ?? 0.7),
        specificityRisk: 0.2,
      };
    }

    // 3. Unanchored Sub-Specialty Jargon:
    // In a specialized sub-niche, any parent-category phrase that neither contains
    // the category anchor token nor has qualifier/market corroboration represents
    // unverified subculture jargon. It fails closed.
    return {
      phrase,
      sourceType: "INHERITED_CATEGORY",
      supportStatus: "UNVERIFIED",
      category: candidate.category,
      confidence: Math.min(0.35, candidate.initialConfidence ?? 0.35),
      specificityRisk: 0.85,
      incompatibilityReason: `Unanchored parent category claim uncorroborated by sub-domain qualifiers (${decomposition.qualifiers.join(", ")})`,
    };
  });
}
