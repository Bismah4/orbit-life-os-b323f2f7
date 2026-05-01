import { useOrbit } from "@/store/orbit";
import { ScreenHeader } from "@/components/orbit/ScreenHeader";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Security = () => {
  const { biometrics, twoFA, setSetting } = useOrbit();

  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader title="Security" />
      <div className="px-5 mt-4 space-y-3">
        <button onClick={() => toast.success("Password reset link sent")}
          className="w-full premium-card p-4 flex items-center justify-between tap">
          <div>
            <div className="text-sm font-medium">Change password</div>
            <div className="text-xs text-muted-foreground">We'll email you a reset link</div>
          </div>
          <span className="text-xs text-primary">Send link</span>
        </button>

        <div className="premium-card p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Biometric unlock</div>
            <div className="text-xs text-muted-foreground">Use Face ID / fingerprint</div>
          </div>
          <Switch checked={biometrics} onCheckedChange={(v) => { setSetting("biometrics", v); toast.success(`Biometrics ${v ? "enabled" : "disabled"}`); }} />
        </div>

        <div className="premium-card p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Two-factor authentication</div>
            <div className="text-xs text-muted-foreground">Mock — adds an extra step at login</div>
          </div>
          <Switch checked={twoFA} onCheckedChange={(v) => { setSetting("twoFA", v); toast.success(`2FA ${v ? "enabled" : "disabled"}`); }} />
        </div>
      </div>
    </div>
  );
};

export default Security;
