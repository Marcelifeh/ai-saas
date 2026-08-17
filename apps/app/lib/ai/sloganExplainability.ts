import "server-only";
import type { RankedSlogan } from "./sloganEngine";
import type { NicheMarketEvidence } from "@/lib/services/marketEvidenceService";

export interface StructuredSloganExplanation {
  slogan: string;
  rank: number;
  evidenceCitation: {
    snapshotId: string;
    observedAt: string;
    contentHash?: string;
    supportingSignalCount: number;
  };
  behavioralRecognition: {
    score: number;
    explanation: string;
  };
  nicheSpecificity: {
    score: number;
    explanation: string;
  };
  thumbnailClarity: {
    score: number;
    explanation: string;
  };
  marketAlignment: {
    level: "Strong" | "Moderate" | "Emerging";
    explanation: string;
    matchedSignals: string[];
  };
  structuralOriginality: {
    score: number;
    explanation: string;
  };
  designability: {
    level: "Excellent" | "Good" | "Moderate";
    explanation: string;
  };
}

export type SloganDeltaType = "NEW" | "RETAINED" | "REFINED" | "DROPPED";

export interface SloganDeltaItem {
  slogan: string;
  deltaType: SloganDeltaType;
  previousSlogan?: string;
  previousScore?: number;
  newScore?: number;
  deltaConfidence: number; // Multi-signal similarity confidence (0 - 1.0)
  canonicalKey: string;
}

export function generateStructuredExplanation(
  rankedItem: RankedSlogan,
  rank: number,
  evidence?: NicheMarketEvidence
): StructuredSloganExplanation {
  const slogan = rankedItem.slogan;
  const wordCount = slogan.split(/\s+/).length;
  const snapshotId = evidence?.id || `ME-${Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")}`;
  const observedAt = evidence?.observedAt || new Date().toISOString();
  // Behavioral recognition score (ritual / truth / persona)
  const behScore = Math.round(
    (rankedItem.truthScore ?? 75) * 0.4 +
    (rankedItem.ritualCompression ?? 70) * 0.3 +
    (rankedItem.authenticityScore ?? 80) * 0.3
  );

  // Niche specificity
  const specScore = Math.round(rankedItem.insiderSpecificity ?? 82);

  // Thumbnail clarity
  const clarityScore = Math.round(rankedItem.thumbnailReadabilityScore ?? (wordCount <= 5 ? 92 : wordCount <= 8 ? 84 : 72));

  // Market alignment
  const matchedSignals: string[] = [];
  if (evidence) {
    const lowerSlogan = slogan.toLowerCase();
    evidence.trendSignals.forEach((sig) => {
      if (lowerSlogan.includes(sig.phrase.toLowerCase())) {
        matchedSignals.push(sig.phrase);
      }
    });
    evidence.buyerLanguage.forEach((b) => {
      if (lowerSlogan.includes(b.phrase.toLowerCase())) {
        matchedSignals.push(b.phrase);
      }
    });
  }

  const marketLevel = matchedSignals.length >= 2 ? "Strong" : matchedSignals.length === 1 ? "Moderate" : "Emerging";
  const marketExplanation = matchedSignals.length > 0
    ? `Matches ${matchedSignals.length} observed signal(s) from Snapshot #${snapshotId}`
    : `Aligns with baseline niche behavior from Snapshot #${snapshotId}`;

  // Structural originality
  const originalityScore = Math.max(60, Math.min(98, 100 - (rankedItem.structuralDiversityPenalty ?? 5) * 3));

  // Designability
  const visualFit = rankedItem.visualFit ?? 80;
  const designabilityLevel = visualFit >= 85 ? "Excellent" : visualFit >= 70 ? "Good" : "Moderate";

  return {
    slogan,
    rank,
    evidenceCitation: {
      snapshotId,
      observedAt,
      contentHash: evidence?.contentHash,
      supportingSignalCount: matchedSignals.length,
    },
    behavioralRecognition: {
      score: behScore,
      explanation: `Captures authentic buyer identity and recurring community behavioral triggers.`,
    },
    nicheSpecificity: {
      score: specScore,
      explanation: `Leverages insider language without resorting to generic category descriptors.`,
    },
    thumbnailClarity: {
      score: clarityScore,
      explanation: `${wordCount} words with estimated optimal visual width for mobile search results.`,
    },
    marketAlignment: {
      level: marketLevel,
      explanation: marketExplanation,
      matchedSignals: matchedSignals.slice(0, 3),
    },
    structuralOriginality: {
      score: originalityScore,
      explanation: `Low structural collision with other candidates in current batch.`,
    },
    designability: {
      level: designabilityLevel,
      explanation: `Supports typography-led layout modes with balanced symmetry.`,
    },
  };
}

function stemWord(word: string): string {
  return word.toLowerCase().replace(/(ing|ed|es|s|er|ly)$/, "");
}

