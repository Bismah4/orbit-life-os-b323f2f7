import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { OrbitLogo } from "@/components/orbit/Logo";

const Splash = () => {
  const navigate = useNavigate();
  const { hasOnboarded, isAuthed } = useOrbit();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasOnboarded) navigate("/onboarding", { replace: true });
      else if (!isAuthed) navigate("/auth", { replace: true });
      else navigate("/home", { replace: true });
    }, 1800);
    return () => clearTimeout(t);
  }, [hasOnboarded, isAuthed, navigate]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full glow-orb animate-pulse-glow" />

      <div className="relative animate-scale-in">
        <OrbitLogo size={104} />
      </div>
      <div className="relative mt-8 text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h1 className="text-3xl font-semibold tracking-tight">Orbit</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your life, organized.</p>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

export default Splash;
