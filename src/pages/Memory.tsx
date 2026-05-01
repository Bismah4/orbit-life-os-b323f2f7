import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";
import { CATEGORY_META, Category } from "@/lib/design";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { fmtRelative } from "@/lib/time";

const Memory = () => {
  const navigate = useNavigate();
  const { tasks } = useOrbit();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<"all" | Category>("all");

  const items = useMemo(() => {
    return tasks.filter((t) => {
      if (tag !== "all" && t.category !== tag) return false;
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tasks, q, tag]);

  return (
    <div className="px-5 pt-6 pb-6 min-h-screen">
      <h1 className="text-xl font-semibold tracking-tight">Memory</h1>
      <p className="text-xs text-muted-foreground mt-1">Everything Orbit remembers for you.</p>

      <div className="mt-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search memory…"
          className="pl-9 bg-secondary border-border h-11 rounded-xl" />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto scroll-hide -mx-5 px-5">
        <button onClick={() => setTag("all")} className={`shrink-0 px-3 py-1.5 rounded-full text-xs tap ${tag === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>All</button>
        {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
          <button key={c} onClick={() => setTag(c)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs tap ${tag === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {items.length === 0 && <div className="premium-card p-6 text-center text-sm text-muted-foreground">No memories match.</div>}
        {items.map((t) => (
          <button key={t.id} onClick={() => navigate(`/task/${t.id}`)} className="w-full premium-card p-4 text-left tap">
            <div className="flex items-center gap-1.5 mb-1">
              <CategoryPill category={t.category} />
              <PriorityPill priority={t.priority} />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{t.title}</div>
                <div className="text-[11px] text-muted-foreground">{fmtRelative(t.createdAt)}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Memory;
