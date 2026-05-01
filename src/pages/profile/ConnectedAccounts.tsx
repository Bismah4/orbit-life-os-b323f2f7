import { useOrbit } from "@/store/orbit";
import { ScreenHeader } from "@/components/orbit/ScreenHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ConnectedAccounts = () => {
  const { connectedGoogle, connectedApple, setSetting } = useOrbit();

  const Item = ({ name, connected, on }: { name: string; connected: boolean; on: () => void }) => (
    <div className="premium-card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg">
        {name === "Google" ? "🔵" : ""}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{connected ? "Connected" : "Not connected"}</div>
      </div>
      <Button size="sm" variant={connected ? "outline" : "default"}
        className={connected ? "bg-secondary border-border" : ""}
        style={!connected ? { background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" } : {}}
        onClick={() => { on(); toast.success(`${name} ${connected ? "disconnected" : "connected"}`); }}>
        {connected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader title="Connected Accounts" />
      <div className="px-5 mt-4 space-y-3">
        <Item name="Google" connected={connectedGoogle} on={() => setSetting("connectedGoogle", !connectedGoogle)} />
        <Item name="Apple"  connected={connectedApple}  on={() => setSetting("connectedApple",  !connectedApple)} />
      </div>
    </div>
  );
};

export default ConnectedAccounts;
