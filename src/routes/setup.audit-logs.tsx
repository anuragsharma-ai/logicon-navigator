import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, Select } from "@/setup/SetupShell";
import { auditLogs, users } from "@/setup/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/setup/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — Logicon" }] }),
  component: AuditLogsPage,
});

const actionColor: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  UPDATE: "bg-blue-50 text-blue-700 ring-blue-200",
  DELETE: "bg-rose-50 text-rose-700 ring-rose-200",
  LOGIN: "bg-violet-50 text-violet-700 ring-violet-200",
};

function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState("");
  const [mod, setMod] = useState("");
  const [date, setDate] = useState("");

  const rows = useMemo(
    () =>
      auditLogs.filter((l) => {
        if (search && !`${l.user} ${l.action} ${l.module} ${l.newValue}`.toLowerCase().includes(search.toLowerCase())) return false;
        if (user && l.user !== user) return false;
        if (mod && l.module !== mod) return false;
        if (date && !l.timestamp.startsWith(date)) return false;
        return true;
      }),
    [search, user, mod, date],
  );

  return (
    <SetupPage
      title="Audit Logs"
      subtitle="Track every change across the system. Logs are immutable and retained per compliance policy."
      hideAdd
      search={search}
      onSearch={setSearch}
    >
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Select value={user} onChange={setUser} placeholder="All Users" options={users.map((u) => ({ value: u.name, label: u.name }))} />
        <Select value={mod} onChange={setMod} placeholder="All Modules" options={[...new Set(auditLogs.map((l) => l.module))].map((m) => ({ value: m, label: m }))} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <DataTable
        rows={rows}
        columns={[
          { key: "user", header: "User", render: (r) => <span className="font-medium text-foreground">{r.user}</span> },
          { key: "action", header: "Action", render: (r) => (
            <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", actionColor[r.action] ?? "bg-secondary text-foreground ring-border")}>
              {r.action}
            </span>
          )},
          { key: "module", header: "Module", render: (r) => r.module },
          { key: "old", header: "Old Value", render: (r) => <span className="font-mono text-[12px] text-muted-foreground">{r.oldValue}</span> },
          { key: "new", header: "New Value", render: (r) => <span className="font-mono text-[12px] text-foreground">{r.newValue}</span> },
          { key: "ts", header: "Timestamp", render: (r) => <span className="text-muted-foreground">{r.timestamp}</span> },
          { key: "ip", header: "IP", render: (r) => <span className="font-mono text-[12px] text-muted-foreground">{r.ip}</span> },
        ]}
      />
    </SetupPage>
  );
}
