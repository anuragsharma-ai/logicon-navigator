import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  ChevronRight,
  Plus,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/finance/client-billing")({
  head: () => ({
    meta: [
      { title: "Client Billing — Finance | Logicon ERP" },
      {
        name: "description",
        content:
          "Manage client invoices, payments, and outstanding receivables in Logicon Finance.",
      },
      { property: "og:title", content: "Client Billing — Logicon ERP" },
      {
        property: "og:description",
        content: "Invoices, payments and receivables for your clients.",
      },
    ],
  }),
  component: ClientBillingPage,
});

const summary = [
  {
    label: "Total Billed",
    value: "$482,310",
    sub: "This month",
    icon: FileText,
    tone: "text-foreground",
  },
  {
    label: "Collected",
    value: "$318,640",
    sub: "66% of billed",
    icon: CheckCircle2,
    tone: "text-emerald-600",
  },
  {
    label: "Pending",
    value: "$118,420",
    sub: "42 invoices",
    icon: Clock,
    tone: "text-amber-600",
  },
  {
    label: "Overdue",
    value: "$45,250",
    sub: "11 invoices",
    icon: AlertCircle,
    tone: "text-rose-600",
  },
];

const invoices = [
  {
    id: "INV-10421",
    client: "Acme Industries",
    amount: "$12,400.00",
    issued: "Apr 02, 2026",
    due: "Apr 16, 2026",
    status: "Paid",
  },
  {
    id: "INV-10420",
    client: "Northwind Logistics",
    amount: "$8,950.00",
    issued: "Apr 02, 2026",
    due: "Apr 18, 2026",
    status: "Pending",
  },
  {
    id: "INV-10419",
    client: "Globex Corp.",
    amount: "$24,300.00",
    issued: "Mar 28, 2026",
    due: "Apr 11, 2026",
    status: "Overdue",
  },
  {
    id: "INV-10418",
    client: "Initech Pvt Ltd",
    amount: "$3,250.00",
    issued: "Mar 27, 2026",
    due: "Apr 10, 2026",
    status: "Paid",
  },
  {
    id: "INV-10417",
    client: "Umbrella Facilities",
    amount: "$17,800.00",
    issued: "Mar 25, 2026",
    due: "Apr 08, 2026",
    status: "Pending",
  },
  {
    id: "INV-10416",
    client: "Soylent Group",
    amount: "$6,420.00",
    issued: "Mar 22, 2026",
    due: "Apr 05, 2026",
    status: "Overdue",
  },
];

const tabs = ["All", "Pending", "Paid", "Overdue", "Draft"];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Overdue: "bg-rose-50 text-rose-700 ring-rose-200",
    Draft: "bg-slate-50 text-slate-600 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${map[status] ?? map.Draft}`}
    >
      {status}
    </span>
  );
}

function ClientBillingPage() {
  return (
    <AppLayout>
      <div className="px-8 py-7">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight size={14} />
          <span>Finance</span>
          <ChevronRight size={14} />
          <span className="font-medium text-foreground">Client Billing</span>
        </nav>

        {/* Header */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Client Billing
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track invoices, payments and outstanding receivables.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[13px] font-medium text-foreground hover:bg-accent">
              <Filter size={14} />
              Filter
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[13px] font-medium text-foreground hover:bg-accent">
              <Download size={14} />
              Export
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:opacity-95">
              <Plus size={14} />
              New Invoice
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summary.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
                <s.icon size={16} className={s.tone} />
              </div>
              <div className="mt-3 text-2xl font-semibold text-foreground">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="mt-6 rounded-lg border border-border bg-card">
          {/* Tabs + search */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
            <div className="flex items-center gap-1">
              {tabs.map((t, i) => (
                <button
                  key={t}
                  className={`h-8 rounded-md px-3 text-[13px] font-medium transition-colors ${
                    i === 0
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative w-full max-w-xs">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                placeholder="Search invoices…"
                className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Issued</th>
                  <th className="px-5 py-3">Due</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/40"
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      {inv.id}
                    </td>
                    <td className="px-5 py-3.5 text-foreground">{inv.client}</td>
                    <td className="px-5 py-3.5 text-foreground">{inv.amount}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {inv.issued}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {inv.due}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={inv.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[12px] text-muted-foreground">
            <span>Showing 1–6 of 184 invoices</span>
            <div className="flex items-center gap-1">
              <button className="h-7 rounded-md border border-border px-2.5 hover:bg-accent">
                Previous
              </button>
              <button className="h-7 rounded-md border border-border px-2.5 hover:bg-accent">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
