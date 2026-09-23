import fs from "node:fs";
import path from "node:path";
import { classifyCalibrationFailure } from "./calibration_support";
const folder = path.resolve(process.env.AI_BENCHMARK_OUTPUT || "artifacts/model-routing-live");
const rows = fs.readdirSync(folder).filter(file => /^\d+-(CONTROL|BALANCED_FIRST|REASONING_HEAVY)\.json$/.test(file)).flatMap(file => {
  const result = JSON.parse(fs.readFileSync(path.join(folder, file), "utf8"));
  if (result.status === "COMPLETED") return [];
  const failures = (result.calls ?? []).filter((call: any) => !call.success);
  const last = failures.at(-1);
  const error = result.error ?? result.metrics?.error;
  return [{ file, benchmark: result.benchmark, strategy: result.strategy,
    category: classifyCalibrationFailure({ error, taskType: last?.taskType, errorCategory: last?.errorCategory }),
    observedStage: last?.taskType ?? null, originalError: error, failedCallStages: failures.map((call: any) => call.taskType),
    stageAttribution: last ? "OBSERVED_FAILED_CALL" : error === "PIPELINE_TIMEOUT" ? "UNKNOWN_NO_CHECKPOINT" : "RUN_OUTCOME_ONLY" }];
});
fs.writeFileSync(path.join(folder, "failure-attribution.json"), JSON.stringify(rows, null, 2));
console.log(JSON.stringify(rows, null, 2));
