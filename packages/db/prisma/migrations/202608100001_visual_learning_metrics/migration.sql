ALTER TABLE "MerchOutcomeFeedback"
  ADD COLUMN IF NOT EXISTS "visualBatchMetrics" JSONB,
  ADD COLUMN IF NOT EXISTS "visualStrategyMetrics" JSONB,
  ADD COLUMN IF NOT EXISTS "visualReleaseGate" JSONB;

CREATE TABLE IF NOT EXISTS "ListingQueue" (
  "id" TEXT NOT NULL,
  "niche" TEXT NOT NULL,
  "slogan" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "bullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "mockupPrompt" TEXT NOT NULL,
  "adHooks" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "visualBatchMetrics" JSONB,
  "visualStrategyMetrics" JSONB,
  "visualReleaseGate" JSONB,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "platform" TEXT NOT NULL DEFAULT 'etsy',
  "priorityScore" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ListingQueue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ListingPerformance" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "impressions" INTEGER NOT NULL DEFAULT 0,
  "clicks" INTEGER NOT NULL DEFAULT 0,
  "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "conversions" INTEGER NOT NULL DEFAULT 0,
  "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "visualBatchMetrics" JSONB,
  "visualStrategyMetrics" JSONB,
  "visualReleaseGate" JSONB,
  "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ListingPerformance_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ListingPerformance_listingId_observedAt_idx"
  ON "ListingPerformance"("listingId", "observedAt");

ALTER TABLE "ListingQueue"
  ADD COLUMN IF NOT EXISTS "visualBatchMetrics" JSONB,
  ADD COLUMN IF NOT EXISTS "visualStrategyMetrics" JSONB,
  ADD COLUMN IF NOT EXISTS "visualReleaseGate" JSONB;

ALTER TABLE "ListingPerformance"
  ADD COLUMN IF NOT EXISTS "visualBatchMetrics" JSONB,
  ADD COLUMN IF NOT EXISTS "visualStrategyMetrics" JSONB,
  ADD COLUMN IF NOT EXISTS "visualReleaseGate" JSONB;
