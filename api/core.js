// Central API gateway for Vercel deployment
// Routes requests based on `action` in JSON body. Delegates to service modules when available.
const url = require('url');

function sendJSON(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

async function runHandler(handler, req, res) {
  try {
    const result = await handler(req);
    sendJSON(res, 200, { success: true, data: result });
  } catch (err) {
    console.error('[core] handler error', err);
    sendJSON(res, 500, { success: false, error: err && err.message ? err.message : 'Handler failed' });
  }
}

module.exports = async function (req, res) {
  // allow GET health check
  if (req.method === 'GET') {
    return sendJSON(res, 200, { success: true, status: 'ok' });
  }

  let body = '';
  try {
    await new Promise((resolve) => {
      req.on('data', (chunk) => (body += chunk));
      req.on('end', resolve);
      req.on('error', resolve);
    });
  } catch (e) {}

  let payload = {};
  try { payload = body ? JSON.parse(body) : {}; } catch (e) { /* ignore */ }

  const action = (payload.action || (payload && payload.type) || '').toString().toUpperCase();

  switch (action) {
    case 'DISCOVER':
    case 'DISCOVER_OPPORTUNITIES':
      try {
        const svc = require('../apps/app/lib/services/trendDiscoveryService');
        return runHandler((r) => svc.runDiscovery((r && r.userId) || undefined), req, res);
      } catch (e) {
        return sendJSON(res, 501, { success: false, error: 'Discovery service unavailable' });
      }

    case 'GENERATE_SLOGANS':
    case 'GENERATE':
      try {
        const svc = require('../apps/app/lib/services/factoryService');
        return runHandler((r) => svc.regenerateSlogansOnly(payload.prompt || '', payload.platform, payload.audience, payload.style, (payload.userId || undefined)), req, res);
      } catch (e) {
        return sendJSON(res, 501, { success: false, error: 'Factory service unavailable' });
      }

    case 'AUTOPILOT':
      try {
        const svc = require('../apps/app/lib/services/autopilotService');
        return runHandler((r) => svc.runAutopilot(payload.userId || undefined, payload.workspaceId), req, res);
      } catch (e) {
        return sendJSON(res, 501, { success: false, error: 'Autopilot service unavailable' });
      }

    case 'ANALYZE_MARKET':
      try {
        const svc = require('../apps/app/lib/services/trendEngine');
        return runHandler((r) => svc.analyzeMarket(payload.niche || ''), req, res);
      } catch (e) {
        return sendJSON(res, 501, { success: false, error: 'Market analysis service unavailable' });
      }

    case 'WORKER_RUN':
      try {
        const worker = require('../apps/app/lib/services/listingWorker');
        return runHandler((r) => worker.runListingWorker(), req, res);
      } catch (e) {
        return sendJSON(res, 501, { success: false, error: 'Worker unavailable' });
      }

    case 'INGEST_PERF':
      try {
        const learning = require('../apps/app/lib/services/learningService');
        const prisma = require('../apps/app/lib/db/prisma').prisma;
        const perf = payload.perf || payload.data || payload;
        // persist to DB (best-effort)
        try {
          await prisma.listingPerformance.create({ data: perf });
        } catch (e) {
          // ignore DB failures in best-effort mode
          console.warn('[core] failed to persist listingPerformance', e && e.message);
        }
        // record locally and run learning update
        const recorded = learning.recordPerformance(perf);
        const applied = await learning.applyLearningWeights(perf).catch((err) => {
          console.warn('[core] learning.applyLearningWeights failed', err && err.message);
          return null;
        });
        return sendJSON(res, 200, { success: true, recorded, applied });
      } catch (e) {
        return sendJSON(res, 501, { success: false, error: 'Learning service unavailable' });
      }

    default:
      return sendJSON(res, 400, { success: false, error: 'Unknown action', action: payload.action });
  }
};
