import { ReactNode, useState } from "react";
import { SetupPage, Toggle } from "@/setup/SetupShell";
import { cn } from "@/lib/utils";
import { ChevronRight, Settings2 } from "lucide-react";

export type SettingsSection = {
  id: string;
  title: string;
  description?: string;
  render: () => ReactNode;
};

export function ModuleSettingsPage({
  title,
  subtitle,
  sections,
}: {
  title: string;
  subtitle?: string;
  sections: SettingsSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <SetupPage title={title} subtitle={subtitle} hideAdd>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        {/* Left rail */}
        <aside className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Settings2 size={14} /> Sections
          </div>
          <nav className="p-2">
            {sections.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "group flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[13px] transition-colors",
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  style={isActive ? { backgroundColor: "var(--primary-soft)" } : undefined}
                >
                  <span className="truncate">{s.title}</span>
                  <ChevronRight
                    size={14}
                    className={cn(
                      "shrink-0 transition-transform",
                      isActive ? "text-primary" : "text-muted-foreground/60",
                    )}
                  />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right panel */}
        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-[15px] font-semibold text-foreground">{current?.title}</h2>
            {current?.description && (
              <p className="mt-0.5 text-[12px] text-muted-foreground">{current.description}</p>
            )}
          </div>
          <div className="px-6 py-5">{current?.render()}</div>
        </section>
      </div>
    </SetupPage>
  );
}

export function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-border py-4 last:border-0">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-foreground">{label}</div>
        {hint && <div className="mt-0.5 text-[12px] text-muted-foreground">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function ListEditor({
  items,
  placeholder = "Add item",
  onChange,
}: {
  items: string[];
  placeholder?: string;
  onChange?: (items: string[]) => void;
}) {
  const [list, setList] = useState(items);
  const [val, setVal] = useState("");

  const update = (next: string[]) => {
    setList(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-2">
      <ul className="space-y-1.5">
        {list.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-[13px]"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-[11px] font-semibold text-muted-foreground">
                {i + 1}
              </span>
              {item}
            </span>
            <button
              onClick={() => update(list.filter((_, idx) => idx !== i))}
              className="text-[12px] text-muted-foreground hover:text-rose-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
        <button
          onClick={() => {
            if (!val.trim()) return;
            update([...list, val.trim()]);
            setVal("");
          }}
          className="h-9 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:opacity-95"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export function ToggleRow({
  label,
  hint,
  defaultChecked = false,
}: {
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  const [v, setV] = useState(defaultChecked);
  return (
    <SettingRow label={label} hint={hint}>
      <Toggle checked={v} onChange={setV} />
    </SettingRow>
  );
}

export function InputRow({
  label,
  hint,
  defaultValue = "",
  suffix,
  type = "text",
}: {
  label: string;
  hint?: string;
  defaultValue?: string;
  suffix?: string;
  type?: string;
}) {
  return (
    <SettingRow label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <input
          type={type}
          defaultValue={defaultValue}
          className="h-9 w-44 rounded-md border border-border bg-background px-3 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
        {suffix && <span className="text-[12px] text-muted-foreground">{suffix}</span>}
      </div>
    </SettingRow>
  );
}
