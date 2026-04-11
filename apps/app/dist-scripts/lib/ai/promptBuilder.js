"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_RULES = void 0;
exports.detectPlatform = detectPlatform;
exports.buildImagePrompt = buildImagePrompt;
// server-only removed for script runtime
function detectPlatform(platformInput) {
    if (!platformInput)
        return "amazon";
    const p = platformInput.toLowerCase();
    if (p.includes("etsy"))
        return "etsy";
    if (p.includes("redbubble"))
        return "redbubble";
    if (p.includes("shopify") || p.includes("printify") || p.includes("printful"))
        return "shopify";
    if (p.includes("teespring") || p.includes("spring"))
        return "shopify";
    return "amazon";
}
exports.PLATFORM_RULES = {
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
function buildImagePrompt() {
    return `Create an original POD t-shirt design.

Text: "[SLOGAN]"
No brands, logos, or trademarks.
Transparent background.
Commercial friendly.
300 DPI.`;
}
