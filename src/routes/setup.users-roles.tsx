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
  useDrawer,
} from "@/setup/SetupShell";
import { Tabs, TabPanel } from "@/setup/Tabs";
import {
  users,
  roles,
  departments,
  designations,
  regions,
  sites,
  reportingStructure,
  deptName,
  designationName,
  roleName,
  regionName,
  siteName,
  userName,
} from "@/setup/data";
import { Copy, Eye } from "lucide-react";

export const Route = createFileRoute("/setup/users-roles")({
  head: () => ({ meta: [{ title: "Users & Roles — Logicon" }] }),
  component: UsersRolesPage,
});

const TABS = [
  { value: "roles", label: "Roles", count: roles.length },
  { value: "users", label: "Users", count: users.length },
  { value: "reporting", label: "Reporting", count: reportingStructure.length },
];

function UsersRolesPage() {
  const [tab, setTab] = useState("roles");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const drawer = useDrawer<{ mode: "add" | "edit"; row?: any }>();

  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));
  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));
  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));

  const filteredDesignations = useMemo(
    () => designations.filter((d) => !deptFilter || d.deptId === deptFilter).map((d) => ({ value: d.id, label: d.name })),
    [deptFilter],
  );
  const filteredRoles = useMemo(
    () => roles.filter((r) => !deptFilter || r.deptId === deptFilter).map((r) => ({ value: r.id, label: r.name })),
    [deptFilter],
  );

  return (
    <SetupPage
      title="Users & Roles"
      subtitle="Manage roles, users, and reporting structure. Roles define permissions, which users inherit."
      onAdd={() => drawer.show({ mode: "add" })}
      addLabel={tab === "roles" ? "Add Role" : tab === "users" ? "Add User" : "Add Mapping"}
      search={search}
      onSearch={setSearch}
    >
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      <TabPanel>
        {tab === "roles" && (
          <DataTable
            rows={roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))}
            columns={[
              { key: "name", header: "Role", render: (r) => (
                <div>
                  <div className="font-medium text-foreground">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.code}</div>
                </div>
              )},
              { key: "dept", header: "Department", render: (r) => deptName(r.deptId) },
              { key: "scope", header: "Access Scope", render: (r) => (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{r.scope}</span>
              )},
              { key: "approve", header: "Can Approve", render: (r) => <Toggle checked={r.approve} onChange={() => {}} size="sm" /> },
              { key: "status", header: "Status", render: (r) => <StatusPill active={r.status} /> },
              { key: "actions", header: "", align: "right", render: (r) => (
                <div className="flex items-center justify-end gap-1">
                  <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-[12px] hover:bg-accent" title="Clone Role">
                    <Copy size={12} /> Clone
                  </button>
                  <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-[12px] hover:bg-accent" title="Preview as Role">
                    <Eye size={12} /> Preview
                  </button>
                  <RowActions onEdit={() => drawer.show({ mode: "edit", row: r })} />
                </div>
              )},
            ]}
          />
        )}
        {tab === "users" && (
          <DataTable
            rows={users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))}
            columns={[
              { key: "name", header: "User", render: (u) => (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                    {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{u.name}</div>
                    <div className="text-[11px] text-muted-foreground">{u.email}</div>
                  </div>
                </div>
              )},
              { key: "empId", header: "Employee ID", render: (u) => <span className="font-mono text-[12px] text-muted-foreground">{u.empId}</span> },
              { key: "dept", header: "Department", render: (u) => deptName(u.deptId) },
              { key: "role", header: "Role", render: (u) => roleName(u.roleId) },
              { key: "site", header: "Site", render: (u) => siteName(u.siteId) },
              { key: "mfa", header: "MFA", render: (u) => <StatusPill active={u.mfa} label={u.mfa ? "On" : "Off"} /> },
              { key: "status", header: "Status", render: (u) => <StatusPill active={u.status} /> },
              { key: "actions", header: "", align: "right", render: (u) => <RowActions onEdit={() => drawer.show({ mode: "edit", row: u })} /> },
            ]}
          />
        )}
        {tab === "reporting" && (
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Org Chart</div>
              <div className="mt-4 flex flex-col items-center gap-4">
                {users.filter((u) => !u.managerId).map((root) => (
                  <OrgNode key={root.id} user={root} />
                ))}
              </div>
            </div>
            <DataTable
              rows={reportingStructure.map((r, i) => ({ id: `rs-${i}`, ...r }))}
              columns={[
                { key: "user", header: "User", render: (r) => <span className="font-medium text-foreground">{userName(r.userId)}</span> },
                { key: "manager", header: "Reporting Manager", render: (r) => userName(r.managerId) },
                { key: "secondary", header: "Secondary Manager", render: (r) => userName(r.secondaryId) },
                { key: "escalation", header: "Escalation Manager", render: (r) => userName(r.escalationId) },
                { key: "actions", header: "", align: "right", render: () => <RowActions onEdit={() => drawer.show({ mode: "edit" })} /> },
              ]}
            />
          </div>
        )}
      </TabPanel>

      <Drawer
        open={drawer.open}
        onClose={drawer.hide}
        title={tab === "roles" ? "New Role" : tab === "users" ? "New User" : "New Mapping"}
        description="Fields are linked to keep your hierarchy consistent."
      >
        {tab === "roles" && (
          <FieldSection title="Role Configuration">
            <Field label="Role Name" required><TextInput placeholder="e.g. Site Manager" /></Field>
            <Field label="Role Code" required><TextInput placeholder="SITE_MGR" /></Field>
            <Field label="Department" required><Select options={deptOptions} /></Field>
            <Field label="Access Scope" required><Select options={["Corporate", "Region", "Site", "Department", "Self"].map((v) => ({ value: v, label: v }))} /></Field>
            <Field label="Dashboard Type"><Select options={[{ value: "Management", label: "Management" }, { value: "Department", label: "Department" }, { value: "Site", label: "Site" }]} /></Field>
            <Field label="Can Manage Users"><Toggle checked onChange={() => {}} /></Field>
            <Field label="Can Approve"><Toggle checked onChange={() => {}} /></Field>
            <Field label="Cross-Department Access"><Toggle checked={false} onChange={() => {}} /></Field>
          </FieldSection>
        )}
        {tab === "users" && (
          <>
            <FieldSection title="Personal Information">
              <Field label="Full Name" required><TextInput placeholder="e.g. Aarav Mehta" /></Field>
              <Field label="Employee ID" required><TextInput placeholder="EMP001" /></Field>
              <Field label="Email" required><TextInput type="email" placeholder="user@logicon.io" /></Field>
              <Field label="Mobile"><TextInput placeholder="+91 98100 00000" /></Field>
            </FieldSection>
            <FieldSection title="Organizational Assignment">
              <Field label="Department" required><Select options={deptOptions} value={deptFilter} onChange={setDeptFilter} /></Field>
              <Field label="Designation" required><Select options={filteredDesignations} disabled={!deptFilter} placeholder={deptFilter ? "Select…" : "Select department first"} /></Field>
              <Field label="Role" required><Select options={filteredRoles} disabled={!deptFilter} placeholder={deptFilter ? "Select…" : "Select department first"} /></Field>
              <Field label="Region" required><Select options={regionOptions} /></Field>
              <Field label="Site"><Select options={sites.map((s) => ({ value: s.id, label: s.name }))} /></Field>
              <Field label="Reporting Manager"><Select options={userOptions} /></Field>
            </FieldSection>
            <FieldSection title="Security">
              <Field label="MFA Enabled"><Toggle checked onChange={() => {}} /></Field>
              <Field label="Status"><Toggle checked onChange={() => {}} /></Field>
            </FieldSection>
          </>
        )}
        {tab === "reporting" && (
          <FieldSection title="Reporting Mapping">
            <Field label="User" required full><Select options={userOptions} /></Field>
            <Field label="Reporting Manager" required><Select options={userOptions} /></Field>
            <Field label="Secondary Manager"><Select options={userOptions} /></Field>
            <Field label="Escalation Manager"><Select options={userOptions} /></Field>
          </FieldSection>
        )}
      </Drawer>
    </SetupPage>
  );
}

function OrgNode({ user }: { user: (typeof users)[number] }) {
  const reports = users.filter((u) => u.managerId === user.id);
  return (
    <div className="flex flex-col items-center">
      <div className="flex min-w-[200px] items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-[12px] font-semibold text-primary">
          {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-foreground">{user.name}</div>
          <div className="truncate text-[11px] text-muted-foreground">{roleName(user.roleId)}</div>
        </div>
      </div>
      {reports.length > 0 && (
        <>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-start gap-5">
            {reports.map((r, i) => (
              <div key={r.id} className="relative flex flex-col items-center">
                {reports.length > 1 && (
                  <div className={`absolute top-0 h-px bg-border ${i === 0 ? "left-1/2 right-0" : i === reports.length - 1 ? "left-0 right-1/2" : "left-0 right-0"}`} />
                )}
                <OrgNode user={r} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
