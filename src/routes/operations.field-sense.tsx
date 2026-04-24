import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Battery,
  BellRing,
  Briefcase,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Home as HomeIcon,
  ListChecks,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  MoreHorizontal,
  Navigation,
  Phone,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Shield,
  Signal,
  User as UserIcon,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/operations/field-sense")({
  head: () => ({
    meta: [
      { title: "FieldSense — Field Workforce Management | Logicon" },
      {
        name: "description",
        content:
          "Connected admin dashboard and employee mobile app for field workforce management — tasks, attendance, live tracking, and analytics.",
      },
    ],
  }),
  component: FieldSensePage,
});

/* ----------------------------- Types & Mock Data ----------------------------- */

type TaskStatus = "Assigned" | "Accepted" | "In Progress" | "Completed" | "Delayed";
type EmpStatus = "Active" | "Idle" | "Offline" | "On Break";

type Employee = {
  id: string;
  name: string;
  role: string;
  status: EmpStatus;
  battery: number;
  location: string;
  lat: number;
  lng: number;
  checkIn?: string;
  hours: number;
  tasksDone: number;
  tasksTotal: number;
  initials: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeId: string;
  location: string;
  deadline: string;
  priority: "Low" | "Medium" | "High";
  status: TaskStatus;
  progress: number;
};

const initialEmployees: Employee[] = [
  { id: "E-101", name: "Rohan Mehta", role: "Field Engineer", status: "Active", battery: 82, location: "Sector 18, Noida", lat: 28.57, lng: 77.32, checkIn: "09:02", hours: 6.4, tasksDone: 4, tasksTotal: 5, initials: "RM" },
  { id: "E-102", name: "Aisha Khan", role: "Service Tech", status: "Active", battery: 64, location: "MG Road, Gurugram", lat: 28.47, lng: 77.05, checkIn: "08:51", hours: 6.7, tasksDone: 3, tasksTotal: 4, initials: "AK" },
  { id: "E-103", name: "Vikram Shah", role: "Inspector", status: "Idle", battery: 41, location: "Andheri E, Mumbai", lat: 19.11, lng: 72.86, checkIn: "09:14", hours: 5.9, tasksDone: 2, tasksTotal: 5, initials: "VS" },
  { id: "E-104", name: "Priya Nair", role: "Sales Exec", status: "Active", battery: 91, location: "Indiranagar, Bengaluru", lat: 12.97, lng: 77.64, checkIn: "08:45", hours: 7.1, tasksDone: 5, tasksTotal: 6, initials: "PN" },
  { id: "E-105", name: "Arjun Patel", role: "Field Engineer", status: "On Break", battery: 56, location: "Banjara Hills, Hyd", lat: 17.41, lng: 78.43, checkIn: "09:08", hours: 6.0, tasksDone: 2, tasksTotal: 3, initials: "AP" },
  { id: "E-106", name: "Sneha Iyer", role: "Auditor", status: "Offline", battery: 18, location: "T. Nagar, Chennai", lat: 13.04, lng: 80.23, hours: 0, tasksDone: 0, tasksTotal: 2, initials: "SI" },
];

const initialTasks: Task[] = [
  { id: "T-2041", title: "AC Unit Maintenance — Tower B", description: "Routine quarterly maintenance of HVAC units on floors 4-6.", assignee: "Rohan Mehta", assigneeId: "E-101", location: "Sector 18, Noida", deadline: "Today, 4:00 PM", priority: "High", status: "In Progress", progress: 60 },
  { id: "T-2042", title: "Site Inspection — Riverside Plaza", description: "Pre-handover inspection with photo proof.", assignee: "Aisha Khan", assigneeId: "E-102", location: "MG Road, Gurugram", deadline: "Today, 6:30 PM", priority: "Medium", status: "Accepted", progress: 10 },
  { id: "T-2043", title: "Client Demo — Acme Corp", description: "Product walkthrough and Q&A session.", assignee: "Priya Nair", assigneeId: "E-104", location: "Indiranagar, Bengaluru", deadline: "Today, 3:00 PM", priority: "High", status: "Completed", progress: 100 },
  { id: "T-2044", title: "Equipment Audit — Warehouse 7", description: "Verify serials and update inventory.", assignee: "Vikram Shah", assigneeId: "E-103", location: "Andheri E, Mumbai", deadline: "Today, 5:00 PM", priority: "Medium", status: "Delayed", progress: 25 },
  { id: "T-2045", title: "Cabling Repair — Block C", description: "Fix reported network outage in finance dept.", assignee: "Arjun Patel", assigneeId: "E-105", location: "Banjara Hills, Hyd", deadline: "Today, 7:00 PM", priority: "Low", status: "Assigned", progress: 0 },
  { id: "T-2046", title: "Quarterly Visit — Vendor M/s Bharat", description: "Reconciliation and signature collection.", assignee: "Sneha Iyer", assigneeId: "E-106", location: "T. Nagar, Chennai", deadline: "Tomorrow, 11:00 AM", priority: "Medium", status: "Assigned", progress: 0 },
];

const ALERTS = [
  { type: "Late Check-in", who: "Vikram Shah", time: "09:14", tone: "amber" as const },
  { type: "Overdue Task", who: "Sneha Iyer · T-2046", time: "30 min", tone: "rose" as const },
  { type: "Geo-fence Exit", who: "Arjun Patel", time: "11:42", tone: "amber" as const },
  { type: "Low Battery", who: "Sneha Iyer · 18%", time: "Now", tone: "rose" as const },
];

/* ----------------------------- Helpers ----------------------------- */

function statusTone(s: TaskStatus | EmpStatus) {
  switch (s) {
    case "Completed":
    case "Active":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "In Progress":
    case "Accepted":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "Delayed":
    case "Offline":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
    case "Idle":
    case "On Break":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    case "Assigned":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}

function priorityTone(p: Task["priority"]) {
  return p === "High"
    ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
    : p === "Medium"
    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
    : "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

/* ----------------------------- Page ----------------------------- */

type TabKey = "dashboard" | "employees" | "tasks" | "attendance" | "tracking" | "reports" | "settings" | "mobile";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "employees", label: "Employees", icon: Users },
  { key: "tasks", label: "Tasks", icon: ListChecks },
  { key: "attendance", label: "Attendance", icon: Clock },
  { key: "tracking", label: "Live Tracking", icon: Navigation },
  { key: "reports", label: "Reports", icon: Activity },
  { key: "settings", label: "Settings", icon: SettingsIcon },
  { key: "mobile", label: "Employee App", icon: Phone },
];

