"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCompliance = checkCompliance;
exports.checkSlogan = checkSlogan;
exports.checkText = checkText;
exports.filterSafeSlogans = filterSafeSlogans;
// server-only removed for script runtime
// Build a word-boundary regex from an exact phrase (handles multi-word phrases too)
function phrase(p) {
    const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // For multi-word phrases, wrap whole phrase in lookaheads; for single words use \b
    if (p.includes(" ")) {
        return new RegExp(`(?<![\\w])${escaped}(?![\\w])`, "i");
    }
    return new RegExp(`\\b${escaped}\\b`, "i");
}
// ── TRADEMARKS ───────────────────────────────────────────────────────────────
const TRADEMARK_RULES = [
    // Fashion / Apparel
    ...[
        "nike", "adidas", "supreme", "gucci", "louis vuitton", "prada", "versace",
        "chanel", "rolex", "yeezy", "balenciaga", "off-white", "off white",
        "bape", "a bathing ape", "fendi", "burberry", "hermes", "hermès",
        "under armour", "lululemon", "champion", "lacoste", "polo ralph lauren",
        "tommy hilfiger", "calvin klein", "dolce gabbana",
    ].map((t) => ({
        pattern: phrase(t),
        category: "TRADEMARK",
        reason: `"${t}" is a registered trademark. Use it on a design and all three platforms will reject the listing and may suspend your account.`,
        platforms: ["all"],
        blocks: true,
    })),
    // Beverages
    ...[
        "coca cola", "coca-cola", "pepsi", "starbucks", "red bull", "monster energy",
        "dr pepper", "mountain dew", "gatorade", "redbull",
    ].map((t) => ({
        pattern: phrase(t),
        category: "TRADEMARK",
        reason: `"${t}" is a registered trademark. Using it on a design violates IP policy on all POD platforms.`,
        platforms: ["all"],
        blocks: true,
    })),
    // Tech brands
    ...[
        "apple", "iphone", "ipad", "macbook", "airpods", "google", "android",
        "microsoft", "xbox", "playstation", "nintendo", "meta quest",
        "facebook", "instagram", "tiktok", "snapchat", "twitter", "x.com",
        "amazon", "alexa",
    ].map((t) => ({
        pattern: phrase(t),
        category: "TRADEMARK",
        reason: `"${t}" is a registered trademark owned by a tech company with aggressive IP enforcement.`,
        platforms: ["all"],
        blocks: true,
    })),
    // Sports leagues & teams
    ...[
        "nfl", "nba", "mlb", "nhl", "fifa", "uefa", "mls", "wnba",
        "super bowl", "world series", "stanley cup", "nba finals",
        "olympic", "olympics", "paralympics", "ncaa",
        "blue jays", "maple leafs", "raptors", "lakers", "yankees", "dodgers", "red sox", "cubs",
        "cowboys", "patriots", "packers", "steelers", "eagles", "49ers", "chiefs",
    ].map((t) => ({
        pattern: phrase(t),
        category: "TRADEMARK",
        reason: `"${t}" is a protected sports trademark. Team names, logos and league names are aggressively enforced.`,
        platforms: ["all"],
        blocks: true,
    })),
    // Trademarked slogans
    ...[
        "just do it",
        "impossible is nothing",
        "think different",
        "i'm lovin it", "i'm loving it",
        "have it your way",
        "just eat it",
        "red bull gives you wings",
        "because you're worth it",
        "finger lickin good",
        "the real thing",
    ].map((t) => ({
        pattern: phrase(t),
        category: "TRADEMARK",
        reason: `"${t}" is a trademarked advertising slogan. Even without the brand name, this slogan is protected.`,
        platforms: ["all"],
        blocks: true,
    })),
];
// ── COPYRIGHT  ───────────────────────────────────────────────────────────────
const COPYRIGHT_RULES = [
    // Disney / Pixar / Marvel / Star Wars
    ...[
        "disney", "mickey mouse", "minnie mouse", "donald duck", "goofy", "pluto",
        "tinker bell", "dumbo", "bambi", "cinderella", "sleeping beauty",
        "snow white", "the little mermaid", "ariel", "belle", "beast",
        "aladdin", "jasmine", "mulan", "pocahontas", "rapunzel", "tangled",
        "frozen", "elsa", "anna", "olaf", "sven", "kristoff",
        "moana", "maui", "encanto", "mirabel", "raya", "the mandalorian",
        "baby yoda", "grogu", "star wars", "luke skywalker", "darth vader",
        "yoda", "han solo", "chewbacca", "r2-d2", "c-3po", "obi-wan",
        "jedi", "sith", "the force", "lightsaber", "millennium falcon",
        "rebel alliance", "galactic empire", "death star",
        "marvel", "avengers", "iron man", "tony stark", "captain america",
        "thor", "hulk", "black widow", "hawkeye", "spider-man", "spiderman",
        "peter parker", "black panther", "doctor strange", "ant-man",
        "scarlet witch", "wanda maximoff", "vision", "falcon", "war machine",
        "guardians of the galaxy", "star-lord", "groot", "rocket raccoon",
        "thanos", "loki", "deadpool", "wolverine", "x-men",
        "dc comics", "batman", "bruce wayne", "superman", "clark kent",
        "wonder woman", "aquaman", "the flash", "green lantern",
        "justice league", "joker", "harley quinn", "lex luthor",
    ].map((t) => ({
        pattern: phrase(t),
        category: "COPYRIGHT",
        reason: `"${t}" is a Disney/Marvel/DC copyrighted character or property. Disney actively enforces IP across all POD platforms and will pursue legal action.`,
        platforms: ["all"],
        blocks: true,
    })),
    // Gaming IPs
    ...[
        "pokemon", "pikachu", "charizard", "gengar", "eevee", "snorlax",
        "bulbasaur", "squirtle", "mewtwo", "jigglypuff", "lucario",
        "pokeball", "team rocket", "pokemon go",
        "super mario", "mario bros", "luigi", "princess peach", "bowser",
        "toad", "yoshi", "koopa", "goomba", "wario", "waluigi",
        "donkey kong", "link", "zelda", "ganon", "hyrule", "triforce",
        "samus", "pikachu", "kirby", "fox mccloud", "star fox",
        "minecraft", "creeper", "steve minecraft", "enderman",
        "among us", "crewmate", "impostor among us",
        "fortnite", "floss dance", "battle royale fortnite",
        "overwatch", "tracer", "widowmaker", "reaper overwatch",
        "league of legends", "jinx lol", "arcane",
        "genshin impact", "mondstadt", "liyue",
        "cyberpunk 2077", "night city", "johnny silverhand",
        "elden ring", "malenia", "radahn", "torrent horse",
        "dark souls", "praise the sun", "chosen undead",
        "animal crossing", "isabelle ac", "tom nook",
        "stardew valley", "pelican town",
        "grand theft auto", "gta v", "gta san andreas", "rockstar games",
        "fallout", "vault boy", "nuka cola",
        "skyrim", "dragonborn", "dovahkiin", "fus ro dah",
        "the witcher", "geralt of rivia", "ciri witcher",
        "sonic the hedgehog", "sonic boom", "miles tails prower",
    ].map((t) => ({
        pattern: phrase(t),
        category: "COPYRIGHT",
        reason: `"${t}" is copyrighted game IP. Game publishers routinely DMCA-strike POD listings — this will result in listing removal and potential account suspension.`,
        platforms: ["all"],
        blocks: true,
    })),
    // TV / Film / Literature
    ...[
        "harry potter", "hermione granger", "ron weasley", "dumbledore",
        "hogwarts", "gryffindor", "slytherin", "hufflepuff", "ravenclaw",
        "quidditch", "voldemort", "diagon alley", "hogsmeade",
        "lord of the rings", "lotr", "gandalf", "frodo baggins",
        "samwise gamgee", "aragorn", "legolas", "gimli", "sauron",
        "middle earth", "the shire", "mordor", "one ring lotr",
        "game of thrones", "got", "jon snow", "daenerys targaryen",
        "tyrion lannister", "cersei lannister", "the iron throne",
        "breaking bad", "walter white", "heisenberg", "jesse pinkman",
        "the simpsons", "homer simpson", "bart simpson", "lisa simpson",
        "family guy", "peter griffin", "stewie griffin",
        "south park", "cartman", "kenny mccormick",
        "spongebob", "spongebob squarepants", "patrick star",
        "squidward", "sandy cheeks", "mr krabs",
        "sesame street", "elmo", "big bird", "cookie monster", "oscar grouch",
        "the office", "michael scott", "dwight schrute",
        "friends tv", "central perk",
        "the mandalorian", "yellowstone", "stranger things",
        "demogorgon", "eleven stranger things",
        "rick and morty", "morty smith",
        "adventure time", "finn adventure time",
        "steven universe", "gravity falls", "dipper pines",
        "avatar the last airbender", "aang avatar",
        "my hero academia", "boku no hero", "deku", "all might",
        "naruto", "naruto uzumaki", "sasuke uchiha", "kakashi",
        "one piece", "luffy", "zoro one piece",
        "attack on titan", "eren jaeger", "levi ackerman",
        "dragon ball", "goku", "vegeta", "gohan", "frieza",
        "hello kitty", "sanrio", "my melody", "cinnamoroll",
        "care bears", "barbie", "hot wheels", "he-man", "she-ra",
        "transformers", "optimus prime", "bumblebee transformer",
    ].map((t) => ({
        pattern: phrase(t),
        category: "COPYRIGHT",
        reason: `"${t}" is a copyrighted character, show, or franchise. Fan art for commercial sale is explicitly prohibited on all major POD platforms.`,
        platforms: ["all"],
        blocks: true,
    })),
    // Song lyrics / music
    {
        pattern: /\b(song lyrics?|lyrics? from|words? (to|of) the song)\b/i,
        category: "COPYRIGHT",
        reason: "Song lyrics are copyrighted. Reproducing lyrics on apparel — even a single line — is a copyright violation and grounds for DMCA takedown on all platforms.",
        platforms: ["all"],
        blocks: true,
    },
    // Generic movie/show quote patterns
    {
        pattern: /\b(movie quote|film quote|from the movie|as seen in|quote from)\b/i,
        category: "COPYRIGHT",
        reason: "Direct quotes from movies/shows are copyrighted. This will trigger removal on all platforms.",
        platforms: ["all"],
        blocks: true,
    },
];
// ── CELEBRITY NAME / LIKENESS ────────────────────────────────────────────────
const CELEBRITY_RULES = [
    ...[
        // Music
        "taylor swift", "beyonce", "beyoncé", "rihanna", "lady gaga",
        "ariana grande", "billie eilish", "dua lipa", "olivia rodrigo",
        "the weeknd", "drake", "kanye west", "ye kanye", "travis scott",
        "post malone", "eminem", "jay-z", "jay z", "kendrick lamar",
        "nicki minaj", "cardi b", "lizzo", "harry styles", "shawn mendes",
        "justin bieber", "selena gomez", "miley cyrus", "katy perry",
        "ed sheeran", "coldplay", "adele", "sam smith", "bad bunny",
        "elvis presley", "the beatles", "rolling stones", "metallica",
        "led zeppelin", "queen band", "david bowie", "michael jackson",
        "prince musician", "frank sinatra", "bob dylan", "john lennon",
        "paul mccartney", "bruce springsteen", "dolly parton", "johnny cash",
        // Film / TV actors
        "tom hanks", "meryl streep", "jennifer lawrence", "scarlett johansson",
        "brad pitt", "angelina jolie", "leonardo dicaprio", "tom cruise",
        "will smith", "dwayne johnson", "the rock dwayne", "kevin hart",
        "ryan reynolds", "chris evans", "chris hemsworth", "robert downey",
        "zendaya", "timothée chalamet", "florence pugh",
        // Sports
        "lebron james", "lebron", "stephen curry", "kevin durant",
        "michael jordan", "kobe bryant", "shaquille oneal", "allen iverson",
        "cristiano ronaldo", "lionel messi", "neymar jr", "mbappé", "mbappe",
        "serena williams", "roger federer", "rafael nadal", "novak djokovic",
        "tom brady", "patrick mahomes", "travis kelce", "aaron rodgers",
        "tiger woods", "rory mcilroy", "usain bolt", "simone biles",
        "muhammad ali", "mike tyson",
        // Politicians / public figures (all platforms ban use of real people's likenesses for merch)
        "elon musk", "jeff bezos", "bill gates", "mark zuckerberg",
        "donald trump", "joe biden", "barack obama", "hillary clinton",
        "bernie sanders", "aoc", "alexandria ocasio-cortez",
    ].map((t) => ({
        pattern: phrase(t),
        category: "CELEBRITY",
        reason: `"${t}" is a real person. Using celebrity names or likenesses on merchandise without written consent violates right-of-publicity laws and all three platform policies. Amazon and Etsy will remove the listing; Redbubble will DMCA-strike.`,
        platforms: ["all"],
        blocks: true,
    })),
];
// ── HATE / DISCRIMINATION ────────────────────────────────────────────────────
const HATE_RULES = [
    // Extremist symbols and orgs (keyword patterns — visual check is separate)
    {
        pattern: /\b(nazi|nazism|third reich|waffen ss|kkk|ku klux klan|white supremac|aryan nation|proud boys|neo.?nazi|antisemit|anti-semit)\b/i,
        category: "HATE",
        reason: "Content referencing hate groups or supremacist ideology is prohibited on all platforms and violates federal hate crime statutes in several jurisdictions.",
        platforms: ["all"],
        blocks: true,
    },
    // Slurs — catch-all pattern (not listing individual slurs here)
    {
        pattern: /\b(hate speech|racial slur|n.word|f.word slur|slur for)\b/i,
        category: "HATE",
        reason: "Hate speech, slurs, and discriminatory language are absolutely prohibited. Accounts are permanently banned.",
        platforms: ["all"],
        blocks: true,
    },
    {
        pattern: /\b(genocide|ethnic cleansing|holocaust denial|replacement theory)\b/i,
        category: "HATE",
        reason: "Content that denies, trivializes, or promotes genocide violates all platform policies and may be illegal in many countries.",
        platforms: ["all"],
        blocks: true,
    },
    {
        pattern: /\b(islamophob|islamophobia|homophob|transphob|antisemit)\b/i,
        category: "HATE",
        reason: "Content promoting religious, sexual-orientation, or gender-identity intolerance is prohibited on Amazon, Etsy, and Redbubble.",
        platforms: ["all"],
        blocks: true,
    },
];
// ── VIOLENCE ────────────────────────────────────────────────────────────────
const VIOLENCE_RULES = [
    {
        pattern: /\b(kill (all|every)|death to|execute (them|him|her)|murder (for|is)|glorif(y|ies|ied) (killing|murder|violence))\b/i,
        category: "VIOLENCE",
        reason: "Content glorifying or inciting violence against people or groups is prohibited and may be reportable to law enforcement.",
        platforms: ["all"],
        blocks: true,
    },
    {
        pattern: /\b(school shooting|mass shooting|bomb (the|a school)|terrorist(s)? win)\b/i,
        category: "VIOLENCE",
        reason: "Content referencing mass violence events for commercial purposes is prohibited on all platforms.",
        platforms: ["all"],
        blocks: true,
    },
    {
        pattern: /\b(graphic violence|gore design|torture porn|snuff)\b/i,
        category: "VIOLENCE",
        reason: "Graphic violence in design content is prohibited on Amazon and restricted on Etsy and Redbubble.",
        platforms: ["all"],
        blocks: true,
    },
];
// ── ADULT CONTENT ───────────────────────────────────────────────────────────
const ADULT_RULES = [
    {
        pattern: /\b(porn|pornograph|naked|nudity|nude design|hentai|nsfw content|erotic|fetish wear)\b/i,
        category: "ADULT",
        reason: "Adult/explicit sexual content is prohibited on Merch by Amazon entirely. Etsy and Redbubble require age-gating which POD designs cannot use.",
        platforms: ["all"],
        blocks: true,
    },
    {
        pattern: /\b(sexually explicit|xxx|adult only|18\+ only|explicit content)\b/i,
        category: "ADULT",
        reason: "Explicit sexual content labels are prohibited in listing copy on all three platforms.",
        platforms: ["amazon", "etsy"],
        blocks: true,
    },
];
// ── FALSE / MISLEADING CLAIMS ────────────────────────────────────────────────
const FALSE_CLAIM_RULES = [
    {
        pattern: /\b(fda approved|fda cleared|clinically proven|clinically tested|doctor recommended|medically proven|guaranteed cure|cures cancer|treats depression|heals|natural remedy for)\b/i,
        category: "FALSE_CLAIM",
        reason: "Health or medical claims on apparel are prohibited by Amazon policy and FTC guidelines. This will trigger listing removal.",
        platforms: ["amazon", "etsy"],
        blocks: true,
    },
    {
        pattern: /\b(official (merch|merchandise)|officially licensed|licensed product|authorized seller)\b/i,
        category: "FALSE_CLAIM",
        reason: "Implying official licensing or authorization you don't have violates Amazon, Etsy, and Redbubble terms. Amazon specifically prohibits this phrasing.",
        platforms: ["all"],
        blocks: true,
    },
    {
        pattern: /\b(proceeds (go to|benefit|support)|donate(s)? (to|a %)|(% of|portion of) (sales|proceeds) (donated|to charity))\b/i,
        category: "FALSE_CLAIM",
        reason: "Amazon Merch explicitly prohibits listing copy suggesting proceeds will be donated to charity. Etsy and Redbubble also flag misleading charitable claims.",
        platforms: ["amazon", "etsy", "redbubble"],
        blocks: false,
    },
    {
        pattern: /\b(bestseller|best seller|#1 ranked|top rated product|five star)\b/i,
        category: "FALSE_CLAIM",
        reason: 'Amazon prohibits self-referential quality or ranking claims in listing content ("bestseller", "#1"). This triggers moderation review.',
        platforms: ["amazon"],
        blocks: false,
    },
];
// ── PLATFORM-SPECIFIC (Amazon-only listing rules) ────────────────────────────
const PLATFORM_RULES = [
    {
        pattern: /\b(ships (in|within|from)|delivery (in|within)|arrives (in|by)|shipping (time|days)|fulfilled by)\b/i,
        category: "PLATFORM",
        reason: "Amazon Merch prohibits referencing fulfillment, delivery, or shipping attributes in listing content.",
        platforms: ["amazon"],
        blocks: false,
    },
    {
        pattern: /\b(leave (a |us a |your )?review|write (a |us a )?review|rate (this|us)|please review)\b/i,
        category: "PLATFORM",
        reason: "Amazon Merch explicitly prohibits soliciting customer reviews in listing content.",
        platforms: ["amazon"],
        blocks: false,
    },
    {
        pattern: /\b(link in bio|shop our|follow us|@[\w]+|visit our (store|shop|website))\b/i,
        category: "PLATFORM",
        reason: "Directing customers off-platform via external links or social handles is prohibited on Amazon Merch and Redbubble.",
        platforms: ["amazon", "redbubble"],
        blocks: false,
    },
    {
        pattern: /\b(tragedy|disaster|hurricane|earthquake|tsunami|9\/11|covid|pandemic|shooting victims?|mass (casualty|shooting) victims?)\b/i,
        category: "PLATFORM",
        reason: "Amazon Merch prohibits content relating to human tragedies and natural disasters. Etsy and Redbubble strongly discourage profiting from tragedies.",
        platforms: ["all"],
        blocks: false,
    },
];
// ── DESIGN QUALITY (Amazon-specific poor customer experience) ────────────────
const DESIGN_QUALITY_RULES = [
    {
        pattern: /\b(lorem ipsum|placeholder text|sample text|insert text here|your text here)\b/i,
        category: "DESIGN_QUALITY",
        reason: "Placeholder text in a listing is an immediate rejection on Amazon Merch.",
        platforms: ["amazon"],
        blocks: true,
    },
    {
        pattern: /\b(blank (shirt|tee|t-shirt)|no (design|text)|empty design)\b/i,
        category: "DESIGN_QUALITY",
        reason: "A blank or empty design description signals low quality content to Amazon Merch reviewers.",
        platforms: ["amazon"],
        blocks: true,
    },
];
// ─────────────────────────────────────────────────────────────────────────────
// ALL RULES COMBINED
// ─────────────────────────────────────────────────────────────────────────────
const ALL_RULES = [
    ...TRADEMARK_RULES,
    ...COPYRIGHT_RULES,
    ...CELEBRITY_RULES,
    ...HATE_RULES,
    ...VIOLENCE_RULES,
    ...ADULT_RULES,
    ...FALSE_CLAIM_RULES,
    ...PLATFORM_RULES,
    ...DESIGN_QUALITY_RULES,
];
// ─────────────────────────────────────────────────────────────────────────────
// CORE SCAN
// ─────────────────────────────────────────────────────────────────────────────
function scanText(text) {
    if (!text || typeof text !== "string")
        return [];
    const violations = [];
    const seen = new Set();
    for (const rule of ALL_RULES) {
        if (rule.pattern.test(text)) {
            const key = `${rule.category}:${rule.pattern.source}`;
            const termMatch = text.match(rule.pattern);
            const term = termMatch?.[0] ?? rule.pattern.source;
            const dedupeKey = `${rule.category}:${term.toLowerCase()}`;
            if (seen.has(dedupeKey))
                continue;
            seen.add(dedupeKey);
            violations.push({
                category: rule.category,
                term,
                reason: rule.reason,
                platforms: rule.platforms,
                blocks: rule.blocks,
            });
        }
    }
    return violations;
}
function computeRiskLevel(violations) {
    if (violations.length === 0)
        return "CLEAR";
    if (violations.some((v) => v.blocks)) {
        const blockers = violations.filter((v) => v.blocks).length;
        return blockers >= 2 ? "BLOCKED" : "HIGH";
    }
    return violations.length >= 3 ? "MEDIUM" : "LOW";
}
function platformViolations(violations, platform) {
    return violations.filter((v) => v.platforms.includes("all") || v.platforms.includes(platform));
}
function buildPlatformStatus(violations, platform) {
    const pv = platformViolations(violations, platform);
    const rl = computeRiskLevel(pv);
    return { approved: pv.length === 0, riskLevel: rl, violations: pv };
}
// ─────────────────────────────────────────────────────────────────────────────
// SUGGESTION GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_SUGGESTIONS = {
    TRADEMARK: "Remove or rephrase any brand names. Use generic descriptors instead (e.g., 'athletic wear' instead of a brand name, 'coffee shop vibes' instead of a cafe brand).",
    COPYRIGHT: "Replace copyrighted character/franchise references with original archetypes (e.g., 'space warrior' instead of a Star Wars character, 'wizard academy' instead of Hogwarts).",
    CELEBRITY: "Remove the celebrity name entirely. Reference their *aesthetic* or profession generically (e.g., 'pop star energy', 'basketball legend vibes') without naming the person.",
    HATE: "Remove all hateful language, slurs, or extremist references. This content will result in a permanent account ban across all platforms.",
    VIOLENCE: "Rephrase all violent language. Passive references to strength or resilience are fine — direct glorification of harm is not.",
    ADULT: "Remove all adult/explicit content. Keep designs and copy family-friendly for all age groups.",
    FALSE_CLAIM: "Remove health claims, charity promises, and self-awarded rankings. Only factual, verifiable statements are allowed.",
    PLATFORM: "Remove shipping/delivery references, review solicitations, and off-platform links from listing copy.",
    DESIGN_QUALITY: "Replace placeholder text with real design content. Amazon reviewers reject listings that appear unfinished.",
};
function buildSuggestions(violations) {
    const categories = [...new Set(violations.map((v) => v.category))];
    return categories.map((c) => CATEGORY_SUGGESTIONS[c]).filter(Boolean);
}
/**
 * Run a full compliance check on a product object.
 * Checks all text fields: niche, slogans, title, description, bullet points.
 */
