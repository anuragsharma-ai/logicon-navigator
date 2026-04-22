import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Plus,
  Download,
  Wallet,
  TrendingUp,
  PieChart,
  Percent,
  X,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/finance/budget")({
  head: () => ({
    meta: [
      { title: "Budget — Finance | Logicon ERP" },
      {
        name: "description",
        content:
          "Plan, allocate and monitor budgets across departments and regions in Logicon Finance.",
      },
      { property: "og:title", content: "Budget — Logicon ERP" },
      { property: "og:description", content: "Compare allocations vs spending and control utilization." },
    ],
  }),
  component: BudgetPage,
});

interface BudgetRow {
  department: string;
  region: string;
  allocated: number;
  used: number;
}

const ROWS: BudgetRow[] = [
  { department: "Sales", region: "North", allocated: 2500000, used: 1820000 },
  { department: "Sales", region: "South", allocated: 2000000, used: 1900000 },
  { department: "Marketing", region: "All", allocated: 1500000, used: 870000 },
  { department: "Operations", region: "West", allocated: 3200000, used: 2950000 },
  { department: "Engineering", region: "All", allocated: 4200000, used: 3100000 },
  { department: "HR", region: "All", allocated: 800000, used: 320000 },
];

function BudgetPage() {
  const [year, setYear] = useState("2026");
  const [dept, setDept] = useState("All");
  const [region, setRegion] = useState("All");
  const [drawer, setDrawer] = useState(false);

  const rows = useMemo(
    () =>
      ROWS.filter(
        (r) =>
          (dept === "All" || r.department === dept) &&
          (region === "All" || r.region === region),
      ),
    [dept, region],
  );

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  const totals = useMemo(() => {
    const allocated = ROWS.reduce((s, r) => s + r.allocated, 0);
    const used = ROWS.reduce((s, r) => s + r.used, 0);
    return {
      allocated,
      used,
      remaining: allocated - used,
      utilization: Math.round((used / allocated) * 100),
    };
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Budget</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Plan and monitor budgets across departments and regions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent">
              <Download size={15} /> Export
            </button>
            <button
              onClick={() => setDrawer(true)}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-95"
            >
              <Plus size={15} /> Create Budget
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={Wallet} label="Total Budget" value={fmt(totals.allocated)} tone="primary" />
          <Kpi icon={TrendingUp} label="Used Budget" value={fmt(totals.used)} tone="info" />
          <Kpi icon={PieChart} label="Remaining" value={fmt(totals.remaining)} tone="success" />
          <Kpi icon={Percent} label="Utilization" value={totals.utilization + "%"} tone="warning" />
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Select label="Year" value={year} onChange={setYear} options={["2024", "2025", "2026"]} />
            <Select label="Department" value={dept} onChange={setDept} options={["All", "Sales", "Marketing", "Operations", "Engineering", "HR"]} />
            <Select label="Region" value={region} onChange={setRegion} options={["All", "North", "South", "East", "West"]} />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <Th>Department</Th>
                  <Th>Region</Th>
                  <Th className="text-right">Allocated</Th>
                  <Th className="text-right">Used</Th>
                  <Th className="text-right">Remaining</Th>
                  <Th>Utilization</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 && (
                  <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No budgets found.</td></tr>
                )}
                {rows.map((r) => {
                  const remaining = r.allocated - r.used;
                  const pct = Math.round((r.used / r.allocated) * 100);
                  const tone = pct >= 95 ? "danger" : pct >= 80 ? "warning" : "success";
                  const barColor =
                    tone === "danger"
                      ? "bg-rose-500"
                      : tone === "warning"
                      ? "bg-amber-500"
                      : "bg-emerald-500";
                  const label = tone === "danger" ? "Over limit" : tone === "warning" ? "Near limit" : "On track";
                  const pillColor =
                    tone === "danger"
                      ? "bg-rose-100 text-rose-700"
                      : tone === "warning"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700";
                  return (
                    <tr key={r.department + r.region} className="hover:bg-accent/40">
                      <Td className="font-medium text-foreground">{r.department}</Td>
                      <Td className="text-muted-foreground">{r.region}</Td>
                      <Td className="text-right">{fmt(r.allocated)}</Td>
                      <Td className="text-right">{fmt(r.used)}</Td>
                      <Td className="text-right">{fmt(remaining)}</Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                            <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                        </div>
                      </Td>
                      <Td><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${pillColor}`}>{label}</span></Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {drawer && <CreateBudgetDrawer onClose={() => setDrawer(false)} />}
    </AppLayout>
  );
}

function CreateBudgetDrawer({ onClose }: { onClose: () => void }) {
  const [allocations, setAllocations] = useState<{ category: string; amount: string }[]>([
    { category: "Travel", amount: "" },
    { category: "Software", amount: "" },
  ]);
  return (
    <div className="fixed inset-0 z-50 flex">
      <button aria-label="Close" onClick={onClose} className="flex-1 bg-black/40 backdrop-blur-sm" />
      <div className="flex h-full w-full max-w-[640px] flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Create Budget</h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Basic</h3>
            <FormGrid>
              <Field label="Budget Name"><Input placeholder="e.g. FY26 Sales — North" /></Field>
              <Field label="Year"><SelectInput options={["2024", "2025", "2026", "2027"]} /></Field>
              <Field label="Department"><SelectInput options={["Sales", "Marketing", "Operations", "Engineering", "HR"]} /></Field>
              <Field label="Region"><SelectInput options={["North", "South", "East", "West", "All"]} /></Field>
            </FormGrid>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Allocation</h3>
              <button
                onClick={() => setAllocations((a) => [...a, { category: "", amount: "" }])}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground hover:bg-accent"
              >
                <Plus size={13} /> Add Row
              </button>
            </div>
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Category</th>
                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allocations.map((a, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">
                        <Input
                          value={a.category}
                          onChange={(e) =>
                            setAllocations((arr) => arr.map((x, idx) => idx === i ? { ...x, category: e.target.value } : x))
                          }
                          placeholder="Category"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={a.amount}
                          onChange={(e) =>
                            setAllocations((arr) => arr.map((x, idx) => idx === i ? { ...x, amount: e.target.value } : x))
                          }
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => setAllocations((arr) => arr.filter((_, idx) => idx !== i))}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50"
                          title="Remove"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rules</h3>
            <FormGrid>
              <Field label="Monthly Limit"><Input type="number" placeholder="0.00" /></Field>
              <Field label="Approval Required">
                <SelectInput options={["No", "Yes — over limit only", "Yes — always"]} />
              </Field>
            </FormGrid>
          </section>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3">
          <button onClick={onClose} className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent">Cancel</button>
          <button onClick={onClose} className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-95">Create Budget</button>
        </div>
      </div>
    </div>
  );
}

/* shared */
function Kpi({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: React.ReactNode; tone: "primary" | "info" | "success" | "warning" }) {
  const t: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    info: "bg-sky-100 text-sky-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
  };
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-md ${t[tone]}`}><Icon size={18} /></div>
      </div>
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="hidden md:inline">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 rounded-md border border-border bg-background px-2 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle text-foreground ${className}`}>{children}</td>;
}
function FormGrid({ children }: { children: React.ReactNode }) { return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-xs font-medium text-foreground">{label}</label>{children}</div>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" />;
}
function SelectInput({ options }: { options: string[] }) {
  return (
    <select className="h-9 w-full rounded-md border border-border bg-background px-2 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
      <option value="">Select…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
