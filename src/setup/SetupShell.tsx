import { ReactNode, useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Plus, Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SetupPage({
  title,
  subtitle,
  onAdd,
  addLabel = "Add New",
  search,
  onSearch,
  filters,
  children,
  hideAdd,
}: {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
  search?: string;
  onSearch?: (v: string) => void;
  filters?: ReactNode;
  children: ReactNode;
  hideAdd?: boolean;
}) {
  return (
    <AppLayout>
      <div className="px-8 py-7">
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight size={14} />
          <span>Setup</span>
          <ChevronRight size={14} />
          <span className="font-medium text-foreground">{title}</span>
        </nav>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {!hideAdd && (
            <div className="flex items-center gap-2">
              {filters}
              {onAdd && (
                <button
                  onClick={onAdd}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:opacity-95"
                >
                  <Plus size={14} />
                  {addLabel}
                </button>
              )}
            </div>
          )}
        </div>

        {(onSearch !== undefined || filters) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {onSearch !== undefined && (
              <div className="relative w-full max-w-sm">
                <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search ?? ""}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search…"
                  className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-5">{children}</div>
      </div>
    </AppLayout>
  );
}

export function StatusPill({ active, label }: { active: boolean; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-50 text-slate-600 ring-slate-200",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
      {label ?? (active ? "Active" : "Inactive")}
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  size = "md",
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  size?: "sm" | "md";
}) {
  const w = size === "sm" ? "w-8 h-4" : "w-9 h-5";
  const dot = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const tx = size === "sm" ? (checked ? "translate-x-4" : "translate-x-0.5") : (checked ? "translate-x-4" : "translate-x-0.5");
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors",
        w,
        checked ? "bg-primary" : "bg-slate-300",
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "inline-block transform rounded-full bg-white shadow transition-transform",
          dot,
          tx,
        )}
      />
    </button>
  );
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty = "No data available",
}: {
  columns: { key: string; header: string; render: (row: T) => ReactNode; className?: string; align?: "left" | "right" | "center" }[];
  rows: T[];
  empty?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-5 py-3",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center text-sm text-muted-foreground">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-5 py-3.5 align-middle",
                        c.align === "right" && "text-right",
                        c.align === "center" && "text-center",
                      )}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 0 && (
        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[12px] text-muted-foreground">
          <span>Showing {rows.length} {rows.length === 1 ? "record" : "records"}</span>
          <div className="flex items-center gap-1">
            <button className="h-7 rounded-md border border-border px-2.5 hover:bg-accent">Previous</button>
            <button className="h-7 rounded-md border border-border px-2.5 hover:bg-accent">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function RowActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={onEdit}
        className="h-7 rounded-md border border-border bg-background px-2 text-[12px] font-medium text-foreground hover:bg-accent"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="h-7 rounded-md border border-border bg-background px-2 text-[12px] font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-200"
      >
        Delete
      </button>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-background shadow-2xl transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-secondary/30 px-6 py-3">
          <button
            onClick={onClose}
            className="h-9 rounded-md border border-border bg-background px-4 text-[13px] font-medium text-foreground hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit?.();
              onClose();
            }}
            className="h-9 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:opacity-95"
          >
            {submitLabel}
          </button>
        </div>
      </aside>
    </div>
  );
}

export function FieldSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function Field({
  label,
  required,
  hint,
  error,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <div className="mb-1.5 text-[12px] font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </div>
      {children}
      {error ? (
        <div className="mt-1 text-[11px] text-rose-600">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
      ) : null}
    </label>
  );
}

const inputCls =
  "h-9 w-full rounded-md border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
        props.className,
      )}
    />
  );
}

export function Select({
  options,
  placeholder = "Select…",
  value,
  onChange,
  disabled,
}: {
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn(inputCls, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236B7280%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:14px] bg-[position:right_10px_center] bg-no-repeat pr-8 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted-foreground")}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-secondary px-2.5 text-[12px] text-foreground">
      {label}
      <button onClick={onClear} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>
    </span>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5">
      <Filter size={14} className="text-muted-foreground" />
      {children}
    </div>
  );
}

// Tiny helper to provide local state for drawers
export function useDrawer<T = unknown>() {
  const [state, setState] = useState<{ open: boolean; data?: T }>({ open: false });
  return {
    open: state.open,
    data: state.data,
    show: (data?: T) => setState({ open: true, data }),
    hide: () => setState({ open: false }),
  };
}
