<!-- Separated infrastructure worktree -->
> Historical benchmark results and earlier validation below came from the mixed working tree. They are not validation of this separated infrastructure-only commit. The human-expression module, its gates and score caps are excluded here. Challenger activation remains disabled. See ISOLATED_VALIDATION.md for validation of this tree.

# Model usage audit — pre-change baseline

Audited before routing edits on 2026-09-12 using repository-wide searches and TypeScript AST call inspection. Existing uncommitted human-expression work is part of this working-tree CONTROL, not an assumed clean deployed revision. No commits or pushes were made.

There is one OpenAI SDK client, in `lib/ai/aiGateway.ts`. All production chat and embedding calls found under apps/packages/workers pass through it. No independent Responses API or other vendor invocation was found. The unused gateway import in `sloganEngine.ts` is not an invocation. Installed OpenAI SDK: **6.27.0**; Zod: **4.3.6**. The SDK includes Zod v4 support, `zodResponseFormat`, `reasoning_effort`, and `max_completion_tokens`.

In this table, paths start at `apps/app/`. **M** = `gpt-4o-mini`; **C** = `OPENAI_SLOGAN_CREATIVE_MODEL` or `gpt-4.1`; **V** = `OPENAI_SLOGAN_VERIFIER_MODEL` or `gpt-4.1`; **I** = the same verifier override or `gpt-4o`. All pre-change calls omit reasoning effort. **J** = loose `json_object`; **text** = SDK default text. Frequencies are conditional estimates per uncached creative attempt, not measured fixed budgets. S = candidate count, E = semantic survivors, N = intents. Secondary composition/rejection-aware recovery can repeat stages. Indexed batches use 4 rows and allow one structural repair. SDK technical retries are additional (default: 2).

