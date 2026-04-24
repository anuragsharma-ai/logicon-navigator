// Dynamic Leads configuration store.
// All dropdowns, pipelines, scoring rules and SLAs across the Leads module
// are sourced from this file (mock SaaS setup). In production this would
// be backed by a Setup API; the shape stays the same.

export type LeadStageKey = string;

export type LeadStage = {
  id: LeadStageKey;
  name: string;
  color: string; // hex used as accent on Kanban columns
  isFinal: "won" | "lost" | null;
  order: number;
  permission: "all" | "manager" | "admin";
};

export type LeadSource = {
  id: string;
  name: string;
  active: boolean;
  score: number; // contributes to lead scoring
};

export type LeadRegion = {
  id: string;
  name: string;
};

export type LeadSite = {
  id: string;
  name: string;
  regionId: string;
};

export type LeadIndustry = {
  id: string;
  name: string;
  score: number;
};

export type LeadLostReason = {
  id: string;
  name: string;
  active: boolean;
};

export type LeadAssignmentRule = {
  id: string;
  name: string;
  type: "round-robin" | "by-region" | "by-source" | "by-workload";
  active: boolean;
};

export type LeadSlaRule = {
  id: string;
  stage: string;
  firstResponseHrs: number;
  followUpDays: number;
  escalateAfterHrs: number;
};

export type LeadCustomField = {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "date";
  required: boolean;
  visibleTo: ("admin" | "manager" | "executive")[];
};

export const leadStages: LeadStage[] = [
  { id: "new", name: "New", color: "#3B82F6", isFinal: null, order: 1, permission: "all" },
  { id: "contacted", name: "Contacted", color: "#EAB308", isFinal: null, order: 2, permission: "all" },
  { id: "qualified", name: "Qualified", color: "#10B981", isFinal: null, order: 3, permission: "all" },
  { id: "proposal", name: "Proposal Sent", color: "#8B5CF6", isFinal: null, order: 4, permission: "manager" },
  { id: "won", name: "Won", color: "#059669", isFinal: "won", order: 5, permission: "manager" },
  { id: "lost", name: "Lost", color: "#EF4444", isFinal: "lost", order: 6, permission: "all" },
];

export const leadSources: LeadSource[] = [
  { id: "website", name: "Website", active: true, score: 15 },
  { id: "referral", name: "Referral", active: true, score: 25 },
  { id: "ads", name: "Google Ads", active: true, score: 20 },
  { id: "linkedin", name: "LinkedIn Ads", active: true, score: 22 },
  { id: "cold", name: "Cold Call", active: true, score: 8 },
  { id: "event", name: "Event / Tradeshow", active: true, score: 18 },
];

export const leadRegions: LeadRegion[] = [
  { id: "north", name: "North" },
  { id: "south", name: "South" },
  { id: "west", name: "West" },
  { id: "east", name: "East Coast" },
];

export const leadSites: LeadSite[] = [
  { id: "ggn", name: "Gurugram HQ", regionId: "north" },
  { id: "noi", name: "Noida Tower B", regionId: "north" },
  { id: "blr", name: "Bangalore Tech Park", regionId: "south" },
  { id: "mum", name: "Mumbai Warehouse", regionId: "west" },
  { id: "nyc", name: "NYC Office", regionId: "east" },
];

export const leadIndustries: LeadIndustry[] = [
  { id: "saas", name: "SaaS / Technology", score: 20 },
  { id: "finance", name: "Banking & Finance", score: 18 },
  { id: "manufacturing", name: "Manufacturing", score: 15 },
  { id: "retail", name: "Retail", score: 12 },
  { id: "healthcare", name: "Healthcare", score: 16 },
  { id: "logistics", name: "Logistics", score: 14 },
];

export const leadOwners = [
  { id: "u-4", name: "Sara Khan", email: "sara@logicon.us", team: "APAC", territory: "East Coast" },
  { id: "u-2", name: "Priya Sharma", email: "priya@logicon.io", team: "EMEA", territory: "North" },
  { id: "u-3", name: "Rahul Verma", email: "rahul@logicon.io", team: "APAC", territory: "South" },
  { id: "u-1", name: "Aarav Mehta", email: "aarav@logicon.io", team: "APAC", territory: "West" },
];

export const leadLostReasons: LeadLostReason[] = [
  { id: "price", name: "Price too high", active: true },
  { id: "competitor", name: "Lost to competitor", active: true },
  { id: "timing", name: "Bad timing", active: true },
  { id: "no-need", name: "No requirement", active: true },
  { id: "no-response", name: "No response", active: true },
];

export const leadAssignmentRules: LeadAssignmentRule[] = [
  { id: "ar-1", name: "Round-robin Sales Team", type: "round-robin", active: true },
  { id: "ar-2", name: "Region → Owner mapping", type: "by-region", active: true },
  { id: "ar-3", name: "Source → Owner mapping", type: "by-source", active: false },
  { id: "ar-4", name: "Lowest workload first", type: "by-workload", active: true },
];

export const leadSlaRules: LeadSlaRule[] = [
  { id: "sla-1", stage: "new", firstResponseHrs: 4, followUpDays: 1, escalateAfterHrs: 24 },
  { id: "sla-2", stage: "contacted", firstResponseHrs: 8, followUpDays: 2, escalateAfterHrs: 48 },
  { id: "sla-3", stage: "qualified", firstResponseHrs: 12, followUpDays: 3, escalateAfterHrs: 72 },
  { id: "sla-4", stage: "proposal", firstResponseHrs: 24, followUpDays: 5, escalateAfterHrs: 120 },
];

export const leadCustomFields: LeadCustomField[] = [
  { id: "cf-1", label: "Decision Maker", type: "text", required: false, visibleTo: ["admin", "manager", "executive"] },
  { id: "cf-2", label: "Budget Confirmed", type: "select", required: false, visibleTo: ["admin", "manager"] },
  { id: "cf-3", label: "Tech Stack", type: "text", required: false, visibleTo: ["admin", "manager", "executive"] },
];

// Lead score band thresholds
export const leadScoreBands = {
  hot: 60,
  warm: 30,
};

export function scoreBand(score: number): "Hot" | "Warm" | "Cold" {
  if (score >= leadScoreBands.hot) return "Hot";
  if (score >= leadScoreBands.warm) return "Warm";
  return "Cold";
}

export function computeLeadScore(input: {
  sourceId?: string;
  industryId?: string;
  estimatedValue?: number;
  probability?: number;
}): number {
  const src = leadSources.find((s) => s.id === input.sourceId)?.score ?? 0;
  const ind = leadIndustries.find((i) => i.id === input.industryId)?.score ?? 0;
  const val =
    !input.estimatedValue
      ? 0
      : input.estimatedValue >= 1_000_000
        ? 25
        : input.estimatedValue >= 250_000
          ? 15
          : input.estimatedValue >= 50_000
            ? 8
            : 3;
  const prob = Math.round(((input.probability ?? 0) / 100) * 20);
  return src + ind + val + prob;
}
