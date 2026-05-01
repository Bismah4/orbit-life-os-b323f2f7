import { useNavigate, useSearchParams } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { useState } from "react";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";
import { ArrowLeft, Bell, X } from "lucide-react";
import { fmtDateTime, fmtRelative } from "@/lib/time";

const Notifications = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { reminders, tasks, dismissReminder } = useOrbit();
  const [tab, setTab] = useState<"upcoming" | "today" | "later" | "completed">(
    (params.get("tab") as any) || "upcoming"
  );

  const now = Date.now();
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

  const active = reminders.filter((r) => !r.dismissed);
  const completed = tasks.filter((t) => t.status === "completed");

  let list: any[] = [];
  if (tab === "upcoming") list = active.filter((r) => r.remindAt > now).sort((a, b) => a.remindAt - b.remindAt);
  else if (tab === "today") list = active.filter((r) => r.remindAt >= startOfDay.getTime() && r.remindAt <= endOfDay.getTime());
  else if (tab === "later") list = active.filter((r) => r.remindAt > endOfDay.getTime());
  else list = completed;

  return (
    <div className="px-5 pt-6 pb-6 min-h-screen">
      <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full glass-card flex items-center justify-center tap mb-4">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>

      <div className="mt-4 flex gap-1 p-1 bg-secondary/60 rounded-xl">
        {(["upcoming", "today", "later", "completed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs capitalize rounded-lg tap ${tab === t ? "bg-background font-medium" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {list.length === 0 && (
          <div className="premium-card p-6 text-center text-sm text-muted-foreground">No items here.</div>
        )}

        {tab === "completed" && list.map((t: any) => (
          <button key={t.id} onClick={() => navigate(`/task/${t.id}`)} className="w-full premium-card p-4 text-left tap">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CategoryPill category={t.category} />
              <PriorityPill priority={t.priority} />
            </div>
            <div className="text-sm font-medium">{t.title}</div>
            <div className="text-[11px] text-primary mt-1">✓ Completed {fmtRelative(t.completedAt)}</div>
          </button>
        ))}

        {tab !== "completed" && list.map((r: any) => (
          <div key={r.id} className="premium-card p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <CategoryPill category={r.category} />
                  <PriorityPill priority={r.priority} />
                </div>
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-[11px] text-primary mt-0.5">⏰ {fmtDateTime(r.remindAt)}</div>
              </div>
              <button onClick={() => dismissReminder(r.id)} className="p-1 text-muted-foreground tap">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => navigate(`/task/${r.taskId}`)} className="px-3 py-2 rounded-xl bg-secondary text-sm tap">Open</button>
              <button onClick={() => dismissReminder(r.id)} className="px-3 py-2 rounded-xl text-sm tap"
                style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
