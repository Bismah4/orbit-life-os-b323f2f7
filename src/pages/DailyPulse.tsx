import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { ScreenHeader } from "@/components/orbit/ScreenHeader";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";
import { ChevronRight, Sparkles } from "lucide-react";

const DailyPulse = () => {
  const navigate = useNavigate();
  const { tasks } = useOrbit();
  const today = tasks.filter((t) => t.status === "needs_action");
  const high = today.filter((t) => t.priority === "high");
  const med  = today.filter((t) => t.priority === "medium");
  const low  = today.filter((t) => t.priority === "low");

  const Section = ({ title, items }: { title: string; items: typeof today }) => items.length ? (
    <section className="mt-5">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-1">{title}</div>
      <div className="space-y-2">
        {items.map((t) => (
          <button key={t.id} onClick={() => navigate(`/task/${t.id}`)} className="w-full premium-card p-4 text-left tap">
            <div className="flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full" style={{ background: `hsl(var(--priority-${t.priority}))` }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <CategoryPill category={t.category} />
                  <PriorityPill priority={t.priority} />
                </div>
                <div className="text-sm font-medium">{t.title}</div>
                {t.suggestedAction && <div className="text-xs text-muted-foreground mt-0.5">→ {t.suggestedAction}</div>}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader title="Daily Pulse" />
      <div className="px-5 mt-2">
        <div className="premium-card p-5 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-44 h-44 glow-orb opacity-60" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Today
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">{today.length} things need you</div>
            <div className="mt-1 text-xs text-muted-foreground">Orbit prioritized your day in order of urgency.</div>
          </div>
        </div>
        <Section title="High priority" items={high} />
        <Section title="Medium priority" items={med} />
        <Section title="Low priority" items={low} />
      </div>
    </div>
  );
};

export default DailyPulse;
