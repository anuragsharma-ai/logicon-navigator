import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SetupPage, Toggle, Select } from "@/setup/SetupShell";
import { roles, modules, permissionActions, dataScopes, permissionMatrix as initial } from "@/setup/data";

export const Route = createFileRoute("/setup/permission-matrix")({
  head: () => ({ meta: [{ title: "Permission Matrix — Logicon" }] }),
  component: PermissionMatrixPage,
});

function PermissionMatrixPage() {
  const [roleId, setRoleId] = useState(roles[0].id);
  const [matrix, setMatrix] = useState<Record<string, Record<string, Record<string, boolean>>>>(initial);
  const [scope, setScope] = useState<Record<string, string>>({});

  const get = (mid: string, action: string) => matrix[roleId]?.[mid]?.[action] ?? false;
  const set = (mid: string, action: string, val: boolean) =>
    setMatrix((m) => ({
      ...m,
      [roleId]: { ...(m[roleId] ?? {}), [mid]: { ...((m[roleId] ?? {})[mid] ?? {}), [action]: val } },
    }));

  return (
    <SetupPage
      title="Permission Matrix"
      subtitle="Toggle granular access per Role × Module × Action. Roles inherit to Users."
      hideAdd
      filters={
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-muted-foreground">Role</span>
          <div className="w-56"><Select value={roleId} onChange={setRoleId} options={roles.map((r) => ({ value: r.id, label: r.name }))} /></div>
        </div>
      }
    >
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="sticky left-0 z-10 bg-secondary/50 px-5 py-3">Module</th>
                {permissionActions.map((a) => (<th key={a} className="px-3 py-3 text-center">{a}</th>))}
                <th className="px-5 py-3">Data Scope</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="sticky left-0 z-10 bg-card px-5 py-3.5 font-medium text-foreground">{m.name}</td>
                  {permissionActions.map((a) => (
                    <td key={a} className="px-3 py-3.5 text-center">
                      <div className="flex justify-center"><Toggle size="sm" checked={get(m.id, a)} onChange={(v) => set(m.id, a, v)} /></div>
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="w-32"><Select value={scope[m.id] ?? "All"} onChange={(v) => setScope((s) => ({ ...s, [m.id]: v }))} options={dataScopes.map((d) => ({ value: d, label: d }))} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SetupPage>
  );
}
