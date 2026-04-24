import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Plus,
  Download,
  Upload,
  Search,
  X,
  Eye,
  Pencil,
  ArrowRightCircle,
  LayoutGrid,
  Table as TableIcon,
  TrendingUp,
  UserCheck,
  Trophy,
  XCircle,
  Sparkles,
  Phone,
  Mail,
  StickyNote,
  Flame,
  Settings2,
  Filter,
  Calendar as CalIcon,
  ChevronDown,
} from "lucide-react";
import {
  leadStages,
  leadSources,
  leadRegions,
  leadSites,
  leadIndustries,
  leadOwners,
  leadLostReasons,
  computeLeadScore,
  scoreBand,
  type LeadStage,
} from "@/setup/leadsConfig";

export const Route = createFileRoute("/sales/lead")({
  head: () => ({
    meta: [
      { title: "Leads Management — Sales | Logicon ERP" },
      {
        name: "description",
        content:
          "CRM-style Leads Management with dynamic pipeline, scoring, assignment and conversion to client onboarding.",
      },
      { property: "og:title", content: "Leads Management — Logicon ERP" },
      {
        property: "og:description",
        content:
          "Capture, qualify, score and convert sales leads. Fully driven by admin-configured Setup values.",
      },
    ],
  }),
  component: LeadPage,
});

/* ----------------------------- Types & Data ----------------------------- */

type Priority = "Low" | "Medium" | "High";

type Lead = {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  sourceId: string;
  campaign?: string;
  industryId: string;
  estimatedValue: number;
  expectedClose?: string;
  probability: number;
  priority: Priority;
  regionId: string;
  siteId: string;
  ownerId: string;
  team?: string;
  territory?: string;
  stageId: string;
  nextFollowUp: string;
  reminderType: "Notification" | "Email";
  remarks?: string;
  lostReasonId?: string;
  createdAt: string;
  createdBy: string;
  locked?: boolean;
};

const today = new Date();
const isoDate = (d: Date) => d.toISOString().slice(0, 10);
const offsetDate = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return isoDate(d);
};

const SEED: Lead[] = [
  {
    id: "LD-1042",
    name: "Acme HQ Facility Deal",
    company: "Acme Corp",
    contact: "Priya Shah",
    email: "priya@acme.com",
    phone: "+91 98765 43210",
    sourceId: "website",
    industryId: "manufacturing",
    estimatedValue: 480000,
    probability: 35,
    priority: "High",
    regionId: "west",
    siteId: "mum",
    ownerId: "u-1",
    stageId: "new",
    nextFollowUp: offsetDate(2),
    reminderType: "Notification",
    createdAt: offsetDate(-3),
    createdBy: "Admin",
  },
  {
    id: "LD-1041",
    name: "Northwind Soft Services",
    company: "Northwind Logistics",
    contact: "Kabir Singh",
    email: "kabir@northwind.io",
    phone: "+91 99887 12345",
    sourceId: "referral",
    industryId: "logistics",
    estimatedValue: 220000,
    probability: 45,
    priority: "Medium",
    regionId: "north",
    siteId: "ggn",
    ownerId: "u-2",
    stageId: "contacted",
    nextFollowUp: offsetDate(1),
    reminderType: "Email",
    createdAt: offsetDate(-7),
    createdBy: "Admin",
  },
  {
    id: "LD-1040",
    name: "Helios Tower Maintenance",
    company: "Helios Realty",
    contact: "Meera Iyer",
    email: "meera@helios.co",
    phone: "+91 90000 22221",
    sourceId: "ads",
    industryId: "retail",
    estimatedValue: 760000,
    probability: 60,
    priority: "High",
    regionId: "south",
    siteId: "blr",
    ownerId: "u-3",
    stageId: "qualified",
    nextFollowUp: offsetDate(3),
    reminderType: "Notification",
    createdAt: offsetDate(-10),
    createdBy: "Admin",
  },
  {
    id: "LD-1039",
    name: "Bluepeak Annual Contract",
    company: "Bluepeak Pharma",
    contact: "Arjun Nair",
    email: "arjun@bluepeak.com",
    phone: "+91 90011 55667",
    sourceId: "linkedin",
    industryId: "healthcare",
    estimatedValue: 1250000,
    probability: 70,
    priority: "High",
    regionId: "west",
    siteId: "mum",
    ownerId: "u-1",
    stageId: "proposal",
    nextFollowUp: offsetDate(5),
    reminderType: "Email",
    createdAt: offsetDate(-13),
    createdBy: "Admin",
  },
  {
    id: "LD-1038",
    name: "Skyline Mall Housekeeping",
    company: "Skyline Group",
    contact: "Neha Kapoor",
    email: "neha@skyline.in",
    phone: "+91 98999 11122",
    sourceId: "referral",
    industryId: "retail",
    estimatedValue: 980000,
    probability: 100,
    priority: "High",
    regionId: "north",
    siteId: "ggn",
    ownerId: "u-2",
    stageId: "won",
    nextFollowUp: offsetDate(-1),
    reminderType: "Notification",
    createdAt: offsetDate(-17),
    createdBy: "Admin",
    locked: true,
  },
  {
    id: "LD-1037",
    name: "Coastal Resorts Pilot",
    company: "Coastal Hospitality",
    contact: "Rahul Verma",
    email: "rahul@coastal.com",
    phone: "+91 90909 80808",
    sourceId: "website",
    industryId: "saas",
    estimatedValue: 340000,
    probability: 0,
    priority: "Low",
    regionId: "south",
    siteId: "blr",
    ownerId: "u-3",
    stageId: "lost",
    lostReasonId: "competitor",
    nextFollowUp: offsetDate(-20),
    reminderType: "Email",
    createdAt: offsetDate(-22),
    createdBy: "Admin",
  },
  {
    id: "LD-1036",
    name: "Orbit Tech Park Facility",
    company: "Orbit Developers",
    contact: "Sana Khan",
    email: "sana@orbit.dev",
    phone: "+91 91234 56780",
    sourceId: "ads",
    industryId: "saas",
    estimatedValue: 540000,
    probability: 25,
    priority: "Medium",
    regionId: "south",
    siteId: "blr",
    ownerId: "u-3",
    stageId: "contacted",
    nextFollowUp: offsetDate(2),
    reminderType: "Notification",
    createdAt: offsetDate(-2),
    createdBy: "Admin",
  },
  {
    id: "LD-1035",
    name: "Greenfield Campus Care",
    company: "Greenfield Edu",
    contact: "Devika Rao",
    email: "devika@greenfield.edu",
    phone: "+91 99001 22210",
    sourceId: "event",
    industryId: "healthcare",
    estimatedValue: 420000,
    probability: 50,
    priority: "Medium",
    regionId: "east",
    siteId: "nyc",
    ownerId: "u-4",
    stageId: "qualified",
    nextFollowUp: offsetDate(4),
    reminderType: "Email",
    createdAt: offsetDate(-6),
    createdBy: "Admin",
  },
];

