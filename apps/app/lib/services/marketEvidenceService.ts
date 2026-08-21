import { createHash } from "crypto";
import { collectTrendSignals } from "@/lib/ai/trendEngine";
import { getCommunityKnowledge, getBehaviorFragmentPool, getCommunityCompressionTokens } from "@/lib/ai/communityKnowledgeEngine";
import { getBehavioralProfile } from "@/lib/ai/behavioralLexicon";
import { globalCache } from "@/lib/utils/cache";

export interface TrendSignal {
  phrase: string;
  confidence: number;
  velocity?: number;
  sourceCount: number;
}

export interface BuyerPhrase {
  phrase: string;
  confidence: number;
  evidenceCount: number;
}

export interface CulturalSignal {
  phrase: string;
  category: "stereotype" | "anchor" | "identity";
}

export interface PurchaseSignal {
  phrase: string;
  category: "artifact" | "status" | "tension";
}

export interface SignalFreshness {
  oldestSignalAt?: string;
  newestSignalAt?: string;
  confidence: number;
}

export interface NicheMarketEvidence {
  id: string; // e.g. ME-8F31 or snap_...
  version: string; // e.g. v1.0
  contentHash: string; // SHA-256 checksum of canonical payload
  niche: string;
  observedAt: string;
  trendSignals: TrendSignal[];
  buyerLanguage: BuyerPhrase[];
  culturalSignals: CulturalSignal[];
  purchaseSignals: PurchaseSignal[];
  freshness: SignalFreshness;
  rawSignals: string[];
}

function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  Object.freeze(obj);
  Object.keys(obj).forEach((key) => {
    const prop = (obj as Record<string, unknown>)[key];
    if (prop !== null && typeof prop === "object" && !Object.isFrozen(prop)) {
      deepFreeze(prop);
    }
  });
  return obj;
}

function canonicalStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map((item) => canonicalStringify(item)).join(",") + "]";
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const keyPairs = keys.map((key) => {
    const val = (obj as Record<string, unknown>)[key];
    return JSON.stringify(key) + ":" + canonicalStringify(val);
  });
  return "{" + keyPairs.join(",") + "}";
}

function computeContentHash(payload: Omit<NicheMarketEvidence, "contentHash">): string {
  const hashPayload = {
    id: payload.id,
    version: payload.version,
    niche: payload.niche,
    observedAt: payload.observedAt,
    trendSignals: payload.trendSignals,
    buyerLanguage: payload.buyerLanguage,
    culturalSignals: payload.culturalSignals,
    purchaseSignals: payload.purchaseSignals,
    freshness: payload.freshness,
    rawSignals: payload.rawSignals,
  };
  const canonicalString = canonicalStringify(hashPayload);
  return createHash("sha256").update(canonicalString).digest("hex");
}

export function verifyEvidenceIntegrity(evidence: NicheMarketEvidence): boolean {
  const { contentHash, ...hashPayload } = evidence;
  const expectedHash = computeContentHash(hashPayload);
  return evidence.contentHash === expectedHash;
}

