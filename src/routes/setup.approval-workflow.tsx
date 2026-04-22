import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SetupPage, DataTable, RowActions, Drawer, FieldSection, Field, Select, TextInput, useDrawer } from "@/setup/SetupShell";
import { approvalWorkflows as seed, modules, departments, regions, sites, roles, moduleName, deptName, regionName, siteName, roleName } from "@/setup/data";
import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/setup/approval-workflow")({
  head: () => ({ meta: [{ title: "Approval Workflow — Logicon" }] }),
  component: WorkflowPage,
});

type WF = (typeof seed)[number];

function WorkflowPage() {
  const [rows, setRows] = useState<WF[]>(seed);
  const drawer = useDrawer();
  const [form, setForm] = useState<WF | null>(null);

  const openNew = () => { setForm({ id: `wf-${Date.now()}`, moduleId: modules[0].id, deptId: departments[0].id, regionId: regions[0].id, siteId: null, steps: [{ level: 1, roleId: roles[0].id, escalationHrs: 24 }] }); drawer.show(); };
  const openEdit = (r: WF) => { setForm({ ...r, steps: [...r.steps] }); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  const updateStep = (i: number, patch: Partial<WF["steps"][number]>) => {
    if (!form) return;
    const steps = form.steps.map((s, idx) => idx === i ? { ...s, ...patch } : s);
    setForm({ ...form, steps });
  };
  const move = (i: number, dir: -1 | 1) => {
    if (!form) return;
    const j = i + dir;
    if (j < 0 || j >= form.steps.length) return;
    const steps = [...form.steps];
    [steps[i], steps[j]] = [steps[j], steps[i]];
    setForm({ ...form, steps: steps.map((s, idx) => ({ ...s, level: idx + 1 })) });
  };
  const addStep = () => form && setForm({ ...form, steps: [...form.steps, { level: form.steps.length + 1, roleId: roles[0].id, escalationHrs: 24 }] });
  const removeStep = (i: number) => form && setForm({ ...form, steps: form.steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, level: idx + 1 })) });

  return (
    <SetupPage title="Approval Workflow" subtitle="Multi-level approvals using the Reporting Structure." onAdd={openNew} addLabel="Add Workflow">
      <DataTable rows={rows} columns={[
        { key: "module", header: "Module", render: (r) => <span className="font-medium text-foreground">{moduleName(r.moduleId)}</span> },
        { key: "dept", header: "Department", render: (r) => deptName(r.deptId) },
        { key: "region", header: "Region", render: (r) => regionName(r.regionId) },
        { key: "site", header: "Site", render: (r) => r.siteId ? siteName(r.siteId) : <span className="text-muted-foreground">All</span> },
        { key: "steps", header: "Approval Chain", render: (r) => (
          <div className="flex items-center gap-1.5">
            {r.steps.map((s, i) => (
              <div key={s.level} className="flex items-center gap-1.5">
                <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[var(--primary-tint)] px-2 text-[11px] font-medium text-foreground">L{s.level} · {roleName(s.roleId)}</span>
                {i < r.steps.length - 1 && <span className="text-muted-foreground">→</span>}
              </div>
            ))}
          </div>
        ) },
        { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
      ]} />

      <Drawer open={drawer.open} onClose={drawer.hide} title="Approval Workflow" description="Define which roles approve, in order." onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Scope">
              <Field label="Module" required><Select value={form.moduleId} onChange={(v) => setForm({ ...form, moduleId: v })} options={modules.map((m) => ({ value: m.id, label: m.name }))} /></Field>
              <Field label="Department" required><Select value={form.deptId} onChange={(v) => setForm({ ...form, deptId: v })} options={departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
              <Field label="Region" required><Select value={form.regionId} onChange={(v) => setForm({ ...form, regionId: v })} options={regions.map((r) => ({ value: r.id, label: r.name }))} /></Field>
              <Field label="Site"><Select value={form.siteId ?? ""} onChange={(v) => setForm({ ...form, siteId: v || null })} options={[{ value: "", label: "All Sites" }, ...sites.filter((s) => s.regionId === form.regionId).map((s) => ({ value: s.id, label: s.name }))]} /></Field>
            </FieldSection>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Approval Steps</div>
              <button type="button" onClick={addStep} className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-[12px] font-medium hover:bg-accent"><Plus size={14} /> Add Step</button>
            </div>
            <div className="space-y-2">
              {form.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-background p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[12px] font-semibold text-primary">L{s.level}</div>
                  <div className="flex-1"><Select value={s.roleId} onChange={(v) => updateStep(i, { roleId: v })} options={roles.map((r) => ({ value: r.id, label: r.name }))} /></div>
                  <div className="w-28"><TextInput type="number" min={1} value={s.escalationHrs} onChange={(e) => updateStep(i, { escalationHrs: Number(e.target.value) })} /></div>
                  <span className="text-[11px] text-muted-foreground">hrs</span>
                  <div className="flex items-center">
                    <button type="button" onClick={() => move(i, -1)} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent"><ChevronUp size={14} /></button>
                    <button type="button" onClick={() => move(i, 1)} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent"><ChevronDown size={14} /></button>
                    <button type="button" onClick={() => removeStep(i)} className="flex h-7 w-7 items-center justify-center rounded text-rose-600 hover:bg-rose-50"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
