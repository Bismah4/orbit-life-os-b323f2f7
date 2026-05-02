import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, ArrowLeft, Crown, Zap, Brain, Bell, BookmarkCheck, Palette } from "lucide-react";
import { toast } from "sonner";

const FEATURES = [
  { icon: Zap, t: "Unlimited captures", s: "Capture without daily limits" },
  { icon: Brain, t: "Advanced AI understanding", s: "Deeper context, better suggestions" },
  { icon: Bell, t: "Unlimited reminders", s: "Recurring & smart timing" },
  { icon: BookmarkCheck, t: "Deep memory search", s: "Search every captured detail" },
  { icon: Palette, t: "Premium themes & widgets", s: "Make Orbit truly yours" },
  { icon: Crown, t: "Priority support", s: "Always heard, always first" },
];

const Premium = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reason = (location.state as any)?.reason as string | undefined;
  const { setPremium } = useOrbit();
  const [plan, setPlan] = useState<"yearly" | "monthly">("yearly");

  const startTrial = () => {
    setPremium(true, 7);
    toast.success("7-day free trial started");
    navigate(-1);
  };
  const subscribe = () => {
    setPremium(true);
    toast.success(`Subscribed: ${plan === "yearly" ? "Yearly" : "Monthly"}`);
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen pb-8">
      <div className="absolute inset-x-0 top-0 h-72 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
      <div className="relative px-5 pt-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full glass-card flex items-center justify-center tap">
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="relative px-5 mt-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
          style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
          <Sparkles className="w-3 h-3" /> Orbit Premium
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-balance">Unlock the full power of Orbit</h1>
        <p className="mt-2 text-sm text-muted-foreground text-balance max-w-[300px] mx-auto">
          {reason || "Smarter AI, unlimited captures, deeper memory."}
        </p>
      </div>

      <div className="px-5 mt-6 space-y-2">
        {FEATURES.map(({ icon: Icon, t, s }) => (
          <div key={t} className="premium-card p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{t}</div>
              <div className="text-[11px] text-muted-foreground">{s}</div>
            </div>
            <Check className="w-4 h-4 text-primary" />
          </div>
        ))}
      </div>

      <div className="px-5 mt-6 grid grid-cols-2 gap-3">
        {[
          { id: "yearly", title: "Yearly", price: "$59.99", sub: "$5/mo · save 50%", badge: "Best value" },
          { id: "monthly", title: "Monthly", price: "$9.99", sub: "per month" },
        ].map((p: any) => (
          <button key={p.id} onClick={() => setPlan(p.id)}
            className={`relative premium-card p-4 text-left tap ${plan === p.id ? "ring-2 ring-primary" : ""}`}>
            {p.badge && (
              <span className="absolute -top-2 right-3 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>{p.badge}</span>
            )}
            <div className="text-xs text-muted-foreground">{p.title}</div>
            <div className="text-lg font-semibold tracking-tight mt-0.5">{p.price}</div>
            <div className="text-[11px] text-muted-foreground">{p.sub}</div>
          </button>
        ))}
      </div>

      <div className="px-5 mt-5 space-y-2">
        <Button onClick={startTrial} className="w-full h-12 rounded-2xl text-base font-medium"
          style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
          Start 7-day free trial
        </Button>
        <Button onClick={subscribe} variant="outline" className="w-full h-11 rounded-2xl bg-secondary border-border">
          Subscribe — {plan === "yearly" ? "$59.99/yr" : "$9.99/mo"}
        </Button>
        <button onClick={() => toast("No purchases to restore")} className="block w-full text-center text-xs text-muted-foreground mt-1">
          Restore purchase
        </button>
        <button onClick={() => navigate(-1)} className="block w-full text-center text-xs text-muted-foreground">
          Continue free
        </button>
      </div>
    </div>
  );
};

export default Premium;
