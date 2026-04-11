import { chatCompletionSafe } from "./aiGateway";
import { OpportunityScoreResult } from "../market/providers/types";

/**
 * Generates structured 'Creative Director' strategy (v1.2).
 * Fast, precise 4-point strategic gap analysis.
 */
export async function generateMarketInsights(entry: OpportunityScoreResult): Promise<string> {
    const prompt = `
Act as an Elite POD Creative Director. Analyze this niche using structured marketplace data:

Keyword: ${entry.niche}
Demand Score: ${entry.demandScore}/100
Competition: ${entry.competitionScore}/100
Momentum: ${entry.velocityScore}/100
Novelty: ${entry.noveltyScore}/100

Find the profitable gap and output EXACTLY in this JSON-like structure:
- gap: (Market weakness, what competitors are missing)
- emotion: (Primary emotional trigger: playful dominance, cynical insider, etc)
- angle: (Specific sub-niche slang or insider hook to use)
- positioning: (Core audience identity framework)

Keep each point under 15 words. Be extremely sharp.
`;

    const completion = await chatCompletionSafe({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
        usageContext: { feature: "ai.marketInsightEngine" },
    });

    if (completion.error || !completion.data) {
        return "- gap: Generic listings lack authentic emotional connection.\n- emotion: Insider pride/sarcasm.\n- angle: Use niche-specific jargon unknown to outsiders.\n- positioning: Expert-level practitioner identity.";
    }

    return completion.data.choices[0].message.content?.trim() || "";
}
