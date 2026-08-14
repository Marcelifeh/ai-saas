import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { DynamicNicheProfile } from "../lib/ai/dynamicNicheProfile";
import type { DynamicDesignStrategy } from "../lib/ai/dynamicDesignPrompt";
import type { DynamicListingInput, DynamicListingResult, ListingMarketplace } from "../lib/ai/dynamicListingEngine";

function loadLocalEnvironment(): void {
  const candidates = [path.resolve(process.cwd(), ".env"), path.resolve(process.cwd(), "../../.env")];
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

type BenchmarkCase = {
  name: string;
  slogan: string;
  profile: DynamicNicheProfile;
  marketTerms: string[];
  coreTerms: string[];
  visualTruth: string;
  visualAction: string;
  supportsGift: boolean;
};

function profile(input: {
  niche: string;
  audience: string;
  dimensions: string[];
  rituals: string[];
  behaviors: string[];
  objects: string[];
  environment: string;
  tension: string;
  identity: string;
  motives: string[];
}): DynamicNicheProfile {
  return {
    niche: input.niche,
    dimensions: input.dimensions,
    audience: input.audience,
    rituals: input.rituals,
    microRituals: input.behaviors,
    contradictions: [input.tension],
    frustrations: [input.tension],
    statusSignals: [input.identity],
    insiderLanguage: [],
    embarrassingTruths: [input.behaviors[0]],
    obsessions: [input.rituals[0]],
    visualCulture: [input.environment, ...input.objects],
    purchaseMotives: input.motives,
    latentLifestyleModel: {
      observableScenes: [],
      privateRituals: input.rituals,
      participationHabits: input.behaviors,
      involuntaryBehaviors: input.behaviors.slice(0, 1),
      seasonalBehaviors: [],
      comfortObjects: input.objects.slice(0, 1),
      collectionHabits: input.objects.slice(1),
      environments: [input.environment],
      recurringObjects: input.objects,
      socialInteractions: [],
      tensions: [input.tension],
      identitySignals: [input.identity],
      repeatedDecisions: input.behaviors,
      tinyFrustrations: [input.tension],
      smallVictories: [input.rituals[0]],
      unspokenRules: [],
      emotionalRewards: [input.motives[0]],
    },
  };
}

const cases: BenchmarkCase[] = [
  {
    name: "night-shift gardeners",
    slogan: "Plants Before Pajamas",
    profile: profile({
      niche: "Night-shift gardeners who check plants after work",
      audience: "overnight workers who garden before sleeping",
      dimensions: ["night-shift life", "after-work plant care"],
      rituals: ["checking seedlings before taking off work boots", "watering one dry pot after sunrise"],
      behaviors: ["turning on the grow light before going to bed", "checking one more leaf while exhausted"],
      objects: ["worn watering can", "grow light"],
      environment: "dim potting corner at sunrise",
      tension: "exhaustion versus caring for one more plant",
      identity: "spots a thirsty seedling in low light",
      motives: ["recognition of the after-shift plant ritual", "self-expression among night workers"],
    }),
    marketTerms: ["night shift gardener", "plant lover night worker", "after work gardening", "garden humor shirt"],
    coreTerms: ["night", "shift", "plant", "garden", "grow", "watering"],
    visualTruth: "The plants get cared for before the exhausted night worker rests.",
    visualAction: "A night worker reaches for the watering can while their work boots are still on.",
    supportsGift: false,
  },
  {
    name: "exotic-pet families",
    slogan: "Our Family Tree Has Scales",
    profile: profile({
      niche: "Families who treat exotic reptiles as household members",
      audience: "reptile parents and exotic-pet families",
      dimensions: ["reptile care", "family identity"],
      rituals: ["checking enclosure temperature before breakfast", "introducing the reptile as part of the family"],
      behaviors: ["glancing at the heat lamp during conversations", "saving enclosure photos like family portraits"],
      objects: ["digital thermometer", "heat lamp"],
      environment: "living room reptile enclosure",
      tension: "outsiders call it a pet while the household calls it family",
      identity: "knows every reptile's feeding routine",
      motives: ["family identity recognition", "gifting another reptile parent"],
    }),
    marketTerms: ["reptile family shirt", "exotic pet parent", "lizard lover gift", "reptile household humor"],
    coreTerms: ["reptile", "family", "scale", "exotic", "lizard", "enclosure"],
    visualTruth: "The reptile is treated as a full member of the household.",
    visualAction: "A reptile portrait occupies a proud branch in a family-tree composition.",
    supportsGift: true,
  },
  {
    name: "pre-sunrise gym regulars",
    slogan: "Alarm Lost, I Lifted",
    profile: profile({
      niche: "Gym regulars who train before sunrise",
      audience: "early-morning lifters who train before work",
      dimensions: ["pre-dawn training", "gym discipline"],
      rituals: ["packing the gym bag before bed", "starting the first set under dim gym lights"],
      behaviors: ["moving before fully waking up", "checking the clock between warmup sets"],
      objects: ["packed gym bag", "lifting straps"],
      environment: "quiet gym before sunrise",
      tension: "sleepiness versus showing up for the first set",
      identity: "finishes training before the city wakes",
      motives: ["recognition from other early lifters", "pride in the pre-work ritual"],
    }),
    marketTerms: ["early morning gym shirt", "before work lifter", "pre sunrise workout", "gym discipline humor"],
    coreTerms: ["early", "morning", "gym", "lift", "workout", "sunrise"],
    visualTruth: "The lifter beats the alarm's demand for more sleep by completing the workout.",
    visualAction: "A dismissed alarm visually gives way to a completed first lift before sunrise.",
    supportsGift: false,
  },
  {
    name: "sportswear thrift hunters",
    slogan: "Found It Before It Was Cool",
    profile: profile({
      niche: "Thrift hunters who collect overlooked vintage sportswear",
      audience: "vintage sportswear collectors and thrift-store regulars",
      dimensions: ["thrift hunting", "vintage sportswear collecting"],
      rituals: ["checking every jacket rack before looking at anything else", "inspecting faded tags for an older garment"],
      behaviors: ["sliding hangers rapidly until one fabric feels different", "remembering the store where every good find appeared"],
      objects: ["faded garment tag", "well-worn track jacket"],
      environment: "crowded thrift-store sportswear rack",
      tension: "the best find looks ordinary until the right collector notices it",
      identity: "recognizes a worthwhile vintage piece by touch",
      motives: ["collector status recognition", "gifting a dedicated thrift partner"],
    }),
    marketTerms: ["vintage sportswear collector", "thrift store hunter", "retro track jacket fan", "thrifting gift"],
    coreTerms: ["vintage", "sportswear", "thrift", "collector", "track", "jacket"],
    visualTruth: "The collector's status comes from recognizing value before other shoppers do.",
    visualAction: "A hand pulls the one overlooked vintage jacket from a crowded rack.",
    supportsGift: true,
  },
];

const marketplaces: ListingMarketplace[] = ["amazon_merch", "etsy", "general"];
const genericPhrases = ["unique design", "perfect for everyone", "stand out from the crowd", "adds a unique touch"];

function visualStrategy(item: BenchmarkCase): DynamicDesignStrategy {
  return {
    slogan: item.slogan,
    meaning: {
      literalSubject: item.slogan,
      impliedMeaning: item.visualTruth,
      behavioralTruth: item.visualTruth,
      emotionalPayoff: "insider recognition",
      visualizableAction: item.visualAction,
    },
    concept: {
      coreMessage: item.visualTruth,
      emotionalTone: ["recognizable", "self-aware"],
      behavioralMoment: [item.visualAction],
      visualMetaphors: [], relevantObjects: [], environmentalCues: [], typographyPersonality: [],
      compositionIntent: "Make the behavior readable before every word is read.", focalHierarchy: [], supportingGraphics: [], avoidElements: [],
      printStrategy: { silhouetteStrength: "strong", detailDensity: "controlled", contrastNeed: "high", viewingDistance: "thumbnail" },
    },
    composition: { primaryFocus: "hybrid", hierarchy: [], textTreatment: "integrated", illustrationRelationship: "demonstrates the behavior", negativeSpaceStrategy: "controlled", silhouette: "strong", balance: "intentional" },
    complexity: { textDominance: 0.55, illustrationDominance: 0.45, maxPrimarySubjects: 1, supportingDetailLevel: "controlled" },
    quality: { thumbnailLegibility: 90, focalClarity: 90, silhouetteStrength: 90, textGraphicIntegration: 90, contrast: 90, printability: 90, visualOriginality: 85, sloganReinforcement: 92 },
    visualImpact: 90,
    fingerprint: { primarySubject: "behavior", compositionType: "hybrid", metaphorType: "behavioral contrast", typographyRole: "integrated", graphicRelationship: "demonstrates meaning" },
    diversityPenalty: 0,
    qualityGatePassed: true,
    batchRepairAttempts: 0,
    prompt: "benchmark strategy",
  };
}

function normalizedTerms(values: string[]): string[] {
  return values.map((value) => value.toLowerCase().replace(/\s+/g, " ").trim());
}

function evidenceCoverage(result: DynamicListingResult, coreTerms: string[]): number {
  const copy = [result.title, ...result.bullets, result.description, ...result.searchTerms].join(" ").toLowerCase();
  return coreTerms.filter((term) => copy.includes(term)).length / coreTerms.length;
}

async function main() {
  loadLocalEnvironment();
  allowServerModulesInScript();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { generateDynamicListing } = require("../lib/ai/dynamicListingEngine") as typeof import("../lib/ai/dynamicListingEngine");
  const rows: Array<Record<string, string | number | boolean>> = [];
  const caseFilter = process.argv.find((argument) => argument.startsWith("--case="))?.slice("--case=".length).trim().toLowerCase();
  const selectedCases = caseFilter ? cases.filter((item) => item.name.toLowerCase().includes(caseFilter)) : cases;
  assert.ok(selectedCases.length > 0, `No benchmark case matched “${caseFilter}”`);

  for (const item of selectedCases) {
    const nicheResults: DynamicListingResult[] = [];
    for (const marketplace of marketplaces) {
      const input: DynamicListingInput = {
        niche: item.profile.niche,
        slogan: item.slogan,
        audience: item.profile.audience,
        profile: item.profile,
        visualStrategy: visualStrategy(item),
        marketTerms: item.marketTerms,
        purchaseMotives: item.profile.purchaseMotives,
        marketplace,
        visualStyle: "Vintage Distressed",
      };
      const result = await generateDynamicListing(input);
      nicheResults.push(result);
      const copy = [result.title, ...result.bullets, result.description].join(" ").toLowerCase();
      const searchTerms = normalizedTerms(result.searchTerms);
      const duplicateTerms = searchTerms.length - new Set(searchTerms).size;
      const unsupportedGift = !item.supportsGift && /\bgift\b/i.test(copy);
      const styleLed = /^vintage\s+distressed\b/i.test(result.title);
      const generic = genericPhrases.some((phrase) => copy.includes(phrase));
      const coverage = evidenceCoverage(result, item.coreTerms);

      assert.equal(
        !result.compliance.safe && result.qualityGate.passed,
        false,
        `${item.name}/${marketplace}: unsafe listing passed (${result.compliance.riskLevel}: ${result.compliance.warnings.join(" | ")})`,
      );
      assert.equal(duplicateTerms, 0, `${item.name}/${marketplace}: duplicate search terms`);
      assert.equal(unsupportedGift && result.qualityGate.passed, false, `${item.name}/${marketplace}: unsupported gift language passed the gate`);
      assert.equal(styleLed && result.qualityGate.passed, false, `${item.name}/${marketplace}: style-led title passed the gate`);
      assert.equal(generic && result.qualityGate.passed, false, `${item.name}/${marketplace}: generic phrase passed the gate`);
      assert.equal(result.qualityGate.passed && result.grounding.score < 100, false, `${item.name}/${marketplace}: ungrounded claims passed the gate`);
      assert.equal(result.qualityGate.passed && result.seoAudit.bulletCoverage < 50, false, `${item.name}/${marketplace}: weak bullet keyword coverage passed the gate`);
      assert.equal(result.qualityGate.passed && result.seoAudit.unsupportedTerms > 0, false, `${item.name}/${marketplace}: unsupported SEO terms passed the gate`);
      assert.ok(coverage >= 0.5, `${item.name}/${marketplace}: core semantic coverage ${coverage.toFixed(2)}`);

      rows.push({
        niche: item.name,
        marketplace,
        quality: result.quality.listingQualityScore,
        gate: result.qualityGate.status,
        repaired: result.qualityGate.repairAttempts,
        coverage: Number(coverage.toFixed(2)),
        grounding: result.grounding.score,
        attribution: result.grounding.attributionCoverage,
        bulletSeo: result.quality.bulletSeoQuality,
        bulletCoverage: result.seoAudit.bulletCoverage,
        seoNaturalness: result.seoAudit.naturalness,
        backendCoverage: result.seoAudit.backendCoverage,
        compliance: result.compliance.safe,
        giftAppropriate: !unsupportedGift,
        genericFree: !generic,
        searchTerms: result.searchTerms.length,
        warnings: result.qualityGate.warnings.join(" | "),
        ...(caseFilter ? {
          bulletPhrases: result.seoAudit.bulletKeywords.join(" / "),
          bullets: result.bullets.join(" || "),
        } : {}),
      });
    }

    const coverages = nicheResults.map((result) => evidenceCoverage(result, item.coreTerms));
    const semanticSpread = Math.max(...coverages) - Math.min(...coverages);
    if (caseFilter) console.table(rows);
    assert.ok(semanticSpread <= 0.34, `${item.name}: marketplace semantic spread ${semanticSpread.toFixed(2)}`);
    const packagingFingerprints = nicheResults.map((result) => [
      result.title,
      ...result.bullets,
      result.description,
      ...result.searchTerms,
    ].join(" | ").toLowerCase());
    assert.ok(new Set(packagingFingerprints).size >= 2, `${item.name}: marketplace packaging did not change`);
  }

  const averageQuality = rows.reduce((sum, row) => sum + Number(row.quality), 0) / rows.length;
  const passRate = rows.filter((row) => row.gate === "PASS").length / rows.length;
  const averageCoverage = rows.reduce((sum, row) => sum + Number(row.coverage), 0) / rows.length;
  const averageGrounding = rows.reduce((sum, row) => sum + Number(row.grounding), 0) / rows.length;
  const averageBulletSeo = rows.reduce((sum, row) => sum + Number(row.bulletSeo), 0) / rows.length;
  const minimumPassRate = selectedCases.length === cases.length ? 0.75 : 1 / marketplaces.length;
  if (!caseFilter) console.table(rows);
  assert.ok(averageQuality >= 70, `average quality ${averageQuality.toFixed(1)} is below 70`);
  assert.ok(passRate >= minimumPassRate, `listing gate pass rate ${(passRate * 100).toFixed(0)}% is below ${(minimumPassRate * 100).toFixed(0)}%`);
  assert.ok(averageGrounding >= 75, `average claim grounding ${averageGrounding.toFixed(1)} is below 75`);
  assert.ok(averageBulletSeo >= 70, `average bullet SEO quality ${averageBulletSeo.toFixed(1)} is below 70`);

  console.log(JSON.stringify({
    cases: selectedCases.length,
    listings: rows.length,
    averageQuality: Number(averageQuality.toFixed(1)),
    passRate: Number(passRate.toFixed(2)),
    averageSemanticCoverage: Number(averageCoverage.toFixed(2)),
    averageClaimGrounding: Number(averageGrounding.toFixed(1)),
    averageBulletSeo: Number(averageBulletSeo.toFixed(1)),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
