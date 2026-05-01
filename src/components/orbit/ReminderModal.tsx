import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRESETS = [
  { label: "In 20 minutes", offset: 20 * 60 * 1000 },
  { label: "In 1 hour", offset: 60 * 60 * 1000 },
  { label: "In 3 hours", offset: 3 * 60 * 60 * 1000 },
];

const tonightAt8 = () => {
  const d = new Date();
  d.setHours(20, 0, 0, 0);
  if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
  return d.getTime();
};
const tomorrowMorning = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(8, 0, 0, 0);
  return d.getTime();
};

export const ReminderModal = ({
  open,
  onOpenChange,
  onPick,
  title,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPick: (ts: number) => void;
  title?: string;
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const pick = (ts: number) => {
    onPick(ts);
    onOpenChange(false);
    setShowCustom(false);
  };

  const submitCustom = () => {
    if (!date || !time) return;
    const ts = new Date(`${date}T${time}`).getTime();
    if (!isNaN(ts) && ts > Date.now()) pick(ts);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setShowCustom(false); }}>
      <DialogContent className="max-w-[400px] mx-auto bg-popover border-border rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-base">Remind me{title ? `: ${title}` : ""}</DialogTitle>
        </DialogHeader>

        {!showCustom ? (
          <div className="space-y-2 mt-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => pick(Date.now() + p.offset)}
                className="w-full text-left px-4 py-3 rounded-xl bg-secondary/60 hover:bg-secondary tap text-sm"
              >
                {p.label}
              </button>
            ))}
            <button onClick={() => pick(tonightAt8())} className="w-full text-left px-4 py-3 rounded-xl bg-secondary/60 hover:bg-secondary tap text-sm">Tonight at 8 PM</button>
            <button onClick={() => pick(tomorrowMorning())} className="w-full text-left px-4 py-3 rounded-xl bg-secondary/60 hover:bg-secondary tap text-sm">Tomorrow morning</button>
            <button onClick={() => setShowCustom(true)} className="w-full text-left px-4 py-3 rounded-xl border border-primary/40 text-primary tap text-sm">
              Custom date & time…
            </button>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs text-muted-foreground">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 bg-secondary border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 bg-secondary border-border" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" className="flex-1" onClick={() => setShowCustom(false)}>Back</Button>
              <Button className="flex-1" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }} onClick={submitCustom}>
                Set reminder
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
