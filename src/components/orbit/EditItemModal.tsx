import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CATEGORY_META } from "@/lib/design";
import type { Category, Priority } from "@/lib/design";

export type EditableField =
  | "title" | "amount" | "dueAt" | "status" | "format" | "notes" | "category" | "priority" | "person" | "action";

export interface EditItemDraft {
  title?: string;
  amount?: string;
  dueAt?: number;
  status?: string;
  format?: string;
  notes?: string;
  category?: Category;
  priority?: Priority;
  person?: string;
  action?: string;
}

const STATUS_OPTS = ["active", "done", "archived"];
const FORMAT_OPTS = ["PDF", "Image", "Note", "Other"];

export const EditItemModal = ({
  open, onOpenChange, title, fields, initial, onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  fields: EditableField[];
  initial: EditItemDraft;
  onSave: (d: EditItemDraft) => void;
}) => {
  const [d, setD] = useState<EditItemDraft>(initial);
  useEffect(() => { if (open) setD(initial); }, [open, initial]);

  const has = (f: EditableField) => fields.includes(f);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] mx-auto bg-popover border-border rounded-3xl">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
          {has("title") && (
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input value={d.title ?? ""} onChange={(e) => setD({ ...d, title: e.target.value })} className="mt-1 bg-secondary border-border" />
            </div>
          )}
          {has("person") && (
            <div>
              <Label className="text-xs text-muted-foreground">Person</Label>
              <Input value={d.person ?? ""} onChange={(e) => setD({ ...d, person: e.target.value })} className="mt-1 bg-secondary border-border" />
            </div>
          )}
          {has("action") && (
            <div>
              <Label className="text-xs text-muted-foreground">Action</Label>
              <Input value={d.action ?? ""} onChange={(e) => setD({ ...d, action: e.target.value })} className="mt-1 bg-secondary border-border" />
            </div>
          )}
          {has("amount") && (
            <div>
              <Label className="text-xs text-muted-foreground">Amount</Label>
              <Input value={d.amount ?? ""} onChange={(e) => setD({ ...d, amount: e.target.value })} className="mt-1 bg-secondary border-border" placeholder="₹0" />
            </div>
          )}
          {has("category") && (
            <div>
              <Label className="text-xs text-muted-foreground">Category</Label>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
                  <button key={c} onClick={() => setD({ ...d, category: c })}
                    className={`px-2 py-1.5 rounded-lg text-xs ${d.category === c ? "bg-primary/20 text-primary border border-primary/40" : "bg-secondary border border-border"}`}>
                    {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {has("priority") && (
            <div>
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {(["high", "medium", "low"] as Priority[]).map((p) => (
                  <button key={p} onClick={() => setD({ ...d, priority: p })}
                    className={`px-2 py-1.5 rounded-lg text-xs capitalize ${d.priority === p ? "border-2" : "border border-border bg-secondary"}`}
                    style={d.priority === p ? { background: `hsl(var(--priority-${p}) / 0.15)`, color: `hsl(var(--priority-${p}))`, borderColor: `hsl(var(--priority-${p}))` } : {}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          {has("dueAt") && (
            <div>
              <Label className="text-xs text-muted-foreground">Due date</Label>
              <Input type="date" value={d.dueAt ? new Date(d.dueAt).toISOString().slice(0, 10) : ""}
                onChange={(e) => setD({ ...d, dueAt: e.target.value ? new Date(e.target.value).getTime() : undefined })}
                className="mt-1 bg-secondary border-border" />
            </div>
          )}
          {has("status") && (
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {STATUS_OPTS.map((s) => (
                  <button key={s} onClick={() => setD({ ...d, status: s })}
                    className={`px-2 py-1.5 rounded-lg text-xs capitalize ${d.status === s ? "bg-primary/20 text-primary border border-primary/40" : "bg-secondary border border-border"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {has("format") && (
            <div>
              <Label className="text-xs text-muted-foreground">Format</Label>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {FORMAT_OPTS.map((f) => (
                  <button key={f} onClick={() => setD({ ...d, format: f })}
                    className={`px-2 py-1.5 rounded-lg text-xs ${d.format === f ? "bg-primary/20 text-primary border border-primary/40" : "bg-secondary border border-border"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}
          {has("notes") && (
            <div>
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Textarea value={d.notes ?? ""} onChange={(e) => setD({ ...d, notes: e.target.value })}
                className="mt-1 bg-secondary border-border min-h-[80px]" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-2xl bg-secondary border-border h-11">Cancel</Button>
          <Button onClick={() => { onSave(d); onOpenChange(false); }} className="rounded-2xl h-11"
            style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
