/**
 * Commercial Safety Engine
 * Detects restricted entities (celebrities, athletes, brands, IP) in niche names
 * and auto-rewrites them to legally safe, sellable alternatives.
 */

export type EntityType =
  | "athlete"
  | "celebrity"
  | "political"
  | "brand"
  | "movie"
  | "tv"
  | "event";

export interface FlaggedEntity {
  value: string;
  type: EntityType;
  replacement: string;
}

export interface SafetyResult {
  safe: boolean;
  modified: boolean;
  riskScore: number;
  sanitizedNiche: string;
  originalNiche: string;
  flaggedEntities: FlaggedEntity[];
}

interface EntityPattern {
  pattern: RegExp;
  type: EntityType;
  replacement: string;
}

// ─── Entity Registry ──────────────────────────────────────────────────────────

const ENTITY_PATTERNS: EntityPattern[] = [
  // ── Athletes: Golf ──────────────────────────────────────────────────────────
  { pattern: /\bTiger Woods\b/gi,               type: "athlete",   replacement: "Golf Legend" },
  { pattern: /\bRory McIlroy\b/gi,              type: "athlete",   replacement: "Pro Golfer" },
  { pattern: /\bPhil Mickelson\b/gi,            type: "athlete",   replacement: "Pro Golfer" },
  { pattern: /\bDustin Johnson\b/gi,            type: "athlete",   replacement: "Pro Golfer" },
  { pattern: /\bJon Rahm\b/gi,                  type: "athlete",   replacement: "Pro Golfer" },

  // ── Athletes: Basketball ────────────────────────────────────────────────────
  { pattern: /\bLeBron James\b/gi,              type: "athlete",   replacement: "Basketball Icon" },
  { pattern: /\bMichael Jordan\b/gi,            type: "athlete",   replacement: "Basketball Legend" },
  { pattern: /\bKobe Bryant\b/gi,               type: "athlete",   replacement: "Basketball Legend" },
  { pattern: /\bSteph(?:en)? Curry\b/gi,        type: "athlete",   replacement: "Star Point Guard" },
  { pattern: /\bGiannis Antetokounmpo\b/gi,     type: "athlete",   replacement: "Basketball Star" },
  { pattern: /\bGiannis\b/gi,                   type: "athlete",   replacement: "Basketball Star" },
  { pattern: /\bKevin Durant\b/gi,              type: "athlete",   replacement: "NBA Star" },
  { pattern: /\bJames Harden\b/gi,              type: "athlete",   replacement: "NBA Star" },
  { pattern: /\bShaquille O['']?Neal\b/gi,      type: "athlete",   replacement: "Basketball Icon" },
  { pattern: /\bShaq\b/gi,                      type: "athlete",   replacement: "Basketball Icon" },
  { pattern: /\bDirk Nowitzki\b/gi,             type: "athlete",   replacement: "Basketball Legend" },

  // ── Athletes: American Football ─────────────────────────────────────────────
  { pattern: /\bTom Brady\b/gi,                 type: "athlete",   replacement: "Football Legend" },
  { pattern: /\bPatrick Mahomes\b/gi,           type: "athlete",   replacement: "Star Quarterback" },
  { pattern: /\bAaron Rodgers\b/gi,             type: "athlete",   replacement: "Star Quarterback" },
  { pattern: /\bPeyton Manning\b/gi,            type: "athlete",   replacement: "Football Legend" },
  { pattern: /\bJerry Rice\b/gi,                type: "athlete",   replacement: "Football Legend" },
  { pattern: /\bLamar Jackson\b/gi,             type: "athlete",   replacement: "Star Quarterback" },
  { pattern: /\bDerrick Henry\b/gi,             type: "athlete",   replacement: "Star Running Back" },
  { pattern: /\bJustin Jefferson\b/gi,          type: "athlete",   replacement: "Star Wide Receiver" },
  { pattern: /\bTravis Kelce\b/gi,              type: "athlete",   replacement: "Star Tight End" },

  // ── Athletes: Soccer ───────────────────────────────────────────────────────
  { pattern: /\bCristiano Ronaldo\b/gi,         type: "athlete",   replacement: "Soccer Legend" },
  { pattern: /\bLionel Messi\b/gi,              type: "athlete",   replacement: "Soccer Icon" },
  { pattern: /\bNeymar(?:\s+Jr\.?)?\b/gi,       type: "athlete",   replacement: "Soccer Star" },
  { pattern: /\bMbapp[eé]\b/gi,                 type: "athlete",   replacement: "Soccer Star" },
  { pattern: /\bDavid Beckham\b/gi,             type: "athlete",   replacement: "Soccer Icon" },
  { pattern: /\bZinedine Zidane\b/gi,           type: "athlete",   replacement: "Soccer Legend" },

  // ── Athletes: Baseball ─────────────────────────────────────────────────────
  { pattern: /\bBabe Ruth\b/gi,                 type: "athlete",   replacement: "Baseball Legend" },
  { pattern: /\bMike Trout\b/gi,                type: "athlete",   replacement: "Baseball Star" },
  { pattern: /\bShohei Ohtani\b/gi,             type: "athlete",   replacement: "Baseball Star" },
  { pattern: /\bDerek Jeter\b/gi,               type: "athlete",   replacement: "Baseball Icon" },

  // ── Athletes: Tennis ───────────────────────────────────────────────────────
  { pattern: /\bSerena Williams\b/gi,           type: "athlete",   replacement: "Tennis Legend" },
  { pattern: /\bVenus Williams\b/gi,            type: "athlete",   replacement: "Tennis Legend" },
  { pattern: /\bRoger Federer\b/gi,             type: "athlete",   replacement: "Tennis Legend" },
  { pattern: /\bNovak Djokovic\b/gi,            type: "athlete",   replacement: "Tennis Champion" },
  { pattern: /\bRafael Nadal\b/gi,              type: "athlete",   replacement: "Tennis Legend" },
  { pattern: /\bNaomi Osaka\b/gi,               type: "athlete",   replacement: "Tennis Star" },

  // ── Athletes: Combat Sports ────────────────────────────────────────────────
  { pattern: /\bMike Tyson\b/gi,                type: "athlete",   replacement: "Boxing Legend" },
  { pattern: /\bFloyd Mayweather\b/gi,          type: "athlete",   replacement: "Boxing Champion" },
  { pattern: /\bConor McGregor\b/gi,            type: "athlete",   replacement: "MMA Champion" },
  { pattern: /\bJon Jones\b/gi,                 type: "athlete",   replacement: "MMA Champion" },
  { pattern: /\bRonda Rousey\b/gi,              type: "athlete",   replacement: "MMA Fighter" },

  // ── Athletes: Olympics & Track ─────────────────────────────────────────────
  { pattern: /\bUsain Bolt\b/gi,                type: "athlete",   replacement: "Sprint Legend" },
  { pattern: /\bSimone Biles\b/gi,              type: "athlete",   replacement: "Olympic Champion" },
  { pattern: /\bMichael Phelps\b/gi,            type: "athlete",   replacement: "Olympic Swimming Legend" },
  { pattern: /\bCaitlin Clark\b/gi,             type: "athlete",   replacement: "Basketball Star" },

  // ── Celebrities & Musicians ─────────────────────────────────────────────────
  { pattern: /\bTaylor Swift\b/gi,              type: "celebrity", replacement: "Pop Star" },
  { pattern: /\bBeyonc[eé]\b/gi,               type: "celebrity", replacement: "Music Icon" },
  { pattern: /\bRihanna\b/gi,                   type: "celebrity", replacement: "Pop Music Icon" },
  { pattern: /\bAriana Grande\b/gi,             type: "celebrity", replacement: "Pop Star" },
  { pattern: /\bBillie Eilish\b/gi,             type: "celebrity", replacement: "Alt-Pop Artist" },
  { pattern: /\bDrake\b/gi,                     type: "celebrity", replacement: "Hip-Hop Icon" },
  { pattern: /\bKendrick Lamar\b/gi,            type: "celebrity", replacement: "Hip-Hop Artist" },
  { pattern: /\bEminem\b/gi,                    type: "celebrity", replacement: "Rap Legend" },
  { pattern: /\bJay-?Z\b/gi,                   type: "celebrity", replacement: "Hip-Hop Mogul" },
  { pattern: /\bKanye West\b/gi,                type: "celebrity", replacement: "Music Mogul" },
  { pattern: /\bPost Malone\b/gi,               type: "celebrity", replacement: "Pop-Rap Artist" },
  { pattern: /\bBruno Mars\b/gi,                type: "celebrity", replacement: "Pop Music Star" },
  { pattern: /\bHarry Styles\b/gi,              type: "celebrity", replacement: "Pop Music Star" },
  { pattern: /\bElton John\b/gi,                type: "celebrity", replacement: "Rock Music Legend" },
  { pattern: /\bDavid Bowie\b/gi,               type: "celebrity", replacement: "Rock Music Icon" },
  { pattern: /\bFreddie Mercury\b/gi,           type: "celebrity", replacement: "Rock Music Legend" },
  { pattern: /\bJim Morrison\b/gi,              type: "celebrity", replacement: "Rock Music Icon" },
  { pattern: /\bKurt Cobain\b/gi,               type: "celebrity", replacement: "Grunge Music Icon" },
  { pattern: /\bMarilyn Monroe\b/gi,            type: "celebrity", replacement: "Classic Hollywood Icon" },
  { pattern: /\bKim Kardashian\b/gi,            type: "celebrity", replacement: "Reality TV Icon" },
  { pattern: /\bKylie Jenner\b/gi,              type: "celebrity", replacement: "Social Media Mogul" },
  { pattern: /\bKhlo[eé] Kardashian\b/gi,      type: "celebrity", replacement: "Reality TV Star" },
  { pattern: /\bKendall Jenner\b/gi,            type: "celebrity", replacement: "Supermodel" },
  { pattern: /\bElon Musk\b/gi,                 type: "celebrity", replacement: "Tech Billionaire" },
  { pattern: /\bJeff Bezos\b/gi,                type: "celebrity", replacement: "E-Commerce Mogul" },
  { pattern: /\bMark Zuckerberg\b/gi,           type: "celebrity", replacement: "Tech CEO" },
  { pattern: /\bSteve Jobs\b/gi,                type: "celebrity", replacement: "Tech Visionary" },
  { pattern: /\bOprah\b/gi,                     type: "celebrity", replacement: "Media Icon" },
  { pattern: /\bEllen DeGeneres\b/gi,           type: "celebrity", replacement: "Talk Show Host" },
  { pattern: /\bDwayne Johnson\b/gi,            type: "celebrity", replacement: "Hollywood Action Star" },
  { pattern: /\bKevin Hart\b/gi,                type: "celebrity", replacement: "Stand-Up Comic" },
  { pattern: /\bWill Smith\b/gi,                type: "celebrity", replacement: "Hollywood Star" },
  { pattern: /\bMrBeast\b/gi,                   type: "celebrity", replacement: "YouTube Creator" },
  { pattern: /\bPewDiePie\b/gi,                 type: "celebrity", replacement: "Gaming Creator" },
  { pattern: /\bCharli D['']Amelio\b/gi,        type: "celebrity", replacement: "TikTok Creator" },
  { pattern: /\bAddison Rae\b/gi,               type: "celebrity", replacement: "TikTok Creator" },

  // ── Political Figures ───────────────────────────────────────────────────────
  { pattern: /\bDonald Trump\b/gi,              type: "political", replacement: "Former US President" },
  { pattern: /\bJoe Biden\b/gi,                 type: "political", replacement: "US President" },
  { pattern: /\bKamala Harris\b/gi,             type: "political", replacement: "US VP" },
  { pattern: /\bBarack Obama\b/gi,              type: "political", replacement: "Former US President" },
  { pattern: /\bBernie Sanders\b/gi,            type: "political", replacement: "Political Figure" },
  { pattern: /\bRon DeSantis\b/gi,              type: "political", replacement: "Political Figure" },
  { pattern: /\bAOC\b/g,                        type: "political", replacement: "Political Figure" },
  { pattern: /\bAlexandria Ocasio-Cortez\b/gi,  type: "political", replacement: "Political Figure" },
  { pattern: /\bVladimir Putin\b/gi,            type: "political", replacement: "World Leader" },

  // ── Brands ─────────────────────────────────────────────────────────────────
  { pattern: /\bNike\b/gi,                      type: "brand",     replacement: "Top Sports Brand" },
  { pattern: /\bAdidas\b/gi,                    type: "brand",     replacement: "Global Sportswear" },
  { pattern: /\bSupreme\b/gi,                   type: "brand",     replacement: "Streetwear Brand" },
  { pattern: /\bOff-White\b/gi,                 type: "brand",     replacement: "Luxury Streetwear" },
  { pattern: /\bApple\b/gi,                     type: "brand",     replacement: "Tech Giant" },
  { pattern: /\bGoogle\b/gi,                    type: "brand",     replacement: "Search Giant" },
  { pattern: /\bNetflix\b/gi,                   type: "brand",     replacement: "Streaming Platform" },
  { pattern: /\bSpotify\b/gi,                   type: "brand",     replacement: "Music Streaming App" },
  { pattern: /\bFacebook\b/gi,                  type: "brand",     replacement: "Social Platform" },
  { pattern: /\bInstagram\b/gi,                 type: "brand",     replacement: "Photo-Sharing App" },
  { pattern: /\bTikTok\b/gi,                    type: "brand",     replacement: "Short-Form Video App" },
  { pattern: /\bSnapchat\b/gi,                  type: "brand",     replacement: "Social Media App" },
  { pattern: /\bTwitter\b/gi,                   type: "brand",     replacement: "Social Platform" },
  { pattern: /\bStarbucks\b/gi,                 type: "brand",     replacement: "Coffee Chain" },
  { pattern: /\bMcDonald['']s\b/gi,             type: "brand",     replacement: "Fast Food Chain" },
  { pattern: /\bChick-fil-A\b/gi,               type: "brand",     replacement: "Fast Food Chain" },
  { pattern: /\bChipotle\b/gi,                  type: "brand",     replacement: "Fast Casual Chain" },
  // Retail & grocery chains
  { pattern: /\bCostco\b/gi,                    type: "brand",     replacement: "Bulk Retail Store" },
  { pattern: /\bWalmart\b/gi,                   type: "brand",     replacement: "Big Box Store" },
  { pattern: /\bTarget\b/gi,                    type: "brand",     replacement: "Big Box Store" },
  { pattern: /\bTrader Joe['']?s\b/gi,          type: "brand",     replacement: "Grocery Store" },
  { pattern: /\bWhole Foods\b/gi,               type: "brand",     replacement: "Health Grocery Store" },
  { pattern: /\bKroger\b/gi,                    type: "brand",     replacement: "Grocery Chain" },
  { pattern: /\bSafeway\b/gi,                   type: "brand",     replacement: "Grocery Chain" },
  { pattern: /\bSam['']?s Club\b/gi,            type: "brand",     replacement: "Warehouse Club" },
  { pattern: /\bHome Depot\b/gi,                type: "brand",     replacement: "Home Improvement Store" },
  { pattern: /\bLowe['']?s\b/gi,                type: "brand",     replacement: "Home Improvement Store" },
  { pattern: /\bBest Buy\b/gi,                  type: "brand",     replacement: "Electronics Store" },
  { pattern: /\bWalgreens\b/gi,                 type: "brand",     replacement: "Drug Store" },
  { pattern: /\bCVS\b/g,                        type: "brand",     replacement: "Drug Store" },
  { pattern: /\bAldi\b/gi,                      type: "brand",     replacement: "Discount Grocery" },
  { pattern: /\bPubix\b/gi,                     type: "brand",     replacement: "Grocery Store" },
  { pattern: /\bPokémon\b/gi,                   type: "movie",     replacement: "Anime Collector Culture" },
  { pattern: /\bPokemon\b/gi,                   type: "movie",     replacement: "Anime Collector Culture" },
  { pattern: /\bTesla\b/gi,                     type: "brand",     replacement: "Electric Vehicle Brand" },
  { pattern: /\bStarbucks\b/gi,                 type: "brand",     replacement: "Coffee Chain" },

  // ── Movies & Entertainment IP ───────────────────────────────────────────────
  { pattern: /\bMarvel\b/gi,                    type: "movie",     replacement: "Superhero Fan Culture" },
  { pattern: /\bDC Comics\b/gi,                 type: "movie",     replacement: "Superhero Universe" },
  { pattern: /\bStar Wars\b/gi,                 type: "movie",     replacement: "Space Adventure Fan Culture" },
  { pattern: /\bHarry Potter\b/gi,              type: "movie",     replacement: "Fantasy Fan Culture" },
  { pattern: /\bLord of the Rings\b/gi,         type: "movie",     replacement: "Epic Fantasy Fan Culture" },
  { pattern: /\bSpider-Man\b/gi,                type: "movie",     replacement: "Superhero Fan Culture" },
  { pattern: /\bBatman\b/gi,                    type: "movie",     replacement: "Superhero Fan Culture" },
  { pattern: /\bSuperman\b/gi,                  type: "movie",     replacement: "Superhero Fan Culture" },
  { pattern: /\bDisney\b/gi,                    type: "movie",     replacement: "Animated Entertainment Fan Culture" },
  { pattern: /\bPixar\b/gi,                     type: "movie",     replacement: "Animated Film Fan Culture" },
  { pattern: /\bMinecraft\b/gi,                 type: "movie",     replacement: "Sandbox Gaming Culture" },
  { pattern: /\bFortnite\b/gi,                  type: "movie",     replacement: "Battle Royale Gaming Culture" },

  // ── TV Shows ────────────────────────────────────────────────────────────────
  { pattern: /\bGame of Thrones\b/gi,           type: "tv",        replacement: "Epic Fantasy Series Fan Culture" },
  { pattern: /\bBreaking Bad\b/gi,              type: "tv",        replacement: "Crime Drama Fan Culture" },
  { pattern: /\bStranger Things\b/gi,           type: "tv",        replacement: "Sci-Fi Nostalgia Fan Culture" },
  { pattern: /\bThe Office\b/gi,               type: "tv",        replacement: "Workplace Comedy Fan Culture" },
  { pattern: /\bFriends\b/gi,                   type: "tv",        replacement: "Classic Sitcom Fan Culture" },
  { pattern: /\bSeinfeld\b/gi,                  type: "tv",        replacement: "Classic Sitcom Fan Culture" },
  { pattern: /\bThe Simpsons\b/gi,              type: "tv",        replacement: "Animated Sitcom Fan Culture" },

  // ── Sports Leagues & Events ────────────────────────────────────────────────
  { pattern: /\bNFL\b/g,                        type: "brand",     replacement: "Pro Football" },
  { pattern: /\bNBA\b/g,                        type: "brand",     replacement: "Pro Basketball" },
  { pattern: /\bMLB\b/g,                        type: "brand",     replacement: "Pro Baseball" },
  { pattern: /\bNHL\b/g,                        type: "brand",     replacement: "Pro Hockey" },
  { pattern: /\bMLS\b/g,                        type: "brand",     replacement: "Pro Soccer" },
  { pattern: /\bUFC\b/g,                        type: "brand",     replacement: "Combat Sports" },
  { pattern: /\bWWE\b/g,                        type: "brand",     replacement: "Pro Wrestling" },
  { pattern: /\bF1\b/g,                         type: "brand",     replacement: "Formula Racing" },
  { pattern: /\bFormula 1\b/gi,                 type: "brand",     replacement: "Formula Racing" },
  { pattern: /\bSuper Bowl\b/gi,                type: "event",     replacement: "Championship Game" },
  { pattern: /\bOlympics\b/gi,                  type: "event",     replacement: "Global Athletic Games" },
  { pattern: /\bWorld Cup\b/gi,                 type: "event",     replacement: "Global Soccer Tournament" },
  { pattern: /\bThe Masters\b/gi,               type: "event",     replacement: "Major Golf Tournament" },
  { pattern: /\bWimbledon\b/gi,                 type: "event",     replacement: "Major Tennis Tournament" },
  { pattern: /\bCoachella\b/gi,                 type: "event",     replacement: "Music Festival Culture" },
  { pattern: /\bGrammy(?:s)?\b/gi,              type: "event",     replacement: "Music Awards Season" },
];

