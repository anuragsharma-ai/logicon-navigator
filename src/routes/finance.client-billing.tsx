import { useMemo, useState } from "react";
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
  X,
  Trash2,
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
  const [drawer, setDrawer] = useState(false);
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
            <button
              onClick={() => setDrawer(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:opacity-95"
            >
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

      {drawer && <CreateInvoiceDrawer onClose={() => setDrawer(false)} />}
    </AppLayout>
  );
}

/* -------------------- Create Invoice Drawer -------------------- */

interface LineItem {
  service: string;
  qty: number;
  rate: number;
}

function CreateInvoiceDrawer({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<LineItem[]>([
    { service: "Monthly retainer", qty: 1, rate: 5000 },
    { service: "Implementation hours", qty: 10, rate: 120 },
  ]);
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0),
    [items],
  );
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const total = subtotal - discount + taxAmount;
  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const updateItem = (i: number, patch: Partial<LineItem>) =>
    setItems((arr) => arr.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  return (
    <div className="fixed inset-0 z-50 flex">
      <button aria-label="Close" onClick={onClose} className="flex-1 bg-black/40 backdrop-blur-sm" />
      <div className="flex h-full w-full max-w-[720px] flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Create Invoice</h2>
            <p className="text-xs text-muted-foreground">Generate a new invoice for a client</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Client */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client Info</h3>
            <FormGrid>
              <Field label="Client (from onboarding)">
                <SelectInput options={["Acme Industries", "Northwind Logistics", "Globex Corp.", "Initech Pvt Ltd", "Umbrella Facilities"]} />
              </Field>
              <Field label="Billing Contact"><Input placeholder="finance@client.com" /></Field>
            </FormGrid>
          </section>

          {/* Billing details */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Billing Details</h3>
            <FormGrid>
              <Field label="Invoice Date"><Input type="date" /></Field>
              <Field label="Billing Period"><Input placeholder="Apr 2026" /></Field>
            </FormGrid>
          </section>

          {/* Line items */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Line Items</h3>
              <button
                onClick={() => setItems((a) => [...a, { service: "", qty: 1, rate: 0 }])}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground hover:bg-accent"
              >
                <Plus size={13} /> Add Item
              </button>
            </div>
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Service</th>
                    <th className="px-3 py-2 text-right font-medium w-20">Qty</th>
                    <th className="px-3 py-2 text-right font-medium w-28">Rate</th>
                    <th className="px-3 py-2 text-right font-medium w-32">Amount</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((it, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2"><Input value={it.service} onChange={(e) => updateItem(i, { service: e.target.value })} placeholder="Service" /></td>
                      <td className="px-3 py-2"><Input type="number" value={it.qty} onChange={(e) => updateItem(i, { qty: Number(e.target.value) })} className="text-right" /></td>
                      <td className="px-3 py-2"><Input type="number" value={it.rate} onChange={(e) => updateItem(i, { rate: Number(e.target.value) })} className="text-right" /></td>
                      <td className="px-3 py-2 text-right text-sm font-medium text-foreground">{fmt((it.qty || 0) * (it.rate || 0))}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => setItems((arr) => arr.filter((_, idx) => idx !== i))} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50" title="Remove">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormGrid>
                <Field label="Discount"><Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} /></Field>
                <Field label="Tax %"><Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} /></Field>
              </FormGrid>
              <div className="rounded-md border border-border bg-muted/30 p-4 text-sm">
                <Row label="Subtotal" value={fmt(subtotal)} />
                <Row label="Discount" value={"- " + fmt(discount)} />
                <Row label={`Tax (${taxRate}%)`} value={fmt(taxAmount)} />
                <div className="my-2 border-t border-border" />
                <Row label="Total" value={fmt(total)} bold />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</h3>
            <FormGrid>
              <Field label="Payment Terms"><SelectInput options={["Net 15", "Net 30", "Net 45"]} /></Field>
              <Field label="Due Date"><Input type="date" /></Field>
            </FormGrid>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3">
          <button onClick={onClose} className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent">Save as Draft</button>
          <button onClick={onClose} className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-95">Create Invoice</button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 ${bold ? "text-foreground font-semibold text-base" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "text-foreground" : "text-foreground"}>{value}</span>
    </div>
  );
}
function FormGrid({ children }: { children: React.ReactNode }) { return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-xs font-medium text-foreground">{label}</label>{children}</div>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`h-9 w-full rounded-md border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 ${className}`} />;
}
function SelectInput({ options }: { options: string[] }) {
  return (
    <select className="h-9 w-full rounded-md border border-border bg-background px-2 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
      <option value="">Select…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
