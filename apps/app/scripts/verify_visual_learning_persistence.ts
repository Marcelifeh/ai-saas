import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

function loadRootEnvironment(): void {
  const envPath = path.resolve(process.cwd(), "../../.env");
  if (!fs.existsSync(envPath)) throw new Error(`Missing environment file: ${envPath}`);
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function allowServerModulesInScript(): void {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Module = require("node:module");
  const originalLoad = Module._load;
  Module._load = function patchedModuleLoad(request: string, parent: unknown, isMain: boolean) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

function normalizeKey(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function strategyMetrics(level: number, marker: string) {
  return {
    marker,
    visualImpact: level,
    qualityGatePassed: level >= 70,
    diversityPenalty: 0,
    primaryFocus: "hybrid",
    quality: {
      thumbnailLegibility: level,
      focalClarity: level,
      silhouetteStrength: level,
      textGraphicIntegration: level,
      contrast: level,
      printability: level,
      visualOriginality: level,
      sloganReinforcement: level,
    },
    complexity: { textDominance: 0.6, supportingDetailLevel: "controlled" },
    fingerprint: {
      primarySubject: "synthetic persistence subject",
      compositionType: "synthetic interaction",
      metaphorType: "synthetic contrast",
      typographyRole: "synthetic action",
      graphicRelationship: "type completes action",
    },
  };
}

function batchMetrics(level: number, marker: string) {
  return {
    marker,
    primaryFocusDiversity: 0.67,
    compositionFamilyDiversity: 0.8,
    visualMetaphorDiversity: 0.7,
    supportingObjectOverlap: (90 - level) / 100,
    typographyRoleDiversity: 0.7,
    commercialQualityScore: level,
  };
}

async function main(): Promise<void> {
  if (!process.argv.includes("--execute")) {
    throw new Error("Refusing database writes without the explicit --execute flag");
  }
  loadRootEnvironment();
  allowServerModulesInScript();

  const [{ prisma }, { runListingWorker }, feedback, learningInsights, analyticsRoute, nextAuthJwt, nextServer] = await Promise.all([
    import("../lib/db/prisma"),
    import("../lib/services/listingWorker"),
    import("../lib/services/salesFeedbackService"),
    import("../lib/services/visualLearningInsights"),
    import("../app/api/analytics/insights/route"),
    import("next-auth/jwt"),
    import("next/server"),
  ]);

  const marker = `visual-e2e-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const niche = `Synthetic Visual Persistence ${marker}`;
  const slogan = `Persistence Proof ${marker}`;
  const pattern = `persistence-${marker}`.toLowerCase().slice(0, 80);
  const expectedBatch = batchMetrics(60, marker);
  const expectedStrategy = strategyMetrics(60, marker);
  const expectedGate = {
    marker,
    status: "pass",
    passed: true,
    repairAttempts: 1,
    maxRepairAttempts: 2,
    warnings: [],
  };
  let userId: string | undefined;
  let listingId: string | undefined;

  try {
    const user = await prisma.user.create({
      data: { name: "Visual Learning E2E", email: `${marker}@example.invalid` },
    });
    userId = user.id;

    const queued = await prisma.listingQueue.create({
      data: {
        niche,
        slogan,
        title: `Synthetic listing ${marker}`,
        bullets: ["synthetic persistence check"],
        tags: ["synthetic-e2e"],
        mockupPrompt: "Synthetic mockup prompt; never publish.",
        adHooks: ["Synthetic hook"],
        priorityScore: -9999,
        visualBatchMetrics: expectedBatch,
        visualStrategyMetrics: expectedStrategy,
        visualReleaseGate: expectedGate,
      },
    });
    listingId = queued.id;

    const workerResult = await runListingWorker({ listingId, take: 1 });
    assert.equal(workerResult.processed, 1, "The scoped listing worker did not process the synthetic queue item");

    const [processedQueue, performance] = await Promise.all([
      prisma.listingQueue.findUniqueOrThrow({ where: { id: listingId } }),
      prisma.listingPerformance.findFirstOrThrow({ where: { listingId } }),
    ]);
    assert.equal(processedQueue.status, "DONE");
    assert.deepEqual(processedQueue.visualBatchMetrics, expectedBatch);
    assert.deepEqual(processedQueue.visualStrategyMetrics, expectedStrategy);
    assert.deepEqual(processedQueue.visualReleaseGate, expectedGate);
    assert.deepEqual(performance.visualBatchMetrics, expectedBatch);
    assert.deepEqual(performance.visualStrategyMetrics, expectedStrategy);
    assert.deepEqual(performance.visualReleaseGate, expectedGate);

    const levels = [60, 66, 72, 78, 84, 90];
    const clicks = [20, 30, 40, 50, 60, 70];
    const favorites = [5, 10, 15, 20, 25, 30];
    const orders = [1, 3, 6, 10, 15, 21];
    let firstFeedbackId: string | undefined;

    for (let index = 0; index < levels.length; index += 1) {
      const level = levels[index];
      const record = await feedback.recordMerchOutcomeFeedback({
        userId,
        niche,
        platform: "general",
        slogan,
        pattern,
        tags: ["synthetic-e2e"],
        productTitle: `Synthetic listing ${marker}`,
        visualBatchMetrics: batchMetrics(level, marker),
        visualStrategyMetrics: strategyMetrics(level, marker),
        visualReleaseGate: expectedGate,
        impressions: 1000,
        clicks: clicks[index],
        favorites: favorites[index],
        orders: orders[index],
      });
      firstFeedbackId ??= record.id;

      if (index === 0) {
        const lowSampleSignals = await feedback.getVisualMetricLearningSignals({ userId, niche });
        assert.ok(lowSampleSignals.some((signal) => signal.metric === "thumbnailLegibility" && signal.observations === 1));
        assert.deepEqual(learningInsights.buildVisualLearningInsights(lowSampleSignals), [], "One observation must remain observe-only");
      }
    }

    const firstFeedback = await prisma.merchOutcomeFeedback.findUniqueOrThrow({ where: { id: firstFeedbackId! } });
    assert.deepEqual(firstFeedback.visualBatchMetrics, expectedBatch);
    assert.deepEqual(firstFeedback.visualStrategyMetrics, expectedStrategy);
    assert.deepEqual(firstFeedback.visualReleaseGate, expectedGate);

    const signals = await feedback.getVisualMetricLearningSignals({ userId, niche });
    const thumbnailSignal = signals.find((signal) => signal.metric === "thumbnailLegibility");
    const commercialSignal = signals.find((signal) => signal.metric === "commercialQualityScore");
    assert.equal(thumbnailSignal?.observations, levels.length);
    assert.equal(commercialSignal?.observations, levels.length);
    assert.ok((thumbnailSignal?.ctrCorrelation ?? 0) > 0.95, "Controlled thumbnail/CTR correlation was not detected");
    assert.ok((thumbnailSignal?.conversionCorrelation ?? 0) > 0.95, "Controlled thumbnail/conversion correlation was not detected");

    const insights = learningInsights.buildVisualLearningInsights(signals);
    assert.ok(insights.length > 0, "Supported visual correlations did not reach the analytics insight layer");
    assert.ok(insights.every((insight) => insight.message.includes("directional")));

    const authSecret = process.env.NEXTAUTH_SECRET;
    assert.ok(authSecret, "NEXTAUTH_SECRET is required to exercise the authenticated analytics route");
    const sessionToken = await nextAuthJwt.encode({
      secret: authSecret,
      token: { sub: userId, name: "Visual Learning E2E", email: `${marker}@example.invalid` },
      maxAge: 300,
    });
    const analyticsResponse = await analyticsRoute.GET(new nextServer.NextRequest("http://localhost/api/analytics/insights", {
      headers: {
        cookie: [
          `next-auth.session-token=${sessionToken}`,
          `__Secure-next-auth.session-token=${sessionToken}`,
        ].join("; "),
      },
    }));
    assert.equal(analyticsResponse.status, 200, "Authenticated analytics endpoint did not return HTTP 200");
    const analyticsBody = await analyticsResponse.json() as {
      success?: boolean;
      insights?: Array<{ message?: string }>;
    };
    assert.equal(analyticsBody.success, true);
    assert.ok(
      analyticsBody.insights?.some((insight) => insight.message?.includes("Early visual learning signal:")),
      "Analytics endpoint did not expose the supported directional visual signal",
    );

    console.log(JSON.stringify({
      passed: true,
      queueToPerformanceSnapshotsMatch: true,
      feedbackSnapshotsMatch: true,
      lowSampleSuppressed: true,
      correlatedMetricsObserved: signals.length,
      directionalInsights: insights.length,
      authenticatedAnalyticsEndpoint: true,
      syntheticFeedbackRows: levels.length,
    }, null, 2));
  } finally {
    if (listingId) {
      await prisma.listingPerformance.deleteMany({ where: { listingId } });
      await prisma.listingQueue.deleteMany({ where: { id: listingId } });
    }
    if (userId) {
      await prisma.merchOutcomeFeedback.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
    await prisma.sloganPattern.deleteMany({ where: { niche: normalizeKey(niche) } });
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
