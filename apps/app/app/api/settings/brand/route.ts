import { NextResponse } from "next/server";
import { z } from "zod";

import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { prisma } from "@/lib/db/prisma";

const BrandSchema = z.object({
  brand: z.string().trim().max(80).nullable(),
});

export const GET = withWorkspaceAuth(async ({ session }) => {
  const userId = session.user?.id;
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { merchBrand: true } });
  return NextResponse.json({ success: true, brand: user?.merchBrand ?? null });
});

export const PUT = withWorkspaceAuth(async ({ req, session }) => {
  const userId = session.user?.id;
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await (req as Request).json();
  const parsed = BrandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Brand must be 80 characters or fewer." }, { status: 400 });
  }

  const brand = parsed.data.brand?.trim() || null;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { merchBrand: brand },
    select: { merchBrand: true },
  });

  return NextResponse.json({ success: true, brand: user.merchBrand });
});
