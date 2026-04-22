import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  SetupPage,
  DataTable,
  RowActions,
  StatusPill,
  Toggle,
  Drawer,
  FieldSection,
  Field,
  TextInput,
  Select,
  TextArea,
  useDrawer,
} from "@/setup/SetupShell";
import { Tabs, TabPanel } from "@/setup/Tabs";
import {
  organizations,
  businessUnits,
  regions,
  sites,
  departments,
  designations,
  users,
  orgName,
  buName,
  regionName,
  deptName,
  userName,
} from "@/setup/data";

export const Route = createFileRoute("/setup/organization-structure")({
  head: () => ({ meta: [{ title: "Organization & Structure — Logicon" }] }),
  component: OrgStructurePage,
});

const TABS = [
  { value: "org", label: "Organization", count: organizations.length },
  { value: "bu", label: "Business Unit", count: businessUnits.length },
  { value: "region", label: "Region", count: regions.length },
  { value: "site", label: "Site / Property", count: sites.length },
  { value: "dept", label: "Department", count: departments.length },
  { value: "desig", label: "Designation", count: designations.length },
];

function OrgStructurePage() {
  const [tab, setTab] = useState("org");
  const [search, setSearch] = useState("");
  const drawer = useDrawer<{ mode: "add" | "edit"; row?: any }>();

  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));
  const orgOptions = organizations.map((o) => ({ value: o.id, label: o.name }));
  const buOptions = businessUnits.map((b) => ({ value: b.id, label: b.name }));
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));
  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));

  const addLabel = useMemo(() => {
    const t = TABS.find((x) => x.value === tab);
    return `Add ${t?.label}`;
  }, [tab]);

  return (
    <SetupPage
      title="Organization & Structure"
      subtitle="Manage your organizational hierarchy: Organization → Business Unit → Region → Site → Department → Designation."
      onAdd={() => drawer.show({ mode: "add" })}
      addLabel={addLabel}
      search={search}
      onSearch={setSearch}
    >
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      <TabPanel>
        {tab === "org" && (
          <DataTable
            rows={organizations.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))}
            columns={[
              { key: "name", header: "Organization", render: (r) => <div className="font-medium text-foreground">{r.name}</div> },
              { key: "code", header: "Code", render: (r) => <span className="text-muted-foreground">{r.code}</span> },
              { key: "country", header: "Country", render: (r) => r.country },
              { key: "currency", header: "Currency", render: (r) => r.currency },
              { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
              { key: "actions", header: "", align: "right", render: (r) => <RowActions onEdit={() => drawer.show({ mode: "edit", row: r })} /> },
            ]}
          />
        )}
        {tab === "bu" && (
          <DataTable
            rows={businessUnits.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))}
            columns={[
              { key: "name", header: "Business Unit", render: (r) => <div className="font-medium text-foreground">{r.name}</div> },
              { key: "code", header: "Code", render: (r) => r.code },
              { key: "org", header: "Organization", render: (r) => orgName(r.orgId) },
              { key: "head", header: "Head of Unit", render: (r) => userName(r.headId) },
              { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
              { key: "actions", header: "", align: "right", render: (r) => <RowActions onEdit={() => drawer.show({ mode: "edit", row: r })} /> },
            ]}
          />
        )}
        {tab === "region" && (
          <DataTable
            rows={regions.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))}
            columns={[
              { key: "name", header: "Region", render: (r) => <div className="font-medium text-foreground">{r.name}</div> },
              { key: "code", header: "Code", render: (r) => r.code },
              { key: "bu", header: "Business Unit", render: (r) => buName(r.buId) },
              { key: "head", header: "Regional Head", render: (r) => userName(r.headId) },
              { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
              { key: "actions", header: "", align: "right", render: (r) => <RowActions onEdit={() => drawer.show({ mode: "edit", row: r })} /> },
            ]}
          />
        )}
        {tab === "site" && (
          <DataTable
            rows={sites.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))}
            columns={[
              { key: "name", header: "Site", render: (r) => <div className="font-medium text-foreground">{r.name}</div> },
              { key: "code", header: "Code", render: (r) => r.code },
              { key: "type", header: "Type", render: (r) => <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">{r.type}</span> },
              { key: "region", header: "Region", render: (r) => regionName(r.regionId) },
              { key: "address", header: "Address", render: (r) => <span className="text-muted-foreground">{r.address}</span> },
              { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
              { key: "actions", header: "", align: "right", render: (r) => <RowActions onEdit={() => drawer.show({ mode: "edit", row: r })} /> },
            ]}
          />
        )}
        {tab === "dept" && (
          <DataTable
            rows={departments.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))}
            columns={[
              { key: "name", header: "Department", render: (r) => <div className="font-medium text-foreground">{r.name}</div> },
              { key: "code", header: "Code", render: (r) => r.code },
              { key: "bu", header: "Business Unit", render: (r) => buName(r.buId) },
              { key: "head", header: "Department Head", render: (r) => userName(r.headId) },
              { key: "modules", header: "Default Modules", render: (r) => <span className="text-muted-foreground">{r.modules.length} module(s)</span> },
              { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
              { key: "actions", header: "", align: "right", render: (r) => <RowActions onEdit={() => drawer.show({ mode: "edit", row: r })} /> },
            ]}
          />
        )}
        {tab === "desig" && (
          <DataTable
            rows={designations.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))}
            columns={[
              { key: "name", header: "Designation", render: (r) => <div className="font-medium text-foreground">{r.name}</div> },
              { key: "dept", header: "Department", render: (r) => deptName(r.deptId) },
              { key: "level", header: "Level", render: (r) => <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-[12px] font-semibold">{r.level}</span> },
              { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
              { key: "actions", header: "", align: "right", render: (r) => <RowActions onEdit={() => drawer.show({ mode: "edit", row: r })} /> },
            ]}
          />
        )}
      </TabPanel>

      <Drawer
        open={drawer.open}
        onClose={drawer.hide}
        title={`${drawer.data?.mode === "edit" ? "Edit" : "New"} ${TABS.find((t) => t.value === tab)?.label}`}
        description="Fill in the details below. Required fields are marked."
      >
        {tab === "org" && (
          <FieldSection title="Organization Details">
            <Field label="Organization Name" required><TextInput placeholder="e.g. Logicon Holdings" /></Field>
            <Field label="Code" required hint="Unique short code"><TextInput placeholder="LCN" /></Field>
            <Field label="Legal Entity Name" full><TextInput placeholder="Logicon Holdings Pvt. Ltd." /></Field>
            <Field label="Country" required><Select options={[{ value: "IN", label: "India" }, { value: "US", label: "United States" }, { value: "DE", label: "Germany" }]} /></Field>
            <Field label="Timezone"><Select options={[{ value: "Asia/Kolkata", label: "Asia/Kolkata" }, { value: "America/New_York", label: "America/New_York" }, { value: "Europe/Berlin", label: "Europe/Berlin" }]} /></Field>
            <Field label="Currency"><Select options={[{ value: "INR", label: "INR ₹" }, { value: "USD", label: "USD $" }, { value: "EUR", label: "EUR €" }]} /></Field>
            <Field label="Status"><Toggle checked onChange={() => {}} /></Field>
          </FieldSection>
        )}
        {tab === "bu" && (
          <FieldSection title="Business Unit Details">
            <Field label="Business Unit Name" required><TextInput placeholder="e.g. Facility Services" /></Field>
            <Field label="Code" required><TextInput placeholder="FS" /></Field>
            <Field label="Organization" required full><Select options={orgOptions} /></Field>
            <Field label="Head of Unit" full><Select options={userOptions} /></Field>
            <Field label="Status"><Toggle checked onChange={() => {}} /></Field>
          </FieldSection>
        )}
        {tab === "region" && (
          <FieldSection title="Region Details">
            <Field label="Region Name" required><TextInput placeholder="e.g. North" /></Field>
            <Field label="Code" required><TextInput placeholder="N" /></Field>
            <Field label="Business Unit" required full><Select options={buOptions} /></Field>
            <Field label="Regional Head" full><Select options={userOptions} /></Field>
            <Field label="Status"><Toggle checked onChange={() => {}} /></Field>
          </FieldSection>
        )}
        {tab === "site" && (
          <>
            <FieldSection title="Site Information">
              <Field label="Site Name" required><TextInput placeholder="e.g. Gurugram HQ" /></Field>
              <Field label="Code" required><TextInput placeholder="GGN" /></Field>
              <Field label="Region" required><Select options={regionOptions} /></Field>
              <Field label="Site Type" required><Select options={[{ value: "Office", label: "Office" }, { value: "Warehouse", label: "Warehouse" }, { value: "Plant", label: "Plant" }]} /></Field>
              <Field label="Address" full><TextArea placeholder="Full site address" /></Field>
            </FieldSection>
            <FieldSection title="Site Managers">
              <Field label="Property Manager"><Select options={userOptions} /></Field>
              <Field label="Technical Manager"><Select options={userOptions} /></Field>
              <Field label="Status"><Toggle checked onChange={() => {}} /></Field>
            </FieldSection>
          </>
        )}
        {tab === "dept" && (
          <FieldSection title="Department Details">
            <Field label="Department Name" required><TextInput placeholder="e.g. Operations" /></Field>
            <Field label="Code" required><TextInput placeholder="OPS" /></Field>
            <Field label="Business Unit" required full><Select options={buOptions} /></Field>
            <Field label="Department Head" full><Select options={userOptions} /></Field>
            <Field label="Status"><Toggle checked onChange={() => {}} /></Field>
          </FieldSection>
        )}
        {tab === "desig" && (
          <FieldSection title="Designation Details">
            <Field label="Designation Name" required><TextInput placeholder="e.g. Manager" /></Field>
            <Field label="Department" required><Select options={deptOptions} /></Field>
            <Field label="Level" required hint="Higher = more senior"><TextInput type="number" placeholder="4" /></Field>
            <Field label="Status"><Toggle checked onChange={() => {}} /></Field>
          </FieldSection>
        )}
      </Drawer>
    </SetupPage>
  );
}
