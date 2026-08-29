import {
  canonicalSloganKey,
  dedupeCanonicalSlogans,
  type RecoveryContext,
} from "./dynamicNicheProfile";
import type { SemanticEligibilityAssessment } from "./dynamicCreativeSelectionEngine";

export const MAX_SEMANTIC_RECOVERY_ATTEMPTS = 1;

export interface SemanticRecoveryAttempt {
  attempt: number;
  rawCandidateCount: number;
  deduplicatedCandidateCount: number;
  compressedCandidateCount: number;
  eligibilityAssessedCount: number;
  eligibleCount: number;
}

export interface SemanticRecoveryResult {
  attempts: SemanticRecoveryAttempt[];
  generatedCandidates: string[];
  compressedCandidates: string[];
  assessments: SemanticEligibilityAssessment[];
  eligibleCandidates: string[];
  recoveryAttemptCount: number;
}

export async function runBoundedSemanticRecovery(input: {
  initialGeneratedCandidates: string[];
  initialCompressedCandidates: string[];
  initialAssessments: SemanticEligibilityAssessment[];
  maxAttempts?: number;
  buildContext: (
    attempt: number,
    assessments: SemanticEligibilityAssessment[],
    fingerprints: string[],
  ) => RecoveryContext;
  generate: (context: RecoveryContext) => Promise<string[]>;
  compress: (candidates: string[]) => Promise<string[]>;
  assess: (candidates: string[]) => Promise<SemanticEligibilityAssessment[]>;
}): Promise<SemanticRecoveryResult> {
  const maxAttempts = Math.max(0, Math.min(2, input.maxAttempts ?? MAX_SEMANTIC_RECOVERY_ATTEMPTS));
  const generatedCandidates = [...input.initialGeneratedCandidates];
  const compressedCandidates = [...input.initialCompressedCandidates];
  const assessments = [...input.initialAssessments];
  const attempts: SemanticRecoveryAttempt[] = [];
  const seenGenerated = new Set(generatedCandidates.map(canonicalSloganKey).filter(Boolean));
  const seenAssessed = new Set(compressedCandidates.map(canonicalSloganKey).filter(Boolean));
  let eligibleCandidates: string[] = [];

  for (let attempt = 1; attempt <= maxAttempts && eligibleCandidates.length === 0; attempt += 1) {
    const fingerprints = [...new Set([...seenGenerated, ...seenAssessed])];
    const context = input.buildContext(attempt, assessments, fingerprints);
    const raw = await input.generate(context);
    const deduplicated = dedupeCanonicalSlogans(raw).filter((candidate) => {
      const fingerprint = canonicalSloganKey(candidate);
      return Boolean(fingerprint) && !seenGenerated.has(fingerprint) && !seenAssessed.has(fingerprint);
    });
    for (const candidate of deduplicated) seenGenerated.add(canonicalSloganKey(candidate));
    generatedCandidates.push(...deduplicated);

    const compressed = dedupeCanonicalSlogans(await input.compress(deduplicated)).filter((candidate) => {
      const fingerprint = canonicalSloganKey(candidate);
      return Boolean(fingerprint) && !seenAssessed.has(fingerprint);
    });
    for (const candidate of compressed) seenAssessed.add(canonicalSloganKey(candidate));
    compressedCandidates.push(...compressed);

    const attemptAssessments = compressed.length > 0 ? await input.assess(compressed) : [];
    assessments.push(...attemptAssessments);
    eligibleCandidates = compressed.filter((candidate) => (
      attemptAssessments.some((assessment) => (
        canonicalSloganKey(assessment.slogan) === canonicalSloganKey(candidate) && assessment.eligible
      ))
    ));
    attempts.push({
      attempt,
      rawCandidateCount: raw.length,
      deduplicatedCandidateCount: deduplicated.length,
      compressedCandidateCount: compressed.length,
      eligibilityAssessedCount: attemptAssessments.length,
      eligibleCount: eligibleCandidates.length,
    });
  }

  return {
    attempts,
    generatedCandidates,
    compressedCandidates,
    assessments,
    eligibleCandidates,
    recoveryAttemptCount: attempts.length,
  };
}
