import assert from "node:assert/strict";
import {
  behavioralContradictionScore,
  categoryDescriptionPenalty,
  type DynamicNicheProfile,
  recognitionLatencyScore,
  rejectsPatternLeakage,
  ritualRecognitionScore,
  scoreDynamicSlogan,
  truthResonanceScore,
} from "../lib/ai/dynamicNicheProfile";

type BenchmarkCase = {
  niche: string;
  profile: DynamicNicheProfile;
  winners: string[];
  weak: string[];
  thresholds: {
    averageFinalScore: number;
    averageRecognitionLatency: number;
    averageRitualRecognition: number;
    averageTruthResonance: number;
    maxPatternLeakage: number;
    maxCategoryDescriptionPenalty: number;
  };
};

type BenchmarkResult = ReturnType<typeof summarizeBenchmark>;

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function summarizeBenchmark(testCase: BenchmarkCase) {
  const winnerMetrics = testCase.winners.map((slogan) => ({
    slogan,
    finalScore: scoreDynamicSlogan(slogan, testCase.profile),
    recognitionLatency: recognitionLatencyScore(slogan, testCase.profile),
    ritualRecognition: ritualRecognitionScore(slogan, testCase.profile),
    truthResonance: truthResonanceScore(slogan, testCase.profile),
    patternLeakage: rejectsPatternLeakage(slogan) ? 1 : 0,
    categoryDescriptionPenalty: categoryDescriptionPenalty(slogan, testCase.profile),
  }));

  const weakScores = testCase.weak.map((slogan) => ({
    slogan,
    finalScore: scoreDynamicSlogan(slogan, testCase.profile),
  }));

  const summary = {
    niche: testCase.niche,
    averageFinalScore: average(winnerMetrics.map((entry) => entry.finalScore)),
    averageRecognitionLatency: average(winnerMetrics.map((entry) => entry.recognitionLatency)),
    averageRitualRecognition: average(winnerMetrics.map((entry) => entry.ritualRecognition)),
    averageTruthResonance: average(winnerMetrics.map((entry) => entry.truthResonance)),
    patternLeakage: winnerMetrics.reduce((sum, entry) => sum + entry.patternLeakage, 0),
    maxCategoryDescriptionPenalty: Math.max(...winnerMetrics.map((entry) => entry.categoryDescriptionPenalty)),
    weakestWinnerScore: Math.min(...winnerMetrics.map((entry) => entry.finalScore)),
    strongestWeakScore: Math.max(...weakScores.map((entry) => entry.finalScore)),
  };

  return { summary, winnerMetrics, weakScores };
}

function assertBenchmarkResult(result: BenchmarkResult, testCase: BenchmarkCase): void {
  const { summary } = result;

  assert.ok(
    summary.averageFinalScore >= testCase.thresholds.averageFinalScore,
    `${testCase.niche}: average final score ${summary.averageFinalScore} below ${testCase.thresholds.averageFinalScore}`,
  );
  assert.ok(
    summary.averageRecognitionLatency >= testCase.thresholds.averageRecognitionLatency,
    `${testCase.niche}: recognition latency ${summary.averageRecognitionLatency} below ${testCase.thresholds.averageRecognitionLatency}`,
  );
  assert.ok(
    summary.averageRitualRecognition >= testCase.thresholds.averageRitualRecognition,
    `${testCase.niche}: ritual recognition ${summary.averageRitualRecognition} below ${testCase.thresholds.averageRitualRecognition}`,
  );
  assert.ok(
    summary.averageTruthResonance >= testCase.thresholds.averageTruthResonance,
    `${testCase.niche}: truth resonance ${summary.averageTruthResonance} below ${testCase.thresholds.averageTruthResonance}`,
  );
  assert.ok(
    summary.patternLeakage <= testCase.thresholds.maxPatternLeakage,
    `${testCase.niche}: pattern leakage ${summary.patternLeakage} above ${testCase.thresholds.maxPatternLeakage}`,
  );
  assert.ok(
    summary.maxCategoryDescriptionPenalty <= testCase.thresholds.maxCategoryDescriptionPenalty,
    `${testCase.niche}: category penalty ${summary.maxCategoryDescriptionPenalty} above ${testCase.thresholds.maxCategoryDescriptionPenalty}`,
  );
  assert.ok(
    summary.weakestWinnerScore > summary.strongestWeakScore,
    `${testCase.niche}: weak slogan outranked or tied a benchmark winner`,
  );
}

