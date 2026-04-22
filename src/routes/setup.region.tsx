import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, Select, useDrawer } from "@/setup/SetupShell";
import { regions as seed, businessUnits, organizations, users, buName, userName } from "@/setup/data";

export const Route = createFileRoute("/setup/region")({
  head: () => ({ meta: [{ title: "Region Master — Logicon" }] }),
  component: RegionPage,
});

function RegionPage() {
  const [rows, setRows] = useState(seed);
  const [orgFilter, setOrgFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const filtered = useMemo(() => rows.filter((r) => {
    const bu = businessUnits.find((b) => b.id === r.buId);
    if (orgFilter && bu?.orgId !== orgFilter) return false;
    return r.name.toLowerCase().includes(search.toLowerCase());
  }), [rows, search, orgFilter]);

  const openNew = () => { setForm({ id: `rg-${Date.now()}`, name: "", code: "", buId: businessUnits[0].id, headId: users[0].id, status: true }); drawer.show(); };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  return (
    <SetupPage
      title="Region Master"
      subtitle="Regions belong to a Business Unit and parent Sites."
      onAdd={openNew}
      addLabel="Add Region"
      search={search}
      onSearch={setSearch}
      filters={
        <div className="w-56">
          <Select value={orgFilter} placeholder="All Organizations" onChange={setOrgFilter}
            options={[{ value: "", label: "All Organizations" }, ...organizations.map((o) => ({ value: o.id, label: o.name }))]} />
        </div>
      }
    >
      <DataTable
        rows={filtered}
        columns={[
          { key: "name", header: "Region", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
          { key: "code", header: "Code", render: (r) => <span className="font-mono text-[12px]">{r.code}</span> },
          { key: "bu", header: "Business Unit", render: (r) => buName(r.buId) },
          { key: "head", header: "Regional Head", render: (r) => userName(r.headId) },
          { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
          { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
        ]}
      />
      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit Region" : "New Region"} onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Identity">
              <Field label="Region Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Code" required><TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></Field>
            </FieldSection>
            <FieldSection title="Hierarchy">
              <Field label="Business Unit" required hint="Filters Site master"><Select value={form.buId} onChange={(v) => setForm({ ...form, buId: v })} options={businessUnits.map((b) => ({ value: b.id, label: b.name }))} /></Field>
              <Field label="Regional Head"><Select value={form.headId} onChange={(v) => setForm({ ...form, headId: v })} options={users.map((u) => ({ value: u.id, label: u.name }))} /></Field>
            </FieldSection>
            <FieldSection title="Status"><Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field></FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
