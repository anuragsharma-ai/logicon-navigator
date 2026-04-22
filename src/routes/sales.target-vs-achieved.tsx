import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  ChevronRight,
  Download,
  FileSpreadsheet,
  Target as TargetIcon,
  TrendingUp,
  Percent,
  TrendingDown,
  Search,
  ArrowUpDown,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from "recharts";

export const Route = createFileRoute("/sales/target-vs-achieved")({
  head: () => ({
    meta: [
      { title: "Target vs Achieved — Sales | Logicon ERP" },
      {
        name: "description",
        content:
          "Compare assigned targets vs actual performance across teams, regions and time in Logicon ERP.",
      },
      { property: "og:title", content: "Target vs Achieved — Logicon ERP" },
      {
        property: "og:description",
        content: "Performance analytics for Sales and Management teams.",
      },
    ],
  }),
  component: TargetVsAchievedPage,
});

const monthly = [
  { month: "Jan", target: 120, achieved: 98 },
  { month: "Feb", target: 130, achieved: 142 },
  { month: "Mar", target: 140, achieved: 128 },
  { month: "Apr", target: 150, achieved: 156 },
  { month: "May", target: 160, achieved: 134 },
  { month: "Jun", target: 170, achieved: 178 },
  { month: "Jul", target: 175, achieved: 162 },
  { month: "Aug", target: 180, achieved: 191 },
  { month: "Sep", target: 185, achieved: 174 },
  { month: "Oct", target: 190, achieved: 203 },
  { month: "Nov", target: 200, achieved: 188 },
  { month: "Dec", target: 210, achieved: 215 },
];

const teamRows = [
  { team: "Enterprise Sales", target: 850, achieved: 902, status: "achieved" as const },
  { team: "SMB Sales", target: 620, achieved: 548, status: "near" as const },
  { team: "Mid-Market", target: 540, achieved: 612, status: "achieved" as const },
  { team: "Inside Sales", target: 380, achieved: 271, status: "below" as const },
  { team: "Channel Partners", target: 460, achieved: 438, status: "near" as const },
  { team: "Marketing Qualified", target: 320, achieved: 289, status: "near" as const },
];

const detailRows = [
  { name: "Aarav Sharma", dept: "Sales", region: "North", site: "Delhi HQ", target: 120, achieved: 138, updated: "2h ago" },
  { name: "Priya Menon", dept: "Sales", region: "South", site: "Bengaluru", target: 110, achieved: 96, updated: "5h ago" },
  { name: "Rahul Verma", dept: "Sales", region: "West", site: "Mumbai", target: 140, achieved: 121, updated: "1d ago" },
  { name: "Neha Kapoor", dept: "Marketing", region: "North", site: "Delhi HQ", target: 90, achieved: 102, updated: "3h ago" },
  { name: "Vikram Singh", dept: "Sales", region: "East", site: "Kolkata", target: 100, achieved: 64, updated: "6h ago" },
  { name: "Ananya Iyer", dept: "Sales", region: "South", site: "Chennai", target: 130, achieved: 145, updated: "1h ago" },
  { name: "Karan Patel", dept: "Marketing", region: "West", site: "Pune", target: 80, achieved: 71, updated: "2d ago" },
  { name: "Sara Khan", dept: "Sales", region: "North", site: "Gurugram", target: 115, achieved: 128, updated: "4h ago" },
];

function pct(achieved: number, target: number) {
  if (!target) return 0;
  return Math.round((achieved / target) * 100);
}

