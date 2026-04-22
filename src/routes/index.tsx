import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  ArrowUpRight,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Logicon ERP" },
      { name: "description", content: "Logicon admin dashboard." },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  { label: "Revenue (MTD)", value: "$248,930", delta: "+12.4%", icon: DollarSign },
  { label: "Active Clients", value: "1,284", delta: "+3.2%", icon: Users },
  { label: "Open Invoices", value: "184", delta: "-1.8%", icon: FileText },
  { label: "Pipeline", value: "$1.2M", delta: "+8.1%", icon: TrendingUp },
];

function DashboardPage() {
  return (
    <AppLayout>
      <div className="px-8 py-7">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back, Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening across your organization today.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <s.icon size={18} />
                </div>
                <span className="text-xs font-medium text-emerald-600">
                  {s.delta}
                </span>
              </div>
              <div className="mt-4 text-2xl font-semibold text-foreground">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Quick access
            </h2>
            <Link
              to="/finance/client-billing"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Open Client Billing <ArrowUpRight size={14} />
            </Link>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Jump into a module from the sidebar to get started.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
