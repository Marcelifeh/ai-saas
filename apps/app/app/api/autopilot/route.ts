import { NextResponse } from "next/server";
import { runAutopilot, runAutopilotSync } from "../../../lib/services/autopilotService";
import { requireWorkspaceMembership, withWorkerOrWorkspaceAuth, withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { ensureUsageAllowed } from "@/lib/services/usageService";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const AutopilotRequestSchema = z.object({
    workspaceId: z.string().min(1, "Workspace ID is required"),
    userId: z.string().optional(),
    jobId: z.string().optional(),
});

export const POST = withWorkerOrWorkspaceAuth(async ({ req, session }) => {
    try {
        if (!session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await (req as Request).json();
        const parsed = AutopilotRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ success: false, error: "Invalid payload format", details: parsed.error }, { status: 400 });
        }

        const { workspaceId } = parsed.data;

        const userId = session.isWorker ? parsed.data.userId : session.user.id;

        if (!session.isWorker) {
            const membershipError = await requireWorkspaceMembership(userId, workspaceId);
            if (membershipError) return membershipError;

            const guard = await ensureUsageAllowed(userId as string, "factory.autopilotChunk");
            if (!guard.allowed) {
                return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
            }
        }

        let result;
        try {
            result = session.isWorker
                ? await runAutopilotSync(userId, workspaceId)
                : await runAutopilot(userId, workspaceId);
        } catch (error: unknown) {
            if (!session.isWorker && process.env.USE_QUEUE === "true") {
                console.error("QUEUE_ENQUEUE_FAILED", error);
                return NextResponse.json(
                    {
                        success: false,
                        queued: false,
                        error: "Queue unavailable. Please retry shortly.",
                        code: "QUEUE_UNAVAILABLE",
                    },
                    { status: 503 },
                );
            }

            throw error;
        }

        return NextResponse.json(result, { status: "status" in result && result.status === "queued" ? 202 : 200 });

    } catch (err: unknown) {
        console.error("Autopilot API Error:", err);
        const message = err instanceof Error ? err.message : "Autopilot initialization failed";
        return NextResponse.json(
            { success: false, error: "Autopilot initialization failed", details: message },
            { status: 500 }
        );
    }
});

export const GET = withWorkspaceAuth(async ({ req, session }) => {
    try {
        const url = new URL((req as Request).url);
        const jobId = url.searchParams.get("jobId");
        if (!jobId) {
            return NextResponse.json({ success: false, error: "jobId is required" }, { status: 400 });
        }

        const job = await prisma.autopilotJob.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
        }

        const membershipError = await requireWorkspaceMembership(session.user.id, job.workspaceId);
        if (membershipError) return membershipError;

        return NextResponse.json({
            success: true,
            job: {
                id: job.id,
                status: job.status,
                workspaceId: job.workspaceId,
                createdAt: job.createdAt,
            },
        });
    } catch (err: unknown) {
        console.error("Autopilot status API Error:", err);
        const message = err instanceof Error ? err.message : "Autopilot status lookup failed";
        return NextResponse.json(
            { success: false, error: "Autopilot status lookup failed", details: message },
            { status: 500 },
        );
    }
});
