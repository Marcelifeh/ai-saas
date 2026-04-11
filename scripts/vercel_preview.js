const fs = require('fs');
const path = require('path');

function readJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p,'utf8'));
  } catch (e) {
    console.error('Failed to read/parse', p, e.message);
    process.exit(1);
  }
}

const repoRoot = path.resolve(__dirname,'..');
const vercelPath = path.join(repoRoot,'vercel.json');
if (!fs.existsSync(vercelPath)) {
  console.error('vercel.json not found at', vercelPath);
  process.exit(1);
}
const vercel = readJSON(vercelPath);

// Count builds that are node functions
const nodeBuilds = (vercel.builds||[]).filter(b => (b.use || '').includes('@vercel/node'));
const nodeBuildSrcs = nodeBuilds.map(b => b.src);

// Inspect routes mapping to dest files
const routes = vercel.routes || [];
const apiRouteMappings = routes.filter(r => (r.src||'').startsWith('/api/'));
const destFiles = new Set(apiRouteMappings.map(r => r.dest).filter(Boolean));

// Detect catch-all mapping
const hasCatchAll = apiRouteMappings.some(r => r.src === '/api/(.*)' || r.src === '/api/(.*)');

// Find Next app API route files under apps/app/app/api/**/route.ts
function walkDir(dir, filelist=[]) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir,f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkDir(full, filelist);
    else filelist.push(full);
  });
  return filelist;
}
const appApiDir = path.join(repoRoot,'apps','app','app','api');
const appApiFiles = walkDir(appApiDir).filter(f => f.endsWith('route.ts') || f.endsWith('route.js'));

// Also check for top-level api/*.js files referenced in vercel builds or routes
const topApiDir = path.join(repoRoot,'api');
const topApiFiles = fs.existsSync(topApiDir) ? walkDir(topApiDir).filter(f => f.endsWith('.js')||f.endsWith('.ts')) : [];

// Compute counts
const nodeBuildCount = nodeBuildSrcs.length;
const routeDestCount = destFiles.size;
const nextAppApiCount = appApiFiles.length;
const topApiCount = topApiFiles.length;

// Worst-case: node builds + nextAppApiCount (if not shadowed)
const worstCase = nodeBuildCount + nextAppApiCount + topApiCount;
// Effective if catch-all present: only the unique dests (which map to function files) plus any topApi not covered
let effective = routeDestCount;
// If some top-level api files exist but not mapped, include them
if (topApiCount > 0) {
  // try to see if vercel routes already include them
  const mappedTop = Array.from(destFiles).filter(d => d.startsWith('/api/')).length;
  effective = Math.max(effective, mappedTop);
}

console.log('Vercel preview — function count analysis');
console.log('-----------------------------------------');
console.log('Node builds that use @vercel/node (declared functions):', nodeBuildCount);
if (nodeBuildCount>0) nodeBuildSrcs.forEach(s=>console.log('  -',s));
console.log('Routes mapping /api/* -> dest files (unique):', routeDestCount);
Array.from(destFiles).forEach(d => console.log('  -', d));
console.log('Next app API route files found under apps/app/app/api/:', nextAppApiCount);
if (nextAppApiCount>0) appApiFiles.forEach(f=> console.log('  -', path.relative(repoRoot,f)));
console.log('Top-level api/ files present:', topApiCount);
if (topApiCount>0) topApiFiles.forEach(f=> console.log('  -', path.relative(repoRoot,f)));

console.log('\nTotals:');
console.log('  Worst-case function count (both sets deployed):', worstCase);
if (hasCatchAll) {
  console.log('  Catch-all route detected in vercel.json — Next app API routes will be shadowed by route mappings.');
  console.log('  Effective function count (routes -> unique dests):', effective);
} else {
  console.log('  No catch-all route detected. If Next app is deployed, its API routes will add functions.');
  console.log('  Effective function count (estimated):', worstCase);
}

process.exit(0);
