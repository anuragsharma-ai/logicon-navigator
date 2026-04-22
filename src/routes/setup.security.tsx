import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SetupPage, FieldSection, Field, TextInput, Select, Toggle } from "@/setup/SetupShell";
import { Tabs, TabPanel } from "@/setup/Tabs";
import { roles, accessLevels } from "@/setup/data";
import { Building2, Globe2, MapPin, Users, User, ShieldCheck, KeyRound, Lock, Save } from "lucide-react";

export const Route = createFileRoute("/setup/security")({
  head: () => ({ meta: [{ title: "Security & Access — Logicon" }] }),
  component: SecurityPage,
});

const TABS = [
  { value: "auth", label: "Authentication" },
  { value: "levels", label: "Access Levels" },
];

const ICONS: Record<string, any> = { Corporate: Building2, Region: Globe2, Site: MapPin, Department: Users, Self: User };

const DESCRIPTIONS: Record<string, string> = {
  Corporate: "Full access across the entire organization and all business units.",
  Region: "Access limited to assigned region(s) and all sites within them.",
  Site: "Access limited to assigned site(s) only.",
  Department: "Access limited to records from assigned department.",
  Self: "Access limited to user's own records only.",
};

function SecurityPage() {
  const [tab, setTab] = useState("auth");

  return (
    <SetupPage
      title="Security & Access"
      subtitle="Configure authentication policies and define access levels used across roles."
      hideAdd
    >
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      <TabPanel>
        {tab === "auth" && (
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <KeyRound size={16} className="text-primary" /> Password Policy
              </div>
              <div className="mt-4">
                <FieldSection title="">
                  <Field label="Minimum Password Length" required><TextInput type="number" defaultValue={10} /></Field>
                  <Field label="Require Special Characters"><Toggle checked onChange={() => {}} /></Field>
                  <Field label="Require Numbers"><Toggle checked onChange={() => {}} /></Field>
                  <Field label="Password Expiry (days)"><TextInput type="number" defaultValue={90} /></Field>
                </FieldSection>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <ShieldCheck size={16} className="text-primary" /> Multi-Factor Authentication
              </div>
              <div className="mt-4">
                <FieldSection title="">
                  <Field label="MFA Required for Roles" full hint="Selected roles must verify with a second factor on every login.">
                    <Select options={roles.map((r) => ({ value: r.id, label: r.name }))} placeholder="Select roles…" />
                  </Field>
                </FieldSection>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <Lock size={16} className="text-primary" /> Session & Network
              </div>
              <div className="mt-4">
                <FieldSection title="">
                  <Field label="Session Timeout (minutes)"><TextInput type="number" defaultValue={30} /></Field>
                  <Field label="Login Attempt Limit"><TextInput type="number" defaultValue={5} /></Field>
                  <Field label="IP Restriction"><Toggle checked={false} onChange={() => {}} /></Field>
                  <Field label="Allowed IPs / CIDR"><TextInput placeholder="10.0.0.0/24, 192.168.1.10" /></Field>
                </FieldSection>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:opacity-95">
                <Save size={14} /> Save Settings
              </button>
            </div>
          </div>
        )}
        {tab === "levels" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accessLevels.map((lvl) => {
              const Icon = ICONS[lvl];
              return (
                <div key={lvl} className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <div className="mt-3 text-[14px] font-semibold text-foreground">{lvl}</div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{DESCRIPTIONS[lvl]}</p>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Used by {roles.filter((r) => r.scope === lvl).length} role(s)
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TabPanel>
    </SetupPage>
  );
}
