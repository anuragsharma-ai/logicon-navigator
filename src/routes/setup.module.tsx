import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, Select, useDrawer } from "@/setup/SetupShell";
import { modules as seed, departments, deptName } from "@/setup/data";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/setup/module")({
  head: () => ({ meta: [{ title: "Module Master — Logicon" }] }),
  component: ModulePage,
});

const ICON_OPTIONS = ["Wallet", "Ticket", "Package", "Clock", "Target", "FileSearch", "Users", "Briefcase", "BarChart3", "Settings"];
const TYPES = ["Common", "Department", "Restricted"];

function IconPreview({ name, size = 16 }: { name: string; size?: number }) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name];
  return Cmp ? <Cmp size={size} className="text-muted-foreground" /> : null;
}

function ModulePage() {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const filtered = useMemo(() => rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const openNew = () => { setForm({ id: `mod-${Date.now()}`, name: "", parentId: null, deptId: departments[0].id, type: "Department", route: "", icon: "Package", visible: true, status: true }); drawer.show(); };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  return (
    <SetupPage title="Module Master" subtitle="Modules are the building blocks. Used in Permission Matrix and Visibility Rules." onAdd={openNew} addLabel="Add Module" search={search} onSearch={setSearch}>
      <DataTable rows={filtered} columns={[
        { key: "name", header: "Module", render: (r) => <div className="flex items-center gap-2"><IconPreview name={r.icon} /><span className="font-medium text-foreground">{r.name}</span></div> },
        { key: "type", header: "Type", render: (r) => <span className="rounded-md bg-secondary px-2 py-0.5 text-[12px]">{r.type}</span> },
        { key: "dept", header: "Department", render: (r) => deptName(r.deptId) },
        { key: "route", header: "Route", render: (r) => <code className="rounded bg-secondary px-1.5 py-0.5 text-[11px]">{r.route}</code> },
        { key: "default", header: "Default Visible", render: (r) => <StatusPill active={r.visible} label={r.visible ? "Yes" : "No"} /> },
        { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
        { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
      ]} />
      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit Module" : "New Module"} onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Identity">
              <Field label="Module Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Parent Module"><Select value={form.parentId ?? ""} onChange={(v) => setForm({ ...form, parentId: v || null })} options={[{ value: "", label: "— None —" }, ...rows.filter((r) => r.id !== form.id).map((r) => ({ value: r.id, label: r.name }))]} /></Field>
              <Field label="Module Type" required><Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={TYPES.map((t) => ({ value: t, label: t }))} /></Field>
              <Field label="Department"><Select value={form.deptId} onChange={(v) => setForm({ ...form, deptId: v })} options={departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
              <Field label="Route URL" full><TextInput value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} placeholder="/finance/client-billing" /></Field>
            </FieldSection>
            <FieldSection title="Appearance">
              <Field label="Icon" full>
                <div className="grid grid-cols-5 gap-2 rounded-md border border-border bg-background p-2">
                  {ICON_OPTIONS.map((n) => {
                    const active = form.icon === n;
                    return (
                      <button key={n} type="button" onClick={() => setForm({ ...form, icon: n })}
                        className={`flex h-12 flex-col items-center justify-center gap-0.5 rounded-md border text-[10px] ${active ? "border-primary bg-[var(--primary-soft)]" : "border-border hover:bg-accent"}`}>
                        <IconPreview name={n} size={18} />
                        <span className="truncate">{n}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </FieldSection>
            <FieldSection title="Settings">
              <Field label="Default Visible"><div className="flex h-9 items-center"><Toggle checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} /></div></Field>
              <Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field>
            </FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
