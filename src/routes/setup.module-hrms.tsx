import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, SettingRow, ToggleRow, ListEditor } from "@/setup/ModuleSettings";

export const Route = createFileRoute("/setup/module-hrms")({
  head: () => ({ meta: [{ title: "HRMS Settings — Logicon" }] }),
  component: () => (
    <ModuleSettingsPage
      title="HRMS Settings"
      subtitle="Lifecycle workflows, performance, policies and self-service config."
      sections={[
        { id: "onboarding", title: "Onboarding Workflow", render: () => <ListEditor items={["Offer Accepted","Documents Verified","ID Issued","Asset Allocated","Induction Complete","Active"]} placeholder="Add onboarding stage" /> },
        { id: "exit", title: "Exit Workflow", render: () => <ListEditor items={["Resignation Submitted","Manager Approval","Knowledge Transfer","Asset Returned","FnF Settled","Relieved"]} placeholder="Add exit stage" /> },
        { id: "performance", title: "Performance Management", render: () => (
          <div>
            <SettingRow label="Review cycle"><span className="text-[13px]">Half-yearly · Apr · Oct</span></SettingRow>
            <ToggleRow label="360-degree feedback" defaultChecked />
            <ToggleRow label="Self-appraisal mandatory" defaultChecked />
            <ToggleRow label="Calibration round" hint="Cross-manager calibration before publishing" defaultChecked />
          </div>
        )},
        { id: "kpis", title: "KPIs & Goals", render: () => <ListEditor items={["Revenue Achieved","Customer NPS","Project On-time %","Quality Score","Training Hours"]} placeholder="Add KPI" /> },
        { id: "policies", title: "Policy Management", render: () => <ListEditor items={["Code of Conduct","Leave Policy","Travel Policy","Anti-Harassment","Information Security"]} placeholder="Add policy" /> },
        { id: "ess", title: "Employee Self-Service", render: () => (
          <div>
            <ToggleRow label="Allow profile updates" defaultChecked />
            <ToggleRow label="Allow leave applications" defaultChecked />
            <ToggleRow label="Allow payslip download" defaultChecked />
            <ToggleRow label="Allow expense claims" defaultChecked />
          </div>
        )},
      ]}
    />
  ),
});
