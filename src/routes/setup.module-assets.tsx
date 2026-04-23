import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, SettingRow, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";
import { Select } from "@/setup/SetupShell";
import { useState } from "react";

export const Route = createFileRoute("/setup/module-assets")({
  head: () => ({ meta: [{ title: "Assets Settings — Logicon" }] }),
  component: AssetsPage,
});

function AssetsPage() {
  return (
    <ModuleSettingsPage
      title="Assets Settings"
      subtitle="Asset taxonomy, lifecycle, depreciation and maintenance scheduling."
      sections={[
        { id: "categories", title: "Asset Categories", render: () => <ListEditor items={["IT Equipment","Furniture","Vehicles","Machinery","Real Estate"]} placeholder="Add category" /> },
        { id: "lifecycle", title: "Lifecycle Rules", render: () => <ListEditor items={["Procurement","In Use","Under Maintenance","Idle","Disposed"]} placeholder="Add lifecycle stage" /> },
        { id: "depreciation", title: "Depreciation", render: () => <DepreciationPanel /> },
        { id: "allocation", title: "Allocation & Transfer", render: () => (
          <div>
            <ToggleRow label="Allow inter-site transfer" defaultChecked />
            <ToggleRow label="Manager approval for transfers" defaultChecked />
            <ToggleRow label="Track custodian history" defaultChecked />
          </div>
        )},
        { id: "maintenance", title: "Maintenance Scheduling", render: () => (
          <div>
            <InputRow label="Default service interval" defaultValue="90" suffix="days" />
            <InputRow label="Reminder lead time" defaultValue="7" suffix="days" />
            <ToggleRow label="Auto-create work orders" defaultChecked />
          </div>
        )},
      ]}
    />
  );
}

function DepreciationPanel() {
  const [method, setMethod] = useState("straight-line");
  return (
    <div>
      <SettingRow label="Default method">
        <div className="w-56">
          <Select value={method} onChange={setMethod} options={[
            { value: "straight-line", label: "Straight Line" },
            { value: "declining", label: "Declining Balance" },
            { value: "units", label: "Units of Production" },
            { value: "sum-of-years", label: "Sum of Years" },
          ]}/>
        </div>
      </SettingRow>
      <InputRow label="Default useful life" defaultValue="5" suffix="years" />
      <InputRow label="Salvage value" defaultValue="5" suffix="%" />
    </div>
  );
}
