import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Bell, Bookmark, Settings, Edit3, LogOut, Sparkles, Flame } from "lucide-react";
import { toast } from "sonner";

export const QuickProfilePanel = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { profile, signOut: storeSignOut } = useOrbit();

  const go = (path: string) => {
    onOpenChange(false);
    setTimeout(() => navigate(path), 80);
  };

  const signOut = () => {
    onOpenChange(false);
    storeSignOut();
    toast.success("Signed out");
    navigate("/auth", { replace: true });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="border-border bg-transparent shadow-none p-0 max-w-[440px] mx-auto inset-x-0 [&>button]:hidden"
      >
        <div className="px-4 pt-3">
          <div className="premium-card p-5 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-semibold"
                style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}
              >
                {profile.avatarInitial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{profile.name}</div>
                <div className="text-xs text-muted-foreground truncate">{profile.email}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-secondary/60 p-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                  <div className="text-sm font-semibold">{profile.streak} days</div>
                </div>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Plan</div>
                  <div className="text-sm font-semibold">{profile.premium ? "Premium" : "Free"}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-1">
              {[
                { icon: Edit3, label: "Edit profile", to: "/profile/personal" },
                { icon: Bell, label: "Notifications", to: "/notifications" },
                { icon: Bookmark, label: "Reminders", to: "/notifications?tab=upcoming" },
                { icon: Settings, label: "Settings", to: "/profile" },
              ].map(({ icon: Icon, label, to }) => (
                <button
                  key={label}
                  onClick={() => go(to)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/60 tap"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 text-destructive tap"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
