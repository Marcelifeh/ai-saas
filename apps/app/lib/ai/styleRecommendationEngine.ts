export const STABLE_RENDERING_STYLES = [
  "Vintage Distressed",
  "Bold Graphic",
  "Hand-Drawn",
  "Retro Vintage",
  "Minimalist Vector",
  "Retro Neon",
  "Y2K",
] as const;

export type RenderingStyleName = typeof STABLE_RENDERING_STYLES[number];

export interface StyleRecommendation {
  style: RenderingStyleName;
  fitScore: number;
  isRecommended: boolean;
  rationale: string;
}

export function rankStyleRecommendations(
  niche: string,
  conceptKeywords: string[] = []
): StyleRecommendation[] {
  const lower = (niche + " " + conceptKeywords.join(" ")).toLowerCase();

  const scores: Record<RenderingStyleName, { score: number; rationale: string }> = {
    "Vintage Distressed": {
      score: 75,
      rationale: "Timeless worn aesthetic; high buyer wearability across outdoor, classic, and identity niches.",
    },
    "Bold Graphic": {
      score: 70,
      rationale: "High-contrast typography and elements; ideal for loud statements and mobile thumbnail clarity.",
    },
    "Hand-Drawn": {
      score: 65,
      rationale: "Authentic artisan feel; ideal for cozy, coffee, pet, and craft communities.",
    },
    "Retro Vintage": {
      score: 70,
      rationale: "Nostalgic 70s/80s stripes and color palettes; strong emotional resonance.",
    },
    "Minimalist Vector": {
      score: 65,
      rationale: "Clean line-art and subtle typography; preferred by modern/subtle aesthetic buyers.",
    },
    "Retro Neon": {
      score: 55,
      rationale: "Vibrant cyber/synthwave look; great for gaming and nightlife topics.",
    },
    "Y2K": {
      score: 50,
      rationale: "Early 2000s chrome/starburst graphics; strong with Gen-Z trendsetters.",
    },
  };

  // Niche-based dynamic fit boosts
  if (/gym|lift|run|fight|workout|grind|power/.test(lower)) {
    scores["Bold Graphic"].score += 22;
    scores["Vintage Distressed"].score += 15;
    scores["Bold Graphic"].rationale = "High-energy bold graphic layout matches athletic intensity.";
  }

  if (/coffee|book|read|cozy|cat|dog|pet|plant|garden/.test(lower)) {
    scores["Hand-Drawn"].score += 26;
    scores["Minimalist Vector"].score += 18;
    scores["Hand-Drawn"].rationale = "Warm hand-drawn line-art resonates strongly with cozy identity buyers.";
  }

  if (/gaming|tech|cyber|code|night|synth/.test(lower)) {
    scores["Retro Neon"].score += 35;
    scores["Y2K"].score += 25;
    scores["Retro Neon"].rationale = "Luminous neon graphics align with digital and gaming aesthetics.";
  }

  if (/camping|outdoor|hike|trail|fish|nature|mountain/.test(lower)) {
    scores["Vintage Distressed"].score += 24;
    scores["Retro Vintage"].score += 20;
    scores["Vintage Distressed"].rationale = "Weathered texture perfectly fits rugged outdoor lifestyle apparel.";
  }

  if (/nursing|nurse|teacher|mom|dad|club|crew/.test(lower)) {
    scores["Retro Vintage"].score += 22;
    scores["Bold Graphic"].score += 18;
    scores["Retro Vintage"].rationale = "Classic retro arched text creates iconic community pride merchandise.";
  }

  const result: StyleRecommendation[] = STABLE_RENDERING_STYLES.map((style) => {
    const item = scores[style];
    const fitScore = Math.min(99, Math.max(40, item.score));
    return {
      style,
      fitScore,
      isRecommended: fitScore >= 80,
      rationale: item.rationale,
    };
  });

  return result.sort((a, b) => b.fitScore - a.fitScore);
}
