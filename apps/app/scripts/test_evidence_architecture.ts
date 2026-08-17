import fs from "fs";
import path from "path";
import Module from "module";

// Load .env from workspace if process.env is missing values
try {
  const envPaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(__dirname, "../.env"),
  ];
  const envPath = envPaths.find((candidate) => fs.existsSync(candidate));
  if (envPath) {
    const raw = fs.readFileSync(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (val.startsWith("\"") && val.endsWith("\"")) val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
} catch (_) {}

process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "test-secret-key-for-standalone-scripts-32byteslong";
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Mock server-only package when running scripts via Node/tsx
const originalRequire = Module.prototype.require;
// @ts-ignore
Module.prototype.require = function (request: string) {
  if (request === "server-only") return {};
  return originalRequire.apply(this, arguments);
};

const { getNicheEvidence, verifyEvidenceIntegrity } = require("../lib/services/marketEvidenceService");
const { saveOpportunityToWatchlist, updateOpportunityStage } = require("../lib/services/opportunityService");
const { createFactoryRun, retryFactoryJob, refreshFactoryJob } = require("../lib/services/factoryJobService");
const { computeSloganDeltas } = require("../lib/ai/sloganExplainability");
const { createDesignCandidate } = require("../lib/ai/designLineage");
const { createProvenanceSnapshot } = require("../lib/ai/provenance");

async function runEvidenceArchitectureSuite() {
  console.log("=================================================");
  console.log("  TRENDFORGE EVIDENCE ARCHITECTURE RUNTIME SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // TEST 1: Deep Freeze & Immutability
  console.log("--- 1. Snapshot Immutability & Deep Freeze ---");
  const evidence = await getNicheEvidence("pickleball");

  let mutationBlocked = false;
  try {
    // Attempt nested array mutation
    (evidence.trendSignals as any)[0].confidence = 0.0;
  } catch (err) {
    mutationBlocked = true;
  }
  assert(
    mutationBlocked || Object.isFrozen(evidence.trendSignals[0]),
    "Nested snapshot mutation blocked by deepFreeze",
    `confidence: ${evidence.trendSignals[0].confidence}`
  );

  let pushBlocked = false;
  try {
    (evidence.buyerLanguage as any).push({ phrase: "tampered", confidence: 0, evidenceCount: 0 });
  } catch (err) {
    pushBlocked = true;
  }
  assert(pushBlocked || Object.isFrozen(evidence.buyerLanguage), "Buyer language array push blocked");

  // TEST 2: SHA-256 Content Hash Verification
  console.log("\n--- 2. SHA-256 Content Hash & Integrity ---");
  const isOriginalValid = verifyEvidenceIntegrity(evidence);
  assert(isOriginalValid, "Original snapshot verification PASS", `Hash: ${evidence.contentHash.slice(0, 16)}...`);

  const tamperedSnapshot: NicheMarketEvidence = {
    ...evidence,
    niche: "tampered_niche",
  };
  const isTamperedValid = verifyEvidenceIntegrity(tamperedSnapshot);
  assert(!isTamperedValid, "Tampered snapshot verification FAIL (Detected)");

  // TEST 3: Governed Opportunity Lifecycle & Auditable Transitions
  console.log("\n--- 3. Governed Opportunity Lifecycle ---");
  const opp = await saveOpportunityToWatchlist({
    niche: "pickleball",
    audience: "Competitive Retirees",
    whyItSells: "High community engagement",
    emotionalTrigger: "Pride",
    projectedRevenue: 1200,
    nicheScore: 84,
    trendScore: 78,
    culturalSignals: ["court shoes", "dink diplomacy"],
    evidenceSnapshotId: evidence.id,
  });

  assert(opp.stage === "WATCHING", "Opportunity created in WATCHING stage");
  assert(opp.transitionHistory.length === 1, "Initial transition logged");

  // Test valid transition: WATCHING -> ACCELERATING
  const validTransition = await updateOpportunityStage(opp.opportunityId, "ACCELERATING", "SIGNAL_ACCELERATION");
  assert(validTransition.success, "Allowed transition WATCHING -> ACCELERATING succeeds");
  assert(
    validTransition.opportunity?.transitionHistory.length === 2 &&
      validTransition.opportunity?.transitionHistory[1].reasonCode === "SIGNAL_ACCELERATION",
    "Audit event logged with reasonCode SIGNAL_ACCELERATION"
  );

  // Test forbidden transition: ACCELERATING -> WINNER (must go through FACTORY_READY -> TESTING)
  const forbiddenTransition = await updateOpportunityStage(opp.opportunityId, "WINNER", "USER_ACTION");
  assert(!forbiddenTransition.success, "Forbidden transition ACCELERATING -> WINNER rejected");

  // TEST 4: Factory Deterministic RETRY vs. REFRESH Modes
  console.log("\n--- 4. Factory Job RETRY vs. REFRESH Lineage ---");
  const factoryRun = createFactoryRun([{ niche: "pickleball", opportunityId: opp.opportunityId, evidenceSnapshotId: evidence.id }]);
  const initialJob = factoryRun.jobs[0];

  assert(initialJob.runMode === "INITIAL_RUN", "Factory job created with INITIAL_RUN mode");
  assert(initialJob.evidenceSnapshotId === evidence.id, "Factory job carries evidence snapshot ID");

  // RETRY: Reuse exact evidenceSnapshotId
  const retryRes = await retryFactoryJob(factoryRun.runId, "pickleball");
  assert(retryRes.success, "Factory job retry succeeds");
  assert(retryRes.job?.runMode === "RETRY", "Retried job runMode is RETRY");
  assert(retryRes.job?.evidenceSnapshotId === evidence.id, "Retried job reuses original evidenceSnapshotId");
  assert(retryRes.job?.parentJobId === initialJob.jobId, "Retried job maintains parentJobId lineage");

  // REFRESH: Acquire new evidence snapshot
  const refreshRes = await refreshFactoryJob(factoryRun.runId, "pickleball");
  assert(refreshRes.success, "Factory job refresh succeeds");
  assert(refreshRes.job?.runMode === "REFRESH", "Refreshed job runMode is REFRESH");
  assert(refreshRes.job?.parentJobId === retryRes.job?.jobId, "Refreshed job maintains parent lineage");

  // TEST 5: Multi-Signal Slogan Delta Engine
  console.log("\n--- 5. Multi-Signal Slogan Delta Engine ---");
  const prevSlogans = [
    { slogan: "Reads Past Midnight", score: 82 },
    { slogan: "Dink Responsibly", score: 78 },
  ];
  const currSlogans = [
    { slogan: "Reads Past Midnight", score: 85 }, // Exact / Refined score
    { slogan: "Kitchen Rule Champion", score: 90 }, // New slogan
  ];

  const deltas = computeSloganDeltas(prevSlogans, currSlogans);

  const retainedOrRefinedExact = deltas.find((d) => d.slogan === "Reads Past Midnight");
  assert(
    retainedOrRefinedExact?.deltaType === "REFINED" || retainedOrRefinedExact?.deltaType === "RETAINED",
    "Exact slogan classified as RETAINED/REFINED"
  );

  const newSlogan = deltas.find((d) => d.slogan === "Kitchen Rule Champion");
  assert(newSlogan?.deltaType === "NEW", "Novel slogan classified as NEW");

  const droppedSlogan = deltas.find((d) => d.slogan === "Dink Responsibly");
  assert(droppedSlogan?.deltaType === "DROPPED", "Omitted slogan classified as DROPPED");

  // Semantic variation test (Reads Past Midnight -> Still Reading After Midnight)
  const semanticRegenDeltas = computeSloganDeltas(
    [{ slogan: "Reads Past Midnight", score: 82 }],
    [{ slogan: "Still Reading After Midnight", score: 88 }]
  );
  const refinedSemantic = semanticRegenDeltas.find((d) => d.slogan === "Still Reading After Midnight");
  assert(
    refinedSemantic?.deltaType === "REFINED" && (refinedSemantic?.deltaConfidence ?? 0) >= 0.2,
    "Semantic variation (Reads Past Midnight -> Still Reading After Midnight) classified as REFINED"
  );

  // TEST 6: Design Candidate Lineage
  console.log("\n--- 6. Design Candidate Lineage ---");
  const designA = createDesignCandidate("sl_101", "Vintage retro t-shirt graphic", "AUTO", "HYBRID");
  const designB = createDesignCandidate("sl_101", "Bold distressed typography graphic", "AUTO", "TEXT_ONLY", designA.id, "USER_REFRESH");

  assert(designB.parentDesignId === designA.id, "Design candidate maintains parentDesignId lineage");
  assert(designB.regenerationReason === "USER_REFRESH", "Design candidate records regenerationReason");

  // TEST 7: Full Lineage Traceability & Integrity Contract
  console.log("\n--- 7. End-to-End Intelligence Provenance Traversal ---");
  const prov = createProvenanceSnapshot("pickleball", evidence.rawSignals, evidence.id, {
    opportunityId: opp.opportunityId,
    sloganId: "sl_101",
    designId: designB.id,
  });

  assert(prov.evidenceSnapshotId === evidence.id, "Provenance links back to original evidence snapshot ID");
  assert(prov.parentOpportunityId === opp.opportunityId, "Provenance links back to root opportunity ID");

  // Backward verification assertion
  const loadedEvidence = await getNicheEvidence("pickleball");
  const isEndToEndValid = verifyEvidenceIntegrity(loadedEvidence);
  assert(isEndToEndValid, "Full backward lineage verification to ME snapshot PASSES integrity check");

  console.log("\n=================================================");
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidenceArchitectureSuite().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
