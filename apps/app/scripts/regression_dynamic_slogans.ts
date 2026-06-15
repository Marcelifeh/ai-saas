import assert from "node:assert/strict";
import {
  behavioralContradictionScore,
  categoryDescriptionPenalty,
  type DynamicNicheProfile,
  genericMoodPenalty,
  insiderWordplayScore,
  passesDimensionCoverage,
  rejectsPatternLeakage,
  ritualRecognitionScore,
  scoreDynamicSlogan,
  truthResonanceScore,
} from "../lib/ai/dynamicNicheProfile";

const bannedSamples = [
  "Just One More Pickleball",
  "Powered By Coffee",
  "Retro Sports Mode",
  "Dog Mom Energy",
  "Vintage Vibes",
  "Built For Nurses",
  "No Drama Just Golf",
  "Pickleball Is My Love Language",
  "Eat Sleep Crochet Repeat",
  "Official Dog Mom",
  "Coffee Addict",
  "Weekend Warrior",
  "Golf MVP",
  "Teacher Hustler",
];

for (const slogan of bannedSamples) {
  assert.equal(rejectsPatternLeakage(slogan), true, `Expected banned leakage: ${slogan}`);
}

const syntheticProfile: DynamicNicheProfile = {
  niche: "Synthetic Dynamic Profile",
  dimensions: ["late night repair"],
  audience: "insiders",
  rituals: ["checking the loose hinge"],
  contradictions: ["careful chaos"],
  frustrations: ["missing the tiny screw"],
  statusSignals: ["keeps spare brass screws"],
  insiderLanguage: ["hinge check"],
  embarrassingTruths: ["spent an hour aligning one drawer"],
  obsessions: ["organizing tiny screws by finish"],
  visualCulture: ["workbench lamp"],
  purchaseMotives: ["private recognition"],
};

const cozyLikeProfile: DynamicNicheProfile = {
  niche: "Cozy Gamer Culture",
  dimensions: ["cozy gamer backlog"],
  audience: "cozy game players",
  rituals: ["organizing game library by mood", "customizing avatars before playing"],
  contradictions: ["customizes avatar for hours but leaves games unfinished", "chooses cute characters over competitive play", "sets up cozy nooks instead of performance gear"],
  frustrations: ["too many unfinished games"],
  statusSignals: ["perfect mood-based game folders", "decor perfection instead of DPS"],
  insiderLanguage: ["backlog", "avatar customization", "DPS", "endgame"],
  embarrassingTruths: ["buys more games before finishing old ones"],
  obsessions: ["sorting games into comfort moods", "decorating rooms before quests", "collecting every display item"],
  visualCulture: ["pajamas and handheld console", "cozy gaming nook"],
  purchaseMotives: ["recognition of cozy gamer habits"],
};

assert.equal(
  passesDimensionCoverage("Loose Hinge Under The Workbench Lamp", syntheticProfile),
  true,
  "Expected coverage from dynamic profile signals",
);

assert.equal(
  passesDimensionCoverage("Generic Pride Club", syntheticProfile),
  false,
  "Expected rejection without dynamic profile coverage",
);

assert.ok(
  truthResonanceScore("Tiny Screws Under The Workbench Lamp", syntheticProfile) >
  truthResonanceScore("Comfort Is My Haven", syntheticProfile),
  "Expected concrete profile behavior to outrank mood description",
);

assert.ok(
  genericMoodPenalty("Comfort Is My Haven", syntheticProfile) >
  genericMoodPenalty("Tiny Screws Under The Workbench Lamp", syntheticProfile),
  "Expected generic mood language to receive a higher penalty",
);

assert.ok(
  categoryDescriptionPenalty("Modern Comfort And Cozy Frames", syntheticProfile) >
  categoryDescriptionPenalty("Tiny Screws Under The Workbench Lamp", syntheticProfile),
  "Expected category-description phrasing to receive a higher penalty",
);

assert.ok(
  scoreDynamicSlogan("Tiny Screws Under The Workbench Lamp", syntheticProfile) >
  scoreDynamicSlogan("Modern Comfort And Cozy Frames", syntheticProfile),
  "Expected concrete behavioral truth to outscore category description",
);

assert.ok(
  scoreDynamicSlogan("Modern Comfort And Cozy Frames", syntheticProfile) < 90,
  "Expected category descriptions to be capped below breakout-score range",
);

assert.ok(
  behavioralContradictionScore("Custom Avatars, Unfinished Games", cozyLikeProfile) >
  behavioralContradictionScore("Cozy Games Are My Happy Place", cozyLikeProfile),
  "Expected contradiction slogans to carry stronger contradiction score",
);

assert.ok(
  ritualRecognitionScore("Mood-Based Game Organization Expert", cozyLikeProfile) >
  ritualRecognitionScore("Cozy Games Are My Happy Place", cozyLikeProfile),
  "Expected ritual recognition to beat pleasant affinity language",
);

assert.ok(
  scoreDynamicSlogan("Custom Avatars, Unfinished Games", cozyLikeProfile) >
  scoreDynamicSlogan("Cozy Games Are My Happy Place", cozyLikeProfile),
  "Expected behavioral contradiction to outrank generic happy-place slogan",
);

assert.equal(
  passesDimensionCoverage("DPS? More Like Decor Perfection", cozyLikeProfile),
  true,
  "Expected insider acronym plus concrete behavior to pass coverage",
);

assert.ok(
  insiderWordplayScore("DPS? More Like Decor Perfection", cozyLikeProfile) >
  insiderWordplayScore("Themed Playlists For Every Pixel", cozyLikeProfile),
  "Expected acronym wordplay to beat clear but less insider phrasing",
);

assert.ok(
  scoreDynamicSlogan("DPS? More Like Decor Perfection", cozyLikeProfile) >
  scoreDynamicSlogan("Themed Playlists For Every Pixel", cozyLikeProfile),
  "Expected insider wordplay to outrank readable ritual-adjacent phrasing",
);

assert.ok(
  scoreDynamicSlogan("Setting Up Nooks, Not Just Gear", cozyLikeProfile) >
  scoreDynamicSlogan("Indie Games: My Guilty Pleasure", cozyLikeProfile),
  "Expected culture-specific setup behavior to outrank broad interest slogan",
);

console.log("Dynamic slogan regression gates passed");
