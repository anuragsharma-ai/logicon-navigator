import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users,
  CalendarClock,
  MapPin,
  ShieldAlert,
  CalendarDays,
  Plane,
  Wallet,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  Download,
  Search,
  Filter,
  ChevronRight,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  DataTable,
  RowActions,
  Drawer,
  FieldSection,
  Field,
  TextInput,
  TextArea,
  Select,
  useDrawer,
  StatusPill,
} from "@/setup/SetupShell";

export const Route = createFileRoute("/hr/hrms")({
  head: () => ({
    meta: [
      { title: "HRMS — Logicon" },
      {
        name: "description",
        content:
          "Centralized HRMS for employee management, attendance, payroll, tracking and analytics.",
      },
    ],
  }),
  component: HRMSPage,
});

/* ────────────────────────────────────────────────────────────────────── */
/*  Mock data                                                             */
/* ────────────────────────────────────────────────────────────────────── */

type Employee = {
  id: string;
  empId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  role: string;
  region: string;
  site: string;
  manager: string;
  status: "Active" | "Inactive" | "On Leave";
};

const employees: Employee[] = [
  { id: "1", empId: "EMP-1001", name: "Aarav Sharma", email: "aarav@logicon.io", department: "Operations", designation: "Site Supervisor", role: "Manager", region: "North", site: "Tower A", manager: "R. Mehta", status: "Active" },
  { id: "2", empId: "EMP-1002", name: "Diya Kapoor", email: "diya@logicon.io", department: "HR", designation: "HR Executive", role: "HR", region: "West", site: "HQ Mumbai", manager: "S. Iyer", status: "Active" },
  { id: "3", empId: "EMP-1003", name: "Vihaan Patel", email: "vihaan@logicon.io", department: "Sales", designation: "Account Manager", role: "Manager", region: "South", site: "Bangalore Hub", manager: "K. Rao", status: "On Leave" },
  { id: "4", empId: "EMP-1004", name: "Ananya Singh", email: "ananya@logicon.io", department: "Finance", designation: "Accountant", role: "Employee", region: "North", site: "Tower B", manager: "P. Gupta", status: "Active" },
  { id: "5", empId: "EMP-1005", name: "Rohan Verma", email: "rohan@logicon.io", department: "Operations", designation: "Field Engineer", role: "Employee", region: "East", site: "Kolkata Plant", manager: "A. Das", status: "Inactive" },
  { id: "6", empId: "EMP-1006", name: "Isha Reddy", email: "isha@logicon.io", department: "Marketing", designation: "Marketing Lead", role: "Manager", region: "South", site: "Hyderabad Office", manager: "K. Rao", status: "Active" },
];

type Attendance = {
  id: string;
  name: string;
  date: string;
  in: string;
  out: string;
  hours: string;
  status: "Present" | "Absent" | "Late" | "On Leave";
};

const attendance: Attendance[] = [
  { id: "1", name: "Aarav Sharma", date: "2025-04-22", in: "09:02", out: "18:14", hours: "9h 12m", status: "Present" },
  { id: "2", name: "Diya Kapoor", date: "2025-04-22", in: "09:35", out: "18:30", hours: "8h 55m", status: "Late" },
  { id: "3", name: "Vihaan Patel", date: "2025-04-22", in: "—", out: "—", hours: "—", status: "On Leave" },
  { id: "4", name: "Ananya Singh", date: "2025-04-22", in: "08:55", out: "18:05", hours: "9h 10m", status: "Present" },
  { id: "5", name: "Rohan Verma", date: "2025-04-22", in: "—", out: "—", hours: "—", status: "Absent" },
  { id: "6", name: "Isha Reddy", date: "2025-04-22", in: "09:10", out: "18:20", hours: "9h 10m", status: "Present" },
];

type LiveEmp = { id: string; name: string; status: "Active" | "Offline"; site: string; lastSeen: string; x: number; y: number };
const liveEmployees: LiveEmp[] = [
  { id: "1", name: "Aarav Sharma", status: "Active", site: "Tower A", lastSeen: "Just now", x: 28, y: 42 },
  { id: "2", name: "Diya Kapoor", status: "Active", site: "HQ Mumbai", lastSeen: "2 min ago", x: 62, y: 30 },
  { id: "3", name: "Rohan Verma", status: "Offline", site: "Kolkata Plant", lastSeen: "3h ago", x: 48, y: 65 },
  { id: "4", name: "Isha Reddy", status: "Active", site: "Hyderabad Office", lastSeen: "5 min ago", x: 75, y: 55 },
];

