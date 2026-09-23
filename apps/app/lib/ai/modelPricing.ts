export interface ModelPrice { inputPerMillion: number; outputPerMillion: number; cachedInputPerMillion?: number }
export type ModelPricing = Record<string, ModelPrice>;
/** USD estimates verified against official model pages on 2026-09-12. Override for negotiated prices. */
const standard = { inputPerMillion: 2, outputPerMillion: 8, cachedInputPerMillion: 0.5 };
const mini = { inputPerMillion: 0.15, outputPerMillion: 0.6, cachedInputPerMillion: 0.075 };
export const defaultModelPricing: ModelPricing = {
  "gpt-4.1": standard, "gpt-4.1-2025-04-14": standard,
  "o3": standard, "o3-2025-04-16": standard,
  "gpt-4o-mini": mini, "gpt-4o-mini-2024-07-18": mini,
  "gpt-4o": { inputPerMillion: 2.5, outputPerMillion: 10, cachedInputPerMillion: 1.25 },
};
/** Unknown prices are null, never silently free. */
export function readModelPricing(env = process.env): ModelPricing {
  const pricing: ModelPricing = { ...defaultModelPricing, ...JSON.parse(env.AI_MODEL_PRICING_JSON || "{}") };
  for (const price of Object.values(pricing)) {
    if (![price.inputPerMillion, price.outputPerMillion, price.cachedInputPerMillion ?? price.inputPerMillion].every(n => typeof n === "number" && Number.isFinite(n) && n >= 0)) throw new Error("Invalid AI model pricing configuration");
  }
  return pricing;
}
export function estimateModelCost(model: string, input: number, output: number, cached: number, pricing: ModelPricing): number | null {
  const price = pricing[model];
  if (!price) return null;
  const cachedTokens = Math.min(input, Math.max(0, cached));
  return ((input - cachedTokens) * price.inputPerMillion + cachedTokens * (price.cachedInputPerMillion ?? price.inputPerMillion) + output * price.outputPerMillion) / 1_000_000;
}
