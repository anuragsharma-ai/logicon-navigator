import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/sales/lead")({
  head: () => ({
    meta: [
      { title: "Lead — Sales | Logicon ERP" },
      { name: "description", content: "Manage and track sales leads in Logicon ERP." },
    ],
  }),
  component: LeadPage,
});

function LeadPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight size={12} />
          <span>Sales</span>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">Lead</span>
        </nav>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Lead</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Capture, qualify and convert sales leads.</p>
        <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center shadow-sm">
          <p className="text-[14px] text-muted-foreground">No leads available yet.</p>
        </div>
      </div>
    </AppLayout>
  );
}
