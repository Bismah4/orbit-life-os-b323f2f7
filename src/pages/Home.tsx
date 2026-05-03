import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrbit } from "@/store/orbit";
import { Bell, ChevronRight, Sparkles } from "lucide-react";
import { QuickProfilePanel } from "@/components/orbit/QuickProfilePanel";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";

const Home = () => {
  const navigate = useNavigate();
  const { profile, tasks, reminders } = useOrbit();
  const [quickOpen, setQuickOpen] = useState(false);

  const needsAction = tasks.filter((t) => t.status === "needs_action");
  const top3 = needsAction.slice(0, 3);
  const canWait = needsAction.slice(3, 6);

  const greet = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const upcomingReminders = reminders.filter((r) => !r.dismissed && r.remindAt > Date.now()).length;

  return (
    <div className="relative min-h-screen pb-4">
      <div className="absolute inset-x-0 top-0 h-64 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />

      {/* Header */}
      <header className="relative px-5 pt-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{greet}</div>
          <div className="text-xl font-semibold tracking-tight">{profile.name.split(" ")[0]}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 rounded-full glass-card flex items-center justify-center tap"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {upcomingReminders > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
          <button
            onClick={() => setQuickOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold tap"
            style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}
            aria-label="Quick profile"
          >
            {profile.avatarInitial}
          </button>
        </div>
      </header>

      {/* Daily Pulse */}
      <section className="relative px-5 mt-6">
        <button
          onClick={() => navigate("/daily-pulse")}
          className="w-full premium-card p-5 text-left tap relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 glow-orb opacity-60" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-primary font-medium">
                <Sparkles className="w-3.5 h-3.5" /> Daily Pulse
              </div>
              {tasks.length === 0 ? (
                <>
                  <div className="mt-1 text-lg font-semibold tracking-tight">Nothing needs you yet</div>
                  <div className="mt-1 text-xs text-muted-foreground">Add your first item so Orbit can start prioritizing your day.</div>
                </>
              ) : (
                <>
                  <div className="mt-1 text-lg font-semibold tracking-tight">{needsAction.length} things need you today</div>
                  <div className="mt-1 text-xs text-muted-foreground">Orbit prioritized your day</div>
                </>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </button>
      </section>

      {/* Empty first-run CTA */}
      {tasks.length === 0 && (
        <section className="relative px-5 mt-5">
          <button
            onClick={() => navigate("/capture")}
            className="w-full py-3.5 rounded-2xl text-sm font-medium tap"
            style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-glow)" }}
          >
            + Add your first item
          </button>
        </section>
      )}

      {/* Smart Actions */}
      <section className="relative px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Smart Actions</h2>
          <button onClick={() => navigate("/feed")} className="text-xs text-primary tap">View all</button>
        </div>
        <div className="space-y-2.5">
          {top3.length === 0 && (
            <div className="premium-card p-5 text-center text-sm text-muted-foreground">
              {tasks.length === 0
                ? "No smart actions yet. Capture a task, bill, note, or reminder to get started."
                : "You're all caught up ✨"}
            </div>
          )}
          {top3.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/task/${t.id}`)}
              className="w-full premium-card p-4 text-left tap"
            >
              <div className="flex items-start gap-3">
                <div className="w-1 self-stretch rounded-full" style={{ background: `hsl(var(--priority-${t.priority}))` }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CategoryPill category={t.category} />
                    <PriorityPill priority={t.priority} />
                  </div>
                  <div className="font-medium text-sm truncate">{t.title}</div>
                  {t.suggestedAction && (
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">→ {t.suggestedAction}</div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Can Wait */}
      {canWait.length > 0 && (
        <section className="relative px-5 mt-6">
          <h2 className="text-sm font-semibold mb-3">Can wait</h2>
          <div className="premium-card divide-y divide-border/60">
            {canWait.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/task/${t.id}`)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left tap hover:bg-secondary/40"
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(var(--priority-${t.priority}))` }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{t.suggestedAction ?? t.detail}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
      )}

      <QuickProfilePanel open={quickOpen} onOpenChange={setQuickOpen} />
    </div>
  );
};

export default Home;
