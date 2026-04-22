import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, Select, useDrawer } from "@/setup/SetupShell";
import { roles as seed, departments, accessLevels, deptName } from "@/setup/data";

export const Route = createFileRoute("/setup/role")({
  head: () => ({ meta: [{ title: "Role Master — Logicon" }] }),
  component: RolePage,
});

const DASHBOARDS = ["Management", "Department", "Site"];

function RolePage() {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const filtered = useMemo(() => rows.filter((r) => (!deptFilter || r.deptId === deptFilter) && `${r.name} ${r.code}`.toLowerCase().includes(search.toLowerCase())), [rows, search, deptFilter]);

  const openNew = () => { setForm({ id: `rl-${Date.now()}`, name: "", code: "", deptId: departments[0].id, scope: "Site", manageUsers: false, approve: false, dashboard: "Department", crossDept: false, status: true }); drawer.show(); };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  return (
    <SetupPage title="Role Master" subtitle="Roles define access scope and link to the Permission Matrix." onAdd={openNew} addLabel="Add Role" search={search} onSearch={setSearch}
      filters={<div className="w-56"><Select value={deptFilter} placeholder="All Departments" onChange={setDeptFilter} options={[{ value: "", label: "All Departments" }, ...departments.map((d) => ({ value: d.id, label: d.name }))]} /></div>}
    >
      <DataTable rows={filtered} columns={[
        { key: "name", header: "Role", render: (r) => <div><div className="font-medium text-foreground">{r.name}</div><div className="font-mono text-[11px] text-muted-foreground">{r.code}</div></div> },
        { key: "dept", header: "Department", render: (r) => deptName(r.deptId) },
        { key: "scope", header: "Access Scope", render: (r) => <span className="rounded-md bg-secondary px-2 py-0.5 text-[12px]">{r.scope}</span> },
        { key: "dashboard", header: "Dashboard", render: (r) => r.dashboard },
        { key: "manage", header: "Manage Users", render: (r) => <StatusPill active={r.manageUsers} label={r.manageUsers ? "Yes" : "No"} /> },
        { key: "approve", header: "Can Approve", render: (r) => <StatusPill active={r.approve} label={r.approve ? "Yes" : "No"} /> },
        { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
        { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
      ]} />
      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit Role" : "New Role"} description="Roles connect to Permission Matrix and govern user capabilities." onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Identity">
              <Field label="Role Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Role Code" required><TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></Field>
              <Field label="Department" required><Select value={form.deptId} onChange={(v) => setForm({ ...form, deptId: v })} options={departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
              <Field label="Access Scope" required><Select value={form.scope} onChange={(v) => setForm({ ...form, scope: v })} options={accessLevels.map((a) => ({ value: a, label: a }))} /></Field>
            </FieldSection>
            <FieldSection title="Capabilities">
              <Field label="Can Manage Users"><div className="flex h-9 items-center"><Toggle checked={form.manageUsers} onChange={(v) => setForm({ ...form, manageUsers: v })} /></div></Field>
              <Field label="Can Approve"><div className="flex h-9 items-center"><Toggle checked={form.approve} onChange={(v) => setForm({ ...form, approve: v })} /></div></Field>
              <Field label="Cross Department Access"><div className="flex h-9 items-center"><Toggle checked={form.crossDept} onChange={(v) => setForm({ ...form, crossDept: v })} /></div></Field>
              <Field label="Dashboard Type"><Select value={form.dashboard} onChange={(v) => setForm({ ...form, dashboard: v })} options={DASHBOARDS.map((d) => ({ value: d, label: d }))} /></Field>
            </FieldSection>
            <FieldSection title="Status"><Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field></FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
