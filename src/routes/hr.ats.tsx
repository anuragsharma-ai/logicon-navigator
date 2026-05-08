import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Users,
  Building2,
  Briefcase,
  ClipboardList,
  UserCheck,
  Send,
  Wallet,
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  MapPin,
  Calendar,
  FileText,
  Shield,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/hr/ats")({
  component: ATSPage,
});

// ===================== Types & Seed Data =====================
type MRFStatus = "Pending" | "In Hiring" | "Approved" | "Closed" | "Rejected";
type Priority = "High" | "Medium" | "Low";
type ReqType = "New" | "Replacement" | "Backfill";
type BillingType = "Billable" | "Non-Billable";
type EmpStatus = "Active" | "Inactive" | "On Leave" | "Resigned";
type OfferStatus = "Draft" | "Sent" | "Accepted" | "Rejected";
type DeployStatus = "Deployed" | "Pending" | "On Hold";
type InvStatus = "Paid" | "Pending" | "Overdue";

type MRF = {
  id: string;
  client: string;
  site: string;
  role: string;
  openings: number;
  filled: number;
  budget: number;
  reqType: ReqType;
  priority: Priority;
  billing: BillingType;
  status: MRFStatus;
  createdBy: string;
  createdAt: string;
  funnel: { applied: number; shortlisted: number; interviewed: number; offered: number; joined: number };
};

type Employee = {
  id: string;
  name: string;
  empId: string;
  role: string;
  site: string;
  client: string;
  joining: string;
  salary: number;
  status: EmpStatus;
  email: string;
  phone: string;
};

type Offer = {
  id: string;
  candidate: string;
  role: string;
  site: string;
  client: string;
  salary: number;
  joining: string;
  empType: string;
  status: OfferStatus;
};

type Deployment = {
  id: string;
  employee: string;
  role: string;
  site: string;
  client: string;
  deployedOn: string;
  status: DeployStatus;
  supervisor: string;
};

type BillingRow = {
  id: string;
  client: string;
  site: string;
  type: BillingType;
  headcount: number;
  salaryCost: number;
  billing: number;
  status: InvStatus;
};

type ActivityLog = {
  id: string;
  user: string;
  action: string;
  module: string;
  description: string;
  timestamp: string;
  ip: string;
  status: "Success" | "Failed" | "Warning";
};

const ROLES = ["Security Guard", "Housekeeping", "HVAC Technician", "Pantry Boy", "Maintenance Staff"];
const CLIENTS = ["Tata Realty", "Embassy Group", "DLF Cyber City", "Brigade Enterprises", "Prestige Estates"];
const SITES = ["BKC Tower A", "Embassy Manyata", "Cyber Hub Block 3", "Brigade Gateway", "Prestige Falcon City"];

const seedMRFs: MRF[] = [
  { id: "MRF-1042", client: "Tata Realty", site: "BKC Tower A", role: "Security Guard", openings: 20, filled: 14, budget: 18000, reqType: "New", priority: "High", billing: "Billable", status: "In Hiring", createdBy: "Anita Rao", createdAt: "2026-04-22", funnel: { applied: 86, shortlisted: 42, interviewed: 28, offered: 18, joined: 14 } },
  { id: "MRF-1043", client: "Embassy Group", site: "Embassy Manyata", role: "Housekeeping", openings: 15, filled: 15, budget: 14500, reqType: "Replacement", priority: "Medium", billing: "Billable", status: "Closed", createdBy: "Vikram Shah", createdAt: "2026-04-19", funnel: { applied: 60, shortlisted: 30, interviewed: 22, offered: 16, joined: 15 } },
  { id: "MRF-1044", client: "DLF Cyber City", site: "Cyber Hub Block 3", role: "HVAC Technician", openings: 5, filled: 1, budget: 32000, reqType: "New", priority: "High", billing: "Billable", status: "In Hiring", createdBy: "Anita Rao", createdAt: "2026-04-28", funnel: { applied: 24, shortlisted: 9, interviewed: 4, offered: 2, joined: 1 } },
  { id: "MRF-1045", client: "Brigade Enterprises", site: "Brigade Gateway", role: "Pantry Boy", openings: 8, filled: 0, budget: 13000, reqType: "Backfill", priority: "Low", billing: "Non-Billable", status: "Pending", createdBy: "Rohit Mehta", createdAt: "2026-05-01", funnel: { applied: 12, shortlisted: 4, interviewed: 0, offered: 0, joined: 0 } },
  { id: "MRF-1046", client: "Prestige Estates", site: "Prestige Falcon City", role: "Maintenance Staff", openings: 10, filled: 6, budget: 17500, reqType: "New", priority: "Medium", billing: "Billable", status: "Approved", createdBy: "Anita Rao", createdAt: "2026-05-03", funnel: { applied: 45, shortlisted: 22, interviewed: 14, offered: 8, joined: 6 } },
  { id: "MRF-1047", client: "Tata Realty", site: "BKC Tower A", role: "Housekeeping", openings: 6, filled: 0, budget: 14000, reqType: "Replacement", priority: "Medium", billing: "Billable", status: "Rejected", createdBy: "Vikram Shah", createdAt: "2026-05-05", funnel: { applied: 0, shortlisted: 0, interviewed: 0, offered: 0, joined: 0 } },
];