// ─── Risk weight per entity type ─────────────────────────────────────────────

const RISK_WEIGHTS: Record<EntityType, number> = {
  athlete:   50,
  celebrity: 50,
  political: 40,
  brand:     40,
  movie:     40,
  tv:        40,
  event:     30,
};

// ─── Core Logic ───────────────────────────────────────────────────────────────

export function detectEntities(text: string): FlaggedEntity[] {
  const found: FlaggedEntity[] = [];
  for (const ep of ENTITY_PATTERNS) {
    const match = text.match(ep.pattern);
    if (match) {
      found.push({ value: match[0], type: ep.type, replacement: ep.replacement });
    }
  }
  return found;
}

function calculateRiskScore(entities: FlaggedEntity[]): number {
  if (entities.length === 0) return 0;
  const total = entities.reduce((sum, e) => sum + RISK_WEIGHTS[e.type], 0);
  return Math.min(total, 100);
}

function sanitize(niche: string, entities: FlaggedEntity[]): string {
  let result = niche;
  for (const entity of entities) {
    // find the original pattern to replace accurately
    const ep = ENTITY_PATTERNS.find(
      (p) => p.type === entity.type && p.replacement === entity.replacement
    );
    if (ep) {
      result = result.replace(ep.pattern, entity.replacement);
    }
  }
  return result.trim();
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function runSafetyEngine(niche: string): SafetyResult {
  const flaggedEntities = detectEntities(niche);
  const riskScore = calculateRiskScore(flaggedEntities);
  const safe = flaggedEntities.length === 0;
  const sanitizedNiche = safe ? niche : sanitize(niche, flaggedEntities);
  const modified = sanitizedNiche.trim() !== niche.trim();

  return {
    safe,
    modified,
    riskScore,
    sanitizedNiche,
    originalNiche: niche,
    flaggedEntities,
  };
}
