import { NextResponse } from "next/server";
import { withWorkspaceAuth } from "@/lib/api/routeWrappers";
import { checkCompliance, checkText, filterSafeSlogans } from "@/lib/services/complianceEngine";
import { z } from "zod";

const RequestSchema = z.object({
    /** Free-form text (niche name, title, description) */
    text: z.string().min(1).max(2000).optional(),
    /** Array of slogans to scan */
    slogans: z.array(z.string().max(300)).max(50).optional(),
    /** Full product object — most thorough check */
    product: z
        .object({
            niche: z.string().optional(),
            slogan: z.string().optional(),
            shirtSlogans: z.array(z.string()).optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            bullet_point_1: z.string().optional(),
            bullet_point_2: z.string().optional(),
            amazonListing: z
                .object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    bulletPoint1: z.string().optional(),
                    bulletPoint2: z.string().optional(),
                    keywords: z.array(z.string()).optional(),
                })
                .optional(),
        })
        .optional(),
});

export const POST = withWorkspaceAuth(async ({ req }) => {
    let body: unknown;
    try {
        body = await (req as Request).json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    const { text, slogans, product } = parsed.data;

    // At least one input required
    if (!text && !slogans?.length && !product) {
        return NextResponse.json(
            { error: "Provide at least one of: text, slogans, product" },
            { status: 400 },
        );
    }

    const response: Record<string, unknown> = {};

    if (text) {
        response.textReport = checkText(text);
    }

    if (slogans?.length) {
        const filtered = filterSafeSlogans(slogans);
        response.sloganFilter = {
            input: slogans.length,
            safe: filtered.safe.length,
            removed: filtered.removed.length,
            safeSlogans: filtered.safe,
            removedSlogans: filtered.removed,
        };
    }

    if (product) {
        response.productReport = checkCompliance(product);
    }

    return NextResponse.json({ success: true, ...response });
});
