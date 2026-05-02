import { useNavigate, useParams } from "react-router-dom";
import { ScreenHeader } from "@/components/orbit/ScreenHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronRight, Plus, ArrowUpDown, Filter, Download, Bell, Check, Edit3, Archive, Receipt, FileText, RefreshCw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useOrbit, AdminItemKind } from "@/store/orbit";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";
import { Button } from "@/components/ui/button";
import { ReminderModal } from "@/components/orbit/ReminderModal";
import { useState } from "react";
import { fmtDateTime, fmtRelative } from "@/lib/time";

const KIND_META: Record<AdminItemKind, { label: string; color: string; icon: any }> = {
  bills: { label: "Bills", color: "152 65% 52%", icon: Receipt },
  documents: { label: "Documents", color: "200 95% 60%", icon: FileText },
  renewals: { label: "Renewals", color: "38 95% 60%", icon: RefreshCw },
};

export const Admin = () => {
  const navigate = useNavigate();
  const { tasks, adminItems } = useOrbit();
  const delayed = tasks.filter((t) => t.category === "admin" && t.status === "needs_action");

  const counts = (k: AdminItemKind) => adminItems.filter((x) => x.kind === k && x.status === "active").length;

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

      <div className="px-5 mt-4 grid grid-cols-3 gap-3">
        {(Object.keys(KIND_META) as AdminItemKind[]).map((k) => {
          const m = KIND_META[k];
          const Icon = m.icon;
          return (
            <button key={k} onClick={() => navigate(`/admin/${k}`)} className="premium-card p-4 text-left tap">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `hsl(${m.color} / 0.15)`, color: `hsl(${m.color})` }}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="text-2xl font-semibold tracking-tight">{counts(k)}</div>
            </button>
          );
        })}
      </div>

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
  const { cat } = useParams<{ cat: AdminItemKind }>();
  const navigate = useNavigate();
  const { adminItems } = useOrbit();
  const meta = cat ? KIND_META[cat] : undefined;
  const items = adminItems.filter((x) => x.kind === cat && x.status !== "archived");

  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader title={meta?.label ?? "Admin"} />
      <div className="px-5 mt-4 space-y-2">
        {items.length === 0 && <div className="premium-card p-6 text-center text-sm text-muted-foreground">Nothing here yet.</div>}
        {items.map((it) => {
          const overdue = it.dueAt && it.dueAt < Date.now();
          return (
            <button key={it.id} onClick={() => navigate(`/admin/${cat}/${it.id}`)}
              className="w-full premium-card p-4 text-left tap flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate flex items-center gap-2">
                  {it.title}
                  {it.status === "done" && <span className="text-[10px] text-primary">✓ Done</span>}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {it.amount && <span>{it.amount} · </span>}
                  {it.dueAt ? (
                    <span className={overdue ? "text-destructive" : ""}>
                      {overdue ? "Overdue · " : "Due "}{fmtRelative(it.dueAt)}
                    </span>
                  ) : (
                    <span>{it.meta?.format ?? "Saved"}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const AdminItemDetail = () => {
  const { cat, id } = useParams<{ cat: AdminItemKind; id: string }>();
  const navigate = useNavigate();
  const { adminItems, updateAdminItem, setReminder, addTask } = useOrbit();
  const [remind, setRemind] = useState(false);
  const item = adminItems.find((x) => x.id === id);

  if (!item) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="text-sm text-primary">← Back</button>
        <div className="mt-6 text-muted-foreground">Item not found.</div>
      </div>
    );
  }

  const meta = KIND_META[item.kind];
  const Icon = meta.icon;
  const overdue = item.dueAt && item.dueAt < Date.now();

  return (
    <div className="px-5 pt-6 pb-6 min-h-screen">
      <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full glass-card flex items-center justify-center tap mb-4">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `hsl(${meta.color} / 0.15)`, color: `hsl(${meta.color})` }}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{meta.label}</div>
          <h1 className="text-xl font-semibold tracking-tight truncate">{item.title}</h1>
        </div>
      </div>

      <div className="mt-5 premium-card divide-y divide-border/60">
        {item.amount && (
          <div className="px-4 py-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">{item.amount}</span>
          </div>
        )}
        {item.dueAt && (
          <div className="px-4 py-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Due</span>
            <span className={overdue ? "text-destructive font-medium" : "font-medium"}>
              {fmtDateTime(item.dueAt)} {overdue && "· Overdue"}
            </span>
          </div>
        )}
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium capitalize">{item.status}</span>
        </div>
        {item.meta?.format && (
          <div className="px-4 py-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Format</span>
            <span className="font-medium">{item.meta.format}</span>
          </div>
        )}
      </div>

      {item.notes && (
        <div className="mt-3 premium-card p-4">
          <div className="text-[11px] uppercase tracking-wider text-primary mb-1">Notes</div>
          <div className="text-sm">{item.notes}</div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => setRemind(true)} disabled={item.status === "done"}
          className="rounded-2xl bg-secondary border-border h-12">
          <Bell className="w-4 h-4 mr-2" /> Remind
        </Button>
        <Button onClick={() => { updateAdminItem(item.id, { status: "done" }); toast.success("Marked done"); }}
          disabled={item.status === "done"}
          className="rounded-2xl h-12" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
          <Check className="w-4 h-4 mr-2" /> Mark Done
        </Button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button variant="ghost" onClick={() => toast("Edit (coming soon)")} className="rounded-2xl h-11 bg-secondary/60">
          <Edit3 className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button variant="ghost" onClick={() => { updateAdminItem(item.id, { status: "archived" }); toast("Archived"); navigate(-1); }}
          className="rounded-2xl h-11 bg-secondary/60">
          <Archive className="w-4 h-4 mr-2" /> Archive
        </Button>
      </div>

      <ReminderModal open={remind} onOpenChange={setRemind} title={item.title}
        onPick={(ts) => {
          // create a backing task so reminder lives in feed/notifications too
          const t = addTask({
            title: item.title,
            category: "admin",
            priority: overdue ? "high" : "medium",
            source: "manual",
            suggestedAction: "Handle " + meta.label.toLowerCase(),
            whyItMatters: "Linked from your Admin items.",
            dueAt: item.dueAt,
            meta: { adminItemId: item.id },
          });
          setReminder(t.id, ts);
          toast.success(`Reminder set for ${fmtDateTime(ts)}`);
        }} />
    </div>
  );
};
