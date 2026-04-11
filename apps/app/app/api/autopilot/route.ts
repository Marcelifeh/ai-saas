import { NextResponse } from "next/server";
import { runAutopilot } from "../../../lib/services/autopilotService";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { ensureUsageAllowed } from "@/lib/services/usageService";
import { z } from "zod";

const AutopilotRequestSchema = z.object({
    workspaceId: z.string().min(1, "Workspace ID is required")
});

export const POST = withWorkspaceAuth(async ({ req, session }) => {
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

        const userId = session.user.id as string;

        const guard = await ensureUsageAllowed(userId, "factory.autopilotChunk");
        if (!guard.allowed) {
            return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
        }

        // Phase 2: skip strict workspace membership enforcement to avoid
        // requiring workspace tables/migrations in dev. We still require
        // an authenticated user and a non-empty workspaceId payload.
        const result = await runAutopilot(userId, workspaceId);

        return NextResponse.json(result);

    } catch (err: unknown) {
        console.error("Autopilot API Error:", err);
        const message = err instanceof Error ? err.message : "Autopilot initialization failed";
        return NextResponse.json(
            { success: false, error: "Autopilot initialization failed", details: message },
            { status: 500 }
        );
    }
});
