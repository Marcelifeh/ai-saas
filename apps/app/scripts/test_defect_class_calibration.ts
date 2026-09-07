const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "test-secret-key-for-standalone-scripts-32byteslong";
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Mock server-only package when running scripts via Node/tsx
const originalRequire = Module.prototype.require;
// @ts-ignore
Module.prototype.require = function (this: any, request: string) {
  if (request === "server-only") return {};
  return (originalRequire as Function).call(this, request);
};

const {
  evaluateSpecificityCompatibility,
  decomposeSemanticNiche,
  evaluateFactProvenance,
} = require("../lib/ai/specificityCompatibilityEvaluator");
const {
  isExpressionWorthy,
} = require("../lib/ai/expressionWorthiness");
const {
  buildStructuralFingerprint,
  extractLinguisticFeatures,
  evaluateStructuralDerivativeness,
  applyStructuralDiversityRanking,
  rejectsPatternLeakage,
} = require("../lib/ai/dynamicNicheProfile");
const { getNicheEvidence } = require("../lib/services/marketEvidenceService");

async function runDefectClassCalibrationSuite() {
  console.log("=================================================");
  console.log("  DEFECT CLASS CALIBRATION REGRESSION SUITE");
  console.log("  (Zero Hardcoding • Provenance-First Architecture)");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name} - ${err?.message || err}`);
      failed++;
    }
  }

  async function testAsync(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name} - ${err?.message || err}`);
      failed++;
    }
  }

  console.log("--- 1. Specificity-Aware Evidence Inheritance & Claim Provenance ---");

  test("Decompose compound qualified niche into core and qualifiers without hidden vocabularies", () => {
    const dec = decomposeSemanticNiche("Pumpkin spice and fall coffee humor", "coffee");
    assert.equal(dec.matchedCategory, "coffee");
    assert.equal(dec.isQualifiedSubdomain, true);
    assert.ok(dec.qualifiers.includes("pumpkin"));
    assert.ok(dec.qualifiers.includes("spice"));
    assert.ok(dec.qualifiers.includes("fall"));
    assert.ok(dec.qualifiers.includes("humor"));
  });

  test("Pure category without qualifiers is not a qualified subdomain", () => {
    const dec = decomposeSemanticNiche("coffee", "coffee");
    assert.equal(dec.isQualifiedSubdomain, false);
    assert.equal(dec.qualifiers.length, 0);
  });

  test("Provenance Invariant: Pipeline repetition does not manufacture corroboration", () => {
    // A claim originated from inherited parent knowledge and repeated by downstream AI stages
    // must remain INHERITED, not be upgraded to CORROBORATED
    const pipelineHistory = [
      { sourceType: "INHERITED_CATEGORY", text: "crema check" },
      { sourceType: "PIPELINE_DERIVATION", text: "crema check" }, // repeated in profile
      { sourceType: "PIPELINE_DERIVATION", text: "crema check" }, // repeated in verifier context
    ];
    const status = evaluateFactProvenance("crema check", pipelineHistory as any);
    assert.equal(status, "INHERITED");
    assert.notEqual(status, "CORROBORATED");

    // True corroboration requires external market evidence or user brief
    const corroboratedHistory = [
      { sourceType: "USER_BRIEF", text: "pumpkin spice" },
      { sourceType: "MARKET_EVIDENCE", text: "pumpkin spice" },
    ];
    assert.equal(evaluateFactProvenance("pumpkin spice", corroboratedHistory as any), "CORROBORATED");
  });

  test("Prune unanchored espresso extraction sub-specialties from pumpkin spice niche", () => {
    const candidates = [
      { phrase: "crema check", category: "coffee" },
      { phrase: "pulling shots", category: "coffee" },
      { phrase: "dialed in daily", category: "coffee" },
      { phrase: "morning coffee", category: "coffee" },
      { phrase: "coffee cup", category: "coffee" },
    ];
    const evaluated = evaluateSpecificityCompatibility(
      candidates,
      "Pumpkin spice and fall coffee humor",
      "coffee",
      ["pumpkin spice latte is trending", "cinnamon and nutmeg"],
    );

    const crema = evaluated.find((f: any) => f.phrase === "crema check");
    assert.ok(crema);
    assert.equal(crema.supportStatus, "UNVERIFIED");
    assert.ok(crema.specificityRisk > 0.7);

    const morning = evaluated.find((f: any) => f.phrase === "morning coffee");
    assert.ok(morning);
    assert.equal(morning.supportStatus, "INHERITED");

    const pslCorroborated = evaluateSpecificityCompatibility(
      [{ phrase: "pumpkin spice syrup", category: "coffee" }],
      "Pumpkin spice and fall coffee humor",
      "coffee",
      ["pumpkin spice latte is trending"],
    );
    assert.equal(pslCorroborated[0].supportStatus, "CORROBORATED");
  });

  test("Multi-domain: Prune unanchored agricultural field tillage from apartment balcony gardening", () => {
    const candidates = [
      { phrase: "rototiller maintenance", category: "gardening" },
      { phrase: "tractor hydraulics", category: "gardening" },
      { phrase: "gardening tools", category: "gardening" },
    ];
    const evaluated = evaluateSpecificityCompatibility(
      candidates,
      "Balcony succulent gardening",
      "gardening",
      [],
    );
    const tractor = evaluated.find((f: any) => f.phrase === "tractor hydraulics");
    assert.ok(tractor);
    assert.equal(tractor.supportStatus, "UNVERIFIED");

    const tools = evaluated.find((f: any) => f.phrase === "gardening tools");
    assert.ok(tools);
    assert.equal(tools.supportStatus, "INHERITED");
  });

  test("Multi-domain: Prune unanchored track sprint spikes from mountain trail ultrarunning", () => {
    const candidates = [
      { phrase: "400m sprint intervals", category: "running" },
      { phrase: "track starting blocks", category: "running" },
      { phrase: "running gear", category: "running" },
    ];
    const evaluated = evaluateSpecificityCompatibility(
      candidates,
      "Mountain trail ultrarunning",
      "running",
      [],
    );
    const sprint = evaluated.find((f: any) => f.phrase === "400m sprint intervals");
    assert.ok(sprint);
    assert.equal(sprint.supportStatus, "UNVERIFIED");

    const gear = evaluated.find((f: any) => f.phrase === "running gear");
    assert.ok(gear);
    assert.equal(gear.supportStatus, "INHERITED");
  });

  await testAsync("Market evidence snapshot for pumpkin spice coffee contains zero crema contamination", async () => {
    const evidence = await getNicheEvidence("Pumpkin spice and fall coffee humor");
    const allEvidencePhrases = [
      ...evidence.buyerLanguage.map((b: any) => b.phrase.toLowerCase()),
      ...evidence.culturalSignals.map((c: any) => c.phrase.toLowerCase()),
      ...evidence.purchaseSignals.map((p: any) => p.phrase.toLowerCase()),
    ];
    const hasCrema = allEvidencePhrases.some((p) => p.includes("crema"));
    assert.equal(hasCrema, false, `Expected zero crema in evidence snapshot, found in: ${allEvidencePhrases.filter((p) => p.includes("crema"))}`);
  });

  console.log("\n--- 2. Expression vs. Meta-Description Classification (Graded Interaction) ---");

  // Shared base assessment for all four threshold tests — strong defaults throughout
  const metaBase = {
    slogan: "Crema checks and pumpkin puns",
    conceptKey: "coffee puns meta",
    rhetoricalFamily: "OBSERVATION",
    naturalness: 65,
    wearability: 60,
    creativeConstraintAlignment: 80,
    expressionMode: "SYMBOLIC_EXPRESSION",
    diagnosticTraits: ["META_DESCRIPTION"],
    score: 65,
    reasons: [],
  };
  // Thresholds from EXPRESSION_WORTHINESS_RELEASE: conceptualTransformation < 50, score < 60 (selfRecognition / identityProjection)

  test("META_DESCRIPTION + 0 weak dimensions → not rejected for meta-description", () => {
    const assessment = {
      ...metaBase,
      selfRecognition: 75,        // STRONG
      identityProjection: 75,     // STRONG
      insiderResonance: 70,
      conceptualTransformation: 65, // STRONG
    };
    // The main release gate (score, naturalness, wearability) may still reject it —
    // but the meta-description defect path alone must NOT be the cause.
    // We verify by checking that weakExpressionSignals < 2.
    const weakCount = [
      assessment.conceptualTransformation < 50,
      assessment.selfRecognition < 60,
      assessment.identityProjection < 60,
    ].filter(Boolean).length;
    assert.equal(weakCount, 0, "0 weak dimensions should not trigger meta-description defect");
    // isExpressionWorthy may still fail on other release criteria (wearability etc),
    // but the meta-description path is NOT the reason — confirm by temporarily making
    // it pass all other release gates:
    const fullyPassingAssessment = { ...assessment, score: 70, wearability: 70, naturalness: 65 };
    assert.equal(
      isExpressionWorthy(fullyPassingAssessment as any),
      true,
      "META_DESCRIPTION + 0 weak dimensions must not be rejected by meta-description gate",
    );
  });

  test("META_DESCRIPTION + 1 weak dimension → not automatically rejected", () => {
    const assessment = {
      ...metaBase,
      selfRecognition: 45,        // WEAK (< 60) — one weak dimension
      identityProjection: 75,     // STRONG
      insiderResonance: 70,
      conceptualTransformation: 65, // STRONG
      score: 70,
      wearability: 70,
    };
    const weakCount = [
      assessment.conceptualTransformation < 50,
      assessment.selfRecognition < 60,
      assessment.identityProjection < 60,
    ].filter(Boolean).length;
    assert.equal(weakCount, 1, "Should be exactly 1 weak dimension");
    assert.equal(
      isExpressionWorthy(assessment as any),
      true,
      "META_DESCRIPTION + 1 weak dimension must not trigger meta-description gate",
    );
  });

  test("META_DESCRIPTION + 2 weak dimensions → rejected", () => {
    const assessment = {
      ...metaBase,
      selfRecognition: 45,        // WEAK (< 60)
      identityProjection: 45,     // WEAK (< 60)
      insiderResonance: 70,
      conceptualTransformation: 65, // STRONG
      score: 70,
      wearability: 70,
    };
    const weakCount = [
      assessment.conceptualTransformation < 50,
      assessment.selfRecognition < 60,
      assessment.identityProjection < 60,
    ].filter(Boolean).length;
    assert.equal(weakCount, 2, "Should be exactly 2 weak dimensions");
    assert.equal(
      isExpressionWorthy(assessment as any),
      false,
      "META_DESCRIPTION + 2 weak dimensions must be rejected",
    );
  });

  test("META_DESCRIPTION + 3 weak dimensions → rejected", () => {
    const assessment = {
      ...metaBase,
      selfRecognition: 45,        // WEAK (< 60)
      identityProjection: 45,     // WEAK (< 60)
      insiderResonance: 70,
      conceptualTransformation: 30, // WEAK (< 50)
      score: 62,
      wearability: 40,
    };
    const weakCount = [
      assessment.conceptualTransformation < 50,
      assessment.selfRecognition < 60,
      assessment.identityProjection < 60,
    ].filter(Boolean).length;
    assert.equal(weakCount, 3, "Should be exactly 3 weak dimensions");
    assert.equal(
      isExpressionWorthy(assessment as any),
      false,
      "META_DESCRIPTION + 3 weak dimensions must be rejected",
    );
  });



  console.log("\n--- 3. Generative Linguistic Structural Features & Derivativeness Scoring ---");

  test("Extract generic linguistic features dynamically without formula vocabularies", () => {
    const features1 = extractLinguisticFeatures("No plans, just cinnamon chaos");
    assert.equal(features1.hasNegation, true);
    assert.equal(features1.hasContrast, true);
    assert.equal(features1.clauseCount >= 2, true);

    const features2 = extractLinguisticFeatures("Foam arguments are my winter cardio");
    assert.equal(features2.hasCopula, true);
    assert.equal(features2.hasPossessive, true);
    assert.equal(features2.clauseCount, 1);
    assert.equal(features2.personPerspective, "FIRST_PERSON");

    const features3 = extractLinguisticFeatures("Maple roast: café banter");
    assert.equal(features3.hasColonStructure, true);
    assert.equal(features3.clauseCount >= 2, true);
  });

  test("Evaluate structural derivativeness via linguistic mechanism signatures", () => {
    const variants = [
      { slogan: "Crema debates are my autumn sport", mechanism: "COPULAR_POSSESSIVE_METAPHOR" },
      { slogan: "Foam arguments are my winter cardio", mechanism: "COPULAR_POSSESSIVE_METAPHOR" },
      { slogan: "No secrets, just nutmeg spills", mechanism: "NEGATION_CONTRAST_SCAFFOLD" },
      { slogan: "No plans, just cinnamon chaos", mechanism: "NEGATION_CONTRAST_SCAFFOLD" },
      { slogan: "Pumpkin spice: coffee small talk", mechanism: "COLONIC_TOPIC_APPOSITION" },
      { slogan: "Maple roast: café banter", mechanism: "COLONIC_TOPIC_APPOSITION" },
    ];

    for (const { slogan, mechanism } of variants) {
      const evaluation = evaluateStructuralDerivativeness(slogan);
      assert.equal(evaluation.isFormulaic, true);
      assert.equal(evaluation.syntacticMechanism, mechanism);
      assert.ok(evaluation.derivativenessPenalty >= 20);
    }
  });

  test("Structural fingerprints group variants by abstract linguistic feature signatures", () => {
    const fp1 = buildStructuralFingerprint("Foam arguments are my winter cardio");
    const fp2 = buildStructuralFingerprint("Pacing laps is my autumn sport");
    assert.equal(fp1.pattern, fp2.pattern);
    assert.equal(fp1.pattern, "IDENTITY:1C:COPULA+POSS");

    const fp3 = buildStructuralFingerprint("No secrets, just nutmeg spills");
    const fp4 = buildStructuralFingerprint("No plans, just cinnamon chaos");
    assert.equal(fp3.pattern, fp4.pattern);
    assert.equal(fp3.pattern, "CONTRAST:2C:NEG+CONTRAST");
  });

  test("applyStructuralDiversityRanking penalizes formulaic merchandise copy in commercial rank", () => {
    const candidates = [
      { slogan: "Foam arguments are my winter cardio", score: 85 },
      { slogan: "The barista recognizes my coat before my order", score: 84 },
      { slogan: "Sweater sleeves long enough to hold the cup", score: 83 },
    ];

    const ranked = applyStructuralDiversityRanking(candidates);
    assert.notEqual(ranked[0].slogan, "Foam arguments are my winter cardio");
    assert.equal(ranked[0].slogan, "The barista recognizes my coat before my order");
  });

  test("Adversarial positive nuance: Truth vs Sellability for athlete slogan", () => {
    // 'Cross country is my sport' is not blocked by leakage filters (it is true in an athlete niche)
    assert.equal(rejectsPatternLeakage("Cross country is my sport"), false);

    // But its copular structure is independently evaluated for derivativeness (sellability signal)
    const derivativeness = evaluateStructuralDerivativeness("Cross country is my sport");
    assert.equal(derivativeness.syntacticMechanism, "COPULAR_POSSESSIVE_METAPHOR");
    assert.ok(derivativeness.derivativenessPenalty > 0);
  });

  console.log("\n--- 4. Static Anti-Hardcoding Audit ---");

  test("Audit production codebase for zero niche/phrase hardcoding", () => {
    const filesToAudit = [
      path.resolve(__dirname, "../lib/ai/dynamicNicheProfile.ts"),
      path.resolve(__dirname, "../lib/ai/behavioralLexicon.ts"),
      path.resolve(__dirname, "../lib/ai/communityKnowledgeEngine.ts"),
      path.resolve(__dirname, "../lib/ai/expressionWorthiness.ts"),
      path.resolve(__dirname, "../lib/ai/behavioralSloganEngine.ts"),
      path.resolve(__dirname, "../lib/ai/sloganEnhancer.ts"),
      path.resolve(__dirname, "../lib/services/marketEvidenceService.ts"),
      path.resolve(__dirname, "../lib/ai/specificityCompatibilityEvaluator.ts"),
    ];

    const forbiddenStringsInProd = [
      "crema debates",
      "autumn sport",
      "winter cardio",
      "cider season",
      "nutmeg spills",
      "cinnamon chaos",
      "pumpkin puns",
      "café banter",
      "cafe banter",
      "coffee small talk",
      "FORMULA:NO_X_JUST_Y",
      "FORMULA:NO_<CLAUSE>",
      "TONE_AND_STYLE_MODIFIERS",
    ];

    for (const filePath of filesToAudit) {
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf8");
      for (const phrase of forbiddenStringsInProd) {
        assert.equal(
          content.toLowerCase().includes(phrase.toLowerCase()),
          false,
          `Anti-hardcoding violation: Production file ${path.basename(filePath)} contains '${phrase}'`,
        );
      }
    }
  });

  test("Audit specificityCompatibilityEvaluator for zero hidden vocabulary sets", () => {
    const evaluatorPath = path.resolve(__dirname, "../lib/ai/specificityCompatibilityEvaluator.ts");
    const content = fs.readFileSync(evaluatorPath, "utf8");
    // Ensure no sets of semantic adjectives/tones exist in production evaluator
    assert.equal(/TONE_AND_STYLE_MODIFIERS/i.test(content), false);
    assert.equal(/(?:gothic|vegan|sarcastic|vintage|wholesome|parody)/i.test(content), false);
  });

  console.log(`\n=================================================`);
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runDefectClassCalibrationSuite().catch((err) => {
  console.error("Suite crashed:", err);
  process.exit(1);
});

export {};
