"use strict";
/**
 * Slogan Enhancement Layer
 *
 * Sits between raw LLM output and the scoring pipeline.
 * Responsibilities:
 *  1. Post-generation trademark/IP safety filter
 *  2. Structural "punch" transforms (tighten rhythm, cut fluff)
 *  3. Cross-niche intelligence — detect dual-category niches and
 *     score slogans that naturally bridge both categories higher
 *  4. Final dedup + safety-ordered output
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectNicheCategories = detectNicheCategories;
exports.getCategoryVocab = getCategoryVocab;
exports.isSafeSlogan = isSafeSlogan;
exports.isWearable = isWearable;
exports.transformStatement = transformStatement;
exports.makePunchier = makePunchier;
exports.makeConversational = makeConversational;
exports.scoreCrossNicheAlignment = scoreCrossNicheAlignment;
exports.coversAtLeastOneCategory = coversAtLeastOneCategory;
exports.filterAndEnhanceSlogans = filterAndEnhanceSlogans;
// ─── Niche Category Registry ─────────────────────────────────────────────────
const NICHE_CATEGORY_KEYWORDS = {
    gardening: ["garden", "plant", "grow", "soil", "seed", "bloom", "roots", "herb", "harvest", "weed", "compost", "raised bed", "sprout"],
    "true crime": ["crime", "mystery", "case", "murder", "suspect", "detective", "clue", "evidence", "solved", "cold case", "killer", "suspect"],
    gaming: ["game", "gaming", "level", "player", "quest", "boss", "respawn", "raid", "controller", "grind", "loot", "prestige"],
    coffee: ["coffee", "brew", "espresso", "roast", "bean", "barista", "latte", "cafe", "grind", "pour over", "drip"],
    fitness: ["gym", "lift", "gains", "rep", "workout", "sweat", "strength", "cardio", "pr", "pump", "grind"],
    reading: ["book", "read", "chapter", "author", "library", "novel", "page", "plot", "literary", "shelf", "spine"],
    cooking: ["cook", "chef", "recipe", "kitchen", "bake", "flavor", "taste", "dish", "spice", "grill", "sauté"],
    travel: ["travel", "adventure", "explore", "wander", "trip", "journey", "road", "destination", "passport", "roam"],
    cats: ["cat", "feline", "kitten", "meow", "paw", "whisker", "purr", "tabby"],
    dogs: ["dog", "canine", "puppy", "bark", "woof", "fetch", "paw", "leash", "wag"],
    yoga: ["yoga", "mindful", "stretch", "breathe", "pose", "flow", "meditate", "zen", "asana"],
    photography: ["photo", "camera", "shoot", "lens", "capture", "frame", "exposure", "shutter", "aperture"],
    music: ["music", "song", "band", "melody", "beat", "rhythm", "sound", "concert", "playlist", "riff"],
    art: ["art", "paint", "draw", "sketch", "canvas", "brush", "create", "design", "craft", "studio"],
    running: ["run", "runner", "mile", "race", "marathon", "sprint", "pace", "trail", "finish line", "stride"],
    hiking: ["hike", "trail", "mountain", "summit", "trek", "camp", "backpack", "peak", "wilderness"],
    fishing: ["fish", "fishing", "cast", "reel", "lure", "tackle", "catch", "bait", "hook", "rod"],
    cycling: ["bike", "cycle", "cycling", "pedal", "ride", "gear", "chain", "velodrome", "saddle", "fixie"],
    sustainability: ["sustainable", "eco", "green", "zero waste", "recycle", "organic", "planet", "climate", "reuse"],
    booktoker: ["booktok", "tiktok reader", "bookstagram", "unboxing", "haul", "arc", "backlist", "tbr"],
    fashion: ["fashion", "style", "outfit", "trend", "look", "aesthetic", "wear", "fit", "drip", "slay"],
};
// ─── Category Detection ───────────────────────────────────────────────────────
/**
 * Detect which semantic categories the niche phrase belongs to.
 * Returns up to 3 most-represented categories.
 */
