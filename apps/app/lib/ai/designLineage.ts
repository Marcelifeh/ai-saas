import type { DesignMode } from "@/hooks/useFactory";

export type DesignRegenerationReason =
  | "USER_REFRESH"
  | "DIVERSITY_REPAIR"
  | "QUALITY_REPAIR";

export interface DesignCandidate {
  id: string;
  sloganId: string;
  parentDesignId?: string;
  semanticFingerprint: string;
  regenerationReason?: DesignRegenerationReason;
  requestedMode: DesignMode;
  resolvedMode: Exclude<DesignMode, "AUTO">;
  prompt: string;
  createdAt: string;
}

export function createDesignCandidate(
  sloganId: string,
  prompt: string,
  requestedMode: DesignMode,
  resolvedMode: Exclude<DesignMode, "AUTO">,
  parentDesignId?: string,
  reason?: DesignRegenerationReason
): DesignCandidate {
  const hexSuffix = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
  const id = `des_${Date.now()}_${hexSuffix}`;
  const semanticFingerprint = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 32);

  return {
    id,
    sloganId,
    parentDesignId,
    semanticFingerprint,
    regenerationReason: reason || "USER_REFRESH",
    requestedMode,
    resolvedMode,
    prompt,
    createdAt: new Date().toISOString(),
  };
}
