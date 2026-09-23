<!-- Separated infrastructure worktree -->
> Historical benchmark results and earlier validation below came from the mixed working tree. They are not validation of this separated infrastructure-only commit. The human-expression module, its gates and score caps are excluded here. Challenger activation remains disabled. See ISOLATED_VALIDATION.md for validation of this tree.

# TrendForge model architecture — implementation and acceptance report

## 1. Executive summary

Implemented an opt-in stage/complexity router, pinned central configuration, strict priority verifier outputs, reasoning compatibility, run telemetry, cost estimates, deterministic tests and a three-strategy benchmark. Production routing remains disabled. No thresholds or creative prompts were relaxed; no fallback slogans or niche-specific routing were added. Existing uncommitted expression-quality work was preserved. Nothing was committed or pushed.

**Recommendation: NOT SAFE TO DEPLOY the challenger.** All 27 live attempts have artifacts, but only 13 completed successfully. Two challenger runs timed out, nine runs encountered provider rate limits, and three reasoning-heavy runs exhausted eligible creative output. There is no completed human preference evaluation and no demonstrated acceptable cost/latency tradeoff.

## 2. Current model usage audit

See [the full baseline invocation table](MODEL_ROUTING_AUDIT.md), including files, functions, stages, models, temperature, output budgets/formats and conditional call frequency. One OpenAI SDK client serves all discovered production invocations. Semantic eligibility originally used GPT-4o mini; other verifiers used configurable GPT-4.1/GPT-4o defaults. Deterministic provenance/specificity logic was not replaced with another AI authority.

## 3. Model routing architecture

`modelRouting.ts` separates semantic tasks from provider capabilities. FAST handles utilities; BALANCED handles ordinary creative reasoning; REASONING handles verification and bounded recovery. Compound confidence and scoped recovery status drive escalation. Routing never sees niche strings. AsyncLocalStorage keeps concurrent policies and run contexts isolated. Challenger creative caches are disabled; CONTROL retains its legacy cache behavior.

## 4. Configuration added

`AI_MODEL_ROUTING_ENABLED`, three `AI_MODEL_*` tier settings, three `AI_REASONING_*` effort settings, `AI_MODEL_CAPABILITIES_JSON`, and `AI_MODEL_PRICING_JSON`. Benchmark output, timeout and concurrency settings are separate. `.env.example` keeps routing false. See [configuration and operational instructions](MODEL_ROUTING.md).

