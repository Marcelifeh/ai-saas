<!-- Separated infrastructure worktree -->
> Historical benchmark results and earlier validation below came from the mixed working tree. They are not validation of this separated infrastructure-only commit. The human-expression module, its gates and score caps are excluded here. Challenger activation remains disabled. See ISOLATED_VALIDATION.md for validation of this tree.

# Disabled routing infrastructure commit boundary

Review date: 2026-09-13. This boundary was assembled in the isolated routing-infrastructure-isolated worktree from HEAD 7d029fe. See ISOLATED_VALIDATION.md for current verification. No production activation is included.

## Include complete files

These paths contain routing/configuration, instrumentation, strict provider contracts, or standalone tooling changes. Existing prompts, scoring thresholds and legacy model defaults are outside the intended change.

```text
.env.example
.gitignore
apps/app/lib/ai/modelRouting.ts
apps/app/lib/ai/aiTelemetry.ts
apps/app/lib/ai/modelPricing.ts
apps/app/lib/ai/compositionSchema.ts
apps/app/lib/ai/aiGateway.ts
apps/app/lib/ai/structuredVerifier.ts
apps/app/lib/ai/verifierSchemas.ts
apps/app/lib/ai/behavioralSloganEngine.ts
apps/app/lib/ai/dynamicCreativeSelectionEngine.ts
apps/app/lib/ai/dynamicDesignPrompt.ts
apps/app/lib/ai/dynamicListingEngine.ts
apps/app/lib/ai/dynamicNicheProfile.ts
apps/app/lib/ai/expressionIntent.ts
apps/app/lib/ai/marketInsightEngine.ts
apps/app/lib/ai/trendEngine.ts
apps/app/lib/services/factoryService.ts
apps/app/lib/services/trendDiscoveryService.ts
apps/app/package.json
apps/app/scripts/model_routing_runner.cjs
apps/app/scripts/test_model_gateway.ts
apps/app/scripts/test_stage_calibration.ts
apps/app/scripts/benchmark_stage_calibration.ts
apps/app/scripts/calibration_support.ts
apps/app/scripts/attribute_model_failures.ts
apps/app/scripts/report_model_routing.ts
apps/app/scripts/unblind_model_review.ts
apps/app/scripts/upgrade_blind_review.ts
```

The package change consists only of four routing test/benchmark/report commands. The ignore change excludes local model-routing and stage-calibration output directories. No artifact contents belong in the commit.

## Include only selected changes in mixed files

| Path | Include | Exclude |
|---|---|---|
| `lib/ai/expressionWorthiness.ts` | `legacyModels` import; NORMALIZATION task label and equivalent utility default; EXPRESSION_VERIFICATION task labels, equivalent verifier defaults, provider-only required metaDescriptionRisk schema | humanExpression import/property; new human/intersection eligibility gates; extra assessHumanExpression call; score caps and added reasons |
| `lib/ai/sloganEngine.ts` | routing/telemetry imports; secondary-attempt complexity scope; withAIRun wrapper; challenger-only cache bypass | humanExpression import; survivor metrics; rank function export; mandatory human assessment; commercial score cap; v4-to-v5 cache namespace change |

Paths in this table are relative to `apps/app`. The cache hunk must be edited when selecting: retain HEAD's `slogans:creative-selection-v4` key and include only the challenger cache bypass. Do not stage either mixed file wholesale. Preserve excluded edits in the working tree.

## Tooling dependencies to separate before staging

- `scripts/test_model_routing.ts` imports `humanExpressionRowSchema` and includes it in the strict-schema test list. Include the test only after removing that import and list entry from the proposed commit version. Keep the remaining routing/schema tests.
- `scripts/benchmark_model_routing.ts` accesses `intersectionTransformSurvivorCount` and `ExpressionWorthinessAssessment.humanExpression`, which do not exist at HEAD. Include the benchmark only after making those crossover diagnostics explicitly unmeasured (`null`) in the proposed commit version. Retain the benchmark, blind export, routing telemetry and ordinary diagnostics. Do not add the human-expression module merely to satisfy these references.
- `scripts/benchmark_stage_calibration.ts` calls the existing expression assessment interface, so it can run against the infrastructure-only version. Its results then describe that version of the evaluator. Existing crossover-based outputs cannot be presented as measurements of the separated commit; source fingerprints require a fresh prepared experiment.

These separation steps have now been applied in the isolated worktree. The original mixed worktree is preserved. The isolated tree has no excluded module available to satisfy dependencies.

## Documentation

Include `MODEL_ROUTING.md`, `MODEL_ROUTING_AUDIT.md`, `MODEL_ROUTING_REPORT.md`, `STAGE_CALIBRATION_REPORT.md` and this boundary document after reconciling statements about integrated human-expression verification with the separated implementation. Keep historical results explicitly labelled as measurements of the mixed working tree. Do not imply that historical passing tests or live artifacts validate the proposed infrastructure-only tree. Local artifact links may remain documentation references; they do not authorize adding those artifacts.

## Exclude completely

```text
apps/app/lib/ai/humanExpression.ts
apps/app/scripts/test_defect_class_calibration.ts
apps/app/scripts/audit_crossover_expression.cjs
apps/app/scripts/fixtures/crossover_expression.ts
apps/app/scripts/fixtures/crossover_expression_assertions.ts
apps/app/artifacts/**
```

Also exclude actual environment files, generated build/database output, and any path not explicitly admitted above. The routing additions inside the untracked humanExpression module belong with the later crossover change, not this commit.

## Acceptance of the selected tree

1. Prepare the selected versions while preserving unrelated working-tree edits. Inspect the complete staged diff and its file list; do not use blanket staging.
2. Confirm no humanExpression imports, new commercial score caps, survivor metrics, or cache namespace bump entered the selected production changes.
3. Validate the selected tree in isolation from untracked crossover files: TypeScript, routing/gateway/calibration tests, existing relevant regressions, offline verifier acceptance and production build. Verify absent/false routing keeps legacy model request parameters and CONTROL cache behavior.
4. Inspect staged whitespace, artifact exclusions and `.env.example` false default again. Only then is the proposed message `add disabled model-routing calibration infrastructure` appropriate.

Current conclusion: dependency separation is complete in the isolated worktree; current validation is recorded in ISOLATED_VALIDATION.md. Challenger activation remains off. No live calls or unblinding were performed in this review.

## Explicit additions during isolated validation

Include scripts/test_model_cache.ts, its package command and ISOLATED_VALIDATION.md. The cache regression exercises actual CONTROL cache hits/writes and challenger bypass with mocked evidence and cache storage. These are the only additions to the original boundary.
