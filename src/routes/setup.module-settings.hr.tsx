import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SetupPage } from "@/setup/SetupShell";
import { Tabs, TabPanel } from "@/setup/Tabs";
import {
  Clock,
  CalendarDays,
  Wallet,
  Building2,
  GraduationCap,
  Users,
  FileText,
  Sparkles,
  Tags,
  ListChecks,
  Archive,
  Copy,
  QrCode,
  Plus,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/setup/module-settings/hr")({
  head: () => ({
    meta: [
      { title: "HR Module Settings — Logicon Admin Portal" },
      {
        name: "description",
        content:
          "Configure HRMS policies and ATS rules: shifts, leave, payroll, resume parsing, AI scoring, keywords, duplicate detection, and QR hiring.",
      },
    ],
  }),
  component: HrModuleSettings,
});

type RootTab = "hrms" | "ats";

function HrModuleSettings() {
  const [tab, setTab] = useState<RootTab>("hrms");

  return (
    <SetupPage
      title="HR Module Settings"
      subtitle="Manage HRMS policies and the ATS configuration that powers recruitment, scoring and deployment."
      hideAdd
    >
      <div className="-mt-2">
        <Tabs
          value={tab}
          onChange={(v) => setTab(v as RootTab)}
          tabs={[
            { value: "hrms", label: "HRMS" },
            { value: "ats", label: "ATS" },
          ]}
        />
        <TabPanel>{tab === "hrms" ? <HrmsPanel /> : <AtsPanel />}</TabPanel>
      </div>
    </SetupPage>
  );
}

/* ───────────────────────── HRMS ───────────────────────── */

function HrmsPanel() {
  const [section, setSection] = useState("shift");
  const sections = [
    { id: "policies", label: "Employee Policies", icon: FileText },
    { id: "attendance", label: "Attendance Rules", icon: Clock },
    { id: "shift", label: "Shift Rules", icon: Clock },
    { id: "leave", label: "Leave Policies", icon: CalendarDays },
    { id: "payroll", label: "Payroll Rules", icon: Wallet },
    { id: "holiday", label: "Holiday Calendar", icon: CalendarDays },
    { id: "dept", label: "Department Mapping", icon: Building2 },
    { id: "grade", label: "Grade Structure", icon: GraduationCap },
  ];

  return (
    <SplitLayout
      sections={sections}
      active={section}
      onChange={setSection}
    >
      {section === "shift" && <ShiftRules />}
      {section === "attendance" && <AttendanceRules />}
      {section === "leave" && <LeavePolicies />}
      {section === "payroll" && <PayrollRules />}
      {section === "policies" && <EmployeePolicies />}
      {section === "holiday" && <HolidayCalendar />}
      {section === "dept" && <DepartmentMapping />}
      {section === "grade" && <GradeStructure />}
    </SplitLayout>
  );
}

function ShiftRules() {
  const [shifts, setShifts] = useState([
    { id: 1, name: "General", start: "09:00", end: "18:00", grace: 15, ot: true },
    { id: 2, name: "Night", start: "22:00", end: "06:00", grace: 10, ot: true },
    { id: 3, name: "Morning", start: "06:00", end: "14:00", grace: 10, ot: false },
  ]);
  return (
    <Card title="Shift Rules" desc="Define shift timings, grace and overtime eligibility.">
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-[13px]">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr className="text-left">
              <Th>Shift</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Grace (min)</Th>
              <Th>OT Eligible</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <Td className="font-medium text-foreground">{s.name}</Td>
                <Td>{s.start}</Td>
                <Td>{s.end}</Td>
                <Td>{s.grace}</Td>
                <Td>
                  <Switch checked={s.ot} onChange={(v) =>
                    setShifts((all) => all.map((x) => x.id === s.id ? { ...x, ot: v } : x))
                  } />
                </Td>
                <Td className="text-right">
                  <button className="text-muted-foreground hover:text-destructive" onClick={() => setShifts(s2 => s2.filter(x => x.id !== s.id))}>
                    <Trash2 size={14} />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddRowButton onClick={() => setShifts(s => [...s, { id: Date.now(), name: "New Shift", start: "09:00", end: "18:00", grace: 10, ot: false }])} label="Add Shift" />
    </Card>
  );
}

