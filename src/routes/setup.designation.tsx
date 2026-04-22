import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, Select, useDrawer } from "@/setup/SetupShell";
import { designations as seed, departments, deptName } from "@/setup/data";

export const Route = createFileRoute("/setup/designation")({
  head: () => ({ meta: [{ title: "Designation Master — Logicon" }] }),
  component: DesignationPage,
});

function DesignationPage() {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const filtered = useMemo(() => rows.filter((r) => (!deptFilter || r.deptId === deptFilter) && r.name.toLowerCase().includes(search.toLowerCase())), [rows, search, deptFilter]);

  const openNew = () => { setForm({ id: `dg-${Date.now()}`, name: "", deptId: departments[0].id, level: 1, status: true }); drawer.show(); };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  return (
    <SetupPage title="Designation Master" subtitle="Designations belong to a Department. Higher level = higher seniority." onAdd={openNew} addLabel="Add Designation" search={search} onSearch={setSearch}
      filters={<div className="w-56"><Select value={deptFilter} placeholder="All Departments" onChange={setDeptFilter} options={[{ value: "", label: "All Departments" }, ...departments.map((d) => ({ value: d.id, label: d.name }))]} /></div>}
    >
      <DataTable rows={filtered} columns={[
        { key: "name", header: "Designation", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
        { key: "dept", header: "Department", render: (r) => deptName(r.deptId) },
        { key: "level", header: "Level", render: (r) => <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-secondary px-1.5 text-[12px] font-medium">{r.level}</span> },
        { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
        { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
      ]} />
      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit Designation" : "New Designation"} onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Designation">
              <Field label="Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Department" required><Select value={form.deptId} onChange={(v) => setForm({ ...form, deptId: v })} options={departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
              <Field label="Level" required hint="1 (junior) → 10 (executive)"><TextInput type="number" min={1} max={10} value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} /></Field>
            </FieldSection>
            <FieldSection title="Status"><Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field></FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
