import assert from "node:assert/strict";
import {
  applyStructuralDiversityRanking,
  behavioralContradictionScore,
  buildStructuralFingerprint,
  categoryDescriptionPenalty,
  classifyRhetoricalFamily,
  type DynamicNicheProfile,
  genericMoodPenalty,
  insiderWordplayScore,
  passesDimensionCoverage,
  recognitionLatencyScore,
  rejectsPatternLeakage,
  ritualRecognitionScore,
  scoreDynamicSlogan,
  thumbnailReadabilityScore,
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
  "Murderinos Unite",
  "Swifties For Life",
  "Casefile Nation",
  "Podcast Army",
  "I Know The Cases Not The Victims",
  "Suspect Squad",
  "Gore Club",
  "Living That Furbaby Life",
  "Dog Treats Are My Guilty Pleasure",
];

for (const slogan of bannedSamples) {
  assert.equal(rejectsPatternLeakage(slogan), true, `Expected banned leakage: ${slogan}`);
}

const syntheticProfile: DynamicNicheProfile = {
  niche: "Synthetic Dynamic Profile",
  dimensions: ["late night repair"],
  audience: "insiders",
  rituals: ["checking the loose hinge"],
  microRituals: ["checking the hinge before opening the drawer"],
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
  microRituals: ["opening the game just to sort the backlog", "spending bedtime picking an avatar outfit"],
  contradictions: ["customizes avatar for hours but leaves games unfinished", "chooses cute characters over competitive play", "sets up cozy nooks instead of performance gear"],
  frustrations: ["too many unfinished games"],
  statusSignals: ["perfect mood-based game folders", "decor perfection instead of DPS"],
  insiderLanguage: ["backlog", "avatar customization", "DPS", "endgame"],
  embarrassingTruths: ["buys more games before finishing old ones"],
  obsessions: ["sorting games into comfort moods", "decorating rooms before quests", "collecting every display item"],
  visualCulture: ["pajamas and handheld console", "cozy gaming nook"],
  purchaseMotives: ["recognition of cozy gamer habits"],
};

const trueCrimeShortFormProfile: DynamicNicheProfile = {
  niche: "Sarcastic Fans of True Crime Short-Form Video Apps",
  dimensions: ["sarcastic commentary", "true crime clips", "short-form scrolling"],
  audience: "sarcastic short-form true crime viewers",
  rituals: [
    "reading comments before watching the clip",
    "scrolling late at night because autoplay started another case",
    "sending bizarre clips to the group chat",
  ],
  microRituals: [
    "reading comments before watching",
    "rewinding because the comments distracted them",
    "dinner waits while the comment thread keeps going",
    "falling asleep with a podcast still playing",
    "sending one bizarre case to the group chat",
  ],
  contradictions: ["criticizes dramatic editing but watches every second"],
  frustrations: ["autoplay starts another clip after midnight"],
  statusSignals: ["knows which comment thread has the real jokes"],
  insiderLanguage: ["autoplay", "comments", "case", "podcast", "group chat"],
  embarrassingTruths: ["search history needs legal counsel"],
  obsessions: ["checking comments before the actual clip"],
  visualCulture: ["short-form app comments", "dark-mode phone screen", "caption overlays"],
  purchaseMotives: ["instant recognition of late-night scrolling habits"],
};

