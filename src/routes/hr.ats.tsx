import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Briefcase,
  Users,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Star,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building2,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  SheetHeader,
  SheetTitle,
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

// ===== Types =====
type StageKey =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Intern";
  status: "Open" | "On Hold" | "Closed";
  applicants: number;
  posted: string;
  hiringManager: string;
};

type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  jobId: string;
  jobTitle: string;
  stage: StageKey;
  rating: number;
  experience: number; // years
  source: string;
  appliedOn: string;
  resume: string;
  skills: string[];
  education: string;
  current: string;
  expectedCtc: string;
};

const STAGES: { key: StageKey; label: string; color: string }[] = [
  { key: "applied", label: "Applied", color: "bg-slate-500" },
  { key: "screening", label: "Screening", color: "bg-amber-500" },
  { key: "interview", label: "Interview", color: "bg-indigo-500" },
  { key: "offer", label: "Offer", color: "bg-violet-500" },
  { key: "hired", label: "Hired", color: "bg-emerald-500" },
  { key: "rejected", label: "Rejected", color: "bg-rose-500" },
];

const seedJobs: Job[] = [
  {
    id: "J-1001",
    title: "Senior Site Supervisor",
    department: "Operations",
    location: "Riyadh",
    type: "Full-time",
    status: "Open",
    applicants: 42,
    posted: "2026-04-12",
    hiringManager: "Ahmed Al-Sayed",
  },
  {
    id: "J-1002",
    title: "Field Sales Executive",
    department: "Sales",
    location: "Jeddah",
    type: "Full-time",
    status: "Open",
    applicants: 31,
    posted: "2026-04-20",
    hiringManager: "Lina Khoury",
  },
  {
    id: "J-1003",
    title: "HR Business Partner",
    department: "HR",
    location: "Dubai",
    type: "Full-time",
    status: "On Hold",
    applicants: 18,
    posted: "2026-04-02",
    hiringManager: "Mona Idris",
  },
  {
    id: "J-1004",
    title: "Soft Services Manager",
    department: "Operations",
    location: "Doha",
    type: "Full-time",
    status: "Open",
    applicants: 24,
    posted: "2026-04-25",
    hiringManager: "Omar Farooq",
  },
  {
    id: "J-1005",
    title: "Finance Analyst",
    department: "Finance",
    location: "Riyadh",
    type: "Contract",
    status: "Closed",
    applicants: 56,
    posted: "2026-03-10",
    hiringManager: "Ravi Kumar",
  },
];