function detectNicheCategories(niche) {
    const lower = niche.toLowerCase();
    const scored = Object.entries(NICHE_CATEGORY_KEYWORDS)
        .map(([cat, words]) => ({
        cat: cat,
        hits: words.filter((w) => lower.includes(w)).length,
    }))
        .filter(({ hits }) => hits > 0)
        .sort((a, b) => b.hits - a.hits);
    return scored.slice(0, 3).map(({ cat }) => cat);
}
/**
 * Returns the signature vocabulary for a set of categories —
 * 3 words per category, useful for prompt injection.
 */
function getCategoryVocab(categories) {
    const vocab = [];
    for (const cat of categories) {
        vocab.push(...(NICHE_CATEGORY_KEYWORDS[cat] ?? []).slice(0, 3));
    }
    return [...new Set(vocab)];
}
// ─── Post-Generation Safety Filter ───────────────────────────────────────────
/**
 * Banned IP/trademark terms that GPT may accidentally embed in slogans.
 * These are specific enough to avoid false positives on common words.
 */
const SLOGAN_BANNED_TERMS = [
    // True crime IP
    "making a murderer", "true detective", "forensic files", "law & order",
    "mindhunter", "confession tapes", "unsolved mysteries", "cold justice",
    // Apparel brands
    "nike", "adidas", "under armour", "supreme", "gucci", "louis vuitton",
    "balenciaga", "off-white", "yeezy", "jordan brand",
    // Gaming IP
    "minecraft", "fortnite", "pokemon", "zelda", "mario", "call of duty",
    "among us", "roblox",
    // Streaming/media
    "netflix", "hulu", "disney", "disney+", "amazon prime",
    // Books
    "harry potter", "game of thrones", "hunger games",
    // Sports IP
    "blue jays", "toronto blue jays", "maple leafs", "toronto raptors", "raptors",
    "lakers", "los angeles lakers", "yankees", "red sox", "dodgers", "cubs",
    "cowboys", "patriots", "packers", "steelers", "eagles", "49ers", "chiefs",
    "nba", "nfl", "mlb", "nhl", "super bowl", "world series", "march madness",
];
/**
 * Modifier adjectives that should not appear as the first word of a scaffold
 * object slot — mirrors the same set in sloganEngine.ts.
 */
const SCAFFOLD_MODIFIER_ADJECTIVES = new Set([
    "funny", "cute", "silly", "lazy", "crazy", "weird", "strange", "adorable",
    "pretty", "beautiful", "ugly", "big", "small", "tall", "short", "fast", "slow",
    "happy", "sad", "angry", "excited", "tired", "bored", "cool", "hot", "cold",
    "warm", "bright", "dark", "light", "heavy", "thin", "thick", "young", "old",
    "new", "fresh", "sweet", "sour", "spicy", "mild", "good", "bad", "great",
    "awful", "random", "extra", "basic", "top", "little", "tiny", "huge", "giant",
    "loud", "quiet", "quick", "rough", "soft", "hard", "easy", "cheap", "free",
    "rich", "poor", "busy", "late", "early", "raw",
]);
/**
 * Returns true when the slogan is commercially safe AND structurally wearable.
 * Catches GPT outputs that ignore the forbidden-pattern instructions.
 */
