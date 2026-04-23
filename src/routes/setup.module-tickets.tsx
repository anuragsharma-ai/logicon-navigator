import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, SettingRow, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";
import { Select } from "@/setup/SetupShell";
import { useState } from "react";

export const Route = createFileRoute("/setup/module-tickets")({
  head: () => ({ meta: [{ title: "Tickets Settings — Logicon" }] }),
  component: TicketsPage,
});

function TicketsPage() {
  return (
    <ModuleSettingsPage
      title="Tickets Settings"
      subtitle="Categories, priorities, SLAs, auto-assignment and notifications."
      sections={[
        { id: "categories", title: "Ticket Categories", render: () => <ListEditor items={["Incident","Service Request","Change","Problem","Feedback"]} placeholder="Add category" /> },
        { id: "priorities", title: "Priority Levels", render: () => <ListEditor items={["P1 — Critical","P2 — High","P3 — Medium","P4 — Low"]} placeholder="Add priority" /> },
        { id: "sla", title: "SLA & Escalation", render: () => (
          <div>
            <InputRow label="P1 — Resolution" defaultValue="4" suffix="hrs" />
            <InputRow label="P2 — Resolution" defaultValue="8" suffix="hrs" />
            <InputRow label="P3 — Resolution" defaultValue="24" suffix="hrs" />
            <InputRow label="P4 — Resolution" defaultValue="72" suffix="hrs" />
            <ToggleRow label="Escalate breached tickets" defaultChecked />
          </div>
        )},
        { id: "assign", title: "Auto-Assignment", render: () => <AssignPanel /> },
        { id: "notify", title: "Notifications", render: () => (
          <div>
            <ToggleRow label="Notify requester on status change" defaultChecked />
            <ToggleRow label="Notify assignee on new comment" defaultChecked />
            <ToggleRow label="Daily SLA breach digest to managers" defaultChecked />
          </div>
        )},
      ]}
    />
  );
}

function AssignPanel() {
  const [m, setM] = useState("category");
  return (
    <div>
      <SettingRow label="Routing mode">
        <div className="w-56">
          <Select value={m} onChange={setM} options={[
            { value: "category", label: "By Category" },
            { value: "round-robin", label: "Round-Robin" },
            { value: "load-based", label: "Least-loaded Agent" },
            { value: "skill", label: "Skill-based" },
          ]}/>
        </div>
      </SettingRow>
      <ToggleRow label="Reassign on agent unavailable" defaultChecked />
      <ToggleRow label="Allow self-pickup from queue" defaultChecked />
    </div>
  );
}
