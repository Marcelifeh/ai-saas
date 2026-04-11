// ─── Market Intelligence Helpers ───────────────────────────────────────────

// Get top and low-performing patterns for a niche from DB
async function getTopPatterns(niche: string) {
  try {
    const patterns = await prisma.sloganPattern.findMany({
      where: { niche: niche.trim().toLowerCase().slice(0, 60) },
      orderBy: { score: "desc" },
      take: 8,
    });
    return patterns.filter((p: any) => p.score > 1.05);
  } catch { return []; }
}
async function getLowPerformingPatterns(niche: string) {
  try {
    const patterns = await prisma.sloganPattern.findMany({
      where: { niche: niche.trim().toLowerCase().slice(0, 60), score: { lt: 0.98 } },
      orderBy: { score: "asc" },
      take: 6,
    });
    return patterns;
  } catch { return []; }
}

// Get trending keywords for a niche (stub: replace with real trend engine call)
async function getTrendingKeywords(niche: string): Promise<string[]> {
  // TODO: Integrate with trendEngine for live data
  return [];
}

// Get buyer phrases for a niche (stub: replace with real mining)
async function getBuyerPhrases(niche: string): Promise<string[]> {
  // TODO: Integrate with review/Q&A mining
  return [];
}

// Pattern fingerprinting for hard anti-repetition
function getStructureFingerprint(slogan: string): string {
  return slogan
    .toLowerCase()
    .replace(/[a-z]+/g, "X")
    .replace(/\s+/g, " ")
    .trim();
}

// Inject winning pattern bias into score
function injectWinningBias(slogan: string, patterns: { pattern: string, score: number }[]): number {
  let boost = 0;
  for (const p of patterns) {
    if (slogan.toLowerCase().includes(p.pattern.toLowerCase())) {
      boost += p.score * 0.1;
    }
  }
  return boost;
}

// Detect emotion cluster for a slogan
function detectEmotionCluster(slogan: string): string {
  if (/proud|built|born|real|true|pure|unapologetic|unbothered|certified|official|dedicated/i.test(slogan)) return "PRIDE";
  if (/lol|funny|nah|sarcasm|humor|not people|leave me alone/i.test(slogan)) return "HUMOR";
  if (/don’t|never|against|no |not |rebellion|anti|feral|chaos|wild/i.test(slogan)) return "REBELLION";
  if (/club|tribe|crew|squad|team|family|belong|together/i.test(slogan)) return "BELONGING";
  return "GENERIC";
}

// Enrich trend keywords into language style
function enrichTrendLanguage(trends: string[]): string[] {
  return trends.map(t => `Use "${t}" as slang or identity signal`);
}
// Note: removed Next's `server-only` import to allow running compiled scripts
// from the `apps/app/scripts` runner. Server-only behavior is not required
// for the standalone script execution path.
import { prisma } from "@/lib/db/prisma";
import { chatCompletionSafe } from "./aiGateway";
import { globalCache } from "@/lib/utils/cache";
import { runSafetyEngine } from "./safetyEngine";
import {
  filterAndEnhanceSlogans,
  scoreCrossNicheAlignment,
  detectNicheCategories,
  isSafeSlogan,
  isWearable,
  transformStatement,
  type NicheCategory,
} from "./sloganEnhancer";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SloganMode = "safe" | "viral" | "edgy";
export type SloganBucket = "topPicks" | "boldPicks" | "experimental";

export interface SalesSignals {
  confidence?: number;
  platformData?: Record<string, unknown>;
  topKeywords?: string[];
  [key: string]: unknown;
}

export interface RankedSlogan {
  slogan: string;
  pattern: string;
  persona: string;
  personaKey: string;
  score: number;
  finalScore: number;
  confidence: number;
  wearability: number;
  memorability: number;
  identity: number;
  identityScore: number;
  emotion: number;
  emotionScore: number;
  recognitionScore?: number;
  punch: number;
  punchScore: number;
  visualFit: number;
  hookScore: number;
  symmetry: number;
  lineBreakPotential: number;
  fontImpact: number;
  contrastScore: number;
  curiosityGap: number;
  emotionalTriggerScore: number;
  emotionalTrigger: number;
  genericPenalty: number;
  marketSignalScore: number;
  clevernessScore: number;
  tags?: string[];
  reasons: string[];
  salesSignals?: SalesSignals;
  bucket: SloganBucket;
  hasSalesEvidence: boolean;
}

export interface SloganCollections {
  topPicks: RankedSlogan[];
  boldPicks: RankedSlogan[];
  experimental: RankedSlogan[];
}

export interface SloganEngineResult {
  slogans: string[];
  ranked: RankedSlogan[];
  collections: SloganCollections;
  persona: string;
  personaKey: string;
  mode: string;
}

export interface SloganEngineInput {
  niche: string;
  audience?: string;
  style?: string;
  shirtSlogans?: unknown;
  imagePrompts?: unknown;
  salesSignals?: unknown;
  mode?: SloganMode;
}

type PatternFamily = "ATTITUDE" | "HUMOR" | "IDENTITY" | "CONTRAST" | "STATEMENT" | "MINIMAL_LABEL" | "IDENTITY_SIGNAL" | "RELATABLE_LOOP" | "SOCIAL_SIGNAL" | "LEGACY";

type EmotionCluster = {
  name: string;
  keywords: string[];
  weight: number;
};

type SloganCandidate = {
  text: string;
  family: PatternFamily;
  cluster?: string;
};

// ─── Elite Constants ─────────────────────────────────────────────────────────

const PATTERN_FAMILIES = {
  MINIMAL_LABEL: [
    "Pure [ANCHOR]",
    "[ANCHOR] Mode",
    "[ANCHOR] Energy",
    "Got [ANCHOR]?",
    "[ANCHOR] On",
  ],
  IDENTITY_SIGNAL: [
    "Built for [ANCHOR]",
    "[ANCHOR] Inside",
    "Real [ANCHOR] Energy",
    "Certified [ANCHOR]",
  ],
  RELATABLE_LOOP: [
    "Eat Sleep [ANCHOR] Repeat",
    "Just One More [ANCHOR]",
    "One More [ANCHOR], Then Sleep",
    "Can't Stop [ANCHOR]",
  ],
  SOCIAL_SIGNAL: [
    "[ANCHOR] People Get It",
    "Only [ANCHOR] People Know",
    "[ANCHOR] Insiders",
    "You Know [ANCHOR]",
  ],
  LEGACY: [
    "Only [ANCHOR] People Understand.",
    "Brought to you by [ANCHOR].",
    "It's a [ANCHOR] thing.",
    "Certified [ANCHOR] Addict",
    "Kinda a Big [ANCHOR].",
  ],
};

const PATTERN_WEIGHTS = {
  LEGACY: 0.15,
  MODERN: 0.55,
  CREATIVE: 0.30,
};

const EMOTION_SPECTRUM = {
  high_energy: ["feral", "obsessed", "locked-in", "unstoppable", "fierce", "clutch", "relentless"],
  mid_energy: ["focused", "into it", "dialed", "ready", "real", "true", "bold"],
  low_energy: ["recharging", "off-grid", "unbothered", "cozy", "warm", "soft-launch", "mellow"],
};

function pickEmotion(niche: string): string[] {
  const lower = niche.toLowerCase();
  if (/\b(gym|lift|run|fight|competitive|intensity|extreme|power|fast)\b/.test(lower)) {
    return EMOTION_SPECTRUM.high_energy;
  }
  if (/\b(camping|cozy|sleep|introvert|library|peace|calm|quiet|recharge|book)\b/.test(lower)) {
    return EMOTION_SPECTRUM.low_energy;
  }
  return EMOTION_SPECTRUM.mid_energy;
}

// ─── Personas ────────────────────────────────────────────────────────────────

interface PersonaProfile {
  key: string;
  label: string;
  keywords: string[];
  voice: string;
}

const PERSONAS: PersonaProfile[] = [
  {
    key: "christian_youth",
    label: "Christian Youth",
    keywords: ["faith", "god", "jesus", "church", "pray", "blessed", "grace", "worship", "bible", "lord", "christian", "cross", "holy"],
    voice: "faith-driven identity",
  },
  {
    key: "competitive_fan",
    label: "Competitive Fan",
    keywords: ["sports", "team", "game", "win", "champion", "fight", "fan", "player", "coach", "arena", "league", "score"],
    voice: "high-intensity tribal loyalty",
  },
  {
    key: "pet_parent",
    label: "Pet Parent",
    keywords: ["dog", "cat", "pet", "paw", "fur", "puppy", "kitten", "rescue", "adopt", "animal", "breed", "shelter", "fetch"],
    voice: "unconditional love and pride",
  },
  {
    key: "maker_hustler",
    label: "Maker & Hustler",
    keywords: ["hustle", "build", "grind", "create", "maker", "craft", "founder", "startup", "entrepreneur", "diy", "hack", "launch"],
    voice: "relentless creative ambition",
  },
  {
    key: "cozy_chaos",
    label: "Cozy Chaos",
    keywords: ["coffee", "sleep", "introvert", "cozy", "chaos", "nap", "quiet", "home", "comfy", "tired", "chill", "lazy", "sarcasm"],
    voice: "dry humor and self-aware comfort",
  },
  {
    key: "foodie_creator",
    label: "Foodie & Creator",
    keywords: ["chef", "recipe", "culinary", "barista", "latte", "espresso", "foodie", "pastry", "baking", "baker", "cook", "kitchen", "cooking", "brunch", "cafe", "roast", "brew"],
    voice: "passionate craft and flavour-first identity",
  },
  {
    key: "visual_creator",
    label: "Visual Creator",
    keywords: ["photography", "photographer", "camera", "lens", "filmmaker", "painting", "painter", "artist", "illustrat", "graphic design", "sketch", "draw", "portrait", "darkroom", "film photography"],
    voice: "artistic vision and creative pride",
  },
  {
    key: "wellness_seeker",
    label: "Wellness Seeker",
    keywords: ["yoga", "meditation", "mindfulness", "wellness", "zen", "gardening", "garden", "botanical", "herbalist", "pilates", "holistic", "crystals", "plant mom", "plant dad", "bloom"],
    voice: "intentional living and inner calm",
  },
  {
    key: "bookworm_educator",
    label: "Bookworm & Educator",
    keywords: ["bookworm", "reading", "library", "librarian", "teacher", "classroom", "bookclub", "literature", "bibliophile", "educator", "professor", "student", "novel", "book lover"],
    voice: "intellectual curiosity and quiet pride",
  },
  {
    key: "travel_adventurer",
    label: "Travel Adventurer",
    keywords: ["travel", "wanderlust", "backpacking", "nomad", "van life", "road trip", "passport", "roam", "explorer", "journey", "globetrotter"],
    voice: "freedom-driven wanderlust",
  },
  {
    key: "broad_market",
    label: "Broad Market",
    keywords: [],
    voice: "universal appeal and accessibility",
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const GENERIC_WORDS = new Set([
  "thing", "stuff", "great", "good", "nice", "cool", "awesome", "best", "amazing",
  "incredible", "more", "some", "many", "lot", "very", "really", "just", "only",
  "people", "person", "someone", "something", "everything", "anything", "nothing",
  "yes", "no", "okay", "ok", "sure", "fine", "well", "also", "too", "your", "our",
]);

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has",
  "had", "do", "does", "did", "will", "would", "could", "should", "may", "might",
  "shall", "can", "need", "dare", "ought", "used", "to", "of", "in", "for", "on",
  "with", "at", "by", "from", "about", "into", "through", "during", "before",
  "after", "above", "below", "up", "down", "out", "off", "over", "under", "again",
  "then", "once", "and", "but", "or", "nor", "so", "yet", "both", "either",
  "neither", "not", "even", "when", "where", "why", "how", "that", "this", "it",
  "its", "they", "them", "their", "what", "which", "who", "whom", "i", "me",
  "my", "myself", "we", "us", "our", "you", "he", "she", "his", "her",
]);

const NOISE_WORDS = new Set([
  "apparel", "clothing", "shirt", "shirts", "tee", "tees", "tshirt", "tshirts",
  "design", "designs", "gift", "gifts", "merch", "store", "trend", "trends",
  "men", "women", "boys", "girls", "guys", "ladies", "people", "person",
]);

// Hard bans for overused AI-cliché phrases that kill virality
const BANNED_PHRASES = [
  "zero stress",
  "no apologies",
  "state of mind",
  "all day",
  "unstoppable",
];

/**
 * Pure modifier adjectives that should NOT lead an identity-handle compound.
 * "funny dog" is a descriptor, not a wearable identity — "dog lover" is.
 * Adding a word here prevents it from being injected into template X slots.
 */
const MODIFIER_ADJECTIVES = new Set([
  "funny", "cute", "silly", "lazy", "crazy", "weird", "strange", "adorable",
  "pretty", "beautiful", "ugly", "big", "small", "tall", "short", "fast", "slow",
  "happy", "sad", "angry", "excited", "tired", "bored", "cool", "hot", "cold",
  "warm", "bright", "dark", "light", "heavy", "thin", "thick", "young", "old",
  "new", "fresh", "raw", "sweet", "sour", "spicy", "mild", "good", "bad",
  "great", "awful", "random", "extra", "basic", "top", "little", "tiny",
  "huge", "giant", "loud", "quiet", "quick", "rough", "soft", "hard", "easy",
  "cheap", "free", "rich", "poor", "busy", "late", "early",
]);

/** Returns true when a phrase is safe to use in an identity template slot. */
function isValidIdentityHandle(phrase: string): boolean {
  const trimmed = phrase.trim();
  if (!trimmed || trimmed.length < 3) return false;
  const firstWord = trimmed.toLowerCase().split(/\s+/)[0];
  // Reject adjective-first compounds — they describe objects, not people
  if (MODIFIER_ADJECTIVES.has(firstWord)) return false;
  // Reject single noise/stop words that slipped through
  if (STOP_WORDS.has(firstWord) && trimmed.split(/\s+/).length === 1) return false;
  return true;
}

const EMOTION_CLUSTERS: EmotionCluster[] = [
  { name: "UNBOTHERED", keywords: ["unbothered", "peace", "calm", "quiet", "low stress", "no plans"], weight: 1 },
  { name: "COZY", keywords: ["cozy", "warm", "comfort", "soft", "sleepy", "blanket"], weight: 1 },
  { name: "REBELLIOUS", keywords: ["feral", "chaos", "wild", "antisocial", "anti social", "off script"], weight: 1 },
  { name: "HUMOR", keywords: ["funny", "not people", "leave me alone", "zero plans", "sarcasm", "don't care"], weight: 1 },
  { name: "IDENTITY", keywords: ["introvert", "camper", "gamer", "maker", "pet parent", "dog mom", "dog dad"], weight: 1 },
  { name: "OFF_GRID", keywords: ["off the grid", "off-grid", "camp", "campfire", "outside", "stars", "forest"], weight: 1 },
];

void STOP_WORDS; // used indirectly via normalizeKeyword

// ─── Utilities ───────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Normalize raw component to 0-100 using static min/max
function normalizeScore(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return clamp(Math.round(((value - min) / (max - min)) * 100), 0, 100);
}

// Dynamic normalization across an array of numbers -> returns array of 0-100
function normalizeDynamic(values: number[]): number[] {
  if (!values || values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 50);
  return values.map((v) => clamp(Math.round(((v - min) / (max - min)) * 100), 0, 100));
}

// Stretching to increase separation of top scores
// Stretching to increase separation of top scores.
// Use exponent < 1 to slightly lift mid-range values (avoid collapsing everything low).
function stretchScore(score: number, exponent = 0.85): number {
  const s = clamp(score, 0, 100) / 100;
  return clamp(Math.round(Math.pow(s, exponent) * 100), 0, 100);
}

// Batch-normalize a RankedSlogan array using dynamic per-component normalization
function applyBatchNormalization(items: RankedSlogan[]): RankedSlogan[] {
  if (!items || items.length === 0) return items;
  const hooks = items.map((i) => i.hookScore || 0);
  const recognitions = items.map((i) => i.recognitionScore || 0);
  const emotions = items.map((i) => i.emotionScore || 0);
  const punches = items.map((i) => i.punchScore || 0);
  const wearabilities = items.map((i) => i.wearability || 0);
  const cleverness = items.map((i) => i.clevernessScore || 0);
  const market = items.map((i) => i.marketSignalScore || 0);

  const nh = normalizeDynamic(hooks);
  const nr = normalizeDynamic(recognitions);
  const ne = normalizeDynamic(emotions);
  const np = normalizeDynamic(punches);
  const nw = normalizeDynamic(wearabilities);
  const nc = normalizeDynamic(cleverness);
  const nm = normalizeDynamic(market);

  // Adjusted weights to emphasize hook and punch for catchier output
  const weights = {
    hook: 0.24,
    punch: 0.20,
    emotion: 0.18,
    wearability: 0.16,
    recognition: 0.12,
    cleverness: 0.06,
    market: 0.04,
  };

  return items.map((it, idx) => {
    const normalizedScore =
      nh[idx] * weights.hook +
      np[idx] * weights.punch +
      ne[idx] * weights.emotion +
      nw[idx] * weights.wearability +
      nr[idx] * weights.recognition +
      nc[idx] * weights.cleverness +
      nm[idx] * weights.market;

    const stretched = stretchScore(normalizedScore);
    const final = clamp(Math.round(stretched), 0, 100);
    return { ...it, score: final, finalScore: final } as RankedSlogan;
  });
}

// ─── Learning / Performance Helpers ───────────────────────────────────────

export interface SloganPerformanceRecord {
  id: string;
  slogan: string;
  niche: string;
  impressions: number;
  clicks: number;
  orders: number;
  revenue: number;
  ctr?: number;
  conversion?: number;
}

