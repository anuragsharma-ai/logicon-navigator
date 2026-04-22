import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, Select, useDrawer } from "@/setup/SetupShell";
import { organizations as seed } from "@/setup/data";

export const Route = createFileRoute("/setup/organization")({
  head: () => ({ meta: [{ title: "Organization Setup — Logicon" }] }),
  component: OrganizationPage,
});

const COUNTRIES = ["India", "United States", "United Kingdom", "Germany", "Singapore"];
const TIMEZONES = ["Asia/Kolkata", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Singapore"];
const CURRENCIES = ["INR", "USD", "GBP", "EUR", "SGD"];

function OrganizationPage() {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const drawer = useDrawer<typeof seed[number]>();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const filtered = useMemo(
    () => rows.filter((r) => `${r.name} ${r.code}`.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  );

  const openNew = () => {
    setForm({ id: `org-${Date.now()}`, name: "", code: "", legal: "", country: "India", timezone: "Asia/Kolkata", currency: "INR", status: true });
    drawer.show();
  };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => {
    if (!form) return;
    setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]);
  };

  return (
    <SetupPage
      title="Organization Setup"
      subtitle="Top-level legal entities. Organizations are the root of your hierarchy."
      onAdd={openNew}
      addLabel="Add Organization"
      search={search}
      onSearch={setSearch}
    >
      <DataTable
        rows={filtered}
        columns={[
          { key: "name", header: "Organization", render: (r) => <div><div className="font-medium text-foreground">{r.name}</div><div className="text-[12px] text-muted-foreground">{r.legal}</div></div> },
          { key: "code", header: "Code", render: (r) => <span className="font-mono text-[12px]">{r.code}</span> },
          { key: "country", header: "Country", render: (r) => r.country },
          { key: "tz", header: "Timezone", render: (r) => <span className="text-muted-foreground">{r.timezone}</span> },
          { key: "cur", header: "Currency", render: (r) => r.currency },
          { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
          { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
        ]}
      />

      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit Organization" : "New Organization"} description="Configure a legal entity at the top of the hierarchy." onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Identity">
              <Field label="Organization Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Logicon Holdings" /></Field>
              <Field label="Organization Code" required hint="Unique short code"><TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="LCN" /></Field>
              <Field label="Legal Entity Name" full><TextInput value={form.legal} onChange={(e) => setForm({ ...form, legal: e.target.value })} placeholder="Logicon Holdings Pvt. Ltd." /></Field>
            </FieldSection>
            <FieldSection title="Localization">
              <Field label="Country" required><Select value={form.country} onChange={(v) => setForm({ ...form, country: v })} options={COUNTRIES.map((c) => ({ value: c, label: c }))} /></Field>
              <Field label="Timezone" required><Select value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} options={TIMEZONES.map((c) => ({ value: c, label: c }))} /></Field>
              <Field label="Currency" required><Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={CURRENCIES.map((c) => ({ value: c, label: c }))} /></Field>
            </FieldSection>
            <FieldSection title="Status">
              <Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field>
            </FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
