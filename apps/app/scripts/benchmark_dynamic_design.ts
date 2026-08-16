import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type {
  DynamicDesignStrategy,
  DynamicVisualConcept,
  SloganVisualMeaning,
  CompositionPlan,
  VisualFingerprint,
} from "../lib/ai/dynamicDesignPrompt";
import type { DynamicNicheProfile } from "../lib/ai/dynamicNicheProfile";
import { getVisualReleasePresentation } from "../lib/utils/visualReleasePresentation";

function loadLocalEnvironment(): void {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
  ];
  const envPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!envPath) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function allowServerModulesInScript(): void {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Module = require("node:module");
  const originalLoad = Module._load;
  Module._load = function patchedModuleLoad(request: string, parent: unknown, isMain: boolean) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

const benchmarkStyles = [
  "Vintage Distressed",
  "Hand-Drawn",
  "Bold Graphic",
  "Minimalist Vector",
  "Y2K",
];

const syntheticProfile: DynamicNicheProfile = {
  niche: "Night-shift gardeners",
  dimensions: ["post-shift plant care"],
  audience: "gardeners who check their plants after working overnight",
  rituals: ["checking seedlings before taking off work boots"],
  contradictions: ["too tired to garden but checks every leaf"],
  frustrations: ["noticing dry soil at bedtime"],
  statusSignals: ["spots a thirsty seedling in low light"],
  insiderLanguage: [],
  embarrassingTruths: ["the plants get checked before sleep"],
  obsessions: ["one last leaf inspection"],
  visualCulture: ["grow light over a dim potting bench"],
  purchaseMotives: ["recognition of the after-work ritual"],
  latentLifestyleModel: {
    observableScenes: [],
    privateRituals: ["checking seedlings after work"],
    participationHabits: [],
    involuntaryBehaviors: ["turning on the grow light before removing work boots"],
    seasonalBehaviors: [],
    comfortObjects: ["worn watering can"],
    collectionHabits: [],
    environments: ["dim potting bench"],
    recurringObjects: ["grow light", "work boots"],
    socialInteractions: [],
    tensions: ["exhaustion versus care"],
    identitySignals: [],
    repeatedDecisions: ["checks one more leaf"],
    tinyFrustrations: [],
    smallVictories: ["catches a wilt before bed"],
    unspokenRules: [],
    emotionalRewards: ["quiet relief"],
  },
};

const baseMeaning: SloganVisualMeaning = {
  literalSubject: "one more plant check",
  impliedMeaning: "care wins over exhaustion",
  behavioralTruth: "checks every leaf after a night shift",
  emotionalPayoff: "quiet insider recognition",
  visualizableAction: "a work boot nudges a grow-light switch while one seedling turns toward the light",
  strongestContrast: "exhaustion versus care",
};

const baseConcept: DynamicVisualConcept = {
  coreMessage: "care overrides the end of the shift",
  emotionalTone: ["weary", "devoted"],
  behavioralMoment: ["checking one seedling before bed"],
  visualMetaphors: ["the grow light acts as a second sunrise"],
  relevantObjects: ["work boot", "grow light", "seedling"],
  environmentalCues: ["dim potting bench"],
  typographyPersonality: ["sleepy cadence interrupted by ONE MORE"],
  compositionIntent: "make the boot-to-switch action lead into the exact text",
  focalHierarchy: ["boot activating grow light", "exact text", "seedling"],
  supportingGraphics: ["one seedling"],
  avoidElements: ["generic garden-tool collage"],
  printStrategy: {
    silhouetteStrength: "single diagonal action",
    detailDensity: "controlled",
    contrastNeed: "bright plant against dark garment",
    viewingDistance: "thumbnail first",
  },
  recommendedDesignMode: { mode: "HYBRID", confidence: 0.9, rationale: "fixture" },
  modeSignals: { typographyStrength: 0.85, humanActionStrength: 0.8, mascotPotential: 0.1, standaloneIllustrationStrength: 0.65 },
};

const baseComposition: CompositionPlan = {
  primaryFocus: "hybrid",
  hierarchy: [
    { element: "boot activating grow light", importance: 100 },
    { element: "exact slogan", importance: 90 },
  ],
  textTreatment: "words follow the switch-to-light motion",
  illustrationRelationship: "the switched-on light reveals the final words",
  negativeSpaceStrategy: "open space around boot and seedling",
  silhouette: "one diagonal boot-light-plant gesture",
  balance: "asymmetrical action balanced by text",
  visibleTextRequired: true,
  maxPrimarySubjects: 1,
};

function makeSyntheticStrategy(index: number): DynamicDesignStrategy {
  const focus: DynamicDesignStrategy["composition"]["primaryFocus"][] = ["hybrid", "typography", "illustration", "hybrid"];
  const subjects = ["boot switching on grow light", "watering can forming a clock hand", "seedling lifting a sleep mask", "leaf shadow crossing a timecard"];
  const compositionTypes = ["diagonal cause-and-effect", "open typographic clock", "low-to-high reveal", "split-state overlap"];
  const metaphors = ["second sunrise", "borrowed time", "waking plant", "care clocks in"];
  const typographyRoles = ["revealed by light", "forms the clock face", "acts as the sleep mask", "stamps the timecard"];
  const relationships = ["light beam reveals the final phrase", "letterforms become rotating clock hands", "seedling pushes the words upward", "leaf shadow divides before and after states"];
  const negativeSpace = ["clear wedge around the light beam", "open clock center protects short words", "rising gap separates plant and phrase", "quiet split between shadow and timecard"];
  const balances = ["diagonal counterweight", "radial tension around an open center", "bottom-heavy form rising into type", "offset halves joined by one shadow"];
  const fingerprint: VisualFingerprint = {
    primarySubject: subjects[index],
    compositionType: compositionTypes[index],
    metaphorType: metaphors[index],
    typographyRole: typographyRoles[index],
    graphicRelationship: `graphic relationship ${index}`,
  };
  const quality = {
    thumbnailLegibility: 90,
    focalClarity: 89,
    silhouetteStrength: 87,
    textGraphicIntegration: 90,
    contrast: 91,
    printability: 92,
    visualOriginality: 84,
    sloganReinforcement: 93,
  };

  return {
    slogan: index === 0 ? "Still Checking Every Leaf After My Shift" : `Synthetic behavioral slogan ${index}`,
    meaning: { ...baseMeaning, visualizableAction: subjects[index] },
    concept: {
      ...baseConcept,
      visualMetaphors: [metaphors[index]],
      relevantObjects: [`object-${index}`],
      supportingGraphics: [`support-${index}`],
    },
    composition: {
      ...baseComposition,
      primaryFocus: focus[index],
      silhouette: compositionTypes[index],
      illustrationRelationship: relationships[index],
      negativeSpaceStrategy: negativeSpace[index],
      balance: balances[index],
    },
    complexity: {
      textDominance: index === 0 ? 0.75 : 0.45,
      illustrationDominance: index === 0 ? 0.25 : 0.55,
      maxPrimarySubjects: index === 0 ? 1 : 2,
      supportingDetailLevel: index === 0 ? "minimal" : "controlled",
    },
    requestedDesignMode: "AUTO",
    resolvedDesignMode: "HYBRID",
    designModeDecision: { mode: "HYBRID", confidence: 0.9, rationale: "fixture" },
    modeCompliance: { requestedMode: "AUTO", resolvedMode: "HYBRID", modeComplianceScore: 95, violations: [] },
    quality,
    visualImpact: 90,
    fingerprint,
    diversityPenalty: 0,
    qualityGatePassed: true,
    batchRepairAttempts: 0,
    prompt: "fixture",
  };
}

function canonicalizeRenderingStyle(prompt: string): string {
  return prompt.replace(/ART DIRECTION:\s*\n[^\n]*/i, "ART DIRECTION:\n[RENDERING_STYLE]");
}

async function runDeterministicBenchmark(): Promise<void> {
  const {
    analyzeDynamicDesignBatch,
    analyzeAutoModeDistribution,
    buildCompositionPlanForMode,
    buildDynamicImagePrompt,
    buildDynamicStyleVariants,
    buildVisualCacheKey,
    evaluateVisualBatchRelease,
    evaluateVisualReleaseGate,
    inferDesignMode,
    resolveDesignMode,
  } = await import("../lib/ai/dynamicDesignPrompt");
  const strategies = [0, 1, 2, 3].map(makeSyntheticStrategy);
  const variants = buildDynamicStyleVariants(
    {
      niche: syntheticProfile.niche,
      profile: syntheticProfile,
      garmentBackground: "dark",
      printBackground: "transparent",
      marketplace: "etsy",
    },
    strategies[0],
    benchmarkStyles,
  );

  assert.equal(variants.length, benchmarkStyles.length);
  assert.equal(new Set(variants.map((variant) => variant.semanticSignature)).size, 1, "Style variants changed semantic strategy");
  assert.equal(new Set(variants.map((variant) => canonicalizeRenderingStyle(variant.prompt))).size, 1, "Style changed prompt content outside ART DIRECTION");
  for (const variant of variants) {
    assert.ok(variant.prompt.includes(`ART DIRECTION:\n${variant.style}`), `Missing rendering style ${variant.style}`);
  }

  const autoCases = [
    { slogan: "NOPE NOT TODAY", signals: { typographyStrength: 0.92, humanActionStrength: 0.1, mascotPotential: 0.1, standaloneIllustrationStrength: 0.2 } },
    { slogan: "STILL NOT SORRY", signals: { typographyStrength: 0.88, humanActionStrength: 0.2, mascotPotential: 0.15, standaloneIllustrationStrength: 0.25 } },
    { slogan: "ONE MORE REP BEFORE SUNRISE", signals: { typographyStrength: 0.78, humanActionStrength: 0.82, mascotPotential: 0.1, standaloneIllustrationStrength: 0.45 } },
    { slogan: "ROOTED BUT RESTLESS", signals: { typographyStrength: 0.8, humanActionStrength: 0.2, mascotPotential: 0.15, standaloneIllustrationStrength: 0.76 } },
    { slogan: "FORM FIRST EGO LAST", signals: { typographyStrength: 0.42, humanActionStrength: 0.91, mascotPotential: 0.1, standaloneIllustrationStrength: 0.45 } },
    { slogan: "THE LAST LAP IS PERSONAL", signals: { typographyStrength: 0.4, humanActionStrength: 0.87, mascotPotential: 0.12, standaloneIllustrationStrength: 0.5 } },
    { slogan: "CHAOS HAS WHISKERS", signals: { typographyStrength: 0.35, humanActionStrength: 0.2, mascotPotential: 0.92, standaloneIllustrationStrength: 0.55 } },
    { slogan: "TINY DRAGON BIG ATTITUDE", signals: { typographyStrength: 0.4, humanActionStrength: 0.15, mascotPotential: 0.88, standaloneIllustrationStrength: 0.52 } },
    { slogan: "GRAVITY TAKES THE NIGHT OFF", signals: { typographyStrength: 0.3, humanActionStrength: 0.15, mascotPotential: 0.2, standaloneIllustrationStrength: 0.93 } },
    { slogan: "THE MOON BORROWS MY SHADOW", signals: { typographyStrength: 0.28, humanActionStrength: 0.2, mascotPotential: 0.18, standaloneIllustrationStrength: 0.89 } },
  ];
  const autoStrategies = autoCases.map((testCase) => ({
    requestedDesignMode: "AUTO" as const,
    resolvedDesignMode: inferDesignMode(testCase.slogan, testCase.signals).mode,
  }));
  const autoDistribution = analyzeAutoModeDistribution(autoStrategies);
  assert.equal(autoDistribution.collapsed, false, "AUTO fixture distribution collapsed into too few modes");
  assert.equal(autoDistribution.distinctModes, 5);
  assert.ok(autoDistribution.dominantShare <= 0.4);

  const overrideMeaning = { ...baseMeaning, visualizableAction: "one human lifter performs a deep squat under a barbell" };
  const overridePrompts = Object.fromEntries((["TEXT_ONLY", "HYBRID", "CHARACTER", "CARTOON", "ILLUSTRATION_ONLY"] as const).map((mode) => {
    const composition = buildCompositionPlanForMode(baseComposition, "ONE MORE LEAF", mode);
    assert.equal(resolveDesignMode(mode, "ONE MORE LEAF", baseConcept).mode, mode, `${mode}: user override was not preserved`);
    const prompt = buildDynamicImagePrompt({
      niche: syntheticProfile.niche,
      slogan: "ONE MORE LEAF",
      profile: syntheticProfile,
      style: "Bold Graphic",
      garmentBackground: "dark",
      printBackground: "transparent",
      requestedDesignMode: mode,
      resolvedDesignMode: mode,
    }, overrideMeaning, baseConcept, composition);
    return [mode, { composition, prompt }];
  }));

  const textOverride = overridePrompts.TEXT_ONLY;
  assert.equal(textOverride.composition.primaryFocus, "typography");
  assert.equal(textOverride.composition.maxPrimarySubjects, 0);
  assert.ok(!textOverride.prompt.includes(overrideMeaning.visualizableAction), "TEXT_ONLY retained a figurative visual-story directive");
  assert.ok(!textOverride.prompt.includes(baseComposition.silhouette), "TEXT_ONLY retained the illustration-led silhouette");
  assert.ok(textOverride.prompt.includes("Typography is the complete artwork"));

  const illustrationOverride = overridePrompts.ILLUSTRATION_ONLY;
  assert.equal(illustrationOverride.composition.visibleTextRequired, false);
  assert.ok(illustrationOverride.prompt.includes("SOURCE CONCEPT:"));
  assert.ok(illustrationOverride.prompt.includes("Do not display this phrase as text"));
  assert.ok(!illustrationOverride.prompt.includes("EXACT VISIBLE TEXT:"));
  assert.ok(!illustrationOverride.prompt.includes("Typography personality:"));

  assert.match(overridePrompts.CHARACTER.prompt, /one primary human figure/i);
  assert.equal(overridePrompts.CHARACTER.composition.maxPrimarySubjects, 1);
  assert.match(overridePrompts.CARTOON.prompt, /one stylized character/i);
  assert.match(overridePrompts.CARTOON.composition.hierarchy[0].element, /stylized cartoon or mascot character/i);
  assert.equal(overridePrompts.HYBRID.composition.primaryFocus, "hybrid");
  assert.match(overridePrompts.HYBRID.prompt, /Typography and one meaning-bearing illustration share the visual hierarchy/i);
  assert.notEqual(
    buildVisualCacheKey("niche", "slogan", "TEXT_ONLY", "Bold Graphic"),
    buildVisualCacheKey("niche", "slogan", "HYBRID", "Bold Graphic"),
    "Resolved design mode must partition the visual cache key",
  );

  const metrics = analyzeDynamicDesignBatch(strategies);
  assert.ok(metrics, "A valid four-strategy batch must produce metrics");
  assert.equal(evaluateVisualReleaseGate(metrics).passed, true);
  assert.equal(metrics.primaryFocusDiversity, 1);
  assert.equal(metrics.compositionFamilyDiversity, 1);
  assert.equal(metrics.visualMetaphorDiversity, 1);
  assert.equal(metrics.supportingObjectOverlap, 0);
  assert.equal(metrics.typographyRoleDiversity, 1);
  assert.equal(metrics.fingerprintCollisionRate, 0);
  assert.ok(metrics.commercialQualityScore >= 89);

  const failedGate = evaluateVisualReleaseGate({
    ...metrics,
    visualMetaphorDiversity: 0.5,
    commercialQualityScore: 69,
  }, 2);
  assert.equal(failedGate.passed, false);
  assert.equal(failedGate.status, "REVIEW");
  assert.equal(failedGate.evaluated, true);
  assert.equal(failedGate.repairAttempts, 2);
  assert.deepEqual(
    failedGate.warnings.map((warning) => warning.metric).sort(),
    ["commercialQualityScore", "visualMetaphorDiversity"],
    "The release gate must expose each unresolved soft-threshold failure after two repairs",
  );

  const emptyRelease = evaluateVisualBatchRelease([]);
  assert.equal(emptyRelease.metrics, null);
  assert.equal(emptyRelease.releaseGate.status, "NOT_EVALUATED");
  assert.equal(emptyRelease.releaseGate.evaluated, false);
  assert.deepEqual(emptyRelease.releaseGate.unresolvedMetrics, []);
  const unevaluatedUi = getVisualReleasePresentation({ status: "REVIEW", evaluated: false });
  assert.equal(unevaluatedUi.label, "pending");
  assert.equal(unevaluatedUi.showReviewWarning, false, "REVIEW must never render for an unevaluated gate");

  for (const sampleSize of [1, 2]) {
    const undersizedRelease = evaluateVisualBatchRelease(strategies.slice(0, sampleSize));
    assert.equal(undersizedRelease.metrics, null);
    assert.equal(undersizedRelease.releaseGate.status, "INSUFFICIENT_SAMPLE");
    assert.equal(undersizedRelease.releaseGate.sampleSize, sampleSize);
  }

  const incompleteStrategies = strategies.slice(0, 3).map((strategy) => ({
    ...strategy,
    quality: { ...strategy.quality, thumbnailLegibility: undefined },
  }));
  const incompleteRelease = evaluateVisualBatchRelease(incompleteStrategies);
  assert.equal(incompleteRelease.metrics, null, "Absent quality scores must not be averaged as zero");
  assert.notEqual(incompleteRelease.releaseGate.status, "REVIEW");

  const collapsingBatch = strategies.slice(0, 3).map((strategy, index) => ({
    ...strategy,
    batchRepairAttempts: 2,
    fingerprint: { ...strategies[0].fingerprint },
    composition: { ...strategies[0].composition },
    concept: { ...strategies[0].concept },
    slogan: `Collapsing strategy ${index}`,
  }));
  const collapsingRelease = evaluateVisualBatchRelease(collapsingBatch);
  assert.equal(collapsingRelease.releaseGate.status, "REVIEW");
  assert.equal(collapsingRelease.releaseGate.repairAttempts, 2, "Release metadata must report actual repair attempts");

  const alternateComplexity = strategies.map((strategy) => ({
    ...strategy,
    complexity: { ...strategy.complexity, supportingDetailLevel: "moderate" as const },
  }));
  const alternateMetrics = analyzeDynamicDesignBatch(alternateComplexity);
  assert.ok(alternateMetrics, "A valid alternate-complexity batch must produce metrics");
  assert.equal(
    alternateMetrics.commercialQualityScore,
    metrics.commercialQualityScore,
    "Complexity must not inflate commercial quality",
  );

  console.log("Deterministic dynamic-design benchmark passed");
  console.log("AUTO mode distribution");
  console.table(Object.entries(autoDistribution.counts).map(([mode, count]) => ({
    mode,
    count,
    percentage: `${autoDistribution.percentages[mode as keyof typeof autoDistribution.percentages]}%`,
  })));
  console.table([metrics]);
}

const liveCases = [
  { niche: "Night-shift gardeners who check seedlings after work", audience: "overnight workers with small home gardens" },
  { niche: "Families whose exotic pets interrupt household routines", audience: "parents and children caring for geckos or similar pets" },
  { niche: "Vintage sportswear thrift hunters", audience: "fans who care about rare faded jerseys more than final scores" },
  { niche: "Pre-work gym regulars before sunrise", audience: "consistent early-morning lifters" },
  { niche: "Minimalist office humor built around short blunt phrases", audience: "office workers who prefer dry understated jokes" },
  { niche: "Surreal astronomy metaphors designed to work without lettering", audience: "stargazers who collect symbolic graphic tees" },
];

async function runLiveBenchmark(): Promise<void> {
  assert.ok(process.env.OPENAI_API_KEY, "OPENAI_API_KEY is required for --live");
  const [{ runEliteSloganEngine }, design] = await Promise.all([
    import("../lib/ai/sloganEngine"),
    import("../lib/ai/dynamicDesignPrompt"),
  ]);
  const cliLimit = process.argv.find((argument) => argument.startsWith("--limit="))?.split("=")[1];
  const cliStart = process.argv.find((argument) => argument.startsWith("--start="))?.split("=")[1];
  const requestedStart = Number(cliStart ?? 0);
  const requestedLimit = Number(cliLimit ?? process.env.DESIGN_BENCHMARK_LIMIT ?? liveCases.length);
  const start = Number.isFinite(requestedStart) ? Math.max(0, requestedStart) : 0;
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, requestedLimit) : liveCases.length;
  const cases = liveCases.slice(start, start + limit);
  const summaries: Array<Record<string, string | number>> = [];
  const liveAutoStrategies: Array<Pick<DynamicDesignStrategy, "requestedDesignMode" | "resolvedDesignMode">> = [];

  for (const testCase of cases) {
    console.log(`\nGenerating live benchmark: ${testCase.niche}`);
    const sloganResult = await runEliteSloganEngine({
      niche: testCase.niche,
      audience: testCase.audience,
      execMode: "elite",
      cacheTtlSec: 0,
    });
    assert.ok(sloganResult.dynamicProfile, `${testCase.niche}: dynamic profile missing`);
    assert.ok(sloganResult.slogans.length >= 5, `${testCase.niche}: fewer than five winning slogans`);

    const strategies = await design.generateDynamicDesignBatch({
      niche: testCase.niche,
      slogans: sloganResult.slogans.slice(0, 10),
      profile: sloganResult.dynamicProfile,
      style: "Bold Graphic",
      garmentBackground: "either",
      printBackground: "transparent",
      marketplace: "general",
    });
    const release = design.evaluateVisualBatchRelease(strategies);
    liveAutoStrategies.push(...strategies);
    const nicheModeDistribution = design.analyzeAutoModeDistribution(strategies);
    const metrics = release.metrics;
    assert.ok(metrics, `${testCase.niche}: valid visual batch was not evaluated`);
    const releaseGate = release.releaseGate;
    console.table([{ niche: testCase.niche, ...metrics, autoModeMix: Object.entries(nicheModeDistribution.counts).filter(([, count]) => count > 0).map(([mode, count]) => `${mode}:${count}`).join(" "), collapsedStrategyIndexes: metrics.collapsedStrategyIndexes.join(",") || "none" }]);
    assert.ok(metrics.primaryFocusDiversity >= 0.667, `${testCase.niche}: primary-focus diversity collapsed`);
    assert.ok(metrics.compositionFamilyDiversity >= 0.5, `${testCase.niche}: composition-family diversity collapsed`);
    assert.ok(metrics.visualMetaphorDiversity >= 0.5, `${testCase.niche}: visual-metaphor diversity collapsed`);
    assert.ok(metrics.supportingObjectOverlap <= 0.5, `${testCase.niche}: supporting-object overlap too high`);
    assert.ok(metrics.typographyRoleDiversity >= 0.4, `${testCase.niche}: typography-role diversity collapsed`);
    assert.ok(metrics.fingerprintCollisionRate <= 0.25, `${testCase.niche}: fingerprint collisions too high`);
    assert.ok(metrics.averageThumbnailLegibility >= 65, `${testCase.niche}: thumbnail score too low`);
    assert.ok(metrics.averagePrintability >= 70, `${testCase.niche}: printability score too low`);
    assert.ok(metrics.averageSloganReinforcement >= 65, `${testCase.niche}: slogan reinforcement too low`);
    assert.ok(metrics.commercialQualityScore >= 68, `${testCase.niche}: commercial quality too low`);
    assert.equal(releaseGate.passed, true, `${testCase.niche}: visual release gate still has warnings after repair ceiling`);

    const variants = design.buildDynamicStyleVariants(
      {
        niche: testCase.niche,
        profile: sloganResult.dynamicProfile,
        garmentBackground: "either",
        printBackground: "transparent",
        marketplace: "general",
      },
      strategies[0],
      benchmarkStyles,
    );
    assert.equal(new Set(variants.map((variant) => variant.semanticSignature)).size, 1, `${testCase.niche}: cross-style semantics drifted`);
    assert.equal(new Set(variants.map((variant) => canonicalizeRenderingStyle(variant.prompt))).size, 1, `${testCase.niche}: style changed non-rendering instructions`);

    const { collapsedStrategyIndexes, ...scalarMetrics } = metrics;
    summaries.push({
      niche: testCase.niche,
      ...scalarMetrics,
      collapsedStrategyIndexes: collapsedStrategyIndexes.join(",") || "none",
    });
  }

  console.log("\nLive dynamic-design benchmark passed");
  const liveModeDistribution = design.analyzeAutoModeDistribution(liveAutoStrategies);
  console.log("AUTO mode distribution across live niches");
  console.table(Object.entries(liveModeDistribution.counts).map(([mode, count]) => ({
    mode,
    count,
    percentage: `${liveModeDistribution.percentages[mode as keyof typeof liveModeDistribution.percentages]}%`,
  })));
  if (liveModeDistribution.sampleSize >= 20) {
    assert.equal(liveModeDistribution.collapsed, false, `AUTO mode collapsed into ${liveModeDistribution.dominantMode} at ${Math.round(liveModeDistribution.dominantShare * 100)}%`);
  }
  console.table(summaries);
}

async function main(): Promise<void> {
  loadLocalEnvironment();
  allowServerModulesInScript();
  await runDeterministicBenchmark();
  if (process.argv.includes("--live")) await runLiveBenchmark();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
