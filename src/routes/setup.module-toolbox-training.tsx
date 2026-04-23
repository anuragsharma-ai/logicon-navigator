import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";

export const Route = createFileRoute("/setup/module-toolbox-training")({
  head: () => ({ meta: [{ title: "Toolbox Training Settings — Logicon" }] }),
  component: () => (
    <ModuleSettingsPage
      title="Toolbox Training Settings"
      subtitle="Training catalog, skill levels, schedules and completion tracking."
      sections={[
        { id: "categories", title: "Training Categories", render: () => <ListEditor items={["Safety","Compliance","Technical","Soft Skills","Onboarding"]} placeholder="Add category" /> },
        { id: "modules", title: "Training Modules", render: () => <ListEditor items={["Fire Safety Basics","Working at Height","Electrical Safety","First Aid","Customer Communication"]} placeholder="Add module" /> },
        { id: "skills", title: "Skill Levels", render: () => <ListEditor items={["Beginner","Intermediate","Advanced","Expert","Trainer"]} placeholder="Add skill level" /> },
        { id: "certification", title: "Certification Rules", render: () => (
          <div>
            <InputRow label="Pass percentage" defaultValue="80" suffix="%" />
            <InputRow label="Certification validity" defaultValue="12" suffix="months" />
            <ToggleRow label="Auto-issue certificate on pass" defaultChecked />
            <ToggleRow label="Mandatory re-certification reminder" defaultChecked />
          </div>
        )},
        { id: "schedule", title: "Schedules & Batches", render: () => (
          <div>
            <InputRow label="Default batch size" defaultValue="20" suffix="trainees" />
            <InputRow label="Session duration" defaultValue="60" suffix="min" />
            <ToggleRow label="Allow self-enrolment" defaultChecked />
          </div>
        )},
        { id: "tracking", title: "Completion Tracking", render: () => (
          <div>
            <ToggleRow label="Email weekly compliance reports" defaultChecked />
            <ToggleRow label="Block role assignment if mandatory training pending" />
          </div>
        )},
      ]}
    />
  ),
});
