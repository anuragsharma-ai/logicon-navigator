import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  TrendingUp,
  Wallet,
  Settings,
  Users,
  Shield,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logiconLogo from "@/assets/logicon-logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Item = { label: string; to?: string; children?: Item[] };
type Group = {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  to?: string;
  items?: Item[];
};

const businessModules: Group[] = [
  {
    label: "Sales",
    icon: TrendingUp,
    items: [
      { label: "Lead", to: "/sales/lead" },
      { label: "Target vs Achieved", to: "/sales/target-vs-achieved" },
      { label: "Client Loss", to: "/sales/client-loss" },
    ],
  },
  {
    label: "Finance",
    icon: Wallet,
    items: [
      { label: "Client Onboarding", to: "/finance/client-onboarding" },
      { label: "Client Billing", to: "/finance/client-billing" },
      { label: "Expenses", to: "/finance/expenses" },
      { label: "Budget", to: "/finance/budget" },
    ],
  },
  {
    label: "Operations",
    icon: Settings,
    items: [
      { label: "Soft Services" },
      { label: "Audit" },
      { label: "Assets" },
      { label: "Inventory" },
      { label: "Field Sense", to: "/operations/field-sense" },
      { label: "Tickets" },
      { label: "Toolbox Training" },
    ],
  },
  {
    label: "HR",
    icon: Users,
    items: [
      { label: "HRMS", to: "/hr/hrms" },
      { label: "Org Chart" },
      { label: "Gallery" },
    ],
  },
];