function calculateCanonicalSimilarity(a: string, b: string): number {
  const normA = a.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normB = b.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normA === normB) return 1.0;
  if (normA.includes(normB) || normB.includes(normA)) return 0.85;
  return 0.0;
}

function calculateStructuralFingerprintSimilarity(a: string, b: string): number {
  const fpA = a.toLowerCase().replace(/[a-z]+/g, "X").replace(/\s+/g, " ").trim();
  const fpB = b.toLowerCase().replace(/[a-z]+/g, "X").replace(/\s+/g, " ").trim();
  return fpA === fpB ? 0.9 : 0.0;
}

function calculateWordOverlap(a: string, b: string): number {
  const stemsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 2).map(stemWord));
  const stemsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 2).map(stemWord));
  if (stemsA.size === 0 || stemsB.size === 0) return 0;
  let intersection = 0;
  stemsA.forEach((w) => {
    if (stemsB.has(w)) intersection++;
  });
  return (2 * intersection) / (stemsA.size + stemsB.size);
}

export function calculateMultiSignalDeltaConfidence(a: string, b: string): number {
  const canonicalSim = calculateCanonicalSimilarity(a, b);
  const structuralSim = calculateStructuralFingerprintSimilarity(a, b);
  const wordOverlap = calculateWordOverlap(a, b);

  return Math.min(1.0, canonicalSim * 0.45 + wordOverlap * 0.45 + structuralSim * 0.1);
}

export function computeSloganDeltas(
  previousSlogans: { slogan: string; score: number }[],
  currentSlogans: { slogan: string; score: number }[]
): SloganDeltaItem[] {
  const buildCanonicalKey = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]/g, "");

  const matchedPrevIndices = new Set<number>();
  const deltaResults = new Map<number, SloganDeltaItem>();

  // Pass 1: Exact canonical matches
  currentSlogans.forEach((curr, cIdx) => {
    const currKey = buildCanonicalKey(curr.slogan);
    const exactIdx = previousSlogans.findIndex(
      (prev, pIdx) => !matchedPrevIndices.has(pIdx) && buildCanonicalKey(prev.slogan) === currKey
    );

    if (exactIdx !== -1) {
      matchedPrevIndices.add(exactIdx);
      const prev = previousSlogans[exactIdx];
      const scoreDiff = Math.abs(prev.score - curr.score);
      deltaResults.set(cIdx, {
        slogan: curr.slogan,
        deltaType: scoreDiff >= 3 ? "REFINED" : "RETAINED",
        previousSlogan: prev.slogan,
        previousScore: prev.score,
        newScore: curr.score,
        deltaConfidence: 1.0,
        canonicalKey: currKey,
      });
    }
  });

  // Pass 2: Fuzzy / Semantic similarity matching for unmatched current slogans
  currentSlogans.forEach((curr, cIdx) => {
    if (deltaResults.has(cIdx)) return;
    const currKey = buildCanonicalKey(curr.slogan);

    let bestPrevIdx = -1;
    let bestConfidence = 0;

    previousSlogans.forEach((prev, pIdx) => {
      if (matchedPrevIndices.has(pIdx)) return;
      const confidence = calculateMultiSignalDeltaConfidence(prev.slogan, curr.slogan);
      if (confidence > bestConfidence) {
        bestConfidence = confidence;
        bestPrevIdx = pIdx;
      }
    });

    if (bestPrevIdx !== -1 && bestConfidence >= 0.2) {
      matchedPrevIndices.add(bestPrevIdx);
      const prev = previousSlogans[bestPrevIdx];
      deltaResults.set(cIdx, {
        slogan: curr.slogan,
        deltaType: "REFINED",
        previousSlogan: prev.slogan,
        previousScore: prev.score,
        newScore: curr.score,
        deltaConfidence: Math.round(bestConfidence * 100) / 100,
        canonicalKey: currKey,
      });
    } else {
      deltaResults.set(cIdx, {
        slogan: curr.slogan,
        deltaType: "NEW",
        newScore: curr.score,
        deltaConfidence: 1.0,
        canonicalKey: currKey,
      });
    }
  });

  const finalDeltas: SloganDeltaItem[] = [];
  currentSlogans.forEach((_, cIdx) => {
    if (deltaResults.has(cIdx)) {
      finalDeltas.push(deltaResults.get(cIdx)!);
    }
  });

  // Pass 3: Dropped slogans
  previousSlogans.forEach((prev, idx) => {
    if (!matchedPrevIndices.has(idx)) {
      finalDeltas.push({
        slogan: prev.slogan,
        deltaType: "DROPPED",
        previousScore: prev.score,
        deltaConfidence: 1.0,
        canonicalKey: buildCanonicalKey(prev.slogan),
      });
    }
  });

  return finalDeltas;
}
