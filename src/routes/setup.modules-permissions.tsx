import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SetupPage, Toggle, Select } from "@/setup/SetupShell";
import {
  roles,
  modules,
  permissionActions,
  dataScopes,
  permissionMatrix as initial,
  departments,
} from "@/setup/data";
import { ChevronDown, ChevronRight, Eye, Save, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/setup/modules-permissions")({
  head: () => ({ meta: [{ title: "Modules & Permissions — Logicon" }] }),
  component: ModulesPermissionsPage,
});

function ModulesPermissionsPage() {
  const [roleId, setRoleId] = useState(roles[0].id);
  const [matrix, setMatrix] = useState<Record<string, Record<string, Record<string, boolean>>>>(initial);
  const [visible, setVisible] = useState<Record<string, Record<string, boolean>>>({});
  const [scope, setScope] = useState<Record<string, string>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ "mod-1": true });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const map: Record<string, typeof modules> = {};
    modules.forEach((m) => {
      const dept = departments.find((d) => d.id === m.deptId)?.name ?? "General";
      (map[dept] ??= []).push(m);
    });
    return map;
  }, []);

  const get = (mid: string, action: string) => matrix[roleId]?.[mid]?.[action] ?? false;
  const set = (mid: string, action: string, val: boolean) =>
    setMatrix((m) => ({
      ...m,
      [roleId]: { ...(m[roleId] ?? {}), [mid]: { ...((m[roleId] ?? {})[mid] ?? {}), [action]: val } },
    }));

  const isVisible = (mid: string) => visible[roleId]?.[mid] ?? modules.find((m) => m.id === mid)?.visible ?? false;
  const setVis = (mid: string, val: boolean) =>
    setVisible((v) => ({ ...v, [roleId]: { ...(v[roleId] ?? {}), [mid]: val } }));

  const selectAllForGroup = (mods: typeof modules, val: boolean) => {
    setMatrix((m) => {
      const next = { ...m, [roleId]: { ...(m[roleId] ?? {}) } };
      mods.forEach((mod) => {
        next[roleId][mod.id] = Object.fromEntries(permissionActions.map((a) => [a, val]));
      });
      return next;
    });
  };

  const role = roles.find((r) => r.id === roleId)!;

  return (
    <SetupPage
      title="Modules & Permissions"
      subtitle="Control sidebar visibility and granular actions per role. Users inherit permissions from their assigned role."
      hideAdd
    >
      {/* Role selector card */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Configuring permissions for</div>
            <div className="mt-0.5 flex items-center gap-2">
              <div className="w-64">
                <Select value={roleId} onChange={setRoleId} options={roles.map((r) => ({ value: r.id, label: r.name }))} />
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{role.scope} scope</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[13px] font-medium hover:bg-accent">
            <Eye size={14} /> Preview as Role
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:opacity-95">
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="sticky left-0 z-10 bg-secondary/50 px-5 py-3 min-w-[260px]">Module</th>
                <th className="px-3 py-3 text-center">Visible</th>
                {permissionActions.map((a) => (
                  <th key={a} className="px-3 py-3 text-center">{a}</th>
                ))}
                <th className="px-5 py-3">Data Scope</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([groupName, mods]) => {
                const isOpen = !collapsed[groupName];
                return (
                  <>
                    <tr key={`g-${groupName}`} className="border-b border-border bg-secondary/30">
                      <td colSpan={2 + permissionActions.length + 1} className="px-5 py-2.5">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setCollapsed((c) => ({ ...c, [groupName]: isOpen }))}
                            className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-foreground hover:text-primary"
                          >
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            {groupName}
                            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{mods.length}</span>
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => selectAllForGroup(mods, true)}
                              className="h-7 rounded-md border border-border bg-background px-2 text-[11px] font-medium hover:bg-accent"
                            >
                              Select All
                            </button>
                            <button
                              onClick={() => selectAllForGroup(mods, false)}
                              className="h-7 rounded-md border border-border bg-background px-2 text-[11px] font-medium hover:bg-accent"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {isOpen && mods.map((m) => (
                      <tr key={m.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                        <td className="sticky left-0 z-10 bg-card px-5 py-3 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setFavorites((f) => ({ ...f, [m.id]: !f[m.id] }))}
                              className={cn("text-muted-foreground hover:text-primary", favorites[m.id] && "text-primary")}
                              title="Pin to favorites"
                            >
                              <Star size={14} fill={favorites[m.id] ? "currentColor" : "none"} />
                            </button>
                            {m.name}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex justify-center">
                            <Toggle size="sm" checked={isVisible(m.id)} onChange={(v) => setVis(m.id, v)} />
                          </div>
                        </td>
                        {permissionActions.map((a) => (
                          <td key={a} className="px-3 py-3 text-center">
                            <div className="flex justify-center">
                              <Toggle size="sm" checked={get(m.id, a)} onChange={(v) => set(m.id, a, v)} />
                            </div>
                          </td>
                        ))}
                        <td className="px-5 py-3">
                          <div className="w-32">
                            <Select value={scope[m.id] ?? "All"} onChange={(v) => setScope((s) => ({ ...s, [m.id]: v }))} options={dataScopes.map((d) => ({ value: d, label: d }))} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 mt-5 flex items-center justify-between rounded-lg border border-border bg-card/95 px-5 py-3 shadow-lg backdrop-blur">
        <div className="text-[12px] text-muted-foreground">
          Changes apply to all users assigned to <span className="font-semibold text-foreground">{role.name}</span>.
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 rounded-md border border-border bg-background px-3 text-[13px] font-medium hover:bg-accent">Discard</button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:opacity-95">
            <Save size={14} /> Save Permissions
          </button>
        </div>
      </div>
    </SetupPage>
  );
}