const seedCandidates: Candidate[] = [
  {
    id: "C-2001",
    name: "Yasmine Haddad",
    email: "yasmine.h@mail.com",
    phone: "+966 55 123 4567",
    location: "Riyadh",
    jobId: "J-1001",
    jobTitle: "Senior Site Supervisor",
    stage: "interview",
    rating: 4,
    experience: 7,
    source: "LinkedIn",
    appliedOn: "2026-04-22",
    resume: "yasmine_resume.pdf",
    skills: ["FM", "Team Lead", "HSE", "Vendor Mgmt"],
    education: "B.Eng — KAU",
    current: "Site Supervisor @ FacilityCo",
    expectedCtc: "SAR 18,000",
  },
  {
    id: "C-2002",
    name: "Karan Mehta",
    email: "karan.mehta@mail.com",
    phone: "+971 50 998 2210",
    location: "Dubai",
    jobId: "J-1002",
    jobTitle: "Field Sales Executive",
    stage: "screening",
    rating: 3,
    experience: 4,
    source: "Referral",
    appliedOn: "2026-04-26",
    resume: "karan_cv.pdf",
    skills: ["B2B Sales", "CRM", "Negotiation"],
    education: "MBA — IIM B",
    current: "Sales Exec @ TradeOne",
    expectedCtc: "AED 14,000",
  },
  {
    id: "C-2003",
    name: "Noura Al-Mutairi",
    email: "noura@mail.com",
    phone: "+966 56 220 1198",
    location: "Riyadh",
    jobId: "J-1003",
    jobTitle: "HR Business Partner",
    stage: "offer",
    rating: 5,
    experience: 9,
    source: "Naukri",
    appliedOn: "2026-04-10",
    resume: "noura_hrbp.pdf",
    skills: ["HRBP", "Talent", "OD", "Comp & Ben"],
    education: "MA HR — KSU",
    current: "Sr. HRBP @ HoldingCo",
    expectedCtc: "SAR 28,000",
  },
  {
    id: "C-2004",
    name: "Daniel Park",
    email: "daniel.park@mail.com",
    phone: "+974 33 410 5577",
    location: "Doha",
    jobId: "J-1004",
    jobTitle: "Soft Services Manager",
    stage: "applied",
    rating: 3,
    experience: 6,
    source: "Indeed",
    appliedOn: "2026-04-29",
    resume: "daniel_park.pdf",
    skills: ["Cleaning Ops", "Contract Mgmt"],
    education: "BBA — QU",
    current: "Ops Lead @ CleanPro",
    expectedCtc: "QAR 16,000",
  },
  {
    id: "C-2005",
    name: "Aisha Rahman",
    email: "aisha.r@mail.com",
    phone: "+966 53 887 9921",
    location: "Riyadh",
    jobId: "J-1001",
    jobTitle: "Senior Site Supervisor",
    stage: "applied",
    rating: 2,
    experience: 3,
    source: "Career Site",
    appliedOn: "2026-04-30",
    resume: "aisha.pdf",
    skills: ["MEP", "Reporting"],
    education: "B.Tech — PNU",
    current: "Engineer @ MEPCo",
    expectedCtc: "SAR 12,000",
  },
  {
    id: "C-2006",
    name: "Tariq Bensaid",
    email: "tariq.b@mail.com",
    phone: "+966 50 882 1100",
    location: "Jeddah",
    jobId: "J-1002",
    jobTitle: "Field Sales Executive",
    stage: "interview",
    rating: 4,
    experience: 5,
    source: "LinkedIn",
    appliedOn: "2026-04-24",
    resume: "tariq_b.pdf",
    skills: ["Field Sales", "Account Mgmt"],
    education: "BBA — KAU",
    current: "AE @ SalesOrg",
    expectedCtc: "SAR 15,000",
  },
  {
    id: "C-2007",
    name: "Priya Iyer",
    email: "priya.i@mail.com",
    phone: "+971 52 339 0011",
    location: "Dubai",
    jobId: "J-1003",
    jobTitle: "HR Business Partner",
    stage: "screening",
    rating: 4,
    experience: 8,
    source: "LinkedIn",
    appliedOn: "2026-04-18",
    resume: "priya.pdf",
    skills: ["HRBP", "ER", "Payroll"],
    education: "MBA — XLRI",
    current: "HRBP @ GroupCo",
    expectedCtc: "AED 24,000",
  },
  {
    id: "C-2008",
    name: "Hassan Qureshi",
    email: "hassan.q@mail.com",
    phone: "+966 54 220 7788",
    location: "Riyadh",
    jobId: "J-1005",
    jobTitle: "Finance Analyst",
    stage: "hired",
    rating: 5,
    experience: 6,
    source: "Referral",
    appliedOn: "2026-03-22",
    resume: "hassan.pdf",
    skills: ["FP&A", "Power BI", "SAP"],
    education: "CA",
    current: "Sr. Analyst @ FinCo",
    expectedCtc: "SAR 22,000",
  },
  {
    id: "C-2009",
    name: "Sara Khalil",
    email: "sara.k@mail.com",
    phone: "+966 55 711 0083",
    location: "Riyadh",
    jobId: "J-1001",
    jobTitle: "Senior Site Supervisor",
    stage: "rejected",
    rating: 2,
    experience: 2,
    source: "Career Site",
    appliedOn: "2026-04-15",
    resume: "sara.pdf",
    skills: ["Admin", "Coordination"],
    education: "B.Sc — KSU",
    current: "Coordinator @ ServeCo",
    expectedCtc: "SAR 9,000",
  },
];

