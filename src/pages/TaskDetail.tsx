import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";
import { ReminderModal } from "@/components/orbit/ReminderModal";
import { EditItemModal } from "@/components/orbit/EditItemModal";
import { ArrowLeft, Bell, Check, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtDateTime, fmtRelative } from "@/lib/time";
import { toast } from "sonner";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, completeTask, setReminder, removeTask, updateTask } = useOrbit();
  const task = tasks.find((t) => t.id === id);
  const [remind, setRemind] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!task) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="text-sm text-primary">← Back</button>
        <div className="mt-6 text-muted-foreground">Task not found.</div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-6 min-h-screen">
      <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full glass-card flex items-center justify-center tap mb-4">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1.5 flex-wrap">
        <CategoryPill category={task.category} />
        <PriorityPill priority={task.priority} />
        {task.status === "completed" && (
          <span className="pill-category" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.4)" }}>
            ✓ Completed
          </span>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-balance">{task.title}</h1>
      {task.detail && <p className="mt-2 text-sm text-muted-foreground">{task.detail}</p>}

      {/* Source-specific meta */}
      {task.meta && Object.keys(task.meta).length > 0 && (
        <div className="mt-5 premium-card p-4 space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-primary">What Orbit saw</div>
          {task.meta.preview && <img src={task.meta.preview} alt="" className="rounded-xl max-h-48" />}
          {task.meta.transcript && <div className="text-sm italic">"{task.meta.transcript}"</div>}
          {task.meta.text && <div className="text-sm">{task.meta.text}</div>}
          {task.meta.insight && <div className="text-sm">{task.meta.insight}</div>}
          {task.meta.summary && <div className="text-sm">{task.meta.summary}</div>}
          {task.meta.sender && <div className="text-xs text-muted-foreground">From {task.meta.sender} — {task.meta.subject}</div>}
        </div>
      )}

      {task.suggestedAction && (
        <div className="mt-3 premium-card p-4">
          <div className="text-[11px] uppercase tracking-wider text-primary mb-1">Suggested action</div>
          <div className="text-sm">→ {task.suggestedAction}</div>
        </div>
      )}

      {task.whyItMatters && (
        <div className="mt-3 premium-card p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Why it matters</div>
          <div className="text-sm">{task.whyItMatters}</div>
        </div>
      )}

      {task.dueAt && (
        <div className="mt-3 text-xs text-muted-foreground">Due {fmtDateTime(task.dueAt)}</div>
      )}
      {task.reminderAt && task.reminderAt > Date.now() && (
        <div className="mt-1 text-xs text-primary">⏰ Reminder set for {fmtDateTime(task.reminderAt)}</div>
      )}
      {task.completedAt && (
        <div className="mt-1 text-xs text-primary">✓ Completed {fmtRelative(task.completedAt)}</div>
      )}

      {task.status === "needs_action" && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setRemind(true)} className="rounded-2xl bg-secondary border-border h-12">
            <Bell className="w-4 h-4 mr-2" /> Remind
          </Button>
          <Button onClick={() => { completeTask(task.id); toast.success("Marked done"); navigate(-1); }}
            className="rounded-2xl h-12" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
            <Check className="w-4 h-4 mr-2" /> Done
          </Button>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button variant="ghost" onClick={() => setEditOpen(true)} className="rounded-2xl h-11 bg-secondary/60">
          <Edit3 className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button variant="ghost" onClick={() => { removeTask(task.id); toast("Task removed"); navigate(-1); }}
          className="rounded-2xl h-11 bg-secondary/60 text-destructive">
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
      </div>

      <EditItemModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit task"
        fields={["title", "category", "priority", "dueAt", "notes"]}
        initial={{
          title: task.title,
          category: task.category,
          priority: task.priority,
          dueAt: task.dueAt,
          notes: task.detail,
        }}
        onSave={(d) => {
          updateTask(task.id, {
            title: d.title ?? task.title,
            category: d.category ?? task.category,
            priority: d.priority ?? task.priority,
            dueAt: d.dueAt,
            detail: d.notes,
          });
          toast.success("Updated successfully");
        }}
      />

      <ReminderModal open={remind} onOpenChange={setRemind} title={task.title}
        onPick={(ts) => { setReminder(task.id, ts); toast.success(`Reminder set for ${fmtDateTime(ts)}`); }} />
    </div>
  );
};

export default TaskDetail;