function StatusPill({ status }: { status: "achieved" | "near" | "below" }) {
  const map = {
    achieved: { label: "Achieved", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    near: { label: "Near target", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    below: { label: "Below target", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  } as const;
  const m = map[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${m.cls}`}>
      {m.label}
    </span>
  );
}

function TargetVsAchievedPage() {
  const [query, setQuery] = useState("");
  const [drill, setDrill] = useState<typeof detailRows[number] | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const totalTarget = useMemo(() => detailRows.reduce((s, r) => s + r.target, 0), []);
  const totalAchieved = useMemo(() => detailRows.reduce((s, r) => s + r.achieved, 0), []);
  const achievement = pct(totalAchieved, totalTarget);
  const delta = totalAchieved - totalTarget;

  const filtered = detailRows.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.dept.toLowerCase().includes(query.toLowerCase()) ||
      r.region.toLowerCase().includes(query.toLowerCase()) ||
      r.site.toLowerCase().includes(query.toLowerCase()),
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
          <span className="text-foreground font-medium">Target vs Achieved</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Target vs Achieved
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Monitor performance against assigned targets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[13px] text-foreground hover:bg-accent">
              <FileSpreadsheet size={14} /> Export
            </button>
            <button
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-primary-foreground"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Download size={14} /> Download Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="Date Range" options={["This Month", "This Quarter", "This Year"]} />
            <FilterSelect label="Department" options={["All", "Sales", "Marketing"]} />
            <FilterSelect label="Region" options={["All", "North", "South", "East", "West"]} />
            <FilterSelect label="Site" options={["All", "Delhi HQ", "Mumbai", "Bengaluru", "Pune"]} />
            <FilterSelect label="Team / User" options={["All Teams", "Enterprise", "SMB", "Inside Sales"]} />
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={TargetIcon}
            label="Total Target"
            value={`${totalTarget.toLocaleString()}`}
            sub="Assigned this period"
          />
          <KpiCard
            icon={TrendingUp}
            label="Total Achieved"
            value={`${totalAchieved.toLocaleString()}`}
            sub="Actual performance"
          />
          <KpiCard
            icon={Percent}
            label="Achievement %"
            value={`${achievement}%`}
            sub="Achieved / Target"
            highlight
          />
          <KpiCard
            icon={delta >= 0 ? TrendingUp : TrendingDown}
            label={delta >= 0 ? "Surplus" : "Shortfall"}
            value={`${delta >= 0 ? "+" : ""}${delta.toLocaleString()}`}
            sub={delta >= 0 ? "Above target" : "Below target"}
            tone={delta >= 0 ? "positive" : "negative"}
          />
        </div>

        {/* Chart */}
        <div className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Performance Trend</h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Monthly target vs achieved</p>
            </div>
            <div className="inline-flex rounded-md border border-border p-0.5">
              <button
                onClick={() => setChartType("bar")}
                className={`h-7 px-3 text-[12px] rounded ${chartType === "bar" ? "bg-accent text-foreground font-medium" : "text-muted-foreground"}`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`h-7 px-3 text-[12px] rounded ${chartType === "line" ? "bg-accent text-foreground font-medium" : "text-muted-foreground"}`}
              >
                Line
              </button>
            </div>
          </div>
          <div className="mt-4 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={monthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="target" fill="#CBD5E1" name="Target" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="achieved" fill="#FF8A3D" name="Achieved" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={monthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} name="Target" dot={false} />
                  <Line type="monotone" dataKey="achieved" stroke="#FF8A3D" strokeWidth={2.5} name="Achieved" dot={{ r: 3 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team breakdown */}
        <div className="mt-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Team Breakdown</h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Target vs achieved by team</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-y border-border bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 text-left font-medium">Team</th>
                  <th className="px-5 py-2.5 text-right font-medium">Target</th>
                  <th className="px-5 py-2.5 text-right font-medium">Achieved</th>
                  <th className="px-5 py-2.5 text-right font-medium">Achievement %</th>
                  <th className="px-5 py-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {teamRows.map((r) => {
                  const p = pct(r.achieved, r.target);
                  return (
                    <tr key={r.team} className="border-b border-border last:border-0 hover:bg-accent/40">
                      <td className="px-5 py-3 font-medium text-foreground">{r.team}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{r.target}</td>
                      <td className="px-5 py-3 text-right text-foreground">{r.achieved}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="font-semibold" style={{ color: "var(--primary)" }}>{p}%</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <StatusPill status={r.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed table */}
        <div className="mt-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">User Performance</h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Click a row for drill-down</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search user, region, site…"
                className="h-9 w-[260px] rounded-md border border-border bg-background pl-8 pr-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-y border-border bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 text-left font-medium">
                    <div className="inline-flex items-center gap-1">User <ArrowUpDown size={11} /></div>
                  </th>
                  <th className="px-5 py-2.5 text-left font-medium">Department</th>
                  <th className="px-5 py-2.5 text-left font-medium">Region</th>
                  <th className="px-5 py-2.5 text-left font-medium">Site</th>
                  <th className="px-5 py-2.5 text-right font-medium">Target</th>
                  <th className="px-5 py-2.5 text-right font-medium">Achieved</th>
                  <th className="px-5 py-2.5 text-right font-medium">%</th>
                  <th className="px-5 py-2.5 text-right font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">No data available</td>
                  </tr>
                )}
                {filtered.map((r) => {
                  const p = pct(r.achieved, r.target);
                  return (
                    <tr
                      key={r.name}
                      onClick={() => setDrill(r)}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-accent/40"
                    >
                      <td className="px-5 py-3 font-medium text-foreground">{r.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{r.dept}</td>
                      <td className="px-5 py-3 text-muted-foreground">{r.region}</td>
                      <td className="px-5 py-3 text-muted-foreground">{r.site}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{r.target}</td>
                      <td className="px-5 py-3 text-right text-foreground">{r.achieved}</td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`font-semibold ${p >= 100 ? "text-emerald-600" : p >= 85 ? "text-amber-600" : "text-rose-600"}`}
                        >
                          {p}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{r.updated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[12px] text-muted-foreground">
            <span>Showing {filtered.length} of {detailRows.length}</span>
            <div className="flex items-center gap-1">
              <button className="h-7 rounded border border-border px-2 hover:bg-accent">Prev</button>
              <button className="h-7 rounded border border-border px-2 hover:bg-accent">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Drill-down drawer */}
      {drill && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={() => setDrill(null)}
            aria-hidden
          />
          <div className="h-full w-full max-w-[480px] overflow-y-auto bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">{drill.name}</h3>
                <p className="text-[12px] text-muted-foreground">{drill.dept} · {drill.region} · {drill.site}</p>
              </div>
              <button onClick={() => setDrill(null)} className="rounded-md p-1.5 hover:bg-accent">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <Mini label="Target" value={drill.target} />
                <Mini label="Achieved" value={drill.achieved} />
                <Mini label="Achievement" value={`${pct(drill.achieved, drill.target)}%`} highlight />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-foreground mb-2">Monthly breakdown</h4>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                      <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                      <Bar dataKey="target" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="achieved" fill="#FF8A3D" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-foreground mb-2">Linked activities</h4>
                <ul className="space-y-2 text-[13px]">
                  <li className="flex justify-between rounded-md border border-border p-2.5">
                    <span className="text-muted-foreground">Leads converted</span>
                    <span className="font-medium text-foreground">24</span>
                  </li>
                  <li className="flex justify-between rounded-md border border-border p-2.5">
                    <span className="text-muted-foreground">Deals closed</span>
                    <span className="font-medium text-foreground">12</span>
                  </li>
                  <li className="flex justify-between rounded-md border border-border p-2.5">
                    <span className="text-muted-foreground">Revenue billed</span>
                    <span className="font-medium text-foreground">₹ 18.4L</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
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
  tone?: "positive" | "negative";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ backgroundColor: "var(--primary-tint)" }}
        >
          <Icon size={16} className="text-primary" />
        </div>
      </div>
      <div
        className={`mt-3 text-[24px] font-semibold tracking-tight ${
          highlight ? "" : tone === "negative" ? "text-rose-600" : tone === "positive" ? "text-emerald-600" : "text-foreground"
        }`}
        style={highlight ? { color: "var(--primary)" } : undefined}
      >
        {value}
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function Mini({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className="mt-1 text-[16px] font-semibold"
        style={highlight ? { color: "var(--primary)" } : { color: "hsl(var(--foreground))" }}
      >
        {value}
      </div>
    </div>
  );
}
