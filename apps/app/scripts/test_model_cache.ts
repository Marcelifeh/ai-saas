import assert from "node:assert/strict";

// Exercise the actual production cache wrapper with a deterministic failed-evidence pipeline.
// No model, market-source, database or Redis request is permitted.
async function main() {
  process.env.DATABASE_URL = "postgresql://offline:offline@localhost:5432/offline";
  process.env.NEXTAUTH_SECRET = "offline-test-secret";
  delete process.env.REDIS_URL;
  globalThis.fetch = async () => { throw new Error("Unexpected network request"); };
  const evidence = require("../lib/services/marketEvidenceService");
  evidence.getNicheEvidence = async () => { throw new Error("OFFLINE_EVIDENCE_SENTINEL"); };
  const { globalCache } = require("../lib/utils/cache");
  const { generateHighPotentialSlogans } = require("../lib/ai/sloganEngine");
  const { withModelRouting } = require("../lib/ai/modelRouting");
  const reads: string[] = [], writes: string[] = [];
  const cached = { offlineCacheSentinel: true };
  let hit = true;
  globalCache.getAsync = async (key: string) => { reads.push(key); return hit ? cached : null; };
  globalCache.set = (key: string) => { writes.push(key); };
  const input = { niche: "Cache Test", execMode: "elite" };
  let legacyKey: string | undefined;
  for (const flag of [undefined, "false"]) {
    if (flag === undefined) delete process.env.AI_MODEL_ROUTING_ENABLED;
    else process.env.AI_MODEL_ROUTING_ENABLED = flag;
    process.env.AI_MODEL_REASONING = "invalid-challenger";
    reads.length = writes.length = 0; hit = true;
    assert.equal(await generateHighPotentialSlogans(input), cached);
    assert.equal(reads.length, 1); assert.equal(writes.length, 0);
    assert.ok(reads[0].startsWith("slogans:creative-selection-v4:cache test:"));
    if (legacyKey) assert.equal(reads[0], legacyKey); else legacyKey = reads[0];
    reads.length = writes.length = 0; hit = false;
    assert.equal((await generateHighPotentialSlogans(input)).error, "EVIDENCE_FAILED");
    assert.deepEqual(reads, [legacyKey]); assert.deepEqual(writes, [legacyKey]);
  }
  process.env.AI_MODEL_ROUTING_ENABLED = "true";
  for (const strategy of ["BALANCED_FIRST", "REASONING_HEAVY"]) {
    reads.length = writes.length = 0; hit = true;
    const result = await withModelRouting(strategy, () => generateHighPotentialSlogans(input));
    assert.equal(result.error, "EVIDENCE_FAILED");
    assert.deepEqual(reads, []); assert.deepEqual(writes, []);
  }
  console.log("MODEL CACHE ROLLBACK: PASS");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
