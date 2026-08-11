-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutopilotJob" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutopilotJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketSignal" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "nicheKey" TEXT,
    "sloganKey" TEXT,
    "tagKey" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "payload" JSONB,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "niche" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MarketSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchOutcomeFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "nicheKey" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "sloganKey" TEXT NOT NULL,
    "pattern" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "audience" TEXT,
    "style" TEXT,
    "productTitle" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "refunds" INTEGER NOT NULL DEFAULT 0,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchOutcomeFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Niche" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "trendScore" DOUBLE PRECISION NOT NULL,
    "competitionScore" DOUBLE PRECISION NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Niche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalSnapshot" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "snapshotKey" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'live',
    "transport" TEXT NOT NULL DEFAULT 'live',
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignalSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalSourceHealth" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'healthy',
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "lastSuccess" TIMESTAMP(3),
    "lastFailure" TIMESTAMP(3),
    "cooldownUntil" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignalSourceHealth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SloganPattern" (
    "id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "lastSlogan" TEXT,
    "nicheHints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "niche" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "sales" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SloganPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodEnd" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider" ASC, "providerAccountId" ASC);

-- CreateIndex
CREATE INDEX "MarketSignal_nicheKey_observedAt_idx" ON "MarketSignal"("nicheKey" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "MarketSignal_niche_observedAt_idx" ON "MarketSignal"("niche" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "MarketSignal_sloganKey_observedAt_idx" ON "MarketSignal"("sloganKey" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "MarketSignal_source_observedAt_idx" ON "MarketSignal"("source" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "MarketSignal_tagKey_observedAt_idx" ON "MarketSignal"("tagKey" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "MerchOutcomeFeedback_userId_observedAt_idx" ON "MerchOutcomeFeedback"("userId" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "MerchOutcomeFeedback_userId_platform_nicheKey_observedAt_idx" ON "MerchOutcomeFeedback"("userId" ASC, "platform" ASC, "nicheKey" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "MerchOutcomeFeedback_userId_platform_pattern_observedAt_idx" ON "MerchOutcomeFeedback"("userId" ASC, "platform" ASC, "pattern" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "MerchOutcomeFeedback_userId_platform_sloganKey_observedAt_idx" ON "MerchOutcomeFeedback"("userId" ASC, "platform" ASC, "sloganKey" ASC, "observedAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken" ASC);

-- CreateIndex
CREATE INDEX "SignalSnapshot_source_expiresAt_idx" ON "SignalSnapshot"("source" ASC, "expiresAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SignalSnapshot_source_snapshotKey_key" ON "SignalSnapshot"("source" ASC, "snapshotKey" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SignalSourceHealth_source_key" ON "SignalSourceHealth"("source" ASC);

-- CreateIndex
CREATE INDEX "SloganPattern_niche_conversion_idx" ON "SloganPattern"("niche" ASC, "conversion" ASC);

-- CreateIndex
CREATE INDEX "SloganPattern_niche_ctr_idx" ON "SloganPattern"("niche" ASC, "ctr" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SloganPattern_niche_pattern_key" ON "SloganPattern"("niche" ASC, "pattern" ASC);

-- CreateIndex
CREATE INDEX "SloganPattern_niche_score_idx" ON "SloganPattern"("niche" ASC, "score" ASC);

-- CreateIndex
CREATE INDEX "SloganPattern_score_uses_idx" ON "SloganPattern"("score" ASC, "uses" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier" ASC, "token" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token" ASC);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchOutcomeFeedback" ADD CONSTRAINT "MerchOutcomeFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Niche" ADD CONSTRAINT "Niche_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
