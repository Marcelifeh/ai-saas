const niche = process.argv[2] || 'Pickleball';
const audience = 'players';
const anchor = niche;

// Mock pattern expansion (would normally call LLM)
const expandedPatterns = [
  '[ANCHOR] Rules Apply',
  'Dink Responsibly',
  'Just One More Game',
  'Kitchen Violator',
  'Serve First Talk Later',
  'Sorry I Was Serving',
];

function buildFromPatterns(patterns, niche) {
  const anchors = [niche, `${niche}ers`, `${niche} Insiders`];
  const results = [];
  for (const pat of patterns) {
    if (pat.includes('[ANCHOR]')) {
      for (const a of anchors) results.push(pat.replace(/\[ANCHOR\]/gi, a));
    } else {
      results.push(pat);
      if (anchors[0]) results.push(`${anchors[0]} ${pat}`);
    }
  }
  return [...new Set(results)].slice(0, 48);
}

function generateBaseCandidates() {
  return [
    `Got ${anchor}?`,
    `${anchor} Mode`,
    `Play ${anchor}`,
    `${anchor} Energy`,
    `Pure ${anchor}`,
    `Certified ${anchor}`,
    `${anchor} Insiders`,
    `Real ${anchor} Energy`,
  ];
}

function scoreSlogan(s) {
  const lower = s.toLowerCase();
  let sc = 0;
  if (/[?]/.test(s)) sc += 18;
  if (/dink|serve|smash|play|got|insiders|kitchen|sorry|just one/.test(lower)) sc += 14;
  const wc = s.split(/\s+/).length;
  if (wc <= 3) sc += 12;
  if (wc <= 5) sc += 6;
  if (/energy|real|certified|insiders/.test(lower)) sc += 8;
  if (/vibe|mood|legend|whisperer/.test(lower)) sc -= 20;
  if (lower.includes(anchor.toLowerCase())) sc += 6;
  return sc;
}

function refineMock(s) {
  // lightweight deterministic "LLM-like" polish
  if (/play/i.test(s)) return s.replace(/Play/i, 'Just One More Game');
  if (/got/i.test(s)) return s.replace(/Got/i, "Got 'em");
  if (/mode/i.test(s)) return s.replace(/Mode/i, 'Mode — Dink Edition');
  if (/energy/i.test(s)) return s.replace(/Energy/i, 'Energy');
  if (/insiders/i.test(s)) return s.replace(/Insiders/i, 'Insiders — No Volley Zone');
  if (/kitchen/i.test(s)) return s.replace(/Kitchen/i, 'Kitchen Rules');
  if (/dink/i.test(s) && /responsibly/i.test(s)) return s;
  // fallback shortener
  return s;
}

(async function run() {
  console.log('Running mock full pipeline for niche:', niche);

  const base = generateBaseCandidates();
  console.log('\nBase candidates:');
  console.table(base.map((s) => ({ slogan: s, score: scoreSlogan(s) })));

  const patterns = expandedPatterns;
  console.log('\nExpanded patterns (mock LLM):');
  console.table(patterns);

  const expanded = buildFromPatterns(patterns, niche);
  console.log('\nExpanded candidates from patterns:');
  console.table(expanded.map((s) => ({ slogan: s, score: scoreSlogan(s) })));

  const merged = [...new Set([...base, ...expanded])];

  const scored = merged.map((s) => ({ slogan: s, score: scoreSlogan(s) }))
    .sort((a,b)=>b.score - a.score);

  console.log('\nMerged scored candidates (top 30):');
  console.table(scored.slice(0,30));

  // Apply mock refinement only to top candidates (> threshold)
  const threshold = 40;
  const toRefine = scored.filter((c) => c.score >= threshold).slice(0, 8);

  const refined = toRefine.map((c) => ({ original: c.slogan, refined: refineMock(c.slogan), originalScore: c.score, refinedScore: scoreSlogan(refineMock(c.slogan)) }));

  console.log('\nRefined candidates (mock LLM polish):');
  console.table(refined);

  const finalPool = [...scored.map(s=>s), ...refined.map(r=>({slogan: r.refined, score: r.refinedScore}))];
  const finalSorted = finalPool.sort((a,b)=>b.score - a.score).filter((v,i,arr)=>arr.findIndex(x=>x.slogan===v.slogan)===i).slice(0,12);

  console.log('\nFinal top slogans after refinement:');
  console.table(finalSorted);
})();