function AttendanceRules() {
  return (
    <Card title="Attendance Rules" desc="Tolerance and validations for attendance capture.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Grace Time (minutes)"><Input defaultValue="15" /></Field>
        <Field label="Half-day Threshold (hours)"><Input defaultValue="4" /></Field>
        <Field label="Auto Mark Absent After"><Input defaultValue="2 days" /></Field>
        <Field label="Geo-fenced Punch"><Switch checked /></Field>
        <Field label="Selfie Required"><Switch checked /></Field>
        <Field label="Allow Web Punch"><Switch /></Field>
      </div>
    </Card>
  );
}

function LeavePolicies() {
  const types = ["Earned Leave", "Sick Leave", "Casual Leave", "Maternity", "Paternity"];
  return (
    <Card title="Leave Policies" desc="Configure leave types and accrual.">
      <div className="space-y-2">
        {types.map((t) => (
          <div key={t} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <div>
              <div className="text-[13px] font-medium text-foreground">{t}</div>
              <div className="text-[11px] text-muted-foreground">Annual quota and carry-forward rules</div>
            </div>
            <div className="flex items-center gap-3">
              <Field inline label="Quota"><Input defaultValue="12" className="w-20" /></Field>
              <Field inline label="Carry"><Switch checked /></Field>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PayrollRules() {
  return (
    <Card title="Payroll Rules" desc="Salary cycle and component setup.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Payroll Frequency">
          <Select defaultValue="monthly">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
          </Select>
        </Field>
        <Field label="Cut-off Date"><Input defaultValue="25th of month" /></Field>
        <Field label="OT Multiplier"><Input defaultValue="1.5x" /></Field>
        <Field label="Components">
          <Input defaultValue="Basic, HRA, DA, Conveyance, Special" />
        </Field>
      </div>
    </Card>
  );
}

function EmployeePolicies() {
  return (
    <Card title="Employee Policies" desc="Org-wide rules applied to all employees.">
      <div className="space-y-2">
        <ToggleRow label="Probation Period (90 days)" defaultChecked />
        <ToggleRow label="Notice Period (30 days)" defaultChecked />
        <ToggleRow label="Background Verification Required" defaultChecked />
        <ToggleRow label="Bond Period Applicable" />
      </div>
    </Card>
  );
}

function HolidayCalendar() {
  const days = [
    { d: "Jan 26", n: "Republic Day" },
    { d: "Mar 25", n: "Holi" },
    { d: "Aug 15", n: "Independence Day" },
    { d: "Oct 02", n: "Gandhi Jayanti" },
    { d: "Nov 01", n: "Diwali" },
  ];
  return (
    <Card title="Holiday Calendar" desc="Public holidays applicable across branches.">
      <ul className="divide-y divide-border rounded-xl border border-border">
        {days.map((h) => (
          <li key={h.d} className="flex items-center justify-between px-4 py-3 text-[13px]">
            <span className="font-medium text-foreground">{h.n}</span>
            <span className="text-muted-foreground">{h.d}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function DepartmentMapping() {
  const rows = [
    { dept: "Engineering", head: "R. Sharma", count: 84 },
    { dept: "Operations", head: "K. Iyer", count: 142 },
    { dept: "Sales", head: "A. Khan", count: 36 },
    { dept: "HR", head: "M. Verma", count: 12 },
  ];
  return (
    <Card title="Department Mapping" desc="Departments mapped to heads and headcount.">
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-[13px]">
          <thead className="bg-muted/40 text-muted-foreground"><tr><Th>Department</Th><Th>Head</Th><Th>Headcount</Th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.dept} className="border-t border-border">
                <Td className="font-medium text-foreground">{r.dept}</Td><Td>{r.head}</Td><Td>{r.count}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function GradeStructure() {
  const grades = [
    { g: "L1", t: "Associate", min: "3L", max: "5L" },
    { g: "L2", t: "Senior Associate", min: "5L", max: "9L" },
    { g: "L3", t: "Lead", min: "9L", max: "16L" },
    { g: "L4", t: "Manager", min: "14L", max: "24L" },
  ];
  return (
    <Card title="Employee Grade Structure" desc="Bands and CTC ranges.">
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-[13px]">
          <thead className="bg-muted/40 text-muted-foreground"><tr><Th>Grade</Th><Th>Title</Th><Th>Min CTC</Th><Th>Max CTC</Th></tr></thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.g} className="border-t border-border">
                <Td className="font-medium text-foreground">{g.g}</Td><Td>{g.t}</Td><Td>{g.min}</Td><Td>{g.max}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ───────────────────────── ATS ───────────────────────── */

function AtsPanel() {
  const [section, setSection] = useState("parser");
  const sections = [
    { id: "parser", label: "Resume Parser", icon: FileText },
    { id: "scoring", label: "AI Scoring", icon: Sparkles },
    { id: "keywords", label: "Keyword Management", icon: Tags },
    { id: "status", label: "Status Rules", icon: ListChecks },
    { id: "archive", label: "Auto Archive", icon: Archive },
    { id: "dup", label: "Duplicate Detection", icon: Copy },
    { id: "qr", label: "QR Hiring", icon: QrCode },
    { id: "form", label: "Candidate Form", icon: Users },
  ];
  return (
    <SplitLayout sections={sections} active={section} onChange={setSection}>
      {section === "parser" && <ResumeParser />}
      {section === "scoring" && <AiScoring />}
      {section === "keywords" && <Keywords />}
      {section === "status" && <StatusRules />}
      {section === "archive" && <AutoArchive />}
      {section === "dup" && <DuplicateDetection />}
      {section === "qr" && <QrHiring />}
      {section === "form" && <CandidateForm />}
    </SplitLayout>
  );
}

function ResumeParser() {
  return (
    <Card title="Resume Parser Settings" desc="Configure file ingestion and OCR.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Allowed File Types"><Input defaultValue="PDF, DOCX, DOC, RTF" /></Field>
        <Field label="Max Resume Size (MB)"><Input defaultValue="10" /></Field>
        <Field label="Enable OCR"><Switch checked /></Field>
        <Field label="OCR Language Auto-detect"><Switch checked /></Field>
        <Field label="Parsing Strictness">
          <Select defaultValue="balanced">
            <option value="strict">Strict</option>
            <option value="balanced">Balanced</option>
            <option value="loose">Loose</option>
          </Select>
        </Field>
      </div>
    </Card>
  );
}

function AiScoring() {
  const [w, setW] = useState({ skill: 35, exp: 25, ctc: 15, loc: 10, qual: 15 });
  const total = w.skill + w.exp + w.ctc + w.loc + w.qual;
  const items: { key: keyof typeof w; label: string }[] = [
    { key: "skill", label: "Skills" },
    { key: "exp", label: "Experience" },
    { key: "ctc", label: "CTC Match" },
    { key: "loc", label: "Location" },
    { key: "qual", label: "Qualification" },
  ];
  return (
    <Card title="AI Scoring Weightage" desc="Tune how candidates are scored against MRFs.">
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.key}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-foreground">{i.label}</span>
              <span className="font-medium text-primary">{w[i.key]}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={w[i.key]}
              onChange={(e) => setW({ ...w, [i.key]: Number(e.target.value) })}
              className="w-full accent-[hsl(var(--primary))]"
            />
          </div>
        ))}
        <div className={cn("mt-3 rounded-xl border px-4 py-3 text-[13px]",
          total === 100 ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                         : "border-amber-200 bg-amber-50 text-amber-700")}>
          Total: <strong>{total}%</strong> {total === 100 ? "— balanced" : "— must equal 100%"}
        </div>
      </div>
    </Card>
  );
}

function Keywords() {
  const roles = ["Security Guard", "Housekeeping", "Electrician", "HVAC Technician", "Pantry Boy", "Maintenance Technician"];
  const [active, setActive] = useState(roles[0]);
  return (
    <Card title="Keyword Management" desc="Per-role keywords used for resume matching.">
      <div className="flex flex-wrap gap-1.5">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setActive(r)}
            className={cn("rounded-full border px-3 py-1 text-[12px] transition-colors",
              active === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}
          >{r}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <ChipGroup label="Mandatory" tone="primary" defaults={["Security License", "PSARA", "Physical Fitness"]} />
        <ChipGroup label="Preferred" tone="accent" defaults={["English", "Driving License", "First Aid"]} />
        <ChipGroup label="Negative" tone="danger" defaults={["Criminal Record"]} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Min Experience (yrs)"><Input defaultValue="1" /></Field>
        <Field label="Qualification"><Input defaultValue="10th Pass" /></Field>
        <Field label="Salary Range"><Input defaultValue="₹15k – ₹22k" /></Field>
      </div>
    </Card>
  );
}

function ChipGroup({ label, defaults, tone }: { label: string; defaults: string[]; tone: "primary" | "accent" | "danger" }) {
  const [chips, setChips] = useState(defaults);
  const [v, setV] = useState("");
  const styles = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-orange-50 text-orange-600",
    danger: "bg-red-50 text-red-600",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-2 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span key={c} className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px]", styles)}>
            {c}
            <button onClick={() => setChips(chips.filter((x) => x !== c))} className="opacity-60 hover:opacity-100">×</button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5">
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Add keyword"
          className="h-8 flex-1 rounded-md border border-border bg-background px-2 text-[12px] focus:border-primary focus:outline-none" />
        <button
          onClick={() => { if (v.trim()) { setChips([...chips, v.trim()]); setV(""); } }}
          className="inline-flex h-8 items-center rounded-md bg-primary px-2.5 text-[12px] font-medium text-primary-foreground"
        ><Plus size={12} /></button>
      </div>
    </div>
  );
}

function StatusRules() {
  const statuses = [
    { name: "Shortlisted", color: "bg-emerald-500" },
    { name: "Review", color: "bg-blue-500" },
    { name: "Rejected", color: "bg-red-500" },
    { name: "On Hold", color: "bg-amber-500" },
    { name: "Talent Pool", color: "bg-violet-500" },
  ];
  return (
    <Card title="Resume Status Rules" desc="Manage candidate lifecycle states.">
      <div className="grid gap-2 sm:grid-cols-2">
        {statuses.map((s) => (
          <div key={s.name} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", s.color)} />
              <span className="text-[13px] font-medium text-foreground">{s.name}</span>
            </div>
            <Switch checked />
          </div>
        ))}
      </div>
    </Card>
  );
}

function AutoArchive() {
  const rules = [
    { from: "Review", days: 15 },
    { from: "On Hold", days: 60 },
    { from: "Talent Pool", days: 0 },
  ];
  return (
    <Card title="Auto Archive Rules" desc="Move stale candidates automatically.">
      <div className="space-y-2">
        {rules.map((r) => (
          <div key={r.from} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-[13px]">
            <span><strong className="text-foreground">{r.from}</strong> after</span>
            <div className="flex items-center gap-2">
              <Input defaultValue={String(r.days)} className="w-20 text-center" />
              <span className="text-muted-foreground">days {r.days === 0 && "(permanent)"}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DuplicateDetection() {
  return (
    <Card title="Duplicate Detection" desc="Identify duplicates across critical fields.">
      <div className="grid gap-3 sm:grid-cols-2">
        <ToggleRow label="Mobile Number" defaultChecked />
        <ToggleRow label="Email Address" defaultChecked />
        <ToggleRow label="Similar Name Detection" defaultChecked />
        <ToggleRow label="Similar Resume Detection" defaultChecked />
      </div>
      <div className="mt-4">
        <Field label="Detection Mode">
          <Select defaultValue="warning">
            <option value="strict">Strict — block create</option>
            <option value="warning">Warning — flag &amp; allow</option>
            <option value="override">Allow Override</option>
          </Select>
        </Field>
      </div>
    </Card>
  );
}

function QrHiring() {
  return (
    <Card title="QR Hiring Settings" desc="Generate QR-based public application links.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="QR per Role"><Switch checked /></Field>
        <Field label="QR per Site"><Switch checked /></Field>
        <Field label="Mobile Optimized Form"><Switch checked /></Field>
        <Field label="QR Expiry (days)"><Input defaultValue="30" /></Field>
      </div>
      <div className="mt-4 flex items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <div className="grid h-24 w-24 place-items-center rounded-lg bg-foreground/90">
          <QrCode size={56} className="text-background" />
        </div>
        <div>
          <div className="text-[13px] font-medium text-foreground">Sample QR — Security Guard / Site MUM-01</div>
          <div className="text-[12px] text-muted-foreground">Anyone scanning will land on a mobile-optimized application form.</div>
        </div>
      </div>
    </Card>
  );
}

function CandidateForm() {
  const fields = ["Full Name", "Mobile Number", "Email Address", "City", "Experience", "Qualification", "Skills", "Preferred Location", "Current Company", "Languages Known", "Resume Upload"];
  return (
    <Card title="Candidate Form Setup" desc="Choose fields shown to candidates on QR / public forms.">
      <div className="grid gap-2 sm:grid-cols-2">
        {fields.map((f) => (
          <ToggleRow key={f} label={f} defaultChecked />
        ))}
      </div>
    </Card>
  );
}

/* ───────────────────────── Shared UI ───────────────────────── */

function SplitLayout({
  sections,
  active,
  onChange,
  children,
}: {
  sections: { id: string; label: string; icon: any }[];
  active: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-1 rounded-2xl border border-border bg-card p-2">
        {sections.map((s) => {
          const Icon = s.icon;
          const a = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors",
                a ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon size={15} />
              <span className="flex-1 truncate">{s.label}</span>
              {a && <ChevronRight size={14} />}
            </button>
          );
        })}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <header className="mb-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
        {desc && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{desc}</p>}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children, inline }: { label: string; children: React.ReactNode; inline?: boolean }) {
  if (inline) {
    return (
      <label className="flex items-center gap-2 text-[12px] text-muted-foreground">
        {label}
        {children}
      </label>
    );
  }
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Input({ className, ...p }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...p}
      className={cn("h-9 w-full rounded-md border border-border bg-background px-2.5 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15", className)}
    />
  );
}

function Select({ children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...p}
      className="h-9 w-full rounded-md border border-border bg-background px-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
    >
      {children}
    </select>
  );
}

function Switch({ checked, onChange }: { checked?: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(!!checked);
  return (
    <button
      type="button"
      onClick={() => { setOn(!on); onChange?.(!on); }}
      className={cn("relative h-5 w-9 rounded-full transition-colors", on ? "bg-primary" : "bg-muted")}
    >
      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all", on ? "left-[18px]" : "left-0.5")} />
    </button>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-[13px] text-foreground">{label}</span>
      <Switch checked={defaultChecked} />
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-3.5 py-2.5 text-[11.5px] font-medium uppercase tracking-wide">{children}</th>;
}
function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-3.5 py-2.5 text-[13px] text-muted-foreground", className)}>{children}</td>;
}
function AddRowButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2 text-[12.5px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
      <Plus size={13} /> {label}
    </button>
  );
}