function FieldSensePage() {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [employees] = useState<Employee[]>(initialEmployees);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showCreate, setShowCreate] = useState(false);

  const kpis = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Assigned" || t.status === "Accepted").length;
    const delayed = tasks.filter((t) => t.status === "Delayed").length;
    const active = employees.filter((e) => e.status === "Active").length;
    return { completed, inProgress, pending, delayed, active };
  }, [tasks, employees]);

  function moveTask(id: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, progress: status === "Completed" ? 100 : status === "In Progress" ? Math.max(t.progress, 50) : t.progress }
          : t,
      ),
    );
  }

  function addTask(t: Task) {
    setTasks((prev) => [t, ...prev]);
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1480px] px-6 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span>Operations</span>
              <ChevronRight size={12} />
              <span className="text-foreground">FieldSense</span>
            </div>
            <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-foreground">
              FieldSense — Field Workforce Management
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Connected admin dashboard and mobile app — every action syncs in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-[13px] font-medium text-foreground hover:bg-accent">
              <RefreshCw size={14} /> Sync now
            </button>
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-[13px] font-medium text-foreground hover:bg-accent">
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-[13px] font-medium text-white hover:bg-blue-700"
            >
              <Plus size={14} /> Create Task
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 overflow-x-auto">
          <div className="inline-flex min-w-full items-center gap-1 rounded-lg border border-border bg-white p-1 shadow-sm">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          {tab === "dashboard" && <AdminDashboard kpis={kpis} employees={employees} tasks={tasks} />}
          {tab === "employees" && <EmployeesView employees={employees} tasks={tasks} />}
          {tab === "tasks" && <TasksView tasks={tasks} onMove={moveTask} />}
          {tab === "attendance" && <AttendanceView employees={employees} />}
          {tab === "tracking" && <TrackingView employees={employees} />}
          {tab === "reports" && <ReportsView employees={employees} tasks={tasks} />}
          {tab === "settings" && <SettingsView />}
          {tab === "mobile" && <MobileAppPreview tasks={tasks} onMove={moveTask} />}
        </div>
      </div>

      {showCreate && (
        <CreateTaskDrawer
          employees={employees}
          onClose={() => setShowCreate(false)}
          onCreate={(t) => {
            addTask(t);
            setShowCreate(false);
          }}
        />
      )}
    </AppLayout>
  );
}

