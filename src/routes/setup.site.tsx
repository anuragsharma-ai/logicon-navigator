import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, TextArea, Select, useDrawer } from "@/setup/SetupShell";
import { sites as seed, regions, businessUnits, users, regionName, userName, buName } from "@/setup/data";

export const Route = createFileRoute("/setup/site")({
  head: () => ({ meta: [{ title: "Site / Property Master — Logicon" }] }),
  component: SitePage,
});

const SITE_TYPES = ["Office", "Warehouse", "Plant"];

function SitePage() {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  // Auto-fill BU from region (read-only display)
  const formBuId = form ? regions.find((r) => r.id === form.regionId)?.buId : undefined;

  const filtered = useMemo(() => rows.filter((r) => {
    if (regionFilter && r.regionId !== regionFilter) return false;
    return `${r.name} ${r.code} ${r.address}`.toLowerCase().includes(search.toLowerCase());
  }), [rows, search, regionFilter]);

  const openNew = () => { setForm({ id: `st-${Date.now()}`, name: "", code: "", regionId: regions[0].id, address: "", type: "Office", pmId: users[0].id, tmId: users[0].id, status: true }); drawer.show(); };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  return (
    <SetupPage
      title="Site / Property Master"
      subtitle="Physical sites belonging to a Region. Used in User and Permission scoping."
      onAdd={openNew}
      addLabel="Add Site"
      search={search}
      onSearch={setSearch}
      filters={
        <div className="w-56">
          <Select value={regionFilter} placeholder="All Regions" onChange={setRegionFilter}
            options={[{ value: "", label: "All Regions" }, ...regions.map((r) => ({ value: r.id, label: r.name }))]} />
        </div>
      }
    >
      <DataTable
        rows={filtered}
        columns={[
          { key: "name", header: "Site", render: (r) => <div><div className="font-medium text-foreground">{r.name}</div><div className="text-[12px] text-muted-foreground">{r.address}</div></div> },
          { key: "code", header: "Code", render: (r) => <span className="font-mono text-[12px]">{r.code}</span> },
          { key: "region", header: "Region", render: (r) => regionName(r.regionId) },
          { key: "bu", header: "Business Unit", render: (r) => { const bu = regions.find((rg) => rg.id === r.regionId)?.buId; return bu ? buName(bu) : "—"; } },
          { key: "type", header: "Type", render: (r) => <span className="rounded-md bg-secondary px-2 py-0.5 text-[12px]">{r.type}</span> },
          { key: "pm", header: "Property Mgr", render: (r) => userName(r.pmId) },
          { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
          { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
        ]}
      />
      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit Site" : "New Site"} onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Identity">
              <Field label="Site Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Code" required><TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></Field>
              <Field label="Address" full><TextArea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
              <Field label="Site Type" required><Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={SITE_TYPES.map((s) => ({ value: s, label: s }))} /></Field>
            </FieldSection>
            <FieldSection title="Hierarchy">
              <Field label="Region" required><Select value={form.regionId} onChange={(v) => setForm({ ...form, regionId: v })} options={regions.map((r) => ({ value: r.id, label: r.name }))} /></Field>
              <Field label="Business Unit" hint="Auto-filled from Region"><TextInput value={formBuId ? buName(formBuId) : ""} disabled /></Field>
            </FieldSection>
            <FieldSection title="Management">
              <Field label="Property Manager"><Select value={form.pmId} onChange={(v) => setForm({ ...form, pmId: v })} options={users.map((u) => ({ value: u.id, label: u.name }))} /></Field>
              <Field label="Technical Manager"><Select value={form.tmId} onChange={(v) => setForm({ ...form, tmId: v })} options={users.map((u) => ({ value: u.id, label: u.name }))} /></Field>
            </FieldSection>
            <FieldSection title="Status"><Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field></FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