function checkCompliance(product) {
    const fields = [
        product.niche ?? "",
        product.slogan ?? "",
        ...(Array.isArray(product.shirtSlogans) ? product.shirtSlogans : []),
        product.title ?? "",
        product.description ?? "",
        product.bullet_point_1 ?? "",
        product.bullet_point_2 ?? "",
        product.amazonListing?.title ?? "",
        product.amazonListing?.description ?? "",
        product.amazonListing?.bulletPoint1 ?? "",
        product.amazonListing?.bulletPoint2 ?? "",
        ...(Array.isArray(product.amazonListing?.keywords) ? product.amazonListing.keywords : []),
    ];
    const combined = fields.join(" ");
    const violations = scanText(combined);
    const riskLevel = computeRiskLevel(violations);
    return {
        safe: violations.filter((v) => v.blocks).length === 0,
        riskLevel,
        violations,
        platforms: {
            amazon: buildPlatformStatus(violations, "amazon"),
            etsy: buildPlatformStatus(violations, "etsy"),
            redbubble: buildPlatformStatus(violations, "redbubble"),
        },
        suggestions: buildSuggestions(violations),
        checkedAt: new Date().toISOString(),
    };
}
/**
 * Check a single slogan string.
 */
function checkSlogan(slogan) {
    return checkCompliance({ slogan, shirtSlogans: [slogan] });
}
/**
 * Check a raw text string (niche name, title, etc.).
 */
function checkText(text) {
    const violations = scanText(text);
    const riskLevel = computeRiskLevel(violations);
    return {
        safe: violations.filter((v) => v.blocks).length === 0,
        riskLevel,
        violations,
        platforms: {
            amazon: buildPlatformStatus(violations, "amazon"),
            etsy: buildPlatformStatus(violations, "etsy"),
            redbubble: buildPlatformStatus(violations, "redbubble"),
        },
        suggestions: buildSuggestions(violations),
        checkedAt: new Date().toISOString(),
    };
}
/**
 * Filter an array of slogans — returns only those that pass compliance.
 * `removedCount` gives visibility into how many were dropped.
 */
function filterSafeSlogans(slogans) {
    const safe = [];
    const removed = [];
    for (const slogan of slogans) {
        const violations = scanText(slogan);
        const blockers = violations.filter((v) => v.blocks);
        if (blockers.length === 0) {
            safe.push(slogan);
        }
        else {
            removed.push({ slogan, reason: blockers[0].reason });
        }
    }
    return { safe, removed };
}