/* ----------------------------- Helpers ----------------------------- */

const fmtINR = (n: number) =>
  n >= 10_000_000
    ? `₹${(n / 10_000_000).toFixed(1)}Cr`
    : n >= 100_000
      ? `₹${(n / 100_000).toFixed(1)}L`
      : `₹${n.toLocaleString("en-IN")}`;

const stageById = (id: string) => leadStages.find((s) => s.id === id);
const sourceName = (id: string) => leadSources.find((s) => s.id === id)?.name ?? "—";
const regionName = (id: string) => leadRegions.find((r) => r.id === id)?.name ?? "—";
const siteName = (id: string) => leadSites.find((s) => s.id === id)?.name ?? "—";
const industryName = (id: string) => leadIndustries.find((i) => i.id === id)?.name ?? "—";
const ownerById = (id: string) => leadOwners.find((o) => o.id === id);
const ownerName = (id: string) => ownerById(id)?.name ?? "—";
const lostReasonName = (id?: string) =>
  id ? leadLostReasons.find((r) => r.id === id)?.name ?? "—" : "—";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const priorityClass = (p: Priority) =>
  p === "High"
    ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
    : p === "Medium"
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      : "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

const scoreBandClass = (b: "Hot" | "Warm" | "Cold") =>
  b === "Hot"
    ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
    : b === "Warm"
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      : "bg-sky-50 text-sky-700 ring-1 ring-sky-200";

/* ----------------------------- Page ----------------------------- */