function ATSPage() {
  const [jobs] = useState<Job[]>(seedJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(seedCandidates);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesJob = jobFilter === "all" || c.jobId === jobFilter;
      return matchesSearch && matchesJob;
    });
  }, [candidates, search, jobFilter]);

  const stats = useMemo(() => {
    const total = candidates.length;
    const open = jobs.filter((j) => j.status === "Open").length;
    const interviews = candidates.filter((c) => c.stage === "interview").length;
    const offers = candidates.filter((c) => c.stage === "offer").length;
    const hired = candidates.filter((c) => c.stage === "hired").length;
    return { total, open, interviews, offers, hired };
  }, [candidates, jobs]);

  const moveStage = (id: string, stage: StageKey) =>
    setCandidates((cs) => cs.map((c) => (c.id === id ? { ...c, stage } : c)));

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border bg-card px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>HR</span>
              <ArrowRight className="h-3 w-3" />
              <span>Recruitment</span>
            </div>
            <h1 className="mt-0.5 text-[22px] font-semibold tracking-tight text-foreground">
              Applicant Tracking System
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage jobs, candidates, and the full hiring pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-1.5 h-4 w-4" /> Import CVs
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> New Job
            </Button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <KPI icon={Briefcase} label="Open Jobs" value={stats.open} tone="primary" />
          <KPI icon={Users} label="Total Candidates" value={stats.total} tone="slate" />
          <KPI icon={CalendarClock} label="In Interview" value={stats.interviews} tone="indigo" />
          <KPI icon={FileText} label="Offers Pending" value={stats.offers} tone="violet" />
          <KPI icon={CheckCircle2} label="Hired (MTD)" value={stats.hired} tone="emerald" />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search candidates, skills, jobs…"
                  className="h-9 w-[260px] pl-8"
                />
              </div>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="h-9 w-[200px]">
                  <Filter className="mr-1.5 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="overview" className="mt-5">
            <OverviewView jobs={jobs} candidates={candidates} />
          </TabsContent>

          <TabsContent value="jobs" className="mt-5">
            <JobsView jobs={jobs} candidates={candidates} />
          </TabsContent>

          <TabsContent value="pipeline" className="mt-5">
            <PipelineView
              candidates={filtered}
              onMove={moveStage}
              onOpen={setSelected}
            />
          </TabsContent>

          <TabsContent value="candidates" className="mt-5">
            <CandidatesTable candidates={filtered} onOpen={setSelected} />
          </TabsContent>

          <TabsContent value="interviews" className="mt-5">
            <InterviewsView candidates={candidates} />
          </TabsContent>

          <TabsContent value="reports" className="mt-5">
            <ReportsView jobs={jobs} candidates={candidates} />
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <CandidateDetail
              candidate={selected}
              onMove={(s) => {
                moveStage(selected.id, s);
                setSelected({ ...selected, stage: s });
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ===== Subcomponents =====

function KPI({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: number | string;
  tone: "primary" | "slate" | "indigo" | "violet" | "emerald";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    slate: "bg-slate-500/10 text-slate-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
    violet: "bg-violet-500/10 text-violet-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
  };
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-xl font-semibold text-foreground">{value}</div>
      </div>
    </Card>
  );
}

function OverviewView({
  jobs,
  candidates,
}: {
  jobs: Job[];
  candidates: Candidate[];
}) {
  const byStage = STAGES.map((s) => ({
    ...s,
    count: candidates.filter((c) => c.stage === s.key).length,
  }));
  const total = candidates.length || 1;
  const bySource = Array.from(
    candidates.reduce((m, c) => m.set(c.source, (m.get(c.source) || 0) + 1), new Map<string, number>()),
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="p-5 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Hiring Funnel</h3>
            <p className="text-xs text-muted-foreground">Distribution across pipeline stages</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="h-3 w-3" /> {candidates.length} active
          </Badge>
        </div>
        <div className="space-y-3">
          {byStage.map((s) => (
            <div key={s.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", s.color)} />
                  <span className="font-medium text-foreground">{s.label}</span>
                </div>
                <span className="text-muted-foreground">
                  {s.count} ({Math.round((s.count / total) * 100)}%)
                </span>
              </div>
              <Progress value={(s.count / total) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Top Sources</h3>
        <div className="space-y-2">
          {bySource
            .sort((a, b) => b[1] - a[1])
            .map(([src, n]) => (
              <div key={src} className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
                <span className="text-sm text-foreground">{src}</span>
                <Badge variant="outline">{n}</Badge>
              </div>
            ))}
        </div>
      </Card>

      <Card className="p-5 lg:col-span-3">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Active Job Openings</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {jobs
            .filter((j) => j.status === "Open")
            .map((j) => (
              <div key={j.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{j.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" /> {j.department}
                      <span>•</span>
                      <MapPin className="h-3 w-3" /> {j.location}
                    </div>
                  </div>
                  <Badge variant="secondary">{j.applicants}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{j.type}</span>
                  <span>{j.hiringManager}</span>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

function JobsView({ jobs, candidates }: { jobs: Job[]; candidates: Candidate[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Job</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Hiring Manager</th>
            <th className="px-4 py-3">Applicants</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Posted</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {jobs.map((j) => {
            const live = candidates.filter((c) => c.jobId === j.id).length;
            return (
              <tr key={j.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{j.title}</div>
                  <div className="text-xs text-muted-foreground">{j.id}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{j.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{j.location}</td>
                <td className="px-4 py-3 text-muted-foreground">{j.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{j.hiringManager}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{live} active</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={cn(
                      j.status === "Open" && "bg-emerald-500/15 text-emerald-700",
                      j.status === "On Hold" && "bg-amber-500/15 text-amber-700",
                      j.status === "Closed" && "bg-slate-500/15 text-slate-700",
                    )}
                    variant="secondary"
                  >
                    {j.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{j.posted}</td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function PipelineView({
  candidates,
  onMove,
  onOpen,
}: {
  candidates: Candidate[];
  onMove: (id: string, s: StageKey) => void;
  onOpen: (c: Candidate) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {STAGES.map((s) => {
        const items = candidates.filter((c) => c.stage === s.key);
        return (
          <div
            key={s.key}
            className="flex min-h-[400px] flex-col rounded-lg border border-border bg-muted/30"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/plain");
              if (id) onMove(id, s.key);
            }}
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", s.color)} />
                <span className="text-sm font-semibold text-foreground">{s.label}</span>
              </div>
              <Badge variant="outline">{items.length}</Badge>
            </div>
            <div className="flex-1 space-y-2 p-2">
              {items.map((c) => (
                <div
                  key={c.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", c.id)}
                  onClick={() => onOpen(c)}
                  className="cursor-grab rounded-md border border-border bg-card p-3 text-left shadow-sm transition hover:border-primary/40 hover:shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-[11px] text-primary">
                          {initials(c.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-foreground">
                          {c.name}
                        </div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {c.jobTitle}
                        </div>
                      </div>
                    </div>
                    <Stars n={c.rating} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.skills.slice(0, 3).map((sk) => (
                      <Badge key={sk} variant="secondary" className="px-1.5 py-0 text-[10px]">
                        {sk}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{c.experience}y exp</span>
                    <span>{c.source}</span>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  Drop candidates here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CandidatesTable({
  candidates,
  onOpen,
}: {
  candidates: Candidate[];
  onOpen: (c: Candidate) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Candidate</th>
            <th className="px-4 py-3">Job</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Experience</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Applied</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {candidates.map((c) => (
            <tr key={c.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-[11px] text-primary">
                      {initials(c.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{c.jobTitle}</td>
              <td className="px-4 py-3">
                <StageBadge stage={c.stage} />
              </td>
              <td className="px-4 py-3"><Stars n={c.rating} /></td>
              <td className="px-4 py-3 text-muted-foreground">{c.experience}y</td>
              <td className="px-4 py-3 text-muted-foreground">{c.source}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.appliedOn}</td>
              <td className="px-4 py-3">
                <Button size="sm" variant="outline" onClick={() => onOpen(c)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function InterviewsView({ candidates }: { candidates: Candidate[] }) {
  const interviews = candidates.filter((c) => c.stage === "interview");
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {interviews.map((c) => (
        <Card key={c.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials(c.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.jobTitle}</div>
              </div>
            </div>
            <Badge variant="secondary">Round 2</Badge>
          </div>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Tomorrow, 2:00 PM
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Google Meet
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Panel: HR + Hiring Manager
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Feedback
            </Button>
            <Button size="sm" className="flex-1">
              Reschedule
            </Button>
          </div>
        </Card>
      ))}
      {interviews.length === 0 && (
        <Card className="p-10 text-center text-sm text-muted-foreground md:col-span-3">
          No upcoming interviews.
        </Card>
      )}
    </div>
  );
}

function ReportsView({ jobs, candidates }: { jobs: Job[]; candidates: Candidate[] }) {
  const totalApps = candidates.length;
  const hired = candidates.filter((c) => c.stage === "hired").length;
  const rejected = candidates.filter((c) => c.stage === "rejected").length;
  const conversion = totalApps ? Math.round((hired / totalApps) * 100) : 0;
  const avgPerJob = jobs.length ? Math.round(totalApps / jobs.length) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <h3 className="mb-1 text-sm font-semibold text-foreground">Conversion Funnel</h3>
        <p className="mb-4 text-xs text-muted-foreground">Application → Hire</p>
        <div className="space-y-3">
          <Metric label="Total applications" value={totalApps} />
          <Metric label="Hired" value={hired} />
          <Metric label="Rejected" value={rejected} />
          <Metric label="Hire rate" value={`${conversion}%`} />
          <Metric label="Avg applications / job" value={avgPerJob} />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Time to Hire (avg, days)</h3>
        <div className="space-y-3">
          {[
            { label: "Operations", v: 24 },
            { label: "Sales", v: 18 },
            { label: "HR", v: 32 },
            { label: "Finance", v: 28 },
          ].map((d) => (
            <div key={d.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-foreground">{d.label}</span>
                <span className="text-muted-foreground">{d.v}d</span>
              </div>
              <Progress value={(d.v / 40) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CandidateDetail({
  candidate,
  onMove,
}: {
  candidate: Candidate;
  onMove: (s: StageKey) => void;
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Candidate Profile</SheetTitle>
      </SheetHeader>
      <div className="mt-4 space-y-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold text-foreground">{candidate.name}</div>
            <div className="text-sm text-muted-foreground">{candidate.current}</div>
            <div className="mt-1 flex items-center gap-2">
              <Stars n={candidate.rating} />
              <StageBadge stage={candidate.stage} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field icon={Mail} label="Email" value={candidate.email} />
          <Field icon={Phone} label="Phone" value={candidate.phone} />
          <Field icon={MapPin} label="Location" value={candidate.location} />
          <Field icon={Briefcase} label="Applied for" value={candidate.jobTitle} />
          <Field icon={GraduationCap} label="Education" value={candidate.education} />
          <Field icon={TrendingUp} label="Experience" value={`${candidate.experience} years`} />
          <Field icon={Building2} label="Source" value={candidate.source} />
          <Field icon={FileText} label="Expected CTC" value={candidate.expectedCtc} />
        </div>

        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Move to stage
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <Button
                key={s.key}
                size="sm"
                variant={candidate.stage === s.key ? "default" : "outline"}
                onClick={() => onMove(s.key)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1">
            <FileText className="mr-1.5 h-4 w-4" /> Resume
          </Button>
          <Button variant="outline" className="flex-1">
            <CalendarClock className="mr-1.5 h-4 w-4" /> Schedule
          </Button>
          <Button variant="destructive" size="icon">
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

// ===== Bits =====

function Field({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-0.5 truncate text-sm text-foreground">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function StageBadge({ stage }: { stage: StageKey }) {
  const s = STAGES.find((x) => x.key === stage)!;
  return (
    <Badge variant="secondary" className="gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", s.color)} />
      {s.label}
    </Badge>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < n ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