const retroSportsFashionProfile: DynamicNicheProfile = {
  niche: "Retro Fashion Fans Who Enjoy Sports",
  dimensions: ["retro fashion", "sports nostalgia", "thrifted outfits"],
  audience: "fans who style vintage sportswear",
  rituals: ["scrolling for jerseys instead of likes", "checking thrift tags for old team colors"],
  microRituals: ["checking thrift tags before checking the size", "matching old jerseys to today's game", "scrolling resale listings during halftime"],
  contradictions: ["cares more about the fit than the final score"],
  frustrations: ["finding a perfect jersey with the wrong size"],
  statusSignals: ["spots authentic stitching from across the rack"],
  insiderLanguage: ["thrift tags", "jersey", "starter jacket", "halftime"],
  embarrassingTruths: ["owns more throwbacks than clean basics"],
  obsessions: ["hunting for the exact faded colorway"],
  visualCulture: ["thrift tags", "distressed jersey texture", "vintage scoreboards"],
  purchaseMotives: ["recognition of sportswear hunting rituals"],
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

assert.ok(
  recognitionLatencyScore("Dinner Can Wait The Comments Can't", trueCrimeShortFormProfile) >
  recognitionLatencyScore("Obsessed With True Crime And Snacks", trueCrimeShortFormProfile),
  "Expected exposed micro-ritual to beat behavior description",
);

assert.ok(
  scoreDynamicSlogan("Dinner Can Wait The Comments Can't", trueCrimeShortFormProfile) >
  scoreDynamicSlogan("Obsessed With True Crime And Snacks", trueCrimeShortFormProfile),
  "Expected instant-recognition micro-ritual to score above descriptive obsession",
);

assert.ok(
  recognitionLatencyScore("My Search History Needs Legal Counsel", trueCrimeShortFormProfile) >
  recognitionLatencyScore("I Find Humor In The Most Inappropriate Places", trueCrimeShortFormProfile),
  "Expected concrete exposure to beat explained personality",
);

assert.ok(
  scoreDynamicSlogan("I Find Humor In The Most Inappropriate Places", trueCrimeShortFormProfile) < 75,
  "Expected AI-ish personality explanation to be capped below strong-score range",
);

assert.ok(
  scoreDynamicSlogan("Vintage Sports: My Fashion Statement", retroSportsFashionProfile) < 80,
  "Expected low-latency broad category slogan to be capped below top-pick range",
);

assert.ok(
  scoreDynamicSlogan("Checking Thrift Tags Before The Score", retroSportsFashionProfile) >
  scoreDynamicSlogan("Vintage Sports: My Fashion Statement", retroSportsFashionProfile),
  "Expected exposed thrift-tag ritual to beat broad retro sports label",
);

assert.ok(
  scoreDynamicSlogan("Retro Fashion: A Timeless Game", retroSportsFashionProfile) < 85,
  "Expected broad tagline language to be capped below breakout-score range",
);

const dramaComparison = buildStructuralFingerprint("Comic Book Brows: More Drama Than My Life");
const gameComparison = buildStructuralFingerprint("More Invested In Their Game Than My Life");
assert.equal(
  dramaComparison.pattern,
  gameComparison.pattern,
  "Expected variable wording inside 'more X than Y' to share a structural fingerprint",
);
assert.equal(
  buildStructuralFingerprint("Commenting On Jerseys, Not Just Stats").pattern,
  buildStructuralFingerprint("Trading Jerseys, Not Just Stats").pattern,
  "Expected variable wording inside 'X, not just Y' to share a structural fingerprint",
);
assert.equal(
  buildStructuralFingerprint("Chasing Vintage Dreams, One Game At A Time").pattern,
  buildStructuralFingerprint("Collecting Memories, One Jersey At A Time").pattern,
  "Expected variable wording inside 'X, one Y at a time' to share a structural fingerprint",
);
assert.equal(
  classifyRhetoricalFamily("More Invested In Their Game Than My Life"),
  "COMPARISON",
  "Expected comparative scaffold classification",
);
assert.equal(
  classifyRhetoricalFamily("My Search History Needs Legal Counsel"),
  "IDENTITY",
  "Expected possessive identity classification",
);
assert.equal(
  classifyRhetoricalFamily("Check The Comments Before The Clip"),
  "PRIORITY",
  "Expected before/after priority classification",
);

assert.ok(
  thumbnailReadabilityScore("Scoreboard Before Small Talk") >
  thumbnailReadabilityScore("More Invested In Their Game Than My Life"),
  "Expected a compact visual footprint to improve thumbnail readability",
);

const structurallyDiversified = applyStructuralDiversityRanking([
  { slogan: "More Drama Than My Life", score: 92, finalScore: 92 },
  { slogan: "More Invested In Their Game Than My Life", score: 90, finalScore: 90 },
  { slogan: "More Coffee Than My Job", score: 88, finalScore: 88 },
  { slogan: "Scoreboard Before Small Talk", score: 84, finalScore: 84 },
  { slogan: "My Couch Knows Every Cozy Game", score: 83, finalScore: 83 },
  { slogan: "Cancel Plans Check The Comments", score: 82, finalScore: 82 },
]);
assert.deepEqual(
  structurallyDiversified.slice(0, 4).map((entry) => entry.slogan),
  [
    "More Drama Than My Life",
    "Scoreboard Before Small Talk",
    "My Couch Knows Every Cozy Game",
    "Cancel Plans Check The Comments",
  ],
  "Expected distinct rhetorical structures to outrank repeated comparison frames",
);
assert.ok(
  structurallyDiversified.find((entry) => entry.slogan === "More Invested In Their Game Than My Life")!
    .structuralDiversityPenalty >= 28,
  "Expected repeated structural fingerprints to receive a material batch penalty",
);

console.log("Dynamic slogan regression gates passed");