/* ----------------------------- Reusable Cards ----------------------------- */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-white shadow-sm", className)}>{children}</div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  delta?: string;
  tone: "blue" | "emerald" | "amber" | "rose" | "slate";
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 text-[24px] font-semibold tracking-tight text-foreground">{value}</div>
          {delta && (
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <ArrowUpRight size={12} /> {delta}
            </div>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------- Admin Dashboard ----------------------------- */

function AdminDashboard({
  kpis,
  employees,
  tasks,
}: {
  kpis: { completed: number; inProgress: number; pending: number; delayed: number; active: number };
  employees: Employee[];
  tasks: Task[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="Total Employees" value={employees.length} icon={Users} tone="blue" />
        <KpiCard label="Active Today" value={kpis.active} delta="+12% vs yesterday" icon={Zap} tone="emerald" />
        <KpiCard label="Tasks Completed" value={kpis.completed} icon={CheckCircle2} tone="emerald" />
        <KpiCard label="In Progress" value={kpis.inProgress} icon={Clock} tone="amber" />
        <KpiCard label="Delayed / Pending" value={kpis.delayed + kpis.pending} icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="text-[14px] font-semibold text-foreground">Live field map</div>
              <div className="text-[12px] text-muted-foreground">Real-time positions of {kpis.active} active employees</div>
            </div>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-white px-2.5 text-[12px] text-foreground hover:bg-accent">
              <Filter size={12} /> Filters
            </button>
          </div>
          <MockMap employees={employees} />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-semibold text-foreground">Alerts</div>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200">
              {ALERTS.length} new
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {ALERTS.map((a, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                    a.tone === "rose" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700",
                  )}
                >
                  <AlertTriangle size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-foreground">{a.type}</div>
                  <div className="truncate text-[12px] text-muted-foreground">{a.who}</div>
                </div>
                <div className="text-[11px] text-muted-foreground">{a.time}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="text-[14px] font-semibold text-foreground">Today's tasks</div>
            <span className="text-[12px] text-muted-foreground">{tasks.length} total</span>
          </div>
          <div className="divide-y divide-border">
            {tasks.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                  <Briefcase size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium text-foreground">{t.title}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", statusTone(t.status))}>
                      {t.status}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <UserIcon size={11} /> {t.assignee}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} /> {t.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} /> {t.deadline}
                    </span>
                  </div>
                </div>
                <div className="hidden w-32 md:block">
                  <Progress value={t.progress} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-[14px] font-semibold text-foreground">Productivity today</div>
          <div className="mt-3 space-y-3">
            {[
              { label: "Task completion rate", value: 78, tone: "emerald" },
              { label: "On-time check-ins", value: 92, tone: "blue" },
              { label: "Average idle time", value: 14, tone: "amber" },
              { label: "Geo-fence compliance", value: 96, tone: "emerald" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-semibold text-foreground">{m.value}%</span>
                </div>
                <Progress value={m.value} tone={m.tone as "blue" | "emerald" | "amber"} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Progress({ value, tone = "blue" }: { value: number; tone?: "blue" | "emerald" | "amber" | "rose" }) {
  const tones: Record<string, string> = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  return (
    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={cn("h-full rounded-full", tones[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}

/* ----------------------------- Mock Map ----------------------------- */

function MockMap({ employees }: { employees: Employee[] }) {
  // Project lat/lng to a fake canvas
  const minLat = 12.5,
    maxLat = 28.7,
    minLng = 72.5,
    maxLng = 80.5;
  return (
    <div className="relative h-[340px] w-full bg-[linear-gradient(180deg,#eef4ff,#f7faff)]">
      {/* grid */}
      <svg className="absolute inset-0 h-full w-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dbe7ff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* fake roads */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 220 Q 200 120 480 200 T 1000 180" fill="none" stroke="#bfd3ff" strokeWidth="6" strokeLinecap="round" />
        <path d="M 0 90 Q 240 200 520 110 T 1000 130" fill="none" stroke="#cfe0ff" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {/* markers */}
      {employees.map((e, i) => {
        const x = ((e.lng - minLng) / (maxLng - minLng)) * 100;
        const y = (1 - (e.lat - minLat) / (maxLat - minLat)) * 100;
        const color = e.status === "Active" ? "bg-emerald-500" : e.status === "Idle" ? "bg-amber-500" : e.status === "Offline" ? "bg-rose-500" : "bg-slate-400";
        return (
          <div
            key={e.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative">
              {e.status === "Active" && (
                <span className={cn("absolute inset-0 -m-1 animate-ping rounded-full opacity-60", color)} />
              )}
              <div className={cn("relative flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white shadow", color)}>
                <span className="text-[9px] font-bold text-white">{e.initials}</span>
              </div>
            </div>
            {i % 2 === 0 && (
              <div className="mt-1 hidden translate-x-[-30%] rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow ring-1 ring-border md:block">
                {e.name.split(" ")[0]}
              </div>
            )}
          </div>
        );
      })}
      {/* legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md bg-white px-2.5 py-1.5 text-[11px] shadow ring-1 ring-border">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Active</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Idle</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" />Offline</span>
      </div>
    </div>
  );
}

/* ----------------------------- Employees ----------------------------- */

function EmployeesView({ employees, tasks }: { employees: Employee[]; tasks: Task[] }) {
  const [selected, setSelected] = useState<Employee | null>(null);
  const empTasks = (id: string) => tasks.filter((t) => t.assigneeId === id);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="text-[14px] font-semibold text-foreground">Employees</div>
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search employees…" className="h-8 w-56 rounded-md border border-border pl-8 pr-2 text-[12px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15" />
          </div>
        </div>
        <table className="w-full text-[13px]">
          <thead className="bg-slate-50 text-left text-[11.5px] font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5">Employee</th>
              <th className="px-4 py-2.5">Role</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Location</th>
              <th className="px-4 py-2.5">Tasks</th>
              <th className="px-4 py-2.5">Battery</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-700">
                      {e.initials}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{e.name}</div>
                      <div className="text-[11px] text-muted-foreground">{e.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{e.role}</td>
                <td className="px-4 py-2.5">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", statusTone(e.status))}>{e.status}</span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin size={11} />{e.location}</span>
                </td>
                <td className="px-4 py-2.5 text-foreground">{e.tasksDone}/{e.tasksTotal}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Battery size={14} className={e.battery < 25 ? "text-rose-600" : "text-muted-foreground"} />
                    <span className={cn("text-[12px]", e.battery < 25 ? "text-rose-600 font-medium" : "text-foreground")}>{e.battery}%</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => setSelected(e)} className="text-[12px] font-medium text-blue-700 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        {selected ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[14px] font-semibold text-blue-700">
                {selected.initials}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-foreground">{selected.name}</div>
                <div className="text-[12px] text-muted-foreground">{selected.role} · {selected.id}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
              <div className="rounded-lg border border-border p-2.5">
                <div className="text-muted-foreground">Check-in</div>
                <div className="mt-0.5 font-medium text-foreground">{selected.checkIn ?? "—"}</div>
              </div>
              <div className="rounded-lg border border-border p-2.5">
                <div className="text-muted-foreground">Hours today</div>
                <div className="mt-0.5 font-medium text-foreground">{selected.hours.toFixed(1)} h</div>
              </div>
              <div className="rounded-lg border border-border p-2.5">
                <div className="text-muted-foreground">Tasks</div>
                <div className="mt-0.5 font-medium text-foreground">{selected.tasksDone}/{selected.tasksTotal}</div>
              </div>
              <div className="rounded-lg border border-border p-2.5">
                <div className="text-muted-foreground">Status</div>
                <div className="mt-1"><span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", statusTone(selected.status))}>{selected.status}</span></div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Assigned tasks</div>
              <ul className="mt-2 space-y-2">
                {empTasks(selected.id).map((t) => (
                  <li key={t.id} className="rounded-lg border border-border p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-medium text-foreground">{t.title}</span>
                      <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", statusTone(t.status))}>{t.status}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{t.deadline} · {t.location}</div>
                  </li>
                ))}
                {empTasks(selected.id).length === 0 && <li className="text-[12px] text-muted-foreground">No tasks assigned.</li>}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <UserIcon className="text-muted-foreground" size={28} />
            <div className="mt-2 text-[13px] font-medium text-foreground">Select an employee</div>
            <div className="text-[12px] text-muted-foreground">View profile, attendance & tasks.</div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ----------------------------- Tasks (Kanban) ----------------------------- */

const COLUMNS: TaskStatus[] = ["Assigned", "Accepted", "In Progress", "Completed", "Delayed"];

function TasksView({ tasks, onMove }: { tasks: Task[]; onMove: (id: string, s: TaskStatus) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
      {COLUMNS.map((col) => {
        const items = tasks.filter((t) => t.status === col);
        return (
          <div key={col} className="rounded-xl border border-border bg-slate-50/60 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", col === "Completed" ? "bg-emerald-500" : col === "In Progress" || col === "Accepted" ? "bg-amber-500" : col === "Delayed" ? "bg-rose-500" : "bg-blue-500")} />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{col}</span>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-foreground ring-1 ring-border">{items.length}</span>
            </div>
            <div className="mt-3 space-y-2">
              {items.map((t) => (
                <div key={t.id} className="rounded-lg border border-border bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[13px] font-medium text-foreground">{t.title}</div>
                    <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold", priorityTone(t.priority))}>{t.priority}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><UserIcon size={10} />{t.assignee.split(" ")[0]}</span>
                    <span className="inline-flex items-center gap-1"><MapPin size={10} />{t.location}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Clock size={10} />{t.deadline}</span>
                    <select
                      value={t.status}
                      onChange={(e) => onMove(t.id, e.target.value as TaskStatus)}
                      className="rounded-md border border-border bg-white px-1.5 py-0.5 text-[11px] text-foreground focus:border-blue-500 focus:outline-none"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="rounded-lg border border-dashed border-border bg-white/60 p-4 text-center text-[11.5px] text-muted-foreground">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- Attendance ----------------------------- */

function AttendanceView({ employees }: { employees: Employee[] }) {
  const present = employees.filter((e) => e.checkIn);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Present" value={present.length} icon={CheckCircle2} tone="emerald" />
        <KpiCard label="Late" value={1} icon={Clock} tone="amber" />
        <KpiCard label="Absent" value={employees.length - present.length} icon={X} tone="rose" />
        <KpiCard label="Avg. hours" value={"6.4 h"} icon={Activity} tone="blue" />
      </div>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="text-[14px] font-semibold text-foreground">Today's attendance log</div>
          <div className="text-[12px] text-muted-foreground">Geofence: <span className="font-medium text-emerald-700">Validated</span></div>
        </div>
        <table className="w-full text-[13px]">
          <thead className="bg-slate-50 text-left text-[11.5px] font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5">Employee</th>
              <th className="px-4 py-2.5">Check-in</th>
              <th className="px-4 py-2.5">Location</th>
              <th className="px-4 py-2.5">Hours</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[10.5px] font-semibold text-blue-700">{e.initials}</div>
                    <div>
                      <div className="font-medium text-foreground">{e.name}</div>
                      <div className="text-[11px] text-muted-foreground">{e.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-foreground">{e.checkIn ?? <span className="text-rose-600">—</span>}</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin size={11} />{e.location}</span>
                </td>
                <td className="px-4 py-2.5 text-foreground">{e.hours.toFixed(1)} h</td>
                <td className="px-4 py-2.5">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", e.checkIn ? statusTone("Active") : statusTone("Offline"))}>
                    {e.checkIn ? "Present" : "Absent"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ----------------------------- Live Tracking ----------------------------- */

function TrackingView({ employees }: { employees: Employee[] }) {
  const [selected, setSelected] = useState<Employee>(employees[0]);
  return (
    <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-3 text-[14px] font-semibold text-foreground">On-field employees</div>
        <ul className="max-h-[520px] overflow-y-auto">
          {employees.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => setSelected(e)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-left transition-colors",
                  selected.id === e.id ? "bg-blue-50" : "hover:bg-slate-50",
                )}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-[12px] font-semibold text-blue-700">
                  {e.initials}
                  <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white", e.status === "Active" ? "bg-emerald-500" : e.status === "Idle" ? "bg-amber-500" : e.status === "Offline" ? "bg-rose-500" : "bg-slate-400")} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-foreground">{e.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{e.location}</div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="text-[14px] font-semibold text-foreground">{selected.name} — Route history</div>
            <div className="text-[12px] text-muted-foreground">Today · Last update 2 min ago</div>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-emerald-200">
              <Radio size={12} /> Live
            </span>
            <span className="text-muted-foreground">Idle: 14 min</span>
          </div>
        </div>
        <RouteMap employee={selected} />
      </Card>
    </div>
  );
}

function RouteMap({ employee }: { employee: Employee }) {
  return (
    <div className="relative h-[420px] w-full bg-[linear-gradient(180deg,#eef4ff,#f7faff)]">
      <svg className="absolute inset-0 h-full w-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dbe7ff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2)" />
      </svg>
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M 80 340 Q 200 200 360 240 T 720 160 T 940 220" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
        <circle cx="80" cy="340" r="7" fill="#22c55e" stroke="white" strokeWidth="3" />
        <circle cx="360" cy="240" r="5" fill="#fff" stroke="#2563eb" strokeWidth="2" />
        <circle cx="720" cy="160" r="5" fill="#fff" stroke="#2563eb" strokeWidth="2" />
        <circle cx="940" cy="220" r="8" fill="#ef4444" stroke="white" strokeWidth="3" />
      </svg>
      <div className="absolute left-3 top-3 rounded-lg bg-white p-2 text-[11px] shadow ring-1 ring-border">
        <div className="font-semibold text-foreground">{employee.name}</div>
        <div className="text-muted-foreground">Distance: 18.4 km · Stops: 4</div>
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-[11px] shadow ring-1 ring-border">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Start</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" />Current</span>
      </div>
    </div>
  );
}

/* ----------------------------- Reports ----------------------------- */

function ReportsView({ employees, tasks }: { employees: Employee[]; tasks: Task[] }) {
  const completion = Math.round((tasks.filter((t) => t.status === "Completed").length / tasks.length) * 100);
  const bars = [62, 70, 55, 80, 68, 90, 78];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Task completion" value={`${completion}%`} icon={CheckCircle2} tone="emerald" />
        <KpiCard label="Avg. response" value="22 min" icon={Zap} tone="blue" />
        <KpiCard label="On-time rate" value="92%" icon={Clock} tone="amber" />
        <KpiCard label="Field hours" value="184 h" icon={Activity} tone="slate" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-semibold text-foreground">Productivity — last 7 days</div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-blue-600" />Tasks done</span>
            </div>
          </div>
          <div className="mt-5 flex h-56 items-end gap-3 px-1">
            {bars.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full items-end justify-center" style={{ height: "100%" }}>
                  <div className="w-full max-w-[42px] rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400" style={{ height: `${v}%` }} />
                </div>
                <span className="text-[11px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-[14px] font-semibold text-foreground">Top performers</div>
          <ul className="mt-3 space-y-2.5">
            {employees.slice(0, 5).map((e, i) => {
              const pct = Math.round((e.tasksDone / Math.max(e.tasksTotal, 1)) * 100);
              return (
                <li key={e.id} className="flex items-center gap-3">
                  <span className="w-4 text-[12px] font-semibold text-muted-foreground">{i + 1}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[10.5px] font-semibold text-blue-700">{e.initials}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-medium text-foreground">{e.name}</div>
                    <Progress value={pct} tone="emerald" />
                  </div>
                  <span className="text-[12px] font-semibold text-foreground">{pct}%</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ----------------------------- Mobile App Preview ----------------------------- */

type MobileScreen = "home" | "tasks" | "attendance" | "notif";

function MobileAppPreview({ tasks, onMove }: { tasks: Task[]; onMove: (id: string, s: TaskStatus) => void }) {
  const [screen, setScreen] = useState<MobileScreen>("home");
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [checkedIn, setCheckedIn] = useState(true);

  // Pretend the logged-in employee is Rohan
  const myTasks = tasks.filter((t) => t.assigneeId === "E-101");

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr]">
      <Card className="p-5">
        <div className="text-[14px] font-semibold text-foreground">Employee Mobile App — Live Preview</div>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          A connected experience for field employees. Every action you take here syncs to the admin dashboard in real time.
        </p>
        <ul className="mt-4 space-y-3 text-[12.5px]">
          {[
            { icon: LogIn, t: "One-tap check-in", d: "Captures GPS + timestamp and updates Attendance instantly." },
            { icon: ListChecks, t: "Today's tasks", d: "Receive new assignments, update progress, mark complete." },
            { icon: Camera, t: "Photo proof on completion", d: "Upload before/after photos, saved to the task." },
            { icon: BellRing, t: "Push notifications", d: "Reminders, assignments, and admin messages." },
            { icon: Wifi, t: "Offline mode", d: "Actions queue locally and sync when back online." },
          ].map((f) => (
            <li key={f.t} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                <f.icon size={16} />
              </div>
              <div>
                <div className="font-medium text-foreground">{f.t}</div>
                <div className="text-muted-foreground">{f.d}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Phone */}
      <div className="mx-auto">
        <div className="relative h-[640px] w-[320px] rounded-[42px] border border-slate-200 bg-slate-900 p-3 shadow-2xl">
          <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-white">
            {/* status bar */}
            <div className="flex h-7 items-center justify-between bg-blue-600 px-4 text-[10.5px] font-semibold text-white">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal size={11} /> <Wifi size={11} /> <Battery size={11} />
              </div>
            </div>
            {/* app header */}
            <div className="flex items-center justify-between bg-blue-600 px-4 pb-3 pt-1 text-white">
              <div className="flex items-center gap-2">
                <Menu size={16} />
                <div>
                  <div className="text-[11px] opacity-80">FieldSense</div>
                  <div className="text-[14px] font-semibold leading-none">Hi, Rohan 👋</div>
                </div>
              </div>
              <div className="relative">
                <BellRing size={16} />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-300 ring-2 ring-blue-600" />
              </div>
            </div>

            {/* notch dot */}
            <div className="pointer-events-none absolute left-1/2 top-1.5 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/40" />

            <div className="h-[calc(100%-128px)] overflow-y-auto bg-slate-50 px-3 py-3">
              {screen === "home" && (
                <PhoneHome
                  tasks={myTasks}
                  checkedIn={checkedIn}
                  onCheck={() => setCheckedIn((v) => !v)}
                  onOpenTask={(t) => setOpenTask(t)}
                  goTasks={() => setScreen("tasks")}
                />
              )}
              {screen === "tasks" && <PhoneTasks tasks={myTasks} onOpenTask={setOpenTask} />}
              {screen === "attendance" && <PhoneAttendance checkedIn={checkedIn} onToggle={() => setCheckedIn((v) => !v)} />}
              {screen === "notif" && <PhoneNotif />}
            </div>

            {/* bottom nav */}
            <div className="absolute inset-x-0 bottom-0 flex h-14 items-center justify-around border-t border-slate-200 bg-white">
              {[
                { k: "home" as const, label: "Home", icon: HomeIcon },
                { k: "tasks" as const, label: "Tasks", icon: ListChecks },
                { k: "attendance" as const, label: "Attend", icon: Clock },
                { k: "notif" as const, label: "Alerts", icon: BellRing },
              ].map((b) => {
                const active = screen === b.k;
                const I = b.icon;
                return (
                  <button
                    key={b.k}
                    onClick={() => setScreen(b.k)}
                    className={cn(
                      "flex flex-col items-center gap-0.5 text-[10px]",
                      active ? "text-blue-600" : "text-muted-foreground",
                    )}
                  >
                    <I size={18} />
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Card className="p-5">
        <div className="text-[14px] font-semibold text-foreground">Connected lifecycle</div>
        <ol className="mt-3 space-y-3">
          {[
            { t: "Admin creates task", d: "Defined here in Tasks tab — assigned to an employee with location & deadline." },
            { t: "Employee receives instantly", d: "Task appears on the phone Home screen with priority badge." },
            { t: "Employee acts", d: "Accept → Start → Complete. Photo proof and notes attached." },
            { t: "System updates", d: "Status, location, and progress sync back to admin in real time." },
            { t: "Admin monitors", d: "Live map, KPIs and reports reflect the change immediately." },
          ].map((s, i) => (
            <li key={s.t} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">{i + 1}</div>
              <div className="text-[12.5px]">
                <div className="font-medium text-foreground">{s.t}</div>
                <div className="text-muted-foreground">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-[12px] text-blue-900">
          Tip: Change a task status on the phone — it updates the Tasks Kanban and Dashboard KPIs instantly.
        </div>
      </Card>

      {openTask && <PhoneTaskSheet task={openTask} onClose={() => setOpenTask(null)} onMove={(s) => { onMove(openTask.id, s); setOpenTask(null); }} />}
    </div>
  );
}

function PhoneHome({
  tasks,
  checkedIn,
  onCheck,
  onOpenTask,
  goTasks,
}: {
  tasks: Task[];
  checkedIn: boolean;
  onCheck: () => void;
  onOpenTask: (t: Task) => void;
  goTasks: () => void;
}) {
  const done = tasks.filter((t) => t.status === "Completed").length;
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-3 text-white shadow">
        <div className="flex items-center justify-between text-[11px] opacity-90">
          <span>Today's progress</span>
          <span>{done}/{tasks.length} done</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${(done / Math.max(tasks.length, 1)) * 100}%` }} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={onCheck} className={cn("flex-1 rounded-lg py-2 text-[12px] font-semibold", checkedIn ? "bg-white/15 text-white" : "bg-white text-blue-700")}>
            {checkedIn ? <span className="inline-flex items-center justify-center gap-1.5"><LogOut size={12} />Check Out</span> : <span className="inline-flex items-center justify-center gap-1.5"><LogIn size={12} />Check In</span>}
          </button>
          <button onClick={goTasks} className="flex-1 rounded-lg bg-white/15 py-2 text-[12px] font-semibold text-white">View Tasks</button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-3 shadow ring-1 ring-slate-200">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-semibold text-foreground">Today's tasks</span>
          <button onClick={goTasks} className="text-blue-600">See all</button>
        </div>
        <ul className="mt-2 space-y-2">
          {tasks.slice(0, 3).map((t) => (
            <li key={t.id}>
              <button onClick={() => onOpenTask(t)} className="flex w-full items-center gap-2 rounded-lg border border-slate-200 p-2 text-left">
                <div className={cn("h-8 w-1 rounded-full", t.priority === "High" ? "bg-rose-500" : t.priority === "Medium" ? "bg-amber-500" : "bg-slate-300")} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-medium text-foreground">{t.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10.5px] text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5"><Clock size={9} />{t.deadline}</span>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold", statusTone(t.status))}>{t.status}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white p-3 text-center shadow ring-1 ring-slate-200">
          <div className="text-[18px] font-semibold text-foreground">6.4 h</div>
          <div className="text-[10.5px] text-muted-foreground">Today</div>
        </div>
        <div className="rounded-xl bg-white p-3 text-center shadow ring-1 ring-slate-200">
          <div className="text-[18px] font-semibold text-emerald-600">{done}</div>
          <div className="text-[10.5px] text-muted-foreground">Completed</div>
        </div>
      </div>
    </div>
  );
}

function PhoneTasks({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (t: Task) => void }) {
  return (
    <div className="space-y-2">
      <div className="rounded-xl bg-white p-2 shadow ring-1 ring-slate-200">
        <div className="flex items-center gap-1 text-[11px]">
          {(["All", "Pending", "Active", "Done"] as const).map((f, i) => (
            <button key={f} className={cn("flex-1 rounded-lg px-2 py-1.5 font-medium", i === 0 ? "bg-blue-600 text-white" : "text-muted-foreground")}>{f}</button>
          ))}
        </div>
      </div>
      {tasks.map((t) => (
        <button key={t.id} onClick={() => onOpenTask(t)} className="flex w-full items-start gap-2 rounded-xl bg-white p-3 text-left shadow ring-1 ring-slate-200">
          <div className={cn("mt-0.5 h-9 w-1 rounded-full", t.priority === "High" ? "bg-rose-500" : t.priority === "Medium" ? "bg-amber-500" : "bg-slate-300")} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[12.5px] font-medium text-foreground">{t.title}</span>
              <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold", statusTone(t.status))}>{t.status}</span>
            </div>
            <div className="mt-0.5 truncate text-[10.5px] text-muted-foreground">{t.location} · {t.deadline}</div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${t.progress}%` }} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function PhoneAttendance({ checkedIn, onToggle }: { checkedIn: boolean; onToggle: () => void }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white p-4 text-center shadow ring-1 ring-slate-200">
        <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">Today</div>
        <div className="mt-1 text-[22px] font-semibold text-foreground">{checkedIn ? "06:42:12" : "00:00:00"}</div>
        <div className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-emerald-600"><MapPin size={10} />Sector 18, Noida · Inside geofence</div>
        <button onClick={onToggle} className={cn("mt-3 w-full rounded-lg py-2.5 text-[13px] font-semibold text-white", checkedIn ? "bg-rose-500" : "bg-blue-600")}>
          {checkedIn ? "Check Out" : "Check In"}
        </button>
      </div>
      <div className="rounded-xl bg-white p-3 shadow ring-1 ring-slate-200">
        <div className="text-[12px] font-semibold text-foreground">This week</div>
        <ul className="mt-2 space-y-1.5 text-[11.5px]">
          {[
            { d: "Mon", in: "09:02", out: "18:11", h: "9.1" },
            { d: "Tue", in: "09:08", out: "18:02", h: "8.9" },
            { d: "Wed", in: "08:55", out: "17:54", h: "9.0" },
            { d: "Thu", in: "09:14", out: "18:20", h: "9.1" },
            { d: "Fri", in: "09:02", out: "—", h: "6.4" },
          ].map((r) => (
            <li key={r.d} className="flex items-center justify-between border-b border-slate-100 py-1 last:border-0">
              <span className="font-medium text-foreground">{r.d}</span>
              <span className="text-muted-foreground">{r.in} → {r.out}</span>
              <span className="font-medium text-foreground">{r.h} h</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhoneNotif() {
  const items = [
    { t: "New task assigned", d: "T-2045 · Cabling Repair — Block C", time: "2m", tone: "blue" },
    { t: "Reminder", d: "T-2041 deadline at 4:00 PM", time: "20m", tone: "amber" },
    { t: "Admin message", d: "Please share photo proof for T-2042.", time: "1h", tone: "slate" },
    { t: "Geo-fence alert", d: "You exited the assigned zone.", time: "2h", tone: "rose" },
  ];
  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <ul className="space-y-2">
      {items.map((n, i) => (
        <li key={i} className="flex items-start gap-2 rounded-xl bg-white p-3 shadow ring-1 ring-slate-200">
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", tones[n.tone])}>
            <BellRing size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium text-foreground">{n.t}</div>
            <div className="truncate text-[10.5px] text-muted-foreground">{n.d}</div>
          </div>
          <span className="text-[10px] text-muted-foreground">{n.time}</span>
        </li>
      ))}
    </ul>
  );
}

function PhoneTaskSheet({ task, onClose, onMove }: { task: Task; onClose: () => void; onMove: (s: TaskStatus) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="text-[14px] font-semibold text-foreground">Task details</div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", priorityTone(task.priority))}>{task.priority}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", statusTone(task.status))}>{task.status}</span>
          </div>
          <div className="mt-2 text-[15px] font-semibold text-foreground">{task.title}</div>
          <p className="mt-1 text-[12.5px] text-muted-foreground">{task.description}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
            <div className="rounded-lg border border-border p-2">
              <div className="text-muted-foreground">Deadline</div>
              <div className="mt-0.5 font-medium text-foreground">{task.deadline}</div>
            </div>
            <div className="rounded-lg border border-border p-2">
              <div className="text-muted-foreground">Location</div>
              <div className="mt-0.5 font-medium text-foreground">{task.location}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button onClick={() => onMove("Accepted")} className="rounded-lg border border-border bg-white py-2 text-[12px] font-semibold text-foreground hover:bg-accent">
              <span className="inline-flex items-center justify-center gap-1"><Check size={12} />Accept</span>
            </button>
            <button onClick={() => onMove("In Progress")} className="rounded-lg bg-amber-500 py-2 text-[12px] font-semibold text-white hover:bg-amber-600">
              <span className="inline-flex items-center justify-center gap-1"><Play size={12} />Start</span>
            </button>
            <button onClick={() => onMove("Completed")} className="rounded-lg bg-emerald-600 py-2 text-[12px] font-semibold text-white hover:bg-emerald-700">
              <span className="inline-flex items-center justify-center gap-1"><CheckCircle2 size={12} />Done</span>
            </button>
          </div>
          <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-[12px] text-muted-foreground hover:bg-accent">
            <Camera size={14} /> Upload photo proof
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Create Task Drawer ----------------------------- */

function CreateTaskDrawer({
  employees,
  onClose,
  onCreate,
}: {
  employees: Employee[];
  onClose: () => void;
  onCreate: (t: Task) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignee, setAssignee] = useState(employees[0].id);
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("Today, 6:00 PM");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");

  function submit() {
    const emp = employees.find((e) => e.id === assignee)!;
    const t: Task = {
      id: `T-${2050 + Math.floor(Math.random() * 900)}`,
      title: title || "New field task",
      description: desc || "—",
      assignee: emp.name,
      assigneeId: emp.id,
      location: location || emp.location,
      deadline,
      priority,
      status: "Assigned",
      progress: 0,
    };
    onCreate(t);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-[14px] font-semibold text-foreground">Create task</div>
            <div className="text-[12px] text-muted-foreground">Assign to a field employee — they will see it instantly.</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Site survey — Plot 22" className="h-9 w-full rounded-md border border-border px-2.5 text-[13px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15" />
          </Field>
          <Field label="Description">
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full rounded-md border border-border px-2.5 py-2 text-[13px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15" placeholder="What needs to be done?" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Assign to">
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="h-9 w-full rounded-md border border-border bg-white px-2 text-[13px] focus:border-blue-500 focus:outline-none">
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className="h-9 w-full rounded-md border border-border bg-white px-2 text-[13px] focus:border-blue-500 focus:outline-none">
                {(["Low", "Medium", "High"] as const).map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Location">
            <div className="relative">
              <MapPin size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Pick on map / address" className="h-9 w-full rounded-md border border-border pl-8 pr-2 text-[13px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15" />
            </div>
          </Field>
          <Field label="Deadline">
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-9 w-full rounded-md border border-border px-2.5 text-[13px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15" />
          </Field>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-[12px] text-blue-900">
            <div className="flex items-center gap-2 font-medium"><MoreHorizontal size={14} />What happens next</div>
            <ul className="mt-1 list-disc pl-5">
              <li>The employee gets a push notification.</li>
              <li>The task appears in their app instantly.</li>
              <li>Status updates sync back to the dashboard.</li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button onClick={onClose} className="h-9 rounded-md border border-border bg-white px-3 text-[13px] font-medium text-foreground hover:bg-accent">Cancel</button>
          <button onClick={submit} className="h-9 rounded-md bg-blue-600 px-3 text-[13px] font-semibold text-white hover:bg-blue-700">Create & Assign</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[12px] font-medium text-foreground">{label}</div>
      {children}
    </label>
  );
}

/* ----------------------------- Settings View ----------------------------- */

function SettingsView() {
  const sections: { key: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { key: "general", label: "General", icon: SettingsIcon },
    { key: "policies", label: "Policies", icon: Shield },
    { key: "roles", label: "Roles & Permissions", icon: Users },
    { key: "geofence", label: "Geofence & Tracking", icon: MapPin },
    { key: "notifications", label: "Notifications", icon: BellRing },
    { key: "integrations", label: "Integrations", icon: Zap },
  ];
  const [active, setActive] = useState<string>("general");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
      {/* Side nav */}
      <Card className="h-fit p-2">
        <ul className="flex flex-col gap-0.5">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => setActive(s.key)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon size={14} />
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Panel */}
      <div className="space-y-4">
        {active === "general" && (
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-foreground">General</h3>
            <p className="text-[12px] text-muted-foreground">Organization-level defaults for FieldSense.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SettingField label="Organization Name">
                <input defaultValue="Logicon Industries Pvt. Ltd." className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px]" />
              </SettingField>
              <SettingField label="Default Timezone">
                <select className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px]">
                  <option>Asia/Kolkata (IST)</option>
                  <option>Asia/Dubai</option>
                  <option>UTC</option>
                </select>
              </SettingField>
              <SettingField label="Working Days">
                <input defaultValue="Mon, Tue, Wed, Thu, Fri, Sat" className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px]" />
              </SettingField>
              <SettingField label="Shift Hours">
                <input defaultValue="09:00 — 18:00" className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px]" />
              </SettingField>
            </div>
          </Card>
        )}

        {active === "policies" && (
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-foreground">Attendance & Task Policies</h3>
            <p className="text-[12px] text-muted-foreground">These rules drive auto-detection across modules.</p>
            <div className="mt-4 space-y-3">
              <ToggleRow label="Mark late check-in after grace period" hint="Grace: 15 min after shift start" defaultOn />
              <ToggleRow label="Require photo proof on task completion" hint="Applied to all field tasks" defaultOn />
              <ToggleRow label="Auto-flag overdue tasks" hint="Trigger 30 min after deadline" defaultOn />
              <ToggleRow label="Allow offline mode (sync later)" hint="Mobile app caches actions" defaultOn />
              <ToggleRow label="Idle detection" hint="No movement for 20+ min during shift" />
            </div>
          </Card>
        )}

        {active === "roles" && (
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">Roles & Permissions</h3>
                <p className="text-[12px] text-muted-foreground">Who can do what across FieldSense.</p>
              </div>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-[12px] font-medium text-white hover:bg-blue-700">
                <Plus size={12} /> Add Role
              </button>
            </div>
            <table className="w-full text-[13px]">
              <thead className="bg-slate-50 text-[12px] text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 text-left font-medium">Role</th>
                  <th className="px-3 py-2.5 text-left font-medium">Tasks</th>
                  <th className="px-3 py-2.5 text-left font-medium">Attendance</th>
                  <th className="px-3 py-2.5 text-left font-medium">Tracking</th>
                  <th className="px-3 py-2.5 text-left font-medium">Reports</th>
                  <th className="px-5 py-2.5 text-left font-medium">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { role: "Admin", perms: ["Full", "Full", "Full", "Full", "Full"] },
                  { role: "Manager", perms: ["Assign/View", "View Team", "View Team", "View", "—"] },
                  { role: "Supervisor", perms: ["Assign", "Approve", "View Team", "View", "—"] },
                  { role: "Employee", perms: ["Self only", "Self only", "Self only", "—", "—"] },
                ].map((r) => (
                  <tr key={r.role}>
                    <td className="px-5 py-3 font-medium text-foreground">{r.role}</td>
                    {r.perms.map((p, i) => (
                      <td key={i} className={cn("px-3 py-3", i === r.perms.length - 1 && "px-5")}>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                          p === "Full" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : p === "—" ? "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                            : "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
                        )}>{p}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {active === "geofence" && (
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-foreground">Geofence & Live Tracking</h3>
            <p className="text-[12px] text-muted-foreground">Controls how location data is captured and validated.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SettingField label="Check-in geofence radius">
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={150} className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px]" />
                  <span className="text-[12px] text-muted-foreground">meters</span>
                </div>
              </SettingField>
              <SettingField label="Location ping interval">
                <select className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px]">
                  <option>30 seconds</option>
                  <option>1 minute</option>
                  <option>5 minutes</option>
                </select>
              </SettingField>
              <SettingField label="Idle threshold">
                <input defaultValue="20 minutes" className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px]" />
              </SettingField>
              <SettingField label="Battery saver mode">
                <select className="h-9 w-full rounded-md border border-border bg-background px-3 text-[13px]">
                  <option>Auto (below 20%)</option>
                  <option>Always on</option>
                  <option>Off</option>
                </select>
              </SettingField>
            </div>
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <ToggleRow label="Enforce geofence on check-in" hint="Block check-ins outside the radius" defaultOn />
              <ToggleRow label="Background tracking during shift" defaultOn />
              <ToggleRow label="Store route history (90 days)" defaultOn />
            </div>
          </Card>
        )}

        {active === "notifications" && (
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-foreground">Notifications</h3>
            <p className="text-[12px] text-muted-foreground">Channel preferences for admin and field alerts.</p>
            <div className="mt-4 grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 gap-y-3 text-[13px]">
              <div className="text-[12px] font-medium text-muted-foreground">Event</div>
              <div className="text-[12px] font-medium text-muted-foreground">Push</div>
              <div className="text-[12px] font-medium text-muted-foreground">Email</div>
              <div className="text-[12px] font-medium text-muted-foreground">SMS</div>
              {[
                { e: "New task assigned", v: [true, true, false] },
                { e: "Task completed", v: [true, false, false] },
                { e: "Late check-in", v: [true, true, true] },
                { e: "Overdue task", v: [true, true, false] },
                { e: "Geofence exit", v: [true, false, true] },
              ].map((row) => (
                <RowGroup key={row.e} label={row.e} values={row.v} />
              ))}
            </div>
          </Card>
        )}

        {active === "integrations" && (
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-foreground">Integrations</h3>
            <p className="text-[12px] text-muted-foreground">Connect FieldSense data with other Logicon modules.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { name: "HRMS — Attendance sync", status: "Connected" },
                { name: "Payroll — Hours export", status: "Connected" },
                { name: "Sales — Visit logs", status: "Connected" },
                { name: "Tickets — Field jobs", status: "Not connected" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-[13px] font-medium text-foreground">{i.name}</div>
                    <div className="text-[11px] text-muted-foreground">{i.status}</div>
                  </div>
                  <button className={cn(
                    "h-8 rounded-md px-3 text-[12px] font-medium",
                    i.status === "Connected"
                      ? "border border-border bg-background text-foreground hover:bg-accent"
                      : "bg-blue-600 text-white hover:bg-blue-700",
                  )}>{i.status === "Connected" ? "Manage" : "Connect"}</button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <button className="h-9 rounded-md border border-border bg-background px-4 text-[13px] font-medium hover:bg-accent">Cancel</button>
          <button className="h-9 rounded-md bg-blue-600 px-4 text-[13px] font-medium text-white hover:bg-blue-700">Save changes</button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, hint, defaultOn }: { label: string; hint?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <div>
        <div className="text-[13px] font-medium text-foreground">{label}</div>
        {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          on ? "bg-blue-600" : "bg-slate-300",
        )}
        aria-pressed={on}
      >
        <span className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
          on ? "left-[18px]" : "left-0.5",
        )} />
      </button>
    </div>
  );
}

function RowGroup({ label, values }: { label: string; values: boolean[] }) {
  return (
    <>
      <div className="text-[13px] text-foreground">{label}</div>
      {values.map((v, i) => (
        <input key={i} type="checkbox" defaultChecked={v} className="h-4 w-4 justify-self-center rounded border-border accent-blue-600" />
      ))}
    </>
  );
}