type Geo = { id: string; emp: string; loc: string; event: "Entered" | "Exited"; time: string; status: "Normal" | "Breach" };
const geoAlerts: Geo[] = [
  { id: "1", emp: "Aarav Sharma", loc: "Tower A", event: "Entered", time: "09:02", status: "Normal" },
  { id: "2", emp: "Rohan Verma", loc: "Kolkata Plant", event: "Exited", time: "13:45", status: "Breach" },
  { id: "3", emp: "Isha Reddy", loc: "Hyderabad Office", event: "Entered", time: "09:10", status: "Normal" },
];

const shiftTypes = ["M", "M", "E", "M", "N", "O", "O"];
const rosterEmployees = employees.slice(0, 5);

type Leave = { id: string; emp: string; type: string; from: string; to: string; status: "Approved" | "Pending" | "Rejected"; approver: string };
const leaves: Leave[] = [
  { id: "1", emp: "Vihaan Patel", type: "Sick", from: "2025-04-20", to: "2025-04-23", status: "Approved", approver: "K. Rao" },
  { id: "2", emp: "Diya Kapoor", type: "Casual", from: "2025-04-25", to: "2025-04-25", status: "Pending", approver: "S. Iyer" },
  { id: "3", emp: "Rohan Verma", type: "Earned", from: "2025-04-15", to: "2025-04-18", status: "Rejected", approver: "A. Das" },
  { id: "4", emp: "Ananya Singh", type: "Sick", from: "2025-04-28", to: "2025-04-29", status: "Pending", approver: "P. Gupta" },
];

type Pay = { id: string; emp: string; salary: number; deductions: number; net: number; status: "Paid" | "Pending" };
const payroll: Pay[] = [
  { id: "1", emp: "Aarav Sharma", salary: 85000, deductions: 8500, net: 76500, status: "Paid" },
  { id: "2", emp: "Diya Kapoor", salary: 65000, deductions: 6200, net: 58800, status: "Paid" },
  { id: "3", emp: "Vihaan Patel", salary: 95000, deductions: 9500, net: 85500, status: "Pending" },
  { id: "4", emp: "Ananya Singh", salary: 70000, deductions: 7000, net: 63000, status: "Pending" },
  { id: "5", emp: "Isha Reddy", salary: 90000, deductions: 9000, net: 81000, status: "Paid" },
];

const performanceRows = [
  { id: "1", emp: "Aarav Sharma", attendance: "98%", productivity: "92%", late: 1, absent: 0 },
  { id: "2", emp: "Diya Kapoor", attendance: "94%", productivity: "88%", late: 4, absent: 1 },
  { id: "3", emp: "Vihaan Patel", attendance: "82%", productivity: "76%", late: 2, absent: 5 },
  { id: "4", emp: "Ananya Singh", attendance: "97%", productivity: "90%", late: 1, absent: 1 },
  { id: "5", emp: "Isha Reddy", attendance: "95%", productivity: "94%", late: 2, absent: 1 },
];

/* ────────────────────────────────────────────────────────────────────── */
/*  Tab Definitions                                                       */
/* ────────────────────────────────────────────────────────────────────── */

const TABS = [
  { value: "employees", label: "Employee Management", icon: Users },
  { value: "attendance", label: "Attendance Log", icon: CalendarClock },
  { value: "tracking", label: "Live Tracking", icon: MapPin },
  { value: "geofence", label: "Geo-Fence Alerts", icon: ShieldAlert },
  { value: "shifts", label: "Shifts & Roster", icon: CalendarDays },
  { value: "leaves", label: "Leaves", icon: Plane },
  { value: "payroll", label: "Payroll", icon: Wallet },
  { value: "performance", label: "Performance & Analytics", icon: BarChart3 },
  { value: "settings", label: "HR Settings", icon: SettingsIcon },
];

/* ────────────────────────────────────────────────────────────────────── */
/*  Page                                                                  */
/* ────────────────────────────────────────────────────────────────────── */

