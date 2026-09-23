import { z } from "zod";

const compositionType = z.enum(["BEHAVIORAL_INTERSECTION", "IDENTITY_INTERSECTION", "CULTURAL_INTERSECTION", "AESTHETIC_INTERSECTION", "RITUAL_INTERSECTION", "SYMBOLIC_INTERSECTION"]);
const axisRole = z.object({ axis: z.string(), contribution: z.string() }).strict();
export const compositionResponseSchema = z.object({
  kind: z.enum(["single", "compound"]), axes: z.array(z.string()),
  compositionType: compositionType.nullable(), sharedPremise: z.string(),
  axisRoles: z.array(axisRole), evidenceRefs: z.array(z.string()),
  compositionConfidence: z.number().min(0).max(100),
  alternativeCompositionTypes: z.array(z.object({
    compositionType, confidence: z.number().min(0).max(100), sharedPremise: z.string(),
    axisRoles: z.array(axisRole), evidenceRefs: z.array(z.string()),
  }).strict()),
}).strict();
