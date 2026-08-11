export type VisualReleasePresentationInput = {
  status?: string;
  evaluated?: boolean;
};

export type VisualReleasePresentation = {
  label: "pending" | "waiting for batch" | "pass" | "review";
  tone: "neutral" | "success" | "warning";
  showReviewWarning: boolean;
};

export function getVisualReleasePresentation(
  gate?: VisualReleasePresentationInput | null,
): VisualReleasePresentation {
  if (gate?.evaluated !== true) {
    return {
      label: gate?.status === "INSUFFICIENT_SAMPLE" ? "waiting for batch" : "pending",
      tone: "neutral",
      showReviewWarning: false,
    };
  }

  if (gate.status === "PASS") {
    return { label: "pass", tone: "success", showReviewWarning: false };
  }
  if (gate.status === "REVIEW") {
    return { label: "review", tone: "warning", showReviewWarning: true };
  }
  return { label: "pending", tone: "neutral", showReviewWarning: false };
}
