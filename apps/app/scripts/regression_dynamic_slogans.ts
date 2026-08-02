import assert from "node:assert/strict";
import {
  applyStructuralDiversityRanking,
  behavioralContradictionScore,
  buildStructuralFingerprint,
  categoryDescriptionPenalty,
  classifyRhetoricalFamily,
  deriveDynamicRankingWeights,
  deriveSloganLengthBudget,
  type DynamicNicheProfile,
  evaluateAdaptiveBrevity,
  evaluateCompressionMeaningRetention,
  explanatoryLanguagePenalty,
  genericMoodPenalty,
  insiderWordplayScore,
  normalizeDynamicNicheProfile,
  passesDimensionCoverage,
  recognitionLatencyScore,
  recognitionProbabilityScore,
  rejectsPatternLeakage,
  ritualRecognitionScore,
  scoreDynamicSlogan,
  semanticCompressionScore,
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

const whimsicalExoticPetsProfile: DynamicNicheProfile = {
  niche: "Whimsical Families with Exotic Pets",
  dimensions: ["family routines", "exotic pet care", "whimsical humor"],
  audience: "families whose unusual pets reshape everyday household routines",
  rituals: ["counting feeder crickets before breakfast", "searching the room after a gecko escape"],
  microRituals: ["checking the terrarium latch twice", "moving tea-party props away from the gecko"],
  contradictions: ["tiny pet creates a whole-house search party"],
  frustrations: ["one missing cricket becomes everyone's problem"],
  statusSignals: ["spots an open terrarium latch across the room"],
  insiderLanguage: ["feeder crickets", "terrarium latch", "heat lamp"],
  embarrassingTruths: ["the gecko has interrupted family dinner again"],
  obsessions: ["recounting crickets after every enclosure cleanup"],
  visualCulture: ["terrarium latch", "cricket container", "tiny tea-party props"],
  purchaseMotives: ["recognition of unusual household pet routines"],
  latentLifestyleModel: {
    observableScenes: [],
    privateRituals: ["checking the heat lamp before bed"],
    environments: ["family room beside the terrarium"],
    recurringObjects: ["terrarium latch", "cricket container", "heat lamp"],
    socialInteractions: ["recruiting the family for another gecko search"],
    tensions: ["careful enclosure routine versus an opportunistic escape"],
    identitySignals: ["notices a shifted latch immediately"],
    repeatedDecisions: ["counts the feeder crickets one more time"],
    tinyFrustrations: ["a cricket loose behind the furniture"],
    smallVictories: ["finds the gecko before it reaches the hallway"],
    unspokenRules: ["close the latch before answering anyone"],
    emotionalRewards: ["the whole family laughs once the pet is safely back"],
  },
};

const earlyMorningGymProfile: DynamicNicheProfile = {
  niche: "Gym Lights and Early Mornings",
  dimensions: ["pre-work training"],
  audience: "consistent pre-work gym-goers",
  rituals: [],
  microRituals: [],
  contradictions: [],
  frustrations: [],
  statusSignals: [],
  insiderLanguage: [],
  embarrassingTruths: [],
  obsessions: [],
  visualCulture: [],
  purchaseMotives: [],
  latentLifestyleModel: {
    identityDirection: "proud_participant",
    observableScenes: [
      {
        who: "the first regular through the door",
        where: "an almost-empty weight room",
        doing: "setting up the first lift",
        before: "the morning commute",
        after: "watching daylight arrive on the drive to work",
        recurringObjects: ["packed gym bag", "water bottle", "weight rack"],
        environmentalConditions: ["dark car park", "quiet room", "cold morning"],
        socialContext: ["only a few regulars are present"],
        emotionalStates: ["disciplined solitude", "quiet pride"],
      },
    ],
    privateRituals: ["packing the gym bag before bed"],
    environments: ["dark streets before the commute"],
    recurringObjects: ["alarm", "locker", "gym lights"],
    socialInteractions: ["recognizing the same few early regulars without small talk"],
    tensions: ["warm bed versus a commitment already made"],
    identitySignals: ["arriving before the room fills up"],
    repeatedDecisions: ["turning off the alarm without negotiating"],
    tinyFrustrations: ["a cold steering wheel on the drive in"],
    smallVictories: ["finishing the first lift before daylight"],
    unspokenRules: ["keep the room quiet until everyone is awake"],
    emotionalRewards: ["leaving with the hardest decision already won"],
  },
};

const gothicBookProfile: DynamicNicheProfile = {
  niche: "Gothic Book Lovers During Autumn",
  dimensions: ["gothic fiction", "autumn reading", "book collecting"],
  audience: "gothic book readers with autumn reading rituals",
  rituals: ["building a seasonal gothic reading list", "reading gothic fiction by candlelight"],
  microRituals: [
    "adding another gothic title to the autumn reading list",
    "lighting a candle before opening the book",
    "checking used shelves for rare gothic editions",
    "bringing cider to a gothic trope debate",
    "checking the spine before checking the price",
    "reordering the reading list when the weather turns",
  ],
  contradictions: ["collects more autumn reading than one season can hold"],
  frustrations: ["finding a rare edition with a damaged spine"],
  statusSignals: ["recognizes obscure gothic editions"],
  insiderLanguage: ["gothic tropes", "rare edition", "reading list", "candlelight"],
  embarrassingTruths: ["the autumn reading list grows faster than it gets read"],
  obsessions: ["hunting used shelves for rare gothic books"],
  visualCulture: ["candlelit pages", "weathered book spines", "mug of cider"],
  purchaseMotives: ["recognition of private autumn reading rituals"],
  latentLifestyleModel: {
    observableScenes: [],
    privateRituals: ["reading by candlelight"],
    participationHabits: [
      "carries the current novel from room to room",
      "reads one planned chapter until well past bedtime",
      "highlights favorite passages for a later reread",
    ],
    seasonalBehaviors: [
      "switches to gothic novels every October",
      "re-reads a favorite gothic classic each fall",
      "buys autumn candles specifically for evening reading",
    ],
    comfortObjects: ["reading tea", "soft reading blanket", "autumn candle", "bookmark"],
    collectionHabits: [
      "buys books faster than they get read",
      "stacks unread books on purpose",
      "collects beautiful editions of gothic classics",
    ],
    environments: ["used bookshop", "candlelit reading chair"],
    recurringObjects: ["cider mug", "reading list", "rare edition"],
    socialInteractions: ["debating gothic tropes over cider"],
    tensions: ["finite autumn nights versus an expanding reading list"],
    identitySignals: ["spots rare gothic editions on used shelves"],
    repeatedDecisions: ["adds one more gothic title to the seasonal list"],
    tinyFrustrations: ["a damaged spine on a rare find"],
    smallVictories: ["finds an uncommon edition in the used stacks"],
    unspokenRules: ["candlelight starts the autumn reading session"],
    emotionalRewards: ["settling into a gothic story on a cold evening"],
  },
};

const gothicStandardBudget = deriveSloganLengthBudget(gothicBookProfile, "standard");
const gothicCompactBudget = deriveSloganLengthBudget(gothicBookProfile, "compact");
const gothicStatementBudget = deriveSloganLengthBudget(gothicBookProfile, "statement");
assert.deepEqual(
  gothicStandardBudget,
  {
    idealWords: 5,
    maxWords: 8,
    idealCharacters: 38,
    maxCharacters: 50,
    targetReadTimeMs: 1300,
  },
  "Expected evidence density to tighten the ideal while preserving room for a complex crossover niche",
);
assert.ok(
  gothicCompactBudget.maxWords < gothicStandardBudget.maxWords &&
    gothicCompactBudget.maxCharacters < gothicStandardBudget.maxCharacters,
  "Expected compact layouts to receive a tighter adaptive budget",
);
assert.ok(
  gothicCompactBudget.idealWords < gothicStandardBudget.idealWords &&
    gothicStandardBudget.idealWords < gothicStatementBudget.idealWords,
  "Expected each layout mode to have a distinct ideal length",
);
const wideCompactCandidate = evaluateAdaptiveBrevity(
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  gothicCompactBudget,
);
assert.ok(
  wideCompactCandidate.characterCount <= gothicCompactBudget.maxCharacters &&
    wideCompactCandidate.visualWidth > gothicCompactBudget.maxCharacters,
  "Expected the visual-width fixture to fit by characters but overflow typographically",
);
assert.equal(
  wideCompactCandidate.passes,
  false,
  "Expected visual-width overflow to fail even when raw character count fits",
);

const compactWeights = deriveDynamicRankingWeights("compact");
const standardWeights = deriveDynamicRankingWeights("standard");
const statementWeights = deriveDynamicRankingWeights("statement");
for (const [layout, weights] of Object.entries({ compactWeights, standardWeights, statementWeights })) {
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  assert.ok(
    Math.abs(totalWeight - 1) < 0.0001,
    `Expected ${layout} ranking weights to total 1, received ${totalWeight}`,
  );
}
assert.ok(
  compactWeights.brevity + compactWeights.visualWidth >
    standardWeights.brevity + standardWeights.visualWidth,
  "Expected compact ranking to emphasize brevity and visual width",
);
assert.ok(
  statementWeights.truth + statementWeights.contradiction >
    compactWeights.truth + compactWeights.contradiction,
  "Expected statement ranking to emphasize truth and narrative tension",
);

const compressedGothicCandidates = [
  "Spooky Reading Lists",
  "Candlelight Reading",
  "Autumn Gothic Fiction",
  "Rare Book Hunting",
  "Cider Trope Debates",
];
const gothicBrevityResults = compressedGothicCandidates.map((slogan) => ({
  slogan,
  brevity: evaluateAdaptiveBrevity(slogan, gothicStandardBudget),
}));
for (const item of gothicBrevityResults) {
  assert.equal(item.brevity.passes, true, `Expected compressed slogan to pass: ${item.slogan}`);
  assert.ok(
    item.brevity.wordCount <= gothicStandardBudget.maxWords,
    `Overlong slogan survived: ${item.slogan}`,
  );
  assert.ok(
    item.brevity.characterCount <= gothicStandardBudget.maxCharacters,
    `Visual-length overflow survived: ${item.slogan}`,
  );
}
const averageGothicWords = gothicBrevityResults.reduce(
  (sum, item) => sum + item.brevity.wordCount,
  0,
) / Math.max(gothicBrevityResults.length, 1);
assert.ok(averageGothicWords <= 5.5, `Average slogan length regressed: ${averageGothicWords}`);

assert.equal(
  evaluateAdaptiveBrevity(
    "Finding Rare Gothic Books Is My Kind Of Autumn Treasure Hunt",
    gothicStandardBudget,
  ).passes,
  false,
  "Expected an explanatory mini-sentence to fail the adaptive hard gate",
);
assert.ok(
  explanatoryLanguagePenalty("Sipping Cider While Debating Gothic Tropes") >
    explanatoryLanguagePenalty("Cider Trope Debates"),
  "Expected sentence-like cadence to receive an explanatory-language penalty",
);
assert.ok(
  semanticCompressionScore("Candlelight Reading", gothicBookProfile) >
    semanticCompressionScore("Autumn Stories", gothicBookProfile),
  "Expected a compact insider ritual to beat a broad seasonal description",
);

const genericCompression = evaluateCompressionMeaningRetention(
  "Finding Rare Books Before Anyone Else",
  "Rare Book Lover",
  gothicBookProfile,
);
const behavioralCompression = evaluateCompressionMeaningRetention(
  "Finding Rare Books Before Anyone Else",
  "Rare Book Hunting",
  gothicBookProfile,
);
assert.equal(
  genericCompression.preservesMeaning,
  false,
  "Expected compression to reject a generic identity label that drops the original action",
);
assert.equal(
  genericCompression.preservesActionEvidence,
  false,
  "Expected the meaning diagnostic to identify lost behavioral evidence",
);
assert.equal(
  behavioralCompression.preservesMeaning,
  true,
  "Expected compression to accept a shorter expression that retains behavioral evidence",
);

const crossNicheLayoutCases = [
  {
    profile: gothicBookProfile,
    behavioral: "Candlelight Reading",
    generic: "Gothic Book Lover",
    candidates: [
      ...compressedGothicCandidates,
      "Candlelight Reading Before The Cold Autumn Rain",
      "Candlelight Reading Outlasts The Cold Autumn Rain Again",
    ],
  },
  {
    profile: earlyMorningGymProfile,
    behavioral: "First Lift Before Daylight",
    generic: "Morning Gym Person",
    candidates: [
      "First Lift Before Daylight",
      "Cold Steering Wheel Commitment Kept",
      "Cold Steering Wheel Before First Lift",
      "Packed Gym Bag Before The Dark Morning Commute",
    ],
  },
  {
    profile: trueCrimeShortFormProfile,
    behavioral: "Comments Before The Clip",
    generic: "True Crime Fan",
    candidates: [
      "Comments Before The Clip",
      "Autoplay Past Midnight",
      "Comments Get Read Before The Actual Case Clip",
      "Comments Before Another Midnight Autoplay Case Starts Again",
    ],
  },
  {
    profile: whimsicalExoticPetsProfile,
    behavioral: "Crickets Before Gecko Escape",
    generic: "Whimsical Pet Family",
    candidates: [
      "Crickets Before Gecko Escape",
      "Terrarium Latch Checked Twice",
      "Crickets Counted Before The Gecko Escapes Again",
      "Tiny Gecko Tea Parties Require Emergency Cricket Groceries",
    ],
  },
  {
    profile: retroSportsFashionProfile,
    behavioral: "Thrift Tags Before Scores",
    generic: "Retro Sports Fan",
    candidates: [
      "Thrift Tags Before Scores",
      "Faded Jersey Hunt",
      "Thrift Tags Checked Before The Halftime Score",
      "Faded Jerseys Found Before Another Halftime Resale Search",
    ],
  },
];
const layoutModes = ["compact", "standard", "statement"] as const;
const layoutWordCounts: Record<(typeof layoutModes)[number], number[]> = {
  compact: [],
  standard: [],
  statement: [],
};

for (const regressionCase of crossNicheLayoutCases) {
  assert.ok(
    semanticCompressionScore(regressionCase.behavioral, regressionCase.profile) >
      semanticCompressionScore(regressionCase.generic, regressionCase.profile),
    `Expected compact behavioral evidence to beat a generic label for ${regressionCase.profile.niche}`,
  );
  assert.ok(
    recognitionProbabilityScore(regressionCase.behavioral, regressionCase.profile) >
      recognitionProbabilityScore(regressionCase.generic, regressionCase.profile),
    `Expected shared behavior to have higher self-recognition probability for ${regressionCase.profile.niche}`,
  );

  for (const layoutMode of layoutModes) {
    const budget = deriveSloganLengthBudget(regressionCase.profile, layoutMode);
    const survivors = regressionCase.candidates
      .map((slogan) => evaluateAdaptiveBrevity(slogan, budget))
      .filter((brevity) => brevity.passes);
    assert.ok(survivors.length > 0, `Expected ${layoutMode} survivors for ${regressionCase.profile.niche}`);
    for (const survivor of survivors) {
      assert.ok(
        survivor.visualWidth <= budget.maxCharacters,
        `Visual-width overflow survived in ${layoutMode}: ${regressionCase.profile.niche}`,
      );
      layoutWordCounts[layoutMode].push(survivor.wordCount);
    }
  }
}

const averageLayoutWords = Object.fromEntries(layoutModes.map((layoutMode) => [
  layoutMode,
  layoutWordCounts[layoutMode].reduce((sum, count) => sum + count, 0) /
    Math.max(layoutWordCounts[layoutMode].length, 1),
])) as Record<(typeof layoutModes)[number], number>;
assert.ok(
  averageLayoutWords.compact < averageLayoutWords.standard &&
    averageLayoutWords.standard < averageLayoutWords.statement,
  `Expected average word count to rise by layout: ${JSON.stringify(averageLayoutWords)}`,
);

const sparseMechanicalPencilProfile = normalizeDynamicNicheProfile(
  "Collectors Who Restore Mechanical Pencil Clips",
  undefined,
  {
    audience: "collectors who repair old mechanical pencils",
    latentLifestyleModel: {
      observableScenes: [
        {
          who: "a collector",
          where: "a small repair mat",
          doing: "carefully straightening a bent pocket clip",
          recurringObjects: ["precision pliers", "repair mat"],
        },
      ],
      privateRituals: ["testing the restored clip on a scrap of fabric"],
    },
  },
);

const normalizedBehavioralFacetProfile = normalizeDynamicNicheProfile(
  "Seasonal Collectors",
  undefined,
  {
    latentLifestyleModel: {
      participationHabits: ["checks the display shelf before buying another piece"],
      seasonalBehaviors: ["reorganizes the display at the start of winter"],
      comfortObjects: ["inspection cloth"],
      collectionHabits: ["tracks missing editions in a handwritten list"],
    },
  },
);
assert.deepEqual(
  {
    participationHabits: normalizedBehavioralFacetProfile.latentLifestyleModel?.participationHabits,
    seasonalBehaviors: normalizedBehavioralFacetProfile.latentLifestyleModel?.seasonalBehaviors,
    comfortObjects: normalizedBehavioralFacetProfile.latentLifestyleModel?.comfortObjects,
    collectionHabits: normalizedBehavioralFacetProfile.latentLifestyleModel?.collectionHabits,
  },
  {
    participationHabits: ["checks the display shelf before buying another piece"],
    seasonalBehaviors: ["reorganizes the display at the start of winter"],
    comfortObjects: ["inspection cloth"],
    collectionHabits: ["tracks missing editions in a handwritten list"],
  },
  "Expected niche-agnostic behavioral facets to survive profile normalization",
);

const plannedMorningWorkoutProfile = normalizeDynamicNicheProfile(
  "People Who Plan Morning Workouts but Keep Snoozing",
  undefined,
  {
    audience: "well-intentioned people whose morning workout plans often lose to the snooze button",
    latentLifestyleModel: {
      identityDirection: "self_deprecating_outsider",
      observableScenes: [
        {
          who: "a would-be morning gym-goer",
          where: "bedroom before dawn",
          doing: "moving the alarm later instead of getting dressed",
          before: "packing workout clothes the night before",
          after: "promising to try again tomorrow",
          recurringObjects: ["phone alarm", "unused gym bag"],
          environmentalConditions: ["dark room", "warm bed"],
          socialContext: [],
          emotionalStates: ["optimism followed by amused resignation"],
        },
      ],
      tensions: ["planned discipline versus immediate comfort"],
      repeatedDecisions: ["choosing one more snooze"],
      embarrassingTruths: ["the gym bag is better prepared than its owner"],
    },
  },
);

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

assert.equal(
  passesDimensionCoverage("Packed Gym Bag, Dark Car Park", earlyMorningGymProfile),
  true,
  "Expected nested lifestyle scenes and objects to participate in existing coverage gates",
);

assert.ok(
  ritualRecognitionScore("First Lift Before Daylight", earlyMorningGymProfile) >
  ritualRecognitionScore("Tracking Fitness Stats", earlyMorningGymProfile),
  "Expected an inferred recurring scene to outrank a generic adjacent fitness topic",
);

assert.ok(
  truthResonanceScore("Cold Steering Wheel, Commitment Kept", earlyMorningGymProfile) >
  truthResonanceScore("Fitness Apps And Meal Plans", earlyMorningGymProfile),
  "Expected a latent frustration and repeated decision to beat topic substitution",
);

assert.ok(
  scoreDynamicSlogan("First Lift Before Daylight", earlyMorningGymProfile) >
  scoreDynamicSlogan("Tracking Fitness Stats", earlyMorningGymProfile),
  "Expected the richer inferred lifestyle model to improve niche-specific ranking",
);

assert.equal(
  sparseMechanicalPencilProfile.latentLifestyleModel?.observableScenes.length,
  1,
  "Expected a sparse niche to preserve its one grounded scene without manufacturing a quota",
);
assert.equal(
  sparseMechanicalPencilProfile.latentLifestyleModel?.identityDirection,
  undefined,
  "Expected an ambiguous sparse profile not to default to proud participation",
);
assert.deepEqual(
  {
    dimensions: sparseMechanicalPencilProfile.dimensions,
    rituals: sparseMechanicalPencilProfile.rituals,
    contradictions: sparseMechanicalPencilProfile.contradictions,
    frustrations: sparseMechanicalPencilProfile.frustrations,
    statusSignals: sparseMechanicalPencilProfile.statusSignals,
    insiderLanguage: sparseMechanicalPencilProfile.insiderLanguage,
    visualCulture: sparseMechanicalPencilProfile.visualCulture,
  },
  {
    dimensions: [],
    rituals: [],
    contradictions: [],
    frustrations: [],
    statusSignals: [],
    insiderLanguage: [],
    visualCulture: [],
  },
  "Expected unsupported sparse-profile fields to remain empty instead of receiving fabricated detail",
);
assert.equal(
  passesDimensionCoverage("Bent Clip On The Repair Mat", sparseMechanicalPencilProfile),
  true,
  "Expected a single grounded sparse scene to remain useful to downstream relevance gates",
);

assert.equal(
  earlyMorningGymProfile.latentLifestyleModel?.identityDirection,
  "proud_participant",
  "Expected consistent early-gym participation to preserve a proud identity direction",
);
assert.equal(
  plannedMorningWorkoutProfile.latentLifestyleModel?.identityDirection,
  "self_deprecating_outsider",
  "Expected repeated snoozing to preserve a self-deprecating identity direction",
);
assert.notEqual(
  earlyMorningGymProfile.latentLifestyleModel?.identityDirection,
  plannedMorningWorkoutProfile.latentLifestyleModel?.identityDirection,
  "Expected closely related morning-workout profiles to support opposite identity directions",
);
const sleepyBehaviorUnderProudNicheName = normalizeDynamicNicheProfile(
  earlyMorningGymProfile.niche,
  undefined,
  plannedMorningWorkoutProfile,
);
assert.equal(
  sleepyBehaviorUnderProudNicheName.latentLifestyleModel?.identityDirection,
  "self_deprecating_outsider",
  "Expected normalization to preserve behavioral inference rather than override it with a niche-name check",
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
