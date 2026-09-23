# Isolated infrastructure validation

Prepared on branch routing-infrastructure-isolated from 7d029fe35761c5382b282e3f4b815b1845f24bd3 in C:/Users/hp/ai-saas-routing-commit. The original mixed worktree was not stashed, reset or edited. Dependencies were installed independently with npm ci --ignore-scripts; no source directory, environment file, or benchmark artifact was copied wholesale.

The two mixed production files were reconstructed from HEAD. CONTROL retains the creative-selection-v4 cache namespace. Crossover gates, score caps, metrics, module and fixtures are absent. Unavailable benchmark diagnostics are null. Historical reports are explicitly labelled as mixed-tree evidence, not acceptance evidence for this implementation.

## Checks completed in this worktree

- TypeScript: npx tsc --noEmit --pretty false passed with humanExpression.ts absent.
- Routing and strict provider schema tests passed without the excluded schema import.
- Gateway tests passed with the routing flag absent and false, including invalid challenger configuration.
- New cache rollback test passed: absent/false retain the same v4 cache key on hits and writes; BALANCED_FIRST and REASONING_HEAVY contexts bypass both reads and writes. Evidence is mocked to fail deterministically, and model network access is forbidden by the test.
- Stage-calibration support tests passed.
- Dynamic slogans, creative selection, evidence architecture, offline verifier acceptance, dynamic listing and deterministic dynamic design regressions passed.
- The evidence architecture suite logged dummy database authentication failures and exercised fallback behavior. These checks do not certify live database/provider connectivity.
- Static production/script scan found no excluded crossover identifiers. No live challenger benchmark or human unblinding was run.

Scripts used model_routing_runner.cjs for the repository's script TypeScript aliases and server-only bootstrap. Dummy database/auth values were supplied in process environment, with no real environment files copied. The gateway test mocks provider transport.

Production build passed, including TypeScript and static page generation. The existing Turbopack/Prisma file-tracing warning was nonfatal. Final staged path, whitespace and credential scans are performed before commit. Build-generated schema-hash metadata was restored to HEAD and excluded.

Challenger activation remains disabled. Frozen A–E quality acceptance remains incomplete; human quality acceptance remains pending. Infrastructure verification is separate from production challenger acceptance.
