import fs from 'fs';
import path from 'path';
import { prisma } from '../db/prisma';

const DATA_DIR = path.resolve(process.cwd(), 'apps', 'app', 'data');
const QUEUE_FILE = path.join(DATA_DIR, 'launch_queue.json');
const PERF_FILE = path.join(DATA_DIR, 'listing_performance.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export type ListingPerformance = {
  listingId: string;
  niche: string;
  slogan: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  observedAt?: string;
};

export function loadQueue(): any[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(QUEUE_FILE)) return [];
    const raw = fs.readFileSync(QUEUE_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

export function saveQueue(q: any[]) {
  ensureDataDir();
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(q, null, 2), 'utf8');
}

export function enqueueLaunch(item: { niche: string; slogan: string; listing: any; adHooks?: string[] }) {
  const q = loadQueue();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const entry = {
    id,
    niche: item.niche,
    slogan: item.slogan,
    listing: item.listing,
    adHooks: item.adHooks || [],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  q.push(entry);
  saveQueue(q);
  // Best-effort: trigger listing worker to pick up new items
  try {
    // require at runtime to avoid module resolution issues in some environments
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const worker = require('./listingWorker');
    setImmediate(() => { worker.runListingWorker().catch((e:any)=>{ console.warn('[learning] worker trigger failed', e && (e as any).message); }); });
  } catch (e) {}
  return entry;
}

export function listQueue() {
  return loadQueue();
}

export function markLaunched(id: string) {
  const q = loadQueue();
  const idx = q.findIndex((e: any) => e.id === id);
  if (idx === -1) return false;
  q[idx].status = 'launched';
  q[idx].launchedAt = new Date().toISOString();
  saveQueue(q);
  return true;
}

export function recordPerformance(perf: ListingPerformance) {
  try {
    ensureDataDir();
    const arr = fs.existsSync(PERF_FILE) ? JSON.parse(fs.readFileSync(PERF_FILE, 'utf8') || '[]') : [];
    arr.push({ ...perf, observedAt: perf.observedAt || new Date().toISOString() });
    fs.writeFileSync(PERF_FILE, JSON.stringify(arr, null, 2), 'utf8');
    // Return simple decision signals
    const ctr = perf.impressions > 0 ? perf.clicks / perf.impressions : 0;
    const cvr = perf.clicks > 0 ? perf.conversions / perf.clicks : 0;
    const decisions: string[] = [];
    if (perf.impressions > 1000 && perf.clicks === 0) decisions.push('KILL');
    if (perf.clicks > 100 && perf.conversions === 0) decisions.push('CREATIVE_FAIL');
    if (ctr > 0.05) decisions.push('BOOST_HOOK');
    if (cvr > 0.03) decisions.push('BOOST_WEARABILITY');
    if (perf.revenue > 500) decisions.push('BOOST_PATTERN');
    return { ctr, cvr, decisions };
  } catch (e) {
    return { ctr: 0, cvr: 0, decisions: [] };
  }
}

export async function applyLearningWeights(perf: ListingPerformance) {
  try {
    // Compute simple signals
    const ctr = perf.impressions > 0 ? perf.clicks / perf.impressions : 0;
    const cvr = perf.clicks > 0 ? perf.conversions / perf.clicks : 0;
    const revenueFactor = Math.log1p(perf.revenue || 0);
    const delta = Math.min(10, revenueFactor * 1.5 + ctr * 20 + cvr * 50 + (perf.conversions || 0) * 2);

    // Use the slogan text as a fallback pattern key when no explicit pattern is provided
    const patternKey = perf.slogan || `pattern:${perf.listingId}`;

    // Try DB upsert; if prisma is a mock it will still succeed
    await prisma.sloganPattern.upsert({
      where: { niche_pattern: { niche: perf.niche, pattern: patternKey } },
      update: {
        score: { increment: delta },
        uses: { increment: 1 },
        impressions: { increment: perf.impressions || 0 },
        clicks: { increment: perf.clicks || 0 },
        sales: { increment: perf.conversions || 0 },
        ctr: ctr,
        conversion: cvr,
        lastSlogan: perf.slogan,
      },
      create: {
        niche: perf.niche,
        pattern: patternKey,
        score: Math.max(1, delta),
        uses: 1,
        impressions: perf.impressions || 0,
        clicks: perf.clicks || 0,
        sales: perf.conversions || 0,
        ctr: ctr,
        conversion: cvr,
        lastSlogan: perf.slogan,
      },
    });

    return { delta, ctr, cvr };
  } catch (e) {
    console.error('[learning] applyLearningWeights failed', e && (e as any).message ? (e as any).message : e);
    return null;
  }
}

export default {
  enqueueLaunch,
  listQueue,
  markLaunched,
  recordPerformance,
};
