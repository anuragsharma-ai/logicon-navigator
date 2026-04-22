import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Plus,
  Download,
  Search,
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  Ban,
  X,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/finance/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses — Finance | Logicon ERP" },
      {
        name: "description",
        content:
          "Monitor, approve and control all company expenses from a single admin view.",
      },
      { property: "og:title", content: "Expenses — Logicon ERP" },
      { property: "og:description", content: "Track approvals and spending across departments." },
    ],
  }),
  component: ExpensesPage,
});

type EStatus = "Pending" | "Approved" | "Rejected";
interface Expense {
  id: string;
  title: string;
  category: string;
  department: string;
  amount: number;
  submittedBy: string;
  date: string;
  status: EStatus;
}

const EXPENSES: Expense[] = [
  { id: "EXP-2401", title: "Client dinner — Q2 review", category: "Meals", department: "Sales", amount: 8400, submittedBy: "Priya Sharma", date: "2026-04-15", status: "Pending" },
  { id: "EXP-2402", title: "AWS — March infra", category: "Software", department: "Engineering", amount: 142500, submittedBy: "Karan Bose", date: "2026-04-02", status: "Approved" },
  { id: "EXP-2403", title: "Travel — Mumbai site visit", category: "Travel", department: "Operations", amount: 18900, submittedBy: "Anita Iyer", date: "2026-04-10", status: "Pending" },
  { id: "EXP-2404", title: "Stationery & printer toner", category: "Office", department: "Admin", amount: 4200, submittedBy: "Rahul Nair", date: "2026-04-12", status: "Approved" },
  { id: "EXP-2405", title: "Marketing campaign (LinkedIn)", category: "Marketing", department: "Marketing", amount: 64000, submittedBy: "Sneha Kapoor", date: "2026-04-08", status: "Rejected" },
  { id: "EXP-2406", title: "Team offsite — venue advance", category: "Events", department: "HR", amount: 95000, submittedBy: "Rohit Verma", date: "2026-04-14", status: "Pending" },
];

function ExpensesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [dept, setDept] = useState("All");
  const [status, setStatus] = useState("All");
  const [drawer, setDrawer] = useState(false);

  const rows = useMemo(
    () =>
      EXPENSES.filter((e) => {
        const matchQ =
          !q ||
          e.title.toLowerCase().includes(q.toLowerCase()) ||
          e.id.toLowerCase().includes(q.toLowerCase()) ||
          e.submittedBy.toLowerCase().includes(q.toLowerCase());
        return (
          matchQ &&
          (cat === "All" || e.category === cat) &&
          (dept === "All" || e.department === dept) &&
          (status === "All" || e.status === status)
        );
      }),
    [q, cat, dept, status],
  );

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  const kpis = useMemo(() => {
    const total = EXPENSES.reduce((s, e) => s + e.amount, 0);
    const pending = EXPENSES.filter((e) => e.status === "Pending").length;
    const approved = EXPENSES.filter((e) => e.status === "Approved").length;
    const rejected = EXPENSES.filter((e) => e.status === "Rejected").length;
    return { total, pending, approved, rejected };
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Expenses</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor expenses, control approvals and track spending
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
              <Plus size={15} /> Add Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={Receipt} label="Total Expenses" value={fmt(kpis.total)} tone="primary" />
          <Kpi icon={Clock} label="Pending Approval" value={kpis.pending} tone="warning" />
          <Kpi icon={CheckCircle2} label="Approved" value={kpis.approved} tone="success" />
          <Kpi icon={XCircle} label="Rejected" value={kpis.rejected} tone="danger" />
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search expense, ID or submitter…"
                className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <Select label="Category" value={cat} onChange={setCat} options={["All", "Meals", "Software", "Travel", "Office", "Marketing", "Events"]} />
            <Select label="Department" value={dept} onChange={setDept} options={["All", "Sales", "Engineering", "Operations", "Admin", "Marketing", "HR"]} />
            <Select label="Status" value={status} onChange={setStatus} options={["All", "Pending", "Approved", "Rejected"]} />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <Th>Expense ID</Th>
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th>Department</Th>
                  <Th className="text-right">Amount</Th>
                  <Th>Submitted By</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center text-sm text-muted-foreground">No expenses found.</td></tr>
                )}
                {rows.map((e) => (
                  <tr key={e.id} className="hover:bg-accent/40">
                    <Td className="text-muted-foreground">{e.id}</Td>
                    <Td className="font-medium text-foreground">{e.title}</Td>
                    <Td>{e.category}</Td>
                    <Td>{e.department}</Td>
                    <Td className="text-right font-medium">{fmt(e.amount)}</Td>
                    <Td>{e.submittedBy}</Td>
                    <Td className="text-muted-foreground">{e.date}</Td>
                    <Td><EStatusPill s={e.status} /></Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title="View"><Eye size={15} /></IconBtn>
                        {e.status === "Pending" && (
                          <>
                            <IconBtn title="Approve" tone="success"><Check size={15} /></IconBtn>
                            <IconBtn title="Reject" tone="danger"><Ban size={15} /></IconBtn>
                          </>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {drawer && (
        <Drawer title="Add Expense" onClose={() => setDrawer(false)} onSubmit={() => setDrawer(false)}>
          <FormGrid>
            <Field label="Title"><Input placeholder="e.g. Client dinner" /></Field>
            <Field label="Category"><SelectInput options={["Meals", "Software", "Travel", "Office", "Marketing", "Events"]} /></Field>
            <Field label="Amount"><Input type="number" placeholder="0.00" /></Field>
            <Field label="Date"><Input type="date" /></Field>
            <Field label="Department"><SelectInput options={["Sales", "Engineering", "Operations", "Admin", "Marketing", "HR"]} /></Field>
            <Field label="Region"><SelectInput options={["North", "South", "East", "West"]} /></Field>
            <Field label="Site"><SelectInput options={["Delhi HQ", "Mumbai", "Bengaluru", "Kolkata"]} /></Field>
            <Field label="Approver"><SelectInput options={["Priya Sharma", "Rohit Verma", "Anita Iyer"]} /></Field>
          </FormGrid>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-foreground">Attachments</label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center hover:bg-muted/50">
              <Upload size={20} className="text-muted-foreground" />
              <div className="text-sm font-medium text-foreground">Upload receipts</div>
              <div className="text-xs text-muted-foreground">PDF, JPG, PNG up to 5MB</div>
              <input type="file" multiple className="hidden" />
            </label>
          </div>
        </Drawer>
      )}
    </AppLayout>
  );
}

/* ---- shared ---- */
function Kpi({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: React.ReactNode; tone: "primary" | "warning" | "success" | "danger" }) {
  const t: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-100 text-amber-600",
    success: "bg-emerald-100 text-emerald-600",
    danger: "bg-rose-100 text-rose-600",
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
function EStatusPill({ s }: { s: EStatus }) {
  const m: Record<EStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${m[s]}`}>{s}</span>;
}
function IconBtn({ children, title, tone = "default" }: { children: React.ReactNode; title: string; tone?: "default" | "success" | "danger" }) {
  const c = tone === "success" ? "text-emerald-600 hover:bg-emerald-50" : tone === "danger" ? "text-rose-600 hover:bg-rose-50" : "text-muted-foreground hover:bg-accent hover:text-foreground";
  return <button title={title} className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${c}`}>{children}</button>;
}
function Drawer({ title, children, onClose, onSubmit }: { title: string; children: React.ReactNode; onClose: () => void; onSubmit: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <button onClick={onClose} aria-label="Close" className="flex-1 bg-black/40 backdrop-blur-sm" />
      <div className="flex h-full w-full max-w-[560px] flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3">
          <button onClick={onClose} className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent">Cancel</button>
          <button onClick={onSubmit} className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-95">Submit</button>
        </div>
      </div>
    </div>
  );
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
