import { NextResponse } from "next/server";
import { z } from "zod";

import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { ensureUsageAllowed } from "@/lib/services/usageService";
import { regenerateVisualDesigns } from "@/lib/services/factoryService";
import type { DynamicNicheProfile } from "@/lib/ai/dynamicNicheProfile";

const DesignRouteSchema = z.object({
  niche: z.string().trim().min(1).max(300),
  slogans: z.array(z.string().trim().min(1).max(200)).min(1).max(12),
  profile: z.record(z.string(), z.unknown()),
  // Intentionally free-form: visual aesthetics evolve independently from releases.
  // Keep system behavior in designMode; never turn style into a preset enum.
  style: z.string().trim().min(1).max(1600).optional(),
  platform: z.string().trim().max(40).optional(),
  designMode: z.enum(["AUTO", "TEXT_ONLY", "HYBRID", "CHARACTER", "CARTOON", "ILLUSTRATION_ONLY"]),
  subjectOverride: z.enum(["AUTO", "NO_PERSON", "INCLUDE_PERSON"]).optional(),
});

export const POST = withWorkspaceAuth(async ({ req, session }) => {
  const userId = session.user?.id;
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const parsed = DesignRouteSchema.safeParse(await (req as Request).json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid design context", details: parsed.error.flatten() }, { status: 400 });
  }

  const guard = await ensureUsageAllowed(userId, "strategy.single");
  if (!guard.allowed) {
    return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
  }

  const data = await regenerateVisualDesigns({
    ...parsed.data,
    profile: parsed.data.profile as unknown as DynamicNicheProfile,
    userId,
  });
  return NextResponse.json({ success: true, data });
});
