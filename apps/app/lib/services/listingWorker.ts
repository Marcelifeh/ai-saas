import { prisma } from "../db/prisma";

export async function runListingWorker() {
  if (!prisma || !prisma.listingQueue) {
    console.warn('[listingWorker] prisma listingQueue not available');
    return { processed: 0 };
  }

  // Fetch highest-priority pending jobs
  const jobs = await prisma.listingQueue.findMany({ where: { status: 'PENDING' }, orderBy: { priorityScore: 'desc' }, take: 5 });
  let processed = 0;

  for (const job of jobs) {
    try {
      // Idempotent transition: only set to PROCESSING if still PENDING
      const res = await prisma.listingQueue.updateMany({ where: { id: job.id, status: 'PENDING' }, data: { status: 'PROCESSING' } });
      if (!res || res.count === 0) {
        console.log('[listingWorker] Skipping non-pending job', job.id);
        continue;
      }

      console.log('[listingWorker] Processing:', job.id, job.title || job.slogan || job.niche);

      // TODO: Image/mockup generation, upload, marketplace push

      // Create an initial performance record (best-effort)
      try {
        if (prisma.listingPerformance) {
          await prisma.listingPerformance.create({ data: { listingId: job.id, impressions: 0, clicks: 0, conversions: 0, revenue: 0 } });
        }
      } catch (e) {
        console.warn('[listingWorker] could not create initial performance record', e && (e as any).message);
      }

      // Mark done
      await prisma.listingQueue.update({ where: { id: job.id }, data: { status: 'DONE' } });
      processed++;
    } catch (err) {
      console.error('[listingWorker] job failed', job.id, err);
      try { await prisma.listingQueue.update({ where: { id: job.id }, data: { status: 'FAILED' } }); } catch(_) {}
    }
  }

  return { processed };
}

export default { runListingWorker };
