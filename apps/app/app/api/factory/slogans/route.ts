import { NextResponse } from "next/server";
import { z } from "zod";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { ensureUsageAllowed } from "@/lib/services/usageService";
import { regenerateSlogansOnly } from "@/lib/services/factoryService";

const SloganRouteSchema = z.object({
    prompt: z.string().min(1),
    platform: z.string().optional(),
    audience: z.string().optional(),
    style: z.string().optional(),
    excludeSlogans: z.array(z.string()).max(20).optional(),
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

        const { prompt, platform, audience, style, excludeSlogans } = parsed.data;
        const data = await regenerateSlogansOnly(prompt, platform, audience, style, userId, excludeSlogans);

        return NextResponse.json({ success: true, data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Slogan regeneration failed";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
});
