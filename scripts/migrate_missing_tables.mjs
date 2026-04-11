/**
 * Bootstrap migration script — CREATE TABLE IF NOT EXISTS for every model
 * in the Prisma schema, executed via the working transaction-pooler DATABASE_URL.
 *
 * Usage: node scripts/migrate_missing_tables.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envText = readFileSync(resolve(__dirname, "../.env"), "utf8");
for (const line of envText.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// All statements are separated by "---STMT---" so we never split inside SQL strings.
const STATEMENTS = [
    `CREATE TABLE IF NOT EXISTS "User" (
    "id"            TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"          TEXT,
    "email"         TEXT        UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    "image"         TEXT,
    "password"      TEXT,
    "role"          TEXT        NOT NULL DEFAULT 'user',
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE TABLE IF NOT EXISTS "Account" (
    "id"                TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"            TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "type"              TEXT NOT NULL,
    "provider"          TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token"     TEXT,
    "access_token"      TEXT,
    "expires_at"        INT,
    "token_type"        TEXT,
    "scope"             TEXT,
    "id_token"          TEXT,
    "session_state"     TEXT,
    CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE("provider", "providerAccountId")
)`,
    `CREATE TABLE IF NOT EXISTS "Session" (
    "id"           TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "sessionToken" TEXT        NOT NULL UNIQUE,
    "userId"       TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "expires"      TIMESTAMPTZ NOT NULL
)`,
    `CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token"      TEXT NOT NULL UNIQUE,
    "expires"    TIMESTAMPTZ NOT NULL,
    CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE("identifier", "token")
)`,
    `CREATE TABLE IF NOT EXISTS "Workspace" (
    "id"        TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"      TEXT        NOT NULL,
    "ownerId"   TEXT        NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE TABLE IF NOT EXISTS "WorkspaceMember" (
    "id"          TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"      TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "workspaceId" TEXT NOT NULL REFERENCES "Workspace"("id") ON DELETE CASCADE,
    "role"        TEXT NOT NULL
)`,
    `CREATE TABLE IF NOT EXISTS "Project" (
    "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"        TEXT        NOT NULL,
    "workspaceId" TEXT        NOT NULL REFERENCES "Workspace"("id") ON DELETE CASCADE,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE TABLE IF NOT EXISTS "Niche" (
    "id"               TEXT   NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"             TEXT   NOT NULL,
    "score"            FLOAT8 NOT NULL,
    "trendScore"       FLOAT8 NOT NULL,
    "competitionScore" FLOAT8 NOT NULL,
    "projectId"        TEXT   NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Subscription" (
    "id"               TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"           TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "stripeCustomerId" TEXT,
    "stripeSubId"      TEXT,
    "plan"             TEXT        NOT NULL DEFAULT 'free',
    "status"           TEXT        NOT NULL DEFAULT 'active',
    "currentPeriodEnd" TIMESTAMPTZ
)`,
    `CREATE TABLE IF NOT EXISTS "UsageMetric" (
    "id"        TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"    TEXT        NOT NULL,
    "type"      TEXT        NOT NULL,
    "value"     INT         NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE TABLE IF NOT EXISTS "AutopilotJob" (
    "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "status"      TEXT        NOT NULL DEFAULT 'pending',
    "workspaceId" TEXT        NOT NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE TABLE IF NOT EXISTS "SignalSnapshot" (
    "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "source"      TEXT        NOT NULL,
    "snapshotKey" TEXT        NOT NULL,
    "data"        JSONB       NOT NULL,
    "fetchedAt"   TIMESTAMPTZ NOT NULL,
    "expiresAt"   TIMESTAMPTZ NOT NULL,
    "confidence"  FLOAT8      NOT NULL,
    "status"      TEXT        NOT NULL DEFAULT 'live',
    "transport"   TEXT        NOT NULL DEFAULT 'live',
    "details"     TEXT,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "SignalSnapshot_source_snapshotKey_key" UNIQUE("source", "snapshotKey")
)`,
    `CREATE INDEX IF NOT EXISTS "SignalSnapshot_source_expiresAt_idx" ON "SignalSnapshot"("source", "expiresAt")`,
    `CREATE TABLE IF NOT EXISTS "SignalSourceHealth" (
    "id"            TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "source"        TEXT        NOT NULL UNIQUE,
    "status"        TEXT        NOT NULL DEFAULT 'healthy',
    "failureCount"  INT         NOT NULL DEFAULT 0,
    "lastSuccess"   TIMESTAMPTZ,
    "lastFailure"   TIMESTAMPTZ,
    "cooldownUntil" TIMESTAMPTZ,
    "lastError"     TEXT,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE TABLE IF NOT EXISTS "MerchOutcomeFeedback" (
    "id"           TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId"       TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "niche"        TEXT        NOT NULL,
    "nicheKey"     TEXT        NOT NULL,
    "platform"     TEXT        NOT NULL,
    "slogan"       TEXT        NOT NULL,
    "sloganKey"    TEXT        NOT NULL,
    "pattern"      TEXT,
    "tags"         TEXT[]      NOT NULL DEFAULT '{}',
    "audience"     TEXT,
    "style"        TEXT,
    "productTitle" TEXT,
    "impressions"  INT         NOT NULL DEFAULT 0,
    "clicks"       INT         NOT NULL DEFAULT 0,
    "orders"       INT         NOT NULL DEFAULT 0,
    "favorites"    INT         NOT NULL DEFAULT 0,
    "revenue"      FLOAT8      NOT NULL DEFAULT 0,
    "refunds"      INT         NOT NULL DEFAULT 0,
    "observedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE INDEX IF NOT EXISTS "MerchOutcomeFeedback_userId_observedAt_idx" ON "MerchOutcomeFeedback"("userId", "observedAt")`,
    `CREATE INDEX IF NOT EXISTS "MerchOutcomeFeedback_userId_platform_sloganKey_observedAt_idx" ON "MerchOutcomeFeedback"("userId", "platform", "sloganKey", "observedAt")`,
    `CREATE INDEX IF NOT EXISTS "MerchOutcomeFeedback_userId_platform_nicheKey_observedAt_idx" ON "MerchOutcomeFeedback"("userId", "platform", "nicheKey", "observedAt")`,
    `CREATE INDEX IF NOT EXISTS "MerchOutcomeFeedback_userId_platform_pattern_observedAt_idx" ON "MerchOutcomeFeedback"("userId", "platform", "pattern", "observedAt")`,
    `CREATE TABLE IF NOT EXISTS "SloganPattern" (
    "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "niche"       TEXT        NOT NULL,
    "pattern"     TEXT        NOT NULL,
    "score"       FLOAT8      NOT NULL DEFAULT 1,
    "uses"        INT         NOT NULL DEFAULT 0,
    "impressions" INT         NOT NULL DEFAULT 0,
    "clicks"      INT         NOT NULL DEFAULT 0,
    "sales"       INT         NOT NULL DEFAULT 0,
    "ctr"         FLOAT8      NOT NULL DEFAULT 0,
    "conversion"  FLOAT8      NOT NULL DEFAULT 0,
    "lastSlogan"  TEXT,
    "nicheHints"  TEXT[]      NOT NULL DEFAULT '{}',
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "SloganPattern_niche_pattern_key" UNIQUE("niche", "pattern")
)`,
    `CREATE INDEX IF NOT EXISTS "SloganPattern_niche_score_idx"     ON "SloganPattern"("niche", "score")`,
    `CREATE INDEX IF NOT EXISTS "SloganPattern_score_uses_idx"       ON "SloganPattern"("score", "uses")`,
    `CREATE INDEX IF NOT EXISTS "SloganPattern_niche_ctr_idx"        ON "SloganPattern"("niche", "ctr")`,
    `CREATE INDEX IF NOT EXISTS "SloganPattern_niche_conversion_idx" ON "SloganPattern"("niche", "conversion")`,
    `CREATE TABLE IF NOT EXISTS "MarketSignal" (
    "id"         TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "niche"      TEXT        NOT NULL,
    "text"       TEXT        NOT NULL,
    "source"     TEXT        NOT NULL,
    "nicheKey"   TEXT,
    "sloganKey"  TEXT,
    "tagKey"     TEXT,
    "score"      FLOAT8      NOT NULL DEFAULT 50,
    "confidence" FLOAT8      NOT NULL DEFAULT 0.5,
    "payload"    JSONB,
    "observedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE INDEX IF NOT EXISTS "MarketSignal_source_observedAt_idx"   ON "MarketSignal"("source",  "observedAt")`,
    `CREATE INDEX IF NOT EXISTS "MarketSignal_niche_observedAt_idx"     ON "MarketSignal"("niche",   "observedAt")`,
    `CREATE INDEX IF NOT EXISTS "MarketSignal_nicheKey_observedAt_idx"  ON "MarketSignal"("nicheKey","observedAt")`,
    `CREATE INDEX IF NOT EXISTS "MarketSignal_sloganKey_observedAt_idx" ON "MarketSignal"("sloganKey","observedAt")`,
    `CREATE INDEX IF NOT EXISTS "MarketSignal_tagKey_observedAt_idx"    ON "MarketSignal"("tagKey",  "observedAt")`,
    `CREATE TABLE IF NOT EXISTS "ListingQueue" (
    "id"            TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "niche"         TEXT        NOT NULL,
    "slogan"        TEXT        NOT NULL,
    "title"         TEXT        NOT NULL,
    "bullets"       TEXT[]      NOT NULL DEFAULT '{}',
    "tags"          TEXT[]      NOT NULL DEFAULT '{}',
    "mockupPrompt"  TEXT        NOT NULL,
    "adHooks"       TEXT[]      NOT NULL DEFAULT '{}',
    "status"        TEXT        NOT NULL DEFAULT 'PENDING',
    "platform"      TEXT        NOT NULL DEFAULT 'etsy',
    "priorityScore" FLOAT8,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE TABLE IF NOT EXISTS "ListingPerformance" (
    "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "listingId"   TEXT        NOT NULL,
    "impressions" INT         NOT NULL DEFAULT 0,
    "clicks"      INT         NOT NULL DEFAULT 0,
    "ctr"         FLOAT8      NOT NULL DEFAULT 0,
    "conversions" INT         NOT NULL DEFAULT 0,
    "revenue"     FLOAT8      NOT NULL DEFAULT 0,
    "observedAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
)`,
    `CREATE INDEX IF NOT EXISTS "ListingPerformance_listingId_observedAt_idx" ON "ListingPerformance"("listingId", "observedAt")`,
];

async function run() {
    console.log("Connecting to database via pooler...");
    await prisma.$connect();
    console.log("Connected. Running migration...\n");

    let ok = 0;
    let skipped = 0;
    let failed = 0;

    for (const stmt of STATEMENTS) {
        const preview = stmt.replace(/\s+/g, " ").slice(0, 90);
        try {
            await prisma.$executeRawUnsafe(stmt);
            console.log(`  ✓  ${preview}`);
            ok++;
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (/already exists/i.test(msg)) {
                console.log(`  -  (exists) ${preview}`);
                skipped++;
            } else {
                console.error(`  ✗  ${preview}\n     ${msg}\n`);
                failed++;
            }
        }
    }

    await prisma.$disconnect();
    console.log(`\nDone: ${ok} created, ${skipped} already existed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
}

run().catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
});
