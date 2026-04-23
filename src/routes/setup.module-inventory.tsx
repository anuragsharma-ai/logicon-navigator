import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";

export const Route = createFileRoute("/setup/module-inventory")({
  head: () => ({ meta: [{ title: "Inventory Settings — Logicon" }] }),
  component: () => (
    <ModuleSettingsPage
      title="Inventory Settings"
      subtitle="Items, units, stock thresholds, warehouses and movement rules."
      sections={[
        { id: "items", title: "Item Categories", render: () => <ListEditor items={["Raw Materials","Finished Goods","Spares","Consumables","Packaging"]} placeholder="Add category" /> },
        { id: "uom", title: "Units of Measurement", render: () => <ListEditor items={["Each","Box","Kilogram","Litre","Metre","Pallet"]} placeholder="Add UoM" /> },
        { id: "thresholds", title: "Stock Thresholds", render: () => (
          <div>
            <InputRow label="Low-stock %" defaultValue="20" suffix="%" />
            <InputRow label="Reorder lead time" defaultValue="7" suffix="days" />
            <ToggleRow label="Auto-generate purchase requests" defaultChecked />
            <ToggleRow label="Email alert on stock-out" defaultChecked />
          </div>
        )},
        { id: "warehouses", title: "Warehouses & Locations", render: () => <ListEditor items={["Mumbai DC","Delhi DC","Bangalore Hub","Chennai Port"]} placeholder="Add warehouse" /> },
        { id: "movement", title: "Movement & Approval Rules", render: () => (
          <div>
            <ToggleRow label="Approval for inter-warehouse transfer" defaultChecked />
            <ToggleRow label="Batch & expiry tracking" defaultChecked />
            <ToggleRow label="Serial number tracking" />
            <InputRow label="Cycle count frequency" defaultValue="30" suffix="days" />
          </div>
        )},
      ]}
    />
  ),
});
