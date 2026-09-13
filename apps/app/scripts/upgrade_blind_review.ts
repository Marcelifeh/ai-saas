import fs from "node:fs";
import path from "node:path";
const file = path.resolve(process.env.AI_BENCHMARK_OUTPUT || "artifacts/model-routing-live", "human-review.blinded.json");
const rows = JSON.parse(fs.readFileSync(file, "utf8"));
// Preserve row IDs, pair IDs, candidates and A/B labels. Never read the identity key.
for (const row of rows) {
  const scores = row.humanScore ?? {};
  row.humanScore = { ...scores, selfRecognition: scores.selfRecognition ?? scores.identityRecognition ?? null,
    naturalWearability: scores.naturalWearability ?? scores.wearability ?? null, overallPreference: scores.overallPreference ?? null };
  delete row.humanScore.identityRecognition;
  delete row.humanScore.wearability;
  row.wouldChooseForShirt ??= null;
  row.expressionJudgment ??= null;
  row.reviewScale = "1–5 (higher is better)";
}
fs.writeFileSync(file, JSON.stringify(rows, null, 2));
console.log(`Updated ${rows.length} blinded rows without reading the private key.`);
