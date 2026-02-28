// ─── Policy + Trademark Safety Layer ────────────────────────────────────────
// Shared compliance utility used by generate.js, bulk-generate.js, autopilot.js

const TRADEMARK_RED_FLAGS = [
    // Big brand/entertainment IPs
    "disney", "marvel", "dc comics", "star wars", "star trek",
    "pokemon", "nintendo", "super mario", "zelda", "minecraft",
    // Fashion brands
    "nike", "adidas", "supreme", "gucci", "louis vuitton", "prada",
    "versace", "chanel", "rolex", "yeezy",
    // Beverage
    "coca cola", "pepsi", "starbucks", "red bull",
    // Tech
    "apple", "google", "microsoft", "amazon", "facebook", "instagram",
    // Media/characters
    "harry potter", "lord of the rings", "game of thrones", "breaking bad",
    "the simpsons", "family guy", "south park", "sesame street",
    "spongebob", "mickey mouse", "spiderman", "batman", "superman",
    "iron man", "avengers", "frozen", "moana", "pixar",
    "hello kitty", "barbie", "transformers",
    // Music
    "taylor swift", "beyonce", "eminem", "drake", "kanye west",
    "the beatles", "rolling stones", "metallica",
    // Sports leagues (logos/wordmarks are trademarked)
    "nfl", "nba", "mlb", "nhl", "fifa", "uefa"
];

const POLICY_BLOCKLIST = [
    // Content type violations
    "logo parody", "brand parody", "celebrity name",
    "movie quote", "song lyrics", "copyrighted character",
    // Medical / false claims
    "guaranteed cure", "medical claim", "fda approved", "clinically proven",
    // Hate/violence
    "hate symbol", "hate speech", "racial slur", "white supremacy",
    // Explicit/adult
    "explicit sexual", "adult content", "nsfw",
    // Political targeting
    "political persuasion targeting",
    // Other platform violations
    "trademarked slogan", "unlicensed sports", "celebrity endorsement"
];

/**
 * Check a text string against the trademark red flag list.
 * Returns { flagged: boolean, matches: string[] }
 */
function checkTrademarkRisk(text) {
    const lower = (text || "").toLowerCase();
    const matches = TRADEMARK_RED_FLAGS.filter(term => lower.includes(term));
    return {
        flagged: matches.length > 0,
        matches
    };
}

/**
 * Check a text string against the platform policy blocklist.
 * Returns { unsafe: boolean, violations: string[] }
 */
function checkPolicyRisk(text) {
    const lower = (text || "").toLowerCase();
    const violations = POLICY_BLOCKLIST.filter(term => lower.includes(term));
    return {
        unsafe: violations.length > 0,
        violations
    };
}

/**
 * Full compliance evaluation for a product object.
 * Checks niche, slogans, title, description.
 * Returns { safe, trademarkMatches, policyViolations, riskLevel }
 */
function evaluateCompliance(product) {
    const content = [
        product.niche || "",
        Array.isArray(product.shirtSlogans) ? product.shirtSlogans.join(" ") : (product.slogan || ""),
        product.title || product.amazonListing?.title || "",
        product.description || product.amazonListing?.description || "",
        product.bullet_point_1 || product.amazonListing?.bulletPoint1 || "",
        product.bullet_point_2 || product.amazonListing?.bulletPoint2 || ""
    ].join(" ");

    const trademark = checkTrademarkRisk(content);
    const policy = checkPolicyRisk(content);

    const safe = !trademark.flagged && !policy.unsafe;

    let riskLevel = "CLEAR";
    if (!safe) {
        const totalIssues = trademark.matches.length + policy.violations.length;
        riskLevel = totalIssues >= 3 ? "HIGH" : "MEDIUM";
    }

    return {
        safe,
        trademarkMatches: trademark.matches,
        policyViolations: policy.violations,
        riskLevel,
        wasRewritten: false
    };
}

// ─── Smart Compliance Rewrite Engine ───────────────────────────────────────

function extractTheme(text) {
    const themes = [
        { key: "space fantasy hero", hints: ["lightsaber", "jedi", "galaxy", "star wars"] },
        { key: "cute magical creature", hints: ["pocket monster", "evolution", "pokemon"] },
        { key: "athletic motivation", hints: ["just do it", "swoosh vibe", "nike", "adidas"] },
        { key: "wizard school vibe", hints: ["sorting", "magic school", "harry potter", "hogwarts"] },
        { key: "superhero action", hints: ["marvel", "dc comics", "avengers", "batman", "superman", "spiderman"] },
        { key: "music stan", hints: ["taylor swift", "beyonce", "drake"] },
        { key: "animated character", hints: ["disney", "mickey", "spongebob", "simpsons", "hello kitty"] }
    ];

    const lower = text.toLowerCase();

    for (const t of themes) {
        if (t.hints.some(h => lower.includes(h))) {
            return t.key;
        }
    }

    return "general inspirational theme";
}

