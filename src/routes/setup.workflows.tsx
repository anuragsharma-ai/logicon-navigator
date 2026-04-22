import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  SetupPage,
  DataTable,
  RowActions,
  Drawer,
  FieldSection,
  Field,
  Select,
  TextInput,
  useDrawer,
} from "@/setup/SetupShell";
import {
  approvalWorkflows,
  modules as allModules,
  departments,
  regions,
  sites,
  roles,
  moduleName,
  deptName,
  regionName,
  siteName,
  roleName,
} from "@/setup/data";
import { GripVertical, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/setup/workflows")({
  head: () => ({ meta: [{ title: "Workflows & Approvals — Logicon" }] }),
  component: WorkflowsPage,
});

function WorkflowsPage() {
  const [search, setSearch] = useState("");
  const drawer = useDrawer<{ row?: any }>();
  const [steps, setSteps] = useState<{ roleId: string; hrs: number }[]>([
    { roleId: "rl-1", hrs: 24 },
    { roleId: "rl-2", hrs: 48 },
  ]);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    setSteps(next);
  };

  return (
    <SetupPage
      title="Workflows & Approvals"
      subtitle="Define multi-level approval chains by module, department, region, and site."
      onAdd={() => drawer.show({})}
      addLabel="New Workflow"
      search={search}
      onSearch={setSearch}
    >
      <DataTable
        rows={approvalWorkflows.filter((w) => moduleName(w.moduleId).toLowerCase().includes(search.toLowerCase()))}
        columns={[
          { key: "module", header: "Module", render: (w) => <div className="font-medium text-foreground">{moduleName(w.moduleId)}</div> },
          { key: "dept", header: "Department", render: (w) => deptName(w.deptId) },
          { key: "region", header: "Region", render: (w) => regionName(w.regionId) },
          { key: "site", header: "Site", render: (w) => siteName(w.siteId) },
          { key: "steps", header: "Approval Chain", render: (w) => (
            <div className="flex flex-wrap items-center gap-1">
              {w.steps.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    L{s.level}: {roleName(s.roleId)}
                  </span>
                  {i < w.steps.length - 1 && <span className="text-muted-foreground">→</span>}
                </span>
              ))}
            </div>
          )},
          { key: "actions", header: "", align: "right", render: (w) => <RowActions onEdit={() => drawer.show({ row: w })} /> },
        ]}
      />

      <Drawer
        open={drawer.open}
        onClose={drawer.hide}
        title="Configure Approval Workflow"
        description="Reorder approval levels and set escalation timers."
      >
        <FieldSection title="Scope">
          <Field label="Module" required><Select options={allModules.map((m) => ({ value: m.id, label: m.name }))} /></Field>
          <Field label="Department" required><Select options={departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
          <Field label="Region"><Select options={regions.map((r) => ({ value: r.id, label: r.name }))} /></Field>
          <Field label="Site"><Select options={sites.map((s) => ({ value: s.id, label: s.name }))} /></Field>
        </FieldSection>

        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Approval Steps</div>
          <button
            onClick={() => setSteps((s) => [...s, { roleId: roles[0].id, hrs: 24 }])}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[12px] font-medium hover:bg-accent"
          >
            <Plus size={12} /> Add Step
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-card p-2.5">
              <GripVertical size={16} className="text-muted-foreground" />
              <div className="flex h-7 w-9 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">L{i + 1}</div>
              <div className="flex-1">
                <Select
                  value={s.roleId}
                  onChange={(v) => setSteps((arr) => arr.map((x, k) => (k === i ? { ...x, roleId: v } : x)))}
                  options={roles.map((r) => ({ value: r.id, label: r.name }))}
                />
              </div>
              <div className="flex items-center gap-1">
                <TextInput
                  type="number"
                  value={s.hrs}
                  onChange={(e) => setSteps((arr) => arr.map((x, k) => (k === i ? { ...x, hrs: Number(e.target.value) } : x)))}
                  className="w-20 text-center"
                />
                <span className="text-[11px] text-muted-foreground">hrs</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => move(i, -1)} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent"><ArrowUp size={13} /></button>
                <button onClick={() => move(i, 1)} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent"><ArrowDown size={13} /></button>
                <button onClick={() => setSteps((arr) => arr.filter((_, k) => k !== i))} className="flex h-7 w-7 items-center justify-center rounded text-rose-600 hover:bg-rose-50"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </SetupPage>
  );
}
