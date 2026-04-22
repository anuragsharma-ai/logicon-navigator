import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SetupPage, DataTable, RowActions, Drawer, FieldSection, Field, Select, useDrawer } from "@/setup/SetupShell";
import { reportingStructure as seed, users, userName } from "@/setup/data";

export const Route = createFileRoute("/setup/reporting-structure")({
  head: () => ({ meta: [{ title: "Reporting Structure — Logicon" }] }),
  component: ReportingPage,
});

type Row = (typeof seed)[number] & { id: string };

function ReportingPage() {
  const [rows, setRows] = useState<Row[]>(seed.map((r, i) => ({ ...r, id: `rs-${i}` })));
  const [view, setView] = useState<"chart" | "table">("chart");
  const drawer = useDrawer();
  const [form, setForm] = useState<Row | null>(null);

  const openNew = () => { setForm({ id: `rs-${Date.now()}`, userId: users[0].id, managerId: users[0].id, secondaryId: null, escalationId: users[0].id }); drawer.show(); };
  const openEdit = (r: Row) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  // Build a simple org chart from manager links
  const roots = users.filter((u) => !rows.find((r) => r.userId === u.id)?.managerId);
  const childrenOf = (uid: string) => rows.filter((r) => r.managerId === uid).map((r) => users.find((u) => u.id === r.userId)!).filter(Boolean);

  return (
    <SetupPage
      title="Reporting Structure"
      subtitle="Defines hierarchy used by Approval Workflow."
      onAdd={openNew}
      addLabel="Add Mapping"
      filters={
        <div className="inline-flex rounded-md border border-border bg-background p-0.5">
          <button onClick={() => setView("chart")} className={`h-7 rounded px-3 text-[12px] font-medium ${view === "chart" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>Org Chart</button>
          <button onClick={() => setView("table")} className={`h-7 rounded px-3 text-[12px] font-medium ${view === "table" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>Table</button>
        </div>
      }
    >
      {view === "chart" ? (
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="flex flex-col items-center gap-6">
            {roots.map((root) => (
              <Node key={root.id} user={root} childrenOf={childrenOf} />
            ))}
          </div>
        </div>
      ) : (
        <DataTable rows={rows} columns={[
          { key: "user", header: "User", render: (r) => <span className="font-medium text-foreground">{userName(r.userId)}</span> },
          { key: "mgr", header: "Reporting Manager", render: (r) => userName(r.managerId) },
          { key: "sec", header: "Secondary Manager", render: (r) => userName(r.secondaryId) },
          { key: "esc", header: "Escalation Manager", render: (r) => userName(r.escalationId) },
          { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
        ]} />
      )}

      <Drawer open={drawer.open} onClose={drawer.hide} title="Reporting Mapping" onSubmit={save}>
        {form && (
          <FieldSection title="Hierarchy">
            <Field label="User" required><Select value={form.userId} onChange={(v) => setForm({ ...form, userId: v })} options={users.map((u) => ({ value: u.id, label: u.name }))} /></Field>
            <Field label="Reporting Manager" required><Select value={form.managerId ?? ""} onChange={(v) => setForm({ ...form, managerId: v })} options={users.map((u) => ({ value: u.id, label: u.name }))} /></Field>
            <Field label="Secondary Manager"><Select value={form.secondaryId ?? ""} onChange={(v) => setForm({ ...form, secondaryId: v || null })} options={[{ value: "", label: "— None —" }, ...users.map((u) => ({ value: u.id, label: u.name }))]} /></Field>
            <Field label="Escalation Manager"><Select value={form.escalationId ?? ""} onChange={(v) => setForm({ ...form, escalationId: v })} options={users.map((u) => ({ value: u.id, label: u.name }))} /></Field>
          </FieldSection>
        )}
      </Drawer>
    </SetupPage>
  );
}

function Node({ user, childrenOf }: { user: { id: string; name: string; email: string }; childrenOf: (uid: string) => { id: string; name: string; email: string }[] }) {
  const kids = childrenOf(user.id);
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg border border-border bg-background px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">{user.name.split(" ").map((n) => n[0]).slice(0,2).join("")}</div>
          <div>
            <div className="text-[13px] font-semibold text-foreground">{user.name}</div>
            <div className="text-[11px] text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </div>
      {kids.length > 0 && (
        <>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-start gap-6 border-t border-border pt-6">
            {kids.map((k) => <Node key={k.id} user={k} childrenOf={childrenOf} />)}
          </div>
        </>
      )}
    </div>
  );
}
