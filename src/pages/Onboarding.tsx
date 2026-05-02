import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Mic, FileText, Mail, Type, Plus, Sparkles, Brain, Zap, Target } from "lucide-react";
import { OrbitLogo } from "@/components/orbit/Logo";

const slides = [
  {
    eyebrow: "Capture",
    title: "Capture anything,\nin a tap",
    sub: "Screenshots, voice notes, docs, emails, tasks — Orbit takes it all.",
    visual: "capture",
  },
  {
    eyebrow: "Understand",
    title: "Let Orbit\nthink for you",
    sub: "AI reads, understands, and turns chaos into clear next steps.",
    visual: "think",
  },
  {
    eyebrow: "Prioritize",
    title: "Focus on what\nactually matters",
    sub: "Orbit surfaces what's urgent today, quietly handles the rest.",
    visual: "focus",
  },
  {
    eyebrow: "Organize",
    title: "Your whole life,\nin one orbit",
    sub: "Money, work, admin, health, people, goals — beautifully connected.",
    visual: "control",
  },
];

const FloatChip = ({ icon: Icon, x, y, d, color }: any) => (
  <div
    className="absolute w-12 h-12 rounded-2xl glass-card flex items-center justify-center animate-float-slow"
    style={{ transform: `translate(${x}px, ${y}px)`, animationDelay: `${d}s`, color: `hsl(${color})` }}
  >
    <Icon className="w-5 h-5" />
  </div>
);

const Visual = ({ kind }: { kind: string }) => {
  if (kind === "capture") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-72 h-72 rounded-full glow-orb animate-pulse-glow" />
        <FloatChip icon={Camera} x={-90} y={-70} d={0} color="212 100% 70%" />
        <FloatChip icon={Mic} x={90} y={-60} d={0.3} color="340 75% 65%" />
        <FloatChip icon={FileText} x={-100} y={60} d={0.5} color="152 65% 55%" />
        <FloatChip icon={Mail} x={100} y={70} d={0.7} color="200 95% 65%" />
        <FloatChip icon={Type} x={-60} y={-130} d={0.9} color="262 80% 70%" />
        <FloatChip icon={Plus} x={70} y={140} d={1.1} color="38 95% 60%" />
        <div
          className="relative w-24 h-24 rounded-3xl flex items-center justify-center animate-scale-in"
          style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
        >
          <OrbitLogo size={56} />
        </div>
      </div>
    );
  }
  if (kind === "think") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-72 h-72 rounded-full glow-orb" />
        <div className="relative w-full max-w-[320px] flex items-center justify-between gap-2 px-2">
          {[
            { icon: Camera, l: "Input" },
            { icon: Brain, l: "Understand" },
            { icon: Zap, l: "Action" },
            { icon: Target, l: "Priority" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center glass-card"
                style={i === 1 ? { background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-glow)" } : { color: "hsl(var(--primary))" }}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
          <svg className="absolute inset-0 -z-10 pointer-events-none" viewBox="0 0 320 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flow" x1="0" x2="1">
                <stop offset="0" stopColor="hsl(212 100% 70%)" stopOpacity="0.1" />
                <stop offset="0.5" stopColor="hsl(212 100% 70%)" stopOpacity="0.6" />
                <stop offset="1" stopColor="hsl(200 100% 75%)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <line x1="40" y1="24" x2="280" y2="24" stroke="url(#flow)" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
        </div>
      </div>
    );
  }
  if (kind === "focus") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-72 h-72 rounded-full glow-orb" />
        <div className="relative space-y-2.5 w-[300px]">
          <div className="text-[10px] uppercase tracking-wider text-primary px-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Today
          </div>
          <div className="premium-card p-3.5 flex items-center gap-3 animate-fade-in-up">
            <div className="w-1 h-10 rounded-full" style={{ background: "hsl(var(--priority-high))" }} />
            <div className="flex-1">
              <div className="text-sm font-medium">Pay electricity bill</div>
              <div className="text-[11px] text-muted-foreground">Due tomorrow · ₹2,340</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase"
              style={{ background: "hsl(var(--priority-high) / 0.15)", color: "hsl(var(--priority-high))" }}>High</span>
          </div>
          <div className="premium-card p-3.5 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="w-1 h-10 rounded-full" style={{ background: "hsl(var(--priority-medium))" }} />
            <div className="flex-1">
              <div className="text-sm font-medium">Reply to Sarah</div>
              <div className="text-[11px] text-muted-foreground">Lunch on Thursday?</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase"
              style={{ background: "hsl(var(--priority-medium) / 0.15)", color: "hsl(var(--priority-medium))" }}>Med</span>
          </div>
          <div className="rounded-2xl border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
            + 14 things you don't need to see right now
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-72 h-72 rounded-full glow-orb" />
      <div className="relative grid grid-cols-3 gap-3 w-[280px]">
        {[
          { e: "💸", l: "Money", c: "152 65% 52%" },
          { e: "💼", l: "Work", c: "262 80% 68%" },
          { e: "📋", l: "Admin", c: "200 95% 60%" },
          { e: "❤️", l: "Health", c: "340 75% 60%" },
          { e: "👥", l: "People", c: "38 95% 60%" },
          { e: "🎯", l: "Goals", c: "175 70% 50%" },
        ].map((c, i) => (
          <div key={i} className="premium-card aspect-square flex flex-col items-center justify-center gap-1 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.07}s`, borderColor: `hsl(${c.c} / 0.3)` }}>
            <div className="text-2xl">{c.e}</div>
            <div className="text-[11px] font-medium" style={{ color: `hsl(${c.c})` }}>{c.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { setOnboarded } = useOrbit();
  const [i, setI] = useState(0);
  const last = i === slides.length - 1;

  const finish = () => {
    setOnboarded(true);
    navigate("/auth", { replace: true });
  };

  const slide = slides[i];

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full glow-orb opacity-50 pointer-events-none" />

      <div className="relative flex justify-between items-center px-6 pt-6">
        <div className="flex items-center gap-2">
          <OrbitLogo size={24} />
          <span className="text-sm font-semibold tracking-tight">Orbit</span>
        </div>
        <button onClick={finish} className="text-xs text-muted-foreground hover:text-foreground tap">Skip</button>
      </div>

      <div className="relative flex-1 flex flex-col px-6 pt-4">
        <div key={"v" + i} className="flex-1 min-h-[280px] animate-fade-in">
          <Visual kind={slide.visual} />
        </div>
        <div key={"t" + i} className="text-center pb-4 animate-fade-in-up">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{slide.eyebrow}</div>
          <h2 className="mt-2 text-[28px] leading-[1.1] font-semibold tracking-tight whitespace-pre-line text-balance">{slide.title}</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-[300px] mx-auto text-balance leading-relaxed">{slide.sub}</p>
        </div>
      </div>

      <div className="relative px-6 pb-10 space-y-5">
        <div className="flex justify-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-7 bg-primary" : "w-1.5 bg-border"}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
        <Button
          onClick={() => (last ? finish() : setI(i + 1))}
          className="w-full h-13 py-3.5 rounded-2xl text-base font-medium"
          style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-glow)" }}
        >
          {last ? "Get Started" : (
            <>Continue <ArrowRight className="ml-1.5 w-4 h-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
