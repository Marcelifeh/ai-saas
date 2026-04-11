import { Worker, redisConnection } from "@trendforge/queue";
import { prisma } from "@trendforge/db";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
const WORKER_SECRET = process.env.WORKER_SECRET;

console.log("🚀 Starting Autopilot Worker Daemon...");
console.log(`   App base URL : ${APP_BASE_URL}`);
console.log(`   Worker secret: ${WORKER_SECRET ? "set ✓" : "NOT SET — internal route will reject requests"}`);

const worker = new Worker("autopilot-jobs", async (job) => {
    const { workspaceId } = job.data;
    const jobId = job.id as string;
    console.log(`[Job ${jobId}] Received generation request for workspace ${workspaceId}`);

    // 1. Mark job as in-progress in DB (the internal route will do a upsert
    //    as well, but we do it here first so dashboards see "processing" fast)
    try {
        await prisma.autopilotJob.upsert({
            where: { id: jobId },
            update: { status: "processing" },
            create: { id: jobId, workspaceId, status: "processing" },
        });
    } catch (dbErr) {
        console.warn(`[Job ${jobId}] DB upsert failed (non-fatal):`, dbErr);
    }

    // 2. Delegate real work to the Next.js internal endpoint.
    //    This keeps all business logic (bulkDiscover, generateChunk,
    //    getWinningSlogans) inside the Next.js server context where
    //    "server-only" imports, Prisma, and env vars are fully available.
    if (!WORKER_SECRET) {
        throw new Error("WORKER_SECRET is not set — cannot call internal autopilot endpoint");
    }

    const response = await fetch(`${APP_BASE_URL}/api/autopilot?worker=1`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-worker-secret": WORKER_SECRET,
        },
        body: JSON.stringify({ workspaceId, jobId }),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Internal autopilot route returned ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log(`[Job ${jobId}] Completed — ${result.productsGenerated ?? 0} products generated.`);
    return result;
}, { connection: redisConnection as any });

worker.on("ready", () => console.log("✅ Autopilot Worker Connected to Redis"));
worker.on("completed", (job) => console.log(`✅ Job ${job?.id} Finished`));
worker.on("failed", async (job, err) => {
    console.error(`❌ Job ${job?.id} Failed: ${err.message}`);
    try {
        if (job?.id) {
            await prisma.autopilotJob.update({
                where: { id: job.id },
                data: { status: "failed" },
            });
        }
    } catch {
        // Ignore secondary DB error
    }
});

