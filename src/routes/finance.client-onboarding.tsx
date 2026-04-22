import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Plus,
  Download,
  Search,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Upload,
  Eye,
  Pencil,
  Check,
  Ban,
} from "lucide-react";

export const Route = createFileRoute("/finance/client-onboarding")({
  head: () => ({
    meta: [
      { title: "Client Onboarding — Finance | Logicon ERP" },
      {
        name: "description",
        content:
          "Manage and monitor all client onboarding activities across regions and business units.",
      },
      { property: "og:title", content: "Client Onboarding — Logicon ERP" },
      {
        property: "og:description",
        content:
          "Track onboarding lifecycle, approvals, and account assignments.",
      },
    ],
  }),
  component: ClientOnboardingPage,
});

type Status = "Draft" | "In Progress" | "Approved" | "Completed";
type Approval = "Pending" | "Approved" | "Rejected";

interface ClientRow {
  id: string;
  name: string;
  company: string;
  bu: string;
  region: string;
  site: string;
  manager: string;
  status: Status;
  startDate: string;
  approval: Approval;
}

const CLIENTS: ClientRow[] = [
  { id: "CL-1042", name: "Aarav Mehta", company: "Northwind Logistics", bu: "Logistics", region: "North", site: "Delhi HQ", manager: "Priya Sharma", status: "In Progress", startDate: "2026-04-02", approval: "Pending" },
  { id: "CL-1043", name: "Sara Khan", company: "Helix Pharma", bu: "Healthcare", region: "West", site: "Mumbai", manager: "Rohit Verma", status: "Approved", startDate: "2026-03-21", approval: "Approved" },
  { id: "CL-1044", name: "John Carter", company: "BlueWave Retail", bu: "Retail", region: "South", site: "Bengaluru", manager: "Anita Iyer", status: "Completed", startDate: "2026-02-11", approval: "Approved" },
  { id: "CL-1045", name: "Meera Joshi", company: "Quanta Tech", bu: "Technology", region: "East", site: "Kolkata", manager: "Karan Bose", status: "Draft", startDate: "2026-04-18", approval: "Pending" },
  { id: "CL-1046", name: "Liam O'Neill", company: "Greenfield Foods", bu: "FMCG", region: "North", site: "Noida", manager: "Priya Sharma", status: "In Progress", startDate: "2026-04-09", approval: "Pending" },
  { id: "CL-1047", name: "Yuki Tanaka", company: "Orbit Manufacturing", bu: "Manufacturing", region: "West", site: "Pune", manager: "Rohit Verma", status: "Approved", startDate: "2026-03-30", approval: "Approved" },
];

function ClientOnboardingPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [region, setRegion] = useState<string>("All");
  const [bu, setBu] = useState<string>("All");
  const [manager, setManager] = useState<string>("All");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const rows = useMemo(() => {
    return CLIENTS.filter((c) => {
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.company.toLowerCase().includes(q.toLowerCase()) ||
        c.id.toLowerCase().includes(q.toLowerCase());
      return (
        matchQ &&
        (status === "All" || c.status === status) &&
        (region === "All" || c.region === region) &&
        (bu === "All" || c.bu === bu) &&
        (manager === "All" || c.manager === manager)
      );
    });
  }, [q, status, region, bu, manager]);

  const kpis = useMemo(
    () => ({
      total: CLIENTS.length,
      active: CLIENTS.filter((c) => c.status === "In Progress").length,
      completed: CLIENTS.filter((c) => c.status === "Completed").length,
      pending: CLIENTS.filter((c) => c.approval === "Pending").length,
    }),
    [],
  );

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Client Onboarding
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor all client onboarding activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent">
              <Download size={15} /> Export
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
            >
              <Plus size={15} /> Add New Client
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={Users} label="Total Clients" value={kpis.total} tone="primary" />
          <Kpi icon={Clock} label="Active Onboarding" value={kpis.active} tone="info" />
          <Kpi icon={CheckCircle2} label="Completed" value={kpis.completed} tone="success" />
          <Kpi icon={AlertCircle} label="Pending Approvals" value={kpis.pending} tone="warning" />
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search client, company or ID…"
                className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <Select label="Status" value={status} onChange={setStatus} options={["All", "Draft", "In Progress", "Approved", "Completed"]} />
            <Select label="Region" value={region} onChange={setRegion} options={["All", "North", "South", "East", "West"]} />
            <Select label="Business Unit" value={bu} onChange={setBu} options={["All", "Logistics", "Healthcare", "Retail", "Technology", "FMCG", "Manufacturing"]} />
            <Select label="Account Manager" value={manager} onChange={setManager} options={["All", "Priya Sharma", "Rohit Verma", "Anita Iyer", "Karan Bose"]} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <Th>Client</Th>
                  <Th>Client ID</Th>
                  <Th>Company</Th>
                  <Th>Business Unit</Th>
                  <Th>Region / Site</Th>
                  <Th>Account Manager</Th>
                  <Th>Status</Th>
                  <Th>Start Date</Th>
                  <Th>Approval</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                      No clients match your filters.
                    </td>
                  </tr>
                )}
                {rows.map((c) => (
                  <tr key={c.id} className="hover:bg-accent/40">
                    <Td className="font-medium text-foreground">{c.name}</Td>
                    <Td className="text-muted-foreground">{c.id}</Td>
                    <Td>{c.company}</Td>
                    <Td>{c.bu}</Td>
                    <Td className="text-muted-foreground">{c.region} · {c.site}</Td>
                    <Td>{c.manager}</Td>
                    <Td><StatusPill status={c.status} /></Td>
                    <Td className="text-muted-foreground">{c.startDate}</Td>
                    <Td><ApprovalPill approval={c.approval} /></Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title="View"><Eye size={15} /></IconBtn>
                        <IconBtn title="Edit"><Pencil size={15} /></IconBtn>
                        {c.approval === "Pending" && (
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

      {drawerOpen && <OnboardingDrawer onClose={() => setDrawerOpen(false)} />}
    </AppLayout>
  );
}

/* -------------------- Drawer (Multi-step) -------------------- */

const STEPS = [
  "Basic Info",
  "Business Info",
  "Financial",
  "Assignment",
  "Documents",
  "Review",
];

function OnboardingDrawer({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        aria-label="Close overlay"
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-sm"
      />
      <div className="flex h-full w-full max-w-[640px] flex-col bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Add New Client</h2>
            <p className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1 border-b border-border px-6 py-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1">
              <div
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
              />
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <FormGrid>
              <Field label="Client Name"><Input placeholder="e.g. Aarav Mehta" /></Field>
              <Field label="Company Name"><Input placeholder="e.g. Northwind Ltd." /></Field>
              <Field label="Email"><Input type="email" placeholder="client@example.com" /></Field>
              <Field label="Phone"><Input placeholder="+91 98xxx xxxxx" /></Field>
            </FormGrid>
          )}
          {step === 1 && (
            <FormGrid>
              <Field label="Business Unit">
                <SelectInput options={["Logistics", "Healthcare", "Retail", "Technology", "FMCG"]} />
              </Field>
              <Field label="Region">
                <SelectInput options={["North", "South", "East", "West"]} />
              </Field>
              <Field label="Site">
                <SelectInput options={["Delhi HQ", "Mumbai", "Bengaluru", "Kolkata"]} />
              </Field>
              <Field label="Service Type">
                <SelectInput options={["Standard", "Premium", "Enterprise"]} />
              </Field>
              <Field label="Contract Start"><Input type="date" /></Field>
              <Field label="Contract End"><Input type="date" /></Field>
            </FormGrid>
          )}
          {step === 2 && (
            <FormGrid>
              <Field label="Billing Type">
                <SelectInput options={["Monthly", "Quarterly", "Annual"]} />
              </Field>
              <Field label="Currency">
                <SelectInput options={["INR", "USD", "EUR", "GBP"]} />
              </Field>
              <Field label="Payment Terms">
                <SelectInput options={["Net 15", "Net 30", "Net 45"]} />
              </Field>
              <Field label="Tax ID / GSTIN"><Input placeholder="22AAAAA0000A1Z5" /></Field>
            </FormGrid>
          )}
          {step === 3 && (
            <FormGrid>
              <Field label="Account Manager">
                <SelectInput options={["Priya Sharma", "Rohit Verma", "Anita Iyer", "Karan Bose"]} />
              </Field>
              <Field label="Department">
                <SelectInput options={["Sales", "Operations", "Finance"]} />
              </Field>
              <Field label="Team">
                <SelectInput options={["Team Alpha", "Team Bravo", "Team Charlie"]} />
              </Field>
            </FormGrid>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Upload signed agreements, KYC documents, and supporting files.</p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center hover:bg-muted/50">
                <Upload size={22} className="text-muted-foreground" />
                <div className="text-sm font-medium text-foreground">Click to upload or drag files</div>
                <div className="text-xs text-muted-foreground">PDF, DOCX, JPG up to 10MB</div>
                <input type="file" multiple className="hidden" />
              </label>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <ReviewBlock title="Basic Info" rows={[["Client Name", "—"], ["Company", "—"], ["Email", "—"]]} />
              <ReviewBlock title="Business Info" rows={[["Business Unit", "—"], ["Region", "—"], ["Site", "—"]]} />
              <ReviewBlock title="Financial" rows={[["Currency", "—"], ["Payment Terms", "—"]]} />
              <ReviewBlock title="Assignment" rows={[["Account Manager", "—"], ["Team", "—"]]} />
              <ReviewBlock title="Documents" rows={[["Files", "0 uploaded"]]} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50"
          >
            <ChevronLeft size={15} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="inline-flex h-9 items-center gap-1 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-95"
            >
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="inline-flex h-9 items-center gap-1 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-95"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Shared UI helpers -------------------- */

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number | string;
  tone: "primary" | "info" | "success" | "warning";
}) {
  const toneClass: Record<string, string> = {
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
        <div className={`flex h-9 w-9 items-center justify-center rounded-md ${toneClass[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="hidden md:inline">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-border bg-background px-2 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
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

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    Draft: "bg-muted text-muted-foreground",
    "In Progress": "bg-sky-100 text-sky-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Completed: "bg-primary/10 text-primary",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${map[status]}`}>
      {status}
    </span>
  );
}
function ApprovalPill({ approval }: { approval: Approval }) {
  const map: Record<Approval, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${map[approval]}`}>
      {approval}
    </span>
  );
}

function IconBtn({
  children,
  title,
  tone = "default",
}: {
  children: React.ReactNode;
  title: string;
  tone?: "default" | "success" | "danger";
}) {
  const c =
    tone === "success"
      ? "text-emerald-600 hover:bg-emerald-50"
      : tone === "danger"
      ? "text-rose-600 hover:bg-rose-50"
      : "text-muted-foreground hover:bg-accent hover:text-foreground";
  return (
    <button title={title} className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${c}`}>
      {children}
    </button>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
    />
  );
}
function SelectInput({ options }: { options: string[] }) {
  return (
    <select className="h-9 w-full rounded-md border border-border bg-background px-2 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
function ReviewBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <dl className="grid grid-cols-2 gap-y-1 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
