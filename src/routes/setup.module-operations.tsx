import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";

export const Route = createFileRoute("/setup/module-operations")({
  head: () => ({ meta: [{ title: "Operations Settings — Logicon" }] }),
  component: () => (
    <ModuleSettingsPage
      title="Operations Settings"
      subtitle="Service types, work orders, SLAs, and escalation rules."
      sections={[
        { id: "services", title: "Service Types", render: () => <ListEditor items={["Installation","Maintenance","Repair","Inspection","Audit"]} placeholder="Add service type" /> },
        { id: "tasks", title: "Task Categories", render: () => <ListEditor items={["Preventive","Corrective","Routine","Emergency"]} placeholder="Add task category" /> },
        { id: "templates", title: "Work Order Templates", render: () => <ListEditor items={["Standard WO","Emergency WO","Inspection WO"]} placeholder="Add template" /> },
        { id: "sla", title: "SLA Definitions", render: () => (
          <div>
            <InputRow label="Critical — Response" defaultValue="15" suffix="min" />
            <InputRow label="Critical — Resolution" defaultValue="4" suffix="hrs" />
            <InputRow label="High — Response" defaultValue="1" suffix="hr" />
            <InputRow label="High — Resolution" defaultValue="8" suffix="hrs" />
            <InputRow label="Standard — Resolution" defaultValue="48" suffix="hrs" />
          </div>
        )},
        { id: "escalation", title: "Escalation Matrix", render: () => (
          <div>
            <InputRow label="Level 1 escalation after" defaultValue="2" suffix="hrs" />
            <InputRow label="Level 2 escalation after" defaultValue="6" suffix="hrs" />
            <InputRow label="Level 3 escalation after" defaultValue="12" suffix="hrs" />
            <ToggleRow label="Auto-escalate breached SLAs" defaultChecked />
          </div>
        )},
        { id: "workflow", title: "Task Workflow", render: () => <ListEditor items={["Assigned","In Progress","On Hold","Completed","Verified","Closed"]} placeholder="Add workflow stage" /> },
      ]}
    />
  ),
});