const setup: Group = {
  label: "Admin Portal",
  icon: Shield,
  items: [
    { label: "Organization & Structure", to: "/setup/organization-structure" },
    { label: "Users & Roles", to: "/setup/users-roles" },
    { label: "Security & Access", to: "/setup/security" },
    { label: "Modules & Permissions", to: "/setup/modules-permissions" },
    { label: "Workflows & Approvals", to: "/setup/workflows" },
    { label: "Global Configuration" },
      {
        label: "Module Settings",
        children: [
          { label: "Sales", to: "/setup/module-settings/sales" },
          { label: "Finance" },
        { label: "HR" },
        { label: "Operations" },
        { label: "Soft Services" },
        { label: "Assets" },
        { label: "Inventory" },
        { label: "Tickets" },
        { label: "Toolbox Training" },
        { label: "HRMS" },
      ],
    },
    { label: "Audit Logs", to: "/setup/audit-logs" },
  ],
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: SidebarProps) {
  const { location } = useRouterState();
  const path = location.pathname;

  const isActive = (to?: string) => !!to && path === to;
  const groupHasActive = (g: Group) =>
    g.items?.some((i) => isActive(i.to)) ?? false;

  // Open the group containing the active route by default
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    [...businessModules, setup].forEach((g) => {
      if (groupHasActive(g)) init[g.label] = true;
    });
    if (Object.keys(init).length === 0) init["Finance"] = true;
    return init;
  });

  const toggle = (label: string) =>
    setOpen((o) => ({ ...o, [label]: !o[label] }));

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out",
          collapsed ? "w-[68px]" : "w-[240px]",
        )}
      >
        {/* Logo / Header */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-4">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <img
              src={logiconLogo}
              alt="Logicon"
              className="h-8 w-8 shrink-0 rounded-md object-contain"
            />
            {!collapsed && (
              <span className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                Logicon
              </span>
            )}
          </Link>
          <button
            onClick={onToggle}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                placeholder="Search modules…"
                className="h-9 w-full rounded-md border border-sidebar-border bg-background pl-8 pr-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
        )}

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {/* Dashboard */}
          <NavLeaf
            icon={Home}
            label="Dashboard"
            to="/"
            active={isActive("/")}
            collapsed={collapsed}
          />

          {/* Business Modules */}
          {!collapsed && (
            <SectionLabel className="mt-5">Business Modules</SectionLabel>
          )}
          <div className="mt-1 space-y-0.5">
            {businessModules.map((g) => (
              <NavGroup
                key={g.label}
                group={g}
                open={!!open[g.label]}
                onToggle={() => toggle(g.label)}
                collapsed={collapsed}
                isActive={isActive}
                groupActive={groupHasActive(g)}
              />
            ))}
          </div>

          {/* Divider + Setup */}
          <div className="my-4 border-t border-sidebar-border" />
          {!collapsed && <SectionLabel>Admin Portal</SectionLabel>}
          <div className="mt-1">
            <NavGroup
              group={setup}
              open={!!open[setup.label]}
              onToggle={() => toggle(setup.label)}
              collapsed={collapsed}
              isActive={isActive}
              groupActive={groupHasActive(setup)}
            />
          </div>
        </nav>

        {/* Footer user */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[12px] font-semibold text-primary">
              AD
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-foreground">
                  Admin User
                </div>
                <div className="truncate text-[11px] text-muted-foreground">
                  admin@logicon.io
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

function NavLeaf({
  icon: Icon,
  label,
  to,
  active,
  collapsed,
  nested,
}: {
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  label: string;
  to?: string;
  active?: boolean;
  collapsed?: boolean;
  nested?: boolean;
}) {
  const content = (
    <div
      className={cn(
        "group relative flex h-10 items-center gap-3 rounded-md px-3 text-[14px] transition-colors",
        nested && !collapsed && "ml-6 h-9 px-2 text-[13px]",
        active
          ? "bg-[var(--primary-soft,theme(colors.accent))] font-semibold text-foreground"
          : "text-muted-foreground hover:bg-[var(--primary-tint,theme(colors.accent))] hover:text-foreground",
      )}
      style={
        active
          ? { backgroundColor: "var(--primary-soft)" }
          : undefined
      }
    >
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary" />
      )}
      <Icon
        size={18}
        className={cn(
          "shrink-0",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
          nested && "h-1.5 w-1.5",
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </div>
  );

  const wrapped = to ? (
    <Link to={to} className="block">
      {content}
    </Link>
  ) : (
    <button type="button" className="block w-full text-left">
      {content}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{wrapped}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return wrapped;
}

function NavGroup({
  group,
  open,
  onToggle,
  collapsed,
  isActive,
  groupActive,
}: {
  group: Group;
  open: boolean;
  onToggle: () => void;
  collapsed: boolean;
  isActive: (to?: string) => boolean;
  groupActive: boolean;
}) {
  const Icon = group.icon;

  const header = (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group flex h-10 w-full items-center gap-3 rounded-md px-3 text-[14px] transition-colors",
        groupActive
          ? "text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon
        size={18}
        className={cn(
          "shrink-0",
          groupActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left">{group.label}</span>
          <ChevronDown
            size={14}
            className={cn(
              "shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </>
      )}
    </button>
  );

  return (
    <div>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{header}</TooltipTrigger>
          <TooltipContent side="right">{group.label}</TooltipContent>
        </Tooltip>
      ) : (
        header
      )}

      {!collapsed && (
        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0">
            <ul className="ml-[26px] mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
              {group.items?.map((item) => (
                <NavSubItem key={item.label} item={item} isActive={isActive} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function NavSubItem({
  item,
  isActive,
  depth = 0,
}: {
  item: Item;
  isActive: (to?: string) => boolean;
  depth?: number;
}) {
  const hasChildren = !!item.children?.length;
  const childActive = item.children?.some((c) => isActive(c.to)) ?? false;
  const [open, setOpen] = useState(childActive);
  const active = isActive(item.to);

  if (hasChildren) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex h-9 w-full items-center gap-1 rounded-md px-2.5 text-[13px] transition-colors",
            childActive ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="flex-1 truncate text-left">{item.label}</span>
          <ChevronDown
            size={12}
            className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </button>
        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0">
            <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2.5">
              {item.children?.map((c) => (
                <NavSubItem key={c.label} item={c} isActive={isActive} depth={depth + 1} />
              ))}
            </ul>
          </div>
        </div>
      </li>
    );
  }

  const inner = (
    <div
      className={cn(
        "relative flex h-9 items-center rounded-md px-2.5 text-[13px] transition-colors",
        active ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
      style={active ? { backgroundColor: "var(--primary-soft)" } : undefined}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--primary-tint)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLDivElement).style.backgroundColor = "";
      }}
    >
      {active && (
        <span className="absolute -left-[13px] top-1.5 bottom-1.5 w-[2px] rounded-r bg-primary" />
      )}
      <span className="truncate">{item.label}</span>
    </div>
  );

  return (
    <li>
      {item.to ? (
        <Link to={item.to}>{inner}</Link>
      ) : (
        <button type="button" className="block w-full text-left">{inner}</button>
      )}
    </li>
  );
}
