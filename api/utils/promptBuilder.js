function detectPlatform(platformInput) {
    if (!platformInput) return "amazon";
    const p = platformInput.toLowerCase();
    if (p.includes("etsy")) return "etsy";
    if (p.includes("redbubble")) return "redbubble";
    if (p.includes("shopify") || p.includes("printify") || p.includes("printful")) return "shopify";
    if (p.includes("teespring") || p.includes("spring")) return "shopify";
    return "amazon"; // default
}

const PLATFORM_RULES = {
    amazon: `PLATFORM OPTIMIZATION — Amazon Merch on Demand:
Max print clarity at 4500x5400 ratio
Bold typography preferred for thumbnail legibility
Design visible and readable at small marketplace thumbnail size
High-contrast palette for dark garment performance`,

    etsy: `PLATFORM OPTIMIZATION — Etsy POD:
Handmade, artisanal aesthetic or strong niche personality emphasis
Giftable visual tone — design should feel personal and intentional
Artistic or boutique presentation preferred over mass-market generic look
Seasonal or evergreen niche visual cues`,

    redbubble: `PLATFORM OPTIMIZATION — Redbubble:
Art-forward, visually expressive composition
Works effectively on stickers, laptop cases, and apparel simultaneously
Strong silhouette that reads at small sizes
Illustrative or graphic art style preferred`,

    shopify: `PLATFORM OPTIMIZATION — eCommerce Storefront (Shopify / Printify / Printful):
Brandable, professional aesthetic suitable for a product catalogue
Clean layout adaptable to multiple product types (tee, hoodie, tote, mug)
Consistent with a cohesive brand identity
Suitable for paid traffic ad creative thumbnails`
};

function buildImagePrompt({ niche, audience, style, platform }) {
    const platformKey = detectPlatform(platform);
    const platformBlock = PLATFORM_RULES[platformKey];

    return `Create a commercial print-ready apparel design.

NICHE: ${niche}
TARGET AUDIENCE: ${audience || "general apparel buyer"}
DESIGN STYLE: ${style || "evergreen commercial"}

CORE CONCEPT:
A visually clear, high-conversion t-shirt design focused on strong readability, emotional appeal, and marketplace compliance.

COMPOSITION:
Centered design optimized for chest print area
Strong silhouette — balanced spacing — readable at distance
No clutter

GRAPHIC STYLE:
Clean vector illustration or typography-based design
Commercial evergreen style suitable for mass-market apparel

COLOR STRATEGY:
Print-safe color palette
High contrast for dark and light garments
Limited color count for production efficiency

PLATFORM PRODUCTION REQUIREMENTS:
Transparent background
Vector-style artwork
300 DPI minimum
No mockups — no background scenery — no photographic textures
No tiny details that disappear when printed
No trademarked content

COMMERCIAL OPTIMIZATION:
Designed for high click-through and readability in marketplace thumbnails
Emotionally resonant visual concept
Scalable across apparel types (t-shirt, hoodie, tote)

${platformBlock}

OUTPUT:
Single isolated design ready for upload to POD platforms`;
}

module.exports = {
    detectPlatform,
    PLATFORM_RULES,
    buildImagePrompt
};
