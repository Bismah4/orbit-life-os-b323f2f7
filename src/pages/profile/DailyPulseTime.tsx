import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { ScreenHeader } from "@/components/orbit/ScreenHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DailyPulseTime = () => {
  const navigate = useNavigate();
  const { dailyPulseTime, setSetting } = useOrbit();
  const [t, setT] = useState(dailyPulseTime);

  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader title="Daily Pulse Time" />
      <div className="px-5 mt-4 space-y-4">
        <div className="premium-card p-5 text-center">
          <div className="text-xs text-muted-foreground">Orbit will check in with you at</div>
          <div className="text-3xl font-semibold mt-2 tracking-tight">{t}</div>
        </div>
        <div>
          <Input type="time" value={t} onChange={(e) => setT(e.target.value)} className="bg-secondary border-border h-12" />
        </div>
        <Button onClick={() => { setSetting("dailyPulseTime", t); toast.success("Daily Pulse time updated"); navigate(-1); }}
          className="w-full h-12 rounded-2xl" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default DailyPulseTime;
