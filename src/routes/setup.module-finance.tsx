import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, SettingRow, ToggleRow, InputRow, ListEditor } from "@/setup/ModuleSettings";

export const Route = createFileRoute("/setup/module-finance")({
  head: () => ({ meta: [{ title: "Finance Settings — Logicon" }] }),
  component: () => (
    <ModuleSettingsPage
      title="Finance Settings"
      subtitle="Invoice formats, billing, taxes, payments and approval workflows."
      sections={[
        { id: "invoice", title: "Invoice Templates", render: () => (
          <div>
            <InputRow label="Invoice number prefix" defaultValue="INV-" />
            <InputRow label="Starting sequence" defaultValue="1001" />
            <ToggleRow label="Reset numbering yearly" defaultChecked />
            <SettingRow label="Default template" hint="Used when issuing new invoices">
              <button className="h-9 rounded-md border border-border bg-background px-3 text-[13px] font-medium hover:bg-accent">Edit template</button>
            </SettingRow>
          </div>
        )},
        { id: "billing", title: "Billing Cycles", render: () => <ListEditor items={["Monthly","Quarterly","Annual","One-time"]} placeholder="Add billing cycle" /> },
        { id: "tax", title: "Tax Configuration", render: () => (
          <div>
            <InputRow label="Default GST rate" defaultValue="18" suffix="%" />
            <InputRow label="VAT (EU)" defaultValue="20" suffix="%" />
            <ToggleRow label="Region-based tax rules" hint="Pick rate from billing address" defaultChecked />
            <ToggleRow label="Reverse charge for exports" />
          </div>
        )},
        { id: "payments", title: "Payment Methods", render: () => <ListEditor items={["Bank Transfer","Stripe","Razorpay","Cheque","UPI"]} placeholder="Add payment method" /> },
        { id: "budget", title: "Budget Categories", render: () => <ListEditor items={["Operating Expenses","Marketing","Travel","Software","Capex"]} placeholder="Add budget category" /> },
        { id: "approvals", title: "Financial Approvals", render: () => (
          <div>
            <InputRow label="Approval required above" defaultValue="50000" suffix="INR" />
            <InputRow label="Director approval above" defaultValue="500000" suffix="INR" />
            <ToggleRow label="Dual approval for vendor payments" defaultChecked />
          </div>
        )},
      ]}
    />
  ),
});