| File | Function / stage | Category | Model | Temperature | Max output tokens | Format | Expected output | Approx. frequency |
|---|---|---|---|---:|---:|---|---|---|
| lib/ai/behavioralSloganEngine.ts | generateBehavioralAISlogans | SLOGAN_GENERATION | M | 1 | unset | J | slogan array in object | 0 in authoritative elite path; 1 when invoked |
| lib/ai/dynamicNicheProfile.ts | inferNicheComposition | COMPOSITION_INFERENCE | C | .08 | 5200 | J | composition and alternatives | 1 primary |
| lib/ai/dynamicNicheProfile.ts | buildDynamicNicheProfile | PROFILE_REASONING | M | .35 | 5200 | J | profile/lifestyle | 1–2 per composition |
| lib/ai/dynamicNicheProfile.ts | generateSlogansFromDynamicProfile, compound branch | SLOGAN_GENERATION / RECOVERY | C | .85 | 5200 | J | indexed intent-linked candidates | 1 plus bounded recovery |
| lib/ai/dynamicNicheProfile.ts | generateSlogansFromDynamicProfile, single branch | SLOGAN_GENERATION / RECOVERY | C | .8 | 5200 | J | slogans | alternative branch; 1 plus bounded recovery |
| lib/ai/dynamicNicheProfile.ts | compressDynamicSlogansWithDiagnostics | COMPRESSION | M | .35 | 5200 | J | compressed slogans | 0–2 per attempt, plus recovery |
| lib/ai/dynamicNicheProfile.ts | classifyDynamicSelfRevelation | EXPRESSION_WORTHINESS | M | .05 | 5200 | J | indexed A/B classifications | 0–1 per successful attempt |
| lib/ai/dynamicCreativeSelectionEngine.ts | discoverCreativeTerritories | TERRITORY_GENERATION | C | .35 | 5200 | J | grounded territories | 1; wrapper permits up to 3 attempts |
| lib/ai/dynamicCreativeSelectionEngine.ts | assessSemanticEligibilityBatch | SEMANTIC_VERIFIER | M | .05 | 3200 | J | five scores, axes, reasons | ceil(S/4), plus repair |
| lib/ai/dynamicCreativeSelectionEngine.ts | assessCompoundIntersectionBatch, blind reading | INTERSECTION_VERIFIER | M | .02 | 3200 | J | phrase premise/cues | 0 single; ceil(S/4) compound |
| lib/ai/dynamicCreativeSelectionEngine.ts | assessCompoundIntersectionBatch, judgment | INTERSECTION_VERIFIER | I | .02 | 3200 | J | shared-premise/axis dependency | 0 single; ceil(S/4) compound |
| lib/ai/expressionIntent.ts | planAndValidateExpressionIntents, planning | EXPRESSION_INTENT | C | .55 | 5200 | J | grounded intents | 0 single; 1 compound, wrapper up to 3 |
| lib/ai/expressionIntent.ts | planAndValidateExpressionIntents, verifier | INTERSECTION_VERIFIER | V | .03 | 3200 | J | indexed intent assessments | 0 single; ceil(N/4) compound |
| lib/ai/expressionWorthiness.ts | interpretCreativeDirection | NORMALIZATION | M | .1 default | 2600 | J | creative brief | 0 without brief; 1 otherwise |
| lib/ai/expressionWorthiness.ts | assessExpressionBatch | EXPRESSION_WORTHINESS | V | .02 default | 3200 | J | expression scores/traits | ceil(E/4) |
| lib/ai/expressionWorthiness.ts | verifyCreativeBriefBatch | EXPRESSION_WORTHINESS | V | .02 | 3200 | J | transformation/constraint scores | conditional ceil(E/4) |
| lib/ai/humanExpression.ts | assessHumanExpression | EXPRESSION_WORTHINESS / INTERSECTION_VERIFIER | V | .02 default | 3200 | J | independent human meaning and axis removal | ceil(E/4) |
| lib/ai/dynamicDesignPrompt.ts | generateUnscoredStrategies | DESIGN_PROMPT_GENERATION | M | .7 | 8000 | J | design strategy batch | 1 per design operation |
| lib/ai/dynamicDesignPrompt.ts | evaluateAndReviseStrategies | STRUCTURAL_EVALUATION | M | .25 | 8000 | J | scored/revised designs | 1 per design operation |
| lib/ai/dynamicDesignPrompt.ts | repairCollapsedStrategies | RECOVERY | M | .65 | 8000 | J | repaired designs | 0–1 |
| lib/ai/dynamicDesignPrompt.ts | auditRepairedStrategyQuality | STRUCTURAL_EVALUATION | M | .1 | 2200 | J | design quality | 0–1 |
| lib/ai/dynamicListingEngine.ts | requestDraft | LISTING_GENERATION | M | .65 / .35 repair | 1400 | J | title, bullets, description, search terms | 1 plus existing repair, per listing |
| lib/ai/marketInsightEngine.ts | generateMarketInsights | PROFILE_REASONING | M | .7 | unset | text | market insight text | 0 in slogan core; analytics on demand |
| lib/ai/trendEngine.ts | generateNiches | NICHE_DECOMPOSITION | M | .85 | unset | text | JSON string array | 0 single factory; discovery batch |
| lib/ai/trendEngine.ts | detectViralPotentials | EXTRACTION | M | .2 | unset | text | viral-potential assessment | conditional discovery |
| lib/ai/trendEngine.ts | embedTexts | OTHER | text-embedding-3-small | n/a | n/a | embedding API | vectors | conditional discovery batching |
| lib/services/factoryService.ts | generateSingleStrategy | PROFILE_REASONING | M | .7 | 4000 | J | market/audience context | 1 single Strategy Factory run |
| lib/services/factoryService.ts | generateAdHooksFor | LISTING_GENERATION | M | .8 | 200 | J | ad hooks | conditional bulk strategy item |
| lib/services/trendDiscoveryService.ts | runDiscovery | EXTRACTION | M | unset | unset | J | discovery enrichment | conditional discovery batch |

Shared invocation wrappers: `dynamicNicheProfile.callAIJson` (5200/J, default .35/M), `dynamicCreativeSelectionEngine.callJson` (5200/J, default .15/M), `expressionIntent.callJson` (5200/J, explicit temperature/model), `expressionWorthiness.callJson` (2600/J, default .1/M), `structuredVerifier.defaultVerifierRequest` (3200/J, default .02, caller model). Their rows above count logical callers rather than double-counting wrappers. `aiGateway.chatCompletionSafe` forwards those parameters; `createEmbeddingsSafe` defaults centrally to the embedding model.

`specificityCompatibilityEvaluator.ts` and niche decomposition/provenance helpers are deterministic. They have no JSON-returning model verifier to migrate. Adding a second AI evidence authority would exceed this model-routing task. Existing specificity/provenance gates remain authoritative.

Prompt audit: no model-specific workaround was proven obsolete. Creative prompts, semantic thresholds, expression thresholds, graded meta-description logic and independent phrase assessment remain unchanged.