const benchmarks: BenchmarkCase[] = [
  {
    niche: "True Crime Short-Form",
    profile: {
      niche: "Sarcastic Fans of True Crime Short-Form Video Apps",
      dimensions: ["sarcastic commentary", "short-form scrolling", "true crime clips"],
      audience: "sarcastic short-form true crime viewers",
      rituals: ["reading comments before watching the clip", "scrolling late at night because autoplay started another case", "sending bizarre clips to the group chat"],
      microRituals: ["reading comments before watching", "rewinding because the comments distracted them", "dinner waits while the comment thread keeps going", "falling asleep with a podcast still playing", "sending one bizarre case to the group chat"],
      contradictions: ["criticizes dramatic editing but watches every second"],
      frustrations: ["autoplay starts another clip after midnight"],
      statusSignals: ["knows which comment thread has the real jokes"],
      insiderLanguage: ["autoplay", "comments", "case", "podcast", "group chat"],
      embarrassingTruths: ["search history needs legal counsel"],
      obsessions: ["checking comments before the actual clip"],
      visualCulture: ["short-form app comments", "dark-mode phone screen", "caption overlays"],
      purchaseMotives: ["instant recognition of late-night scrolling habits"],
    },
    winners: [
      "Dinner Can Wait The Comments Can't",
      "Rewinding Because The Comments Distracted Me",
      "My Search History Needs Legal Counsel",
    ],
    weak: [
      "Obsessed With True Crime And Snacks",
      "I Find Humor In The Most Inappropriate Places",
      "True Crime Is My Hobby",
    ],
    thresholds: {
      averageFinalScore: 55,
      averageRecognitionLatency: 70,
      averageRitualRecognition: 60,
      averageTruthResonance: 70,
      maxPatternLeakage: 0,
      maxCategoryDescriptionPenalty: 0,
    },
  },
  {
    niche: "Cozy Gamer Culture",
    profile: {
      niche: "Cozy Gamer Culture",
      dimensions: ["cozy gamer backlog"],
      audience: "cozy game players",
      rituals: ["organizing game library by mood", "customizing avatars before playing", "decorating rooms before quests"],
      microRituals: ["opening the game just to sort the backlog", "spending bedtime picking an avatar outfit", "decorating the room before starting the quest"],
      contradictions: ["customizes avatar for hours but leaves games unfinished", "sets up cozy nooks instead of performance gear"],
      frustrations: ["too many unfinished games"],
      statusSignals: ["perfect mood-based game folders", "decor perfection instead of DPS"],
      insiderLanguage: ["backlog", "avatar customization", "DPS", "endgame"],
      embarrassingTruths: ["buys more games before finishing old ones"],
      obsessions: ["sorting games into comfort moods", "collecting every display item"],
      visualCulture: ["pajamas and handheld console", "cozy gaming nook"],
      purchaseMotives: ["recognition of cozy gamer habits"],
    },
    winners: [
      "Custom Avatars, Unfinished Games",
      "DPS? More Like Decor Perfection",
      "Opening The Game Just To Sort The Backlog",
    ],
    weak: [
      "Cozy Games Are My Happy Place",
      "Indie Games: My Guilty Pleasure",
      "Vintage Vibes",
    ],
    thresholds: {
      averageFinalScore: 60,
      averageRecognitionLatency: 25,
      averageRitualRecognition: 70,
      averageTruthResonance: 85,
      maxPatternLeakage: 0,
      maxCategoryDescriptionPenalty: 0,
    },
  },
  {
    niche: "Retro Sports Fashion",
    profile: {
      niche: "Retro Fashion Fans Who Enjoy Sports",
      dimensions: ["retro fashion", "sports nostalgia", "thrifted outfits"],
      audience: "fans who style vintage sportswear",
      rituals: ["scrolling for jerseys instead of likes", "checking thrift tags for old team colors"],
      microRituals: ["checking thrift tags before checking the size", "matching old jerseys to today's game", "scrolling resale listings during halftime"],
      contradictions: ["cares more about the fit than the final score"],
      frustrations: ["finding a perfect jersey with the wrong size"],
      statusSignals: ["spots authentic stitching from across the rack"],
      insiderLanguage: ["thrift tags", "starter jacket", "halftime"],
      embarrassingTruths: ["owns more throwbacks than clean basics"],
      obsessions: ["hunting for the exact faded colorway"],
      visualCulture: ["thrift tags", "distressed jersey texture", "vintage scoreboards"],
      purchaseMotives: ["recognition of sportswear hunting rituals"],
    },
    winners: [
      "Checking Thrift Tags Before The Score",
      "Scrolling For Jerseys, Not Likes",
      "Halftime Resale Listings Again",
    ],
    weak: [
      "Vintage Sports: My Fashion Statement",
      "Retro Fashion: A Timeless Game",
      "Retro Sports Mode",
    ],
    thresholds: {
      averageFinalScore: 55,
      averageRecognitionLatency: 65,
      averageRitualRecognition: 55,
      averageTruthResonance: 75,
      maxPatternLeakage: 0,
      maxCategoryDescriptionPenalty: 5,
    },
  },
];

const results = benchmarks.map(summarizeBenchmark);
console.table(results.map((result) => result.summary));
for (const result of results) {
  console.log(`\n${result.summary.niche} winner metrics`);
  console.table(result.winnerMetrics);
  console.log(`${result.summary.niche} weak scores`);
  console.table(result.weakScores);
}
results.forEach((result, index) => assertBenchmarkResult(result, benchmarks[index]));
console.log("Dynamic behavioral benchmark passed");
