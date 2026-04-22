import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, Select, useDrawer } from "@/setup/SetupShell";
import { departments as seed, businessUnits, users, modules as mods, buName, userName, moduleName } from "@/setup/data";

export const Route = createFileRoute("/setup/department")({
  head: () => ({ meta: [{ title: "Department Master — Logicon" }] }),
  component: DeptPage,
});

function DeptPage() {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const filtered = useMemo(() => rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const openNew = () => { setForm({ id: `dp-${Date.now()}`, name: "", code: "", buId: businessUnits[0].id, headId: users[0].id, modules: [], status: true }); drawer.show(); };
  const openEdit = (r: typeof seed[number]) => { setForm({ ...r, modules: [...r.modules] }); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };
  const toggleMod = (id: string) => form && setForm({ ...form, modules: form.modules.includes(id) ? form.modules.filter((m) => m !== id) : [...form.modules, id] });

  return (
    <SetupPage title="Department Master" subtitle="Departments control module visibility and parent Designations & Roles." onAdd={openNew} addLabel="Add Department" search={search} onSearch={setSearch}>
      <DataTable rows={filtered} columns={[
        { key: "name", header: "Department", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
        { key: "code", header: "Code", render: (r) => <span className="font-mono text-[12px]">{r.code}</span> },
        { key: "bu", header: "Business Unit", render: (r) => buName(r.buId) },
        { key: "head", header: "Head", render: (r) => userName(r.headId) },
        { key: "modules", header: "Default Modules", render: (r) => <div className="flex flex-wrap gap-1">{r.modules.length === 0 ? <span className="text-muted-foreground">—</span> : r.modules.map((m) => <span key={m} className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px]">{moduleName(m)}</span>)}</div> },
        { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
        { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
      ]} />
      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit Department" : "New Department"} onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Identity">
              <Field label="Department Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Code" required><TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></Field>
            </FieldSection>
            <FieldSection title="Hierarchy">
              <Field label="Business Unit" required><Select value={form.buId} onChange={(v) => setForm({ ...form, buId: v })} options={businessUnits.map((b) => ({ value: b.id, label: b.name }))} /></Field>
              <Field label="Department Head"><Select value={form.headId} onChange={(v) => setForm({ ...form, headId: v })} options={users.map((u) => ({ value: u.id, label: u.name }))} /></Field>
            </FieldSection>
            <FieldSection title="Modules">
              <Field label="Default Modules" full hint="These will be visible to users in this department by default">
                <div className="flex flex-wrap gap-2 rounded-md border border-border bg-background p-2">
                  {mods.map((m) => {
                    const on = form.modules.includes(m.id);
                    return (
                      <button key={m.id} type="button" onClick={() => toggleMod(m.id)}
                        className={`h-7 rounded-md border px-2 text-[12px] font-medium ${on ? "border-primary bg-[var(--primary-soft)] text-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent"}`}>
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </FieldSection>
            <FieldSection title="Status"><Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field></FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
