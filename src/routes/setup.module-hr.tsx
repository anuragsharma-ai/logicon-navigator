import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";

export const Route = createFileRoute("/setup/module-hr")({
  head: () => ({ meta: [{ title: "HR Settings — Logicon" }] }),
  component: () => (
    <ModuleSettingsPage
      title="HR Settings"
      subtitle="Org structure, leave, attendance, payroll and contract types."
      sections={[
        { id: "designations", title: "Designations", render: () => <ListEditor items={["Executive","Senior Executive","Manager","Senior Manager","Director","VP"]} placeholder="Add designation" /> },
        { id: "departments", title: "Departments", render: () => <ListEditor items={["Operations","Finance","HR","Sales","IT","Marketing"]} placeholder="Add department" /> },
        { id: "leave", title: "Leave Policies", render: () => (
          <div>
            <InputRow label="Annual leaves" defaultValue="18" suffix="days" />
            <InputRow label="Sick leaves" defaultValue="10" suffix="days" />
            <InputRow label="Casual leaves" defaultValue="6" suffix="days" />
            <ToggleRow label="Allow carry forward" hint="Up to 10 days to next year" defaultChecked />
            <ToggleRow label="Encashment on exit" defaultChecked />
          </div>
        )},
        { id: "attendance", title: "Attendance Rules", render: () => (
          <div>
            <InputRow label="Standard work hours" defaultValue="8" suffix="hrs" />
            <InputRow label="Late grace period" defaultValue="15" suffix="min" />
            <ToggleRow label="Track overtime" defaultChecked />
            <ToggleRow label="Geo-restricted check-in" hint="Only allow check-in from assigned site" />
          </div>
        )},
        { id: "payroll", title: "Payroll Structure", render: () => <ListEditor items={["Basic","HRA","Special Allowance","PF","Professional Tax","TDS"]} placeholder="Add salary component" /> },
        { id: "contracts", title: "Contract Types", render: () => <ListEditor items={["Permanent","Probation","Contract","Intern","Consultant"]} placeholder="Add contract type" /> },
      ]}
    />
  ),
});