function LeadPage() {
  const [leads, setLeads] = useState<Lead[]>(SEED);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [query, setQuery] = useState("");
  const [stageF, setStageF] = useState("all");
  const [sourceF, setSourceF] = useState("all");
  const [regionF, setRegionF] = useState("all");
  const [ownerF, setOwnerF] = useState("all");
  const [priorityF, setPriorityF] = useState<"all" | Priority>("all");
  const [scoreF, setScoreF] = useState<"all" | "Hot" | "Warm" | "Cold">("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);
  const [lostLead, setLostLead] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (stageF !== "all" && l.stageId !== stageF) return false;
      if (sourceF !== "all" && l.sourceId !== sourceF) return false;
      if (regionF !== "all" && l.regionId !== regionF) return false;
      if (ownerF !== "all" && l.ownerId !== ownerF) return false;
      if (priorityF !== "all" && l.priority !== priorityF) return false;
      if (scoreF !== "all") {
        const band = scoreBand(
          computeLeadScore({
            sourceId: l.sourceId,
            industryId: l.industryId,
            estimatedValue: l.estimatedValue,
            probability: l.probability,
          }),
        );
        if (band !== scoreF) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        const hay = `${l.name} ${l.company} ${l.contact} ${l.email} ${l.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, stageF, sourceF, regionF, ownerF, priorityF, scoreF, query]);

  const kpis = useMemo(() => {
    const total = leads.length;
    const ofStage = (id: string) => leads.filter((l) => l.stageId === id).length;
    const newC = ofStage("new");
    const qual = ofStage("qualified");
    const won = ofStage("won");
    const lost = ofStage("lost");
    const closed = won + lost;
    const conv = closed ? Math.round((won / closed) * 100) : 0;
    return { total, newC, qual, won, lost, conv };
  }, [leads]);

  /* mutations */
  const moveLead = (id: string, stageId: string) => {
    const stage = stageById(stageId);
    if (!stage) return;
    if (stage.isFinal === "lost") {
      const l = leads.find((x) => x.id === id);
      if (l) setLostLead(l);
      return;
    }
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, stageId, locked: stage.isFinal === "won" ? true : l.locked }
          : l,
      ),
    );
  };

  const addLead = (l: Lead) => setLeads((prev) => [l, ...prev]);

  const confirmLost = (reasonId: string) => {
    if (!lostLead) return;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === lostLead.id ? { ...l, stageId: "lost", lostReasonId: reasonId } : l,
      ),
    );
    setLostLead(null);
  };

  const confirmConvert = () => {
    if (!convertLead) return;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === convertLead.id ? { ...l, stageId: "won", locked: true } : l,
      ),
    );
    setConvertLead(null);
    setDetailLead(null);
  };

  return (
    <AppLayout>
      <div className="space-y-5 px-1 pb-12">
        {/* HEADER */}
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Leads Management
            </h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Track and convert sales opportunities • Configured via{" "}
              <Link
                to="/setup/module-settings/sales"
                className="text-primary hover:underline"
              >
                Setup → Sales
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[13px] font-medium text-foreground hover:bg-accent">
              <Upload size={14} /> Import
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[13px] font-medium text-foreground hover:bg-accent">
              <Download size={14} /> Export
            </button>
            <Link
              to="/setup/module-settings/sales"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[13px] font-medium text-foreground hover:bg-accent"
            >
              <Settings2 size={14} /> Setup
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground shadow-sm hover:opacity-95"
            >
              <Plus size={14} /> Add New Lead
            </button>
          </div>
        </header>

        {/* KPI ROW */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Total Leads" value={kpis.total} icon={Sparkles} tone="slate" />
          <KpiCard label="New" value={kpis.newC} icon={TrendingUp} tone="blue" />
          <KpiCard label="Qualified" value={kpis.qual} icon={UserCheck} tone="emerald" />
          <KpiCard label="Converted" value={kpis.won} icon={Trophy} tone="primary" />
          <KpiCard label="Lost" value={kpis.lost} icon={XCircle} tone="rose" />
          <KpiCard label="Conversion Rate" value={`${kpis.conv}%`} icon={Flame} tone="amber" />
        </section>

        {/* FILTERS / VIEW TOGGLE */}
        <section className="rounded-lg border border-border bg-card p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lead, company, contact…"
                className="h-9 w-[260px] rounded-md border border-border bg-background pl-8 pr-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <FilterSelect value={stageF} onChange={setStageF} label="Stage">
              <option value="all">All stages</option>
              {leadStages.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </FilterSelect>
            <FilterSelect value={sourceF} onChange={setSourceF} label="Source">
              <option value="all">All sources</option>
              {leadSources.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </FilterSelect>
            <FilterSelect value={regionF} onChange={setRegionF} label="Region">
              <option value="all">All regions</option>
              {leadRegions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </FilterSelect>
            <FilterSelect value={ownerF} onChange={setOwnerF} label="Owner">
              <option value="all">All owners</option>
              {leadOwners.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </FilterSelect>
            <FilterSelect value={priorityF} onChange={(v) => setPriorityF(v as "all" | Priority)} label="Priority">
              <option value="all">All priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </FilterSelect>
            <FilterSelect value={scoreF} onChange={(v) => setScoreF(v as "all" | "Hot" | "Warm" | "Cold")} label="Score">
              <option value="all">All scores</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </FilterSelect>

            <div className="ml-auto inline-flex items-center rounded-md border border-border bg-background p-0.5">
              <button
                onClick={() => setView("kanban")}
                className={`inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-[12.5px] font-medium ${
                  view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid size={13} /> Kanban
              </button>
              <button
                onClick={() => setView("table")}
                className={`inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-[12.5px] font-medium ${
                  view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon size={13} /> Table
              </button>
            </div>
          </div>
        </section>

        {/* MAIN VIEW */}
        {view === "kanban" ? (
          <KanbanView
            leads={filtered}
            onMove={moveLead}
            onOpen={(l) => setDetailLead(l)}
          />
        ) : (
          <TableView
            leads={filtered}
            onOpen={(l) => setDetailLead(l)}
            onConvert={(l) => setConvertLead(l)}
          />
        )}

        {/* ANALYTICS */}
        <Analytics leads={leads} />
      </div>

      {/* Drawers / Modals */}
      {drawerOpen && (
        <AddLeadDrawer
          onClose={() => setDrawerOpen(false)}
          onSave={(l) => {
            addLead(l);
            setDrawerOpen(false);
          }}
        />
      )}
      {detailLead && (
        <LeadDetailDrawer
          lead={detailLead}
          onClose={() => setDetailLead(null)}
          onConvert={() => setConvertLead(detailLead)}
          onMove={(id, s) => {
            moveLead(id, s);
            setDetailLead((cur) => (cur && cur.id === id ? { ...cur, stageId: s } : cur));
          }}
        />
      )}
      {convertLead && (
        <ConvertModal
          lead={convertLead}
          onClose={() => setConvertLead(null)}
          onConfirm={confirmConvert}
        />
      )}
      {lostLead && (
        <LostReasonModal
          lead={lostLead}
          onClose={() => setLostLead(null)}
          onConfirm={confirmLost}
        />
      )}
    </AppLayout>
  );
}

/* ----------------------------- KPI Card ----------------------------- */

function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  tone: "slate" | "blue" | "emerald" | "primary" | "rose" | "amber";
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-50 text-slate-600 ring-slate-200",
    blue: "bg-sky-50 text-sky-600 ring-sky-200",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    primary: "bg-primary/10 text-primary ring-primary/20",
    rose: "bg-rose-50 text-rose-600 ring-rose-200",
    amber: "bg-amber-50 text-amber-600 ring-amber-200",
  };
  return (
    <div className="rounded-lg border border-border bg-card p-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ring-1 ${tones[tone]}`}>
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-1.5 text-[22px] font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

/* ----------------------------- Filter select ----------------------------- */

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-md border border-border bg-background pl-3 pr-8 text-[12.5px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        aria-label={label}
      >
        {children}
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

/* ----------------------------- Kanban ----------------------------- */

function KanbanView({
  leads,
  onMove,
  onOpen,
}: {
  leads: Lead[];
  onMove: (id: string, stageId: string) => void;
  onOpen: (l: Lead) => void;
}) {
  const [dragOver, setDragOver] = useState<string | null>(null);

  return (
    <section className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
        {leadStages.map((stage) => {
          const items = leads.filter((l) => l.stageId === stage.id);
          const total = items.reduce((s, l) => s + l.estimatedValue, 0);
          return (
            <div
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(stage.id);
              }}
              onDragLeave={() => setDragOver((s) => (s === stage.id ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                setDragOver(null);
                if (id) onMove(id, stage.id);
              }}
              className={`w-[300px] shrink-0 rounded-lg border bg-muted/30 transition-colors ${
                dragOver === stage.id ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div
                className="flex items-center justify-between rounded-t-lg border-b border-border bg-card px-3 py-2.5"
                style={{ borderTop: `3px solid ${stage.color}` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-foreground">
                    {stage.name}
                  </span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {fmtINR(total)}
                </span>
              </div>
              <div className="space-y-2 p-2">
                {items.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border bg-card/50 p-4 text-center text-[12px] text-muted-foreground">
                    Drop leads here
                  </div>
                ) : (
                  items.map((l) => (
                    <KanbanCard key={l.id} lead={l} stage={stage} onOpen={() => onOpen(l)} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function KanbanCard({
  lead,
  stage,
  onOpen,
}: {
  lead: Lead;
  stage: LeadStage;
  onOpen: () => void;
}) {
  const owner = ownerById(lead.ownerId);
  const score = computeLeadScore({
    sourceId: lead.sourceId,
    industryId: lead.industryId,
    estimatedValue: lead.estimatedValue,
    probability: lead.probability,
  });
  const band = scoreBand(score);

  return (
    <div
      draggable={!lead.locked}
      onDragStart={(e) => e.dataTransfer.setData("text/plain", lead.id)}
      onClick={onOpen}
      className="group cursor-pointer rounded-md border border-border bg-card p-2.5 shadow-sm transition hover:border-primary/40 hover:shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-foreground">
            {lead.name}
          </div>
          <div className="truncate text-[11.5px] text-muted-foreground">
            {lead.company}
          </div>
        </div>
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: stage.color }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11.5px]">
        <span className="font-semibold text-foreground">
          {fmtINR(lead.estimatedValue)}
        </span>
        <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-medium ${scoreBandClass(band)}`}>
          {band} · {score}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
            {owner ? initials(owner.name) : "—"}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            {owner?.name ?? "Unassigned"}
          </span>
        </div>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${priorityClass(lead.priority)}`}>
          {lead.priority}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalIcon size={11} /> {lead.nextFollowUp}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <QuickIcon icon={Phone} title="Call" />
          <QuickIcon icon={Mail} title="Email" />
          <QuickIcon icon={StickyNote} title="Note" />
        </div>
      </div>
    </div>
  );
}

function QuickIcon({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size?: number | string }>;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      title={title}
      className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      <Icon size={12} />
    </button>
  );
}

/* ----------------------------- Table ----------------------------- */

function TableView({
  leads,
  onOpen,
  onConvert,
}: {
  leads: Lead[];
  onOpen: (l: Lead) => void;
  onConvert: (l: Lead) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead className="bg-muted/40 text-[11.5px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <Th>Lead ID</Th>
              <Th>Lead / Company</Th>
              <Th>Contact</Th>
              <Th>Source</Th>
              <Th>Region</Th>
              <Th>Owner</Th>
              <Th>Stage</Th>
              <Th>Score</Th>
              <Th className="text-right">Value</Th>
              <Th>Next F/U</Th>
              <Th>Created</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((l) => {
              const score = computeLeadScore({
                sourceId: l.sourceId,
                industryId: l.industryId,
                estimatedValue: l.estimatedValue,
                probability: l.probability,
              });
              const band = scoreBand(score);
              const stage = stageById(l.stageId);
              return (
                <tr key={l.id} className="hover:bg-muted/30">
                  <Td className="font-mono text-[11.5px] text-muted-foreground">{l.id}</Td>
                  <Td>
                    <div className="font-medium text-foreground">{l.name}</div>
                    <div className="text-[11px] text-muted-foreground">{l.company}</div>
                  </Td>
                  <Td>
                    <div className="text-foreground">{l.contact}</div>
                    <div className="text-[11px] text-muted-foreground">{l.email}</div>
                  </Td>
                  <Td>{sourceName(l.sourceId)}</Td>
                  <Td>{regionName(l.regionId)}</Td>
                  <Td>{ownerName(l.ownerId)}</Td>
                  <Td>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        backgroundColor: `${stage?.color}15`,
                        color: stage?.color,
                      }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stage?.color }} />
                      {stage?.name}
                    </span>
                  </Td>
                  <Td>
                    <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-medium ${scoreBandClass(band)}`}>
                      {band} · {score}
                    </span>
                  </Td>
                  <Td className="text-right font-medium text-foreground">{fmtINR(l.estimatedValue)}</Td>
                  <Td>{l.nextFollowUp}</Td>
                  <Td className="text-muted-foreground">{l.createdAt}</Td>
                  <Td className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <IconBtn title="View" icon={Eye} onClick={() => onOpen(l)} />
                      <IconBtn title="Edit" icon={Pencil} onClick={() => onOpen(l)} />
                      <IconBtn
                        title="Convert"
                        icon={ArrowRightCircle}
                        onClick={() => onConvert(l)}
                        disabled={l.locked || l.stageId === "lost"}
                      />
                    </div>
                  </Td>
                </tr>
              );
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-12 text-center text-muted-foreground">
                  No leads match these filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2.5 text-left font-medium ${className ?? ""}`}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 align-top ${className ?? ""}`}>{children}</td>;
}
function IconBtn({
  icon: Icon,
  title,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<{ size?: number | string }>;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon size={13} />
    </button>
  );
}

/* ----------------------------- Add Lead Drawer ----------------------------- */

function AddLeadDrawer({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (l: Lead) => void;
}) {
  const [form, setForm] = useState<Partial<Lead>>({
    sourceId: leadSources[0]?.id,
    industryId: leadIndustries[0]?.id,
    regionId: leadRegions[0]?.id,
    siteId: leadSites.find((s) => s.regionId === leadRegions[0]?.id)?.id,
    ownerId: leadOwners[0]?.id,
    priority: "Medium",
    probability: 25,
    reminderType: "Notification",
    nextFollowUp: offsetDate(3),
  });

  const filteredSites = leadSites.filter((s) => s.regionId === form.regionId);
  const owner = ownerById(form.ownerId ?? "");

  const set = (k: keyof Lead, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v as never }));

  const previewScore = computeLeadScore({
    sourceId: form.sourceId,
    industryId: form.industryId,
    estimatedValue: form.estimatedValue,
    probability: form.probability,
  });

  const valid =
    form.name &&
    form.company &&
    form.contact &&
    form.email &&
    form.phone &&
    form.estimatedValue;

  const submit = () => {
    if (!valid) return;
    const id = `LD-${Math.floor(1000 + Math.random() * 9000)}`;
    onSave({
      id,
      name: form.name!,
      company: form.company!,
      contact: form.contact!,
      email: form.email!,
      phone: form.phone!,
      sourceId: form.sourceId!,
      campaign: form.campaign,
      industryId: form.industryId!,
      estimatedValue: Number(form.estimatedValue),
      expectedClose: form.expectedClose,
      probability: Number(form.probability) || 0,
      priority: (form.priority as Priority) ?? "Medium",
      regionId: form.regionId!,
      siteId: form.siteId!,
      ownerId: form.ownerId!,
      team: owner?.team,
      territory: owner?.territory,
      stageId: "new",
      nextFollowUp: form.nextFollowUp!,
      reminderType: (form.reminderType as "Notification" | "Email") ?? "Notification",
      remarks: form.remarks,
      createdAt: isoDate(today),
      createdBy: "Admin",
    });
  };

  return (
    <DrawerShell title="Add New Lead" subtitle="Create a new lead in the pipeline" onClose={onClose}>
      <div className="space-y-6">
        <Section title="Basic Info">
          <Field label="Lead Name *">
            <Input value={form.name ?? ""} onChange={(v) => set("name", v)} />
          </Field>
          <Field label="Company Name *">
            <Input value={form.company ?? ""} onChange={(v) => set("company", v)} />
          </Field>
          <Field label="Contact Person *">
            <Input value={form.contact ?? ""} onChange={(v) => set("contact", v)} />
          </Field>
          <Field label="Email *">
            <Input type="email" value={form.email ?? ""} onChange={(v) => set("email", v)} />
          </Field>
          <Field label="Phone Number *">
            <Input value={form.phone ?? ""} onChange={(v) => set("phone", v)} />
          </Field>
        </Section>

        <Section title="Source Details">
          <Field label="Lead Source *">
            <Select value={form.sourceId ?? ""} onChange={(v) => set("sourceId", v)}>
              {leadSources.filter((s) => s.active).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Campaign Name">
            <Input value={form.campaign ?? ""} onChange={(v) => set("campaign", v)} placeholder="e.g. Q2-LinkedIn" />
          </Field>
        </Section>

        <Section title="Business Details">
          <Field label="Industry *">
            <Select value={form.industryId ?? ""} onChange={(v) => set("industryId", v)}>
              {leadIndustries.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Estimated Value (₹) *">
            <Input
              type="number"
              value={form.estimatedValue?.toString() ?? ""}
              onChange={(v) => set("estimatedValue", Number(v))}
            />
          </Field>
          <Field label="Expected Close Date">
            <Input type="date" value={form.expectedClose ?? ""} onChange={(v) => set("expectedClose", v)} />
          </Field>
          <Field label="Probability (%)">
            <Input
              type="number"
              value={form.probability?.toString() ?? ""}
              onChange={(v) => set("probability", Number(v))}
            />
          </Field>
          <Field label="Priority">
            <Select value={form.priority ?? "Medium"} onChange={(v) => set("priority", v)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Select>
          </Field>
        </Section>

        <Section title="Location">
          <Field label="Region *">
            <Select
              value={form.regionId ?? ""}
              onChange={(v) => {
                set("regionId", v);
                const firstSite = leadSites.find((s) => s.regionId === v);
                set("siteId", firstSite?.id ?? "");
              }}
            >
              {leadRegions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Site (filtered by Region)">
            <Select value={form.siteId ?? ""} onChange={(v) => set("siteId", v)}>
              {filteredSites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          </Field>
        </Section>

        <Section title="Assignment">
          <Field label="Assigned Sales Executive *">
            <Select value={form.ownerId ?? ""} onChange={(v) => set("ownerId", v)}>
              {leadOwners.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Team">
            <Input value={owner?.team ?? ""} readOnly />
          </Field>
          <Field label="Territory">
            <Input value={owner?.territory ?? ""} readOnly />
          </Field>
        </Section>

        <Section title="Follow-up">
          <Field label="Next Follow-up Date *">
            <Input type="date" value={form.nextFollowUp ?? ""} onChange={(v) => set("nextFollowUp", v)} />
          </Field>
          <Field label="Reminder Type">
            <Select value={form.reminderType ?? "Notification"} onChange={(v) => set("reminderType", v)}>
              <option>Notification</option>
              <option>Email</option>
            </Select>
          </Field>
        </Section>

        <Section title="Notes">
          <Field label="Remarks" full>
            <textarea
              value={form.remarks ?? ""}
              onChange={(e) => set("remarks", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </Field>
        </Section>

        <Section title="System (auto)">
          <Field label="Lead ID">
            <Input value="Auto-generated on save" readOnly />
          </Field>
          <Field label="Status">
            <Input value="New" readOnly />
          </Field>
          <Field label="Lead Score (preview)">
            <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-muted/30 px-3 text-[13px]">
              <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-medium ${scoreBandClass(scoreBand(previewScore))}`}>
                {scoreBand(previewScore)}
              </span>
              <span className="text-muted-foreground">{previewScore} pts</span>
            </div>
          </Field>
        </Section>
      </div>

      <DrawerFooter onClose={onClose}>
        <button
          onClick={submit}
          disabled={!valid}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-50"
        >
          Save Lead
        </button>
      </DrawerFooter>
    </DrawerShell>
  );
}

/* ----------------------------- Detail Drawer ----------------------------- */

function LeadDetailDrawer({
  lead,
  onClose,
  onConvert,
  onMove,
}: {
  lead: Lead;
  onClose: () => void;
  onConvert: () => void;
  onMove: (id: string, stageId: string) => void;
}) {
  const stage = stageById(lead.stageId);
  const owner = ownerById(lead.ownerId);
  const score = computeLeadScore({
    sourceId: lead.sourceId,
    industryId: lead.industryId,
    estimatedValue: lead.estimatedValue,
    probability: lead.probability,
  });
  const band = scoreBand(score);

  return (
    <DrawerShell
      title={lead.name}
      subtitle={`${lead.company} • ${lead.id}`}
      onClose={onClose}
      width="wide"
    >
      <div className="space-y-5">
        {/* Summary */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
            <SummaryItem label="Stage">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{
                  backgroundColor: `${stage?.color}15`,
                  color: stage?.color,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stage?.color }} />
                {stage?.name}
              </span>
            </SummaryItem>
            <SummaryItem label="Estimated Value">
              <span className="font-semibold text-foreground">{fmtINR(lead.estimatedValue)}</span>
            </SummaryItem>
            <SummaryItem label="Score">
              <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-medium ${scoreBandClass(band)}`}>
                {band} · {score}
              </span>
            </SummaryItem>
            <SummaryItem label="Owner">
              <span className="text-foreground">{owner?.name}</span>
            </SummaryItem>
            <SummaryItem label="Source">{sourceName(lead.sourceId)}</SummaryItem>
            <SummaryItem label="Industry">{industryName(lead.industryId)}</SummaryItem>
            <SummaryItem label="Region / Site">
              {regionName(lead.regionId)} · {siteName(lead.siteId)}
            </SummaryItem>
            <SummaryItem label="Next Follow-up">{lead.nextFollowUp}</SummaryItem>
          </div>
          {lead.lostReasonId && (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
              Lost reason: <strong>{lostReasonName(lead.lostReasonId)}</strong>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          <ActionPill icon={Phone} label="Call" />
          <ActionPill icon={Mail} label="Email" />
          <ActionPill icon={StickyNote} label="Add Note" />
          <ActionPill icon={CalIcon} label="Schedule Follow-up" />
          <div className="ml-auto flex items-center gap-2">
            <select
              value={lead.stageId}
              onChange={(e) => onMove(lead.id, e.target.value)}
              disabled={lead.locked}
              className="h-9 rounded-md border border-border bg-background px-2.5 text-[12.5px] disabled:opacity-50"
            >
              {leadStages.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={onConvert}
              disabled={lead.locked || lead.stageId === "lost"}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-50"
            >
              <ArrowRightCircle size={14} /> Convert to Client
            </button>
          </div>
        </div>

        {/* Contact */}
        <Section title="Contact">
          <Field label="Contact Person"><Input value={lead.contact} readOnly /></Field>
          <Field label="Email"><Input value={lead.email} readOnly /></Field>
          <Field label="Phone"><Input value={lead.phone} readOnly /></Field>
        </Section>

        {/* Activity Timeline */}
        <Section title="Activity Timeline">
          <div className="col-span-2 space-y-3">
            <Activity time="2 hours ago" who={owner?.name ?? "—"} text={`Stage updated to ${stage?.name}`} />
            <Activity time="Yesterday" who={owner?.name ?? "—"} text="Sent introduction email" />
            <Activity time="3 days ago" who="System" text={`Lead created from ${sourceName(lead.sourceId)}`} />
          </div>
        </Section>
      </div>

      <DrawerFooter onClose={onClose} />
    </DrawerShell>
  );
}

function SummaryItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-[13px]">{children}</div>
    </div>
  );
}

function ActionPill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number | string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[12.5px] font-medium text-foreground hover:bg-accent"
    >
      <Icon size={13} /> {label}
    </button>
  );
}

function Activity({ time, who, text }: { time: string; who: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
      <div className="flex-1">
        <div className="text-[13px] text-foreground">{text}</div>
        <div className="text-[11px] text-muted-foreground">
          {who} • {time}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Convert / Lost modals ----------------------------- */

function ConvertModal({
  lead,
  onClose,
  onConfirm,
}: {
  lead: Lead;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const clientId = `CL-${lead.id.replace("LD-", "")}`;
  return (
    <ModalShell title="Convert Lead to Client" onClose={onClose}>
      <p className="text-[13px] text-muted-foreground">
        This will create a new client in <strong className="text-foreground">Client Onboarding</strong>{" "}
        with all lead data, generate a Client ID, lock the lead as read-only, and trigger the onboarding workflow.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-border bg-muted/30 p-3 text-[12.5px]">
        <div><div className="text-muted-foreground">Lead</div><div className="font-medium text-foreground">{lead.name}</div></div>
        <div><div className="text-muted-foreground">Company</div><div className="font-medium text-foreground">{lead.company}</div></div>
        <div><div className="text-muted-foreground">New Client ID</div><div className="font-mono font-medium text-primary">{clientId}</div></div>
        <div><div className="text-muted-foreground">Contract Value</div><div className="font-medium text-foreground">{fmtINR(lead.estimatedValue)}</div></div>
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        <button onClick={onClose} className="h-9 rounded-md border border-border bg-card px-3 text-[13px] font-medium hover:bg-accent">
          Cancel
        </button>
        <Link
          to="/finance/client-onboarding"
          onClick={onConfirm}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95"
        >
          <ArrowRightCircle size={14} /> Confirm & Open Onboarding
        </Link>
      </div>
    </ModalShell>
  );
}

function LostReasonModal({
  lead,
  onClose,
  onConfirm,
}: {
  lead: Lead;
  onClose: () => void;
  onConfirm: (reasonId: string) => void;
}) {
  const [reason, setReason] = useState(leadLostReasons[0]?.id ?? "");
  return (
    <ModalShell title="Mark Lead as Lost" onClose={onClose}>
      <p className="text-[13px] text-muted-foreground">
        Select a reason for losing <strong className="text-foreground">{lead.name}</strong>. This is mandatory and will be logged in audit trail.
      </p>
      <div className="mt-4 space-y-2">
        {leadLostReasons.filter((r) => r.active).map((r) => (
          <label key={r.id} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card p-2.5 text-[13px] hover:bg-accent">
            <input
              type="radio"
              name="lost-reason"
              checked={reason === r.id}
              onChange={() => setReason(r.id)}
              className="accent-primary"
            />
            {r.name}
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        <button onClick={onClose} className="h-9 rounded-md border border-border bg-card px-3 text-[13px] font-medium hover:bg-accent">
          Cancel
        </button>
        <button
          onClick={() => onConfirm(reason)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-rose-600 px-3 text-[13px] font-semibold text-white hover:bg-rose-700"
        >
          Mark as Lost
        </button>
      </div>
    </ModalShell>
  );
}

/* ----------------------------- Analytics ----------------------------- */

function Analytics({ leads }: { leads: Lead[] }) {
  const total = leads.length || 1;
  const stageCounts = leadStages.map((s) => ({
    stage: s,
    count: leads.filter((l) => l.stageId === s.id).length,
  }));

  const sourceStats = leadSources.map((s) => {
    const items = leads.filter((l) => l.sourceId === s.id);
    const won = items.filter((l) => l.stageId === "won").length;
    return {
      source: s.name,
      count: items.length,
      conv: items.length ? Math.round((won / items.length) * 100) : 0,
    };
  });

  const repStats = leadOwners.map((o) => {
    const items = leads.filter((l) => l.ownerId === o.id);
    const won = items.filter((l) => l.stageId === "won").length;
    const value = items.reduce((s, l) => s + l.estimatedValue, 0);
    return { rep: o.name, count: items.length, won, value };
  });

  return (
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Card title="Conversion Funnel">
        <div className="space-y-2">
          {stageCounts.map(({ stage, count }) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={stage.id}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-foreground">{stage.name}</span>
                  <span className="text-muted-foreground">{count} · {pct}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: stage.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Source Performance">
        <div className="space-y-2.5">
          {sourceStats.map((s) => (
            <div key={s.source} className="flex items-center justify-between text-[12.5px]">
              <span className="text-foreground">{s.source}</span>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>{s.count} leads</span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
                  {s.conv}% conv
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Sales Rep Performance">
        <div className="space-y-2.5">
          {repStats.map((r) => (
            <div key={r.rep} className="flex items-center justify-between text-[12.5px]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
                  {initials(r.rep)}
                </span>
                <span className="text-foreground">{r.rep}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>{r.count} leads</span>
                <span className="font-medium text-foreground">{fmtINR(r.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
        <Filter size={13} className="text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

/* ----------------------------- Drawer / Modal shells ----------------------------- */

function DrawerShell({
  title,
  subtitle,
  onClose,
  children,
  width,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: "default" | "wide";
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`flex h-full w-full max-w-[${width === "wide" ? "720" : "560"}px] flex-col bg-background shadow-xl ${width === "wide" ? "md:w-[720px]" : "md:w-[560px]"}`}>
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

function DrawerFooter({ onClose, children }: { onClose: () => void; children?: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 -mx-5 mt-6 flex items-center justify-end gap-2 border-t border-border bg-background px-5 py-3">
      <button onClick={onClose} className="h-9 rounded-md border border-border bg-card px-3 text-[13px] font-medium hover:bg-accent">
        Close
      </button>
      {children}
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[520px] rounded-lg border border-border bg-background p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-[12px] font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type,
  placeholder,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <input
      type={type ?? "text"}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 read-only:bg-muted/50 read-only:text-muted-foreground"
    />
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
    >
      {children}
    </select>
  );
}