function generateSafeSlogans(theme) {
    const bank = {
        "space fantasy hero": [
            "Cosmic Courage Mode",
            "Guardians of the Infinite",
            "Born for the Stars",
            "Galaxy Explorer",
            "Defy Gravity",
            "To the Stars and Beyond",
            "Interstellar Rebel",
            "Light Speed Mindset",
            "Stargazer Society",
            "Astral Adventure Awaits"
        ],
        "cute magical creature": [
            "Tiny Power, Big Heart",
            "Adorably Unstoppable",
            "Magic in Small Forms",
            "Pocket Sized Magic",
            "Fiercely Cute",
            "Evolve Every Day",
            "Little But Mighty",
            "Sparkle and Shine",
            "Creature Comforts",
            "Charmingly Chaotic"
        ],
        "athletic motivation": [
            "Move with Purpose",
            "Built for the Effort",
            "Consistency Wins",
            "Outwork Yesterday",
            "Push Your Limits",
            "Train Insane",
            "Sweat Equity",
            "Hustle and Muscle",
            "No Excuses Just Results",
            "Relentless Pursuit"
        ],
        "wizard school vibe": [
            "Study Hard, Dream Wilder",
            "Arcane Energy Only",
            "Knowledge is Power",
            "Magic in the Making",
            "Spellbound Student",
            "Mystical Mindset",
            "Enchanted Everyday",
            "Wandering Wizard",
            "Potions and Positivity",
            "Sorcery and Science"
        ],
        "superhero action": [
            "Heroic Ambition",
            "Not All Heroes Wear Capes",
            "Unleash Your Inner Power",
            "Caped Crusader Energy",
            "Save the Day",
            "Powered by Purpose",
            "Vigilante Values",
            "Super Human Effort",
            "Justice and Joy",
            "Fearless Defender"
        ],
        "music stan": [
            "In My Own Era",
            "Living For The Music",
            "Vibes Only",
            "Soundtrack of My Life",
            "Lost in the Lyrics",
            "Press Play on Life",
            "Melody Maker",
            "Rhythm is a Dancer",
            "Beat Drops and Heart Throps",
            "Turn Up the Volume"
        ],
        "animated character": [
            "Nostalgic Heart",
            "Forever Young",
            "Cartoon State of Mind",
            "Drawn to Adventure",
            "Sketching My Reality",
            "Animated and Alive",
            "Childhood Classics",
            "Toon Town Native",
            "Weekend Morning Vibes",
            "Saturday Morning Energy"
        ],
        "general inspirational theme": [
            "Progress Over Perfection",
            "Quiet Strength",
            "Becoming Better Daily",
            "Embrace the Journey",
            "Find Your Fire",
            "Keep Moving Forward",
            "Believe in You",
            "Small Steps Big Leaps",
            "Chasing Sunsets",
            "Live With Intention"
        ]
    };

    return bank[theme] || bank["general inspirational theme"];
}

function buildSafeImagePrompt(theme) {
    return `Create a commercial print-ready apparel design.

Theme: Original concept inspired by ${theme}

Original concept only.
No references to brands, characters, movies, or lyrics.

Style:
Clean vector design, strong silhouette, high readability.

Production:
Transparent background
300 DPI
Print optimized for POD marketplaces
`;
}

function rewriteToOriginal(product) {
    const textToScan = `${product.niche || ""} ${(product.shirtSlogans || []).join(" ")} ${product.title || ""}`;
    const theme = extractTheme(textToScan);

    return {
        ...product,
        niche: `Original concept inspired by ${theme}`,
        shirtSlogans: generateSafeSlogans(theme),
        imagePrompts: [buildSafeImagePrompt(theme), buildSafeImagePrompt(theme + " (variant art style)")],
        rewritten: true,
        compliance: { safe: true, trademarkMatches: [], policyViolations: [], riskLevel: "CLEAR", wasRewritten: true }
    };
}

function enforceCompliance(product) {
    const result = evaluateCompliance(product);
    if (result.safe) {
        return { ...product, compliance: result };
    }
    return rewriteToOriginal(product);
}

module.exports = { checkTrademarkRisk, checkPolicyRisk, evaluateCompliance, enforceCompliance };
