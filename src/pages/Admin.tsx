import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ScreenHeader } from "@/components/orbit/ScreenHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronRight, Plus, ArrowUpDown, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { useOrbit } from "@/store/orbit";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";

const ADMIN_DATA: Record<string, { label: string; items: { id: string; title: string; sub: string }[] }> = {
  bills: {
    label: "Bills",
    items: [
      { id: "b1", title: "Electricity — BESCOM", sub: "₹2,340 · due in 2 days" },
      { id: "b2", title: "Internet — ACT", sub: "₹1,099 · due in 5 days" },
      { id: "b3", title: "Water — BWSSB", sub: "₹420 · overdue" },
    ],
  },
  documents: {
    label: "Documents",
    items: Array.from({ length: 12 }).map((_, i) => ({
      id: "d" + i,
      title: ["Lease agreement", "Aadhaar copy", "PAN card", "Insurance policy", "Bank KYC", "Salary slip", "ITR 2024", "Passport scan", "Driving licence", "Voter ID", "School certificate", "Medical report"][i],
      sub: "PDF · Saved",
    })),
  },
  renewals: {
    label: "Renewals",
    items: [
      { id: "r1", title: "Car insurance — ICICI", sub: "Expires in 7 days" },
      { id: "r2", title: "Domain — orbit.app", sub: "Expires in 21 days" },
    ],
  },
};

export const Admin = () => {
  const navigate = useNavigate();
  const { tasks } = useOrbit();
  const delayed = tasks.filter((t) => t.category === "admin" && t.status === "needs_action");

  const cards = [
    { id: "bills", label: "Bills", count: ADMIN_DATA.bills.items.length, color: "152 65% 52%" },
    { id: "documents", label: "Documents", count: ADMIN_DATA.documents.items.length, color: "200 95% 60%" },
    { id: "renewals", label: "Renewals", count: ADMIN_DATA.renewals.items.length, color: "38 95% 60%" },
  ];

  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader
        title="Admin"
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full glass-card flex items-center justify-center tap" aria-label="Actions">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem onClick={() => navigate("/capture")}><Plus className="w-4 h-4 mr-2" />Add admin task</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Sorted by due date")}><ArrowUpDown className="w-4 h-4 mr-2" />Sort</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Filter applied")}><Filter className="w-4 h-4 mr-2" />Filter</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Exported (mock)")}><Download className="w-4 h-4 mr-2" />Export</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {/* Counts */}
      <div className="px-5 mt-4 grid grid-cols-3 gap-3">
        {cards.map((c) => (
          <button key={c.id} onClick={() => navigate(`/admin/${c.id}`)} className="premium-card p-4 text-left tap">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ background: `hsl(${c.color} / 0.15)`, color: `hsl(${c.color})` }}>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
            <div className="text-2xl font-semibold tracking-tight">{c.count}</div>
          </button>
        ))}
      </div>

      {/* Delayed admin tasks */}
      <div className="px-5 mt-6">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-1">Delayed</div>
        {delayed.length === 0 && <div className="premium-card p-6 text-center text-sm text-muted-foreground">Nothing delayed.</div>}
        <div className="space-y-2">
          {delayed.map((t) => (
            <button key={t.id} onClick={() => navigate(`/task/${t.id}`)} className="w-full premium-card p-4 text-left tap flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <CategoryPill category={t.category} />
                  <PriorityPill priority={t.priority} />
                </div>
                <div className="text-sm truncate">{t.title}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminCategory = () => {
  const { cat } = useParams();
  const data = cat ? ADMIN_DATA[cat] : undefined;
  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader title={data?.label ?? "Admin"} />
      <div className="px-5 mt-4 space-y-2">
        {!data && <div className="text-sm text-muted-foreground">Category not found.</div>}
        {data?.items.map((it) => (
          <button key={it.id} onClick={() => toast(it.title)} className="w-full premium-card p-4 text-left tap flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{it.title}</div>
              <div className="text-[11px] text-muted-foreground truncate">{it.sub}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};
