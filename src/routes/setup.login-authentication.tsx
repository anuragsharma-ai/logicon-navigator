import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SetupPage, FieldSection, Field, TextInput, Toggle } from "@/setup/SetupShell";
import { roles } from "@/setup/data";

export const Route = createFileRoute("/setup/login-authentication")({
  head: () => ({ meta: [{ title: "Login & Authentication — Logicon" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [minLen, setMinLen] = useState(10);
  const [requireSpecial, setRequireSpecial] = useState(true);
  const [mfaRoles, setMfaRoles] = useState<string[]>(["rl-2", "rl-3", "rl-4"]);
  const [sessionMin, setSessionMin] = useState(30);
  const [attempts, setAttempts] = useState(5);
  const [ipRestrict, setIpRestrict] = useState(false);
  const [allowList, setAllowList] = useState("10.0.0.0/24");

  const toggleMfaRole = (id: string) => setMfaRoles((m) => m.includes(id) ? m.filter((x) => x !== id) : [...m, id]);

  return (
    <SetupPage title="Login & Authentication" subtitle="Global authentication and security policies." hideAdd>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <FieldSection title="Password Policy">
              <Field label="Minimum length" required hint="Recommended: 10+"><TextInput type="number" min={6} max={64} value={minLen} onChange={(e) => setMinLen(Number(e.target.value))} /></Field>
              <Field label="Require special characters"><div className="flex h-9 items-center"><Toggle checked={requireSpecial} onChange={setRequireSpecial} /></div></Field>
            </FieldSection>
            <FieldSection title="Sessions">
              <Field label="Session timeout (minutes)" required><TextInput type="number" value={sessionMin} onChange={(e) => setSessionMin(Number(e.target.value))} /></Field>
              <Field label="Login attempt limit" required hint="Account locks after N failed attempts"><TextInput type="number" value={attempts} onChange={(e) => setAttempts(Number(e.target.value))} /></Field>
            </FieldSection>
            <FieldSection title="Network">
              <Field label="IP restriction"><div className="flex h-9 items-center"><Toggle checked={ipRestrict} onChange={setIpRestrict} /></div></Field>
              <Field label="Allow-list (CIDR)" full><TextInput value={allowList} disabled={!ipRestrict} onChange={(e) => setAllowList(e.target.value)} placeholder="10.0.0.0/24, 192.168.1.0/24" /></Field>
            </FieldSection>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">MFA Required Roles</div>
            <p className="mb-3 text-[12px] text-muted-foreground">Users in these roles must complete MFA on every login.</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => {
                const on = mfaRoles.includes(r.id);
                return (
                  <button key={r.id} type="button" onClick={() => toggleMfaRole(r.id)}
                    className={`h-8 rounded-md border px-3 text-[12px] font-medium ${on ? "border-primary bg-[var(--primary-soft)] text-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent"}`}>
                    {r.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:opacity-95">Save Policy</button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Current policy summary</div>
            <ul className="mt-3 space-y-2 text-[13px] text-foreground">
              <li>• Password ≥ <span className="font-semibold">{minLen}</span> chars{requireSpecial && ", with special chars"}</li>
              <li>• Session timeout: <span className="font-semibold">{sessionMin} min</span></li>
              <li>• Lockout after <span className="font-semibold">{attempts}</span> attempts</li>
              <li>• MFA enforced on <span className="font-semibold">{mfaRoles.length}</span> roles</li>
              <li>• IP restriction: <span className="font-semibold">{ipRestrict ? "On" : "Off"}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </SetupPage>
  );
}
