import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, DataTable, RowActions, StatusPill, Toggle, Drawer, FieldSection, Field, TextInput, Select, useDrawer } from "@/setup/SetupShell";
import { users as seed, departments, designations, roles, regions, sites, deptName, designationName, roleName, regionName, siteName, userName } from "@/setup/data";

export const Route = createFileRoute("/setup/user")({
  head: () => ({ meta: [{ title: "User Master — Logicon" }] }),
  component: UserPage,
});

function UserPage() {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState("");
  const drawer = useDrawer();
  const [form, setForm] = useState<typeof seed[number] | null>(null);

  const filtered = useMemo(() => rows.filter((r) => `${r.name} ${r.email} ${r.empId}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  const openNew = () => {
    setForm({ id: `u-${Date.now()}`, name: "", empId: "", email: "", mobile: "", deptId: departments[0].id, designationId: designations[0].id, roleId: roles[0].id, regionId: regions[0].id, siteId: sites[0].id, managerId: null, mfa: false, status: true });
    drawer.show();
  };
  const openEdit = (r: typeof seed[number]) => { setForm(r); drawer.show(); };
  const save = () => { if (!form) return; setRows((rs) => rs.find((x) => x.id === form.id) ? rs.map((x) => x.id === form.id ? form : x) : [form, ...rs]); };

  // Dependent dropdowns
  const filteredDesignations = form ? designations.filter((d) => d.deptId === form.deptId) : [];
  const filteredRoles = form ? roles.filter((r) => r.deptId === form.deptId) : [];
  const filteredSites = form ? sites.filter((s) => s.regionId === form.regionId) : [];

  return (
    <SetupPage title="User Master" subtitle="Each user inherits permissions from a Role and is scoped to a Region/Site." onAdd={openNew} addLabel="Add User" search={search} onSearch={setSearch}>
      <DataTable rows={filtered} columns={[
        { key: "name", header: "User", render: (r) => (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">{r.name.split(" ").map((s) => s[0]).slice(0,2).join("")}</div>
            <div><div className="font-medium text-foreground">{r.name}</div><div className="text-[11px] text-muted-foreground">{r.email}</div></div>
          </div>
        ) },
        { key: "emp", header: "Emp ID", render: (r) => <span className="font-mono text-[12px]">{r.empId}</span> },
        { key: "dept", header: "Department", render: (r) => deptName(r.deptId) },
        { key: "role", header: "Role", render: (r) => roleName(r.roleId) },
        { key: "region", header: "Region", render: (r) => regionName(r.regionId) },
        { key: "site", header: "Site", render: (r) => siteName(r.siteId) },
        { key: "mgr", header: "Manager", render: (r) => <span className="text-muted-foreground">{userName(r.managerId)}</span> },
        { key: "mfa", header: "MFA", render: (r) => <StatusPill active={r.mfa} label={r.mfa ? "On" : "Off"} /> },
        { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
        { key: "actions", header: "Actions", align: "right", render: (r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} /> },
      ]} />
      <Drawer open={drawer.open} onClose={drawer.hide} title={form?.name ? "Edit User" : "New User"} description="Department filters Designation & Role. Region filters Site." onSubmit={save}>
        {form && (
          <>
            <FieldSection title="Profile">
              <Field label="Full Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Employee ID" required><TextInput value={form.empId} onChange={(e) => setForm({ ...form, empId: e.target.value.toUpperCase() })} /></Field>
              <Field label="Email" required><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Mobile"><TextInput value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></Field>
            </FieldSection>
            <FieldSection title="Organization">
              <Field label="Department" required><Select value={form.deptId} onChange={(v) => setForm({ ...form, deptId: v, designationId: designations.find((d) => d.deptId === v)?.id ?? "", roleId: roles.find((r) => r.deptId === v)?.id ?? "" })} options={departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
              <Field label="Designation" required hint="Filtered by Department"><Select value={form.designationId} onChange={(v) => setForm({ ...form, designationId: v })} options={filteredDesignations.map((d) => ({ value: d.id, label: d.name }))} /></Field>
              <Field label="Role" required hint="Filtered by Department"><Select value={form.roleId} onChange={(v) => setForm({ ...form, roleId: v })} options={filteredRoles.map((r) => ({ value: r.id, label: r.name }))} /></Field>
              <Field label="Reporting Manager"><Select value={form.managerId ?? ""} onChange={(v) => setForm({ ...form, managerId: v || null })} options={[{ value: "", label: "— None —" }, ...rows.filter((u) => u.id !== form.id).map((u) => ({ value: u.id, label: u.name }))]} /></Field>
            </FieldSection>
            <FieldSection title="Location">
              <Field label="Region" required><Select value={form.regionId} onChange={(v) => setForm({ ...form, regionId: v, siteId: sites.find((s) => s.regionId === v)?.id ?? "" })} options={regions.map((r) => ({ value: r.id, label: r.name }))} /></Field>
              <Field label="Site" required hint="Filtered by Region"><Select value={form.siteId} onChange={(v) => setForm({ ...form, siteId: v })} options={filteredSites.map((s) => ({ value: s.id, label: s.name }))} /></Field>
            </FieldSection>
            <FieldSection title="Security">
              <Field label="MFA Enabled"><div className="flex h-9 items-center"><Toggle checked={form.mfa} onChange={(v) => setForm({ ...form, mfa: v })} /></div></Field>
              <Field label="Active"><div className="flex h-9 items-center"><Toggle checked={form.status} onChange={(v) => setForm({ ...form, status: v })} /></div></Field>
            </FieldSection>
          </>
        )}
      </Drawer>
    </SetupPage>
  );
}
