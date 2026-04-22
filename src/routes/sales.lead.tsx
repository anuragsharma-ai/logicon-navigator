import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Plus,
  Download,
  Upload,
  Search,
  ChevronRight,
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
  Building2,
  MoreHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/sales/lead")({
  head: () => ({
    meta: [
      { title: "Leads Management — Sales | Logicon ERP" },
      {
        name: "description",
        content:
          "Capture, qualify and convert sales leads with a CRM-style pipeline integrated with onboarding and billing.",
      },
      { property: "og:title", content: "Leads Management — Logicon ERP" },
      {
        property: "og:description",
        content:
          "Track lead lifecycle, assign sales executives, and convert leads into clients.",
      },
    ],
  }),
  component: LeadPage,
});

/* ----------------------------- Types & Data ----------------------------- */

type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Won"
  | "Lost";

type Priority = "Low" | "Medium" | "High";

type Lead = {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  source: "Website" | "Referral" | "Ads" | "Cold Call" | "Other";
  region: string;
  site: string;
  assignedTo: string;
  status: LeadStatus;
  value: number;
  priority: Priority;
  industry: string;
  createdAt: string;
};

const SEED: Lead[] = [
  {
    id: "LD-1042",
    name: "Acme HQ Facility Deal",
    company: "Acme Corp",
    contact: "Priya Shah",
    email: "priya@acme.com",
    phone: "+91 98765 43210",
    source: "Website",
    region: "West",
    site: "Mumbai",
    assignedTo: "Rohit Mehta",
    status: "New",
    value: 480000,
    priority: "High",
    industry: "Manufacturing",
    createdAt: "2026-04-18",
  },
  {
    id: "LD-1041",
    name: "Northwind Soft Services",
    company: "Northwind Logistics",
    contact: "Kabir Singh",
    email: "kabir@northwind.io",
    phone: "+91 99887 12345",
    source: "Referral",
    region: "North",
    site: "Delhi",
    assignedTo: "Anita Rao",
    status: "Contacted",
    value: 220000,
    priority: "Medium",
    industry: "Logistics",
    createdAt: "2026-04-15",
  },
  {
    id: "LD-1040",
    name: "Helios Tower Maintenance",
    company: "Helios Realty",
    contact: "Meera Iyer",
    email: "meera@helios.co",
    phone: "+91 90000 22221",
    source: "Ads",
    region: "South",
    site: "Bengaluru",
    assignedTo: "Vikram Joshi",
    status: "Qualified",
    value: 760000,
    priority: "High",
    industry: "Real Estate",
    createdAt: "2026-04-12",
  },
  {
    id: "LD-1039",
    name: "Bluepeak Annual Contract",
    company: "Bluepeak Pharma",
    contact: "Arjun Nair",
    email: "arjun@bluepeak.com",
    phone: "+91 90011 55667",
    source: "Cold Call",
    region: "West",
    site: "Pune",
    assignedTo: "Rohit Mehta",
    status: "Proposal Sent",
    value: 1250000,
    priority: "High",
    industry: "Pharma",
    createdAt: "2026-04-09",
  },
  {
    id: "LD-1038",
    name: "Skyline Mall Housekeeping",
    company: "Skyline Group",
    contact: "Neha Kapoor",
    email: "neha@skyline.in",
    phone: "+91 98999 11122",
    source: "Referral",
    region: "North",
    site: "Gurugram",
    assignedTo: "Anita Rao",
    status: "Won",
    value: 980000,
    priority: "High",
    industry: "Retail",
    createdAt: "2026-04-05",
  },
  {
    id: "LD-1037",
    name: "Coastal Resorts Pilot",
    company: "Coastal Hospitality",
    contact: "Rahul Verma",
    email: "rahul@coastal.com",
    phone: "+91 90909 80808",
    source: "Website",
    region: "South",
    site: "Goa",
    assignedTo: "Vikram Joshi",
    status: "Lost",
    value: 340000,
    priority: "Low",
    industry: "Hospitality",
    createdAt: "2026-04-02",
  },
  {
    id: "LD-1036",
    name: "Orbit Tech Park Facility",
    company: "Orbit Developers",
    contact: "Sana Khan",
    email: "sana@orbit.dev",
    phone: "+91 91234 56780",
    source: "Ads",
    region: "South",
    site: "Hyderabad",
    assignedTo: "Vikram Joshi",
    status: "Contacted",
    value: 540000,
    priority: "Medium",
    industry: "Technology",
    createdAt: "2026-04-19",
  },
  {
    id: "LD-1035",
    name: "Greenfield Campus Care",
    company: "Greenfield Edu",
    contact: "Devansh Gupta",
    email: "devansh@greenfield.edu",
    phone: "+91 90011 22233",
    source: "Other",
    region: "East",
    site: "Kolkata",
    assignedTo: "Anita Rao",
    status: "New",
    value: 175000,
    priority: "Low",
    industry: "Education",
    createdAt: "2026-04-20",
  },
];

