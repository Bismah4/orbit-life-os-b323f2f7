import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    title: "Capture anything",
    sub: "Drop screenshots, voice, notes, or tasks.",
    visual: "capture",
  },
  {
    title: "Let Orbit think",
    sub: "Orbit turns chaos into clear action.",
    visual: "think",
  },
  {
    title: "Focus on what matters",
    sub: "Orbit shows only what needs attention today.",
    visual: "focus",
  },
  {
    title: "Life, under control",
    sub: "One place for everything important.",
    visual: "control",
  },
];

const Visual = ({ kind }: { kind: string }) => {
  if (kind === "capture") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-64 h-64 rounded-full glow-orb" />
        {[
          { l: "📷", x: -70, y: -50, d: 0 },
          { l: "🎤", x: 70, y: -40, d: 0.2 },
          { l: "📄", x: -80, y: 50, d: 0.4 },
          { l: "✉️", x: 80, y: 60, d: 0.6 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-2xl animate-float-slow"
            style={{ transform: `translate(${c.x}px, ${c.y}px)`, animationDelay: `${c.d}s` }}
          >
            {c.l}
          </div>
        ))}
        <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center text-3xl"
          style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}>
          ＋
        </div>
      </div>
    );
  }
  if (kind === "think") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-72 h-72 rounded-full glow-orb" />
        <svg viewBox="0 0 240 200" className="w-full h-full max-w-[280px]">
          <defs>
            <linearGradient id="line" x1="0" x2="1">
              <stop offset="0" stopColor="hsl(212 100% 70%)" stopOpacity="0.2" />
              <stop offset="1" stopColor="hsl(200 100% 70%)" />
            </linearGradient>
          </defs>
          {[20, 50, 80, 110, 140, 170].map((y, i) => (
            <line key={i} x1="20" x2="100" y1={y} y2={100} stroke="url(#line)" strokeWidth="1.2" />
          ))}
          {[20, 60, 100, 140, 180].map((y, i) => (
            <line key={i} x1="140" x2="220" y1={100} y2={y} stroke="url(#line)" strokeWidth="1.2" />
          ))}
          <circle cx="120" cy="100" r="22" fill="hsl(212 100% 62%)" />
          <circle cx="120" cy="100" r="36" fill="none" stroke="hsl(212 100% 62%)" strokeOpacity="0.3" />
        </svg>
      </div>
    );
  }
  if (kind === "focus") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-72 h-72 rounded-full glow-orb" />
        <div className="relative space-y-3 w-[280px]">
          <div className="glass-card p-4 flex items-center gap-3 animate-fade-in-up">
            <div className="w-2 h-10 rounded-full" style={{ background: "hsl(var(--priority-high))" }} />
            <div className="flex-1">
              <div className="text-sm font-medium">Pay electricity bill</div>
              <div className="text-xs text-muted-foreground">Due tomorrow</div>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="w-2 h-10 rounded-full" style={{ background: "hsl(var(--priority-medium))" }} />
            <div className="flex-1">
              <div className="text-sm font-medium">Reply to Sarah</div>
              <div className="text-xs text-muted-foreground">2 days ago</div>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3 opacity-50">
            <div className="w-2 h-10 rounded-full bg-muted" />
            <div className="flex-1">
              <div className="text-sm font-medium">+ 14 things you don't need to see</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // control
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-72 h-72 rounded-full glow-orb" />
      <div className="relative grid grid-cols-3 gap-3 w-[280px]">
        {[
          { e: "💸", l: "Money" },
          { e: "💼", l: "Work" },
          { e: "📋", l: "Admin" },
          { e: "❤️", l: "Health" },
          { e: "👥", l: "People" },
          { e: "🎯", l: "Goals" },
        ].map((c, i) => (
          <div key={i} className="glass-card aspect-square flex flex-col items-center justify-center gap-1 animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="text-2xl">{c.e}</div>
            <div className="text-[11px] text-muted-foreground">{c.l}</div>
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

  return (
    <div className="relative h-screen flex flex-col">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

      {/* Skip */}
      <div className="relative flex justify-end px-6 pt-6">
        <button onClick={finish} className="text-sm text-muted-foreground hover:text-foreground tap">Skip</button>
      </div>

      {/* Visual */}
      <div className="relative flex-1 px-6 pt-2">
        <div key={i} className="h-[55%] animate-fade-in">
          <Visual kind={slides[i].visual} />
        </div>
        <div key={"t" + i} className="text-center mt-4 animate-fade-in-up">
          <h2 className="text-2xl font-semibold tracking-tight text-balance">{slides[i].title}</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-[280px] mx-auto text-balance">{slides[i].sub}</p>
        </div>
      </div>

      {/* Progress + CTA */}
      <div className="relative px-6 pb-10 space-y-6">
        <div className="flex justify-center gap-1.5">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
        <Button
          onClick={() => (last ? finish() : setI(i + 1))}
          className="w-full h-12 rounded-2xl text-base font-medium"
          style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}
        >
          {last ? "Get Started" : (
            <>Continue <ArrowRight className="ml-1 w-4 h-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
