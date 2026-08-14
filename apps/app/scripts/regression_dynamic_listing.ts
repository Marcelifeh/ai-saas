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
    "For every gothic book lover whose dark academia reading ritual means candlelit chapters and one more page after midnight.",
    "Halloween reader humor rooted in gothic reading, growing October book stacks, and recognition from fellow dark academia book lovers.",
  ],
  description: "Made for dark academia book lovers whose autumn reading ritual is measured in gothic novels and one more chapter after midnight. Candlelit chapters, a growing gothic reading stack, and reader recognition shape the message.",
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
  const groundedStrongDraft: ListingDraft = { ...strongDraft };

  const strong = engine.evaluateListingQuality(input, strongDraft, 100);
  const generic = engine.evaluateListingQuality(input, genericDraft, 100);
  assert.ok(strong.listingQualityScore >= 70, `expected strong listing to clear 70, got ${strong.listingQualityScore}`);
  assert.ok(strong.listingQualityScore > generic.listingQualityScore, "behavior-first listing must outrank generic style-led copy");
  assert.ok(strong.behavioralRelevance > generic.behavioralRelevance, "behavioral evidence must affect scoring");
  assert.ok(strong.searchIntentCoverage > generic.searchIntentCoverage, "specific market intent must affect scoring");
  assert.ok(strong.bulletSeoQuality > generic.bulletSeoQuality, "grounded search language in bullets must improve bullet SEO quality");

  const bulletContext = engine.buildBulletSeoContext({
    ...input,
    marketTerms: [...(input.marketTerms ?? []), "Halloween fitness events"],
  });
  const riskyEventTerm = bulletContext.rankedSearchTerms.find((entry) => entry.term === "Halloween fitness events");
  assert.equal(riskyEventTerm?.usage, "BACKEND_ONLY", "market presence alone must not clear an unsupported term for customer copy");
  assert.equal(engine.selectBulletKeywords(bulletContext).includes("Halloween fitness events"), false);

  const awkwardHighIntentPhrase = "gothic reader dark academia book lover autumn reading chapter candlelight paperback";
  const awkwardContext = engine.buildBulletSeoContext({
    ...input,
    rankedSearchTerms: [{
      term: awkwardHighIntentPhrase,
      relevance: 0.99,
      confidence: 0.99,
      naturalLanguageFit: 0.99,
      evidenceSupport: 0.99,
      source: "market",
      usage: "BOTH",
    }],
  });
  const awkwardTerm = awkwardContext.rankedSearchTerms.find((entry) => entry.term === awkwardHighIntentPhrase);
  assert.ok((awkwardTerm?.relevance ?? 0) >= 0.9);
  assert.ok((awkwardTerm?.confidence ?? 0) >= 0.9);
  assert.ok((awkwardTerm?.naturalLanguageFit ?? 1) < 0.7);
  assert.equal(awkwardTerm?.usage, "BACKEND_ONLY", "low prose naturalness must override high relevance and confidence");
  assert.equal(engine.selectBulletKeywords(awkwardContext).includes(awkwardHighIntentPhrase), false);

  const unsupportedGift = engine.evaluateListingQuality({ ...input, purchaseMotives: ["self-expression"] }, strongDraft, 100);
  assert.equal(unsupportedGift.giftIntent, 42, "unsupported gift language must be penalized");
  const unsupportedGiftResult = engine.finalizeDynamicListing({ ...input, purchaseMotives: ["self-expression"] }, strongDraft);
  assert.equal(unsupportedGiftResult.qualityGate.status, "REVIEW", "unsupported gift language must fail the release gate");
  assert.ok(unsupportedGiftResult.qualityGate.warnings.some((warning) => /Remove gift language/i.test(warning)));

  const candidate = engine.finalizeDynamicListing(input, groundedStrongDraft);
  assert.equal(candidate.qualityGate.status, "PASS", JSON.stringify({ warnings: candidate.qualityGate.warnings, grounding: candidate.grounding.unsupportedClaims }, null, 2));
  assert.equal(candidate.grounding.score, 100);
  assert.ok(candidate.seoAudit.bulletCoverage >= 50, `expected meaningful bullet keyword coverage, got ${candidate.seoAudit.bulletCoverage}`);
  assert.equal(candidate.seoAudit.unsupportedTerms, 0);
  assert.equal(candidate.brandStrategy.source, "generated_candidate");
  assert.equal(candidate.brandStrategy.verified, false);
  assert.match(candidate.brandStrategy.warning ?? "", /Unverified brand candidate/i);

  const configured = engine.finalizeDynamicListing({ ...input, configuredBrand: "Reader Ritual Co" }, groundedStrongDraft);
  assert.equal(configured.brand, "Reader Ritual Co");
  assert.equal(configured.brandStrategy.source, "configured");
  assert.equal(configured.brandStrategy.verified, false, "configuration alone must not imply trademark verification");

  const genericResult = engine.finalizeDynamicListing(input, genericDraft);
  assert.equal(genericResult.qualityGate.status, "REVIEW");
  assert.ok(genericResult.qualityGate.warnings.some((warning) => /generic phrase/i.test(warning)));
  assert.ok(genericResult.qualityGate.warnings.some((warning) => /rendering style/i.test(warning)));

  const inventedContextDraft: ListingDraft = {
    ...groundedStrongDraft,
    description: `${groundedStrongDraft.description} Attend a Halloween fitness expo. Join community events and showcase your costume choices.`,
  };
  const inventedContext = engine.finalizeDynamicListing(input, inventedContextDraft);
  assert.equal(inventedContext.qualityGate.status, "REVIEW");
  const unsupportedTerms = new Set(inventedContext.grounding.unsupportedClaims.flatMap((claim) => claim.unsupportedTerms));
  assert.ok(unsupportedTerms.has("expo"));
  assert.ok(unsupportedTerms.has("event"));
  assert.ok(unsupportedTerms.has("costume"));
  assert.ok(unsupportedTerms.has("choice"));

  const duplicatedPhraseDraft: ListingDraft = {
    ...groundedStrongDraft,
    bullets: groundedStrongDraft.bullets.map((bullet) => `Gothic book lover ${bullet}`),
  };
  const duplicatedPhrase = engine.finalizeDynamicListing(input, duplicatedPhraseDraft);
  assert.ok(duplicatedPhrase.seoAudit.duplicatePhraseRate > 0);
  assert.ok(duplicatedPhrase.qualityGate.warnings.some((warning) => /each exact customer-copy search phrase/i.test(warning)));

  console.log(JSON.stringify({
    strongQuality: strong.listingQualityScore,
    genericQuality: generic.listingQualityScore,
    strongBehavioralRelevance: strong.behavioralRelevance,
    genericBehavioralRelevance: generic.behavioralRelevance,
    strongSearchIntent: strong.searchIntentCoverage,
    genericSearchIntent: generic.searchIntentCoverage,
    strongBulletSeo: strong.bulletSeoQuality,
    genericBulletSeo: generic.bulletSeoQuality,
    candidateBrandState: candidate.brandStrategy.source,
    configuredBrandState: configured.brandStrategy.source,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