Initial challenger snapshots: `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `o3-2025-04-16`. Successful live challenger calls exercised the latter two. The reasoning snapshot is marked deprecated in official documentation; a supported, explicitly reviewed replacement must be selected and evaluated before production promotion. CONTROL deliberately preserves its moving aliases and old environment overrides for rollback. Where available, telemetry also records the served snapshot.

## 5. Structured output improvements

Strict Zod-backed contracts cover semantic eligibility, blind readings, compound intersection, expression intent, expression worthiness, creative-brief verification, independent human-expression assessment, composition classification and self-revelation classification. Production index/count validation and bounded structural repair remain authoritative. Compound provider schemas omit parser-only preprocessing; parser behavior is preserved. The optional legacy meta-description field is required only in the challenger provider contract.

The four existing verifier technical codes remain intact. Challenger refusals fail technically; CONTROL refusal behavior is preserved. Deterministic specificity compatibility has no AI schema to migrate. Non-priority creative/design JSON callers retain their existing loose contracts; expanding strict design schemas remains outside the completed priority migration.

## 6. Reasoning-effort strategy

Effort is sent only for reviewed supporting models. Verifiers use MEDIUM; creative recovery uses HIGH. GPT-4 models retain temperature and omit effort; the experimental o3 route removes temperature and uses `max_completion_tokens` with a bounded 8192-token reasoning allowance. Unknown capability configurations fail explicitly. There is no silent verifier downgrade, and existing SDK technical retry limits remain unchanged.

## 7. Telemetry architecture

Per-call records include run, task, tier, requested/served model, actual effort, latency, usage, cached tokens, SDK retries, structural repairs, outcome and sanitized error category. Parser failures annotate transport-success records. Single/bulk Strategy Factory entrypoints and standalone slogan generation establish run scopes. Totals distinguish logical calls from provider attempts and summed AI latency from wall time. New telemetry excludes prompts and credentials.

## 8. Cost instrumentation

Central USD estimates use dated official model prices and support overrides. Unknown pricing or missing provider usage yields null, not free execution. The comparison report reconstructs early artifact estimates from recorded usage. Failed/in-flight requests may have unreported billed usage. The two original timeout artifacts lack per-call usage; the final harness now checkpoints known usage for future interrupted runs.

## 9. Files changed

New implementation: `lib/ai/modelRouting.ts`, `modelPricing.ts`, `aiTelemetry.ts`, `compositionSchema.ts`.

Integrated call sites: `aiGateway.ts`, `structuredVerifier.ts`, `verifierSchemas.ts`, `dynamicNicheProfile.ts`, `dynamicCreativeSelectionEngine.ts`, `expressionIntent.ts`, `expressionWorthiness.ts`, existing untracked `humanExpression.ts`, `sloganEngine.ts`, `behavioralSloganEngine.ts`, `dynamicDesignPrompt.ts`, `dynamicListingEngine.ts`, `marketInsightEngine.ts`, `trendEngine.ts`, `services/factoryService.ts`, `services/trendDiscoveryService.ts`.

Added scripts: `test_model_routing.ts`, `test_model_gateway.ts`, `model_routing_runner.cjs`, `benchmark_model_routing.ts`, `report_model_routing.ts`, `unblind_model_review.ts`. Updated package commands and root `.env.example`; added audit/config/report documents and benchmark artifacts. Pre-existing crossover fixtures, calibration-test edits and other user artifacts were not reverted or claimed as newly implemented.

## 10. Regression coverage

Passed: TypeScript; `test_defect_class_calibration` (19 checks); `test_evidence_architecture` (33 checks); `regression_dynamic_slogans`; `regression_creative_selection`; `regression_dynamic_listing`; deterministic `benchmark_dynamic_design`; `offline_verifier_acceptance`; new routing and mocked gateway tests. The mock suite verifies exact CONTROL API payloads, strict schemas, supported reasoning parameters, one structural repair, retained SDK retries, no model downgrade, token telemetry and secret exclusion. The unblind command correctly refuses incomplete human scoring.

Final post-refinement production build **passed** with network access: compilation, TypeScript, page-data collection and all 20 static pages completed. The sandbox-only attempt failed to fetch Google Fonts. A benchmark-script Buffer type mismatch found during an intermediate build was fixed and the final build rerun successfully. A non-fatal existing Prisma/Turbopack tracing warning remains. `git diff --check` passed; line-ending warnings are not whitespace errors.

## 11. CONTROL vs challenger results

See [every attempted run](artifacts/model-routing-live/COMPARISON.md) and [machine-readable paired diagnostics](artifacts/model-routing-live/comparison.json).

| Strategy | Completed | Creative exhaustion | Technical failures | Ranked output total |
|---|---:|---:|---:|---:|
| CONTROL | 6/9 | 0 | 3 rate-limited | 42 |
| BALANCED_FIRST | 4/9 | 0 | 3 rate-limited + 2 timeouts | 19 |
| REASONING_HEAVY | 3/9 | 3 | 3 rate-limited | 19 |

The required symbolic/identity compound, behavioral compound and ordinary single niche were attempted; rate limits prevented completed comparisons for those final three cases. They are not counted as quality failures.

## 12. Quality comparison

Results are mixed and do not establish improvement. For completed paired runs, BALANCED_FIRST's average self-recognition/identity/wearability scores declined in three of four niches and improved in the gym/meal-prep case. Unsupported-inference rejection rates increased across all four paired completed cases. Different evaluators and generated candidate populations make these diagnostics, not independent evidence of a scoring-scale shift. No thresholds were recalibrated.

REASONING_HEAVY exhausted intents for pumpkin-spice/fall coffee, black-cats/Halloween and ceramic-artists/tea. The pumpkin-spice run classified humor as an extra compound axis despite the existing instruction against that; this is a generic composition-quality concern, not grounds for a niche-specific fix.

99 blinded candidate review rows were exported. Human scores and contamination rates remain unmeasured. Reviewers should receive only [the blinded fixture](artifacts/model-routing-live/human-review.blinded.json), using the six 1–5 scores and required judgments documented in [the calibration follow-up](STAGE_CALIBRATION_REPORT.md). Model identities remain in a separate key withheld until scoring is complete. Top-candidate export is capped at eight per system/benchmark.

## 13. Latency comparison

On the four niches completed by CONTROL and BALANCED_FIRST, the challenger took **76.4 seconds more per run on average**. On the three completed CONTROL/REASONING_HEAVY pairs, it took **104.6 seconds more**. Two BALANCED_FIRST runs exceeded the 300-second worker limit. These are exploratory paired wall-time differences, not controlled production SLA estimates.

## 14. Cost comparison

For the same completed pairs, estimated incremental cost averaged **+$0.470/run** for BALANCED_FIRST and **+$0.478/run** for REASONING_HEAVY. The first pumpkin-spice comparison was approximately $0.106 CONTROL versus $0.942 BALANCED_FIRST. Timeout costs are unknown and excluded, so these figures do not establish an acceptable overall cost increase.

## 15. Recovery/failure comparison

No recorded finished run used secondary composition recovery. Rejection-aware recovery remained bounded; routing tests verify HIGH/REASONING selection for recovery contexts. CONTROL recorded one structural repair; completed challenger artifacts recorded none. That observation cannot prove format-failure non-regression because timeouts and provider failures censored evaluation. Nine late rate-limit failures and two timeouts remain technical failures; three reasoning-heavy zero-result outcomes remain creative exhaustion.

## 16. Remaining risks and limits

- Human preference and independent contamination labeling are incomplete.
- The three final benchmarks need a successful rerun after provider access recovers.
- Evidence hashes differed across paired runs; original market inputs were collected independently and upstream caches can be stale. A fixed original-evidence replay is needed for a tighter release comparison.
- Early runs predate final schema/telemetry refinements and lack exact code fingerprints; this is not a frozen release acceptance matrix. Final code needs a clean uncached rerun.
- Two timed-out runs lack full usage and stage diagnostics. Final checkpoint support improves future runs, not those historical records.
- The benchmark covers the authoritative slogan pipeline, excluding full live downstream design/listing cost. Factory aggregation is wired, but that complete live path still needs measurement.
- The initial reasoning snapshot is deprecated; capabilities for any replacement must be explicitly configured and tested.
- One run per arm is insufficient to establish repeatable quality or scoring-scale changes.

## 17. Recommended production routing

Keep CONTROL and `AI_MODEL_ROUTING_ENABLED=false`. Retain BALANCED_FIRST as the next hypothesis to test after choosing a supported reasoning snapshot, using fixed original evidence, completing the interrupted cases, measuring the full Factory path, and obtaining blinded human scores. Do not choose REASONING_HEAVY solely because it uses more reasoning.

## 18. Recommendation

**NOT SAFE TO DEPLOY the challenger.** The implementation provides a reversible evaluation path, but release requirements for quality, coverage, cost and latency have not been met. No production configuration was promoted, and no commit or push was performed.
