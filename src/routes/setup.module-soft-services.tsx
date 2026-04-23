import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";

export const Route = createFileRoute("/setup/module-soft-services")({
  head: () => ({ meta: [{ title: "Soft Services Settings — Logicon" }] }),
  component: () => (
    <ModuleSettingsPage
      title="Soft Services Settings"
      subtitle="Categories, scheduling, checklists and automated task generation."
      sections={[
        { id: "categories", title: "Service Categories", render: () => <ListEditor items={["Cleaning","Security","Pest Control","Landscaping","Waste Management"]} placeholder="Add service category" /> },
        { id: "schedule", title: "Scheduling Rules", render: () => (
          <div>
            <ToggleRow label="Daily generation" hint="Create tasks each day at 06:00" defaultChecked />
            <ToggleRow label="Weekly recurrence" defaultChecked />
            <ToggleRow label="Monthly deep-clean" defaultChecked />
            <InputRow label="Default lead time" defaultValue="2" suffix="hrs" />
          </div>
        )},
        { id: "checklists", title: "Task Checklists", render: () => <ListEditor items={["Lobby Cleaning","Restroom Sanitization","Glass Cleaning","Floor Mopping","Trash Disposal"]} placeholder="Add checklist item" /> },
        { id: "validation", title: "Validation Rules", render: () => (
          <div>
            <ToggleRow label="Photo proof required" hint="Worker uploads before/after photos" defaultChecked />
            <ToggleRow label="Geo-tagged completion" defaultChecked />
            <ToggleRow label="Supervisor sign-off" />
          </div>
        )},
      ]}
    />
  ),
});
