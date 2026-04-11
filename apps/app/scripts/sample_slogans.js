const niche = process.argv[2] || 'Pickleball';
const anchor = niche;

const templates = [
  'Got [ANCHOR]?',
  '[ANCHOR] On',
  'Play [ANCHOR]',
  "Can't Stop [ANCHOR]",
  'Only [ANCHOR] People Know',
  '[ANCHOR] Insiders',
  'Real [ANCHOR] Energy',
  'Certified [ANCHOR]',
  'Win Not Excuse',
  '[ANCHOR] People Get It',
  'One More [ANCHOR], Then Sleep',
  'Pure [ANCHOR]',
  '[ANCHOR] Mode',
  '[ANCHOR] Energy',
  'Play Hard, [ANCHOR] Harder',
  'Serve Smash Repeat',
  'Dink, Drift, Dominate',
  'Slice. Serve. Smile.'
];

function tidy(s) {
  let t = s.replace(/\[ANCHOR\]/g, anchor).trim();
  // Remove trailing punctuation and single-word suffixes
  t = t.replace(/[.!,]+$/g, '').replace(/\s+/g, ' ').trim();
  const suffixRemovals = ['identity','clean','wearable','commercial','graphic'];
  const parts = t.split(/\s+/);
  const last = parts[parts.length-1].toLowerCase();
  if (suffixRemovals.includes(last)) parts.pop();
  t = parts.join(' ');
  t = t.replace(/\bIdentity\b\s*$/i, '').trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function score(s) {
  const lower = s.toLowerCase();
  let sc = 0;
  // Hook: presence of question, command verbs, contrast words
  if (/[?]/.test(s)) sc += 18;
  if (/win|play|stop|dink|serve|smash|dominate|certified|real|got|can't|one more|insiders/.test(lower)) sc += 14;
  // brevity
  const wc = s.split(/\s+/).length;
  if (wc <= 3) sc += 12;
  if (wc <= 5) sc += 6;
  // emotional words
  if (/energy|real|certified|insiders/.test(lower)) sc += 8;
  // avoid generic filler
  if (/vibe|mood|legend|whisperer/.test(lower)) sc -= 20;
  // bonus for anchor included
  if (lower.includes(anchor.toLowerCase())) sc += 6;
  return sc;
}

const candidates = templates.map(t => tidy(t));
const ranked = candidates.map(s => ({ slogan: s, score: score(s) }))
  .sort((a,b)=>b.score - a.score);

console.log('Sample slogans for', niche);
console.table(ranked.slice(0, 20));