const STAGES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

const REGIONS = ["North", "South", "East", "West"];
const SITES_BY_REGION: Record<string, string[]> = {
  North: ["Delhi", "Gurugram", "Noida"],
  South: ["Bengaluru", "Hyderabad", "Goa"],
  East: ["Kolkata", "Bhubaneswar"],
  West: ["Mumbai", "Pune", "Ahmedabad"],
};
const SOURCES: Lead["source"][] = [
  "Website",
  "Referral",
  "Ads",
  "Cold Call",
  "Other",
];
const ASSIGNEES = ["Rohit Mehta", "Anita Rao", "Vikram Joshi", "Sara D'Souza"];

/* ------------------------------ Utilities ------------------------------ */

function statusTone(status: LeadStatus) {
  switch (status) {
    case "New":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "Contacted":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "Qualified":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "Proposal Sent":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "Won":
      return "bg-emerald-100 text-emerald-800 ring-emerald-300";
    case "Lost":
      return "bg-rose-50 text-rose-700 ring-rose-200";
  }
}

function priorityTone(p: Priority) {
  switch (p) {
    case "High":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "Medium":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "Low":
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* -------------------------------- Page -------------------------------- */

function LeadPage() {
  const [leads, setLeads] = useState<Lead[]>(SEED);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<Lead["source"] | "all">(
    "all",
  );
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detail, setDetail] = useState<Lead | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (regionFilter !== "all" && l.region !== regionFilter) return false;
      if (assigneeFilter !== "all" && l.assignedTo !== assigneeFilter)
        return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.contact.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, statusFilter, sourceFilter, regionFilter, assigneeFilter, query]);

  const kpis = useMemo(() => {
    return {
      total: leads.length,
      neu: leads.filter((l) => l.status === "New").length,
      qualified: leads.filter((l) => l.status === "Qualified").length,
      converted: leads.filter((l) => l.status === "Won").length,
      lost: leads.filter((l) => l.status === "Lost").length,
      pipelineValue: leads
        .filter((l) => l.status !== "Lost" && l.status !== "Won")
        .reduce((s, l) => s + l.value, 0),
    };
  }, [leads]);

  function moveLead(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  function addLead(l: Lead) {
    setLeads((prev) => [l, ...prev]);
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1500px] px-6 py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight size={12} />
          <span>Sales</span>
          <ChevronRight size={12} />
          <span className="font-medium text-foreground">Leads</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Leads Management
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Track and convert sales opportunities across the pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground shadow-sm transition hover:bg-muted">
              <Upload size={14} /> Import
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground shadow-sm transition hover:bg-muted">
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF8A3D] px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#ff7a23]"
            >
              <Plus size={14} /> Add New Lead
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <KpiCard
            label="Total Leads"
            value={kpis.total}
            icon={<Sparkles size={16} />}
            tone="slate"
          />
          <KpiCard
            label="New"
            value={kpis.neu}
            icon={<TrendingUp size={16} />}
            tone="blue"
          />
          <KpiCard
            label="Qualified"
            value={kpis.qualified}
            icon={<UserCheck size={16} />}
            tone="emerald"
          />
          <KpiCard
            label="Converted"
            value={kpis.converted}
            icon={<Trophy size={16} />}
            tone="violet"
          />
          <KpiCard
            label="Lost"
            value={kpis.lost}
            icon={<XCircle size={16} />}
            tone="rose"
          />
          <KpiCard
            label="Pipeline Value"
            value={inr(kpis.pipelineValue)}
            icon={<TrendingUp size={16} />}
            tone="orange"
          />
        </div>

        {/* Toolbar */}
        <div className="mt-6 rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lead, company, contact or ID…"
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-[13px] outline-none transition focus:border-[#FF8A3D] focus:ring-2 focus:ring-[#FF8A3D]/20"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as LeadStatus | "all")}
              options={[
                { v: "all", l: "All Status" },
                ...STAGES.map((s) => ({ v: s, l: s })),
              ]}
            />
            <Select
              value={sourceFilter}
              onChange={(v) => setSourceFilter(v as Lead["source"] | "all")}
              options={[
                { v: "all", l: "All Sources" },
                ...SOURCES.map((s) => ({ v: s, l: s })),
              ]}
            />
            <Select
              value={regionFilter}
              onChange={setRegionFilter}
              options={[
                { v: "all", l: "All Regions" },
                ...REGIONS.map((r) => ({ v: r, l: r })),
              ]}
            />
            <Select
              value={assigneeFilter}
              onChange={setAssigneeFilter}
              options={[
                { v: "all", l: "All Assignees" },
                ...ASSIGNEES.map((a) => ({ v: a, l: a })),
              ]}
            />

            <div className="ml-auto inline-flex rounded-lg border border-border bg-background p-0.5">
              <button
                onClick={() => setView("kanban")}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition ${
                  view === "kanban"
                    ? "bg-[#FF8A3D] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid size={13} /> Kanban
              </button>
              <button
                onClick={() => setView("table")}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition ${
                  view === "table"
                    ? "bg-[#FF8A3D] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon size={13} /> Table
              </button>
            </div>
          </div>
        </div>

        {/* Views */}
        {view === "kanban" ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {STAGES.map((stage) => {
              const items = filtered.filter((l) => l.status === stage);
              const sum = items.reduce((s, l) => s + l.value, 0);
              return (
                <div
                  key={stage}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragId) {
                      moveLead(dragId, stage);
                      setDragId(null);
                    }
                  }}
                  className="flex min-h-[260px] flex-col rounded-xl border border-border bg-[#F8F9FB] p-2.5"
                >
                  <div className="mb-2 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium ring-1 ring-inset ${statusTone(stage)}`}
                      >
                        {stage}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {items.length}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {inr(sum)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {items.map((l) => (
                      <div
                        key={l.id}
                        draggable
                        onDragStart={() => setDragId(l.id)}
                        onClick={() => setDetail(l)}
                        className="group cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition hover:border-[#FF8A3D]/50 hover:shadow active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-semibold text-foreground">
                              {l.name}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-muted-foreground">
                              <Building2 size={11} />{" "}
                              <span className="truncate">{l.company}</span>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${priorityTone(l.priority)}`}
                          >
                            {l.priority}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-foreground">
                            {inr(l.value)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FF8A3D]/10 text-[10px] font-semibold text-[#FF8A3D]">
                              {initials(l.assignedTo)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border p-4 text-center text-[11.5px] text-muted-foreground">
                        Drop leads here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-muted/50 text-[12px] text-muted-foreground">
                  <tr>
                    <Th>Lead ID</Th>
                    <Th>Lead / Company</Th>
                    <Th>Contact</Th>
                    <Th>Source</Th>
                    <Th>Region</Th>
                    <Th>Assigned To</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Value</Th>
                    <Th>Created</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr
                      key={l.id}
                      className="border-t border-border hover:bg-muted/30"
                    >
                      <Td className="font-medium text-foreground">{l.id}</Td>
                      <Td>
                        <div className="font-medium text-foreground">
                          {l.name}
                        </div>
                        <div className="text-[11.5px] text-muted-foreground">
                          {l.company}
                        </div>
                      </Td>
                      <Td>
                        <div>{l.contact}</div>
                        <div className="text-[11.5px] text-muted-foreground">
                          {l.email}
                        </div>
                      </Td>
                      <Td>{l.source}</Td>
                      <Td>
                        {l.region} · {l.site}
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FF8A3D]/10 text-[10px] font-semibold text-[#FF8A3D]">
                            {initials(l.assignedTo)}
                          </span>
                          <span>{l.assignedTo}</span>
                        </div>
                      </Td>
                      <Td>
                        <span
                          className={`inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium ring-1 ring-inset ${statusTone(l.status)}`}
                        >
                          {l.status}
                        </span>
                      </Td>
                      <Td className="text-right font-medium text-foreground">
                        {inr(l.value)}
                      </Td>
                      <Td className="text-muted-foreground">{l.createdAt}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <IconBtn
                            title="View"
                            onClick={() => setDetail(l)}
                          >
                            <Eye size={14} />
                          </IconBtn>
                          <IconBtn title="Edit">
                            <Pencil size={14} />
                          </IconBtn>
                          <IconBtn
                            title="Convert to Client"
                            onClick={() => moveLead(l.id, "Won")}
                          >
                            <ArrowRightCircle
                              size={14}
                              className="text-[#FF8A3D]"
                            />
                          </IconBtn>
                        </div>
                      </Td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-12 text-center text-[13px] text-muted-foreground"
                      >
                        No leads match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics */}
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <AnalyticsCard title="Conversion Funnel">
            <div className="space-y-2">
              {STAGES.filter((s) => s !== "Lost").map((s) => {
                const count = leads.filter((l) => l.status === s).length;
                const pct = leads.length
                  ? Math.round((count / leads.length) * 100)
                  : 0;
                return (
                  <div key={s}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">{s}</span>
                      <span className="font-medium text-foreground">
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[#FF8A3D]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </AnalyticsCard>

          <AnalyticsCard title="Source Performance">
            <div className="space-y-2">
              {SOURCES.map((s) => {
                const count = leads.filter((l) => l.source === s).length;
                const pct = leads.length
                  ? Math.round((count / leads.length) * 100)
                  : 0;
                return (
                  <div key={s}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">{s}</span>
                      <span className="font-medium text-foreground">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </AnalyticsCard>

          <AnalyticsCard title="Sales Rep Performance">
            <div className="space-y-2">
              {ASSIGNEES.map((a) => {
                const reps = leads.filter((l) => l.assignedTo === a);
                const won = reps.filter((l) => l.status === "Won").length;
                const value = reps.reduce((s, l) => s + l.value, 0);
                return (
                  <div
                    key={a}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FF8A3D]/10 text-[11px] font-semibold text-[#FF8A3D]">
                        {initials(a)}
                      </span>
                      <div>
                        <div className="text-[12.5px] font-medium text-foreground">
                          {a}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {reps.length} leads · {won} won
                        </div>
                      </div>
                    </div>
                    <div className="text-[12.5px] font-semibold text-foreground">
                      {inr(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {drawerOpen && (
        <AddLeadDrawer
          onClose={() => setDrawerOpen(false)}
          onSave={(l) => {
            addLead(l);
            setDrawerOpen(false);
          }}
        />
      )}
      {detail && (
        <LeadDetailDrawer
          lead={detail}
          onClose={() => setDetail(null)}
          onConvert={() => {
            moveLead(detail.id, "Won");
            setDetail(null);
          }}
        />
      )}
    </AppLayout>
  );
}

/* ---------------------------- Small components ---------------------------- */

function KpiCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone: "slate" | "blue" | "emerald" | "violet" | "rose" | "orange";
}) {
  const toneMap: Record<string, string> = {
    slate: "bg-slate-50 text-slate-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
    orange: "bg-[#FF8A3D]/10 text-[#FF8A3D]",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className={`grid h-7 w-7 place-items-center rounded-lg ${toneMap[tone]}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2 text-[18px] font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-border bg-background px-2.5 text-[12.5px] text-foreground outline-none transition focus:border-[#FF8A3D] focus:ring-2 focus:ring-[#FF8A3D]/20"
    >
      {options.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-2.5 text-left font-medium ${className}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-muted-foreground transition hover:border-[#FF8A3D]/50 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function AnalyticsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
        <MoreHorizontal size={14} className="text-muted-foreground" />
      </div>
      {children}
    </div>
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
  const [form, setForm] = useState({
    name: "",
    company: "",
    contact: "",
    email: "",
    phone: "",
    source: "Website" as Lead["source"],
    campaign: "",
    industry: "",
    value: "",
    priority: "Medium" as Priority,
    region: "West",
    site: "Mumbai",
    assignedTo: ASSIGNEES[0],
    remarks: "",
  });

  function up<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    if (!form.name || !form.company) return;
    const lead: Lead = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name,
      company: form.company,
      contact: form.contact,
      email: form.email,
      phone: form.phone,
      source: form.source,
      region: form.region,
      site: form.site,
      assignedTo: form.assignedTo,
      status: "New",
      value: Number(form.value) || 0,
      priority: form.priority,
      industry: form.industry,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    onSave(lead);
  }

  return (
    <DrawerShell title="Add New Lead" onClose={onClose}>
      <Section title="Basic Info">
        <Grid>
          <Field label="Lead Name *">
            <Input value={form.name} onChange={(v) => up("name", v)} />
          </Field>
          <Field label="Company Name *">
            <Input value={form.company} onChange={(v) => up("company", v)} />
          </Field>
          <Field label="Contact Person">
            <Input value={form.contact} onChange={(v) => up("contact", v)} />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(v) => up("email", v)}
            />
          </Field>
          <Field label="Phone Number">
            <Input value={form.phone} onChange={(v) => up("phone", v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="Source Details">
        <Grid>
          <Field label="Lead Source">
            <NativeSelect
              value={form.source}
              onChange={(v) => up("source", v as Lead["source"])}
              options={SOURCES.map((s) => ({ v: s, l: s }))}
            />
          </Field>
          <Field label="Campaign Name">
            <Input value={form.campaign} onChange={(v) => up("campaign", v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="Business Details">
        <Grid>
          <Field label="Industry">
            <Input value={form.industry} onChange={(v) => up("industry", v)} />
          </Field>
          <Field label="Estimated Value (INR)">
            <Input
              type="number"
              value={form.value}
              onChange={(v) => up("value", v)}
            />
          </Field>
          <Field label="Priority">
            <NativeSelect
              value={form.priority}
              onChange={(v) => up("priority", v as Priority)}
              options={[
                { v: "Low", l: "Low" },
                { v: "Medium", l: "Medium" },
                { v: "High", l: "High" },
              ]}
            />
          </Field>
        </Grid>
      </Section>

      <Section title="Location">
        <Grid>
          <Field label="Region">
            <NativeSelect
              value={form.region}
              onChange={(v) => {
                up("region", v);
                up("site", SITES_BY_REGION[v][0]);
              }}
              options={REGIONS.map((r) => ({ v: r, l: r }))}
            />
          </Field>
          <Field label="Site">
            <NativeSelect
              value={form.site}
              onChange={(v) => up("site", v)}
              options={SITES_BY_REGION[form.region].map((s) => ({
                v: s,
                l: s,
              }))}
            />
          </Field>
        </Grid>
      </Section>

      <Section title="Assignment">
        <Grid>
          <Field label="Assigned Sales Executive">
            <NativeSelect
              value={form.assignedTo}
              onChange={(v) => up("assignedTo", v)}
              options={ASSIGNEES.map((a) => ({ v: a, l: a }))}
            />
          </Field>
          <Field label="Department">
            <Input value="Sales" onChange={() => {}} />
          </Field>
        </Grid>
      </Section>

      <Section title="Notes">
        <Field label="Remarks">
          <textarea
            value={form.remarks}
            onChange={(e) => up("remarks", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] outline-none transition focus:border-[#FF8A3D] focus:ring-2 focus:ring-[#FF8A3D]/20"
          />
        </Field>
      </Section>

      <DrawerFooter>
        <button
          onClick={onClose}
          className="rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          className="rounded-lg bg-[#FF8A3D] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#ff7a23]"
        >
          Save Lead
        </button>
      </DrawerFooter>
    </DrawerShell>
  );
}

/* --------------------------- Detail Drawer --------------------------- */

function LeadDetailDrawer({
  lead,
  onClose,
  onConvert,
}: {
  lead: Lead;
  onClose: () => void;
  onConvert: () => void;
}) {
  return (
    <DrawerShell title={lead.name} onClose={onClose}>
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-[#F8F9FB] p-3">
        <div>
          <div className="text-[11.5px] uppercase tracking-wide text-muted-foreground">
            {lead.id} · {lead.company}
          </div>
          <div className="mt-0.5 text-[15px] font-semibold text-foreground">
            {inr(lead.value)}
          </div>
        </div>
        <span
          className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11.5px] font-medium ring-1 ring-inset ${statusTone(lead.status)}`}
        >
          {lead.status}
        </span>
      </div>

      <Section title="Contact">
        <div className="space-y-2 text-[13px]">
          <Row label="Contact Person" value={lead.contact} />
          <Row
            label="Email"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} /> {lead.email}
              </span>
            }
          />
          <Row
            label="Phone"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Phone size={12} /> {lead.phone}
              </span>
            }
          />
        </div>
      </Section>

      <Section title="Business">
        <div className="space-y-2 text-[13px]">
          <Row label="Industry" value={lead.industry} />
          <Row label="Source" value={lead.source} />
          <Row label="Priority" value={lead.priority} />
          <Row label="Region / Site" value={`${lead.region} · ${lead.site}`} />
          <Row label="Assigned To" value={lead.assignedTo} />
          <Row label="Created" value={lead.createdAt} />
        </div>
      </Section>

      <Section title="Activity Timeline">
        <ol className="relative ml-2 space-y-3 border-l border-border pl-4 text-[12.5px]">
          <li>
            <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full bg-[#FF8A3D]" />
            <div className="font-medium text-foreground">Lead created</div>
            <div className="text-muted-foreground">
              {lead.createdAt} · via {lead.source}
            </div>
          </li>
          <li>
            <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
            <div className="font-medium text-foreground">
              Assigned to {lead.assignedTo}
            </div>
            <div className="text-muted-foreground">Auto-assigned by region</div>
          </li>
          <li>
            <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div className="font-medium text-foreground">
              Status: {lead.status}
            </div>
            <div className="text-muted-foreground">Latest update</div>
          </li>
        </ol>
      </Section>

      <DrawerFooter>
        <button
          onClick={onClose}
          className="rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground hover:bg-muted"
        >
          Close
        </button>
        <button
          onClick={onConvert}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF8A3D] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#ff7a23]"
        >
          <ArrowRightCircle size={14} /> Convert to Client
        </button>
      </DrawerFooter>
    </DrawerShell>
  );
}

/* --------------------------- Drawer primitives --------------------------- */

function DrawerShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-[560px] flex-col border-l border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </div>
  );
}

function DrawerFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 -mx-5 mt-6 flex justify-end gap-2 border-t border-border bg-card px-5 py-3">
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none transition focus:border-[#FF8A3D] focus:ring-2 focus:ring-[#FF8A3D]/20"
    />
  );
}

function NativeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-[13px] text-foreground outline-none transition focus:border-[#FF8A3D] focus:ring-2 focus:ring-[#FF8A3D]/20"
    >
      {options.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
