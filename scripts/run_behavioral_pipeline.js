#!/usr/bin/env node
const fs = require('fs');
const Module = require('module');
const path = require('path');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '..');
for (const envPath of [path.join(rootDir, '.env'), path.join(rootDir, 'apps', 'app', '.env')]) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

// Configure environment flags to avoid DB writes during the experiment
process.env.DISABLE_PATTERN_PERSIST = 'true';
process.env.DISABLE_USAGE_LIMITS = 'true';

// Next's server-only package intentionally throws outside the Next runtime.
// This runner executes compiled server modules directly in Node, so treat the
// sentinel import as a no-op while keeping the application code unchanged.
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'server-only') return {};
  if (request.replace(/\\/g, '/').endsWith('packages/db/generated/client')) {
    return originalLoad.call(this, path.join(rootDir, 'packages', 'db', 'generated', 'client'), parent, isMain);
  }
  return originalLoad.call(this, request, parent, isMain);
};

const distAi = path.join(rootDir, 'apps', 'app', 'dist-scripts', 'lib', 'ai');
const aiGatewayPath = path.join(distAi, 'aiGateway.js');
const sloganEnginePath = path.join(distAi, 'sloganEngine.js');
const sloganEnhancerPath = path.join(distAi, 'sloganEnhancer.js');

// Ensure outputs directory
const outputsDir = path.join(rootDir, 'outputs');
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });
const rawLogPath = path.join(outputsDir, 'llm_raw.jsonl');
const resultsPath = path.join(outputsDir, 'behavioral_pipeline_results.jsonl');
const metricsPath = path.join(outputsDir, 'behavioral_pipeline_metrics.json');

// Load and wrap aiGateway for raw response logging
const aiGateway = require(aiGatewayPath);
const originalChatSafe = aiGateway.chatCompletionSafe;

aiGateway.chatCompletionSafe = async function (options) {
  const start = Date.now();
  const res = await originalChatSafe(options);
  try {
    const messagesPreview = (options.messages || []).map(m => ({ role: m.role, content: typeof m.content === 'string' ? (m.content.length > 800 ? m.content.slice(0, 800) + '...' : m.content) : null }));
    const preview = {
      ts: new Date().toISOString(),
      model: options.model,
      temperature: options.temperature,
      usageContext: options.usageContext || null,
      messages: messagesPreview,
      responsePreview: res.data?.choices?.[0]?.message?.content ? (res.data.choices[0].message.content.length > 2000 ? res.data.choices[0].message.content.slice(0, 2000) + '...' : res.data.choices[0].message.content) : null,
      usage: res.data?.usage || null,
      error: res.error || false,
    };
    fs.appendFileSync(rawLogPath, JSON.stringify(preview) + '\n');
  } catch (e) {
    console.error('Failed to write LLM raw log', e);
  }
  return res;
};

const sloganEngine = require(sloganEnginePath);
const enhancer = require(sloganEnhancerPath);

// Niches to run
const niches = [
  'Pickleball',
  'Dog Moms',
  'Campers',
  'Nurses',
  'ADHD Coders',
  'Gym Rats',
  'Teachers',
  'Golfers',
  'Crocheters',
  'Runners',
];

// Detection patterns
const templatePatterns = [
  /just one more/i,
  /eat\s*[,\-]?\s*sleep.*repeat/i,
  /eat\s*sleep.*repeat/i,
  /weekend\s+warrior/i,
  /powered by/i,
  /fueled by/i,
  /driven by/i,
  /\bmode\b/i,
  /\bofficial\b/i,
  /\baddict\b/i,
  /\bmvp\b/i,
  /\bhustler\b/i,
  /\bchampion\b/i,
  /\bpeople become family\b/i,
  /where friends become family/i,
  /you know .*\b/i,
];

const hallmarkPatterns = [
  /friends become family/i,
  /living my best life/i,
  /good vibes/i,
  /weekend mode/i,
  /happy place/i,
  /life is better with/i,
];

const corporateTerms = ["champion","elite","hustle","mvp","warrior","official","success","hustler","pro","elite","championship"];

const identityLabels = [/\bwarrior\b/i, /\bmvp\b/i, /\baddict\b/i, /\bhustler\b/i, /\bofficial\b/i, /\bchampion\b/i, /\bmvp\b/i];