function computePerformanceScore(p: Partial<SloganPerformanceRecord> | SloganPerformanceRecord): number {
  const impressions = p.impressions || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;
  const revenue = p.revenue || 0;
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const conversion = clicks > 0 ? orders / clicks : 0;
  return clamp(Math.round((ctr * 0.4 + conversion * 0.4 + Math.min(revenue / 100, 1) * 0.2) * 100), 0, 100);
}

function extractPatternFeatures(slogan: string, niche?: string): Record<string, boolean> {
  const words = slogan.split(/\s+/).filter(Boolean);
  return {
    hasNumber: /\d/.test(slogan),
    shortLength: words.length <= 4,
    question: slogan.includes("?"),
    command: /^(stop|start|join|try|dare)/i.test(slogan),
    nicheWord: (niche && slogan.toLowerCase().includes(niche.toLowerCase())) || false,
    allCaps: /^[A-Z0-9\s]+$/.test(slogan),
    containsNegation: /\bnot\b|\bdon't\b|\bno\b/i.test(slogan),
  };
}

type PatternWeights = Record<string, number>;

function trainWeights(data: Array<Partial<SloganPerformanceRecord>>): PatternWeights {
  const weights: PatternWeights = {};
  for (const item of data) {
    const score = computePerformanceScore(item as SloganPerformanceRecord);
    const features = extractPatternFeatures(item.slogan || "");
    for (const key of Object.keys(features)) {
      if (!(key in weights)) weights[key] = 0;
      weights[key] += features[key] ? score : -score * 0.3;
    }
  }
  return weights;
}

async function loadPatternWeights(niche?: string): Promise<PatternWeights> {
  try {
    // Attempt to read a SloganPerformance table if available
    const where = niche ? { where: { niche: niche.trim().toLowerCase() } } : {} as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (prisma as any).sloganPerformance?.findMany?.(where) as any[] | undefined;
    if (rows && rows.length > 0) {
      return trainWeights(rows.map((r) => ({
        slogan: r.slogan,
        impressions: r.impressions,
        clicks: r.clicks,
        orders: r.orders,
        revenue: r.revenue,
      })));
    }
  } catch (_) { /* ignore if DB model not present */ }
  // Fallback: derive simple weights from existing sloganPattern table (if present)
  try {
    const prows = await prisma.sloganPattern.findMany({ where: { niche: niche?.trim().toLowerCase() || undefined }, take: 200 });
    if (prows && prows.length > 0) {
      // Map pattern success into simple features: presence of pattern words
      const pseudo: Partial<SloganPerformanceRecord>[] = prows.map((p: any) => ({
        slogan: p.pattern,
        impressions: Math.round((p.uses || 1) * 100),
        clicks: Math.round((p.score || 1) * 10),
        orders: Math.round((p.score || 1) * 2),
        revenue: Math.round((p.score || 1) * 5),
      }));
      return trainWeights(pseudo);
    }
  } catch (_) { /* ignore */ }
  return {};
}

function applyLearningBoost(slogan: string, baseScore: number, weights: PatternWeights, niche?: string): number {
  if (!weights || Object.keys(weights).length === 0) return baseScore;
  const features = extractPatternFeatures(slogan, niche);
  let boost = 0;
  for (const key of Object.keys(features)) {
    if (features[key] && weights[key]) {
      boost += weights[key] * 0.02; // slightly larger proportional influence
    }
  }
  return clamp(Math.round(baseScore + boost), 0, 100);
}

function applyExploration(score: number, explorationEpsilon = 0.1): number {
  if (Math.random() < explorationEpsilon) {
    return clamp(Math.round(score + Math.random() * 10), 0, 100);
  }
  return score;
}

