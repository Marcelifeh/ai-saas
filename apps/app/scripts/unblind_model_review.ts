import fs from "node:fs";
import path from "node:path";
import { completedHumanReview } from "./calibration_support";

const folder = path.resolve(process.env.AI_BENCHMARK_OUTPUT || "artifacts/model-routing-live");
const review = JSON.parse(fs.readFileSync(path.join(folder, "human-review.blinded.json"), "utf8"));
const keys = JSON.parse(fs.readFileSync(path.join(folder, "human-review.key.private.json"), "utf8"));
if (!Array.isArray(review) || !review.length || !Array.isArray(keys) || review.length !== keys.length ||
    new Set(review.map(row => row.id)).size !== review.length || review.some(row =>
      !keys.some(key => key.id === row.id) || !completedHumanReview(row))) {
  console.error("Review incomplete: score all six dimensions 1–5, answer both classification questions, and choose A/B/TIE/NO_COMPARISON before unblinding.");
  process.exitCode = 1;
} else {
  fs.writeFileSync(path.join(folder, "human-review.scored-unblinded.json"), JSON.stringify(review.map(row => ({ ...row, strategy: keys.find(key => key.id === row.id).strategy })), null, 2));
  console.log("Completed human review unblinded.");
}