const seedEmployees: Employee[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `e${i + 1}`,
  name: ["Ravi Kumar", "Suresh Patil", "Anil Verma", "Mahesh Nair", "Pooja Devi", "Kiran Rao", "Deepak Yadav", "Sushma Iyer", "Manoj Tiwari", "Lakshmi M", "Joseph K", "Pradeep Singh", "Asha Pillai", "Rakesh Jain"][i],
  empId: `EMP-${2200 + i}`,
  role: ROLES[i % ROLES.length],
  site: SITES[i % SITES.length],
  client: CLIENTS[i % CLIENTS.length],
  joining: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}`,
  salary: 14000 + (i % 5) * 1800,
  status: (["Active", "Active", "On Leave", "Active", "Resigned", "Active", "Inactive"] as EmpStatus[])[i % 7],
  email: `emp${i + 1}@logicon.io`,
  phone: `+91 90000 ${10000 + i}`,
}));

const seedOffers: Offer[] = [
  { id: "OF-501", candidate: "Ramesh Bhat", role: "Security Guard", site: "BKC Tower A", client: "Tata Realty", salary: 18000, joining: "2026-05-15", empType: "Full-time", status: "Sent" },
  { id: "OF-502", candidate: "Priya Sharma", role: "Housekeeping", site: "Embassy Manyata", client: "Embassy Group", salary: 14500, joining: "2026-05-12", empType: "Full-time", status: "Accepted" },
  { id: "OF-503", candidate: "Naveen R", role: "HVAC Technician", site: "Cyber Hub Block 3", client: "DLF Cyber City", salary: 32000, joining: "2026-05-20", empType: "Contract", status: "Draft" },
  { id: "OF-504", candidate: "Sunita Devi", role: "Pantry Boy", site: "Brigade Gateway", client: "Brigade Enterprises", salary: 13000, joining: "2026-05-18", empType: "Full-time", status: "Rejected" },
  { id: "OF-505", candidate: "Arjun Mehta", role: "Maintenance Staff", site: "Prestige Falcon City", client: "Prestige Estates", salary: 17500, joining: "2026-05-22", empType: "Full-time", status: "Sent" },
];

const seedDeploys: Deployment[] = [
  { id: "DP-301", employee: "Ravi Kumar", role: "Security Guard", site: "BKC Tower A", client: "Tata Realty", deployedOn: "2026-04-25", status: "Deployed", supervisor: "Anita Rao" },
  { id: "DP-302", employee: "Suresh Patil", role: "Housekeeping", site: "Embassy Manyata", client: "Embassy Group", deployedOn: "2026-04-26", status: "Deployed", supervisor: "Vikram Shah" },
  { id: "DP-303", employee: "Mahesh Nair", role: "HVAC Technician", site: "Cyber Hub Block 3", client: "DLF Cyber City", deployedOn: "2026-05-02", status: "Pending", supervisor: "Anita Rao" },
  { id: "DP-304", employee: "Pooja Devi", role: "Pantry Boy", site: "Brigade Gateway", client: "Brigade Enterprises", deployedOn: "2026-05-04", status: "On Hold", supervisor: "Rohit Mehta" },
  { id: "DP-305", employee: "Kiran Rao", role: "Maintenance Staff", site: "Prestige Falcon City", client: "Prestige Estates", deployedOn: "2026-05-05", status: "Deployed", supervisor: "Anita Rao" },
];

const seedBilling: BillingRow[] = CLIENTS.map((c, i) => ({
  id: `BL-${100 + i}`,
  client: c,
  site: SITES[i],
  type: i % 4 === 3 ? "Non-Billable" : "Billable",
  headcount: 18 + i * 6,
  salaryCost: (18 + i * 6) * 16000,
  billing: (18 + i * 6) * 22500,
  status: (["Paid", "Pending", "Overdue", "Paid", "Pending"] as InvStatus[])[i],
}));

const seedActivities: ActivityLog[] = [
  { id: "A1", user: "Anita Rao", action: "Created MRF", module: "MRF", description: "MRF-1044 for HVAC Technician at Cyber Hub", timestamp: "2026-05-08 09:42", ip: "10.4.2.18", status: "Success" },
  { id: "A2", user: "Vikram Shah", action: "Offer Sent", module: "Offers", description: "Offer OF-501 sent to Ramesh Bhat", timestamp: "2026-05-08 10:11", ip: "10.4.2.22", status: "Success" },
  { id: "A3", user: "System", action: "Deployment", module: "Deployment", description: "Ravi Kumar deployed to BKC Tower A", timestamp: "2026-05-08 11:03", ip: "—", status: "Success" },
  { id: "A4", user: "Rohit Mehta", action: "Permission Change", module: "Admin", description: "Granted approver role to Anita Rao", timestamp: "2026-05-08 12:20", ip: "10.4.2.30", status: "Warning" },
  { id: "A5", user: "Anita Rao", action: "Login", module: "Auth", description: "Sign-in from new device", timestamp: "2026-05-08 13:01", ip: "10.4.2.18", status: "Success" },
  { id: "A6", user: "Vikram Shah", action: "Candidate Status", module: "ATS", description: "Naveen R moved to Interview", timestamp: "2026-05-08 14:25", ip: "10.4.2.22", status: "Success" },
  { id: "A7", user: "System", action: "Invoice Overdue", module: "Billing", description: "DLF Cyber City invoice 7 days overdue", timestamp: "2026-05-08 15:00", ip: "—", status: "Failed" },
];

// ===================== Page =====================
function ATSPage() {
  const [tab, setTab] = useState("dashboard");
  const [mrfs] = useState<MRF[]>(seedMRFs);
  const [employees] = useState<Employee[]>(seedEmployees);
  const [offers] = useState<Offer[]>(seedOffers);
  const [deploys] = useState<Deployment[]>(seedDeploys);
  const [billing] = useState<BillingRow[]>(seedBilling);
  const [activities] = useState<ActivityLog[]>(seedActivities);

  const [selectedMRF, setSelectedMRF] = useState<MRF | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedDeploy, setSelectedDeploy] = useState<Deployment | null>(null);

  return (
    <AppLayout>
      <div className="flex flex-col bg-background">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Business Module</span>
                <ChevronRight className="h-3 w-3" />
                <span>HR</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">ATS</span>
              </div>
              <h1 className="mt-0.5 text-[22px] font-semibold tracking-tight text-foreground">
                Applicant Tracking System
              </h1>
              <p className="text-sm text-muted-foreground">
                Clients, sites, MRFs, candidates, offers, deployment, billing & profitability — one connected workflow.
              </p>
            </div>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="mt-4">
            <TabsList className="bg-secondary/60">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="mrfs">MRFs</TabsTrigger>
              <TabsTrigger value="employees">Employee Directory</TabsTrigger>
              <TabsTrigger value="offers">Offers &amp; Deployment</TabsTrigger>
              <TabsTrigger value="billing">Billing &amp; Profit</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Body */}
        <div className="p-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsContent value="dashboard" className="mt-0">
              <DashboardView mrfs={mrfs} employees={employees} offers={offers} deploys={deploys} billing={billing} activities={activities} />
            </TabsContent>
            <TabsContent value="mrfs" className="mt-0">
              <MRFsView mrfs={mrfs} onOpen={setSelectedMRF} />
            </TabsContent>
            <TabsContent value="employees" className="mt-0">
              <EmployeesView employees={employees} onOpen={setSelectedEmp} />
            </TabsContent>
            <TabsContent value="offers" className="mt-0">
              <OffersDeploymentView offers={offers} deploys={deploys} onOffer={setSelectedOffer} onDeploy={setSelectedDeploy} />
            </TabsContent>
            <TabsContent value="billing" className="mt-0">
              <BillingView billing={billing} />
            </TabsContent>
            <TabsContent value="activity" className="mt-0">
              <ActivityView activities={activities} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Drawers */}
        <Sheet open={!!selectedMRF} onOpenChange={(o) => !o && setSelectedMRF(null)}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
            {selectedMRF && <MRFDetail mrf={selectedMRF} />}
          </SheetContent>
        </Sheet>
        <Sheet open={!!selectedEmp} onOpenChange={(o) => !o && setSelectedEmp(null)}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
            {selectedEmp && <EmployeeDetail emp={selectedEmp} />}
          </SheetContent>
        </Sheet>
        <Sheet open={!!selectedOffer} onOpenChange={(o) => !o && setSelectedOffer(null)}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
            {selectedOffer && <OfferDetail offer={selectedOffer} />}
          </SheetContent>
        </Sheet>
        <Sheet open={!!selectedDeploy} onOpenChange={(o) => !o && setSelectedDeploy(null)}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
            {selectedDeploy && <DeploymentDetail dep={selectedDeploy} />}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}

// ===================== Shared UI =====================
function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  tone = "primary",
  spark,
}: {
  icon: any;
  label: string;
  value: string;
  trend?: { dir: "up" | "down"; value: string };
  tone?: "primary" | "emerald" | "amber" | "rose" | "indigo" | "slate";
  spark?: number[];
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
    slate: "bg-slate-100 text-slate-600",
  } as const;
  const max = Math.max(...(spark ?? [1]));
  return (
    <Card className="rounded-2xl border-border/70 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
              trend.dir === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
            )}
          >
            {trend.dir === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-3 text-[13px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[22px] font-semibold tracking-tight text-foreground">{value}</div>
      {spark && (
        <div className="mt-2 flex h-8 items-end gap-0.5">
          {spark.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-primary/30"
              style={{ height: `${(v / max) * 100}%` }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Deployed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Closed: "bg-slate-100 text-slate-700 ring-slate-200",
    Inactive: "bg-slate-100 text-slate-700 ring-slate-200",
    Draft: "bg-slate-100 text-slate-700 ring-slate-200",
    "On Leave": "bg-amber-50 text-amber-700 ring-amber-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "In Hiring": "bg-indigo-50 text-indigo-700 ring-indigo-200",
    Sent: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    "On Hold": "bg-amber-50 text-amber-700 ring-amber-200",
    Warning: "bg-amber-50 text-amber-700 ring-amber-200",
    Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
    Resigned: "bg-rose-50 text-rose-700 ring-rose-200",
    Overdue: "bg-rose-50 text-rose-700 ring-rose-200",
    Failed: "bg-rose-50 text-rose-700 ring-rose-200",
    Success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    High: "bg-rose-50 text-rose-700 ring-rose-200",
    Medium: "bg-amber-50 text-amber-700 ring-amber-200",
    Low: "bg-slate-100 text-slate-700 ring-slate-200",
    Billable: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "Non-Billable": "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        map[status] ?? "bg-slate-100 text-slate-700 ring-slate-200",
      )}
    >
      {status}
    </span>
  );
}

function SectionCard({ title, subtitle, action, children, className }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("rounded-2xl border-border/70 p-5 shadow-sm", className)}>
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

// ===================== 1. Dashboard =====================
function DashboardView({ mrfs, employees, offers, deploys, billing, activities }: { mrfs: MRF[]; employees: Employee[]; offers: Offer[]; deploys: Deployment[]; billing: BillingRow[]; activities: ActivityLog[] }) {
  const totalRevenue = billing.reduce((s, b) => s + b.billing, 0);
  const totalCost = billing.reduce((s, b) => s + b.salaryCost, 0);
  const profit = totalRevenue - totalCost;
  const openMRF = mrfs.filter((m) => m.status === "In Hiring" || m.status === "Pending").length;
  const pipeline = mrfs.reduce((s, m) => s + m.funnel.applied, 0);
  const pendingOffers = offers.filter((o) => o.status === "Sent" || o.status === "Draft").length;
  const activeDeploy = deploys.filter((d) => d.status === "Deployed").length;
  const successRate = Math.round((activeDeploy / deploys.length) * 100);

  const funnel = mrfs.reduce(
    (a, m) => ({
      applied: a.applied + m.funnel.applied,
      shortlisted: a.shortlisted + m.funnel.shortlisted,
      interviewed: a.interviewed + m.funnel.interviewed,
      offered: a.offered + m.funnel.offered,
      joined: a.joined + m.funnel.joined,
    }),
    { applied: 0, shortlisted: 0, interviewed: 0, offered: 0, joined: 0 },
  );

  const distribution = ROLES.map((r) => ({
    role: r,
    count: employees.filter((e) => e.role === r).length,
  }));
  const distTotal = distribution.reduce((s, d) => s + d.count, 0) || 1;

  const monthly = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => ({
    m,
    rev: 4.2 + i * 0.6 + (i % 2 ? 0.3 : 0),
    profit: 1.1 + i * 0.22 + (i % 3 ? 0.15 : 0),
  }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard icon={Building2} label="Total Clients" value={String(CLIENTS.length)} trend={{ dir: "up", value: "+2" }} tone="primary" spark={[3, 4, 5, 5, 6, 7]} />
        <KpiCard icon={MapPin} label="Active Sites" value={String(SITES.length)} trend={{ dir: "up", value: "+1" }} tone="indigo" spark={[2, 3, 4, 4, 5, 5]} />
        <KpiCard icon={Users} label="Active Workforce" value={String(employees.filter((e) => e.status === "Active").length)} trend={{ dir: "up", value: "+8%" }} tone="emerald" spark={[8, 9, 10, 11, 12, 14]} />
        <KpiCard icon={ClipboardList} label="Open MRFs" value={String(openMRF)} trend={{ dir: "up", value: "+3" }} tone="amber" spark={[2, 3, 4, 3, 4, 5]} />
        <KpiCard icon={Briefcase} label="Pipeline Candidates" value={String(pipeline)} trend={{ dir: "up", value: "+12%" }} tone="indigo" spark={[120, 140, 160, 170, 200, 227]} />
        <KpiCard icon={Send} label="Pending Offers" value={String(pendingOffers)} trend={{ dir: "down", value: "-1" }} tone="amber" spark={[5, 4, 5, 4, 3, 3]} />
        <KpiCard icon={UserCheck} label="Active Deployments" value={String(activeDeploy)} trend={{ dir: "up", value: "+5" }} tone="emerald" spark={[10, 12, 13, 14, 16, 18]} />
        <KpiCard icon={Wallet} label="Monthly Billing" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} trend={{ dir: "up", value: "+9.2%" }} tone="primary" spark={[40, 45, 48, 52, 56, 62]} />
        <KpiCard icon={TrendingUp} label="Monthly Profit" value={`₹${(profit / 100000).toFixed(1)}L`} trend={{ dir: "up", value: "+11.4%" }} tone="emerald" spark={[10, 12, 14, 16, 18, 22]} />
        <KpiCard icon={CheckCircle2} label="Deployment Success" value={`${successRate}%`} trend={{ dir: "up", value: "+2.1%" }} tone="emerald" spark={[80, 82, 84, 86, 88, 90]} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Billing & Profit Trend */}
        <SectionCard className="lg:col-span-2" title="Billing & Profit Trend" subtitle="Monthly revenue vs profit (₹ Lakhs)" action={<Badge variant="secondary" className="rounded-md">Last 6 months</Badge>}>
          <div className="flex h-56 items-end gap-3">
            {monthly.map((d) => {
              const maxV = Math.max(...monthly.map((x) => x.rev));
              return (
                <div key={d.m} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-full w-full items-end justify-center gap-1">
                    <div className="w-3 rounded-t bg-primary/80" style={{ height: `${(d.rev / maxV) * 100}%` }} title={`Revenue ₹${d.rev.toFixed(1)}L`} />
                    <div className="w-3 rounded-t bg-emerald-400" style={{ height: `${(d.profit / maxV) * 100}%` }} title={`Profit ₹${d.profit.toFixed(1)}L`} />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.m}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary/80" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-400" /> Profit</span>
          </div>
        </SectionCard>

        {/* Workforce Distribution */}
        <SectionCard title="Workforce Distribution" subtitle="Headcount by role">
          <Donut segments={distribution.map((d, i) => ({ label: d.role, value: d.count, color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"][i] }))} total={distTotal} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Funnel */}
        <SectionCard title="Recruitment Funnel" subtitle="Applied → Joined">
          <div className="space-y-2">
            {([
              ["Applied", funnel.applied],
              ["Shortlisted", funnel.shortlisted],
              ["Interviewed", funnel.interviewed],
              ["Offered", funnel.offered],
              ["Joined", funnel.joined],
            ] as [string, number][]).map(([k, v], i) => {
              const pct = (v / Math.max(funnel.applied, 1)) * 100;
              return (
                <div key={k}>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${pct}%`, background: ["#3b82f6", "#6366f1", "#8b5cf6", "#f59e0b", "#10b981"][i] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Site-wise analytics */}
        <SectionCard className="lg:col-span-2" title="Site-wise Workforce Analytics" subtitle="Headcount, vacancies, billable mix">
          <div className="overflow-hidden rounded-xl border border-border/70">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-[12px] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Site</th>
                  <th className="px-3 py-2 text-right font-medium">Headcount</th>
                  <th className="px-3 py-2 text-right font-medium">Vacancy</th>
                  <th className="px-3 py-2 text-right font-medium">Billable</th>
                  <th className="px-3 py-2 text-right font-medium">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {SITES.map((s, i) => {
                  const head = employees.filter((e) => e.site === s).length;
                  const vac = mrfs.filter((m) => m.site === s).reduce((a, m) => a + (m.openings - m.filled), 0);
                  const util = Math.min(100, 70 + i * 6);
                  return (
                    <tr key={s} className="border-t border-border/60">
                      <td className="px-3 py-2 text-foreground">{s}</td>
                      <td className="px-3 py-2 text-right">{head}</td>
                      <td className="px-3 py-2 text-right">{vac}</td>
                      <td className="px-3 py-2 text-right">{Math.round(head * 0.85)}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="ml-auto flex w-28 items-center gap-2">
                          <Progress value={util} className="h-1.5" />
                          <span className="text-[11px] text-muted-foreground">{util}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="AI Hiring Insights" subtitle="Powered by FieldSense AI">
          <ul className="space-y-3 text-sm">
            <Insight icon={TrendingUp} tone="emerald" title="High demand role" desc="HVAC Technician requirements up 38% MoM" />
            <Insight icon={Clock} tone="amber" title="Delayed hiring" desc="Brigade Gateway pantry roles >7 days open" />
            <Insight icon={AlertTriangle} tone="rose" title="Candidate shortage" desc="Maintenance Staff shortlist below threshold" />
            <Insight icon={CheckCircle2} tone="emerald" title="Top recruiter" desc="Anita Rao closed 14 offers this week" />
          </ul>
        </SectionCard>

        <SectionCard title="Recent Activities" subtitle="Live updates across the workspace">
          <ul className="space-y-3">
            {activities.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{a.user.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate"><span className="font-medium text-foreground">{a.user}</span> <span className="text-muted-foreground">— {a.action.toLowerCase()}</span></div>
                  <div className="truncate text-[12px] text-muted-foreground">{a.description}</div>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{a.timestamp.split(" ")[1]}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Approvals Pending" subtitle="Action required">
          <ul className="space-y-2">
            {[
              { type: "MRF", id: "MRF-1045", note: "Pantry Boy — Brigade Gateway" },
              { type: "Offer", id: "OF-503", note: "Naveen R — HVAC Technician" },
              { type: "Deployment", id: "DP-303", note: "Mahesh Nair → Cyber Hub" },
              { type: "MRF", id: "MRF-1047", note: "Housekeeping — BKC" },
            ].map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/30 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-md text-[10px]">{p.type}</Badge>
                  <div>
                    <div className="font-medium text-foreground">{p.id}</div>
                    <div className="text-[11px] text-muted-foreground">{p.note}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-primary">Review <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

function Insight({ icon: Icon, tone, title, desc }: { icon: any; tone: "emerald" | "amber" | "rose"; title: string; desc: string }) {
  const t = { emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", rose: "bg-rose-50 text-rose-600" }[tone];
  return (
    <li className="flex items-start gap-3">
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", t)}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-foreground">{title}</div>
        <div className="text-[12px] text-muted-foreground">{desc}</div>
      </div>
    </li>
  );
}

function Donut({ segments, total }: { segments: { label: string; value: number; color: string }[]; total: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width="160" height="160" viewBox="0 0 160 160" className="shrink-0">
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="18" className="opacity-30" />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const dash = `${len} ${c - len}`;
          const offset = c - acc;
          acc += len;
          return (
            <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={dash} strokeDashoffset={offset} transform="rotate(-90 80 80)" />
          );
        })}
        <text x="80" y="76" textAnchor="middle" className="fill-foreground text-[20px] font-semibold">{total}</text>
        <text x="80" y="94" textAnchor="middle" className="fill-muted-foreground text-[10px]">Total</text>
      </svg>
      <ul className="flex-1 space-y-1.5 text-[12px]">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-medium text-foreground">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===================== 2. MRFs =====================
function MRFsView({ mrfs, onOpen }: { mrfs: MRF[]; onOpen: (m: MRF) => void }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [client, setClient] = useState("all");
  const [site, setSite] = useState("all");
  const [role, setRole] = useState("all");
  const [priority, setPriority] = useState("all");
  const [billing, setBilling] = useState("all");

  const rows = useMemo(() => mrfs.filter((m) => {
    if (q && !`${m.id} ${m.role} ${m.site} ${m.client}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (status !== "all" && m.status !== status) return false;
    if (client !== "all" && m.client !== client) return false;
    if (site !== "all" && m.site !== site) return false;
    if (role !== "all" && m.role !== role) return false;
    if (priority !== "all" && m.priority !== priority) return false;
    if (billing !== "all" && m.billing !== billing) return false;
    return true;
  }), [mrfs, q, status, client, site, role, priority, billing]);

  return (
    <div className="space-y-4">
      <SectionCard
        title="Manpower Requisitions"
        subtitle="All MRFs across sites with budget and status"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
            <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Create MRF</Button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search MRF, role, site…" className="h-9 w-[260px] pl-8" />
          </div>
          <FilterSelect value={status} onChange={setStatus} placeholder="Status" options={["Pending", "In Hiring", "Approved", "Closed", "Rejected"]} />
          <FilterSelect value={client} onChange={setClient} placeholder="Client" options={CLIENTS} />
          <FilterSelect value={site} onChange={setSite} placeholder="Site" options={SITES} />
          <FilterSelect value={role} onChange={setRole} placeholder="Role" options={ROLES} />
          <FilterSelect value={priority} onChange={setPriority} placeholder="Priority" options={["High", "Medium", "Low"]} />
          <FilterSelect value={billing} onChange={setBilling} placeholder="Billing" options={["Billable", "Non-Billable"]} />
        </div>

        {(status !== "all" || client !== "all" || site !== "all" || role !== "all" || priority !== "all" || billing !== "all" || q) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              ["Status", status, () => setStatus("all")],
              ["Client", client, () => setClient("all")],
              ["Site", site, () => setSite("all")],
              ["Role", role, () => setRole("all")],
              ["Priority", priority, () => setPriority("all")],
              ["Billing", billing, () => setBilling("all")],
            ].filter(([, v]) => v !== "all").map(([k, v, fn]) => (
              <Badge key={k as string} variant="secondary" className="cursor-pointer rounded-md" onClick={fn as any}>
                {k as string}: {v as string} <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary/70 text-[12px] text-muted-foreground">
              <tr>
                <Th>MRF ID</Th>
                <Th>Site / Client</Th>
                <Th>Role</Th>
                <Th>Filled</Th>
                <Th>Budget</Th>
                <Th>Type</Th>
                <Th>Priority</Th>
                <Th>Billing</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} onClick={() => onOpen(m)} className="cursor-pointer border-t border-border/60 hover:bg-secondary/40">
                  <Td className="font-medium text-primary">{m.id}</Td>
                  <Td>
                    <div className="font-medium text-foreground">{m.site}</div>
                    <div className="text-[11px] text-muted-foreground">{m.client}</div>
                  </Td>
                  <Td>{m.role}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium">{m.filled}/{m.openings}</span>
                      <Progress value={(m.filled / m.openings) * 100} className="h-1.5 w-20" />
                    </div>
                  </Td>
                  <Td>₹{m.budget.toLocaleString()}</Td>
                  <Td>{m.reqType}</Td>
                  <Td><StatusPill status={m.priority} /></Td>
                  <Td><StatusPill status={m.billing} /></Td>
                  <Td><StatusPill status={m.status} /></Td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={9} className="px-3 py-8 text-center text-sm text-muted-foreground">No MRFs match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function MRFDetail({ mrf }: { mrf: MRF }) {
  return (
    <div className="space-y-5 p-1">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{mrf.id}</div>
        <h2 className="text-xl font-semibold text-foreground">{mrf.role}</h2>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" /> {mrf.client} <span>•</span>
          <MapPin className="h-3.5 w-3.5" /> {mrf.site}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <StatusPill status={mrf.status} />
          <StatusPill status={mrf.priority} />
          <StatusPill status={mrf.billing} />
          <Badge variant="outline" className="rounded-md">{mrf.reqType}</Badge>
        </div>
      </div>

      <Section title="Requirement Details">
        <Grid2>
          <KV k="Openings" v={String(mrf.openings)} />
          <KV k="Filled" v={`${mrf.filled} / ${mrf.openings}`} />
          <KV k="Experience" v="1-3 yrs" />
          <KV k="Qualification" v="10th Pass / ITI" />
          <KV k="Gender" v="Any" />
          <KV k="Shift" v="Rotational (12h)" />
          <KV k="Uniform" v="Required" />
          <KV k="Cost Center" v="CC-OPS-04" />
        </Grid2>
      </Section>

      <Section title="Budget & Billing">
        <Grid2>
          <KV k="Salary Budget" v={`₹${mrf.budget.toLocaleString()} / mo`} />
          <KV k="Billing Type" v={mrf.billing} />
          <KV k="OT Rules" v="1.5x after 9h" />
          <KV k="Margin Target" v="22%" />
        </Grid2>
      </Section>

      <Section title="Recruitment Progress">
        <div className="space-y-2">
          {([
            ["Applied", mrf.funnel.applied, "#3b82f6"],
            ["Shortlisted", mrf.funnel.shortlisted, "#6366f1"],
            ["Interviewed", mrf.funnel.interviewed, "#8b5cf6"],
            ["Offered", mrf.funnel.offered, "#f59e0b"],
            ["Joined", mrf.funnel.joined, "#10b981"],
          ] as [string, number, string][]).map(([k, v, c]) => (
            <div key={k}>
              <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
              <div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-2 rounded-full" style={{ width: `${(v / Math.max(mrf.funnel.applied, 1)) * 100}%`, background: c }} /></div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Workflow Timeline">
        <ol className="relative space-y-3 border-l border-border/70 pl-4">
          {[
            { t: "Created", by: mrf.createdBy, time: mrf.createdAt, ok: true },
            { t: "HR Approved", by: "Rohit Mehta", time: "2026-04-23", ok: true },
            { t: "Client Approved", by: mrf.client, time: "2026-04-24", ok: mrf.status !== "Pending" && mrf.status !== "Rejected" },
            { t: "Recruitment Started", by: "Anita Rao", time: "2026-04-25", ok: mrf.status === "In Hiring" || mrf.status === "Approved" || mrf.status === "Closed" },
            { t: "Closed", by: "—", time: "—", ok: mrf.status === "Closed" },
          ].map((s, i) => (
            <li key={i}>
              <span className={cn("absolute -left-[7px] mt-1 h-3 w-3 rounded-full ring-2 ring-background", s.ok ? "bg-emerald-500" : "bg-slate-300")} />
              <div className="text-[13px] font-medium text-foreground">{s.t}</div>
              <div className="text-[11px] text-muted-foreground">{s.by} · {s.time}</div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Activity Logs">
        <ul className="space-y-2 text-[12px]">
          <li className="rounded-md bg-secondary/40 px-3 py-2">MRF created by {mrf.createdBy}</li>
          <li className="rounded-md bg-secondary/40 px-3 py-2">Auto-shared with sourcing team</li>
          <li className="rounded-md bg-secondary/40 px-3 py-2">Client approval reminder sent</li>
        </ul>
      </Section>
    </div>
  );
}

// ===================== 3. Employee Directory =====================
function EmployeesView({ employees, onOpen }: { employees: Employee[]; onOpen: (e: Employee) => void }) {
  const [q, setQ] = useState("");
  const [site, setSite] = useState("all");
  const [status, setStatus] = useState("all");
  const [client, setClient] = useState("all");
  const [role, setRole] = useState("all");

  const rows = useMemo(() => employees.filter((e) => {
    if (q && !`${e.name} ${e.empId} ${e.role}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (site !== "all" && e.site !== site) return false;
    if (status !== "all" && e.status !== status) return false;
    if (client !== "all" && e.client !== client) return false;
    if (role !== "all" && e.role !== role) return false;
    return true;
  }), [employees, q, site, status, client, role]);

  return (
    <SectionCard
      title="Employee Directory"
      subtitle="Manage all deployed employees and workforce"
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm">Bulk Actions</Button>
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add Employee</Button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search employee or ID…" className="h-9 w-[260px] pl-8" />
        </div>
        <FilterSelect value={site} onChange={setSite} placeholder="Site" options={SITES} />
        <FilterSelect value={status} onChange={setStatus} placeholder="Status" options={["Active", "Inactive", "On Leave", "Resigned"]} />
        <FilterSelect value={client} onChange={setClient} placeholder="Client" options={CLIENTS} />
        <FilterSelect value={role} onChange={setRole} placeholder="Role" options={ROLES} />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-secondary/70 text-[12px] text-muted-foreground">
            <tr>
              <Th>Employee</Th>
              <Th>Emp ID</Th>
              <Th>Role</Th>
              <Th>Site / Client</Th>
              <Th>Joined</Th>
              <Th>Salary</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} onClick={() => onOpen(e)} className="cursor-pointer border-t border-border/60 hover:bg-secondary/40">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px]">{e.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium text-foreground">{e.name}</div>
                      <div className="text-[11px] text-muted-foreground">{e.email}</div>
                    </div>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{e.empId}</Td>
                <Td>{e.role}</Td>
                <Td>
                  <div className="font-medium text-foreground">{e.site}</div>
                  <div className="text-[11px] text-muted-foreground">{e.client}</div>
                </Td>
                <Td>{e.joining}</Td>
                <Td>₹{e.salary.toLocaleString()}</Td>
                <Td><StatusPill status={e.status} /></Td>
                <Td className="text-right">
                  <Button variant="ghost" size="sm" className="h-7 text-primary">View</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function EmployeeDetail({ emp }: { emp: Employee }) {
  const [t, setT] = useState("overview");
  return (
    <div className="space-y-4 p-1">
      <div className="flex items-start gap-3">
        <Avatar className="h-14 w-14"><AvatarFallback>{emp.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">{emp.name}</h2>
          <div className="text-sm text-muted-foreground">{emp.role} · {emp.empId}</div>
          <div className="mt-2 flex gap-1.5"><StatusPill status={emp.status} /><Badge variant="outline" className="rounded-md">{emp.client}</Badge></div>
        </div>
      </div>

      <Tabs value={t} onValueChange={setT}>
        <TabsList className="bg-secondary/60">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="deploy">Deployment</TabsTrigger>
          <TabsTrigger value="att">Attendance</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Grid2>
            <KV k="Mobile" v={emp.phone} />
            <KV k="Email" v={emp.email} />
            <KV k="Aadhaar" v="XXXX XXXX 4421" />
            <KV k="PAN" v="ABCDE1234F" />
            <KV k="Site" v={emp.site} />
            <KV k="Client" v={emp.client} />
            <KV k="Shift" v="Day · 9h" />
            <KV k="Supervisor" v="Anita Rao" />
            <KV k="Joining" v={emp.joining} />
            <KV k="Salary" v={`₹${emp.salary.toLocaleString()}`} />
            <KV k="Skills" v="Patrolling, CCTV, First Aid" />
            <KV k="Qualification" v="12th Pass" />
            <KV k="Experience" v="3 yrs" />
          </Grid2>
        </TabsContent>
        <TabsContent value="docs" className="mt-4">
          <ul className="space-y-2 text-sm">
            {["Aadhaar.pdf", "PAN.pdf", "Police Verification.pdf", "Offer Letter.pdf"].map((d) => (
              <li key={d} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
                <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> {d}</div>
                <Button size="sm" variant="ghost" className="h-7">Download</Button>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="deploy" className="mt-4">
          <ol className="relative space-y-3 border-l border-border/70 pl-4">
            <li><span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" /><div className="text-[13px] font-medium">Deployed at {emp.site}</div><div className="text-[11px] text-muted-foreground">{emp.joining}</div></li>
            <li><span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-slate-300 ring-2 ring-background" /><div className="text-[13px] font-medium">Onboarding completed</div><div className="text-[11px] text-muted-foreground">{emp.joining}</div></li>
          </ol>
        </TabsContent>
        <TabsContent value="att" className="mt-4 text-sm text-muted-foreground">Attendance trend & monthly summary will appear here.</TabsContent>
        <TabsContent value="salary" className="mt-4">
          <Grid2>
            <KV k="Basic" v={`₹${Math.round(emp.salary * 0.5).toLocaleString()}`} />
            <KV k="HRA" v={`₹${Math.round(emp.salary * 0.2).toLocaleString()}`} />
            <KV k="Allowance" v={`₹${Math.round(emp.salary * 0.2).toLocaleString()}`} />
            <KV k="Deduction" v={`₹${Math.round(emp.salary * 0.1).toLocaleString()}`} />
          </Grid2>
        </TabsContent>
        <TabsContent value="logs" className="mt-4 text-sm text-muted-foreground">All employee-related events will appear here.</TabsContent>
      </Tabs>
    </div>
  );
}

// ===================== 4. Offers & Deployment =====================
function OffersDeploymentView({ offers, deploys, onOffer, onDeploy }: { offers: Offer[]; deploys: Deployment[]; onOffer: (o: Offer) => void; onDeploy: (d: Deployment) => void }) {
  const [t, setT] = useState("offers");
  return (
    <Tabs value={t} onValueChange={setT}>
      <TabsList className="bg-secondary/60">
        <TabsTrigger value="offers">Offers</TabsTrigger>
        <TabsTrigger value="deploy">Deployment</TabsTrigger>
      </TabsList>

      <TabsContent value="offers" className="mt-4">
        <SectionCard
          title="Offers Management"
          subtitle="Track issued offers and candidate joining"
          action={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New Offer</Button>}
        >
          <div className="overflow-hidden rounded-xl border border-border/70">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary/70 text-[12px] text-muted-foreground">
                <tr><Th>Candidate</Th><Th>Role</Th><Th>Site / Client</Th><Th>Salary</Th><Th>Joining</Th><Th>Type</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} onClick={() => onOffer(o)} className="cursor-pointer border-t border-border/60 hover:bg-secondary/40">
                    <Td><div className="font-medium text-foreground">{o.candidate}</div><div className="text-[11px] text-muted-foreground">{o.id}</div></Td>
                    <Td>{o.role}</Td>
                    <Td><div className="font-medium">{o.site}</div><div className="text-[11px] text-muted-foreground">{o.client}</div></Td>
                    <Td>₹{o.salary.toLocaleString()}</Td>
                    <Td>{o.joining}</Td>
                    <Td>{o.empType}</Td>
                    <Td><StatusPill status={o.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </TabsContent>

      <TabsContent value="deploy" className="mt-4">
        <SectionCard title="Deployment Management" subtitle="Track workforce deployment across sites">
          <div className="overflow-hidden rounded-xl border border-border/70">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary/70 text-[12px] text-muted-foreground">
                <tr><Th>Employee</Th><Th>Role</Th><Th>Site</Th><Th>Client</Th><Th>Deployed On</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {deploys.map((d) => (
                  <tr key={d.id} onClick={() => onDeploy(d)} className="cursor-pointer border-t border-border/60 hover:bg-secondary/40">
                    <Td className="font-medium text-foreground">{d.employee}</Td>
                    <Td>{d.role}</Td>
                    <Td>{d.site}</Td>
                    <Td>{d.client}</Td>
                    <Td>{d.deployedOn}</Td>
                    <Td><StatusPill status={d.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </TabsContent>
    </Tabs>
  );
}

function OfferDetail({ offer }: { offer: Offer }) {
  return (
    <div className="space-y-5 p-1">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{offer.id}</div>
        <h2 className="text-xl font-semibold text-foreground">{offer.candidate}</h2>
        <div className="text-sm text-muted-foreground">{offer.role} · {offer.site}</div>
        <div className="mt-2"><StatusPill status={offer.status} /></div>
      </div>
      <Section title="Candidate Profile">
        <Grid2>
          <KV k="Email" v="ramesh.bhat@mail.com" />
          <KV k="Phone" v="+91 90000 22011" />
          <KV k="Experience" v="2 yrs" />
          <KV k="Qualification" v="12th Pass" />
        </Grid2>
      </Section>
      <Section title="Salary Breakdown">
        <Grid2>
          <KV k="Basic" v={`₹${Math.round(offer.salary * 0.5).toLocaleString()}`} />
          <KV k="HRA" v={`₹${Math.round(offer.salary * 0.2).toLocaleString()}`} />
          <KV k="Allowance" v={`₹${Math.round(offer.salary * 0.2).toLocaleString()}`} />
          <KV k="Other" v={`₹${Math.round(offer.salary * 0.1).toLocaleString()}`} />
          <KV k="Gross" v={`₹${offer.salary.toLocaleString()}`} />
          <KV k="Joining" v={offer.joining} />
        </Grid2>
      </Section>
      <Section title="Offer Letter Preview">
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-[12px] text-muted-foreground">
          Dear {offer.candidate}, we are pleased to extend an offer for the position of {offer.role} at {offer.site}…
        </div>
      </Section>
      <Section title="Approval Timeline">
        <ol className="relative space-y-3 border-l border-border/70 pl-4">
          {["Drafted", "HR Approved", "Sent to Candidate", "Candidate Response", "Joining"].map((s, i) => (
            <li key={s}>
              <span className={cn("absolute -left-[7px] mt-1 h-3 w-3 rounded-full ring-2 ring-background", i < 3 ? "bg-emerald-500" : "bg-slate-300")} />
              <div className="text-[13px] font-medium">{s}</div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

function DeploymentDetail({ dep }: { dep: Deployment }) {
  return (
    <div className="space-y-5 p-1">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{dep.id}</div>
        <h2 className="text-xl font-semibold text-foreground">{dep.employee}</h2>
        <div className="text-sm text-muted-foreground">{dep.role} · {dep.site}</div>
        <div className="mt-2"><StatusPill status={dep.status} /></div>
      </div>
      <Section title="Employee Information"><Grid2><KV k="Role" v={dep.role} /><KV k="Client" v={dep.client} /><KV k="Site" v={dep.site} /><KV k="Deployed On" v={dep.deployedOn} /></Grid2></Section>
      <Section title="Site Allocation"><Grid2><KV k="Zone" v="Block A · Floor 2" /><KV k="Reporting Time" v="08:00" /></Grid2></Section>
      <Section title="Supervisor Details"><Grid2><KV k="Supervisor" v={dep.supervisor} /><KV k="Contact" v="+91 90000 11122" /></Grid2></Section>
      <Section title="Shift, Uniform & Training">
        <Grid2>
          <KV k="Shift" v="Day · 9h" />
          <KV k="Uniform" v="Issued" />
          <KV k="Training" v="Completed" />
          <KV k="Verification" v="Police verified" />
        </Grid2>
      </Section>
      <Section title="Attendance Mapping">
        <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-[12px] text-muted-foreground">Synced with FieldSense biometric & geo-fence at {dep.site}.</div>
      </Section>
    </div>
  );
}

// ===================== 5. Billing & Profit =====================
function BillingView({ billing }: { billing: BillingRow[] }) {
  const totalRev = billing.reduce((s, b) => s + b.billing, 0);
  const totalCost = billing.reduce((s, b) => s + b.salaryCost, 0);
  const profit = totalRev - totalCost;
  const pending = billing.filter((b) => b.status !== "Paid").reduce((s, b) => s + b.billing, 0);
  const billable = billing.filter((b) => b.type === "Billable").reduce((s, b) => s + b.headcount, 0);
  const nonBillable = billing.filter((b) => b.type === "Non-Billable").reduce((s, b) => s + b.headcount, 0);

  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => ({ m, rev: 38 + i * 4, profit: 8 + i * 1.6 }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard icon={Wallet} label="Monthly Revenue" value={`₹${(totalRev / 100000).toFixed(1)}L`} trend={{ dir: "up", value: "+9.2%" }} tone="primary" />
        <KpiCard icon={TrendingUp} label="Monthly Profit" value={`₹${(profit / 100000).toFixed(1)}L`} trend={{ dir: "up", value: "+11.4%" }} tone="emerald" />
        <KpiCard icon={Users} label="Payroll Cost" value={`₹${(totalCost / 100000).toFixed(1)}L`} trend={{ dir: "up", value: "+6.1%" }} tone="indigo" />
        <KpiCard icon={Building2} label="Client Profit" value={`${Math.round((profit / totalRev) * 100)}%`} trend={{ dir: "up", value: "+1.3%" }} tone="emerald" />
        <KpiCard icon={FileText} label="Pending Invoices" value={`₹${(pending / 100000).toFixed(1)}L`} trend={{ dir: "down", value: "-3.4%" }} tone="amber" />
        <KpiCard icon={CheckCircle2} label="Collection Rate" value="86%" trend={{ dir: "up", value: "+2%" }} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Billing vs Profit Comparison" subtitle="Monthly trend (₹ Lakhs)">
          <div className="flex h-56 items-end gap-3">
            {months.map((d) => {
              const maxV = Math.max(...months.map((x) => x.rev));
              return (
                <div key={d.m} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-full w-full items-end justify-center gap-1">
                    <div className="w-3 rounded-t bg-primary/80" style={{ height: `${(d.rev / maxV) * 100}%` }} />
                    <div className="w-3 rounded-t bg-emerald-400" style={{ height: `${(d.profit / maxV) * 100}%` }} />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.m}</div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Billable vs Non-Billable" subtitle="Workforce mix">
          <Donut total={billable + nonBillable} segments={[{ label: "Billable", value: billable, color: "#10b981" }, { label: "Non-Billable", value: nonBillable, color: "#94a3b8" }]} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Client-wise Profitability" subtitle="Top contributors">
          <div className="space-y-2">
            {billing.map((b) => {
              const margin = ((b.billing - b.salaryCost) / b.billing) * 100;
              return (
                <div key={b.id}>
                  <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">{b.client}</span><span className="font-medium">{margin.toFixed(1)}%</span></div>
                  <div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary/80" style={{ width: `${Math.min(100, margin * 3)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Site-wise Revenue Heatmap" subtitle="Monthly billing intensity">
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const v = (i * 13) % 100;
              const bg = v > 70 ? "bg-primary" : v > 50 ? "bg-primary/70" : v > 30 ? "bg-primary/40" : "bg-primary/15";
              return <div key={i} className={cn("h-7 rounded", bg)} title={`Day ${i + 1} · ${v}%`} />;
            })}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>Low</span>
            {[15, 40, 70, 100].map((p) => (<span key={p} className={cn("h-3 w-6 rounded", p > 70 ? "bg-primary" : p > 50 ? "bg-primary/70" : p > 30 ? "bg-primary/40" : "bg-primary/15")} />))}
            <span>High</span>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Billing Ledger" subtitle="Salary cost vs client billing per site" action={<Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>}>
        <div className="overflow-hidden rounded-xl border border-border/70">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary/70 text-[12px] text-muted-foreground">
              <tr><Th>Client</Th><Th>Site</Th><Th>Type</Th><Th>Headcount</Th><Th>Salary Cost</Th><Th>Billing</Th><Th>Margin</Th><Th>Invoice</Th></tr>
            </thead>
            <tbody>
              {billing.map((b) => {
                const margin = ((b.billing - b.salaryCost) / b.billing) * 100;
                return (
                  <tr key={b.id} className="border-t border-border/60 hover:bg-secondary/40">
                    <Td className="font-medium text-foreground">{b.client}</Td>
                    <Td>{b.site}</Td>
                    <Td><StatusPill status={b.type} /></Td>
                    <Td>{b.headcount}</Td>
                    <Td>₹{b.salaryCost.toLocaleString()}</Td>
                    <Td>₹{b.billing.toLocaleString()}</Td>
                    <Td className={cn("font-medium", margin > 20 ? "text-emerald-600" : "text-amber-600")}>{margin.toFixed(1)}%</Td>
                    <Td><StatusPill status={b.status} /></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ===================== 6. Activity Log =====================
function ActivityView({ activities }: { activities: ActivityLog[] }) {
  const [view, setView] = useState<"table" | "timeline">("table");
  const [user, setUser] = useState("all");
  const [mod, setMod] = useState("all");
  const [action, setAction] = useState("all");

  const users = Array.from(new Set(activities.map((a) => a.user)));
  const mods = Array.from(new Set(activities.map((a) => a.module)));
  const actions = Array.from(new Set(activities.map((a) => a.action)));

  const rows = activities.filter((a) => (user === "all" || a.user === user) && (mod === "all" || a.module === mod) && (action === "all" || a.action === action));

  return (
    <SectionCard
      title="Activity Logs"
      subtitle="Track all ATS and workforce activities"
      action={
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-secondary/40 p-0.5">
            <button onClick={() => setView("table")} className={cn("rounded px-2.5 py-1 text-[12px]", view === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>Table</button>
            <button onClick={() => setView("timeline")} className={cn("rounded px-2.5 py-1 text-[12px]", view === "timeline" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>Timeline</button>
          </div>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect value={user} onChange={setUser} placeholder="User" options={users} />
        <FilterSelect value={mod} onChange={setMod} placeholder="Module" options={mods} />
        <FilterSelect value={action} onChange={setAction} placeholder="Action" options={actions} />
        <Button variant="outline" size="sm" className="h-9"><Calendar className="mr-1.5 h-4 w-4" /> Date Range</Button>
      </div>

      {view === "table" ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary/70 text-[12px] text-muted-foreground">
              <tr><Th>User</Th><Th>Action</Th><Th>Module</Th><Th>Description</Th><Th>Timestamp</Th><Th>IP</Th><Th>Status</Th></tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-t border-border/60 hover:bg-secondary/40">
                  <Td>
                    <div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{a.user.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar><span className="font-medium text-foreground">{a.user}</span></div>
                  </Td>
                  <Td>{a.action}</Td>
                  <Td><Badge variant="outline" className="rounded-md">{a.module}</Badge></Td>
                  <Td className="text-muted-foreground">{a.description}</Td>
                  <Td>{a.timestamp}</Td>
                  <Td className="text-muted-foreground">{a.ip}</Td>
                  <Td><StatusPill status={a.status} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ol className="relative mt-4 space-y-4 border-l border-border/70 pl-5">
          {rows.map((a) => (
            <li key={a.id}>
              <span className={cn("absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full ring-2 ring-background", a.status === "Success" ? "bg-emerald-500" : a.status === "Warning" ? "bg-amber-500" : "bg-rose-500")} />
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <span className="font-medium text-foreground">{a.user}</span>
                <span className="text-muted-foreground">{a.action.toLowerCase()}</span>
                <Badge variant="outline" className="rounded-md text-[10px]">{a.module}</Badge>
                <span className="ml-auto text-[11px] text-muted-foreground">{a.timestamp}</span>
              </div>
              <div className="text-[12px] text-muted-foreground">{a.description}</div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}

// ===================== Tiny primitives =====================
function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("px-3 py-2 text-left font-medium", className)}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-3 py-2.5 align-middle", className)}>{children}</td>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="rounded-xl border border-border/70 bg-card p-4">{children}</div>
    </div>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}
function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-[13px] font-medium text-foreground">{v}</div>
    </div>
  );
}
function FilterSelect({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[150px]">
        <Filter className="mr-1.5 h-3.5 w-3.5" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {placeholder}</SelectItem>
        {options.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
      </SelectContent>
    </Select>
  );
}