function isSafeSlogan(slogan) {
    const lower = slogan.toLowerCase().trim();
    // Trademark / IP check
    if (SLOGAN_BANNED_TERMS.some((term) => lower.includes(term)))
        return false;
    // Trademark symbols (explicit) — treat as unsafe
    if (/\u2122|\u00AE|\btm\b|\br\b/i.test(slogan))
        return false;
    // Run entity detector for known brands/celebrities/movies
    try {
        // Import runSafetyEngine lazily to avoid circular imports at module load
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { runSafetyEngine } = require("./safetyEngine");
        const safety = runSafetyEngine(slogan || "");
        if (safety && (safety.flaggedEntities || []).length > 0)
            return false;
    }
    catch (_err) {
        // If safety engine not available, continue with existing checks
    }
    // Reject scaffold patterns with adjective-first objects (GPT ignores the ban sometimes)
    const scaffoldMatch = lower.match(/^(?:built|made)\s+for\s+(.+?)[\.!,]?$/);
    if (scaffoldMatch) {
        const obj = scaffoldMatch[1].trim();
        const firstWord = obj.split(/\s+/)[0];
        if (SCAFFOLD_MODIFIER_ADJECTIVES.has(firstWord))
            return false;
    }
    // Reject "X > Y" where X is a raw adjective+noun (not a proper contrast frame)
    if (lower.includes(" > ")) {
        const lhs = lower.split(" > ")[0].trim();
        const lhsFirst = lhs.split(/\s+/)[0];
        // Allow "X > Y" only when LHS is clearly an activity/lifestyle word, not a raw adjective
        if (SCAFFOLD_MODIFIER_ADJECTIVES.has(lhsFirst))
            return false;
    }
    return true;
}
/**
 * Wearability Filter: Ensures slogans are punchy and wearable, not descriptive.
 * Rejects long sentences, trailing periods, and typical "AI description" prefixes.
 */
function isWearable(s) {
    const trimmed = s.trim();
    if (!trimmed)
        return false;
    // Reject long "paragraphs"
    if (trimmed.length > 60)
        return false;
    if (trimmed.split(/\s+/).length > 10)
        return false;
    // Elite Hard Condition: No periods allowed in wearable slogans
    if (/[.]{1,}/.test(trimmed))
        return false;
    // Visual Symmetry: Reject orphan words/single-word lines in a multi-line context
    // (In our case, we just reject single-word slogans as they lack "merch depth")
    if (trimmed.split(/\s+/).length === 1)
        return false;
    // Reject "I am" / "This is" - these are usually statement/description patterns
    const lower = trimmed.toLowerCase();
    if (/^i am|^this is/i.test(lower))
        return false;
    return true;
}
/**
 * Statement → Slogan Transformer
 * Proactively strips "I am a" and trailing periods from incoming draft candidates.
 */
function transformStatement(s) {
    let transformed = s.trim();
    if (transformed.toLowerCase().startsWith("i am a ")) {
        transformed = transformed.replace(/^i am a /i, "");
    }
    else if (transformed.toLowerCase().startsWith("i am ")) {
        transformed = transformed.replace(/^i am /i, "");
    }
    // Strip trailing period if exists
    transformed = transformed.replace(/\.+$/, "");
    return transformed.charAt(0).toUpperCase() + transformed.slice(1);
}
/**
 * Tidy post-processing to remove awkward fragments produced by templates or the LLM.
 * - Drops trailing sentence fragments after periods
 * - Removes single-word trailing adjectives like "clean" or "wearable"
 * - Removes awkward scaffold tokens like "identity" when used as a suffix
 */
function tidySlogan(s) {
    if (!s)
        return s;
    let t = s.trim();
    // Use first sentence only
    if (t.includes('.')) {
        t = t.split('.').map(p => p.trim()).filter(Boolean)[0] || t;
    }
    // Normalize spacing and punctuation
    t = t.replace(/[.!,]+$/g, '').replace(/\s+/g, ' ').trim();
    const lower = t.toLowerCase();
    // Remove terminal scaffold words that often leak from templates
    const suffixRemovals = ['identity', 'identity.', 'signal', 'clean', 'wearable', 'commercial', 'graphic'];
    const parts = t.split(/\s+/);
    const last = parts[parts.length - 1].toLowerCase();
    if (suffixRemovals.includes(last)) {
        parts.pop();
        t = parts.join(' ');
    }
    // Remove lone trailing single-word fragments like "Identity" appearing after a noun
    t = t.replace(/\b(Identity|identity)\b\s*$/i, '').trim();
    // Collapse stray leading verbs with proper casing
    t = t.replace(/\s+/g, ' ').trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
}
// ─── Punch Transforms ────────────────────────────────────────────────────────
/**
 * Tighten rhythm: replace weak filler words and connectors that dilute punch.
 * Only replaces when it cannot change the slogan's meaning.
 */
