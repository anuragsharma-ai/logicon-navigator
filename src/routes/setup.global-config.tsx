import { createFileRoute } from "@tanstack/react-router";
import { ModuleSettingsPage, SettingRow, ToggleRow, InputRow } from "@/setup/ModuleSettings";
import { Select } from "@/setup/SetupShell";
import { useState } from "react";

export const Route = createFileRoute("/setup/global-config")({
  head: () => ({ meta: [{ title: "Global Configuration — Logicon" }] }),
  component: GlobalConfigPage,
});

function GlobalConfigPage() {
  return (
    <ModuleSettingsPage
      title="Global Configuration"
      subtitle="System-wide preferences applied across all modules and tenants."
      sections={[
        {
          id: "regional",
          title: "Regional & Locale",
          description: "Defaults for timezone, currency, language and number formats.",
          render: () => <RegionalPanel />,
        },
        {
          id: "branding",
          title: "Branding",
          description: "Customize logo, theme colors and product name.",
          render: () => <BrandingPanel />,
        },
        {
          id: "notifications",
          title: "Notifications",
          description: "Channels and triggers for system alerts.",
          render: () => (
            <div>
              <ToggleRow label="Email notifications" hint="Send transactional emails to users" defaultChecked />
              <ToggleRow label="SMS notifications" hint="Critical alerts via SMS" />
              <ToggleRow label="Push notifications" hint="In-app push for mobile users" defaultChecked />
              <ToggleRow label="Daily digest emails" hint="Summary of activity at 09:00 local time" defaultChecked />
            </div>
          ),
        },
        {
          id: "integrations",
          title: "Integrations",
          description: "Connected APIs and third-party services.",
          render: () => (
            <div>
              <SettingRow label="Stripe" hint="Payment processing"><Pill status="Connected" /></SettingRow>
              <SettingRow label="Slack" hint="Channel notifications"><Pill status="Disconnected" /></SettingRow>
              <SettingRow label="Google Workspace" hint="SSO & calendar"><Pill status="Connected" /></SettingRow>
              <SettingRow label="Twilio" hint="SMS gateway"><Pill status="Disconnected" /></SettingRow>
            </div>
          ),
        },
        {
          id: "templates",
          title: "Default Templates",
          description: "Reusable templates for documents and emails.",
          render: () => (
            <div>
              <InputRow label="Invoice prefix" defaultValue="INV-" />
              <InputRow label="Quotation prefix" defaultValue="QT-" />
              <InputRow label="Default email signature" defaultValue="— The Logicon Team" />
            </div>
          ),
        },
      ]}
    />
  );
}

function RegionalPanel() {
  const [tz, setTz] = useState("Asia/Kolkata");
  const [cur, setCur] = useState("INR");
  const [lang, setLang] = useState("en");
  return (
    <div>
      <SettingRow label="Default timezone" hint="Used when a user has no override">
        <div className="w-56">
          <Select value={tz} onChange={setTz} options={[
            { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
            { value: "America/New_York", label: "America/New_York (EST)" },
            { value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
            { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
          ]}/>
        </div>
      </SettingRow>
      <SettingRow label="Default currency" hint="Applied to financial reports">
        <div className="w-56">
          <Select value={cur} onChange={setCur} options={[
            { value: "INR", label: "INR — Indian Rupee" },
            { value: "USD", label: "USD — US Dollar" },
            { value: "EUR", label: "EUR — Euro" },
            { value: "GBP", label: "GBP — Pound Sterling" },
          ]}/>
        </div>
      </SettingRow>
      <SettingRow label="Default language">
        <div className="w-56">
          <Select value={lang} onChange={setLang} options={[
            { value: "en", label: "English" },
            { value: "hi", label: "Hindi" },
            { value: "de", label: "German" },
            { value: "fr", label: "French" },
          ]}/>
        </div>
      </SettingRow>
      <InputRow label="Date format" defaultValue="DD/MM/YYYY" />
      <InputRow label="Number format" defaultValue="1,23,456.78" />
    </div>
  );
}

function BrandingPanel() {
  return (
    <div>
      <InputRow label="Product name" defaultValue="Logicon" />
      <SettingRow label="Logo" hint="Recommended 256×256 PNG">
        <button className="h-9 rounded-md border border-border bg-background px-3 text-[13px] font-medium hover:bg-accent">Upload logo</button>
      </SettingRow>
      <SettingRow label="Primary color" hint="Used for buttons and highlights">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-md border border-border" style={{ backgroundColor: "#FF8A3D" }} />
          <input defaultValue="#FF8A3D" className="h-9 w-32 rounded-md border border-border bg-background px-3 text-[13px]"/>
        </div>
      </SettingRow>
      <ToggleRow label="Enable dark mode" hint="Allow end-users to switch theme" defaultChecked />
    </div>
  );
}

function Pill({ status }: { status: "Connected" | "Disconnected" }) {
  const ok = status === "Connected";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${ok ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-600 ring-slate-200"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}
