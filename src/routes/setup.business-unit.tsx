import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, Select, useDrawer } from "@/setup/SetupShell";
import { businessUnits as seed, organizations, users, orgName, userName } from "@/setup/data";

export const Route = createFileRoute("/setup/business-unit")({
  head: () => ({ meta: [{ title: "Business Unit Setup — Logicon" }] }),
  component: BUPage,
});

function BUPage() {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const filtered = useMemo(() => rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const openNew = () => { setForm({ id: `bu-${Date.now()}`, name: "", code: "", orgId: organizations[0].id, headId: users[0].id, status: true }); drawer.show(); };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  return (
    <SetupPage
      title="Business Unit Setup"
      subtitle="Business units belong to an Organization and parent Regions."
      onAdd={openNew}
      addLabel="Add Business Unit"
      search={search}
      onSearch={setSearch}
    >
      <DataTable
        rows={filtered}
        columns={[
          { key: "name", header: "Business Unit", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
          { key: "code", header: "Code", render: (r) => <span className="font-mono text-[12px]">{r.code}</span> },
          { key: "org", header: "Organization", render: (r) => orgName(r.orgId) },
          { key: "head", header: "Head of Unit", render: (r) => userName(r.headId) },
          { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
          { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
        ]}
      />
      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit Business Unit" : "New Business Unit"} onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Identity">
              <Field label="Business Unit Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Code" required><TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></Field>
            </FieldSection>
            <FieldSection title="Hierarchy">
              <Field label="Organization" required hint="Filters Region master"><Select value={form.orgId} onChange={(v) => setForm({ ...form, orgId: v })} options={organizations.map((o) => ({ value: o.id, label: o.name }))} /></Field>
              <Field label="Head of Unit"><Select value={form.headId} onChange={(v) => setForm({ ...form, headId: v })} options={users.map((u) => ({ value: u.id, label: u.name }))} /></Field>
            </FieldSection>
            <FieldSection title="Status"><Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field></FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
