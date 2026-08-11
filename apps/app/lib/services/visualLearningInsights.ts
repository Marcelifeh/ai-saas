import type { VisualMetricLearningSignal } from "@/lib/services/salesFeedbackService";

export const VISUAL_LEARNING_SIGNAL_GUARD = {
  minimumSampleSize: 5,
  minimumConfidence: 0.1,
  minimumEffectSize: 0.15,
} as const;

export type VisualLearningDisposition = "OBSERVE_ONLY" | "DIRECTIONAL_EVIDENCE";

export type VisualLearningInsight = {
  message: string;
  severity: "info";
  icon: "🧠";
};

type OutcomeCorrelation = {
  label: string;
  value: number;
};

const metricLabels: Record<string, string> = {
  thumbnailLegibility: "thumbnail legibility",
  sloganReinforcement: "slogan reinforcement",
  printability: "printability",
  compositionFamilyDiversity: "composition diversity",
  visualMetaphorDiversity: "metaphor diversity",
  supportingObjectOverlap: "supporting-object overlap",
  typographyRoleDiversity: "typography-role diversity",
  commercialQualityScore: "commercial visual score",
};

function strongestOutcome(signal: VisualMetricLearningSignal): OutcomeCorrelation | undefined {
  return [
    { label: "CTR", value: signal.ctrCorrelation },
    { label: "save rate", value: signal.favoriteRateCorrelation },
    { label: "conversion", value: signal.conversionCorrelation },
    { label: "order rate", value: signal.orderRateCorrelation },
  ]
    .filter((entry): entry is OutcomeCorrelation => typeof entry.value === "number")
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))[0];
}

export function visualLearningDisposition(signal: VisualMetricLearningSignal): VisualLearningDisposition {
  const strongest = strongestOutcome(signal);
  if (
    signal.observations < VISUAL_LEARNING_SIGNAL_GUARD.minimumSampleSize ||
    signal.confidence < VISUAL_LEARNING_SIGNAL_GUARD.minimumConfidence ||
    !strongest ||
    Math.abs(strongest.value) < VISUAL_LEARNING_SIGNAL_GUARD.minimumEffectSize
  ) {
    return "OBSERVE_ONLY";
  }
  return "DIRECTIONAL_EVIDENCE";
}

export function buildVisualLearningInsights(
  signals: VisualMetricLearningSignal[],
  limit = 2,
): VisualLearningInsight[] {
  return signals
    .filter((signal) => visualLearningDisposition(signal) === "DIRECTIONAL_EVIDENCE")
    .slice(0, Math.max(0, limit))
    .flatMap((signal) => {
      const strongest = strongestOutcome(signal);
      if (!strongest) return [];
      const direction = strongest.value > 0 ? "positively" : "negatively";
      return [{
        message: `Early visual learning signal: ${metricLabels[signal.metric] ?? signal.metric} is ${direction} associated with ${strongest.label} (${strongest.value.toFixed(2)}) across ${signal.observations} observations. Treat this as directional until confidence grows.`,
        severity: "info" as const,
        icon: "🧠" as const,
      }];
    });
}
