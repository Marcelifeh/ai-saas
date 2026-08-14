import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { DynamicNicheProfile } from "../lib/ai/dynamicNicheProfile";
import type { DynamicListingInput, ListingDraft } from "../lib/ai/dynamicListingEngine";

function allowServerModulesInScript(): void {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Module = require("node:module");
  const originalLoad = Module._load;
  Module._load = function patchedModuleLoad(request: string, parent: unknown, isMain: boolean) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

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

const profile: DynamicNicheProfile = {
  niche: "Gothic readers during spooky season",
  dimensions: ["gothic reading", "autumn book rituals"],
  audience: "gothic readers and dark academia book lovers",
  rituals: ["reading one more chapter by candlelight", "building an October reading stack"],
  microRituals: ["moving the bookmark after midnight", "carrying a gothic novel into the cafe"],
  contradictions: ["too tired to read but starts another chapter"],
  frustrations: ["an autumn reading list that keeps growing"],
  statusSignals: ["recognizes gothic authors from a shelf spine"],
  insiderLanguage: ["spooky reading season", "gothic TBR"],
  embarrassingTruths: ["buys another book before finishing the stack"],
  obsessions: ["candlelit chapters"],
  visualCulture: ["dark shelves and annotated paperbacks"],
  purchaseMotives: ["wearing an insider reading ritual", "gifting a fellow gothic reader"],
  latentLifestyleModel: {
    observableScenes: [],
    privateRituals: ["reading after everyone else is asleep"],
    participationHabits: ["planning October around gothic novels"],
    involuntaryBehaviors: ["reaching for one more chapter after midnight"],
    seasonalBehaviors: ["building a darker reading list in autumn"],
    comfortObjects: ["annotated paperback"],
    collectionHabits: ["stacking unread gothic novels"],
    environments: ["quiet library corner"],
    recurringObjects: ["bookmark", "paperback"],
    socialInteractions: ["sharing gothic recommendations at book club"],
    tensions: ["sleep versus one more chapter"],
    identitySignals: ["dark academia book lover"],
    repeatedDecisions: ["starts the next chapter"],
    tinyFrustrations: ["losing the bookmark in bed"],
    smallVictories: ["finishing a gothic novel before Halloween"],
    unspokenRules: ["never interrupt the last chapter"],
    emotionalRewards: ["recognition from another reader"],
  },
};

const input: DynamicListingInput = {
  niche: profile.niche,
  slogan: "Sleep Can Wait, This Chapter Can't",
  audience: profile.audience,
  profile,
  marketTerms: ["gothic book lover", "Halloween reader", "dark academia reading", "literary Halloween gift"],
  purchaseMotives: profile.purchaseMotives,
  marketplace: "amazon_merch",
  visualStyle: "Vintage Distressed",
};

const strongDraft: ListingDraft = {
  title: "Gothic Reader Halloween Shirt for Dark Academia Book Lovers",
  brandCandidate: "Midnight Margins",
  bullets: [
    "For gothic readers who plan October around candlelit chapters, dark shelves, and one more page after midnight.",
    "A literary Halloween gift for book lovers who keep growing their gothic reading stack before the last chapter ends.",
  ],
  description: "Made for dark academia book lovers whose spooky season is measured in gothic novels and late-night chapters. Wear it for autumn reading nights, book clubs, libraries, and bookstore trips, or gift it to the reader who always chooses one more chapter over sleep.",
  searchTerms: ["gothic book lover", "Halloween reader", "dark academia reading", "literary Halloween gift", "spooky reading season", "gothic reader shirt"],
};

const genericDraft: ListingDraft = {
  title: "Vintage Distressed Dark Humor Halloween Costume Tee",
  brandCandidate: "Spooky Threads",
  bullets: ["Perfect for everyone who loves Halloween.", "Vintage distressed style adds a unique touch."],
  description: "Embrace the spooky season with this unique design. Stand out from the crowd and show off your Halloween spirit.",
  searchTerms: ["Halloween shirt", "Halloween shirt", "funny costume ideas", "costume designer apparel"],
};

async function main() {
  loadLocalEnvironment();
  allowServerModulesInScript();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const engine = require("../lib/ai/dynamicListingEngine") as typeof import("../lib/ai/dynamicListingEngine");

  const strong = engine.evaluateListingQuality(input, strongDraft, 100);
  const generic = engine.evaluateListingQuality(input, genericDraft, 100);
  assert.ok(strong.listingQualityScore >= 70, `expected strong listing to clear 70, got ${strong.listingQualityScore}`);
  assert.ok(strong.listingQualityScore > generic.listingQualityScore, "behavior-first listing must outrank generic style-led copy");
  assert.ok(strong.behavioralRelevance > generic.behavioralRelevance, "behavioral evidence must affect scoring");
  assert.ok(strong.searchIntentCoverage > generic.searchIntentCoverage, "specific market intent must affect scoring");

  const unsupportedGift = engine.evaluateListingQuality({ ...input, purchaseMotives: ["self-expression"] }, strongDraft, 100);
  assert.equal(unsupportedGift.giftIntent, 42, "unsupported gift language must be penalized");
  const unsupportedGiftResult = engine.finalizeDynamicListing({ ...input, purchaseMotives: ["self-expression"] }, strongDraft);
  assert.equal(unsupportedGiftResult.qualityGate.status, "REVIEW", "unsupported gift language must fail the release gate");
  assert.ok(unsupportedGiftResult.qualityGate.warnings.some((warning) => /Remove gift language/i.test(warning)));

  const candidate = engine.finalizeDynamicListing(input, strongDraft);
  assert.equal(candidate.qualityGate.status, "PASS");
  assert.equal(candidate.brandStrategy.source, "generated_candidate");
  assert.equal(candidate.brandStrategy.verified, false);
  assert.match(candidate.brandStrategy.warning ?? "", /Unverified brand candidate/i);

  const configured = engine.finalizeDynamicListing({ ...input, configuredBrand: "Reader Ritual Co" }, strongDraft);
  assert.equal(configured.brand, "Reader Ritual Co");
  assert.equal(configured.brandStrategy.source, "configured");
  assert.equal(configured.brandStrategy.verified, false, "configuration alone must not imply trademark verification");

  const genericResult = engine.finalizeDynamicListing(input, genericDraft);
  assert.equal(genericResult.qualityGate.status, "REVIEW");
  assert.ok(genericResult.qualityGate.warnings.some((warning) => /generic phrase/i.test(warning)));
  assert.ok(genericResult.qualityGate.warnings.some((warning) => /rendering style/i.test(warning)));

  console.log(JSON.stringify({
    strongQuality: strong.listingQualityScore,
    genericQuality: generic.listingQualityScore,
    strongBehavioralRelevance: strong.behavioralRelevance,
    genericBehavioralRelevance: generic.behavioralRelevance,
    strongSearchIntent: strong.searchIntentCoverage,
    genericSearchIntent: generic.searchIntentCoverage,
    candidateBrandState: candidate.brandStrategy.source,
    configuredBrandState: configured.brandStrategy.source,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
