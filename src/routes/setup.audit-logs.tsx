import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, Select } from "@/setup/SetupShell";
import { auditLogs as seed, users, modules } from "@/setup/data";

export const Route = createFileRoute("/setup/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — Logicon" }] }),
  component: AuditLogsPage,
});

const ACTION_TONE: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  UPDATE: "bg-amber-50 text-amber-700 ring-amber-200",
  DELETE: "bg-rose-50 text-rose-700 ring-rose-200",
  LOGIN: "bg-sky-50 text-sky-700 ring-sky-200",
};

function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  const filtered = useMemo(() => seed.filter((r) => {
    if (userFilter && r.user !== userFilter) return false;
    if (moduleFilter && r.module !== moduleFilter) return false;
    return `${r.user} ${r.action} ${r.module}`.toLowerCase().includes(search.toLowerCase());
  }), [search, userFilter, moduleFilter]);

  return (
    <SetupPage
      title="Audit Logs"
      subtitle="Immutable record of every change made by administrators."
      hideAdd
      search={search}
      onSearch={setSearch}
      filters={
        <div className="flex items-center gap-2">
          <div className="w-44"><Select value={userFilter} placeholder="All Users" onChange={setUserFilter} options={[{ value: "", label: "All Users" }, ...users.map((u) => ({ value: u.name, label: u.name }))]} /></div>
          <div className="w-44"><Select value={moduleFilter} placeholder="All Modules" onChange={setModuleFilter} options={[{ value: "", label: "All Modules" }, ...modules.map((m) => ({ value: m.name, label: m.name })), { value: "Auth", label: "Auth" }]} /></div>
        </div>
      }
    >
      <DataTable rows={filtered} columns={[
        { key: "ts", header: "Timestamp", render: (r) => <span className="font-mono text-[12px] text-muted-foreground">{r.timestamp}</span> },
        { key: "user", header: "User", render: (r) => <span className="font-medium text-foreground">{r.user}</span> },
        { key: "action", header: "Action", render: (r) => <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${ACTION_TONE[r.action] ?? "bg-slate-50 text-slate-600 ring-slate-200"}`}>{r.action}</span> },
        { key: "module", header: "Module", render: (r) => r.module },
        { key: "old", header: "Old Value", render: (r) => <span className="text-muted-foreground">{r.oldValue}</span> },
        { key: "new", header: "New Value", render: (r) => <span className="text-foreground">{r.newValue}</span> },
        { key: "ip", header: "IP Address", render: (r) => <span className="font-mono text-[12px] text-muted-foreground">{r.ip}</span> },
      ]} />
    </SetupPage>
  );
}