function HRMSPage() {
  const [tab, setTab] = useState("employees");

  return (
    <AppLayout>
      <div className="px-8 py-7">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight size={14} />
          <span>HR</span>
          <ChevronRight size={14} />
          <span className="font-medium text-foreground">HRMS</span>
        </nav>

        {/* Header */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">HRMS</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Centralized workforce management — employees, attendance, payroll &amp; analytics.
            </p>
          </div>
        </div>

        {/* Top Tabs */}
        <div className="mt-6 border-b border-border">
          <div className="flex flex-wrap items-center gap-0.5 overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.value === tab;
              return (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "relative inline-flex h-11 shrink-0 items-center gap-2 px-4 text-[13px] font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon size={15} className={active ? "text-primary" : ""} />
                  {t.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Panels */}
        <div className="mt-6">
          {tab === "employees" && <EmployeesTab />}
          {tab === "attendance" && <AttendanceTab />}
          {tab === "tracking" && <TrackingTab />}
          {tab === "geofence" && <GeoFenceTab />}
          {tab === "shifts" && <ShiftsTab />}
          {tab === "leaves" && <LeavesTab />}
          {tab === "payroll" && <PayrollTab />}
          {tab === "performance" && <PerformanceTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </AppLayout>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Shared bits                                                           */
/* ────────────────────────────────────────────────────────────────────── */

function KPI({
  label,
  value,
  icon: Icon,
  trend,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: { dir: "up" | "down"; value: string };
  tone?: "default" | "primary" | "success" | "warning" | "danger";
}) {
  const toneCls = {
    default: "bg-secondary text-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-rose-50 text-rose-600",
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-medium text-muted-foreground">{label}</div>
          <div className="mt-1.5 text-[22px] font-semibold tracking-tight text-foreground">
            {value}
          </div>
          {trend && (
            <div
              className={cn(
                "mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-medium",
                trend.dir === "up" ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {trend.dir === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {trend.value}
            </div>
          )}
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-md", toneCls)}>
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}

function PageHeader({
  title,
  actions,
  filters,
}: {
  title: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      {filters && <div className="mt-3 flex flex-wrap items-center gap-2">{filters}</div>}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  icon: Icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:opacity-95"
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  icon: Icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[13px] font-medium text-foreground hover:bg-accent"
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function FilterBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5">
      <Filter size={13} className="text-muted-foreground" />
      {children}
    </div>
  );
}

function MiniSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-7 rounded border-0 bg-transparent text-[12px] text-foreground focus:outline-none"
    >
      <option value="">{placeholder ?? "All"}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-sm">
      <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function Pill({ tone, children }: { tone: "success" | "warning" | "danger" | "info" | "muted"; children: React.ReactNode }) {
  const cls = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
    info: "bg-sky-50 text-sky-700 ring-sky-200",
    muted: "bg-slate-50 text-slate-600 ring-slate-200",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", cls)}>
      {children}
    </span>
  );
}

function statusTone(s: string): "success" | "warning" | "danger" | "info" | "muted" {
  if (["Active", "Approved", "Paid", "Present", "Normal"].includes(s)) return "success";
  if (["Pending", "Late", "On Leave"].includes(s)) return "warning";
  if (["Rejected", "Absent", "Inactive", "Breach"].includes(s)) return "danger";
  return "muted";
}

/* ────────────────────────────────────────────────────────────────────── */
/*  1. Employees                                                          */
/* ────────────────────────────────────────────────────────────────────── */

function EmployeesTab() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const drawer = useDrawer<{ row?: Employee }>();

  const rows = useMemo(
    () =>
      employees.filter(
        (e) =>
          (!search || (e.name + e.empId + e.email).toLowerCase().includes(search.toLowerCase())) &&
          (!dept || e.department === dept),
      ),
    [search, dept],
  );

  return (
    <>
      <PageHeader
        title="Employee Management"
        actions={
          <>
            <GhostButton icon={Download}>Export</GhostButton>
            <PrimaryButton icon={Plus} onClick={() => drawer.show({})}>Add Employee</PrimaryButton>
          </>
        }
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search employees…" />
            <FilterBox>
              <MiniSelect
                placeholder="All Departments"
                options={["Operations", "HR", "Sales", "Finance", "Marketing"]}
                value={dept}
                onChange={setDept}
              />
            </FilterBox>
          </>
        }
      />

      <DataTable<Employee>
        rows={rows}
        columns={[
          { key: "id", header: "Employee ID", render: (r) => <span className="font-mono text-[12px] text-muted-foreground">{r.empId}</span> },
          {
            key: "name",
            header: "Name",
            render: (r) => (
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                  {r.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-medium text-foreground">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.email}</div>
                </div>
              </div>
            ),
          },
          { key: "dept", header: "Department", render: (r) => r.department },
          { key: "desig", header: "Designation", render: (r) => r.designation },
          { key: "role", header: "Role", render: (r) => <Pill tone="info">{r.role}</Pill> },
          { key: "region", header: "Region", render: (r) => `${r.region} • ${r.site}` },
          { key: "mgr", header: "Reporting Mgr.", render: (r) => r.manager },
          {
            key: "status",
            header: "Status",
            render: (r) => <Pill tone={statusTone(r.status)}>{r.status}</Pill>,
          },
          {
            key: "actions",
            header: "",
            align: "right",
            render: () => <RowActions onEdit={() => drawer.show({})} onDelete={() => {}} />,
          },
        ]}
      />

      <Drawer
        open={drawer.open}
        onClose={drawer.hide}
        title="Add Employee"
        description="Create a new workforce record. Department filters Designation; Region filters Site."
        submitLabel="Save Employee"
      >
        <FieldSection title="Personal Info">
          <Field label="Full Name" required><TextInput placeholder="e.g. Aarav Sharma" /></Field>
          <Field label="Employee ID" hint="Leave blank for auto-generation"><TextInput placeholder="EMP-XXXX" /></Field>
          <Field label="Email" required><TextInput type="email" placeholder="name@logicon.io" /></Field>
          <Field label="Mobile"><TextInput placeholder="+91 …" /></Field>
        </FieldSection>

        <FieldSection title="Work Info">
          <Field label="Department" required>
            <Select
              options={[
                { value: "ops", label: "Operations" },
                { value: "hr", label: "HR" },
                { value: "sales", label: "Sales" },
                { value: "finance", label: "Finance" },
              ]}
            />
          </Field>
          <Field label="Designation">
            <Select options={[{ value: "1", label: "Site Supervisor" }, { value: "2", label: "Field Engineer" }]} />
          </Field>
          <Field label="Role (RBAC)">
            <Select options={[{ value: "admin", label: "Admin" }, { value: "manager", label: "Manager" }, { value: "employee", label: "Employee" }]} />
          </Field>
          <Field label="Region">
            <Select options={[{ value: "n", label: "North" }, { value: "s", label: "South" }, { value: "e", label: "East" }, { value: "w", label: "West" }]} />
          </Field>
          <Field label="Site"><Select options={[{ value: "1", label: "Tower A" }, { value: "2", label: "HQ Mumbai" }]} /></Field>
          <Field label="Reporting Manager"><TextInput placeholder="Search manager…" /></Field>
        </FieldSection>

        <FieldSection title="Employment">
          <Field label="Joining Date"><TextInput type="date" /></Field>
          <Field label="Status"><Select options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} /></Field>
        </FieldSection>
      </Drawer>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  2. Attendance                                                         */
/* ────────────────────────────────────────────────────────────────────── */

function AttendanceTab() {
  const [search, setSearch] = useState("");

  return (
    <>
      <PageHeader
        title="Attendance Log"
        actions={
          <>
            <GhostButton icon={Upload}>Bulk Upload</GhostButton>
            <GhostButton icon={Download}>Export</GhostButton>
            <PrimaryButton icon={Plus}>Mark Attendance</PrimaryButton>
          </>
        }
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search employee…" />
            <FilterBox>
              <MiniSelect placeholder="All Departments" options={["Operations", "HR", "Sales", "Finance"]} />
            </FilterBox>
            <FilterBox>
              <MiniSelect placeholder="All Sites" options={["Tower A", "HQ Mumbai", "Bangalore Hub"]} />
            </FilterBox>
            <input type="date" defaultValue="2025-04-22" className="h-9 rounded-md border border-border bg-background px-2.5 text-[13px]" />
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Present" value="124" icon={CheckCircle2} tone="success" trend={{ dir: "up", value: "+3 vs yesterday" }} />
        <KPI label="Absent" value="8" icon={XCircle} tone="danger" />
        <KPI label="Late" value="14" icon={Clock} tone="warning" />
        <KPI label="On Leave" value="6" icon={Plane} tone="primary" />
      </div>

      <DataTable<Attendance>
        rows={attendance}
        columns={[
          { key: "name", header: "Employee", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
          { key: "date", header: "Date", render: (r) => r.date },
          { key: "in", header: "Check-in", render: (r) => r.in },
          { key: "out", header: "Check-out", render: (r) => r.out },
          { key: "h", header: "Working Hours", render: (r) => r.hours },
          { key: "s", header: "Status", render: (r) => <Pill tone={statusTone(r.status)}>{r.status}</Pill> },
          { key: "act", header: "", align: "right", render: () => <RowActions onEdit={() => {}} /> },
        ]}
      />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  3. Live Tracking                                                      */
/* ────────────────────────────────────────────────────────────────────── */

function TrackingTab() {
  const [view, setView] = useState<"live" | "history">("live");
  const [selected, setSelected] = useState<string>(liveEmployees[0].id);

  return (
    <>
      <PageHeader
        title="Live Tracking & Route History"
        actions={
          <>
            <div className="inline-flex rounded-md border border-border bg-background p-0.5">
              {[
                { v: "live", label: "Live" },
                { v: "history", label: "Route History" },
              ].map((t) => (
                <button
                  key={t.v}
                  onClick={() => setView(t.v as "live" | "history")}
                  className={cn(
                    "h-8 rounded px-3 text-[12px] font-medium",
                    view === t.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <GhostButton icon={Download}>Export</GhostButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Map */}
        <div className="relative h-[520px] overflow-hidden rounded-lg border border-border bg-[linear-gradient(135deg,#f1f5f9_0%,#e2e8f0_100%)]">
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Markers */}
          {liveEmployees.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelected(e.id)}
              style={{ left: `${e.x}%`, top: `${e.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              <span
                className={cn(
                  "absolute inset-0 -m-2 rounded-full opacity-50 animate-ping",
                  e.status === "Active" ? "bg-primary" : "bg-slate-400",
                )}
              />
              <span
                className={cn(
                  "relative flex h-7 w-7 items-center justify-center rounded-full text-white shadow-lg ring-2 ring-white",
                  e.status === "Active" ? "bg-primary" : "bg-slate-400",
                )}
              >
                <Navigation size={12} />
              </span>
              <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background opacity-0 group-hover:opacity-100">
                {e.name}
              </span>
            </button>
          ))}
          {view === "history" && (
            <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: "none" }}>
              <polyline
                points="180,260 320,200 480,300 600,360 720,280"
                fill="none"
                stroke="hsl(var(--primary, 24 95% 53%))"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            </svg>
          )}
          <div className="absolute bottom-3 left-3 rounded-md bg-background/95 px-3 py-1.5 text-[11px] text-muted-foreground shadow-sm">
            Map preview · Connected to mobile GPS
          </div>
        </div>

        {/* Side panel */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <div className="text-[13px] font-semibold text-foreground">Employees</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{liveEmployees.filter(e => e.status === "Active").length} active now</div>
          </div>
          <div className="max-h-[460px] overflow-y-auto">
            {liveEmployees.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-secondary/40",
                  selected === e.id && "bg-secondary/60",
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    e.status === "Active" ? "bg-emerald-500" : "bg-slate-400",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-foreground">{e.name}</div>
                  <div className="text-[11px] text-muted-foreground">{e.site} · {e.lastSeen}</div>
                </div>
                <Pill tone={e.status === "Active" ? "success" : "muted"}>{e.status}</Pill>
              </button>
            ))}
          </div>
          {view === "history" && (
            <div className="border-t border-border p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date Range</div>
              <div className="flex gap-2">
                <input type="date" className="h-8 flex-1 rounded-md border border-border bg-background px-2 text-[12px]" />
                <input type="date" className="h-8 flex-1 rounded-md border border-border bg-background px-2 text-[12px]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  4. Geo-Fence                                                          */
/* ────────────────────────────────────────────────────────────────────── */

function GeoFenceTab() {
  const drawer = useDrawer();

  return (
    <>
      <PageHeader
        title="Geo-Fence Alerts"
        actions={
          <>
            <GhostButton icon={Download}>Export</GhostButton>
            <PrimaryButton icon={Plus} onClick={() => drawer.show()}>Create Geo-Fence</PrimaryButton>
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Active Zones" value="12" icon={MapPin} tone="primary" />
        <KPI label="Today's Alerts" value="34" icon={ShieldAlert} tone="warning" />
        <KPI label="Breaches" value="3" icon={XCircle} tone="danger" />
        <KPI label="Within Zone" value="118" icon={CheckCircle2} tone="success" />
      </div>

      <DataTable<Geo>
        rows={geoAlerts}
        columns={[
          { key: "emp", header: "Employee", render: (r) => <span className="font-medium text-foreground">{r.emp}</span> },
          { key: "loc", header: "Location", render: (r) => r.loc },
          {
            key: "ev",
            header: "Event",
            render: (r) => (
              <span className={cn("inline-flex items-center gap-1 text-[12px]", r.event === "Entered" ? "text-emerald-600" : "text-rose-600")}>
                <Navigation size={12} />
                {r.event}
              </span>
            ),
          },
          { key: "t", header: "Time", render: (r) => r.time },
          { key: "s", header: "Status", render: (r) => <Pill tone={statusTone(r.status)}>{r.status}</Pill> },
        ]}
      />

      <Drawer open={drawer.open} onClose={drawer.hide} title="Create Geo-Fence Zone" submitLabel="Create Zone">
        <FieldSection title="Zone Details">
          <Field label="Location Name" required full><TextInput placeholder="e.g. Tower A Site" /></Field>
          <Field label="Latitude"><TextInput placeholder="19.0760" /></Field>
          <Field label="Longitude"><TextInput placeholder="72.8777" /></Field>
          <Field label="Radius (meters)" required><TextInput type="number" placeholder="100" /></Field>
          <Field label="Alert On">
            <Select options={[{ value: "in", label: "Entry" }, { value: "out", label: "Exit" }, { value: "both", label: "Both" }]} />
          </Field>
        </FieldSection>
        <FieldSection title="Assignment">
          <Field label="Assign Employees" full>
            <TextArea placeholder="Search and add employees…" />
          </Field>
        </FieldSection>
      </Drawer>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  5. Shifts & Roster                                                    */
/* ────────────────────────────────────────────────────────────────────── */

function ShiftsTab() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const shiftMeta: Record<string, { label: string; cls: string }> = {
    M: { label: "Morning", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
    E: { label: "Evening", cls: "bg-sky-50 text-sky-700 ring-sky-200" },
    N: { label: "Night", cls: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
    O: { label: "Off", cls: "bg-slate-50 text-slate-500 ring-slate-200" },
  };

  return (
    <>
      <PageHeader
        title="Shifts & Roster"
        actions={
          <>
            <GhostButton>Auto-Schedule</GhostButton>
            <GhostButton icon={Upload}>Bulk Assign</GhostButton>
            <PrimaryButton icon={Plus}>New Shift</PrimaryButton>
          </>
        }
        filters={
          <>
            <FilterBox>
              <MiniSelect placeholder="This Week" options={["This Week", "Next Week", "Last Week"]} />
            </FilterBox>
            <FilterBox>
              <MiniSelect placeholder="All Sites" options={["Tower A", "HQ Mumbai", "Bangalore Hub"]} />
            </FilterBox>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 text-[12px]">
        <span className="text-muted-foreground">Shift legend:</span>
        {Object.entries(shiftMeta).map(([k, v]) => (
          <span key={k} className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium ring-1 ring-inset", v.cls)}>
            <span className="font-semibold">{k}</span> {v.label}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 text-left">Employee</th>
              {days.map((d) => (
                <th key={d} className="px-3 py-3 text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rosterEmployees.map((emp) => (
              <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-foreground">{emp.name}</div>
                  <div className="text-[11px] text-muted-foreground">{emp.designation}</div>
                </td>
                {shiftTypes.map((s, i) => {
                  const m = shiftMeta[s];
                  return (
                    <td key={i} className="px-2 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex h-8 w-12 cursor-grab items-center justify-center rounded-md text-[12px] font-semibold ring-1 ring-inset",
                          m.cls,
                        )}
                        title={m.label}
                      >
                        {s}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-muted-foreground">
        Tip: Drag &amp; drop shift cells across days to reassign. Use Auto-Schedule for AI-based balancing.
      </p>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  6. Leaves                                                             */
/* ────────────────────────────────────────────────────────────────────── */

function LeavesTab() {
  const drawer = useDrawer();

  return (
    <>
      <PageHeader
        title="Leave Management"
        actions={
          <>
            <GhostButton icon={Download}>Export</GhostButton>
            <PrimaryButton icon={Plus} onClick={() => drawer.show()}>Apply Leave</PrimaryButton>
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Total Leaves (Apr)" value="86" icon={Plane} tone="primary" />
        <KPI label="Approved" value="62" icon={CheckCircle2} tone="success" />
        <KPI label="Pending" value="18" icon={Clock} tone="warning" />
        <KPI label="Rejected" value="6" icon={XCircle} tone="danger" />
      </div>

      <DataTable<Leave>
        rows={leaves}
        columns={[
          { key: "emp", header: "Employee", render: (r) => <span className="font-medium text-foreground">{r.emp}</span> },
          { key: "type", header: "Leave Type", render: (r) => <Pill tone="info">{r.type}</Pill> },
          { key: "from", header: "From", render: (r) => r.from },
          { key: "to", header: "To", render: (r) => r.to },
          { key: "appr", header: "Approver", render: (r) => r.approver },
          { key: "s", header: "Status", render: (r) => <Pill tone={statusTone(r.status)}>{r.status}</Pill> },
          {
            key: "act",
            header: "",
            align: "right",
            render: (r) =>
              r.status === "Pending" ? (
                <div className="flex items-center justify-end gap-1">
                  <button className="h-7 rounded-md bg-emerald-50 px-2 text-[12px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100">Approve</button>
                  <button className="h-7 rounded-md bg-rose-50 px-2 text-[12px] font-medium text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100">Reject</button>
                </div>
              ) : (
                <RowActions onEdit={() => {}} />
              ),
          },
        ]}
      />

      <Drawer open={drawer.open} onClose={drawer.hide} title="Apply Leave" submitLabel="Submit Request">
        <FieldSection title="Leave Details">
          <Field label="Employee" required>
            <Select options={employees.map((e) => ({ value: e.id, label: e.name }))} />
          </Field>
          <Field label="Leave Type" required>
            <Select options={[{ value: "casual", label: "Casual" }, { value: "sick", label: "Sick" }, { value: "earned", label: "Earned" }]} />
          </Field>
          <Field label="From Date" required><TextInput type="date" /></Field>
          <Field label="To Date" required><TextInput type="date" /></Field>
          <Field label="Reason" full><TextArea placeholder="Brief reason for leave…" /></Field>
        </FieldSection>
      </Drawer>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  7. Payroll                                                            */
/* ────────────────────────────────────────────────────────────────────── */

function PayrollTab() {
  const total = payroll.reduce((s, p) => s + p.salary, 0);
  const pending = payroll.filter((p) => p.status === "Pending").reduce((s, p) => s + p.net, 0);
  const ded = payroll.reduce((s, p) => s + p.deductions, 0);

  return (
    <>
      <PageHeader
        title="Payroll"
        actions={
          <>
            <GhostButton icon={Download}>Download Payslips</GhostButton>
            <PrimaryButton>Generate Payroll</PrimaryButton>
          </>
        }
        filters={
          <>
            <FilterBox>
              <MiniSelect placeholder="April 2025" options={["April 2025", "March 2025", "February 2025"]} />
            </FilterBox>
            <FilterBox>
              <MiniSelect placeholder="All Departments" options={["Operations", "HR", "Sales", "Finance"]} />
            </FilterBox>
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Total Salary Paid" value={`₹${(total / 100000).toFixed(2)}L`} icon={Wallet} tone="success" />
        <KPI label="Pending Payroll" value={`₹${(pending / 100000).toFixed(2)}L`} icon={Clock} tone="warning" />
        <KPI label="Total Deductions" value={`₹${(ded / 1000).toFixed(1)}K`} icon={TrendingDown} tone="danger" />
        <KPI label="Employees" value={String(payroll.length)} icon={Users} tone="primary" />
      </div>

      <DataTable<Pay>
        rows={payroll}
        columns={[
          { key: "emp", header: "Employee", render: (r) => <span className="font-medium text-foreground">{r.emp}</span> },
          { key: "sal", header: "Gross Salary", align: "right", render: (r) => `₹${r.salary.toLocaleString()}` },
          { key: "ded", header: "Deductions", align: "right", render: (r) => <span className="text-rose-600">-₹{r.deductions.toLocaleString()}</span> },
          { key: "net", header: "Net Pay", align: "right", render: (r) => <span className="font-semibold text-foreground">₹{r.net.toLocaleString()}</span> },
          { key: "s", header: "Status", render: (r) => <Pill tone={statusTone(r.status)}>{r.status}</Pill> },
          {
            key: "act",
            header: "",
            align: "right",
            render: () => (
              <div className="flex items-center justify-end gap-1">
                <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-[12px] font-medium text-foreground hover:bg-accent">
                  <FileText size={12} /> Payslip
                </button>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  8. Performance & Analytics                                            */
/* ────────────────────────────────────────────────────────────────────── */

function PerformanceTab() {
  // Bar chart data: attendance trend (last 7 days)
  const trend = [88, 92, 90, 86, 94, 91, 95];
  const max = 100;

  return (
    <>
      <PageHeader
        title="Performance & Analytics"
        actions={<GhostButton icon={Download}>Export Report</GhostButton>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Avg. Attendance" value="93.4%" icon={CheckCircle2} tone="success" trend={{ dir: "up", value: "+2.1%" }} />
        <KPI label="Avg. Productivity" value="88%" icon={TrendingUp} tone="primary" trend={{ dir: "up", value: "+4%" }} />
        <KPI label="Late Arrivals" value="42" icon={Clock} tone="warning" trend={{ dir: "down", value: "-12%" }} />
        <KPI label="Absentee Rate" value="4.2%" icon={XCircle} tone="danger" trend={{ dir: "down", value: "-0.8%" }} />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Attendance trend */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[13px] font-semibold text-foreground">Attendance Trend</div>
              <div className="text-[11px] text-muted-foreground">Last 7 days</div>
            </div>
            <Pill tone="success">+2.1%</Pill>
          </div>
          <div className="flex h-44 items-end gap-3">
            {trend.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full flex-1">
                  <div className="absolute inset-x-0 bottom-0 rounded-t bg-primary/15" style={{ height: `${(v / max) * 100}%` }} />
                  <div className="absolute inset-x-0 bottom-0 rounded-t bg-primary" style={{ height: `${(v / max) * 70}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity by department */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 text-[13px] font-semibold text-foreground">Productivity by Department</div>
          <div className="space-y-4">
            {[
              { d: "Operations", v: 92 },
              { d: "Sales", v: 88 },
              { d: "HR", v: 85 },
              { d: "Finance", v: 90 },
              { d: "Marketing", v: 82 },
            ].map((r) => (
              <div key={r.d}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="text-foreground">{r.d}</span>
                  <span className="font-medium text-muted-foreground">{r.v}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${r.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <div className="text-[13px] font-semibold text-foreground">Employee Performance Summary</div>
        </div>
        <DataTable
          rows={performanceRows}
          columns={[
            { key: "emp", header: "Employee", render: (r) => <span className="font-medium text-foreground">{r.emp}</span> },
            { key: "att", header: "Attendance", render: (r) => r.attendance },
            { key: "p", header: "Productivity", render: (r) => r.productivity },
            { key: "l", header: "Late Days", render: (r) => r.late },
            { key: "a", header: "Absent Days", render: (r) => r.absent },
          ]}
        />
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  9. HR Settings                                                        */
/* ────────────────────────────────────────────────────────────────────── */

function SettingsTab() {
  const sections = [
    {
      title: "Attendance Rules",
      desc: "Define work hours, late marks and overtime policies.",
      items: [
        { l: "Standard Work Hours", v: "9 hours / day" },
        { l: "Grace Period", v: "10 minutes" },
        { l: "Late Mark After", v: "09:15 AM" },
        { l: "Overtime Multiplier", v: "1.5×" },
      ],
    },
    {
      title: "Leave Policy",
      desc: "Configure leave types and entitlements.",
      items: [
        { l: "Casual Leave", v: "12 / year" },
        { l: "Sick Leave", v: "8 / year" },
        { l: "Earned Leave", v: "18 / year" },
        { l: "Carry Forward", v: "Up to 30 days" },
      ],
    },
    {
      title: "Shift Rules",
      desc: "Default shift timings used across rosters.",
      items: [
        { l: "Morning Shift", v: "06:00 — 14:00" },
        { l: "Evening Shift", v: "14:00 — 22:00" },
        { l: "Night Shift", v: "22:00 — 06:00" },
        { l: "Min. Rest Between Shifts", v: "10 hours" },
      ],
    },
    {
      title: "Tracking Settings",
      desc: "GPS frequency and field tracking permissions.",
      items: [
        { l: "GPS Ping Frequency", v: "Every 5 minutes" },
        { l: "Tracking During", v: "Shift hours only" },
        { l: "Geo-Fence Alerts", v: "Enabled" },
        { l: "Battery Saver Mode", v: "Auto" },
      ],
    },
  ];

  return (
    <>
      <PageHeader title="HR Settings" actions={<PrimaryButton>Save Changes</PrimaryButton>} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sections.map((sec) => (
          <div key={sec.title} className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="text-[14px] font-semibold text-foreground">{sec.title}</div>
              <div className="mt-0.5 text-[12px] text-muted-foreground">{sec.desc}</div>
            </div>
            <div className="divide-y divide-border">
              {sec.items.map((it) => (
                <div key={it.l} className="flex items-center justify-between px-5 py-3 text-[13px]">
                  <span className="text-muted-foreground">{it.l}</span>
                  <span className="font-medium text-foreground">{it.v}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border bg-secondary/30 px-5 py-3 text-right">
              <button className="text-[12px] font-medium text-primary hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