export async function getNicheEvidence(niche: string): Promise<NicheMarketEvidence> {
  const cleanNiche = niche.trim().toLowerCase();
  const cacheKey = `niche_evidence_snapshot_v2_${cleanNiche}`;

  const cached = globalCache.get(cacheKey) as NicheMarketEvidence | null;
  if (cached && verifyEvidenceIntegrity(cached)) {
    return cached;
  }

  const timestamp = new Date().toISOString();
  const hexSuffix = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
  const id = `ME-${hexSuffix}`;
  const version = "v1.0";

  // 1. Fetch aggregate trend signals. Evidence quality is derived from the
  // actual contributing sources; no simulated velocity, source counts, or
  // confidence values are injected here.
  let rawSignals: string[] = [];
  let sources: Array<{
    source: string;
    data: string[];
    confidence: number;
    fetchedAt: string;
    cachedAt?: string;
  }> = [];
  let aggregateConfidence = 0;
  try {
    const collected = await collectTrendSignals();
    rawSignals = collected.signals || [];
    sources = (collected.sources || []).map((source) => ({
      source: source.source,
      data: source.data || [],
      confidence: source.confidence || 0,
      fetchedAt: source.fetchedAt,
      cachedAt: source.cachedAt,
    }));
    aggregateConfidence = collected.signalConfidence || 0;
  } catch (err) {
    console.warn("marketEvidenceService: Failed to collect live trend signals", err);
  }

  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const nicheTokens = cleanNiche.split(/\s+/).filter((token) => token.length > 2);
  const matchedSignals = rawSignals.filter((signal) => {
    const lower = normalize(signal);
    return nicheTokens.some((token) => lower.includes(token));
  });
  const selectedSignals = matchedSignals.length > 0 ? matchedSignals : rawSignals.slice(0, 8);

  const trendSignals: TrendSignal[] = selectedSignals.map((phrase) => {
    const normalizedPhrase = normalize(phrase);
    const contributors = sources.filter((source) => (source.data || []).some((item) => normalize(item) === normalizedPhrase));
    const confidence = contributors.length > 0
      ? contributors.reduce((sum, source) => sum + source.confidence, 0) / contributors.length
      : aggregateConfidence;
    return {
      phrase,
      confidence: Math.round(Math.max(0, Math.min(1, confidence)) * 100) / 100,
      sourceCount: contributors.length,
    };
  });

  // 2. Community-language evidence is derived deterministically from the
  // existing knowledge sources. Evidence counts reflect actual supporting
  // collections, not random values.
  const profile = getBehavioralProfile(cleanNiche);
  const knowledge = getCommunityKnowledge(cleanNiche, profile);
  const pool = getBehaviorFragmentPool(cleanNiche, undefined, profile);
  const compressionTokens = getCommunityCompressionTokens(cleanNiche, profile);

  const buyerCollections = [
    knowledge.insiderPhrases,
    pool.repeatedThoughts,
    pool.microBehaviors,
    pool.internalJokes,
    compressionTokens,
  ].map((collection) => collection.filter(Boolean));
  const buyerPhrasesRaw = Array.from(new Set(buyerCollections.flat())).filter(Boolean);

  const buyerLanguage: BuyerPhrase[] = buyerPhrasesRaw.slice(0, 12).map((phrase) => {
    const evidenceCount = buyerCollections.filter((collection) => collection.includes(phrase)).length;
    return {
      phrase,
      confidence: Math.round(Math.min(0.95, 0.55 + evidenceCount * 0.1) * 100) / 100,
      evidenceCount,
    };
  });

  const culturalSignalEntries: Array<[string, CulturalSignal]> = [
    ...knowledge.stereotypeHooks.map(
      (phrase): [string, CulturalSignal] => [
        phrase,
        { phrase, category: "stereotype" },
      ],
    ),
    ...knowledge.environmentalAnchors.map(
      (phrase): [string, CulturalSignal] => [
        phrase,
        { phrase, category: "anchor" },
      ],
    ),
    ...pool.identitySignals.map(
      (phrase): [string, CulturalSignal] => [
        phrase,
        { phrase, category: "identity" },
      ],
    ),
  ];

  const culturalSignals: CulturalSignal[] = Array.from(
    new Map<string, CulturalSignal>(culturalSignalEntries).values(),
  ).slice(0, 8);

  const purchaseSignalEntries: Array<[string, PurchaseSignal]> = [
    ...pool.obsessionArtifacts.map(
      (phrase): [string, PurchaseSignal] => [
        phrase,
        { phrase, category: "artifact" },
      ],
    ),
    ...pool.statusSignals.map(
      (phrase): [string, PurchaseSignal] => [
        phrase,
        { phrase, category: "status" },
      ],
    ),
    ...knowledge.communityTensions.map(
      (phrase): [string, PurchaseSignal] => [
        phrase,
        { phrase, category: "tension" },
      ],
    ),
  ];

  const purchaseSignals: PurchaseSignal[] = Array.from(
    new Map<string, PurchaseSignal>(purchaseSignalEntries).values(),
  ).slice(0, 8);

  const sourceTimes = sources
    .flatMap((source) => [source.cachedAt, source.fetchedAt])
    .filter((value): value is string => typeof value === "string" && !Number.isNaN(Date.parse(value)))
    .map((value) => new Date(value).getTime());
  const freshness: SignalFreshness = {
    oldestSignalAt: sourceTimes.length > 0 ? new Date(Math.min(...sourceTimes)).toISOString() : undefined,
    newestSignalAt: sourceTimes.length > 0 ? new Date(Math.max(...sourceTimes)).toISOString() : timestamp,
    confidence: Math.round(Math.max(0, Math.min(1, aggregateConfidence)) * 100) / 100,
  };

  const payloadUnfrozen = {
    id,
    version,
    niche: cleanNiche,
    observedAt: timestamp,
    trendSignals,
    buyerLanguage,
    culturalSignals,
    purchaseSignals,
    freshness,
    rawSignals: rawSignals.slice(0, 20),
  };

  const contentHash = computeContentHash(payloadUnfrozen);
  const evidence: NicheMarketEvidence = deepFreeze({
    ...payloadUnfrozen,
    contentHash,
  });

  // Cache deep-frozen snapshot for 30 minutes
  globalCache.set(cacheKey, evidence, 30 * 60 * 1000);

  return evidence;
}