function makePunchier(slogan) {
    // First apply conversational layer
    let tightened = makeConversational(slogan);
    return tightened
        // "X and Y" → "X & Y" (keeps brevity)
        .replace(/\b and \b/g, " & ")
        // Robust cleanup pipeline for periods and spacing
        .replace(/[.]+$/, "")
        .replace(/\s+/g, " ")
        .trim();
}
/**
 * Conversational Layer: Ensures slogans sound like human speech, not a textbook.
 */
function makeConversational(s) {
    return s
        .replace(/\bI am\b/g, "I'm")
        .replace(/\bdo not\b/gi, "don't")
        .replace(/\bcannot\b/gi, "can't")
        .replace(/\bwill not\b/gi, "won't")
        .replace(/\bis not\b/gi, "isn't")
        .replace(/\bI would rather\b/gi, "I'd rather")
        .replace(/\bLet me\b/gi, "Lemme");
}
// ─── Cross-Niche Intelligence ─────────────────────────────────────────────────
/**
 * Score how well a slogan covers the detected niche categories.
 * Dual-category slogans (e.g. "Grow plants, solve crimes") score highest.
 */
function scoreCrossNicheAlignment(slogan, categories) {
    if (categories.length === 0)
        return 0;
    const lower = slogan.toLowerCase();
    const coveredCount = categories.filter((cat) => (NICHE_CATEGORY_KEYWORDS[cat] ?? []).some((w) => lower.includes(w))).length;
    if (coveredCount >= 2)
        return 20;
    if (coveredCount === 1)
        return 8;
    return 0;
}
/**
 * Returns true if a slogan covers at least one of the major categories
 * (used to deprioritise totally off-niche slogans, not to eliminate them).
 */
function coversAtLeastOneCategory(slogan, categories) {
    if (categories.length === 0)
        return true;
    const lower = slogan.toLowerCase();
    return categories.some((cat) => (NICHE_CATEGORY_KEYWORDS[cat] ?? []).some((w) => lower.includes(w)));
}
// ─── Main Orchestrator ────────────────────────────────────────────────────────
/**
 * Full enhancement pipeline:
 *   1. Filter unsafe slogans
 *   2. Apply punchier transforms (generating variants only when different)
 *   3. Sort: dual-category coverage first, then single-category, then generic
 *   4. Deduplicate
 */
function filterAndEnhanceSlogans(slogans, niche) {
    const categories = detectNicheCategories(niche);
    const isDualNiche = categories.length >= 2;
    // Step 1: safety filter and wearability check
    const safe = slogans.filter(isSafeSlogan).filter(isWearable);
    // Step 2: enhance + deduplicate
    const seen = new Set();
    const enhanced = [];
    for (const s of safe) {
        // Run final tidy transform to clean awkward fragments before storing
        const cleaned = tidySlogan(makePunchier(transformStatement(s)));
        const key = cleaned.toLowerCase().trim();
        if (seen.has(key))
            continue;
        seen.add(key);
        enhanced.push(cleaned);
        // Generate punchier variant — only add if it's genuinely different
        // We already generated a punchier cleaned variant above and added it
    }
    // Step 3: sort by cross-niche alignment (higher = more niche-specific)
    const sorted = [...enhanced].sort((a, b) => scoreCrossNicheAlignment(b, categories) - scoreCrossNicheAlignment(a, categories));
    return { slogans: sorted, categories, isDualNiche };
}
