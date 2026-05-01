import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrbit } from "@/store/orbit";
import { ScreenHeader } from "@/components/orbit/ScreenHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useOrbit();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const save = () => {
    updateProfile({ name: draft.name, email: draft.email, phone: draft.phone });
    toast.success("Profile updated");
    setEditing(false);
  };

  const cancel = () => { setDraft(profile); setEditing(false); };

  const v = editing ? draft : profile;

  return (
    <div className="min-h-screen pb-6">
      <ScreenHeader title="Personal Info" action={
        !editing ? (
          <Button size="sm" variant="outline" className="bg-secondary border-border" onClick={() => { setDraft(profile); setEditing(true); }}>Edit</Button>
        ) : null
      } />

      <div className="px-5 mt-4">
        <div className="premium-card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold"
            style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
            {(v.name?.[0] ?? "A").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{v.name}</div>
            <div className="text-xs text-muted-foreground truncate">{v.email}</div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            {editing ? (
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-1 bg-secondary border-border" />
            ) : <div className="mt-1 text-sm">{profile.name}</div>}
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            {editing ? (
              <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="mt-1 bg-secondary border-border" />
            ) : <div className="mt-1 text-sm">{profile.email}</div>}
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phone</Label>
            {editing ? (
              <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="mt-1 bg-secondary border-border" />
            ) : <div className="mt-1 text-sm">{profile.phone}</div>}
          </div>
        </div>

        {editing && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={cancel} className="rounded-2xl bg-secondary border-border h-12">Cancel</Button>
            <Button onClick={save} className="rounded-2xl h-12" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
