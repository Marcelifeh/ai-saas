<!-- Separated infrastructure worktree -->
> Historical benchmark results and earlier validation below came from the mixed working tree. They are not validation of this separated infrastructure-only commit. The human-expression module, its gates and score caps are excluded here. Challenger activation remains disabled. See ISOLATED_VALIDATION.md for validation of this tree.

# Opt-in model routing

Production defaults remain CONTROL. Set `AI_MODEL_ROUTING_ENABLED=true` only after acceptance. Set it to `false` (or remove it) to restore the exact legacy model, temperature, token and response-format payloads. Existing `OPENAI_SLOGAN_CREATIVE_MODEL` and `OPENAI_SLOGAN_VERIFIER_MODEL` overrides remain active under CONTROL. No output caches are read or populated by challenger runs.

| Configuration | Default / behavior |
|---|---|
| AI_MODEL_ROUTING_ENABLED | false |
| AI_MODEL_FAST | gpt-4o-mini-2024-07-18 |
| AI_MODEL_BALANCED | gpt-4.1-2025-04-14 |
| AI_MODEL_REASONING | o3-2025-04-16 |
| AI_REASONING_DEFAULT | MEDIUM; FAST uses LOW |
| AI_REASONING_VERIFIER | MEDIUM |
| AI_REASONING_RECOVERY | HIGH |
| AI_MODEL_CAPABILITIES_JSON | exact model-name map of `{reasoning, temperature, strict, completionTokens}` booleans |
| AI_MODEL_PRICING_JSON | exact model-name map of USD input/output/cached-input prices per million tokens |
| AI_BENCHMARK_OUTPUT | artifacts/model-routing |
| AI_BENCHMARK_TIMEOUT_MS | 300000, per independent worker |
| AI_BENCHMARK_CONCURRENCY | 1; configurable up to 3 independent processes |

The initial pinned reasoning model is a compatibility experiment, not a claim that it is the newest or best model. Official documentation marks its snapshot deprecated; configure a supported replacement with reviewed Chat Completions capabilities before any production promotion. Unknown model capability overrides fail explicitly rather than guessing unsupported parameters. Changing a tier model never requires a business-logic edit.

FAST handles extraction/normalization. BALANCED handles ordinary profile, composition, territories, intents, generation, compression and design/listing work. REASONING handles semantic, intersection, intent and expression verification, plus bounded creative recovery. Low-confidence compounds escalate profile/composition/intent/territory reasoning. Plain single niches and confident compounds do not escalate solely for being creative. Routing receives task labels and numeric/boolean signals; it never receives the niche name. Secondary composition runs inherit an isolated recovery context. Existing attempt bounds and score thresholds are unchanged.

OpenAI compatibility is centralized separately from task selection. GPT-4 models receive temperature and no reasoning setting. o3 receives `reasoning_effort`, no temperature, and `max_completion_tokens` with 8192 extra bounded reasoning tokens. No model downgrade is permitted. Existing SDK technical retries are retained and observed at the transport layer.

Strict schemas use the installed SDK's Zod v4 converter. Indexed verifiers retain production parsing, exact index/count validation and one structural repair. Composition classification uses the same structural-only one-repair rule. Compound parser preprocessing still discards model-authored composition metadata; the provider schema requests judgments only. The provider worthiness schema requires `metaDescriptionRisk`, while the legacy parser's optionality and graded interaction rules stay intact. Refusals and provider failures do not become structural repair or creative exhaustion.

`aiTelemetry.ts` uses AsyncLocalStorage to isolate run IDs and aggregates. Single/bulk Strategy Factory entrypoints and standalone slogan generation establish scopes; nested calls share the existing run. `AI_CALL` records model/task, actual effort, elapsed time, token usage, cache usage, retries, repair status and errors. `AI_VERIFIER_VALIDATION` records parser failures after transport success. `AI_RUN` aggregates counts, tokens, estimated USD cost, summed AI time and wall time. Summed AI time can exceed wall time because existing pipeline batches run concurrently. No new telemetry includes prompts, credentials or raw provider errors. Existing usage accounting remains in place.

Prices are estimates, not invoices. Defaults are dated 2026-09-12; configuration can override negotiated or updated rates. Unknown models have null estimates. Failed calls with no reported usage cannot prove the provider billed nothing. Raw provider attempts and logical calls are distinct; SDK retries do not manufacture additional creative outputs.

Run from `apps/app`:

```powershell
node scripts/model_routing_runner.cjs test_model_routing
node scripts/model_routing_runner.cjs test_model_gateway
node scripts/model_routing_runner.cjs benchmark_model_routing
node scripts/model_routing_runner.cjs benchmark_model_routing --live
node scripts/model_routing_runner.cjs benchmark_model_routing --live --resume
node scripts/model_routing_runner.cjs report_model_routing
node scripts/model_routing_runner.cjs unblind_model_review
```

The benchmark launches independent processes for nine niches × CONTROL/BALANCED_FIRST/REASONING_HEAVY. It exercises the authoritative slogan pipeline, not full downstream design/listing generation. Creative caches are disabled; upstream market-source caches retain their normal policy. Evidence hashes are recorded so unequal evidence can be flagged as a comparison limitation. Timeouts and provider errors are technical failures, not quality failures. Generated outputs never feed another arm. New runs checkpoint completed call telemetry to partial artifacts so timeouts retain known usage; in-flight usage remains unknown. Resume preserves existing results. Human review exports compare each challenger to CONTROL using randomized A/B identities. Give reviewers only `human-review.blinded.json`; withhold the private key and raw result files until scores are complete. Score all six dimensions 1–5, complete both shirt-choice and expression judgments, and use A/B/TIE/NO_COMPARISON for the separate pair preference; see STAGE_CALIBRATION_REPORT.md. The unblind script refuses incomplete scoring. Null diagnostics mean unmeasured, not zero defects. Contamination requires independent human labeling.

Do not promote based on survivors alone. Require completed blinded human scoring, stable evidence, acceptable cost/latency, all regressions/build passing, no truth/intersection/provenance regression, and no verifier-format regression. A single stochastic run per arm is exploratory evidence, not a statistically reliable release decision.

Official sources checked against the installed SDK: [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Chat Completions parameters](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create), [GPT-4.1 snapshot/pricing](https://developers.openai.com/api/docs/models/gpt-4.1), [o3 snapshot/pricing](https://developers.openai.com/api/docs/models/o3), [GPT-4o mini pricing](https://developers.openai.com/api/docs/models/gpt-4o-mini).
