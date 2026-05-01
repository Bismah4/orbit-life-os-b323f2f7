import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { ScreenHeader } from "@/components/orbit/ScreenHeader";
import { toast } from "sonner";
import { Check } from "lucide-react";

const STYLES = [
  { id: "gentle",    label: "Gentle",    desc: "Soft nudges only when needed." },
  { id: "standard",  label: "Standard",  desc: "Balanced reminders, recommended." },
  { id: "insistent", label: "Insistent", desc: "Persistent until you act." },
] as const;

const ReminderStyle = () => {
  const navigate = useNavigate();
  const { reminderStyle, setSetting } = useOrbit();

  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader title="Reminder Style" />
      <div className="px-5 mt-4 space-y-2">
        {STYLES.map((s) => {
          const active = reminderStyle === s.id;
          return (
            <button key={s.id}
              onClick={() => { setSetting("reminderStyle", s.id); toast.success(`Reminder style: ${s.label}`); navigate(-1); }}
              className={`w-full premium-card p-4 flex items-start gap-3 text-left tap ${active ? "border-primary/60" : ""}`}>
              <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                {active && <Check className="w-3 h-3" />}
              </div>
              <div>
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReminderStyle;
