import { createFileRoute } from "@tanstack/react-router";
import { SetupPage } from "@/setup/SetupShell";
import { accessLevels, roles, deptName, roleName } from "@/setup/data";
import { Building2, Map, Building, Users as UsersIcon, User } from "lucide-react";

export const Route = createFileRoute("/setup/access-level")({
  head: () => ({ meta: [{ title: "Access Level Setup — Logicon" }] }),
  component: AccessLevelPage,
});

const META: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; desc: string }> = {
  Corporate: { icon: Building2, desc: "Full visibility across all organizations, regions and sites." },
  Region: { icon: Map, desc: "Limited to assigned region(s) and all sites within." },
  Site: { icon: Building, desc: "Limited to one or more specific sites." },
  Department: { icon: UsersIcon, desc: "Limited to one department across all locations." },
  Self: { icon: User, desc: "User can only see and act on their own records." },
};

function AccessLevelPage() {
  return (
    <SetupPage title="Access Level Setup" subtitle="Reference taxonomy used by Roles and the Permission Matrix." hideAdd>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accessLevels.map((lvl) => {
          const Icon = META[lvl].icon;
          const usingRoles = roles.filter((r) => r.scope === lvl);
          return (
            <div key={lvl} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--primary-soft)] text-primary"><Icon size={18} /></div>
                <div>
                  <div className="text-[15px] font-semibold text-foreground">{lvl}</div>
                  <p className="mt-1 text-[12px] text-muted-foreground">{META[lvl].desc}</p>
                </div>
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Roles using this scope</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {usingRoles.length === 0 ? <span className="text-[12px] text-muted-foreground">No roles assigned</span> :
                    usingRoles.map((r) => (
                      <span key={r.id} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-foreground">
                        {roleName(r.id)} <span className="text-muted-foreground">· {deptName(r.deptId)}</span>
                      </span>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SetupPage>
  );
}
