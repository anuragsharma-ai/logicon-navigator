import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SetupPage, DataTable, RowActions, Toggle, Drawer, FieldSection, Field, Select, useDrawer } from "@/setup/SetupShell";
import { visibilityRules as seed, roles, departments, modules, sites, roleName, deptName, moduleName, siteName } from "@/setup/data";

export const Route = createFileRoute("/setup/module-visibility")({
  head: () => ({ meta: [{ title: "Module Visibility Rules — Logicon" }] }),
  component: VisibilityPage,
});

function VisibilityPage() {
  const [rows, setRows] = useState(seed);
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const openNew = () => { setForm({ id: `v-${Date.now()}`, roleId: roles[0].id, deptId: departments[0].id, moduleId: modules[0].id, siteId: null, visible: true, disabled: false }); drawer.show(); };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  return (
    <SetupPage title="Module Visibility Rules" subtitle="Final visibility = Role + Department + Site + Permission" onAdd={openNew} addLabel="Add Rule">
      <div className="mb-3 rounded-md border border-border bg-secondary/50 px-4 py-2.5 text-[12px] text-muted-foreground">
        <span className="font-medium text-foreground">Logic:</span> a module is visible only when the user's Role + Department + Site all match a rule with <em>Visible</em> on, and the Permission Matrix grants <em>View</em>.
      </div>
      <DataTable rows={rows} columns={[
        { key: "role", header: "Role", render: (r) => roleName(r.roleId) },
        { key: "dept", header: "Department", render: (r) => deptName(r.deptId) },
        { key: "module", header: "Module", render: (r) => <span className="font-medium text-foreground">{moduleName(r.moduleId)}</span> },
        { key: "site", header: "Site", render: (r) => r.siteId ? siteName(r.siteId) : <span className="text-muted-foreground">All sites</span> },
        { key: "visible", header: "Visible", render: (r) => <Toggle size="sm" checked={r.visible} onChange={(v) => setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, visible: v } : x))} /> },
        { key: "disabled", header: "Disabled", render: (r) => <Toggle size="sm" checked={r.disabled} onChange={(v) => setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, disabled: v } : x))} /> },
        { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
      ]} />
      <Drawer open={drawer.open} onClose={drawer.hide} title="Visibility Rule" onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Scope">
              <Field label="Role" required><Select value={form.roleId} onChange={(v) => setForm({ ...form, roleId: v })} options={roles.map((r) => ({ value: r.id, label: r.name }))} /></Field>
              <Field label="Department" required><Select value={form.deptId} onChange={(v) => setForm({ ...form, deptId: v })} options={departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
              <Field label="Module" required><Select value={form.moduleId} onChange={(v) => setForm({ ...form, moduleId: v })} options={modules.map((m) => ({ value: m.id, label: m.name }))} /></Field>
              <Field label="Site"><Select value={form.siteId ?? ""} onChange={(v) => setForm({ ...form, siteId: v || null })} options={[{ value: "", label: "All Sites" }, ...sites.map((s) => ({ value: s.id, label: s.name }))]} /></Field>
            </FieldSection>
            <FieldSection title="Behavior">
              <Field label="Visible"><div className="flex h-9 items-center"><Toggle checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} /></div></Field>
              <Field label="Disabled (read-only)"><div className="flex h-9 items-center"><Toggle checked={form.disabled} onChange={(v) => setForm({ ...form, disabled: v })} /></div></Field>
            </FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
