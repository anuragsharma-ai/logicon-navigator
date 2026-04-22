import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, HelpCircle, Search } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-background px-6">
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              placeholder="Search anything…"
              className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
              <HelpCircle size={18} />
            </button>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[12px] font-semibold text-primary">
              AD
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-secondary/40">{children}</main>
      </div>
    </div>
  );
}
