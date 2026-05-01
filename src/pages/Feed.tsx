import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import type { Category } from "@/lib/design";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";
import { ReminderModal } from "@/components/orbit/ReminderModal";
import { Check, Bell, ChevronRight } from "lucide-react";
import { fmtRelative, fmtDateTime } from "@/lib/time";
import { toast } from "sonner";

const FILTERS: { id: "all" | "urgent" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "money", label: "Money" },
  { id: "work", label: "Work" },
  { id: "admin", label: "Admin" },
  { id: "people", label: "People" },
];

const Feed = () => {
  const navigate = useNavigate();
  const { tasks, completeTask, setReminder } = useOrbit();
  const [tab, setTab] = useState<"needs" | "completed">("needs");
  const [filter, setFilter] = useState<typeof FILTERS[number]["id"]>("all");
  const [remindFor, setRemindFor] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => (tab === "needs" ? t.status === "needs_action" : t.status === "completed"));
    if (filter === "urgent") list = list.filter((t) => t.priority === "high");
    else if (filter !== "all") list = list.filter((t) => t.category === filter);
    return list;
  }, [tasks, tab, filter]);

  const reminderTask = tasks.find((t) => t.id === remindFor);

  return (
    <div className="px-5 pt-6 pb-6 min-h-screen">
      <h1 className="text-xl font-semibold tracking-tight">Feed</h1>
      <p className="text-xs text-muted-foreground mt-1">Your AI action queue.</p>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 p-1 bg-secondary/60 rounded-xl">
        <button onClick={() => setTab("needs")} className={`flex-1 py-2 text-sm rounded-lg tap ${tab === "needs" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}>
          Needs Action
        </button>
        <button onClick={() => setTab("completed")} className={`flex-1 py-2 text-sm rounded-lg tap ${tab === "completed" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}>
          Completed
        </button>
      </div>

      {/* Filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto scroll-hide -mx-5 px-5">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs tap ${filter === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-4 space-y-2.5">
        {filtered.length === 0 && (
          <div className="premium-card p-6 text-center text-sm text-muted-foreground">
            {tab === "needs" ? "Nothing needs action 🎉" : "No completed items yet."}
          </div>
        )}
        {filtered.map((t) => (
          <div key={t.id} className="premium-card p-4">
            <button className="w-full text-left tap" onClick={() => navigate(`/task/${t.id}`)}>
              <div className="flex items-start gap-3">
                <div className="w-1 self-stretch rounded-full" style={{ background: `hsl(var(--priority-${t.priority}))` }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <CategoryPill category={t.category} />
                    <PriorityPill priority={t.priority} />
                  </div>
                  <div className="font-medium text-sm">{t.title}</div>
                  {t.suggestedAction && <div className="text-xs text-muted-foreground mt-0.5">→ {t.suggestedAction}</div>}
                  {t.status === "completed" && t.completedAt && (
                    <div className="text-[11px] text-primary mt-1">Completed {fmtRelative(t.completedAt)}</div>
                  )}
                  {t.status === "needs_action" && t.reminderAt && t.reminderAt > Date.now() && (
                    <div className="text-[11px] text-primary mt-1">⏰ Reminder {fmtDateTime(t.reminderAt)}</div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
              </div>
            </button>
            {t.status === "needs_action" && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button onClick={() => setRemindFor(t.id)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-sm tap">
                  <Bell className="w-4 h-4" /> Remind
                </button>
                <button onClick={() => { completeTask(t.id); toast.success("Marked done"); }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm tap"
                  style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
                  <Check className="w-4 h-4" /> Done
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ReminderModal open={!!remindFor} onOpenChange={(v) => !v && setRemindFor(null)}
        title={reminderTask?.title}
        onPick={(ts) => {
          if (remindFor) {
            setReminder(remindFor, ts);
            toast.success(`Reminder set for ${fmtDateTime(ts)}`);
          }
        }} />
    </div>
  );
};

export default Feed;
