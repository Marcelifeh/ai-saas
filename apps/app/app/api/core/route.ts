import { NextResponse } from "next/server";
import { generateSingleStrategy, bulkDiscover, generateChunk } from "../../../lib/services/factoryService";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { ensureUsageAllowed } from "@/lib/services/usageService";
import { z } from "zod";

const CoreRequestSchema = z.object({
    action: z.enum(["generateStrategy", "bulkDiscover", "chunkGenerate"]),
    prompt: z.string().optional(),
    platform: z.string().optional(),
    audience: z.string().optional(),
    style: z.string().optional(),
    niches: z.array(z.any()).optional(),
    isAutopilot: z.boolean().optional()
});

export const POST = withWorkspaceAuth(async ({ req, session }) => {
    try {
        const body = await (req as Request).json();
        const parsed = CoreRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ success: false, error: "Invalid payload format", details: parsed.error }, { status: 400 });
        }

        const { action, prompt, platform, audience, style, niches, isAutopilot } = parsed.data;

        const userId = session.user?.id as string | undefined;

        // Route internally to the abstract service layer
        if (action === "generateStrategy") {
            if (!prompt) return NextResponse.json({ success: false, error: "Prompt required for single generation" }, { status: 400 });

            if (!userId) {
                return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
            }

            const guard = await ensureUsageAllowed(userId, "strategy.single");
            if (!guard.allowed) {
                return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
            }

            const data = await generateSingleStrategy(prompt, platform, audience, style, userId);
            return NextResponse.json({ success: true, data });
        }

        if (action === "bulkDiscover") {
            if (!userId) {
                return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
            }
            const guard = await ensureUsageAllowed(userId, "discovery.bulkTrends");
            if (!guard.allowed) {
                return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
            }
            const data = await bulkDiscover();
            return NextResponse.json({ success: true, niches: data.niches, signalSources: data.signalSources, signalConfidence: data.signalConfidence });
        }

        if (action === "chunkGenerate") {
            if (!niches || niches.length === 0) return NextResponse.json({ success: false, error: "Niches array required for chunking" }, { status: 400 });

            if (!userId) {
                return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
            }

            const feature = isAutopilot ? "factory.autopilotChunk" : "factory.bulkChunk";
            const guard = await ensureUsageAllowed(userId, feature);
            if (!guard.allowed) {
                return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
            }

            const products = await generateChunk(niches, isAutopilot, userId);
            return NextResponse.json({ success: true, products });
        }

        return NextResponse.json({ success: false, error: "Unhandled action" }, { status: 400 });

    } catch (err: unknown) {
        console.error("Core API Error:", err);
        const message = err instanceof Error ? err.message : "Operation failed";
        return NextResponse.json(
            { success: false, error: "Operation failed", details: message },
            { status: 500 }
        );
    }
});
