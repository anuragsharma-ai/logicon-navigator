import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  ChevronRight,
  Plus,
  Download,
  Search,
  X,
  Users,
  IndianRupee,
  Percent,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/sales/client-loss")({
  head: () => ({
    meta: [
      { title: "Client Loss — Sales | Logicon ERP" },
      {
        name: "description",
        content: "Track lost clients, churn reasons, and revenue impact in Logicon ERP.",
      },
      { property: "og:title", content: "Client Loss — Logicon ERP" },
      {
        property: "og:description",
        content: "Track and analyze lost clients to take corrective action.",
      },
    ],
  }),
  component: ClientLossPage,
});

const trend = [
  { month: "Jan", clients: 4, revenue: 120 },
  { month: "Feb", clients: 6, revenue: 180 },
  { month: "Mar", clients: 3, revenue: 90 },
  { month: "Apr", clients: 8, revenue: 240 },
  { month: "May", clients: 5, revenue: 160 },
  { month: "Jun", clients: 7, revenue: 220 },
  { month: "Jul", clients: 9, revenue: 290 },
  { month: "Aug", clients: 6, revenue: 200 },
  { month: "Sep", clients: 4, revenue: 130 },
  { month: "Oct", clients: 5, revenue: 170 },
  { month: "Nov", clients: 3, revenue: 95 },
  { month: "Dec", clients: 6, revenue: 210 },
];

const reasons = [
  { name: "Pricing", value: 32, color: "#FF8A3D" },
  { name: "Service Quality", value: 24, color: "#F87171" },
  { name: "Competitor", value: 21, color: "#FBBF24" },
  { name: "Contract End", value: 15, color: "#94A3B8" },
  { name: "Other", value: 8, color: "#CBD5E1" },
];

const lossRows = [
  {
    id: "CL-1042",
    name: "Acme Logistics",
    dept: "Enterprise",
    region: "North",
    site: "Delhi HQ",
    manager: "Aarav Sharma",
    revenue: 4_80_000,
    date: "12 Apr 2026",
    reason: "Pricing",
    remarks: "Renegotiation failed",
    status: "Closed",
  },
  {
    id: "CL-1041",
    name: "Bluepeak Industries",
    dept: "Mid-Market",
    region: "West",
    site: "Mumbai",
    manager: "Rahul Verma",
    revenue: 2_10_000,
    date: "08 Apr 2026",
    reason: "Competitor",
    remarks: "Switched to Nimbus ERP",
    status: "Follow-up",
  },
  {
    id: "CL-1040",
    name: "Crescent Foods",
    dept: "SMB",
    region: "South",
    site: "Bengaluru",
    manager: "Priya Menon",
    revenue: 1_30_000,
    date: "02 Apr 2026",
    reason: "Service Quality",
    remarks: "SLA breaches Q1",
    status: "Follow-up",
  },
  {
    id: "CL-1039",
    name: "Delta Retail",
    dept: "Enterprise",
    region: "East",
    site: "Kolkata",
    manager: "Vikram Singh",
    revenue: 6_20_000,
    date: "28 Mar 2026",
    reason: "Contract End",
    remarks: "Did not renew",
    status: "Closed",
  },
  {
    id: "CL-1038",
    name: "Evergreen Agro",
    dept: "SMB",
    region: "North",
    site: "Gurugram",
    manager: "Sara Khan",
    revenue: 95_000,
    date: "21 Mar 2026",
    reason: "Pricing",
    remarks: "Budget cut",
    status: "Closed",
  },
  {
    id: "CL-1037",
    name: "Falcon Tech",
    dept: "Mid-Market",
    region: "South",
    site: "Chennai",
    manager: "Ananya Iyer",
    revenue: 3_45_000,
    date: "14 Mar 2026",
    reason: "Competitor",
    remarks: "Lower price offered",
    status: "Follow-up",
  },
];

