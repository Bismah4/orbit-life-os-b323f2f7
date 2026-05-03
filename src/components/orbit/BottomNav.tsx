import { NavLink, useLocation } from "react-router-dom";
import { Home, Inbox, Layers, BookmarkCheck, Settings as SettingsIcon } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/feed", label: "Feed", icon: Inbox },
  { to: "/capture", label: "Capture", icon: Layers, primary: true },
  { to: "/memory", label: "Memory", icon: BookmarkCheck },
  { to: "/profile", label: "Settings", icon: SettingsIcon },
];

export const BottomNav = () => {
  const { pathname } = useLocation();
  // hide on entry routes
  if (["/", "/onboarding", "/auth", "/splash"].includes(pathname)) return null;

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-2"
      style={{ background: "linear-gradient(180deg, transparent, hsl(var(--background)) 35%)" }}>
      <div className="glass-card flex items-center justify-around px-2 py-2">
        {tabs.map(({ to, label, icon: Icon, primary }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl tap ${
                isActive ? "text-primary" : "text-muted-foreground"
              } ${primary ? "relative -mt-6" : ""}`
            }
          >
            {primary ? (
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
              >
                <Icon className="w-5 h-5" style={{ color: "hsl(var(--primary-foreground))" }} />
              </span>
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
