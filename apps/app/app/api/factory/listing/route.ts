import { NextResponse } from "next/server";
import { z } from "zod";

import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { repackageDynamicListing } from "@/lib/services/factoryService";
import { ensureUsageAllowed } from "@/lib/services/usageService";
import type { DynamicNicheProfile } from "@/lib/ai/dynamicNicheProfile";
import type { DynamicDesignStrategy } from "@/lib/ai/dynamicDesignPrompt";

const RepackageSchema = z.object({
  niche: z.string().trim().min(1).max(300),
  slogan: z.string().trim().min(1).max(200),
  audience: z.string().trim().max(300).optional(),
  profile: z.record(z.string(), z.unknown()),
  visualStrategy: z.record(z.string(), z.unknown()).optional(),
  marketTerms: z.array(z.string().trim().min(1).max(160)).max(40).optional(),
  purchaseMotives: z.array(z.string().trim().min(1).max(300)).max(20).optional(),
  marketplace: z.enum(["amazon_merch", "etsy", "general"]),
  visualStyle: z.string().trim().max(120).optional(),
});

export const POST = withWorkspaceAuth(async ({ req, session }) => {
  const userId = session.user?.id;
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const parsed = RepackageSchema.safeParse(await (req as Request).json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid listing context", details: parsed.error }, { status: 400 });
  }

  const guard = await ensureUsageAllowed(userId, "strategy.single");
  if (!guard.allowed) {
    return NextResponse.json({ success: false, error: guard.reason, plan: guard.plan }, { status: 429 });
  }

  const result = await repackageDynamicListing({
    ...parsed.data,
    profile: parsed.data.profile as unknown as DynamicNicheProfile,
    visualStrategy: parsed.data.visualStrategy as unknown as DynamicDesignStrategy | undefined,
  }, userId);

  return NextResponse.json({ success: true, data: result });
});
