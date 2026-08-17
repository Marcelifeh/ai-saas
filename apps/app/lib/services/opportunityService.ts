import { globalCache } from "@/lib/utils/cache";

export type OpportunityStage =
  | "DISCOVERED"
  | "WATCHING"
  | "ACCELERATING"
  | "FACTORY_READY"
  | "TESTING"
  | "WINNER"
  | "DECLINING"
  | "ARCHIVED";

export type OpportunityTransitionReason =
  | "SIGNAL_ACCELERATION"
  | "EVIDENCE_DECAY"
  | "FACTORY_PROMOTION"
  | "TEST_STARTED"
  | "PERFORMANCE_CONFIRMED"
  | "PERFORMANCE_DECLINE"
  | "USER_ACTION";

export interface OpportunityTransition {
  from: OpportunityStage;
  to: OpportunityStage;
  reasonCode: OpportunityTransitionReason;
  evidenceSnapshotId?: string;
  occurredAt: string;
}

export const ALLOWED_TRANSITIONS: Record<OpportunityStage, OpportunityStage[]> = {
  DISCOVERED: ["WATCHING", "FACTORY_READY"],
  WATCHING: ["ACCELERATING", "DECLINING"],
  ACCELERATING: ["FACTORY_READY", "DECLINING"],
  FACTORY_READY: ["TESTING"],
  TESTING: ["WINNER", "DECLINING"],
  WINNER: ["DECLINING"],
  DECLINING: ["WATCHING", "ARCHIVED"],
  ARCHIVED: ["WATCHING"],
};

export function canTransitionOpportunity(current: OpportunityStage, next: OpportunityStage): boolean {
  if (current === next) return true;
  const allowed = ALLOWED_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

export interface OpportunityRecord {
  opportunityId: string;
  niche: string;
  audience: string;
  whyItSells: string;
  emotionalTrigger: string;
  projectedRevenue: number;
  nicheScore: number;
  trendScore: number;
  stage: OpportunityStage;
  createdAt: string;
  updatedAt: string;
  culturalSignals: string[];
  evidenceSnapshotId?: string;
  transitionHistory: OpportunityTransition[];
}

export async function saveOpportunityToWatchlist(
  opp: Omit<OpportunityRecord, "opportunityId" | "stage" | "createdAt" | "updatedAt" | "transitionHistory">
): Promise<OpportunityRecord> {
  const timestamp = new Date().toISOString();
  const opportunityId = `opp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const initialTransition: OpportunityTransition = {
    from: "DISCOVERED",
    to: "WATCHING",
    reasonCode: "USER_ACTION",
    evidenceSnapshotId: opp.evidenceSnapshotId,
    occurredAt: timestamp,
  };

  const record: OpportunityRecord = {
    ...opp,
    opportunityId,
    stage: "WATCHING",
    createdAt: timestamp,
    updatedAt: timestamp,
    transitionHistory: [initialTransition],
  };

  const watchlist = await getWatchlist();
  const existingIdx = watchlist.findIndex((item) => item.niche.toLowerCase() === opp.niche.toLowerCase());

  if (existingIdx !== -1) {
    watchlist[existingIdx] = {
      ...watchlist[existingIdx],
      ...opp,
      updatedAt: timestamp,
    };
    globalCache.set("user_opportunity_watchlist", watchlist, 24 * 60 * 60 * 1000);
    return watchlist[existingIdx];
  }

  watchlist.unshift(record);
  globalCache.set("user_opportunity_watchlist", watchlist, 24 * 60 * 60 * 1000);
  return record;
}

export async function getWatchlist(): Promise<OpportunityRecord[]> {
  const cached = globalCache.get("user_opportunity_watchlist") as OpportunityRecord[] | null;
  return cached || [];
}

export async function updateOpportunityStage(
  opportunityId: string,
  newStage: OpportunityStage,
  reasonCode: OpportunityTransitionReason = "USER_ACTION",
  evidenceSnapshotId?: string
): Promise<{ success: boolean; opportunity?: OpportunityRecord; error?: string }> {
  const watchlist = await getWatchlist();
  const item = watchlist.find((o) => o.opportunityId === opportunityId);

  if (!item) {
    return { success: false, error: "Opportunity not found" };
  }

  if (!canTransitionOpportunity(item.stage, newStage)) {
    return {
      success: false,
      error: `Governed lifecycle violation: cannot transition from ${item.stage} to ${newStage}`,
    };
  }

  const transition: OpportunityTransition = {
    from: item.stage,
    to: newStage,
    reasonCode,
    evidenceSnapshotId: evidenceSnapshotId || item.evidenceSnapshotId,
    occurredAt: new Date().toISOString(),
  };

  item.stage = newStage;
  item.updatedAt = new Date().toISOString();
  item.transitionHistory = item.transitionHistory || [];
  item.transitionHistory.push(transition);

  globalCache.set("user_opportunity_watchlist", watchlist, 24 * 60 * 60 * 1000);
  return { success: true, opportunity: item };
}
