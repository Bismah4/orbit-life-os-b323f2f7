import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { ChevronRight, User, Link2, Lock, Clock, Bell, HelpCircle, Shield, FileText, LogOut, Sparkles, Layers } from "lucide-react";
import { toast } from "sonner";

const Row = ({ icon: Icon, label, hint, onClick, danger }: any) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/40 tap ${danger ? "text-destructive" : ""}`}>
    <Icon className="w-4 h-4 text-muted-foreground" />
    <div className="flex-1 text-left">
      <div className="text-sm">{label}</div>
      {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
    </div>
    {!danger && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  const { profile, setAuthed, dailyPulseTime, reminderStyle, connectedGoogle, connectedApple } = useOrbit();

  const signOut = () => {
    setAuthed(false);
    toast.success("Signed out");
    navigate("/auth", { replace: true });
  };

  return (
    <div className="px-5 pt-6 pb-6 min-h-screen">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>

      {/* Header */}
      <div className="mt-4 premium-card p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold"
          style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
          {profile.avatarInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{profile.name}</div>
          <div className="text-xs text-muted-foreground truncate">{profile.email}</div>
          {profile.premium ? (
            <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-primary font-medium">
              <Sparkles className="w-3 h-3" /> Orbit Premium
            </div>
          ) : (
            <button onClick={() => navigate("/premium")}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full tap"
              style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
              <Sparkles className="w-3 h-3" /> Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      {/* Modules quick-access */}
      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-1">Modules</div>
        <button onClick={() => navigate("/admin")} className="w-full premium-card p-4 flex items-center gap-3 tap">
          <Layers className="w-4 h-4 text-primary" />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">Admin</div>
            <div className="text-[11px] text-muted-foreground">Bills, documents, renewals</div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Account */}
      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-1">Account</div>
        <div className="premium-card divide-y divide-border/60 overflow-hidden">
          <Row icon={User}  label="Personal Info" hint="Name, email, phone" onClick={() => navigate("/profile/personal")} />
          <Row icon={Link2} label="Connected Accounts"
            hint={`${connectedGoogle ? "Google" : ""}${connectedGoogle && connectedApple ? " · " : ""}${connectedApple ? "Apple" : ""}${!connectedGoogle && !connectedApple ? "Not connected" : ""}`}
            onClick={() => navigate("/profile/accounts")} />
          <Row icon={Lock} label="Security" hint="Password, biometrics, 2FA" onClick={() => navigate("/profile/security")} />
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-1">Preferences</div>
        <div className="premium-card divide-y divide-border/60 overflow-hidden">
          <Row icon={Clock} label="Daily Pulse Time" hint={dailyPulseTime} onClick={() => navigate("/profile/daily-pulse-time")} />
          <Row icon={Bell}  label="Reminder Style" hint={reminderStyle} onClick={() => navigate("/profile/reminder-style")} />
        </div>
      </div>

      {/* Support */}
      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-1">About</div>
        <div className="premium-card divide-y divide-border/60 overflow-hidden">
          <Row icon={HelpCircle} label="Support" onClick={() => navigate("/profile/support")} />
          <Row icon={Shield}     label="Privacy Policy" onClick={() => navigate("/profile/privacy")} />
          <Row icon={FileText}   label="Terms" onClick={() => navigate("/profile/terms")} />
        </div>
      </div>

      <button onClick={signOut} className="mt-6 w-full py-3.5 rounded-2xl bg-destructive/10 text-destructive font-medium flex items-center justify-center gap-2 tap">
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
};

export default Profile;
