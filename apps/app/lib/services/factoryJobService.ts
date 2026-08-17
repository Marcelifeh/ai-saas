import { globalCache } from "@/lib/utils/cache";
import { getNicheEvidence } from "./marketEvidenceService";

export type JobState = "QUEUED" | "PROCESSING" | "COMPLETE" | "FAILED";
export type JobRunMode = "INITIAL_RUN" | "RETRY" | "REFRESH";

export interface FactoryNicheJob {
  jobId: string;
  nicheId?: string;
  niche: string;
  opportunityId?: string;
  evidenceSnapshotId?: string;
  runMode: JobRunMode;
  parentJobId?: string;
  sloganEngineVersion: string;
  designEngineVersion: string;
  listingEngineVersion: string;
  inputSnapshot: Record<string, unknown>;
  outputSnapshot?: Record<string, unknown>;
  status: JobState;
  attemptCount: number;
  errorCode?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface FactoryRunStatus {
  runId: string;
  createdAt: string;
  totalNiches: number;
  completedCount: number;
  failedCount: number;
  status: "INITIALIZING" | "RUNNING" | "COMPLETED" | "FAILED";
  jobs: FactoryNicheJob[];
}

export function createFactoryRun(
  niches: Array<{ niche: string; opportunityId?: string; evidenceSnapshotId?: string }>
): FactoryRunStatus {
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const jobs: FactoryNicheJob[] = niches.map((item) => ({
    jobId: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    niche: item.niche,
    opportunityId: item.opportunityId,
    evidenceSnapshotId: item.evidenceSnapshotId || `ME-${Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")}`,
    runMode: "INITIAL_RUN",
    sloganEngineVersion: "v3.1-evidence",
    designEngineVersion: "v2.0-dynamic-visual",
    listingEngineVersion: "v2.2-seo-grounded",
    inputSnapshot: {
      niche: item.niche,
      opportunityId: item.opportunityId,
      requestedAt: timestamp,
    },
    status: "QUEUED",
    attemptCount: 0,
  }));

  const run: FactoryRunStatus = {
    runId,
    createdAt: timestamp,
    totalNiches: niches.length,
    completedCount: 0,
    failedCount: 0,
    status: "INITIALIZING",
    jobs,
  };

  globalCache.set(`factory_run_${runId}`, run, 60 * 60 * 1000);
  return run;
}

export function getFactoryRunStatus(runId: string): FactoryRunStatus | null {
  const cached = globalCache.get(`factory_run_${runId}`);
  if (!cached) return null;
  return cached as FactoryRunStatus;
}

export async function retryFactoryJob(
  runId: string,
  niche: string
): Promise<{ success: boolean; job?: FactoryNicheJob; error?: string }> {
  const run = getFactoryRunStatus(runId);
  if (!run) return { success: false, error: "Factory run not found" };

  const currentJob = run.jobs.find((j) => j.niche.toLowerCase() === niche.toLowerCase());
  if (!currentJob) return { success: false, error: "Job not found in run" };

  // RETRY: Reuse exact original evidenceSnapshotId and inputSnapshot
  const retriedJob: FactoryNicheJob = {
    ...currentJob,
    jobId: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    parentJobId: currentJob.jobId,
    runMode: "RETRY",
    status: "QUEUED",
    attemptCount: currentJob.attemptCount + 1,
    startedAt: undefined,
    completedAt: undefined,
    errorCode: undefined,
  };

  const jobIndex = run.jobs.findIndex((j) => j.niche.toLowerCase() === niche.toLowerCase());
  run.jobs[jobIndex] = retriedJob;
  run.status = "RUNNING";

  globalCache.set(`factory_run_${runId}`, run, 60 * 60 * 1000);
  return { success: true, job: retriedJob };
}

export async function refreshFactoryJob(
  runId: string,
  niche: string
): Promise<{ success: boolean; job?: FactoryNicheJob; error?: string }> {
  const run = getFactoryRunStatus(runId);
  if (!run) return { success: false, error: "Factory run not found" };

  const currentJob = run.jobs.find((j) => j.niche.toLowerCase() === niche.toLowerCase());
  if (!currentJob) return { success: false, error: "Job not found in run" };

  // REFRESH: Acquire fresh current market evidence snapshot
  const freshEvidence = await getNicheEvidence(niche);

  const refreshedJob: FactoryNicheJob = {
    ...currentJob,
    jobId: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    parentJobId: currentJob.jobId,
    evidenceSnapshotId: freshEvidence.id,
    runMode: "REFRESH",
    status: "QUEUED",
    attemptCount: 0,
    inputSnapshot: {
      ...currentJob.inputSnapshot,
      refreshedAt: new Date().toISOString(),
      evidenceSnapshotId: freshEvidence.id,
      contentHash: freshEvidence.contentHash,
    },
    startedAt: undefined,
    completedAt: undefined,
    errorCode: undefined,
  };

  const jobIndex = run.jobs.findIndex((j) => j.niche.toLowerCase() === niche.toLowerCase());
  run.jobs[jobIndex] = refreshedJob;
  run.status = "RUNNING";

  globalCache.set(`factory_run_${runId}`, run, 60 * 60 * 1000);
  return { success: true, job: refreshedJob };
}

export function updateNicheJob(
  runId: string,
  niche: string,
  update: Partial<FactoryNicheJob>
): FactoryRunStatus | null {
  const run = getFactoryRunStatus(runId);
  if (!run) return null;

  const jobIndex = run.jobs.findIndex((j) => j.niche.toLowerCase() === niche.toLowerCase());
  if (jobIndex === -1) return run;

  const currentJob = run.jobs[jobIndex];
  const updatedJob: FactoryNicheJob = {
    ...currentJob,
    ...update,
    attemptCount: update.status === "PROCESSING" ? currentJob.attemptCount + 1 : currentJob.attemptCount,
  };

  if (update.status === "PROCESSING" && !currentJob.startedAt) {
    updatedJob.startedAt = new Date().toISOString();
  }

  if ((update.status === "COMPLETE" || update.status === "FAILED") && !currentJob.completedAt) {
    updatedJob.completedAt = new Date().toISOString();
  }

  run.jobs[jobIndex] = updatedJob;

  // Recalculate aggregate stats
  run.completedCount = run.jobs.filter((j) => j.status === "COMPLETE").length;
  run.failedCount = run.jobs.filter((j) => j.status === "FAILED").length;

  if (run.completedCount + run.failedCount === run.totalNiches) {
    run.status = run.failedCount === run.totalNiches ? "FAILED" : "COMPLETED";
  } else if (run.jobs.some((j) => j.status === "PROCESSING" || j.status === "COMPLETE")) {
    run.status = "RUNNING";
  }

  globalCache.set(`factory_run_${runId}`, run, 60 * 60 * 1000);
  return run;
}