// Behavioral token heuristics
const contradictionPattern = /\b(despite|but|though|although|instead)\b/i;
const shamePattern = /\b(pretend|shame|guilty|embarrass|sorry)\b/i;
const obsessionPattern = /\b(one more|again|obsess|can't stop|cant stop|addict|compulsive|always|never quit)\b/i;

function sanitizeTokensFromSeeds(seeds) {
  return (seeds || []).flatMap(s => ('' + s).toLowerCase().split(/[^a-z0-9]+/)).filter(Boolean).filter(t => t.length > 3);
}

function computeTemplateLeakageRate(slogans) {
  if (!slogans || slogans.length === 0) return 0;
  const matches = slogans.filter(s => templatePatterns.some(p => p.test(s)));
  return matches.length / slogans.length;
}

function computeHallmarkRate(slogans) {
  if (!slogans || slogans.length === 0) return 0;
  const matches = slogans.filter(s => hallmarkPatterns.some(p => p.test(s)));
  return matches.length / slogans.length;
}

function computeBehavioralDensity(slogans, seeds) {
  if (!slogans || slogans.length === 0) return 0;
  const seedTokens = sanitizeTokensFromSeeds(seeds);
  const seedSet = new Set(seedTokens);
  const scores = slogans.map(s => {
    const lower = s.toLowerCase();
    let count = 0;
    for (const t of seedSet) if (lower.includes(t)) count += 1;
    if (contradictionPattern.test(lower)) count += 1;
    if (shamePattern.test(lower)) count += 1;
    if (obsessionPattern.test(lower)) count += 1;
    return Math.min(count, 5); // cap
  });
  // Normalize 0..5 -> 0..100
  const avg = scores.reduce((a,b) => a+b, 0)/scores.length;
  return Math.round((avg/5)*100);
}

function computeWearability(slogans) {
  if (!slogans || slogans.length === 0) return 0;
  // replicate computeWearability from engine
  function compute(s) {
    const len = s.length;
    if (len <= 20) return 95;
    if (len <= 35) return 85;
    if (len <= 50) return 70;
    if (len <= 65) return 55;
    return 35;
  }
  const vals = slogans.map(s => compute(s));
  return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
}

function computeCorporateToneScore(slogans) {
  if (!slogans || slogans.length === 0) return 0;
  const scores = slogans.map(s => {
    const lower = s.toLowerCase();
    let score = 0;
    for (const t of corporateTerms) if (lower.includes(t)) score += 25;
    return Math.min(score, 100);
  });
  return Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
}

function computeScreenshotProbability(slogans, seeds) {
  if (!slogans || slogans.length === 0) return 0;
  const seedTokens = sanitizeTokensFromSeeds(seeds);
  const seedSet = new Set(seedTokens);
  const scores = slogans.map(s => {
    const lower = s.toLowerCase();
    let score = 50;
    if (contradictionPattern.test(lower)) score += 15;
    if (shamePattern.test(lower)) score += 8;
    if (obsessionPattern.test(lower)) score += 8;
    // insider language
    for (const t of seedSet) if (lower.includes(t)) { score += 12; break; }
    // penalize identity labels / corporate tone
    if (identityLabels.some(r => r.test(lower))) score -= 20;
    if (templatePatterns.some(r => r.test(lower))) score -= 18;
    // penalize hallmark
    if (hallmarkPatterns.some(r => r.test(lower))) score -= 15;
    return Math.max(0, Math.min(100, score));
  });
  return Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
}

function uniqueRate(arr) {
  if (!arr || arr.length === 0) return 0;
  const set = new Set(arr.map(s => s.toLowerCase().trim()));
  return set.size / arr.length;
}

async function run() {
  const allMetrics = [];
  for (const niche of niches) {
    console.log('Running niche:', niche);
    // Extract heuristic behaviors if available
    let behaviors = [];
    try { behaviors = sloganEngine.extractBehaviorSignals ? sloganEngine.extractBehaviorSignals(niche.toLowerCase()) : []; } catch (e) { behaviors = []; }

    // Generate raw candidates using the engine (LLM)
    let rawCandidates = [];
    try {
      rawCandidates = await sloganEngine.generateBehavioralSlogans({ niche, behaviors, count: 36 });
    } catch (err) {
      console.error('Generation failed for', niche, err?.message || err);
      rawCandidates = [];
    }

    // Enhance and filter
    let enhanced = [];
    let categories = [];
    let isDual = false;
    try {
      const res = enhancer.filterAndEnhanceSlogans(rawCandidates, niche);
      enhanced = res.slogans || [];
      categories = res.categories || [];
      isDual = !!res.isDualNiche;
    } catch (e) {
      console.error('Enhancer failed for', niche, e?.message || e);
      enhanced = rawCandidates;
    }

    // Compute metrics
    const templateLeakageRate = computeTemplateLeakageRate(enhanced);
    const hallmarkRate = computeHallmarkRate(enhanced);
    const behavioralDensity = computeBehavioralDensity(enhanced, behaviors);
    const wearability = computeWearability(enhanced);
    const corporateTone = computeCorporateToneScore(enhanced);
    const screenshotProb = computeScreenshotProbability(enhanced, behaviors);
    const uniqueness = uniqueRate(enhanced);

    const nicheResult = {
      niche,
      timestamp: new Date().toISOString(),
      rawCount: rawCandidates.length,
      enhancedCount: enhanced.length,
      categories,
      isDualNiche: isDual,
      templateLeakageRate,
      hallmarkRate,
      behavioralDensity,
      wearability,
      corporateTone,
      screenshotProbability: screenshotProb,
      uniqueness,
      sample: enhanced.slice(0, 12),
    };

    fs.appendFileSync(resultsPath, JSON.stringify(nicheResult) + '\n');
    allMetrics.push(nicheResult);

    console.log(`Niche ${niche} -> enhanced ${enhanced.length}, templateLeakage ${Math.round(templateLeakageRate*100)}%, behavioralDensity ${behavioralDensity}, screenshotProb ${screenshotProb}`);
  }

  fs.writeFileSync(metricsPath, JSON.stringify(allMetrics, null, 2));
  console.log('\nDone. Metrics written to', metricsPath);
}

run().catch(e => { console.error('Pipeline run failed', e); process.exit(1); });
