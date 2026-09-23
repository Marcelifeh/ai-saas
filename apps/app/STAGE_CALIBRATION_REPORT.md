<!-- Separated infrastructure worktree -->
> Historical benchmark results and earlier validation below came from the mixed working tree. They are not validation of this separated infrastructure-only commit. The human-expression module, its gates and score caps are excluded here. Challenger activation remains disabled. See ISOLATED_VALIDATION.md for validation of this tree.

# Frozen-input calibration follow-up

Challenger activation remains **NOT SAFE TO DEPLOY**. This follow-up changes benchmark/review tooling and artifact hygiene, not production routing policy, prompts, thresholds or recovery bounds. No files were staged, committed or pushed.

## What is now isolated

`scripts/benchmark_stage_calibration.ts` freezes original market evidence independently, then prepares one CONTROL composition/profile, territory set, creative brief and eligible intent set. Complete snapshots are integrity-checked and tied to source/configuration fingerprints. They are never silently refreshed. Both generators receive copies of those exact inputs. Candidate batches are reused unchanged across evaluator arms:

| Arm | Generator | Semantic/intersection evaluator | Expression evaluator |
|---|---|---|---|
| A | CONTROL | CONTROL | CONTROL |
| B | Stronger | CONTROL | CONTROL |
| C | CONTROL | Stronger | Stronger |
| D | Stronger | Stronger | Stronger |
| E | CONTROL | Exact judgments from A | Stronger |

E isolates expression-worthiness without re-sampling the semantic gate. A/C/E share one exact candidate pool; B/D share the other. No evaluator receives another evaluator's expression scores or generator metadata. Evidence, candidates and configuration hashes make mismatches detectable. Stage checkpoints retain known call usage and the last running stage on timeout. Shared generation and A's semantic cost must be allocated to dependent arms when comparing total costs; E's incremental recorded call cost alone is not an end-to-end run cost.

This is a stage experiment using existing production functions, not a replacement creative engine or a production release test. Compression, recovery, downstream design/listing and full ranking are deliberately outside this isolated comparison. The stronger generator uses the configured REASONING tier; the CONTROL generator and verifier retain existing configured models. No model policy was tuned from the original benchmark failures.

## Actual live status

A new preparation attempt on 2026-09-13 hit OpenAI **429 at COMPOSITION_INFERENCE**, after the retained two SDK retries. Artifact: `artifacts/stage-calibration/0-prepare.json`. The first case's original market evidence has now been frozen separately in `0-evidence.json`, with integrity verification. Its upstream Reddit source used the existing stale cache after 403 responses; frozen does not mean fresh or high-quality.

No complete frozen profile/territory/intent snapshot exists yet, and **A–E have not run live**. The nine-case experiment is not claimed complete. Additional provider-dependent attempts were stopped rather than spending through the same known rate-limit failure. A final-code quality comparison remains blocked by provider access; human efficiency metrics remain unavailable.

From `apps/app`, after provider access recovers:

```powershell
node scripts/model_routing_runner.cjs benchmark_stage_calibration --prepare --case=0
node scripts/model_routing_runner.cjs benchmark_stage_calibration --run --case=0
```

Cases 0–8 are the existing nine representative benchmarks. Use a new `AI_CALIBRATION_OUTPUT` directory to intentionally refresh evidence or change code/configuration. Preparation reuses existing frozen evidence; `--run` rejects changed code/configuration and refuses to overwrite an experiment that has already started. The default per-command live timeout is 300 seconds (`AI_CALIBRATION_TIMEOUT_MS`). Freeze evidence alone without model calls using `--freeze-evidence`.

## Historical failure attribution

`scripts/attribute_model_failures.ts` classified all 14 unsuccessful historical runs, preserving original error codes and observed failed-call stages in `artifacts/model-routing-live/failure-attribution.json`.

- CONTROL: 3 provider rate-limit failures.
- BALANCED_FIRST: 3 provider rate-limit failures, 2 timeouts.
- REASONING_HEAVY: 3 provider rate-limit failures, 3 creative-zero outcomes.

The rate-limit records identify composition, profile or intent calls where available. The two old timeouts have **unknown stages**, because their artifacts lacked checkpoints. They cannot support a claim that semantic or expression verification caused the excess technical failures. The fixed taxonomy distinguishes profile/intent format errors, provider errors, composition/generation errors, semantic/expression verifier failures, rate limits, timeout and creative zero. New preparation failures retain their current stage even when no call fails structurally at the transport layer.

## Human review

The existing **99 rows retain their IDs, pairing, candidates and A/B labels**. No key was read by the upgrade script. Review now uses six 1–5 dimensions: niche truth, self-recognition, originality, natural wearability, purchase appeal and overall preference score. Two required judgments were added:

- `wouldChooseForShirt`: YES / NO.
- `expressionJudgment`: HUMAN EXPRESSION / CONCEPT DESCRIPTION.

The existing pair preference remains A/B/TIE/NO_COMPARISON, separately from the numeric overall-preference score. The unblind command refuses incomplete rows, out-of-range scores and missing binary judgments. Resume/export no longer regenerates existing review identities. Only provide reviewers `artifacts/model-routing-live/human-review.blinded.json`; withhold the key, model-labelled results and comparison report until scoring is complete.

**Human scoring is still pending.** It has not been replaced by assistant/model judgments. `qualityEfficiency` defines gain per added dollar, gain per added second and a success-rate-adjusted combined measure. It returns null when human scores or valid denominators are missing. No human-quality efficiency claim is available yet, and the original 99 rows cannot establish causal gains for the new frozen experiment.

## Disabled infrastructure and Git hygiene

The gateway regression now verifies both an absent feature flag and `AI_MODEL_ROUTING_ENABLED=false` across profile, generation, semantic, expression and recovery tasks, even with low-confidence/recovery signals and an invalid challenger model configured. The emitted CONTROL request payload remains identical. This verifies model-parameter rollback; it does not claim byte-identical logs, since instrumentation is intentionally new.

`.gitignore` now excludes only local `artifacts/model-routing*/` and `artifacts/stage-calibration*/` experiment directories. Nothing was deleted. Other existing artifacts remain visible for deliberate review. `git diff --cached --stat` is empty. Existing uncommitted crossover-expression changes are still present and require their own review before selecting a commit; the entire working tree is not automatically commit-approved.

Validation: the new stage-calibration tests and expanded gateway rollback tests pass; TypeScript passes. Production build and diff whitespace validation pass. The build retains a nonfatal Turbopack/Prisma file-tracing warning. Production flag defaults remain false. Recommendation: review and selectively commit the disabled infrastructure only after inspecting the complete intended source diff; do not activate the challenger or stage the artifact directory.
