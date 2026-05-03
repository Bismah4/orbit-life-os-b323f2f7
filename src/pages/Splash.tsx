import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { OrbitLogo } from "@/components/orbit/Logo";

const Splash = () => {
  const navigate = useNavigate();
  const { hasOnboarded, isAuthed } = useOrbit();
  const [out, setOut] = useState(false);

  useEffect(() => {
    const o = setTimeout(() => setOut(true), 1500);
    const t = setTimeout(() => {
      // Authed users always go straight to Home (don't re-show onboarding on refresh)
      if (isAuthed) navigate("/home", { replace: true });
      else if (!hasOnboarded) navigate("/onboarding", { replace: true });
      else navigate("/auth", { replace: true });
    }, 1900);
    return () => { clearTimeout(t); clearTimeout(o); };
  }, [hasOnboarded, isAuthed, navigate]);

  return (
    <div className={`relative h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ${out ? "opacity-0" : "opacity-100"}`}>
      {/* layered ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full glow-orb animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full glow-orb animate-pulse-glow" style={{ animationDelay: "0.6s", opacity: 0.7 }} />

      {/* orbiting dots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-primary/15" />
        <div className="absolute inset-6 rounded-full border border-primary/10" />
      </div>

      <div className="relative animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl opacity-60" style={{ background: "var(--gradient-brand)", borderRadius: "50%" }} />
          <OrbitLogo size={112} />
        </div>
      </div>
      <div className="relative mt-7 text-center animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
        <h1 className="text-3xl font-semibold tracking-tight">Orbit</h1>
        <p className="mt-2 text-sm text-muted-foreground tracking-wide">Your life, organized.</p>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
        <div className="flex gap-1.5 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

export default Splash;