function ClientLossPage() {
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [detail, setDetail] = useState<typeof lossRows[number] | null>(null);

  const totalClients = lossRows.length;
  const totalRevenue = useMemo(() => lossRows.reduce((s, r) => s + r.revenue, 0), []);
  const lossRate = 4.7;
  const topReason = reasons[0].name;

  const filtered = lossRows.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.id.toLowerCase().includes(query.toLowerCase()) ||
      r.manager.toLowerCase().includes(query.toLowerCase()) ||
      r.reason.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight size={12} />
          <span>Sales</span>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">Client Loss</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Client Loss
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Track and analyze lost clients
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[13px] text-foreground hover:bg-accent">
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => setOpenForm(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-primary-foreground"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Plus size={14} /> Add Loss Entry
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="Date Range" options={["Last 30 days", "This Quarter", "This Year"]} />
            <FilterSelect label="Department" options={["All", "Enterprise", "Mid-Market", "SMB"]} />
            <FilterSelect label="Region" options={["All", "North", "South", "East", "West"]} />
            <FilterSelect label="Site" options={["All", "Delhi HQ", "Mumbai", "Bengaluru", "Pune"]} />
            <FilterSelect label="Loss Reason" options={["All", "Pricing", "Service Quality", "Competitor", "Contract End"]} />
            <FilterSelect label="Account Manager" options={["All", "Aarav Sharma", "Priya Menon", "Rahul Verma"]} />
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={Users} label="Total Clients Lost" value={`${totalClients}`} sub="In current period" tone="negative" />
          <KpiCard icon={IndianRupee} label="Revenue Lost" value={`₹ ${(totalRevenue / 100000).toFixed(1)}L`} sub="Annualised value" tone="negative" />
          <KpiCard icon={Percent} label="Loss Rate" value={`${lossRate}%`} sub="Of active clients" highlight />
          <KpiCard icon={AlertTriangle} label="Top Loss Reason" value={topReason} sub="Most cited reason" />
        </div>

        {/* Charts */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-foreground">Loss Trend</h2>
                <p className="mt-0.5 text-[12px] text-muted-foreground">Clients lost per month</p>
              </div>
            </div>
            <div className="mt-4 h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="clients" stroke="#F87171" strokeWidth={2.5} name="Clients lost" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#FF8A3D" strokeWidth={2} name="Revenue (₹K)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-[15px] font-semibold text-foreground">Loss Reason</h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Distribution of churn reasons</p>
            <div className="mt-2 h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reasons}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {reasons.map((r) => (
                      <Cell key={r.name} fill={r.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Loss table */}
        <div className="mt-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Lost Clients</h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Click a row for full details</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search client, manager, reason…"
                className="h-9 w-[280px] rounded-md border border-border bg-background pl-8 pr-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-y border-border bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 text-left font-medium">Client</th>
                  <th className="px-5 py-2.5 text-left font-medium">ID</th>
                  <th className="px-5 py-2.5 text-left font-medium">Department</th>
                  <th className="px-5 py-2.5 text-left font-medium">Region</th>
                  <th className="px-5 py-2.5 text-left font-medium">Manager</th>
                  <th className="px-5 py-2.5 text-right font-medium">Revenue</th>
                  <th className="px-5 py-2.5 text-left font-medium">Loss Date</th>
                  <th className="px-5 py-2.5 text-left font-medium">Reason</th>
                  <th className="px-5 py-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">No data available</td>
                  </tr>
                )}
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setDetail(r)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-accent/40"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.id}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.dept}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.region}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.manager}</td>
                    <td className="px-5 py-3 text-right text-foreground">₹ {(r.revenue / 1000).toFixed(0)}K</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-5 py-3">
                      <ReasonPill reason={r.reason} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[12px] text-muted-foreground">
            <span>Showing {filtered.length} of {lossRows.length}</span>
            <div className="flex items-center gap-1">
              <button className="h-7 rounded border border-border px-2 hover:bg-accent">Prev</button>
              <button className="h-7 rounded border border-border px-2 hover:bg-accent">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Loss Drawer */}
      {openForm && <AddLossDrawer onClose={() => setOpenForm(false)} />}

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setDetail(null)} aria-hidden />
          <div className="h-full w-full max-w-[480px] overflow-y-auto bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">{detail.name}</h3>
                <p className="text-[12px] text-muted-foreground">{detail.id} · {detail.dept}</p>
              </div>
              <button onClick={() => setDetail(null)} className="rounded-md p-1.5 hover:bg-accent">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5 text-[13px]">
              <Field label="Account Manager" value={detail.manager} />
              <Field label="Region / Site" value={`${detail.region} · ${detail.site}`} />
              <Field label="Revenue Lost" value={`₹ ${(detail.revenue / 1000).toFixed(0)}K`} />
              <Field label="Loss Date" value={detail.date} />
              <Field label="Loss Reason" value={detail.reason} />
              <Field label="Remarks" value={detail.remarks} />
              <Field label="Status" value={detail.status} />
              <div>
                <h4 className="text-[13px] font-semibold text-foreground mb-2">Previous transactions</h4>
                <ul className="space-y-2">
                  {[
                    { d: "Jan 2026", v: "₹ 1.2L" },
                    { d: "Oct 2025", v: "₹ 1.4L" },
                    { d: "Jul 2025", v: "₹ 1.1L" },
                  ].map((t) => (
                    <li key={t.d} className="flex justify-between rounded-md border border-border p-2.5">
                      <span className="text-muted-foreground">{t.d}</span>
                      <span className="font-medium text-foreground">{t.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function ReasonPill({ reason }: { reason: string }) {
  const map: Record<string, string> = {
    Pricing: "bg-orange-50 text-orange-700 border-orange-200",
    Competitor: "bg-amber-50 text-amber-700 border-amber-200",
    "Service Quality": "bg-rose-50 text-rose-700 border-rose-200",
    "Contract End": "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[reason] ?? "bg-muted text-muted-foreground border-border"}`}>
      {reason}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const closed = status === "Closed";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${closed ? "bg-slate-50 text-slate-700 border-slate-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
      {status}
    </span>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <select className="h-9 rounded-md border border-border bg-background px-2.5 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
  tone,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
  tone?: "negative";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ backgroundColor: tone === "negative" ? "rgb(254 226 226)" : "var(--primary-tint)" }}
        >
          <Icon size={16} className={tone === "negative" ? "text-rose-600" : "text-primary"} />
        </div>
      </div>
      <div
        className="mt-3 text-[24px] font-semibold tracking-tight text-foreground"
        style={highlight ? { color: "var(--primary)" } : undefined}
      >
        {value}
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[13px] font-medium text-foreground">{value}</div>
    </div>
  );
}

function AddLossDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} aria-hidden />
      <div className="h-full w-full max-w-[520px] overflow-y-auto bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Add Loss Entry</h3>
            <p className="text-[12px] text-muted-foreground">Record a lost client and root cause</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-accent">
            <X size={16} />
          </button>
        </div>
        <form className="p-6 space-y-6">
          <Section title="Client Info">
            <Input label="Client Name" placeholder="e.g. Acme Logistics" />
            <Input label="Client ID" placeholder="CL-XXXX" />
            <Input label="Account Manager" placeholder="Select manager" />
          </Section>
          <Section title="Details">
            <Input label="Department" placeholder="Enterprise / SMB / Mid-Market" />
            <Input label="Region" placeholder="North / South / East / West" />
            <Input label="Site" placeholder="Office location" />
          </Section>
          <Section title="Loss Info">
            <Input label="Loss Date" type="date" />
            <Input label="Revenue Value" placeholder="₹" type="number" />
            <SelectField label="Loss Reason" options={["Pricing", "Service Quality", "Competitor", "Contract End", "Other"]} />
            <Input label="Competitor Name (optional)" placeholder="If applicable" />
            <div>
              <label className="text-[12px] font-medium text-foreground">Remarks</label>
              <textarea
                rows={3}
                placeholder="Notes about the loss…"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </Section>
          <Section title="Follow-up">
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <div className="text-[13px] font-medium text-foreground">Follow-up Required</div>
                <div className="text-[12px] text-muted-foreground">Schedule a check-in</div>
              </div>
              <input type="checkbox" className="h-4 w-4 accent-orange-500" />
            </div>
            <SelectField label="Status" options={["Closed", "Follow-up"]} />
          </Section>
          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={onClose} className="h-9 rounded-md border border-border bg-card px-3 text-[13px] hover:bg-accent">
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-md px-3 text-[13px] font-medium text-primary-foreground"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-[12px] font-medium text-foreground">{label}</label>
      <input
        {...rest}
        className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-foreground">{label}</label>
      <select className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2.5 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
