# TrendForge Hardcoding Remediation

This remediation consolidates production slogan creation around one evidence-driven path while preserving Slogan Intelligence scoring, explainability, design handoff, listing handoff, and feedback learning.

## Production path after remediation

Market evidence snapshot -> dynamic niche truth/profile -> grounded creative territories -> candidate generation -> adaptive compression -> hard semantic eligibility -> self-revelation/quality scoring -> structural portfolio diversity -> design -> listing.

## Active-path problems removed

- Removed the separate direct-LLM slogan regeneration prompt in `factoryService.ts` that included reusable example language and bypassed the authoritative engine.
- Removed Bulk Factory / Autopilot direct slogan prompts. Both now call the same creative selection path used by Strategy Factory and Design Studio.
- Removed exported legacy pattern/template generation helpers and mock pattern runner scripts that could reintroduce old generation behavior.
- Dynamic profile extraction now receives the immutable market/community evidence snapshot as supporting context.
- Candidate generation now receives grounded semantic territories and prior/excluded slogans rather than reusable phrase patterns.
- Added a hard semantic eligibility stage before ranking. Humor, brevity, or visual appeal cannot compensate for unsupported behavior, product-meta copy, compound-niche collapse, or semantic incoherence.
- Slogan Intelligence results now expose evidence snapshot ID/hash, creative territories, and semantic eligibility diagnostics.

## Market-evidence hardcoding removed

- Aggregate signal confidence is calculated from actual contributing signal sources instead of a fixed 0.85.
- Evidence snapshots no longer assign simulated trend velocity, fixed source counts, random buyer evidence counts, or fake freshness windows.
- Discovery generation failures now fail closed with an empty result instead of injecting fabricated fallback niches.

## Semantic eligibility gates

A candidate must independently pass:

- truth grounding
- merchandise/product independence
- compound/intersection integrity
- semantic coherence
- unsupported-inference risk

These gates are evaluated before commercial ranking so fatal semantic defects cannot be averaged away.

## Slogan Intelligence preserved

The existing Slogan Intelligence layer remains intact for ranking, recognition probability/latency, truth/authenticity, adaptive readability, compression retention, self-revelation, structural/rhetorical diversity, collections, and downstream visual/listing generation. The remediation changes the candidate source and eligibility contract, not the intelligence UX or its useful metrics.

## Added regression

`apps/app/scripts/regression_creative_selection.ts` verifies semantic hard-gate boundaries and statically ensures Factory does not regain parallel template-style slogan prompts.

## Local verification

The full workspace passed the app TypeScript check, production build, creative-selection regression, dynamic-slogan regression, and `git diff --check` before commit review. The production build retains the pre-existing non-blocking Turbopack NFT tracing warning involving Prisma and the billing route.
