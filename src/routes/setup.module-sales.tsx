import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, SettingRow, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";
import { Select } from "@/setup/SetupShell";
import { useState } from "react";

export const Route = createFileRoute("/setup/module-sales")({
  head: () => ({ meta: [{ title: "Sales Settings — Logicon" }] }),
  component: () => (
    <ModuleSettingsPage
      title="Sales Settings"
      subtitle="Configure pipeline stages, lead capture, assignment and automations."
      sections={[
        { id: "pipeline", title: "Pipeline Stages", render: () => <ListEditor items={["New","Contacted","Qualified","Proposal Sent","Won","Lost"]} placeholder="Add a pipeline stage" /> },
        { id: "sources", title: "Lead Sources", render: () => <ListEditor items={["Website","Referral","Ads","Cold Call","Event"]} placeholder="Add a lead source" /> },
        { id: "fields", title: "Custom Lead Fields", render: () => <ListEditor items={["Industry","Annual Revenue","Decision Maker"]} placeholder="Add a custom field" /> },
        { id: "assignment", title: "Assignment Rules", render: () => <AssignmentPanel /> },
        { id: "targets", title: "Sales Targets", render: () => (
          <div>
            <InputRow label="Default monthly target" defaultValue="500000" suffix="INR" />
            <InputRow label="Quarterly target" defaultValue="1500000" suffix="INR" />
            <ToggleRow label="Team-based targets" hint="Aggregate individual targets at team level" defaultChecked />
          </div>
        )},
        { id: "loss", title: "Client Loss Reasons", render: () => <ListEditor items={["Pricing","Lost to Competitor","No Response","Budget Cut","Bad Fit"]} placeholder="Add a loss reason" /> },
        { id: "automation", title: "Automation Rules", render: () => (
          <div>
            <ToggleRow label="Auto follow-up emails" hint="Send reminder if no activity for 3 days" defaultChecked />
            <ToggleRow label="Notify manager on stage change" defaultChecked />
            <ToggleRow label="Auto-convert qualified leads" hint="Move to Client Onboarding automatically" />
          </div>
        )},
      ]}
    />
  ),
});

function AssignmentPanel() {
  const [mode, setMode] = useState("round-robin");
  return (
    <div>
      <SettingRow label="Assignment mode">
        <div className="w-56">
          <Select value={mode} onChange={setMode} options={[
            { value: "manual", label: "Manual" },
            { value: "round-robin", label: "Round-Robin" },
            { value: "load-based", label: "Load-Based" },
            { value: "region", label: "By Region" },
          ]}/>
        </div>
      </SettingRow>
      <ToggleRow label="Reassign on inactivity" hint="If lead idle for 5 days" defaultChecked />
      <ToggleRow label="Manager override" hint="Allow managers to reassign any lead" defaultChecked />
    </div>
  );
}
