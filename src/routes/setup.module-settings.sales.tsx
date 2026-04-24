import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Save,
  Settings2,
} from "lucide-react";
import {
  leadStages,
  leadSources,
  leadRegions,
  leadSites,
  leadIndustries,
  leadLostReasons,
  leadAssignmentRules,
  leadSlaRules,
  leadCustomFields,
  type LeadStage,
  type LeadSource,
  type LeadLostReason,
} from "@/setup/leadsConfig";

export const Route = createFileRoute("/setup/module-settings/sales")({
  head: () => ({
    meta: [
      { title: "Sales Setup — Leads Configuration | Logicon ERP" },
      {
        name: "description",
        content:
          "Configure Lead pipeline stages, sources, scoring, assignment rules, SLAs and custom fields. Changes reflect across the Leads module instantly.",
      },
      { property: "og:title", content: "Sales Module Setup — Logicon ERP" },
      {
        property: "og:description",
        content:
          "Admin configuration for the Leads CRM module: pipeline, sources, regions, scoring, assignment, SLA and custom fields.",
      },
    ],
  }),
  component: SalesSetupPage,
});

const sections = [
  { id: "pipeline", label: "Lead Pipeline" },
  { id: "sources", label: "Lead Sources" },
  { id: "regions", label: "Region & Site Mapping" },
  { id: "scoring", label: "Lead Scoring" },
  { id: "assignment", label: "Auto Assignment" },
  { id: "sla", label: "Follow-up SLA" },
  { id: "lost", label: "Lost Reasons" },
  { id: "fields", label: "Field Configuration" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function SalesSetupPage() {
  const [active, setActive] = useState<SectionId>("pipeline");
  const [stages, setStages] = useState<LeadStage[]>(leadStages);
  const [sources, setSources] = useState<LeadSource[]>(leadSources);
  const [reasons, setReasons] = useState<LeadLostReason[]>(leadLostReasons);

  return (
    <AppLayout>
      <div className="space-y-5 px-1 pb-12">
        {/* Breadcrumb + header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-1 text-[12px] text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Setup</Link>
              <span>/</span>
              <span>Module Settings</span>
              <span>/</span>
              <span className="font-medium text-foreground">Sales</span>
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Sales Module Setup
            </h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Configure pipeline, sources, scoring, assignment and SLA rules for{" "}
              <Link to="/sales/lead" className="text-primary hover:underline">
                Leads Management
              </Link>
              . Changes reflect instantly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/sales/lead"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[13px] font-medium hover:bg-accent"
            >
              <ArrowLeft size={14} /> Back to Leads
            </Link>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
          {/* Side nav */}
          <aside className="rounded-lg border border-border bg-card p-2">
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors ${
                    active === s.id
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Settings2 size={13} className="shrink-0" />
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Section panel */}
          <div className="rounded-lg border border-border bg-card p-5">
            {active === "pipeline" && (
              <PipelineSection stages={stages} setStages={setStages} />
            )}
            {active === "sources" && (
              <SourcesSection sources={sources} setSources={setSources} />
            )}
            {active === "regions" && <RegionSection />}
            {active === "scoring" && <ScoringSection />}
            {active === "assignment" && <AssignmentSection />}
            {active === "sla" && <SlaSection />}
            {active === "lost" && <LostSection reasons={reasons} setReasons={setReasons} />}
            {active === "fields" && <FieldsSection />}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* ----------------------------- Pipeline ----------------------------- */

function PipelineSection({
  stages,
  setStages,
}: {
  stages: LeadStage[];
  setStages: (s: LeadStage[]) => void;
}) {
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...stages];
    const t = next[idx + dir];
    if (!t) return;
    next[idx + dir] = next[idx];
    next[idx] = t;
    setStages(next.map((s, i) => ({ ...s, order: i + 1 })));
  };

  return (
    <SectionShell
      title="Lead Pipeline Configuration"
      subtitle="Add, edit or reorder pipeline stages. Mark final stages (Won/Lost) and control who can move leads."
      action={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95">
          <Plus size={14} /> Add Stage
        </button>
      }
    >
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-muted/40 text-[11.5px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="w-10 px-3 py-2.5"></th>
              <th className="px-3 py-2.5 text-left font-medium">Stage</th>
              <th className="px-3 py-2.5 text-left font-medium">Color</th>
              <th className="px-3 py-2.5 text-left font-medium">Final?</th>
              <th className="px-3 py-2.5 text-left font-medium">Permission</th>
              <th className="px-3 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {stages.map((s, idx) => (
              <tr key={s.id}>
                <td className="px-3 py-2.5">
                  <div className="flex flex-col">
                    <button onClick={() => move(idx, -1)} className="text-muted-foreground hover:text-foreground">▲</button>
                    <button onClick={() => move(idx, 1)} className="text-muted-foreground hover:text-foreground">▼</button>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <GripVertical size={13} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-4 w-4 rounded" style={{ backgroundColor: s.color }} />
                    <span className="font-mono text-[11.5px] text-muted-foreground">{s.color}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  {s.isFinal === "won" && <Pill tone="emerald">Won</Pill>}
                  {s.isFinal === "lost" && <Pill tone="rose">Lost</Pill>}
                  {!s.isFinal && <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-3 py-2.5 capitalize">{s.permission}</td>
                <td className="px-3 py-2.5 text-right">
                  <RowActions />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

/* ----------------------------- Sources ----------------------------- */

function SourcesSection({
  sources,
  setSources,
}: {
  sources: LeadSource[];
  setSources: (s: LeadSource[]) => void;
}) {
  const toggle = (id: string) =>
    setSources(sources.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  return (
    <SectionShell
      title="Lead Sources"
      subtitle="Manage where leads come from. Anything added here appears instantly in the Lead form, filters and reports."
      action={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95">
          <Plus size={14} /> Add Source
        </button>
      }
    >
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-muted/40 text-[11.5px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2.5 text-left font-medium">Source Name</th>
              <th className="px-3 py-2.5 text-left font-medium">Score Weight</th>
              <th className="px-3 py-2.5 text-left font-medium">Status</th>
              <th className="px-3 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {sources.map((s) => (
              <tr key={s.id}>
                <td className="px-3 py-2.5 font-medium text-foreground">{s.name}</td>
                <td className="px-3 py-2.5">+{s.score} pts</td>
                <td className="px-3 py-2.5">
                  <button
                    onClick={() => toggle(s.id)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      s.active ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        s.active ? "translate-x-[18px]" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <RowActions />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

/* ----------------------------- Region & Site ----------------------------- */

function RegionSection() {
  return (
    <SectionShell
      title="Region & Site Mapping"
      subtitle="Sites in the lead form filter automatically by selected Region."
      action={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95">
          <Plus size={14} /> Add Region
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {leadRegions.map((r) => {
          const sites = leadSites.filter((s) => s.regionId === r.id);
          return (
            <div key={r.id} className="rounded-md border border-border bg-background">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div className="font-medium text-foreground">{r.name}</div>
                <div className="flex items-center gap-1">
                  <button className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><Pencil size={12} /></button>
                  <button className="rounded p-1 text-muted-foreground hover:bg-rose-50 hover:text-rose-600"><Trash2 size={12} /></button>
                </div>
              </div>
              <ul className="divide-y divide-border text-[12.5px]">
                {sites.map((s) => (
                  <li key={s.id} className="flex items-center justify-between px-3 py-2">
                    <span>{s.name}</span>
                    <button className="text-[11px] text-muted-foreground hover:text-foreground">Remove</button>
                  </li>
                ))}
                <li className="px-3 py-2">
                  <button className="text-[12px] text-primary hover:underline">+ Add Site</button>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

/* ----------------------------- Scoring ----------------------------- */

function ScoringSection() {
  return (
    <SectionShell
      title="Lead Scoring Rules"
      subtitle="Configure how the system computes a lead's score (Hot / Warm / Cold)."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ScoreCard title="Source-based" rules={leadSources.map((s) => ({ k: s.name, v: `+${s.score}` }))} />
        <ScoreCard title="Industry-based" rules={leadIndustries.map((i) => ({ k: i.name, v: `+${i.score}` }))} />
        <ScoreCard
          title="Value-based"
          rules={[
            { k: "≥ ₹10L", v: "+25" },
            { k: "≥ ₹2.5L", v: "+15" },
            { k: "≥ ₹50K", v: "+8" },
            { k: "Below ₹50K", v: "+3" },
          ]}
        />
        <ScoreCard
          title="Engagement-based"
          rules={[
            { k: "Probability % × 0.2", v: "auto" },
            { k: "Email opened", v: "+5" },
            { k: "Meeting booked", v: "+10" },
          ]}
        />
      </div>

      <div className="mt-5 rounded-md border border-border bg-muted/30 p-4">
        <div className="text-[12px] font-semibold text-foreground">Score Bands</div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <BandTile name="Hot" range="≥ 60" tone="bg-rose-50 text-rose-700 ring-rose-200" />
          <BandTile name="Warm" range="30 – 59" tone="bg-amber-50 text-amber-700 ring-amber-200" />
          <BandTile name="Cold" range="< 30" tone="bg-sky-50 text-sky-700 ring-sky-200" />
        </div>
      </div>
    </SectionShell>
  );
}

function ScoreCard({ title, rules }: { title: string; rules: { k: string; v: string }[] }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="mb-2 text-[12px] font-semibold text-foreground">{title}</div>
      <ul className="space-y-1.5">
        {rules.map((r) => (
          <li key={r.k} className="flex items-center justify-between text-[12.5px]">
            <span className="text-muted-foreground">{r.k}</span>
            <span className="font-medium text-foreground">{r.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BandTile({ name, range, tone }: { name: string; range: string; tone: string }) {
  return (
    <div className={`rounded-md p-3 text-center ring-1 ${tone}`}>
      <div className="text-[13px] font-semibold">{name}</div>
      <div className="text-[11.5px]">{range}</div>
    </div>
  );
}

/* ----------------------------- Assignment ----------------------------- */

function AssignmentSection() {
  return (
    <SectionShell
      title="Auto Assignment Rules"
      subtitle="Define how new leads are assigned to sales executives. Rules run in order."
      action={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95">
          <Plus size={14} /> Add Rule
        </button>
      }
    >
      <div className="space-y-2">
        {leadAssignmentRules.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <GripVertical size={14} className="text-muted-foreground" />
              <div>
                <div className="text-[13px] font-medium text-foreground">{r.name}</div>
                <div className="text-[11.5px] text-muted-foreground capitalize">{r.type.replace("-", " ")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pill tone={r.active ? "emerald" : "slate"}>{r.active ? "Active" : "Inactive"}</Pill>
              <RowActions />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ----------------------------- SLA ----------------------------- */

function SlaSection() {
  return (
    <SectionShell
      title="Follow-up SLA Rules"
      subtitle="Set first-response, follow-up cadence and escalation per pipeline stage."
    >
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-muted/40 text-[11.5px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2.5 text-left font-medium">Stage</th>
              <th className="px-3 py-2.5 text-left font-medium">First Response</th>
              <th className="px-3 py-2.5 text-left font-medium">Follow-up Interval</th>
              <th className="px-3 py-2.5 text-left font-medium">Escalate After</th>
              <th className="px-3 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {leadSlaRules.map((r) => {
              const stage = leadStages.find((s) => s.id === r.stage);
              return (
                <tr key={r.id}>
                  <td className="px-3 py-2.5 font-medium text-foreground">{stage?.name}</td>
                  <td className="px-3 py-2.5">{r.firstResponseHrs} hrs</td>
                  <td className="px-3 py-2.5">Every {r.followUpDays} day(s)</td>
                  <td className="px-3 py-2.5">{r.escalateAfterHrs} hrs</td>
                  <td className="px-3 py-2.5 text-right"><RowActions /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

/* ----------------------------- Lost ----------------------------- */

function LostSection({
  reasons,
  setReasons,
}: {
  reasons: LeadLostReason[];
  setReasons: (r: LeadLostReason[]) => void;
}) {
  const toggle = (id: string) =>
    setReasons(reasons.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  return (
    <SectionShell
      title="Lost Reasons"
      subtitle="Mandatory selection when a lead is moved to Lost stage."
      action={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95">
          <Plus size={14} /> Add Reason
        </button>
      }
    >
      <div className="space-y-2">
        {reasons.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5">
            <div className="text-[13px] font-medium text-foreground">{r.name}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggle(r.id)}
                className={`relative h-5 w-9 rounded-full transition-colors ${r.active ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${r.active ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
              <RowActions />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ----------------------------- Field config ----------------------------- */

function FieldsSection() {
  return (
    <SectionShell
      title="Field Configuration"
      subtitle="Add custom fields, mark as required, and control role visibility."
      action={
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground hover:opacity-95">
          <Plus size={14} /> Add Field
        </button>
      }
    >
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-muted/40 text-[11.5px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2.5 text-left font-medium">Label</th>
              <th className="px-3 py-2.5 text-left font-medium">Type</th>
              <th className="px-3 py-2.5 text-left font-medium">Required</th>
              <th className="px-3 py-2.5 text-left font-medium">Visible To</th>
              <th className="px-3 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {leadCustomFields.map((f) => (
              <tr key={f.id}>
                <td className="px-3 py-2.5 font-medium text-foreground">{f.label}</td>
                <td className="px-3 py-2.5 capitalize">{f.type}</td>
                <td className="px-3 py-2.5">{f.required ? <Pill tone="rose">Required</Pill> : <span className="text-muted-foreground">Optional</span>}</td>
                <td className="px-3 py-2.5 capitalize">{f.visibleTo.join(", ")}</td>
                <td className="px-3 py-2.5 text-right"><RowActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

/* ----------------------------- Shells ----------------------------- */

function SectionShell({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function RowActions() {
  return (
    <div className="inline-flex items-center gap-1">
      <button className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><Pencil size={12} /></button>
      <button className="rounded p-1 text-muted-foreground hover:bg-rose-50 hover:text-rose-600"><Trash2 size={12} /></button>
    </div>
  );
}

function Pill({ tone, children }: { tone: "emerald" | "rose" | "slate"; children: React.ReactNode }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  } as const;
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}
