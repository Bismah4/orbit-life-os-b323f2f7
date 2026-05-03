import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrbitLogo } from "@/components/orbit/Logo";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, setOnboarded, updateProfile } = useOrbit();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const routeAfterAuth = (isNew: boolean) => {
    if (isNew) {
      setOnboarded(false);
      navigate("/onboarding", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  };

  const submit = async () => {
    if (!email) return toast.error("Email required");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    if (mode === "forgot") {
      toast.success("Reset link sent to " + email);
      setMode("login");
      return;
    }
    const { isNew } = signIn(email, { name, isSignup: mode === "signup" });
    if (mode === "signup" && name) updateProfile({ name });
    toast.success(mode === "signup" ? "Welcome to Orbit" : "Welcome back");
    routeAfterAuth(isNew);
  };

  const social = async (provider: "google" | "apple") => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    const fakeEmail = `${provider}.user@orbit.app`;
    const { isNew } = signIn(fakeEmail, { name: provider === "google" ? "Google User" : "Apple User" });
    toast.success(`Signed in with ${provider === "google" ? "Google" : "Apple"}`);
    routeAfterAuth(isNew);
  };

  return (
    <div className="relative min-h-screen flex flex-col px-6 pt-10 pb-8">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />

      {mode !== "login" && (
        <button
          onClick={() => setMode("login")}
          className="relative w-9 h-9 rounded-full glass-card flex items-center justify-center tap mb-4"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}

      <div className="relative flex flex-col items-center mb-8">
        <OrbitLogo size={64} />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your Orbit" : "Reset password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "forgot" ? "We'll send you a reset link." : "Your life, organized."}
        </p>
      </div>

      <div className="relative space-y-3">
        {mode === "signup" && (
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1 h-12 rounded-xl bg-secondary border-border" />
          </div>
        )}
        <div>
          <Label className="text-xs text-muted-foreground">Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="mt-1 h-12 rounded-xl bg-secondary border-border" />
        </div>
        {mode !== "forgot" && (
          <div>
            <Label className="text-xs text-muted-foreground">Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1 h-12 rounded-xl bg-secondary border-border" />
          </div>
        )}

        <Button
          onClick={submit}
          disabled={loading}
          className="w-full h-12 rounded-2xl text-base font-medium mt-2"
          style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}
        >
          {loading ? "Please wait…" : mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send reset link"}
        </Button>

        {mode === "login" && (
          <button onClick={() => setMode("forgot")} className="block w-full text-center text-xs text-muted-foreground hover:text-foreground mt-1">
            Forgot password?
          </button>
        )}
      </div>

      {mode !== "forgot" && (
        <>
          <div className="relative my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="relative space-y-2">
            <Button onClick={() => social("google")} variant="outline" className="w-full h-12 rounded-2xl bg-secondary border-border text-foreground hover:bg-secondary/80">
              <span className="mr-2">🔵</span> Continue with Google
            </Button>
            <Button onClick={() => social("apple")} variant="outline" className="w-full h-12 rounded-2xl bg-secondary border-border text-foreground hover:bg-secondary/80">
              <span className="mr-2"></span> Continue with Apple
            </Button>
          </div>
        </>
      )}

      <div className="relative mt-auto pt-6 text-center text-xs text-muted-foreground">
        {mode === "login" ? (
          <>New to Orbit?{" "}
            <button onClick={() => setMode("signup")} className="text-primary font-medium">Sign up</button>
          </>
        ) : (
          <>Already have an account?{" "}
            <button onClick={() => setMode("login")} className="text-primary font-medium">Log in</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