async function getTopPerformingSlogans(niche?: string, limit = 5): Promise<string[]> {
  try {
    const rows = await (prisma as any).sloganPerformance?.findMany?.({ where: { niche: niche?.trim().toLowerCase() }, orderBy: { revenue: 'desc' }, take: limit }) as any[] | undefined;
    if (rows && rows.length > 0) return rows.map((r) => r.slogan).slice(0, limit);
  } catch (_) { /* ignore */ }
  // Fallback: try top patterns
  try {
    const patterns = await prisma.sloganPattern.findMany({ where: { niche: niche?.trim().toLowerCase() }, orderBy: { score: 'desc' }, take: limit });
    if (patterns && patterns.length > 0) return patterns.map((p: any) => p.pattern).slice(0, limit);
  } catch (_) { /* ignore */ }
  return [];
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanSlogan(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKeyword(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

function sanitizePhrase(value: string): string {
  return normalizeKeyword(value)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token) && !NOISE_WORDS.has(token))
    .join(" ")
    .trim();
}

// ─── Behavioral Trigger Engine (BTE) ──────────────────────────────────────
/**
 * Extract high-value behavioral signals for a niche to guide LLM pattern generation.
 * These are lightweight, hand-curated seeds — later we can learn them from sales data.
 */
export function extractBehaviorSignals(niche: string): string[] {
  const map: Record<string, string[]> = {
    pickleball: [
      "obsession with one more game",
      "inside joke: kitchen rule",
      "slang: dink, serve",
      "competitive banter",
      "addiction behavior",
    ],
    camping: [
      "escaping people",
      "loving silence",
      "off-grid pride",
      "roughing it joy",
      "campfire rituals",
    ],
  };

  return map[niche?.toLowerCase()?.trim?.() ?? ""] || [];
}

/**
 * Simple human-voice filter to remove robotic or overly template-like outputs.
 */
export function isHumanPhrase(s: string): boolean {
  if (!s || !s.trim()) return false;
  const trimmed = s.trim();
  // Prefer short, punchy, conversational lines — or lines with punctuation that feel human
  if (/[!?\.]/.test(trimmed)) return true;
  if (trimmed.split(/\s+/).length <= 6) return true;
  // Reject long multi-clause templates
  if (trimmed.split(/[,.;]/).length > 2 && trimmed.split(/\s+/).length > 8) return false;
  return true;
}

/**
 * Compute a lightweight conversational score that rewards human-sounding triggers.
 */
export function computeConversationalScore(s: string): number {
  if (!s) return 0;
  const lower = s.toLowerCase();
  let score = 0;
  if (/\bjust one more\b/.test(lower)) score += 10;
  if (/\bsorry\b|\bmy bad\b|\bomg\b|\bwhoops\b/.test(lower)) score += 8;
  if (/\bhappens\b|\bdink\b|\bserve\b|\bkitchen\b/.test(lower)) score += 6;
  if (/[!?]/.test(s)) score += 4;
  if (s.split(/\s+/).length <= 5) score += 3;
  return clamp(score, 0, 25);
}

function dedupeStrings(arr: string[]): string[] {
  const seen = new Set<string>();
  return arr.filter((s) => {
    const k = s.toLowerCase().trim();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function normalizeMode(mode?: unknown): SloganMode {
  if (mode === "viral" || mode === "edgy") return mode;
  return "safe";
}

function normalizeStrings(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string").map((v) => v.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/\n|,/).map((v) => v.trim()).filter(Boolean);
  return [];
}

function normalizeSalesSignals(value: unknown): SalesSignals {
  if (!value || typeof value !== "object") return {};
  return value as SalesSignals;
}

// ─── Niche-Dynamic Generation ─────────────────────────────────────────────────

interface NicheLexicon {
  seed: number;
  tokens: string[];
  anchors: string[];
  audienceTerms: string[];
  signalTerms: string[];
  emotionWords: string[];
  actionWords: string[];
  valueWords: string[];
  modifierWords: string[];
  emphasisWords: string[];
}

type NicheContext = {
  scenes: string[];
  activities: string[];
  contrastTargets: string[];
  payoffWords: string[];
  identityHandles: string[];
};

type ClusterSelection = {
  dominantEmotion: string;
  dominantLifestyle: string;
  dominantIdentity: string;
  humorAngle: string;
};

function extractMeaningfulTokens(value: string): string[] {
  return dedupeStrings(
    sanitizePhrase(value)
      .split(/\s+/)
      .filter((token) => token.length > 2),
  );
}

function buildCompounds(tokens: string[]): string[] {
  const compounds: string[] = [];
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const pair = `${tokens[index]} ${tokens[index + 1]}`.trim();
    if (pair.split(/\s+/).length === 2) compounds.push(pair);
  }
  return dedupeStrings(compounds);
}

function pickOne<T>(values: T[], seed: number, fallback: T): T {
  if (values.length === 0) return fallback;
  return pickByHash(values, 1, seed)[0] ?? fallback;
}

function buildPersonaLexicon(personaKey: string, mode: SloganMode): Omit<NicheLexicon, "seed" | "tokens" | "anchors" | "audienceTerms" | "signalTerms"> {
  const broad = {
    emotionWords: ["bold", "real", "proud", "locked in", "fearless", "all in", "fully on"],
    actionWords: ["backing", "building", "chasing", "living", "wearing", "moving", "owning"],
    valueWords: ["identity", "focus", "energy", "signal", "mindset", "standard"],
    modifierWords: ["daily", "full-time", "pure", "true", "native", "certified"],
    emphasisWords: mode === "edgy" ? ["raw", "loud", "zero-filter", "off-script"] : mode === "viral" ? ["main-character", "headline", "scroll-stopping", "instant"] : ["clean", "classic", "easy", "wearable"],
  };

  const personaMap: Record<string, typeof broad> = {
    christian_youth: {
      emotionWords: ["called", "faithful", "redeemed", "unshaken", "devoted", "grace-filled"],
      actionWords: ["walking", "trusting", "living", "standing", "carrying", "holding"],
      valueWords: ["grace", "truth", "hope", "purpose", "light", "conviction"],
      modifierWords: ["steady", "anchored", "daily", "wholehearted", "scripture-first", "unmoved"],
      emphasisWords: broad.emphasisWords,
    },
    competitive_fan: {
      emotionWords: ["fierce", "clutch", "relentless", "hungry", "unstoppable", "dialed-in"],
      actionWords: ["winning", "pressing", "chasing", "closing", "backing", "finishing"],
      valueWords: ["edge", "momentum", "loyalty", "pressure", "dominance", "focus"],
      modifierWords: ["game-day", "all-gas", "full-send", "elite", "locked", "underdog"],
      emphasisWords: broad.emphasisWords,
    },
    pet_parent: {
      emotionWords: ["devoted", "soft-hearted", "protective", "obsessed", "wholehearted", "loyal"],
      actionWords: ["spoiling", "rescuing", "walking", "cuddling", "choosing", "carrying"],
      valueWords: ["love", "loyalty", "comfort", "joy", "bond", "cuddles"],
      modifierWords: ["paw-first", "fur-covered", "tail-wag", "cozy", "adoption", "ride-or-die"],
      emphasisWords: broad.emphasisWords,
    },
    maker_hustler: {
      emotionWords: ["driven", "obsessive", "visionary", "sharp", "restless", "committed"],
      actionWords: ["building", "shipping", "testing", "making", "launching", "grinding"],
      valueWords: ["craft", "proof", "systems", "ownership", "velocity", "output"],
      modifierWords: ["founder-grade", "prototype", "late-night", "self-made", "maker", "first-draft"],
      emphasisWords: broad.emphasisWords,
    },
    cozy_chaos: {
      emotionWords: ["unbothered", "sleepy", "chaotic", "cozy", "under-caffeinated", "peaceful"],
      actionWords: ["recovering", "canceling", "recharging", "coasting", "avoiding", "nesting"],
      valueWords: ["comfort", "quiet", "blankets", "snacks", "peace", "softness"],
      modifierWords: ["blanket-level", "indoorsy", "low-battery", "weekend", "soft-launch", "couch-side"],
      emphasisWords: broad.emphasisWords,
    },
    foodie_creator: {
      emotionWords: ["obsessed", "flavour-driven", "devoted", "craft-first", "passionate", "hands-on"],
      actionWords: ["crafting", "plating", "brewing", "baking", "tasting", "creating"],
      valueWords: ["craft", "flavour", "texture", "warmth", "ritual", "mastery"],
      modifierWords: ["from-scratch", "small-batch", "slow-roast", "artisan", "hand-crafted", "kitchen-first"],
      emphasisWords: broad.emphasisWords,
    },
    visual_creator: {
      emotionWords: ["visionary", "detail-obsessed", "expressive", "sharp-eyed", "intentional", "inspired"],
      actionWords: ["shooting", "capturing", "composing", "creating", "framing", "building"],
      valueWords: ["light", "frame", "story", "perspective", "vision", "craft"],
      modifierWords: ["golden-hour", "analog", "raw", "frame-by-frame", "one-shot", "studio-grade"],
      emphasisWords: broad.emphasisWords,
    },
    wellness_seeker: {
      emotionWords: ["grounded", "intentional", "rooted", "present", "balanced", "at-peace"],
      actionWords: ["breathing", "growing", "healing", "tending", "flowing", "centering"],
      valueWords: ["stillness", "roots", "growth", "alignment", "bloom", "harmony"],
      modifierWords: ["slow-living", "soil-first", "root-deep", "sunrise", "daily-ritual", "bloom-mode"],
      emphasisWords: broad.emphasisWords,
    },
    bookworm_educator: {
      emotionWords: ["curious", "deep-thinking", "bookish", "deliberate", "sharp", "invested"],
      actionWords: ["reading", "annotating", "teaching", "learning", "exploring", "discovering"],
      valueWords: ["knowledge", "story", "chapter", "wisdom", "perspective", "page"],
      modifierWords: ["dog-eared", "late-night", "marginalia", "one-more-chapter", "well-read", "classroom-ready"],
      emphasisWords: broad.emphasisWords,
    },
    travel_adventurer: {
      emotionWords: ["restless", "free-spirited", "fearless", "wide-eyed", "untethered", "hungry"],
      actionWords: ["roaming", "chasing", "discovering", "moving", "exploring", "leaving"],
      valueWords: ["freedom", "horizon", "story", "distance", "wanderlust", "momentum"],
      modifierWords: ["carry-on", "one-way", "off-map", "sunrise-first", "no-itinerary", "anywhere-but-here"],
      emphasisWords: broad.emphasisWords,
    },
    broad_market: broad,
  };

  return personaMap[personaKey] ?? broad;
}

function nicheHash(niche: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < niche.length; i++) {
    h ^= niche.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

function pickByHash<T>(arr: T[], count: number, seed: number): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  let s = seed;
  while (result.length < count && result.length < arr.length) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const idx = s % arr.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

function buildNicheLexicon(input: SloganEngineInput, persona: PersonaProfile, mode: SloganMode): NicheLexicon {
  const nichePhrase = sanitizePhrase(input.niche);
  const nicheTokens = extractMeaningfulTokens(nichePhrase);
  const audiencePhrase = sanitizePhrase(input.audience || "");
  const audienceTokens = extractMeaningfulTokens(audiencePhrase);
  const audienceTerms = dedupeStrings([
    audiencePhrase,
    ...buildCompounds(audienceTokens),
  ]).filter((value) => value.split(/\s+/).length >= 2 && value.split(/\s+/).length <= 3);
  const signalTerms = normalizeSalesSignals(input.salesSignals).topKeywords
    ?.flatMap((keyword) => extractMeaningfulTokens(sanitizePhrase(keyword)))
    .slice(0, 8) ?? [];
  const compounds = buildCompounds(nicheTokens);
  const phraseAnchors = dedupeStrings([
    nichePhrase,
    ...compounds,
  ]).filter((value) => value && value.split(/\s+/).length >= 2 && value.split(/\s+/).length <= 3);
  const fallbackSingleAnchors = phraseAnchors.length === 0
    ? nicheTokens.filter((token) => token.length >= 5)
    : [];
  const rankedAnchors = dedupeStrings([
    ...phraseAnchors,
    ...fallbackSingleAnchors,
  ]);
  const anchors = dedupeStrings([
    ...rankedAnchors,
    ...(rankedAnchors.length === 0 ? signalTerms.slice(0, 2).filter((value) => value.length >= 5) : []),
  ]);

  const personaLexicon = buildPersonaLexicon(persona.key, mode);
  const seed = nicheHash(`${input.niche}|${input.audience || ""}|${mode}`);

  return {
    seed,
    tokens: nicheTokens,
    anchors: anchors.length > 0 ? anchors : [nichePhrase || input.niche.toLowerCase().trim()],
    audienceTerms,
    signalTerms: dedupeStrings(signalTerms),
    emotionWords: pickByHash(personaLexicon.emotionWords, 5, seed + 11),
    actionWords: pickByHash(personaLexicon.actionWords, 5, seed + 23),
    valueWords: pickByHash(personaLexicon.valueWords, 4, seed + 31),
    modifierWords: pickByHash(personaLexicon.modifierWords, 5, seed + 43),
    emphasisWords: pickByHash(personaLexicon.emphasisWords, 4, seed + 59),
  };
}

function deriveNicheIdentities(niche: string, persona?: string): string[] {
  const profile = PERSONAS.find((candidate) => candidate.key === persona) ?? PERSONAS[PERSONAS.length - 1];
  const lexicon = buildNicheLexicon({ niche }, profile, "safe");
  const anchors = (lexicon.anchors.filter((anchor) => anchor.split(/\s+/).length >= 2).slice(0, 4).length > 0
    ? lexicon.anchors.filter((anchor) => anchor.split(/\s+/).length >= 2).slice(0, 4)
    : lexicon.anchors.slice(0, 2));
  return dedupeStrings([
    ...anchors,
    ...anchors.map((anchor, index) => `${pickOne(lexicon.modifierWords, lexicon.seed + index, "true")} ${anchor}`),
  ]).slice(0, 6);
}

function deriveNicheEmotions(niche: string, persona?: string): string[] {
  const profile = PERSONAS.find((candidate) => candidate.key === persona) ?? PERSONAS[PERSONAS.length - 1];
  return buildNicheLexicon({ niche }, profile, "safe").emotionWords;
}

function detectWinningClusters(
  niche: string,
  audience: string | undefined,
  lexicon: NicheLexicon,
  signals: SalesSignals,
  persona: PersonaProfile,
): EmotionCluster[] {
  const haystack = [
    niche,
    audience || "",
    persona.voice,
    ...lexicon.anchors,
    ...lexicon.emotionWords,
    ...lexicon.signalTerms,
    ...(signals.topKeywords || []),
  ].join(" ").toLowerCase();

  return EMOTION_CLUSTERS
    .map((cluster) => {
      const keywordHits = cluster.keywords.reduce((count, keyword) => {
        return haystack.includes(keyword.toLowerCase()) ? count + 1 : count;
      }, 0);
      const personaBias = persona.key === "cozy_chaos" && ["UNBOTHERED", "COZY", "HUMOR"].includes(cluster.name)
        ? 0.35
        : persona.key === "competitive_fan" && cluster.name === "REBELLIOUS"
          ? 0.2
          : 0;
      return {
        ...cluster,
        weight: cluster.weight + keywordHits * 0.5 + personaBias,
      };
    })
    .sort((a, b) => b.weight - a.weight);
}

function clusterLeadKeyword(cluster: EmotionCluster | undefined, fallback: string): string {
  if (!cluster) return fallback;
  return cluster.keywords[0] ?? fallback;
}

function selectClusterAngles(
  clusters: EmotionCluster[],
  lexicon: NicheLexicon,
  context: NicheContext,
): ClusterSelection {
  const topClusters = clusters.slice(0, 3);
  const emotionCluster = topClusters.find((cluster) => ["UNBOTHERED", "COZY", "REBELLIOUS"].includes(cluster.name));
  const lifestyleCluster = topClusters.find((cluster) => cluster.name === "OFF_GRID") ?? topClusters[0];
  const identityCluster = topClusters.find((cluster) => cluster.name === "IDENTITY");
  const humorCluster = topClusters.find((cluster) => cluster.name === "HUMOR");

  return {
    dominantEmotion: toLowerPhrase(clusterLeadKeyword(emotionCluster, lexicon.emotionWords[0] ?? "unbothered")).replace(/\s+/g, "-"),
    dominantLifestyle: toLowerPhrase(clusterLeadKeyword(lifestyleCluster, context.scenes[0] ?? "off the clock")).replace(/^off the grid$/, "off-grid"),
    dominantIdentity: toLowerPhrase(clusterLeadKeyword(identityCluster, context.identityHandles[0] ?? lexicon.anchors[0] ?? "my lane")).replace(/^pet parent$/, "pet person"),
    humorAngle: toLowerPhrase(clusterLeadKeyword(humorCluster, context.contrastTargets[0] ?? "small talk")),
  };
}

function buildFragmentBuckets(lexicon: NicheLexicon): Record<string, string[]> {
  const strongAnchors = lexicon.anchors.filter((value) => value.split(/\s+/).length >= 2);
  const anchorPool = strongAnchors.length > 0 ? strongAnchors : lexicon.anchors;

  const identity = dedupeStrings([
    ...anchorPool,
    ...anchorPool.flatMap((anchor, index) => [
      `${pickOne(lexicon.modifierWords, lexicon.seed + index, "true")} ${anchor}`,
      `${anchor} ${pickOne(lexicon.valueWords, lexicon.seed + index + 7, "mindset")}`,
    ]),
  ]).filter((value) => value.split(/\s+/).length <= 4);

  const emotion = dedupeStrings([
    ...lexicon.emotionWords,
    ...lexicon.emotionWords.flatMap((word, index) => {
      const anchor = pickOne(anchorPool, lexicon.seed + index + 13, anchorPool[0] ?? "identity");
      return [`${word} ${anchor}`, `${anchor} ${word}`];
    }),
  ]).filter((value) => value.split(/\s+/).length <= 4);

  const motion = dedupeStrings([
    ...lexicon.actionWords.flatMap((word, index) => {
      const anchor = pickOne(anchorPool, lexicon.seed + index + 29, anchorPool[0] ?? "identity");
      const value = pickOne(lexicon.valueWords, lexicon.seed + index + 37, "energy");
      return [`${word} ${anchor}`, `${word} ${value}`];
    }),
  ]).filter((value) => value.split(/\s+/).length <= 4);

  const audience = dedupeStrings(
    lexicon.audienceTerms.flatMap((term, index) => {
      const anchor = pickOne(anchorPool, lexicon.seed + index + 41, anchorPool[0] ?? "identity");
      const emotion = pickOne(lexicon.emotionWords, lexicon.seed + index + 47, "bold");
      return [`${term} ${anchor}`, `${term} ${emotion}`];
    }),
  ).filter((value) => value.split(/\s+/).length <= 4);

  const signal = dedupeStrings([
    ...lexicon.signalTerms,
    ...lexicon.signalTerms.flatMap((term, index) => {
      const emphasis = pickOne(lexicon.emphasisWords, lexicon.seed + index + 53, "wearable");
      return [`${emphasis} ${term}`, `${term} ${emphasis}`];
    }),
  ]).filter((value) => value.split(/\s+/).length <= 4);

  const emphasis = dedupeStrings([
    ...lexicon.emphasisWords,
    ...lexicon.valueWords.map((value, index) => `${pickOne(lexicon.emphasisWords, lexicon.seed + index + 67, "clean")} ${value}`),
  ]).filter((value) => value.split(/\s+/).length <= 3);

  return { identity, emotion, motion, audience, signal, emphasis };
}


function renderHumorObject(scene: string, activity: string, identity: string): string {
  const lowerScene = normalizeKeyword(scene);
  if (lowerScene.includes("stars") || lowerScene.includes("fire")) return "campfires";
  if (lowerScene.includes("off the grid")) return "off-grid life";
  if (lowerScene.includes("game night")) return "game night";
  if (lowerScene.includes("couch")) return "the couch";
  if (lowerScene.includes("at home")) return "staying home";

  const lowerActivity = normalizeKeyword(activity);
  if (lowerActivity.includes("walking the dog")) return "dog walks";
  if (lowerActivity.includes("rolling dice")) return "rolling dice";
  if (lowerActivity.includes("playing to win")) return "winning";
  if (lowerActivity.includes("sleeping outside")) return "sleeping outside";
  if (lowerActivity.includes("camping")) return "camping";

  return toLowerPhrase(identity);
}

function normalizeContrastTarget(target: string): string {
  const lower = toLowerPhrase(target);
  if (lower === "other plans") return "plans";
  if (lower === "group chats") return "group chats";
  if (lower === "city noise") return "city noise";
  if (lower === "small talk") return "small talk";
  if (lower === "people") return "people";
  return lower;
}

function buildAttitudeCandidates(
  lexicon: NicheLexicon,
  context: NicheContext,
  clusters: ClusterSelection,
): SloganCandidate[] {
  const emotion = toLowerPhrase(pickOne(lexicon.emotionWords, lexicon.seed + 601, clusters.dominantEmotion));
  const contrast = normalizeContrastTarget(pickOne(context.contrastTargets, lexicon.seed + 607, clusters.humorAngle));
  const payoff = toBaseVerb(pickOne(context.payoffWords, lexicon.seed + 613, "care"));

  return [
    { text: `Too ${emotion} for ${contrast}.`, family: "ATTITUDE", cluster: clusters.dominantEmotion },
    { text: `${toDisplayPhrase(emotion)} with zero ${contrast}.`, family: "ATTITUDE", cluster: clusters.dominantEmotion },
    { text: `No ${toDisplayPhrase(contrast)}. No problem.`, family: "ATTITUDE", cluster: clusters.dominantEmotion },
    { text: `Too ${emotion} to ${payoff}.`, family: "ATTITUDE", cluster: clusters.dominantEmotion },
  ];
}

function buildHumorCandidates(
  lexicon: NicheLexicon,
  context: NicheContext,
  clusters: ClusterSelection,
): SloganCandidate[] {
  const identity = pickOne(context.identityHandles, lexicon.seed + 619, lexicon.anchors[0] ?? clusters.dominantIdentity);
  const scene = pickOne(context.scenes, lexicon.seed + 631, clusters.dominantLifestyle);
  const activity = pickOne(context.activities, lexicon.seed + 641, deriveActivityFromNiche(identity));
  const contrast = normalizeContrastTarget(pickOne(context.contrastTargets, lexicon.seed + 647, "people"));
  const humorObject = renderHumorObject(scene, activity, identity);

  const isIntrovertNiche = /introvert|sarcasm|social|cozy|nap|coffee|quiet|chaos/.test(
    `${clusters.humorAngle} ${identity.toLowerCase()}`
  );
  const humorLine4 = isIntrovertNiche
    ? `${toDisplayPhrase(identity)}. Social battery unavailable.`
    : `${toDisplayPhrase(identity)}. No apologies.`;

  return [
    { text: `Here for ${humorObject}, not ${contrast}.`, family: "HUMOR", cluster: clusters.humorAngle },
    { text: `Came for ${humorObject}, not ${contrast}.`, family: "HUMOR", cluster: clusters.humorAngle },
    { text: `Leave me alone. I'm ${toLowerPhrase(activity)}.`, family: "HUMOR", cluster: clusters.humorAngle },
    { text: humorLine4, family: "HUMOR", cluster: clusters.humorAngle },
  ];
}

function buildIdentityCandidates(
  lexicon: NicheLexicon,
  context: NicheContext,
  clusters: ClusterSelection,
): SloganCandidate[] {
  const identity = toDisplayPhrase(pickOne(context.identityHandles, lexicon.seed + 653, lexicon.anchors[0] ?? clusters.dominantIdentity));
  const emotion = toLowerPhrase(pickOne(lexicon.emotionWords, lexicon.seed + 659, clusters.dominantEmotion));

  return [
    { text: `${identity} state of mind.`, family: "IDENTITY", cluster: clusters.dominantIdentity },
    { text: `${identity} looks good on me.`, family: "IDENTITY", cluster: clusters.dominantIdentity },
    { text: `${identity}. On purpose.`, family: "IDENTITY", cluster: clusters.dominantIdentity },
    { text: `${toDisplayPhrase(emotion)} is the whole personality.`, family: "IDENTITY", cluster: clusters.dominantEmotion },
  ];
}

function buildContrastCandidates(
  lexicon: NicheLexicon,
  context: NicheContext,
  clusters: ClusterSelection,
): SloganCandidate[] {
  const identity = toDisplayPhrase(pickOne(context.identityHandles, lexicon.seed + 661, lexicon.anchors[0] ?? clusters.dominantIdentity));
  const scene = toDisplayPhrase(pickOne(context.scenes, lexicon.seed + 673, clusters.dominantLifestyle));
  const contrast = normalizeContrastTarget(pickOne(context.contrastTargets, lexicon.seed + 677, clusters.humorAngle));
  const humorObject = renderHumorObject(scene, context.activities[0] ?? "living", identity);

  return [
    { text: `${scene} > ${toDisplayPhrase(contrast)}.`, family: "CONTRAST", cluster: clusters.dominantLifestyle },
    { text: `${identity} > ${toDisplayPhrase(contrast)}.`, family: "CONTRAST", cluster: clusters.dominantIdentity },
    { text: `${toDisplayPhrase(scene)}. No ${contrast}.`, family: "CONTRAST", cluster: clusters.dominantLifestyle },
    { text: `Less ${contrast}. More ${humorObject}.`, family: "CONTRAST", cluster: clusters.dominantLifestyle },
  ];
}

function buildStatementCandidates(
  lexicon: NicheLexicon,
  context: NicheContext,
  clusters: ClusterSelection,
): SloganCandidate[] {
  const identity = toDisplayPhrase(pickOne(context.identityHandles, lexicon.seed + 683, lexicon.anchors[0] ?? clusters.dominantIdentity));
  const emotion = toDisplayPhrase(pickOne(lexicon.emotionWords, lexicon.seed + 691, clusters.dominantEmotion));
  const contrast = toDisplayPhrase(normalizeContrastTarget(pickOne(context.contrastTargets, lexicon.seed + 701, clusters.humorAngle)));

  return [
    { text: `${emotion}. No ${contrast}. No problem.`, family: "STATEMENT", cluster: clusters.dominantEmotion },
    { text: `${identity}. Zero ${contrast.toLowerCase()}.`, family: "STATEMENT", cluster: clusters.dominantIdentity },
    { text: `${toDisplayPhrase(clusters.dominantLifestyle)}. On purpose.`, family: "STATEMENT", cluster: clusters.dominantLifestyle },
    { text: `${emotion}. Different priorities.`, family: "STATEMENT", cluster: clusters.dominantEmotion },
  ];
}

function detectPatternFamily(slogan: string): PatternFamily {
  const lower = slogan.toLowerCase();
  if (/^too\s+.+\s+to\s+|^too\s+.+\s+for\s+/.test(lower) || /^no\s+.+\.\s+no problem/.test(lower)) return "ATTITUDE";
  if (/\bhere for\b|\bcame for\b|\bleave me alone\b|\bnot conversation\b|\bnot people\b/.test(lower)) return "HUMOR";
  if (/>|\bless\s+.+\s+more\s+.+\b|\boutside\.\s+peace inside\b/.test(lower)) return "CONTRAST";
  if (/\bstate of mind\b|\blooks good on me\b|\bon purpose\b|\bwhole personality\b/.test(lower)) return "IDENTITY";
  return "STATEMENT";
}

function structureSignature(slogan: string): string {
  const lower = slogan.toLowerCase().trim();
  if (/^too\s+.+\s+to\s+.+/.test(lower)) return "too_x_to_y";
  if (/^too\s+.+\s+for\s+.+/.test(lower)) return "too_x_for_y";
  if (/^here for\s+.+,\s+not\s+.+/.test(lower)) return "here_for_x_not_y";
  if (/^came for\s+.+,\s+not\s+.+/.test(lower)) return "came_for_x_not_y";
  if (/^no\s+.+\.\s+no problem\.?$/.test(lower)) return "no_x_no_problem";
  if (/^.+\s+>\s+.+$/.test(lower)) return "x_gt_y";
  if (/^leave me alone\./.test(lower)) return "leave_me_alone";
  if (/^.+\.\s+zero\s+.+$/.test(lower)) return "x_zero_y";
  if (/^wild outside\.\s+peace inside\.?$/.test(lower)) return "outside_inside";
  if (/^.+\s+state of mind\.?$/.test(lower)) return "state_of_mind";
  return lower.replace(/[a-z0-9]+/g, "x").replace(/\s+/g, " ").trim();
}

/**
 * Structural fingerprint for cross-slogan similarity detection.
 * Goes deeper than structureSignature: replaces identity nouns, emotion
 * adjectives, and action verbs so structurally identical templates
 * ("Built for climbers" / "Built for moms") produce the same key.
 */
function patternFingerprint(slogan: string): string {
  return slogan
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    // Common identity nouns
    .replace(/\b(climber|climbers|mom|moms|dad|dads|nurse|nurses|teacher|teachers|chef|chefs|doctor|doctors|maker|makers|runner|runners|gamer|gamers|baker|bakers|artist|artists|reader|readers|traveler|travelers|yogi|yogis|coder|coders|founder|founders|creator|creators)\b/g, "[IDENTITY]")
    // Strong emotion adjectives
    .replace(/\b(proud|bold|fearless|relentless|unstoppable|devoted|obsessed|passionate|driven|focused|grounded|rooted|real|true|wild|chaotic|cozy|sleepy|unbothered|hungry|restless)\b/g, "[EMOTION]")
    // Action verbs
    .replace(/\b(run|runs|running|climb|climbs|climbing|cook|cooks|cooking|build|builds|building|create|creates|creating|teach|teaches|teaching|brew|brews|brewing|read|reads|reading|write|writes|writing|shoot|shoots|shooting|roam|roams|roaming)\b/g, "[ACTION]")
    // Generic scaffold starters
    .replace(/^built for/, "SCAFFOLD_FOR")
    .replace(/^made for/, "SCAFFOLD_FOR")
    .replace(/^here for/, "SCAFFOLD_HERE")
    .replace(/^came for/, "SCAFFOLD_HERE")
    .replace(/^this is my/, "SCAFFOLD_MINE")
    .replace(/^i am/, "SCAFFOLD_IAM")
    .replace(/^i do/, "SCAFFOLD_IDO")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Score how niche-specific a slogan is.
 * Generic slogans score low; slogans with at least one community-specific
 * word unavoidable in that niche score higher.
 */
function computeNicheSpecificity(slogan: string, niche: string): number {
  const lower = slogan.toLowerCase();
  const nicheWords = niche.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  let hits = 0;
  for (const word of nicheWords) {
    if (lower.includes(word)) hits++;
  }
  // 0 niche words → 0 bonus; 1 → 10; 2+ → 18
  if (hits === 0) return 0;
  if (hits === 1) return 10;
  return 18;
}

/**
 * Penalise slogans whose structural fingerprint has already been seen.
 * Returns a -12 deduction when the slogan is a structural duplicate.
 */
function computeNoveltyBonus(slogan: string, usedFingerprints: Set<string>): number {
  const fp = patternFingerprint(slogan);
  if (usedFingerprints.has(fp)) return -12;
  usedFingerprints.add(fp);
  return 0;
}

/**
 * Measure direct emotional intensity based on high-signal words.
 */
function computeEmotionalIntensity(slogan: string): number {
  const lower = slogan.toLowerCase();
  let score = 0;
  if (/\b(obsessed|devoted|relentless|unstoppable|fearless|unapologetic|fierce|raw|fire|wild)\b/.test(lower)) score += 12;
  if (/\b(love|hate|proud|real|soul|born|true|heart|broke|alive|free|rise)\b/.test(lower)) score += 8;
  if (/[!]/.test(slogan)) score += 4;
  return Math.min(score, 20);
}

function computeClusterAlignment(slogan: string, clusters: EmotionCluster[]): number {
  const lower = slogan.toLowerCase();
  let score = 0;
  for (const cluster of clusters.slice(0, 3)) {
    const matched = cluster.keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
    if (matched) score += cluster.weight * 8;
  }
  return clamp(Math.round(score), 0, 28);
}

function computeViralReadiness(slogan: string): number {
  const lower = slogan.toLowerCase();
  let score = 0;
  if (slogan.length <= 40) score += 8;
  if (/\bnot\b|\bdon't\b|\bno\b|>/.test(lower)) score += 9;
  if (/[!?]/.test(slogan)) score += 4;
  if (/\bi\b|\bme\b|\bmy\b|\bi'm\b/.test(lower)) score += 7;
  if (slogan.split(/\s+/).length <= 7) score += 7;
  return clamp(score, 0, 25);
}

/**
 * Detect overly generic branding-style lines (e.g. "X Mode", "X Energy").
 * These should be removed before final ranking.
 */
export function isTooGeneric(s: string): boolean {
  if (!s || !s.trim()) return true;
  return /^[A-Z][a-z]+\s+(mode|energy|life|vibes)$/i.test(s.trim());
}

function scoreCandidate(text: string, clusters: EmotionCluster[]): number {
  const cleaned = cleanupPhrase(text);
  const wordCount = cleaned.split(/\s+/).length;
  let score = computeViralReadiness(cleaned) + computeClusterAlignment(cleaned, clusters);
  if (wordCount <= 6) score += 6;
  if (/\bnot people\b|\bno problem\b|\bzero\b|>/.test(cleaned.toLowerCase())) score += 4;
  if (/\btoo\s+.+\s+to\s+care\b/.test(cleaned.toLowerCase())) score -= 4;
  return score;
}

function enforcePatternDiversity(
  candidates: SloganCandidate[],
  lexicon: NicheLexicon,
  clusters: EmotionCluster[],
): SloganCandidate[] {
  const usedSignatures = new Set<string>();
  const familyCounts = new Map<PatternFamily, number>();
  const sorted = [...candidates].sort((a, b) => scoreCandidate(b.text, clusters) - scoreCandidate(a.text, clusters));
  const kept: SloganCandidate[] = [];

  for (const candidate of sorted) {
    const cleaned = humanizeSloganCandidate(candidate.text, lexicon);
    if (!cleaned || isAwkwardPhrase(cleaned, lexicon)) continue;
    const signature = structureSignature(cleaned);
    const familyLimit = candidate.family === "ATTITUDE" ? 2 : 3;
    const familyCount = familyCounts.get(candidate.family) ?? 0;
    if (usedSignatures.has(signature) || familyCount >= familyLimit) continue;
    usedSignatures.add(signature);
    familyCounts.set(candidate.family, familyCount + 1);
    kept.push({ ...candidate, text: cleaned });
  }

  return kept;
}

function buildPatternFamilyCandidates(
  lexicon: NicheLexicon,
  context: NicheContext,
  clusters: EmotionCluster[],
): SloganCandidate[] {
  const angles = selectClusterAngles(clusters, lexicon, context);
  const grouped: Record<PatternFamily, SloganCandidate[]> = {
    ATTITUDE: [],
    HUMOR: [],
    IDENTITY: [],
    CONTRAST: [],
    STATEMENT: [],
    MINIMAL_LABEL: [],
    IDENTITY_SIGNAL: [],
    RELATABLE_LOOP: [],
    SOCIAL_SIGNAL: [],
    LEGACY: [],
  };

  const familyOrder: PatternFamily[] = [
    "ATTITUDE", "HUMOR", "IDENTITY", "CONTRAST", "STATEMENT",
    "MINIMAL_LABEL", "IDENTITY_SIGNAL", "RELATABLE_LOOP", "SOCIAL_SIGNAL", "LEGACY"
  ];

  const anchor = lexicon.anchors[0] ?? "identity";
  
  // Inject Elite Behavioral Patterns using strategic weights
  for (const [fName, templates] of Object.entries(PATTERN_FAMILIES)) {
    const family = fName as PatternFamily;
    const template = pickOne(templates, lexicon.seed + family.length, templates[0]);
    
    // Scale Legacy patterns according to PATTERN_WEIGHTS.LEGACY (0.15)
    // In our interleaved pooling, they naturally represent a fraction.
    grouped[family].push({
      text: template.replace(/\[ANCHOR\]/g, toDisplayPhrase(anchor)),
      family,
    });
  }

  const interleaved: SloganCandidate[] = [];
  const maxLength = Math.max(...familyOrder.map((family) => grouped[family].length));

  for (let index = 0; index < maxLength; index += 1) {
    for (const family of familyOrder) {
      const candidate = grouped[family][index];
      if (candidate) interleaved.push(candidate);
    }
  }

  return enforcePatternDiversity(interleaved, lexicon, clusters);
}

function toLowerPhrase(value: string): string {
  return value.trim().toLowerCase();
}

function toDisplayPhrase(value: string): string {
  const lower = toLowerPhrase(value);
  if (!lower) return lower;
  return lower.replace(/\b\w/g, (char) => char.toUpperCase());
}

function toBaseVerb(value: string): string {
  const lower = toLowerPhrase(value);
  if (lower.endsWith("ing") && lower.length > 5) {
    const root = lower.slice(0, -3);
    if (root.endsWith("v")) return `${root}e`;
    return root;
  }
  return lower;
}

function deriveActivityFromNiche(niche: string): string {
  const lower = niche.toLowerCase();
  if (/camp|outdoor|hike|rv|trail|forest|summer camp/.test(lower)) return "camping";
  if (/game|gaming|board|dice|dnd|tabletop/.test(lower)) return "playing";
  if (/fitness|gym|lift|run|workout|train/.test(lower)) return "training";
  if (/faith|church|jesus|god|christian|bible/.test(lower)) return "walking in faith";
  if (/fashion|style|outfit|streetwear/.test(lower)) return "getting dressed";
  if (/pet|dog|cat|paw|rescue/.test(lower)) return "spoiling pets";
  if (/cook|chef|culinary|recipe|kitchen|bak|pastry|brunch|foodie/.test(lower)) return "cooking";
  if (/coffee|espresso|latte|barista|brew|caffeine/.test(lower)) return "brewing the perfect cup";
  if (/photo|camera|lens|darkroom|film photo|photographer/.test(lower)) return "shooting";
  if (/paint|artist|illustrat|sketch|draw|gallery|studio/.test(lower)) return "creating";
  if (/yoga|meditat|mindful|wellness|zen|pilates/.test(lower)) return "centering";
  if (/garden|plant|botanical|herb|bloom|flower/.test(lower)) return "tending the garden";
  if (/book|read|library|librarian|bookworm|bibliophile/.test(lower)) return "reading";
  if (/teach|educator|classroom|professor|tutor/.test(lower)) return "teaching";
  if (/nurs|doctor|healthcare|hospital|scrubs|medical/.test(lower)) return "showing up for people";
  if (/music|guitar|drum|band|vinyl|record|musician/.test(lower)) return "playing";
  if (/travel|wander|backpack|nomad|van life|road trip|passport/.test(lower)) return "exploring";
  if (/wine|beer|brewery|winery|craft beer/.test(lower)) return "sipping slowly";
  if (/marathon|cycling|triathlon|trail run/.test(lower)) return "chasing the finish line";
  return "doing my thing";
}

function buildNicheContext(niche: string, audience: string | undefined, persona: PersonaProfile, lexicon: NicheLexicon): NicheContext {
  const lower = `${niche} ${audience || ""}`.toLowerCase();
  const strongAnchors = lexicon.anchors.filter((anchor) => anchor.split(/\s+/).length >= 2);
  const rawIdentityHandles = dedupeStrings([
    ...strongAnchors,
    ...lexicon.audienceTerms,
    ...lexicon.anchors,
  ]);
  const validHandles = rawIdentityHandles.filter(isValidIdentityHandle);
  // If all compounds were filtered out, fall back to the anchors without the adjective filter
  // so we always have at least one identity to work with
  const identityHandles = (validHandles.length > 0 ? validHandles : rawIdentityHandles).slice(0, 6);

  let scenes = ["all day", "on purpose", "in peace", "off the clock"];
  let activities = [deriveActivityFromNiche(niche), `living ${pickOne(identityHandles, lexicon.seed + 301, lexicon.anchors[0] ?? "it")}`];
  let contrastTargets = ["stress", "small talk", "drama", "boring people"];
  let payoffWords = ["care", "spiral", "settle", "pretend", "play nice"];

  if (/camp|outdoor|hike|rv|trail|forest|summer camp/.test(lower)) {
    scenes = ["under the stars", "off the grid", "by the fire", "all summer"];
    activities = ["camping", "chasing sunsets", "sleeping outside", "leaving the group chat"];
    contrastTargets = ["group chats", "city noise", "small talk", "other plans"];
    payoffWords = ["care", "rush", "overthink", "come inside"];
  } else if (/game|gaming|board|dice|dnd|tabletop/.test(lower)) {
    scenes = ["game night", "one more round", "at the table", "in full focus"];
    activities = ["strategizing", "rolling dice", "playing to win", "staying in"];
    contrastTargets = ["small talk", "quitting", "boring nights", "bad strategy"];
    payoffWords = ["fold", "panic", "quit", "care"];
  } else if (/faith|church|jesus|god|christian|bible/.test(lower)) {
    scenes = ["on purpose", "in peace", "with grace", "without fear"];
    activities = ["walking in faith", "trusting God", "standing firm", "choosing grace"];
    contrastTargets = ["fear", "doubt", "noise", "panic"];
    payoffWords = ["panic", "doubt", "back down", "lose faith"];
  } else if (/fitness|gym|lift|run|workout|train/.test(lower)) {
    scenes = ["under pressure", "every rep", "all gas", "before sunrise"];
    activities = ["training", "lifting", "earning it", "finishing strong"];
    contrastTargets = ["excuses", "rest days", "second place", "limits"];
    payoffWords = ["quit", "fold", "coast", "slow down"];
  } else if (/pet|dog|cat|paw|rescue/.test(lower)) {
    scenes = ["all day", "at home", "on the couch", "covered in fur"];
    activities = ["spoiling pets", "staying in", "cuddling", "walking the dog"];
    contrastTargets = ["people", "clean clothes", "free time", "other hobbies"];
    payoffWords = ["share", "apologize", "leave", "say no"];
  } else if (/fashion|style|outfit|streetwear/.test(lower)) {
    scenes = ["all season", "out in public", "without trying", "everywhere"];
    activities = ["getting dressed", "outdressing people", "wearing it well", "making basics jealous"];
    contrastTargets = ["boring basics", "fast trends", "plain outfits", "trying too hard"];
    payoffWords = ["blend in", "settle", "tone it down", "care"];
  } else if (/cook|chef|culinary|recipe|kitchen|bak|pastry|brunch|foodie|meal prep/.test(lower)) {
    scenes = ["from scratch", "in the kitchen", "at the stove", "every single time"];
    activities = ["cooking", "plating", "perfecting the recipe", "feeding people"];
    contrastTargets = ["shortcuts", "bland food", "delivery apps", "following the rules"];
    payoffWords = ["settle", "rush", "cut corners", "fake it"];
  } else if (/coffee|espresso|latte|barista|cafe|brew|caffeine/.test(lower)) {
    scenes = ["first thing", "before anything", "every morning", "without apology"];
    activities = ["brewing", "sipping slowly", "making the perfect cup", "starting the day right"];
    contrastTargets = ["decaf people", "mornings without it", "small talk", "rush"];
    payoffWords = ["function", "talk", "cope", "apologize"];
  } else if (/photo|camera|lens|darkroom|film photo|photographer/.test(lower)) {
    scenes = ["golden hour", "one frame at a time", "in the quiet", "through the lens"];
    activities = ["shooting", "capturing light", "developing film", "chasing the shot"];
    contrastTargets = ["phone filters", "auto mode", "the algorithm", "rushing the shot"];
    payoffWords = ["settle", "miss the shot", "rush", "cut corners"];
  } else if (/paint|artist|illustrat|sketch|draw|art|gallery|studio|creative/.test(lower)) {
    scenes = ["in the studio", "from imagination", "on purpose", "one stroke at a time"];
    activities = ["creating", "painting", "sketching", "building something new"];
    contrastTargets = ["blank pages", "following trends", "playing it safe", "other people's opinions"];
    payoffWords = ["stop", "settle", "copy", "rush"];
  } else if (/yoga|meditat|mindful|wellness|zen|pilates|holistic/.test(lower)) {
    scenes = ["in stillness", "on the mat", "before the day starts", "in full presence"];
    activities = ["breathing", "centering", "showing up", "moving with intention"];
    contrastTargets = ["noise", "hustle culture", "stress", "rushing"];
    payoffWords = ["rush", "overthink", "lose balance", "force it"];
  } else if (/garden|plant|botanical|herb|bloom|flower|grow/.test(lower)) {
    scenes = ["in the dirt", "at sunrise", "without a deadline", "every season"];
    activities = ["planting", "tending the garden", "watching things grow", "getting my hands dirty"];
    contrastTargets = ["fast results", "concrete", "city noise", "indoors"];
    payoffWords = ["rush", "force it", "give up", "stay inside"];
  } else if (/book|read|library|librarian|bookworm|bibliophile|literature|novel/.test(lower)) {
    scenes = ["one more chapter", "in the margins", "lost in the pages", "after midnight"];
    activities = ["reading", "annotating", "staying up too late", "getting lost in a story"];
    contrastTargets = ["the outside world", "notifications", "small talk", "bad endings"];
    payoffWords = ["stop", "put it down", "come up for air", "apologize"];
  } else if (/teach|educator|classroom|professor|student|tutor/.test(lower)) {
    scenes = ["in the classroom", "every single day", "on purpose", "without the credit"];
    activities = ["teaching", "showing up", "making a difference", "investing in people"];
    contrastTargets = ["burnout", "test scores", "the noise", "empty desks"];
    payoffWords = ["quit", "give up", "settle", "stop caring"];
  } else if (/nurs|doctor|healthcare|hospital|scrubs|medical|paramedic/.test(lower)) {
    scenes = ["every shift", "without the applause", "when it counts", "on the floor"];
    activities = ["showing up", "fighting for people", "staying calm", "doing the work"];
    contrastTargets = ["burnout", "the paperwork", "the noise", "easy days"];
    payoffWords = ["quit", "walk away", "slow down", "take the easy road"];
  } else if (/music|guitar|drum|band|vinyl|record|musician|songwriter/.test(lower)) {
    scenes = ["late nights", "on stage", "through the speakers", "every single measure"];
    activities = ["playing", "writing", "making noise", "chasing the feeling"];
    contrastTargets = ["silence", "algorithm playlists", "the middle ground", "safe sounds"];
    payoffWords = ["stop playing", "settle", "tune out", "go quiet"];
  } else if (/travel|wander|backpack|nomad|van life|road trip|passport/.test(lower)) {
    scenes = ["somewhere new", "off the map", "without a plan", "wherever the road goes"];
    activities = ["roaming", "chasing horizons", "leaving", "exploring new places"];
    contrastTargets = ["the routine", "the same four walls", "plans", "comfort zones"];
    payoffWords = ["stay put", "settle", "go back", "stick to the plan"];
  } else if (/wine|beer|brewery|winery|craft beer|spirits|sommelier/.test(lower)) {
    scenes = ["uncorked", "on a Friday", "without apology", "at the right temperature"];
    activities = ["sipping slowly", "tasting", "pairing", "enjoying the craft"];
    contrastTargets = ["rushed meals", "bad pours", "cheap imitations", "the wrong glass"];
    payoffWords = ["hurry", "settle", "apologize", "pretend"];
  } else if (/run|marathon|cycling|triathlon|trail run/.test(lower)) {
    scenes = ["before sunrise", "at mile 20", "every single morning", "when it hurts"];
    activities = ["running", "pushing through", "logging the miles", "finishing strong"];
    contrastTargets = ["excuses", "the snooze button", "second place", "limits"];
    payoffWords = ["quit", "stop", "slow down", "give in"];
  }

  return {
    scenes,
    activities,
    contrastTargets,
    payoffWords,
    identityHandles,
  };
}

function buildNarrativeSlogans(
  lexicon: NicheLexicon,
  context: NicheContext,
  mode: SloganMode,
  clusters: EmotionCluster[],
): string[] {
  const familyCandidates = buildPatternFamilyCandidates(lexicon, context, clusters).map((candidate) => candidate.text);
  
  // We completely strip out the legacy hardcoded string building here and exclusively
  // rely on the behavioral PATTERN_FAMILIES from buildPatternFamilyCandidates, supplemented by GPT-4o.
  // This guarantees we eliminate "Here for off the clock, not small talk" logic.
  
  return dedupeStrings([...familyCandidates]).map((value) => cleanupPhrase(value));
}

function cleanupPhrase(text: string): string {
  const compact = cleanSlogan(text)
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .replace(/\s+([:|/.-])/g, "$1")
    .replace(/([:|/.-])\s+/g, "$1 ")
    .replace(/\|/g, "/")
    .replace(/\s+-\s+/g, " / ")
    .trim();
  return compact.replace(/\s+/g, " ");
}

function isAwkwardPhrase(value: string, lexicon: NicheLexicon): boolean {
  const cleaned = cleanupPhrase(value);
  const tokens = cleaned.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length < 2 || tokens.length > 10) return true;
  if (/[|]{1,}/.test(value)) return true;
  if ((cleaned.match(/[/:.]/g) || []).length > 2) return true;
  if (/^[A-Z\s]+$/.test(cleaned) && tokens.length > 2) return true;
  if (tokens.every((token) => token.length <= 3 || NOISE_WORDS.has(token))) return true;
  if (tokens.some((token) => NOISE_WORDS.has(token)) && !lexicon.anchors.some((anchor) => cleaned.toLowerCase().includes(anchor))) return true;
  if (tokens.some((token, index) => index > 0 && token === tokens[index - 1])) return true;
  const clauses = cleaned.split(/[/:.]/).map((part) => part.trim()).filter(Boolean);
  if (clauses.length >= 2 && clauses.every((clause) => clause.split(/\s+/).length === 1)) return true;
  if (/^\w+\.\s*\w+\.?$/i.test(cleaned) && clauses.length === 2) return true;
  if (/\b(love|cozy|sleepy|unbothered|faithful|proud)\.\s*\b/i.test(cleaned)) return true;
  return false;
}

function humanizeSloganCandidate(value: string, lexicon: NicheLexicon): string {
  const cleaned = cleanupPhrase(value)
    .split(/[/:]/)
    .map((part, index) => {
      const clause = part.trim();
      if (!clause) return clause;
      if (clause === clause.toUpperCase() && clause.split(/\s+/).length > 1) {
        return index === 0 ? toTitleCase(clause.toLowerCase()) : clause.toLowerCase();
      }
      return index === 0 ? toTitleCase(clause) : clause;
    })
    .join(". ");
  return ensureAnchorPresence(cleaned, lexicon, lexicon.seed + cleaned.length);
}

function ensureAnchorPresence(slogan: string, lexicon: NicheLexicon, seed: number): string {
  const lower = slogan.toLowerCase();
  if (lexicon.anchors.some((anchor) => lower.includes(anchor))) return slogan;
  const anchor = pickOne(lexicon.anchors, seed, lexicon.anchors[0] ?? "identity");
  return cleanupPhrase(`${toTitleCase(anchor)}. ${slogan}`);
}

function buildDynamicSlogan(lexicon: NicheLexicon, buckets: Record<string, string[]>, mode: SloganMode, index: number): string {
  const primaryFamilies = ["identity", "emotion", "motion"];
  const secondaryFamilies = ["emotion", "motion", "emphasis", "signal", "audience", "identity"];
  const primaryFamily = pickOne(
    primaryFamilies.filter((family) => buckets[family]?.length > 0),
    lexicon.seed + index * 97,
    "identity",
  );
  const includeSecondary = ((lexicon.seed + index) % (mode === "edgy" ? 2 : 3)) !== 0;
  const chosenFamilies = [primaryFamily];
  if (includeSecondary) {
    const secondaryFamily = pickOne(
      secondaryFamilies.filter((family) => family !== primaryFamily && buckets[family]?.length > 0),
      lexicon.seed + index * 131,
      primaryFamily,
    );
    if (secondaryFamily !== primaryFamily) chosenFamilies.push(secondaryFamily);
  }

  const parts = chosenFamilies.map((family, familyIndex) =>
    pickOne(buckets[family], lexicon.seed + index * 149 + familyIndex * 17, lexicon.anchors[0] ?? "identity"),
  );

  const separators = mode === "edgy"
    ? [" / ", ". "]
    : mode === "viral"
      ? [". ", " / "]
      : [". ", " "];
  const separator = pickOne(separators, lexicon.seed + index * 19, ". ");
  const transform = (lexicon.seed + index) % 3;

  const renderedParts = parts.map((part, partIndex) => {
    if (transform === 0 && partIndex === 0) return toTitleCase(part);
    if (transform === 1 && partIndex === parts.length - 1 && part.split(/\s+/).length <= 2) return toTitleCase(part);
    if (transform === 2 && partIndex === 0 && part.split(/\s+/).length <= 3) return toTitleCase(part);
    return part;
  });

  const base = humanizeSloganCandidate(renderedParts.join(separator), lexicon);
  if (isAwkwardPhrase(base, lexicon)) {
    const fallbackAnchor = pickOne(lexicon.anchors, lexicon.seed + index * 23, lexicon.anchors[0] ?? "identity");
    const fallbackEmotion = pickOne(lexicon.emotionWords, lexicon.seed + index * 29, lexicon.emotionWords[0] ?? "bold");
    return cleanupPhrase(`${toTitleCase(fallbackEmotion)}. ${toTitleCase(fallbackAnchor)}.`);
  }
  return base.split(/\s+/).length <= 10 ? base : cleanupPhrase(toTitleCase(renderedParts[0]));
}

function buildNicheSlogans(
  niche: string,
  identities: string[],
  emotions: string[],
  mode: SloganMode,
  audience?: string,
  salesSignals: SalesSignals = {},
): string[] {
  const persona = inferPersona(niche, audience);
  const lexicon = buildNicheLexicon({ niche, audience }, persona, mode);
  const mergedLexicon: NicheLexicon = {
    ...lexicon,
    anchors: dedupeStrings([...identities, ...lexicon.anchors]),
    emotionWords: dedupeStrings([...emotions, ...lexicon.emotionWords]),
  };
  const buckets = buildFragmentBuckets(mergedLexicon);
  const context = buildNicheContext(niche, audience, persona, mergedLexicon);
  const clusters = detectWinningClusters(niche, audience, mergedLexicon, salesSignals, persona);
  const narrative = buildNarrativeSlogans(mergedLexicon, context, mode, clusters);
  const generated = Array.from({ length: 32 }, (_, index) => buildDynamicSlogan(mergedLexicon, buckets, mode, index));
  const dynamicCandidates = enforcePatternDiversity(
    generated.map((value) => ({
      text: humanizeSloganCandidate(value, mergedLexicon),
      family: detectPatternFamily(value),
    })),
    mergedLexicon,
    clusters,
  ).map((candidate) => candidate.text);

  return dedupeStrings([...narrative, ...dynamicCandidates])
    .filter((value) => value && value.split(/\s+/).length <= 10 && !isAwkwardPhrase(value, mergedLexicon));
}

// ─── Scoring Functions ────────────────────────────────────────────────────────

function computeWearability(slogan: string): number {
  const len = slogan.length;
  if (len <= 20) return 95;
  if (len <= 35) return 85;
  if (len <= 50) return 70;
  if (len <= 65) return 55;
  return 35;
}

function computeMemorability(slogan: string): number {
  const wc = slogan.split(/\s+/).length;
  if (wc <= 4) return 90;
  if (wc <= 6) return 82;
  if (wc <= 8) return 70;
  if (wc <= 10) return 58;
  return 40;
}

function computeIdentityScore(slogan: string): number {
  const lower = slogan.toLowerCase();
  let score = 0;
  if (/\b(i am|i'm|we are|we're|my|our)\b/.test(lower)) score += 25;
  if (/\b(life|soul|born|real|true|pure|proud|forever|always)\b/.test(lower)) score += 20;
  if (/\b(unapologetic|unbothered|certified|official|dedicated)\b/.test(lower)) score += 15;
  
  // Penalize "I love X" or "I like X" statements
  if (isStatement(slogan)) score -= 30;

  return clamp(score + 40, 0, 100);
}

function computeRecognitionScore(s: string, niche?: string): number {
  let score = 0;
  const lower = s.toLowerCase();
  const lowerNiche = (niche || "").toLowerCase();

  // Instant Niche Recognition
  if (lower.includes(lowerNiche)) score += 12;
  
  // High-Conversion Behavioral Hooks
  if (/\b(again|just one more|can't stop|another one|retry|respawn)\b/i.test(lower)) score += 10;
  if (/\b(you know|you get it|insider|if you know)\b/i.test(lower)) score += 8;
  if (/\b(mode|energy|inside|built)\b/i.test(lower)) score += 6;
  
  return clamp(score, 0, 30);
}

function isStatement(s: string): boolean {
  return /^i (am|love|like|need|want)/i.test(s.toLowerCase());
}

function isOverusedWord(word: string, niche: string, batchStats: Record<string, number>): boolean {
  const usage = batchStats[word.toLowerCase()] || 0;
  // Dynamic suppression if word appears in > 30% of candidates
  return usage > 0.3;
}

function computeEmotionScore(slogan: string): number {
  const lower = slogan.toLowerCase();
  let score = 0;
  if (/\b(fierce|unstoppable|fearless|relentless|dominant|clutch)\b/.test(lower)) score += 30;
  if (/\b(proud|bold|devoted|driven|focused|strong|powerful)\b/.test(lower)) score += 20;
  if (/\b(blessed|faithful|called|wild|free|alive|raw)\b/.test(lower)) score += 15;
  if (/\b(love|joy|hope|peace|grace|brave|heart)\b/.test(lower)) score += 10;
  return clamp(score + 30, 0, 100);
}

function computeHookScore(s: string, niche?: string): number {
  let score = 0;
  const lower = s.toLowerCase();

  if (/[^\w\s]/.test(s)) score += 5; // symbols/emphasis (!, ?, >)
  if (/\b(not|but|instead|over|vs)\b/i.test(lower)) score += 8; // contrast
  
  // Add Recognition Score to Hook weight
  score += computeRecognitionScore(s, niche);

  if (s.length < 50) score += 5; // wearable length

  // Original hook rules as backup
  if (/^(built|born|real|not|you|they|we|just|only|never|always|this|that)/.test(lower)) score += 5;
  if (/\b(different|hits|calling|mode|season)\b/.test(lower)) score += 5;

  return clamp(score, 0, 100);
}

function computeClevernessScore(s: string): number {
  let score = 0;
  const lower = s.toLowerCase();

  if (/(pro|certified|expert|official|elite|specialist)\b/i.test(lower)) score += 6;
  if (/(powered by|fueled by|driven by|brought to you by)\b/i.test(lower)) score += 6;
  if (/(it's not|you wouldn't|trust me|the secret|you missed)\b/i.test(lower)) score += 8;
  if (/\b(survivor|addict|mode|vibe)\b/i.test(lower)) score += 4;

  return clamp(score, 0, 100);
}

function computePunchScore(slogan: string): number {
  let score = 50;
  if (/[.!]$/.test(slogan.trim())) score += 15;
  if (/\w+\.\s*\w+/.test(slogan)) score += 10;
  if (slogan.split(/\s+/).length <= 5) score += 15;
  if (/[A-Z]{2,}/.test(slogan)) score += 10;
  return clamp(score, 0, 100);
}

function computeVisualFit(slogan: string): number {
  const words = slogan.split(/\s+/).length;
  let score = 60;
  if (words <= 4) score += 25;
  else if (words <= 6) score += 15;
  else if (words > 9) score -= 20;
  if (/\||\n|—/.test(slogan)) score += 10;
  return clamp(score, 0, 100);
}

function computeSymmetry(slogan: string): number {
  const parts = slogan.split(/[.,!?;:|—]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 2 && Math.abs(parts[0].length - parts[1].length) <= 8) return 80;
  if (parts.length === 3) return 75;
  return 55;
}

function computeLineBreakPotential(slogan: string): number {
  if (/[.\n|—]/.test(slogan)) return 80;
  if (slogan.split(/\s+/).length <= 5) return 70;
  return 50;
}

function computeFontImpact(slogan: string): number {
  const upper = (slogan.match(/[A-Z]/g) || []).length;
  const ratio = upper / slogan.length;
  if (ratio > 0.5) return 85;
  if (ratio > 0.2) return 70;
  return 55;
}

function computeContrastScore(slogan: string): number {
  const lower = slogan.toLowerCase();
  if (/not |never |no |without |despite /.test(lower)) return 80;
  if (/ but | yet | though /.test(lower)) return 75;
  return 50;
}

function computeCuriosityGap(slogan: string): number {
  const lower = slogan.toLowerCase();
  let score = 40;
  if (/\?/.test(slogan)) score += 25;
  if (/\b(secret|hidden|truth|real|only)\b/.test(lower)) score += 20;
  if (/\b(different|hits|deeper|more)\b/.test(lower)) score += 15;
  return clamp(score, 0, 100);
}

function computeEmotionalTrigger(slogan: string): number {
  const lower = slogan.toLowerCase();
  let score = 30;
  if (/\b(love|hate|fear|joy|pride|pain|hope|anger|peace)\b/.test(lower)) score += 30;
  if (/\b(heart|soul|spirit|fire|blood|tears|smile)\b/.test(lower)) score += 20;
  if (/[!]/.test(slogan)) score += 10;
  return clamp(score, 0, 100);
}

function isGeneric(s: string): boolean {
  const genericPatterns = [
    /good vibes/i,
    /stay positive/i,
    /love life/i,
    /just do it/i,
    /be yourself/i,
    /dream big/i,
  ];

  const wordCount = s.split(/\s+/).length;

  // 🔥 Generic structure detection
  if (wordCount <= 3 && !/[^\w\s]/.test(s)) return true;

  return genericPatterns.some(p => p.test(s));
}

function detectEmotionalClustersForNiche(niche: string): EmotionCluster[] {
  const map: Record<string, string[]> = {
    camping: ["peace", "escape", "freedom"],
    gym: ["discipline", "pain", "power"],
    moms: ["love", "chaos", "pride"],
    gamers: ["focus", "rage", "obsession"],
  };

  const lower = niche.toLowerCase();
  let keywords = ["identity", "belonging", "expression"];
  for (const key in map) {
    if (lower.includes(key)) {
      keywords = map[key];
      break;
    }
  }

  return [{
    name: "Detected Niche Core",
    keywords,
    weight: 1.0,
  }];
}

function computeGenericPenalty(slogan: string): number {
  const words = slogan.toLowerCase().split(/\s+/);
  const genericCount = words.filter((w) => GENERIC_WORDS.has(w)).length;
  return clamp(genericCount * 12, 0, 60);
}

function computeMarketSignalScore(signals: SalesSignals, slogan: string): number {
  if (!signals || Object.keys(signals).length === 0) return 0;
  let score = 0;
  if (signals.confidence) score += clamp(signals.confidence * 50, 0, 50);
  const keywords = signals.topKeywords || [];
  const lower = slogan.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(normalizeKeyword(kw))) score += 8;
  }
  return clamp(score, 0, 100);
}

function computeNaturalPhraseBonus(slogan: string): number {
  const lower = slogan.toLowerCase();
  let score = 0;
  if (/too\s+\w+[\w-]*\s+to\s+\w+/.test(lower)) score += 18;
  if (/leave me alone|i'm\s+\w+|i am\s+\w+/.test(lower)) score += 16;
  if (/\bzero\s+\w+/.test(lower)) score += 14;
  if (/\bnot\s+\w+/.test(lower) || />/.test(slogan)) score += 12;
  if (/\bunder\s+the\b|\boff\s+the\b|\bout\s+of\b/.test(lower)) score += 10;
  if (/\bmy\s+game\b|\bhits different\b|\bbetter\b/.test(lower)) score += 10;
  return clamp(score, 0, 30);
}

function computeFragmentPenalty(slogan: string): number {
  const clauses = slogan.split(/[.:/]/).map((part) => part.trim()).filter(Boolean);
  let penalty = 0;
  if (clauses.length >= 2 && clauses.every((clause) => clause.split(/\s+/).length <= 2)) penalty += 18;
  if (/^\w+\.\s*\w+\.?$/i.test(slogan)) penalty += 20;
  if (/\bthe real too\b|\bstill too\b/i.test(slogan)) penalty += 18;
  if (/^[A-Z\s.,!]+$/.test(slogan) && slogan.split(/\s+/).length > 3) penalty += 10;
  return clamp(penalty, 0, 30);
}

function heuristicPatternScore(slogan: string): number {
  const clauses = slogan.split(/[|/:.-]/).map((part) => part.trim()).filter(Boolean);
  const wordCount = slogan.split(/\s+/).length;
  let score = 48;
  if (wordCount <= 4) score += 14;
  else if (wordCount <= 7) score += 8;
  if (clauses.length === 2) score += 12;
  else if (clauses.length === 3) score += 8;
  if (/[|/:-]/.test(slogan)) score += 6;
  if (/^[A-Z0-9\s]+$/.test(slogan)) score += 4;
  const uniqueWords = new Set(slogan.toLowerCase().split(/\s+/)).size;
  if (uniqueWords >= Math.max(2, wordCount - 1)) score += 10;
  return clamp(score, 0, 100);
}

function computeConfidence(finalScore: number, wearability: number, memorability: number, genericPenalty: number, marketSignalScore: number): number {
  const clarity = wearability * 0.35 + memorability * 0.25;
  const distinctiveness = (100 - genericPenalty) * 0.2;
  const evidence = marketSignalScore * 0.2;
  return clamp(Math.round(finalScore * 0.35 + clarity + distinctiveness + evidence), 0, 100);
}

export async function refineWithGPT4o(
  slogans: string[],
  niche: string,
  audience?: string,
): Promise<string[]> {
  if (slogans.length === 0) return [];

  const response = await chatCompletionSafe({
    model: "gpt-4o",
    temperature: 0.85,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an elite t-shirt slogan polisher. 
Take the draft slogans and refine them into "Best Sellers".

ELITE DIVERSITY ENFORCEMENT:
Your output must maintain this balance if possible:
- Short labels (Pure niche hooks)
- Wordplay/puns (Double meanings)
- Relatable humor (Community struggles/loop)
- Insider signals (Deep community knowledge)
- Bold identity claims

RULES:
- NO PERIODS anywhere in the slogan. (e.g. "Pure Pickleball", NOT "Pure Pickleball.")
- NO boring filler words like "Ref", "Mood", "Vibe", "Whisperer", "Legends".
- Retain the core niche reference.
- Phrases must be short, punchy, and wearable on a shirt.

Return ONLY JSON: { "slogans": ["polished 1", "polished 2", ...] }`,
      },
      {
        role: "user",
        content: `Niche: ${niche}\nAudience: ${audience || "fans"}\nDrafts:\n- ${slogans.join("\n- ")}`,
      },
    ],
  });

  if (response.error || !response.data?.choices[0]?.message?.content) {
    return slogans; // Fallback to originals
  }

  try {
    const parsed = JSON.parse(response.data.choices[0].message.content);
    return parsed.slogans || slogans;
  } catch {
    return slogans;
  }
}

/**
 * Primary LLM-first generator: produce behavioral slogans directly from behavioral signals.
 * Falls back to `buildFromPatterns` when LLM is unavailable.
 */
export async function generateBehavioralSlogans({
  niche,
  behaviors,
  count = 20,
}: {
  niche: string;
  behaviors: string[];
  count?: number;
}): Promise<string[]> {
  try {
    const prompt = `You are creating HIGH-CONVERTING t-shirt slogans.

Niche: ${niche}

Behavioral truths:
${(behaviors || []).slice(0, 12).map((b) => `- ${b}`).join("\n")}

Write ${count} slogans that:
- sound like real people in this niche
- use slang, humor, or inside jokes
- are short (2–6 words)
- feel wearable (not descriptive)

Avoid:
- generic phrases
- "[niche] mode"
- "too X to Y"
- obvious templates

Make them feel like something someone would actually wear.

Return JSON:
{ "slogans": ["...", "..."] }
`;

    const response = await chatCompletionSafe({
      model: "gpt-4o-mini",
      temperature: 0.95,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a witty, niche-aware t-shirt copywriter." },
        { role: "user", content: prompt },
      ],
    });

    if (response.error || !response.data?.choices?.[0]?.message?.content) throw new Error("LLM unavailable");
    try {
      const parsed = JSON.parse(response.data.choices[0].message.content);
      if (Array.isArray(parsed.slogans)) return parsed.slogans.map(String).slice(0, count);
    } catch (_) {
      // fallthrough to naive parse
    }

    // naive parse fallback
    const raw = response.data.choices[0].message.content || "";
    return raw
      .split(/\n+/)
      .map((l: string) => l.replace(/^[-*\d.\s\"]+/, "").trim())
      .filter((l: string) => l.length > 0)
      .slice(0, count);
  } catch (err) {
    // LLM unavailable — fallback to deterministic builder using patterns
    // Build simple patterns seeded from behaviors to preserve behavior-first intent
    const seeds = (behaviors || []).slice(0, 6).map((b) => b.split(/\W+/).slice(0, 3).join(" ")).filter(Boolean);
    const patterns = seeds.length > 0 ? seeds.map((s) => `Just One More ${s}`) : ["Just One More [ANCHOR]", "[SLANG] Happens"];
    return buildFromPatterns(patterns, niche).slice(0, count);
  }
}

function deriveTags(slogan: string, niche: string, audience?: string): string[] {
  return dedupeStrings([
    ...extractMeaningfulTokens(niche),
    ...extractMeaningfulTokens(audience || ""),
    ...extractMeaningfulTokens(slogan),
  ]).slice(0, 8);
}

// ─── Core Scoring ─────────────────────────────────────────────────────────────

function scoreSlogan(
  slogan: string,
  salesSignals: SalesSignals,
  mode: SloganMode,
  niche: string,
  batchStats: Record<string, number> = {},
  clusters: EmotionCluster[] = [],
): Omit<RankedSlogan, "pattern" | "persona" | "personaKey" | "reasons" | "salesSignals" | "bucket" | "hasSalesEvidence" | "tags"> {
  // Hard cleanup for Elite quality
  const cleanedSlogan = slogan
    .replace(/[.]+$/, "")
    .replace(/\s+/g, " ")
    .trim();

  const wearability = computeWearability(cleanedSlogan);
  const memorability = computeMemorability(cleanedSlogan);
  const identityScore = computeIdentityScore(cleanedSlogan);
  const emotionScore = computeEmotionScore(cleanedSlogan);
  const punchScore = computePunchScore(cleanedSlogan);
  const visualFit = computeVisualFit(cleanedSlogan);
  const hookScore = computeHookScore(cleanedSlogan, niche);
  const clevernessScore = computeClevernessScore(cleanedSlogan);
  const recognitionScore = computeRecognitionScore(cleanedSlogan, niche);
  const symmetry = computeSymmetry(slogan);
  const lineBreakPotential = computeLineBreakPotential(slogan);
  const fontImpact = computeFontImpact(slogan);
  const contrastScore = computeContrastScore(slogan);
  const curiosityGap = computeCuriosityGap(slogan);
  const emotionalTrigger = computeEmotionalTrigger(slogan);
  const genericPenalty = computeGenericPenalty(slogan);
  const marketSignalScore = computeMarketSignalScore(salesSignals, slogan);
  const naturalPhraseBonus = computeNaturalPhraseBonus(slogan);
  const fragmentPenalty = computeFragmentPenalty(slogan);
  const patternBoost = heuristicPatternScore(slogan);
  const viralReadiness = computeViralReadiness(slogan);
  const clusterAlignment = computeClusterAlignment(slogan, clusters);
  const conversationalScore = computeConversationalScore(cleanedSlogan);
  const modeBoost = mode === "viral" ? 5 : mode === "edgy" ? 3 : 0;
  // Apply Overused Word Penalty (Suppression without banning)
  let overusedPenalty = 0;
  const words = cleanedSlogan.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (isOverusedWord(word, niche, batchStats)) {
      overusedPenalty += 10;
    }
  }

  // Anchor bias penalty: discourage slogans that simply append the niche
  try {
    const nlow = (niche || "").toLowerCase().trim();
    if (nlow && cleanedSlogan.toLowerCase().includes(nlow)) {
      // Stronger penalty for anchor spam
      overusedPenalty += 8;
    }
  } catch (_) { /* ignore */ }

  // Hard banned phrase penalties
  for (const banned of BANNED_PHRASES) {
    if (cleanedSlogan.toLowerCase().includes(banned)) {
      overusedPenalty += 15;
    }
  }

  // Boost truly human / conversational phrases
  const humanBoost = isHumanPhrase(cleanedSlogan) ? 10 : 0;

  const rawBase =
    wearability * 0.12 +
    memorability * 0.10 +
    identityScore * 0.1 +
    emotionScore * 0.08 +
    punchScore * 0.08 +
    visualFit * 0.06 +
    recognitionScore * 0.2 + // Higher weight for instant recognition
    symmetry * 0.04 +
    lineBreakPotential * 0.03 +
    fontImpact * 0.02 +
    contrastScore * 0.04 +
    curiosityGap * 0.04 +
    emotionalTrigger * 0.04 +
    marketSignalScore * 0.07 -
    genericPenalty * 0.35 +
    naturalPhraseBonus * 0.45 -
    fragmentPenalty * 0.6 +
    patternBoost * 0.05 +
    viralReadiness * 0.3 +
    conversationalScore * 0.12 +
    humanBoost +
    clusterAlignment * 0.4 +
    modeBoost -
    overusedPenalty;

  // Elite Rule: FINAL_SCORE = (0.7 * cleverness) + (0.3 * specificity)
  // Specificity is identityScore + marketSignal alignment
  const clevernessWeight = clamp(clevernessScore + hookScore, 0, 100);
  const specificityWeight = clamp(identityScore + (marketSignalScore > 0 ? 30 : 0), 0, 100);
  const balancedRaw = (rawBase * 0.6) + (clevernessWeight * 0.7 + specificityWeight * 0.3) * 0.4;

  const finalScore = clamp(Math.round(balancedRaw), 0, 100);
  const confidence = computeConfidence(finalScore, wearability, memorability, genericPenalty, marketSignalScore);

  return {
    slogan: cleanedSlogan,
    score: finalScore,
    finalScore,
    confidence,
    wearability,
    memorability,
    identity: identityScore,
    identityScore,
    emotion: emotionScore,
    emotionScore,
    punch: punchScore,
    punchScore,
    visualFit,
    hookScore,
    clevernessScore,
    recognitionScore,
    symmetry,
    lineBreakPotential,
    fontImpact,
    contrastScore,
    curiosityGap,
    emotionalTrigger,
    genericPenalty,
    marketSignalScore,
    naturalPhraseBonus,
    fragmentPenalty,
    patternBoost,
    viralReadiness,
    clusterAlignment,
  } as any;
}

// ─── Pattern Diversity & Usage ───────────────────────────────────────────────

function getPatternUsageStats(candidates: SloganCandidate[]): Record<string, number> {
  const stats: Record<string, number> = {};
  const total = candidates.length || 1;
  for (const c of candidates) {
    stats[c.family] = (stats[c.family] || 0) + 1;
  }
  // Normalize
  for (const key in stats) {
    stats[key] = stats[key] / total;
  }
  return stats;
}

function isOverused(family: string, stats: Record<string, number>): boolean {
  return (stats[family] || 0) > 0.25; // 25% threshold
}

function detectPattern(slogan: string): string {
  const parts = slogan.split(/[|/:.-]/).map((part) => part.trim()).filter(Boolean);
  const words = slogan.split(/\s+/).length;
  if (parts.length >= 3) return "stacked_multi_clause";
  if (parts.length === 2 && words <= 6) return "balanced_split";
  if (parts.length === 2) return "split_statement";
  if (words <= 3) return "short_burst";
  if (words <= 6) return "single_line";
  return "long_form";
}

function inferPersona(niche: string, audience?: string): PersonaProfile {
  const lower = (niche + " " + (audience || "")).toLowerCase();
  for (const p of PERSONAS) {
    if (p.key === "broad_market") continue;
    if (p.keywords.some((kw) => lower.includes(kw))) return p;
  }
  return PERSONAS.find((p) => p.key === "broad_market")!;
}

function buildReasons(scored: ReturnType<typeof scoreSlogan>): string[] {
  const reasons: string[] = [];
  if (scored.confidence >= 80) reasons.push("High confidence for UI surfacing");
  if (scored.wearability >= 80) reasons.push("Short enough for a clean print");
  if (scored.memorability >= 80) reasons.push("Concise and easy to remember");
  if (scored.identityScore >= 70) reasons.push("Strong identity signal");
  if (scored.emotionScore >= 65) reasons.push("Emotionally resonant");
  if (scored.punchScore >= 75) reasons.push("Punchy structure");
  if (scored.visualFit >= 75) reasons.push("Works well as visual text");
  if (scored.hookScore >= 70) reasons.push("Opens with a hook");
  if (scored.marketSignalScore >= 40) reasons.push("Backed by market signals");
  if (reasons.length === 0) reasons.push("Solid base candidate");
  return reasons;
}

function chooseBucket(finalScore: number, hookScore: number): SloganBucket {
  if (finalScore >= 72) return "topPicks";
  if (finalScore >= 56 || hookScore >= 68) return "boldPicks";
  return "experimental";
}

function sortRanked(ranked: RankedSlogan[]): RankedSlogan[] {
  return [...ranked].sort((a, b) => b.finalScore - a.finalScore);
}

function diversifyRanked(ranked: RankedSlogan[], niche = ""): RankedSlogan[] {
  const usedSignatures = new Set<string>();
  const usedFingerprints = new Set<string>();
  const familyCounts = new Map<PatternFamily, number>();
  const prioritized: RankedSlogan[] = [];
  const deferred: RankedSlogan[] = [];

  for (const entry of ranked) {
    const family = detectPatternFamily(entry.slogan);
    const signature = structureSignature(entry.slogan);
    const fp = patternFingerprint(entry.slogan);
    const familyLimit = family === "ATTITUDE" ? 2 : 3;
    const familyCount = familyCounts.get(family) ?? 0;
    const fpDuplicate = usedFingerprints.has(fp);

    if (!usedSignatures.has(signature) && familyCount < familyLimit && !fpDuplicate) {
      prioritized.push(entry);
      usedSignatures.add(signature);
      usedFingerprints.add(fp);
      familyCounts.set(family, familyCount + 1);
    } else {
      deferred.push(entry);
    }
  }

  // Allow deferred slogans that have a novel fingerprint (even if signature matches)
  const deferredNovel = deferred.filter((entry) => !usedFingerprints.has(patternFingerprint(entry.slogan)));
  void niche; // reserved for future specificity re-score
  return [...prioritized, ...deferredNovel];
}

function dedupeRanked(ranked: RankedSlogan[]): RankedSlogan[] {
  const seen = new Set<string>();
  return ranked.filter((r) => {
    const k = r.slogan.toLowerCase().trim();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function remixSlogans(seed: string, identities: string[], emotions: string[]): string[] {
  const results: string[] = [];
  const transformations = [
    (s: string) => s.replace(/\.$/, "!"),
    (s: string) => `${s} All day.`,
    (s: string) => `${s} No apologies.`,
  ];
  for (const fn of transformations) {
    try {
      const variant = cleanSlogan(fn(seed));
      if (variant.split(/\s+/).length <= 10) results.push(variant);
    } catch (_) { /* skip */ }
  }
  for (let i = 0; i < Math.min(3, identities.length); i++) {
    const id = identities[i];
    const em = emotions[i % emotions.length];
    results.push(cleanSlogan(`${toTitleCase(id)}. No apologies.`));
    results.push(cleanSlogan(`Built for ${id.toLowerCase()}.`));
    results.push(cleanSlogan(`${toTitleCase(em)}. All in.`));
  }
  return results.slice(0, 20);
}

function buildCollections(ranked: RankedSlogan[]): SloganCollections {
  const assigned = new Set<string>();
  const topPicks: RankedSlogan[] = [];
  const boldPicks: RankedSlogan[] = [];
  const experimental: RankedSlogan[] = [];
  for (const r of ranked) {
    const key = r.slogan.toLowerCase().trim();
    if (assigned.has(key)) continue;
    assigned.add(key);
    if (r.bucket === "topPicks") topPicks.push(r);
    else if (r.bucket === "boldPicks") boldPicks.push(r);
    else experimental.push(r);
  }
  return { topPicks, boldPicks, experimental };
}

// ─── Pattern Helpers (Build concrete slogans from LLM pattern templates) ───

function isValidPattern(p: string): boolean {
  if (!p || typeof p !== "string") return false;
  const trimmed = p.trim();
  if (trimmed.length === 0 || trimmed.length > 120) return false;
  const lower = trimmed.toLowerCase();
  if (lower.includes("generic") || lower.includes("vibe")) return false;
  // Prefer patterns that include an anchor placeholder or at least mention the niche
  if (/\[anchor\]|\{anchor\}|\[anchor\]/i.test(trimmed)) return true;
  // Accept patterns that are short and contain a noun placeholder token
  if (/\[(noun|anchor|thing)\]/i.test(trimmed)) return true;
  // Otherwise accept if it includes a bracketed placeholder or the niche word
  if (/\[.*\]/.test(trimmed)) return true;
  return trimmed.split(/\s+/).length <= 5;
}

export function buildFromPatterns(patterns: string[], niche: string): string[] {
  const anchors = dedupeStrings(deriveNicheIdentities(niche, inferPersona(niche).key)).slice(0, 6);
  const emotions = dedupeStrings(deriveNicheEmotions(niche, inferPersona(niche).key)).slice(0, 6);
  const results: string[] = [];

  for (const pat of patterns) {
    const template = pat.trim();
    const variants: string[] = [];
    // Replacement strategies
    const placeholders = ["[ANCHOR]", "{ANCHOR}", "[anchor]", "[NOUN]", "[noun]"];
    const hasPlaceholder = placeholders.some((ph) => template.includes(ph));

    if (hasPlaceholder && anchors.length > 0) {
      for (const a of anchors.slice(0, 3)) {
        variants.push(template.replace(/\[ANCHOR\]|\{ANCHOR\}|\[anchor\]/gi, a));
      }
    } else if (template.includes("[EMOTION]") && emotions.length > 0) {
      for (const e of emotions.slice(0, 3)) variants.push(template.replace(/\[EMOTION\]/gi, e));
    } else {
      // No placeholder — try to inject anchors in a few common positions
      const candidate = template.replace(/\s+/g, " ").trim();
      if (anchors.length > 0) {
        variants.push(`${anchors[0]} ${candidate}`);
        variants.push(`${candidate} ${anchors[0]}`);
        if (anchors[1]) variants.push(`${anchors[1]} ${candidate}`);
      } else {
        variants.push(candidate);
      }
    }

    for (const v of variants) {
      const cleaned = cleanSlogan(v);
      if (!isGeneric(cleaned) && cleaned.split(/\s+/).length <= 8) results.push(cleaned);
    }
  }

  return dedupeStrings(results).slice(0, 48);
}

function selectTopPerformers(ranked: RankedSlogan[]): RankedSlogan[] {
  const cutoff = Math.max(4, Math.ceil(ranked.length * 0.1));
  return ranked.slice(0, cutoff);
}

// ─── AI Slogan Generator ──────────────────────────────────────────────────────

async function generateAISlogans(
  niche: string,
  audience: string | undefined,
  personaLabel: string,
  mode: SloganMode,
  dominantClusters: string[] = [],
): Promise<string[]> {
  // Market intelligence
  const [winningPatterns, losingPatterns, trendingKeywords, buyerPhrases] = await Promise.all([
    getTopPatterns(niche),
    getLowPerformingPatterns(niche),
    getTrendingKeywords(niche),
    getBuyerPhrases(niche),
  ]);

  const emotions = pickEmotion(niche);

  const systemPrompt = `You are a top-selling t-shirt copywriter.
Your goal is to create slogans that trigger instant recognition and identity.

ELITE STRUCTURAL DIVERSITY RULE (CRITICAL):
You must provide a varied mix:
- 2 short label-style slogans (2–3 words)
- 2 wordplay or pun-based slogans
- 2 relatable humor/struggle slogans
- 2 niche-specific insider signals (use anchors or insider phrasing)
- 2 bold attitude/identity slogans

RULES:
- NO PERIODS at the end of slogans.
- NO generic filler like "Vibe", "Mood", "Legend", "Whisperer".
- Keep each slogan short and hook-driven (2–7 words).
- Use strong verbs, contrasts, or punchlines. Favor active voice.
- Prefer surprising pairings, sharp contrasts, or clever wordplay over generic phrases.
- Tone: ${mode === "edgy" ? "Raw and aggressive" : "Modern and authentic"}.
- Preferred Emotions: ${emotions.join(", ")}.

OUTPUT STYLE GUIDANCE:
- Front-load the hook: start with the strongest word.
- Avoid templated copy like "If you know you know"; instead use niche anchors (e.g., "[ANCHOR] Insiders", "Only [ANCHOR] People Know").
- Include at least one slogan that is a punchy command or contrast (e.g., "Win Not Excuse").
- If producing puns, ensure they are concise and immediately understandable.

Return JSON: { "slogans": ["slogan 1", "slogan 2", ...] }`;

  let userPrompt = [
    `NICHE: ${niche}`,
    audience ? `AUDIENCE: ${audience}` : `AUDIENCE: enthusiasts and fans of this niche`,
    `PERSONA: ${personaLabel}`,
    dominantClusters.length > 0 ? `DOMINANT TONES: ${dominantClusters.join(", ")}` : "",
  ].filter(Boolean).join("\n");

  // Inject high-conversion examples to bias generation towards winning patterns
  try {
    const topExamples = await getTopPerformingSlogans(niche, 4);
    if (topExamples.length > 0) {
      const exampleBlock = ["HIGH-CONVERTING EXAMPLES:", ...topExamples.map((s) => `\"${s}\"`)].join("\n");
      // Place examples after user prompt to bias output without copying
      userPrompt += `\n\n${exampleBlock}\nWrite new slogans inspired by these patterns but DO NOT copy them. Use punchy hooks, verbs, and avoid generic phrasing.`;
    }
  } catch (_) { /* non-blocking */ }

  try {
    const response = await chatCompletionSafe({
      model: "gpt-4o-mini",
      temperature: 0.95, // 🔥 increase creativity
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
    });

    if (response.error || !response.data?.choices[0]?.message?.content) return [];

    const raw = response.data.choices[0].message.content;
    let rawSlogans: string[] = [];

    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (Array.isArray(parsed)) {
        rawSlogans = parsed.map(String);
      } else if (parsed && typeof parsed === "object") {
        for (const val of Object.values(parsed)) {
          if (Array.isArray(val)) { rawSlogans = val.map(String); break; }
        }
      }
    } catch {
      rawSlogans = raw
        .split("\n")
        .map((l) => l.replace(/^[-*\[\]\d."]+\s*/g, "").trim())
        .filter((l) => l.length > 3);
    }

    // 🔥 SEMANTIC DEDUPLICATION
    const unique: string[] = [];
    const seen = new Set<string>();

    for (const s of rawSlogans) {
      if (typeof s !== "string") continue;
      const normalized = s
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\b(too|very|really)\b/g, "")
        .trim();

      if (normalized.length > 0 && !seen.has(normalized)) {
        seen.add(normalized);
        unique.push(cleanSlogan(s)); // our robust formatter
      }
    }

    // 🔥 PATTERN PENALTY FILTER
    const filtered = unique.filter((s) => {
      const lower = s.toLowerCase();
      if (lower.includes("too ") && lower.includes(" to ")) return false;
      if (lower.startsWith("built for")) return false;
      if (lower.includes("no apologies")) return false;
      if (lower.includes("state of mind")) return false;
      return true;
    });

    return filtered.slice(0, 10);
  } catch (_) {
    return [];
  }
}

/**
 * Expand pattern families using the LLM — returns short slogan structures
 * (placeholders or short patterns) rather than final slogans. This is
 * intended to evolve pattern families, not replace deterministic templates.
 */
export async function expandPatternFamilies(niche: string, count = 5, behaviors: string[] = []): Promise<string[]> {
  try {
    const response = await chatCompletionSafe({
      model: "gpt-4o-mini",
      temperature: 0.88,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a creative slogan pattern inventor. Produce ${count} concise slogan structures or pattern templates for niche: ${niche}. Use insider phrasing and placeholders where appropriate. Prioritize the following behavioral truths when generating patterns:\n${(behaviors || []).slice(0,8).map((b) => `- ${b}`).join("\n")}\nReturn only JSON: { "patterns": ["pattern 1", "pattern 2", ...] }`,
        },
      ],
    });

    if (response.error || !response.data?.choices[0]?.message?.content) return [];

    try {
      const parsed = JSON.parse(response.data.choices[0].message.content);
      if (Array.isArray(parsed.patterns)) return parsed.patterns.map(String).slice(0, count);
    } catch (_) {
      // fallthrough to safe parsing
    }

    // Fallback naive parse
    const raw = response.data.choices[0].message.content;
    return raw
      .split(/\n+/)
      .map((l: string) => l.replace(/^[-*\d.\s\"]+/, "").trim())
      .filter((l: string) => l.length > 0)
      .slice(0, count);
  } catch (_) {
    return [];
  }
}

/**
 * Mutate a single base pattern into multiple novel pattern structures using the LLM.
 * Returns an array of short pattern templates (2-5 words) suitable for `buildFromPatterns`.
 */
export async function mutatePatternFamily(basePattern: string, niche: string, count = 8, behaviors: string[] = []): Promise<string[]> {
  if (!basePattern || basePattern.trim().length === 0) return [];
  try {
    const prompt = `You are a viral t-shirt slogan strategist.

BASE PATTERN:
"${basePattern}"

NICHE:
${niche}

BEHAVIORAL TRUTHS:
${(behaviors || []).slice(0,8).map((b) => `- ${b}`).join("\n")}

TASK:
Generate ${count} completely NEW slogan structures inspired by the base pattern and the behavioral truths above.

RULES:
- DO NOT reuse the original pattern exactly
- DO NOT use "${niche}" explicitly in more than 2 outputs
- Use insider language if possible
- Keep each structure 2–6 words, favor conversational phrasing
- Make them wearable, punchy, and natural
- Vary structure (question, command, label, humor, inside joke, regret)

RETURN JSON:
{ "patterns": ["pattern 1", "pattern 2", ...] }
`;

    const response = await chatCompletionSafe({
      model: "gpt-4o-mini",
      temperature: 0.95,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    if (response.error || !response.data?.choices[0]?.message?.content) return [];

    try {
      const parsed = JSON.parse(response.data.choices[0].message.content);
      if (Array.isArray(parsed.patterns)) return parsed.patterns.map(String).slice(0, count);
    } catch (_) {
      // fallthrough to naive parsing
    }

    const raw = response.data.choices[0].message.content || "";
    return raw
      .split(/\n+/)
      .map((l: string) => l.replace(/^[-*\d.\s\"]+/, "").trim())
      .filter((l: string) => l.length > 0)
      .slice(0, count);
  } catch (_) {
    return [];
  }
}

function buildEliteSloganEngine(input: SloganEngineInput): SloganEngineResult {
  const { niche, audience, mode: modeInput, salesSignals: rawSignals } = input;
  const mode = normalizeMode(modeInput);
  const persona = inferPersona(niche, audience);
  const salesSignals = normalizeSalesSignals(rawSignals);

  const rawSlogans = generateDynamicSlogans(input).filter((s) => !isGeneric(s));
  const clusters: EmotionCluster[] = detectEmotionalClustersForNiche(niche);

  const ranked: RankedSlogan[] = rawSlogans.map((slogan) => {
    const clean = cleanSlogan(slogan);
    const scored = scoreSlogan(clean, salesSignals, mode, niche, {});
    const reasons = buildReasons(scored);
    const bucket = chooseBucket(scored.finalScore, scored.hookScore);
    const pattern = detectPattern(clean);
    return {
      ...scored,
      slogan: clean,
      pattern,
      persona: persona.label,
      personaKey: persona.key,
      tags: deriveTags(clean, niche, audience),
      reasons,
      salesSignals,
      bucket,
      hasSalesEvidence: (salesSignals.confidence ?? 0) > 0 || Object.keys(salesSignals).length > 0,
    };
  });

  // Apply dynamic normalization across the initial batch so component weights are meaningful
  const normalizedBatch = applyBatchNormalization(ranked);

  // use normalized batch for downstream sorting/collections
  const sorted = diversifyRanked(dedupeRanked(sortRanked(normalizedBatch)), niche);
  const collections = buildCollections(sorted);
  
  const ELITE_THRESHOLD = 72;
  const eliteSloganObjs = sorted.filter((s) => s.score >= ELITE_THRESHOLD);
  const finalSloganObjs = eliteSloganObjs.length >= 5 ? eliteSloganObjs.slice(0, 5) : sorted.slice(0, 5);
  const topSlogans = dedupeStrings(finalSloganObjs.map((r) => r.slogan));

  return {
    slogans: topSlogans,
    ranked: sorted,
    collections,
    persona: persona.label,
    personaKey: persona.key,
    mode,
  };
}

// ─── Public Exports ───────────────────────────────────────────────────────────

export function enhanceSlogans(input: SloganEngineInput): SloganEngineResult {
  return buildEliteSloganEngine(input);
}

export async function runEliteSloganEngine(input: SloganEngineInput): Promise<SloganEngineResult> {
  const base = buildEliteSloganEngine(input);

  // ── Phase 1: Load learned pattern weights from DB ──────────────────────────
  const patternBoostMap = new Map<string, number>();
  try {
    const nicheKey = input.niche.trim().toLowerCase().slice(0, 60);
    const patterns = await prisma.sloganPattern.findMany({
      where: { niche: nicheKey },
      orderBy: { score: "desc" },
      take: 30,
    });
    for (const p of patterns) {
      // Composite boost: Bayesian score factor + CTR engagement + conversion sales proof
      // score 1.0 = neutral, >1 = proven, <1 = underperformer
      const scoreAdj = clamp((p.score - 1.0) * 18, -15, 20);
      const ctrBoost = ((p as unknown as Record<string, number>).ctr ?? 0) * 50;
      const convBoost = ((p as unknown as Record<string, number>).conversion ?? 0) * 100;
      const boost = Math.round(clamp(scoreAdj + ctrBoost + convBoost, -15, 25));
      patternBoostMap.set(p.pattern.toLowerCase(), boost);
    }
  } catch (_) { /* non-blocking — DB may not be seeded yet */ }

  // ── Phase 2: Apply boosts and re-rank ─────────────────────────────────────
  let ranked = base.ranked;
  if (patternBoostMap.size > 0) {
    ranked = base.ranked.map((r) => {
      const patternKey = (r.pattern || detectPattern(r.slogan)).toLowerCase();
      const boost = patternBoostMap.get(patternKey) ?? 0;
      if (boost === 0) return r;
      return { ...r, score: clamp(r.score + boost, 0, 100) };
    });
    ranked = dedupeRanked(sortRanked(ranked));
  }

  // Load learned weights and apply to current ranked set to bias by real performance
  try {
    const learnedWeights = await loadPatternWeights(input.niche);
    if (learnedWeights && Object.keys(learnedWeights).length > 0) {
      ranked = ranked.map((r) => {
        const boosted = applyLearningBoost(r.slogan, r.score, learnedWeights, input.niche);
        const explored = applyExploration(boosted, 0.08); // small epsilon
        return { ...r, score: clamp(Math.round(explored), 0, 100), finalScore: clamp(Math.round(explored), 0, 100) } as RankedSlogan;
      });
      ranked = dedupeRanked(sortRanked(ranked));
    }
  } catch (_) { /* non-blocking */ }

  // ── Phase 2.5: AI-generated niche-specific slogans ─────────────────────────
  try {
    // Sanitize niche before passing to LLM — remove any celebrity/brand names
    const safeNiche = runSafetyEngine(input.niche).sanitizedNiche;
    const nicheCategories = detectNicheCategories(input.niche);

    const dominantClusters = base.ranked
      .flatMap((r) => r.tags ?? [])
      .reduce<Record<string, number>>((acc, tag) => { acc[tag] = (acc[tag] ?? 0) + 1; return acc; }, {});
    const topClusterNames = Object.entries(dominantClusters)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);

    // ── Pattern Expansion (LLM-driven pattern family growth)
    // Use Behavioral Trigger Engine to bias LLM towards behavior-first patterns
    const behaviors = extractBehaviorSignals(input.niche);
    try {
      const expandedPatterns = await expandPatternFamilies(safeNiche, 6, behaviors).catch(() => []);
      const validPatterns = (expandedPatterns || []).filter(isValidPattern).slice(0, 6);
      // --- Mutate top pattern families to discover new idea classes
      let mutatedPatterns: string[] = [];
      try {
        // Prefer DB top patterns (if present), otherwise infer from current ranked set
        let baseFamilies = (await getTopPatterns(safeNiche)).map((p: any) => (p.pattern || String(p).slice(0, 60)));
        if (!baseFamilies || baseFamilies.length === 0) {
          baseFamilies = [...new Set(base.ranked?.slice(0, 12).map((r: any) => r.pattern || detectPattern(r.slogan)))] as string[];
        }
        baseFamilies = baseFamilies.slice(0, 5);

        for (const fam of baseFamilies) {
          const muts = await mutatePatternFamily(fam, safeNiche, 8, behaviors).catch(() => []);
          if (muts && muts.length > 0) mutatedPatterns.push(...muts);
        }
      } catch (_) { /* non-blocking mutation failure */ }

        const validMutations = mutatedPatterns.filter(isValidPattern).slice(0, 18);
      if (validMutations.length > 0) {
        if (!process.env.DISABLE_PATTERN_PERSIST) {
          void Promise.allSettled(validMutations.map((p) => learnPattern(p, undefined, input.niche)));
        }
        // Generate behavioral-first slogans from mutations via LLM (primary)
        const behaviors = extractBehaviorSignals(input.niche);
        let mutatedCandidates: string[] = [];
        try {
          mutatedCandidates = await generateBehavioralSlogans({ niche: input.niche, behaviors: behaviors.concat(validMutations.slice(0, 6)), count: 48 });
        } catch (_) {
          mutatedCandidates = buildFromPatterns(validMutations, input.niche).slice(0, 48).filter(isHumanPhrase);
        }
        if (mutatedCandidates.length > 0) {
          const salesSignals = normalizeSalesSignals(input.salesSignals);
          const mutatedRanked = mutatedCandidates
            .filter((s) => !isGeneric(s))
            .map((slogan) => {
              const scored = scoreSlogan(slogan, salesSignals, base.mode as SloganMode, input.niche, {});
              const mergedFinal = clamp(scored.finalScore, 0, 100);
              const pattern = detectPattern(slogan);
              const reasons = buildReasons({ ...scored, finalScore: mergedFinal } as any);
              const bucket = chooseBucket(mergedFinal, scored.hookScore);
              return {
                ...scored,
                score: mergedFinal,
                finalScore: mergedFinal,
                slogan,
                pattern,
                persona: base.persona,
                personaKey: base.personaKey,
                tags: deriveTags(slogan, input.niche, input.audience),
                reasons,
                salesSignals,
                bucket,
                hasSalesEvidence: false,
              } as RankedSlogan;
            });

        ranked = dedupeRanked(sortRanked([...mutatedRanked, ...ranked]));
        ranked = applyBatchNormalization(ranked);
        }
      }
      if (validPatterns.length > 0) {
        // Persist candidate patterns for future learning (non-blocking)
        // Respect DISABLE_PATTERN_PERSIST to avoid DB writes during test runs
        if (!process.env.DISABLE_PATTERN_PERSIST) {
          void Promise.allSettled(validPatterns.map((p) => learnPattern(p, undefined, input.niche)));
        }

        // Primary: ask LLM to generate behavior-aware slogans from returned patterns
        const behaviors = extractBehaviorSignals(input.niche);
        let expandedCandidates: string[] = [];
        try {
          expandedCandidates = await generateBehavioralSlogans({ niche: input.niche, behaviors: behaviors.concat(validPatterns.slice(0, 4)), count: 24 });
          expandedCandidates = expandedCandidates.filter(isHumanPhrase);
        } catch (_) {
          expandedCandidates = buildFromPatterns(validPatterns, input.niche).slice(0, 24).filter(isHumanPhrase);
        }
        if (expandedCandidates.length > 0) {
          const salesSignals = normalizeSalesSignals(input.salesSignals);
          const expandedRanked = expandedCandidates
            .filter((s) => !isGeneric(s))
            .map((slogan) => {
              const scored = scoreSlogan(slogan, salesSignals, base.mode as SloganMode, input.niche, {});
              const mergedFinal = clamp(scored.finalScore, 0, 100);
              const pattern = detectPattern(slogan);
              const reasons = buildReasons({ ...scored, finalScore: mergedFinal } as any);
              const bucket = chooseBucket(mergedFinal, scored.hookScore);
              return {
                ...scored,
                score: mergedFinal,
                finalScore: mergedFinal,
                slogan,
                pattern,
                persona: base.persona,
                personaKey: base.personaKey,
                tags: deriveTags(slogan, input.niche, input.audience),
                reasons,
                salesSignals,
                bucket,
                hasSalesEvidence: false,
              } as RankedSlogan;
            });

          ranked = dedupeRanked(sortRanked([...expandedRanked, ...ranked]));
          ranked = applyBatchNormalization(ranked);
        }
      }
    } catch (_) { /* non-blocking pattern expansion failure */ }

    const rawAiSlogans = await generateAISlogans(
      safeNiche,
      input.audience,
      base.persona,
      base.mode as SloganMode,
      topClusterNames,
    );

    // Enhancement layer: safety filter → punchier transforms → cross-niche sort
    const { slogans: aiSlogans } = filterAndEnhanceSlogans(rawAiSlogans, input.niche);

    if (aiSlogans.length > 0) {
      const salesSignals = normalizeSalesSignals(input.salesSignals);
      const usedFps = new Set<string>(ranked.map((r) => patternFingerprint(r.slogan)));
      // Compute batch statistics for dynamic cliché suppression
      const wordFreq: Record<string, number> = {};
      rawAiSlogans.forEach((s) => {
        s.toLowerCase().split(/\s+/).forEach((w) => {
          wordFreq[w] = (wordFreq[w] ?? 0) + (1 / rawAiSlogans.length);
        });
      });

      const aiRanked: RankedSlogan[] = aiSlogans
        .filter((slogan) => !isGeneric(slogan))
        .map((slogan) => {
        const scored = scoreSlogan(slogan, salesSignals, base.mode as SloganMode, input.niche, wordFreq, []);
        // Merit-based bonuses (no flat +8 bias):
        const specificityBonus = computeNicheSpecificity(slogan, input.niche);
        const intensityBonus = computeEmotionalIntensity(slogan);
        const noveltyBonus = computeNoveltyBonus(slogan, usedFps);
        // Cross-niche bonus: rewards slogans that naturally cover both niche dimensions
        const crossNicheBonus = scoreCrossNicheAlignment(slogan, nicheCategories as NicheCategory[]);
        const mergedFinal = clamp(scored.finalScore + specificityBonus + intensityBonus + noveltyBonus + crossNicheBonus, 0, 100);
        const pattern = detectPattern(slogan);
        const reasons = buildReasons({ ...scored, finalScore: mergedFinal });
        const bucket = chooseBucket(mergedFinal, scored.hookScore);
        return {
          ...scored,
          score: mergedFinal,
          finalScore: mergedFinal,
          slogan,
          pattern,
          persona: base.persona,
          personaKey: base.personaKey,
          tags: deriveTags(slogan, input.niche, input.audience),
          reasons,
          salesSignals,
          bucket,
          hasSalesEvidence: false,
        };
      });
        ranked = dedupeRanked(sortRanked([...aiRanked, ...ranked]));
        // Re-normalize after merging AI-generated slogans and applying pattern boosts
        ranked = applyBatchNormalization(ranked);
    }
  } catch (_) { /* non-blocking — AI generation is additive only */ }

  // Apply post-generation safety filter to the full ranked set
  // (template slogans can't contain IP, but filter is cheap and defensive)
  ranked = ranked.filter((r) => isSafeSlogan(r.slogan));

  // Remove overly-generic brandy lines before final ranking
  ranked = ranked.filter((r) => !isTooGeneric(r.slogan));

  // ── Phase 2.75: Cost-controlled LLM refinement of top candidates ───────
  try {
    const execModeForLLM = (input as any).execMode || (((input as any).context && resolveExecMode((input as any).context)) as ExecMode) || "balanced";
    const llmThreshold = execModeForLLM === "elite" ? 68 : 76; // lower threshold for elite mode
    const maxRefine = execModeForLLM === "elite" ? 8 : 4;

    const refineCandidates = ranked.filter((r) => r.score >= llmThreshold).slice(0, maxRefine);
    if (refineCandidates.length > 0) {
      const toRefine = dedupeStrings(refineCandidates.map((r) => r.slogan)).slice(0, maxRefine);
      const refined = await refineWithGPT4o(toRefine, input.niche, input.audience).catch(() => []);

      if (Array.isArray(refined) && refined.length > 0) {
        const salesSignals = normalizeSalesSignals(input.salesSignals);
        const rescored: RankedSlogan[] = [];

        for (let i = 0; i < toRefine.length; i++) {
          const original = refineCandidates.find((c) => c.slogan === toRefine[i]);
          const newText = cleanSlogan(refined[i] || toRefine[i]);
          const scored = scoreSlogan(newText, salesSignals, base.mode as SloganMode, input.niche, {});
          const mergedFinal = clamp(Math.round(scored.finalScore), 0, 100);
          rescored.push({
            ...scored,
            slogan: newText,
            score: mergedFinal,
            finalScore: mergedFinal,
            pattern: detectPattern(newText),
            persona: base.persona,
            personaKey: base.personaKey,
            tags: deriveTags(newText, input.niche, input.audience),
            reasons: buildReasons(scored),
            salesSignals,
            bucket: chooseBucket(mergedFinal, scored.hookScore),
            hasSalesEvidence: original?.hasSalesEvidence ?? false,
          } as RankedSlogan);
        }

        // Remove originals with same pattern fingerprint to avoid duplicates, then merge refined
        const removeFp = new Set(refineCandidates.map((c) => patternFingerprint(c.slogan)));
        ranked = ranked.filter((r) => !removeFp.has(patternFingerprint(r.slogan)));
        ranked = dedupeRanked(sortRanked([...rescored, ...ranked]));
      }
    }
  } catch (_) {
    /* non-blocking: if refinement fails, continue with original ranked set */
  }

  // ── Phase 3: Rebuild collections and top-10 from re-ranked list ───────────
  const collections = buildCollections(ranked);
  
  const ELITE_THRESHOLD = 72;
  const eliteSloganObjs = ranked.filter((s) => s.score >= ELITE_THRESHOLD);
  const finalSloganObjs = eliteSloganObjs.length >= 5 ? eliteSloganObjs.slice(0, 5) : ranked.slice(0, 5);
  const topSlogans = dedupeStrings(finalSloganObjs.map((r) => r.slogan));

  // ── Phase 4: Write best-performing pattern back to DB for future runs ──────
    try {
    const topSlogan = topSlogans[0];
    if (topSlogan) {
      const tasks: Promise<any>[] = [syncMarketplace(input.niche, topSlogan)];
      if (!process.env.DISABLE_PATTERN_PERSIST) tasks.push(learnPattern(detectPattern(topSlogan), topSlogan, input.niche));
      await Promise.allSettled(tasks);
    }
  } catch (_) { /* non-blocking */ }

  return { ...base, slogans: topSlogans, ranked, collections };
}

// ─── Execution Mode & Helpers ───────────────────────────────────────────────

export type ExecMode = "fast" | "balanced" | "elite";

function resolveExecMode(context?: string, requested?: ExecMode): ExecMode {
  if (requested) return requested;
  if (!context) return "balanced";
  const ctx = context.toLowerCase();
  if (ctx === "bulk") return "fast";
  if (ctx === "dashboard") return "balanced";
  if (ctx === "design_studio" || ctx === "autopilot") return "elite";
  return "balanced";
}

function normalizeResult(result: SloganEngineResult): SloganEngineResult {
  // Ensure collections sizes are bounded and slogans deduped
  const topPicks = (result.collections.topPicks || []).slice(0, 5);
  const boldPicks = (result.collections.boldPicks || []).slice(0, 5);
  const experimental = (result.collections.experimental || []).slice(0, 3);
  const dedupedSlogans = dedupeStrings(result.slogans || []).slice(0, 10);
  return {
    ...result,
    slogans: dedupedSlogans,
    collections: { topPicks, boldPicks, experimental },
  };
}

/**
 * Centralized entrypoint for dynamic, market-aware slogan generation.
 * Supports execution modes for performance control and uses `globalCache`.
 */
export async function generateHighPotentialSlogans(
  input: SloganEngineInput & { execMode?: ExecMode; context?: string; cacheTtlSec?: number },
): Promise<SloganEngineResult> {
  const execMode = resolveExecMode(input.context, input.execMode);
  const nicheKey = (input.niche || "").trim().toLowerCase().slice(0, 60);
  const audienceKey = (input.audience || "").trim().toLowerCase().slice(0, 40);
  const cacheKey = `slogans:${nicheKey}:${audienceKey}:${execMode}`;

  // Try in-memory/Redis cache (async read for cold-starts)
  try {
    const cached = await globalCache.getAsync(cacheKey);
    if (cached && typeof cached === "object") {
      return cached as SloganEngineResult;
    }
  } catch {
    // ignore cache failures — non-blocking
  }

  // Map execMode -> behavior
  const modeMap: Record<ExecMode, SloganMode> = {
    fast: "safe",
    balanced: "viral",
    elite: "edgy",
  };

  const ttlMap: Record<ExecMode, number> = {
    fast: (30) * 1000,
    balanced: (300) * 1000,
    elite: (3600) * 1000,
  };

  let result: SloganEngineResult;
  if (execMode === "fast") {
    // Template-first, synchronous generation (low cost)
    const fastInput: SloganEngineInput = { ...input, mode: modeMap[execMode] };
    result = buildEliteSloganEngine(fastInput);
  } else {
    // Balanced/elite: run the full async pipeline
    const asyncInput: SloganEngineInput = { ...input, mode: modeMap[execMode] };
    result = await runEliteSloganEngine(asyncInput);
  }

  const normalized = normalizeResult(result);

  // Persist to cache (memory-first with Redis write-through)
  try {
    globalCache.set(cacheKey, normalized, input.cacheTtlSec ? input.cacheTtlSec * 1000 : ttlMap[execMode]);
  } catch {
    // swallow cache write errors
  }

  return normalized;
}

/**
 * Async helper: generate high-potential, niche-specific slogans using the
 * full AI-driven pipeline. Prefer this when you want dynamic, AI-generated
 * slogans rather than the synchronous template-first `enhanceSlogans`.
 */
// (previous simple wrapper removed — use generateHighPotentialSlogans with execMode/context)

export function generateDynamicSlogans(input: SloganEngineInput): string[] {
  const { niche, audience, mode: modeInput } = input;
  const mode = normalizeMode(modeInput);
  const persona = inferPersona(niche, audience);
  const lexicon = buildNicheLexicon(input, persona, mode);
  const identities = dedupeStrings([...deriveNicheIdentities(niche, persona.key), ...lexicon.anchors]).slice(0, 6);
  const emotions = dedupeStrings([...deriveNicheEmotions(niche, persona.key), ...lexicon.emotionWords]).slice(0, 6);
  return dedupeStrings(buildNicheSlogans(niche, identities, emotions, mode, audience, normalizeSalesSignals(input.salesSignals))).slice(0, 24);
}

export function extractPersonas(niche: string, audience?: string): string[] {
  return [inferPersona(niche, audience).label];
}

export function extractEmotions(niche: string, audience?: string): string[] {
  const persona = inferPersona(niche, audience);
  return buildNicheLexicon({ niche, audience }, persona, "safe").emotionWords;
}

export function generateVariants(slogan: string): string[] {
  const variants = [
    slogan,
    slogan.toUpperCase(),
    slogan.replace(/\.$/, "!"),
    `The real ${slogan.toLowerCase()}`,
    `Still ${slogan.toLowerCase()}`,
  ];
  return dedupeStrings(variants).filter((v) => v.split(/\s+/).length <= 10);
}

function sentenceCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function describeStyle(style?: string): string {
  const value = style?.trim();
  if (!value) return "Bold Graphic";
  return value;
}

function buildPromptDescription(style?: string, niche?: string): string {
  const styleValue = style?.trim() || "Bold Graphic";
  const nicheValue = niche?.trim() || "the niche";
  const lowerStyle = styleValue.toLowerCase();

  if (lowerStyle.includes("vintage distressed")) {
    return `A distressed vintage typography concept with subtle retro texture and niche-specific supporting elements for ${nicheValue}.`;
  }
  if (lowerStyle.includes("hand-drawn")) {
    return `A hand-drawn illustration layout with expressive linework and niche-specific icons built around the text for ${nicheValue}.`;
  }
  if (lowerStyle.includes("retro vintage")) {
    return `A retro vintage composition with faded color blocking, nostalgic shapes, and niche-specific graphic accents for ${nicheValue}.`;
  }
  if (lowerStyle.includes("minimalist vector")) {
    return `A minimalist vector layout with clean shapes, strong spacing, and a simple niche-specific icon system for ${nicheValue}.`;
  }
  return `A bold commercial t-shirt composition with niche-specific supporting graphics and a clear typographic focal point for ${nicheValue}.`;
}

function normalizePromptBody(body: string): string {
  return body
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?:;])/g, "$1")
    .trim();
}

function extractPromptDescription(prompt: string, slogan: string, style?: string, niche?: string): string {
  const styleLineMatch = prompt.match(/Style:\s*(?:\[STYLE\]|[^—\n]+)?(?:\s*—\s*([^\n]+))?/i);
  if (styleLineMatch?.[1]?.trim()) {
    return normalizePromptBody(styleLineMatch[1]);
  }

  const withoutStandards = prompt
    .replace(/Create an original POD t-shirt design\.?/gi, "")
    .replace(/Text:\s*"[^"]*"/gi, "")
    .replace(/Style:\s*[^\n]+/gi, "")
    .replace(/No brands, logos, or trademarks\.?/gi, "")
    .replace(/Transparent background\.?/gi, "")
    .replace(/Commercial friendly\.?/gi, "")
    .replace(/300 DPI\.?/gi, "")
    .replace(/[\r\n]+/g, " ")
    .trim();

  let normalized = normalizePromptBody(withoutStandards);
  if (!normalized) return "";

  const sloganPattern = new RegExp(`^${slogan.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\s*[—:-]?\s*`, "i");
  normalized = normalized.replace(sloganPattern, "").trim();

  const styleValue = style?.trim();
  if (styleValue) {
    const loweredStyle = styleValue.toLowerCase();
    normalized = normalized
      .replace(new RegExp(`${loweredStyle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\s+style`, "i"), "")
      .replace(new RegExp(styleValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "")
      .trim();
  }

  if (niche) {
    normalized = normalized.replace(new RegExp(`for\s+${niche.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"), "").trim();
  }

  normalized = normalized
    .replace(/^t-shirt graphic\s*/i, "")
    .replace(/^graphic\s*/i, "")
    .replace(/^for\s+/i, "")
    .replace(/^[-—,:;]+/, "")
    .trim();

  if (/t-shirt graphic/i.test(normalized) || /\bstyle\b/i.test(normalized) && normalized.split(/\s+/).length <= 8) {
    return "";
  }

  return normalized;
}

function buildStructuredImagePrompt(slogan: string, description: string, style?: string): string {
  const finalDescription = sentenceCase(description.replace(/[.\s]*$/, ""));
  return [
    "Create an original POD t-shirt design.",
    `Text: \"${slogan}\"`,
    `Style: [STYLE] — ${finalDescription}.`,
    "No brands, logos, or trademarks.",
    "Transparent background.",
    "Commercial friendly.",
    "300 DPI.",
  ].join("\n");
}

export function normalizeImagePrompts(slogans: string[], prompts: unknown, style?: string, niche?: string): string[] {
  const rawPrompts = Array.isArray(prompts) ? prompts : [];
  return slogans.map((slogan, i) => {
    const base = typeof rawPrompts[i] === "string" && rawPrompts[i].trim() ? rawPrompts[i].trim() : "";
    const description = extractPromptDescription(base, slogan, style, niche) || buildPromptDescription(style, niche);
    const structured = buildStructuredImagePrompt(slogan, description, style);
    return structured.replace(/\[STYLE\]/g, describeStyle(style));
  });
}

export async function learnPattern(pattern: string, slogan?: string, niche?: string): Promise<boolean> {
  try {
    const cleanPattern = pattern.trim().toLowerCase().slice(0, 80);
    const nicheKey = (niche || "global").trim().toLowerCase().slice(0, 60);
    await prisma.sloganPattern.upsert({
      where: { niche_pattern: { niche: nicheKey, pattern: cleanPattern } },
      update: { uses: { increment: 1 }, lastSlogan: slogan?.slice(0, 120) },
      create: { niche: nicheKey, pattern: cleanPattern, score: 1.0, uses: 1, lastSlogan: slogan?.slice(0, 120), nicheHints: [] },
    });
    return true;
  } catch (_) {
    return false;
  }
}

export async function getPatternScore(nicheOrPattern: string, maybePattern?: string): Promise<number> {
  try {
    const niche = maybePattern ? nicheOrPattern.trim().toLowerCase() : "global";
    const pattern = (maybePattern || nicheOrPattern).trim().toLowerCase();
    const row = await prisma.sloganPattern.findUnique({
      where: { niche_pattern: { niche, pattern } },
    });
    return row ? clamp(row.score * 50 + row.uses * 2, 0, 100) : heuristicPatternScore(pattern) * 0.8;
  } catch (_) {
    return 50;
  }
}

export async function predictVirality(slogan: string, niche: string, tags?: string[]): Promise<number> {
  const hook = computeHookScore(slogan);
  const curiosity = computeCuriosityGap(slogan);
  const patternBoost = heuristicPatternScore(slogan);
  const tagBoost = (tags || []).length * 3;
  return clamp(Math.round((hook + curiosity + patternBoost) / 3 + tagBoost), 0, 100);
}

export async function getTrendScore(niche: string, tags?: string[]): Promise<number> {
  try {
    const nicheKey = niche.trim().toLowerCase();
    const recent = await prisma.marketSignal.findFirst({
      where: { niche: nicheKey },
      orderBy: { observedAt: "desc" },
    });
    if (recent) return clamp(Math.round(recent.score * 100), 0, 100);
  } catch (_) { /* fallback */ }
  return clamp(50 + (tags || []).length * 3, 0, 100);
}

export async function syncMarketplace(niche: string, slogan?: string): Promise<{ marketScore: number; reason: string }> {
  const nicheKey = niche.trim().toLowerCase();
  const score = clamp(Math.random() * 0.4 + 0.55, 0, 1);
  try {
    await prisma.marketSignal.create({
      data: {
        niche: nicheKey,
        text: slogan || niche,
        source: "internal_sync",
        score,
        confidence: 0.7,
        nicheKey,
        sloganKey: normalizeKeyword(slogan || niche).slice(0, 80),
      },
    });
  } catch (_) { /* ignore duplicate */ }
  return { marketScore: Math.round(score * 100), reason: "Simulated market baseline" };
}
