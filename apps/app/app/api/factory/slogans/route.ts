import { NextResponse } from "next/server";
import { z } from "zod";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { ensureUsageAllowed } from "@/lib/services/usageService";
import { regenerateSlogansOnly, SloganPipelineFailure } from "@/lib/services/factoryService";

const SloganRouteSchema = z.object({
    prompt: z.string().min(1),
    platform: z.string().optional(),
    audience: z.string().optional(),
    style: z.string().optional(),
    designMode: z.enum(["AUTO", "TEXT_ONLY", "HYBRID", "CHARACTER", "CARTOON", "ILLUSTRATION_ONLY"]).optional(),
    excludeSlogans: z.array(z.string()).max(20).optional(),
    creativeDirection: z.string().max(4000).optional(),
    creativeExamples: z.array(z.string().max(300)).max(8).optional(),
    negativeCreativeConstraints: z.array(z.string().max(300)).max(12).optional(),
});

export const POST = withWorkspaceAuth(async ({ req, session }) => {
    try {
        const body = await (req as Request).json();
        const parsed = SloganRouteSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ success: false, error: "Invalid payload format", details: parsed.error.flatten() }, { status: 400 });
        }

        const userId = session.user?.id as string | undefined;
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const guard = await ensureUsageAllowed(userId, "strategy.single");
        if (!guard.allowed) {
            return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
        }

        const {
            prompt,
            platform,
            audience,
            style,
            designMode,
            excludeSlogans,
            creativeDirection,
            creativeExamples,
            negativeCreativeConstraints,
        } = parsed.data;
        const data = await regenerateSlogansOnly(
            prompt,
            platform,
            audience,
            style,
            userId,
            excludeSlogans,
            designMode,
            creativeExamples,
            negativeCreativeConstraints,
            creativeDirection,
        );

        return NextResponse.json({ success: true, data });
    } catch (err: unknown) {
        if (err instanceof SloganPipelineFailure) {
            return NextResponse.json(
                { success: false, error: err.message, code: err.code },
                { status: 422 },
            );
        }
        const message = err instanceof Error ? err.message : "Slogan regeneration failed";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
});
