export interface IntelligenceProvenance {
  provenanceId: string;
  generatedAt: string;
  evidenceSnapshotId: string;
  sourceSignals: string[];
  niche: string;
  profileVersion: string;
  sloganEngineVersion: string;
  designEngineVersion: string;
  listingEngineVersion: string;
  parentOpportunityId?: string;
  parentSloganId?: string;
  parentDesignId?: string;
}

export function createProvenanceSnapshot(
  niche: string,
  sourceSignals: string[],
  evidenceSnapshotId?: string,
  parents?: {
    opportunityId?: string;
    sloganId?: string;
    designId?: string;
  }
): IntelligenceProvenance {
  const timestamp = new Date().toISOString();
  const randomSuffix = Math.random().toString(36).substring(2, 9);

  return {
    provenanceId: `prov_${Date.now()}_${randomSuffix}`,
    generatedAt: timestamp,
    evidenceSnapshotId: evidenceSnapshotId || `snap_${Date.now()}_${randomSuffix}`,
    sourceSignals: sourceSignals.slice(0, 10),
    niche: niche.trim().toLowerCase(),
    profileVersion: "v2.4-dynamic",
    sloganEngineVersion: "v3.1-evidence",
    designEngineVersion: "v2.0-dynamic-visual",
    listingEngineVersion: "v2.2-seo-grounded",
    parentOpportunityId: parents?.opportunityId,
    parentSloganId: parents?.sloganId,
    parentDesignId: parents?.designId,
  };
}
