import { NextResponse } from "next/server";
import { getFactoryRunStatus } from "@/lib/services/factoryJobService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  if (!runId) {
    return NextResponse.json({ error: "Missing runId parameter" }, { status: 400 });
  }

  const run = getFactoryRunStatus(runId);
  if (!run) {
    return NextResponse.json({ error: "Factory run not found" }, { status: 404 });
  }

  return NextResponse.json(run);
}
