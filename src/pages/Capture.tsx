import { useState } from "react";
import { useOrbit, OrbitTask, CaptureSource } from "@/store/orbit";
import type { Category, Priority } from "@/lib/design";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CategoryPill, PriorityPill } from "@/components/orbit/Chips";
import { CATEGORY_META } from "@/lib/design";
import { toast } from "sonner";
import {
  Image as ImageIcon, ScanLine, Mic, Type, Plus, Mail,
  Loader2, Sparkles, Edit3, Trash2, Check,
} from "lucide-react";

type Method = {
  id: CaptureSource;
  label: string;
  icon: any;
  color: string;
  desc: string;
};

const METHODS: Method[] = [
  { id: "screenshot", label: "Upload Screenshot", icon: ImageIcon, color: "212 100% 62%", desc: "Bills, chats, contracts" },
  { id: "document",   label: "Scan Document",     icon: ScanLine,  color: "152 65% 52%",  desc: "Invoices, forms, receipts" },
  { id: "voice",      label: "Record Voice",      icon: Mic,       color: "340 75% 60%",  desc: "Talk to Orbit" },
  { id: "text",       label: "Paste Text",        icon: Type,      color: "262 80% 68%",  desc: "Notes & snippets" },
  { id: "manual",     label: "Manual Task",       icon: Plus,      color: "38 95% 60%",   desc: "Add it yourself" },
  { id: "email",      label: "Connect Email",     icon: Mail,      color: "200 95% 60%",  desc: "Import from inbox" },
];

const PROCESSING_STEPS = [
  "Reading input",
  "Detecting meaning",
  "Finding action",
  "Setting priority",
  "Added to Orbit",
];

// Mock AI: produces source-specific result
const mockProcess = (source: CaptureSource, raw: any): Omit<OrbitTask, "id" | "createdAt" | "status"> => {
  const base = { source, status: "needs_action" as const };
  switch (source) {
    case "screenshot": {
      const types = ["Bill", "Chat", "Invoice", "Contract", "Dashboard"];
      const screenshotType = types[Math.floor(Math.random() * types.length)];
      const map: Record<string, any> = {
        Bill:     { title: "Pay detected bill", category: "money",  priority: "high",   action: "Pay before due date", insight: "Total ₹2,340 — due in 2 days." },
        Chat:     { title: "Reply to chat",      category: "people", priority: "medium", action: "Send a reply",        insight: "Last unread message 2 days ago." },
        Invoice:  { title: "Process invoice",    category: "money",  priority: "medium", action: "Forward to accounts", insight: "Invoice #4421 — ₹14,500 from Vendor Co." },
        Contract: { title: "Review contract clause", category: "admin", priority: "high", action: "Reply before deadline", insight: "Auto-renewal clause locks in 12 months." },
        Dashboard:{ title: "Track key metric",   category: "work",   priority: "low",    action: "Investigate dip",     insight: "Conversion dropped 8% week-over-week." },
      };
      const m = map[screenshotType];
      return {
        ...base,
        title: m.title,
        category: m.category, priority: m.priority,
        suggestedAction: m.action,
        whyItMatters: "Detected from screenshot — Orbit caught the important detail.",
        meta: { screenshotType, insight: m.insight, preview: raw?.preview },
      };
    }
    case "document":
      return {
        ...base,
        title: "Process scanned invoice",
        category: "admin" as Category, priority: "medium" as Priority,
        suggestedAction: "File and pay",
        whyItMatters: "Document looks like an invoice with payment terms.",
        meta: { docType: "Invoice", summary: "Vendor invoice for ₹14,500 due in 30 days.", preview: raw?.preview, fileName: raw?.fileName ?? "scan.pdf" },
      };
    case "voice": {
      const transcript = raw?.transcript || "Don't forget Dr. Mehta on Friday at 4 PM.";
      return {
        ...base,
        title: "Doctor appointment Friday 4 PM",
        category: "health", priority: "medium",
        suggestedAction: "Add to calendar",
        whyItMatters: "Detected appointment with date & time in your voice note.",
        meta: { transcript, intent: "Schedule appointment", urgency: "Medium" },
      };
    }
    case "text": {
      const text = raw?.text || "";
      return {
        ...base,
        title: text.slice(0, 60) || "Captured note",
        category: "work", priority: "low",
        suggestedAction: "Turn into action",
        whyItMatters: "Orbit found a possible task in your text.",
        meta: { text, meaning: "Looks like a follow-up reminder." },
      };
    }
    case "manual":
      return {
        ...base,
        title: raw?.title || "New task",
        category: (raw?.category || "admin") as Category,
        priority: (raw?.priority || "medium") as Priority,
        dueAt: raw?.dueAt,
        suggestedAction: raw?.action || "Get it done",
        whyItMatters: "You added this yourself — Orbit will keep it on your radar.",
        meta: {},
      };
    case "email":
      return {
        ...base,
        title: "Reply to: " + (raw?.subject || "Renewal notice"),
        category: "admin", priority: "medium",
        suggestedAction: "Send a reply",
        whyItMatters: "Email looks like it expects a response.",
        meta: { sender: raw?.sender || "ICICI Lombard", subject: raw?.subject || "Your policy expires in 7 days", summary: "Renewal needed within a week to avoid lapse." },
      };
  }
};

// =================== Result Card (input-specific) ===================

const ResultCardWrapper = ({ children, src }: { children: React.ReactNode; src: CaptureSource }) => (
  <div className="premium-card overflow-hidden animate-fade-in-up">
    <div className="px-4 py-2 text-[11px] uppercase tracking-wider text-primary flex items-center gap-1.5 border-b border-border/60">
      <Sparkles className="w-3 h-3" /> Orbit understood your {src.replace("_", " ")}
    </div>
    {children}
  </div>
);

const ResultCard = ({ task, onAdd, onEdit, onDiscard }: {
  task: Omit<OrbitTask, "id" | "createdAt" | "status">; onAdd: () => void; onEdit: () => void; onDiscard: () => void;
}) => {
  const m = task.meta || {};
  const renderBody = () => {
    switch (task.source) {
      case "screenshot":
        return (
          <>
            {m.preview && (
              <div className="aspect-video bg-secondary overflow-hidden">
                <img src={m.preview} alt="screenshot" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="text-xs text-muted-foreground">Detected: <span className="text-foreground font-medium">{m.screenshotType} screenshot</span></div>
              <div className="text-sm">{m.insight}</div>
            </div>
          </>
        );
      case "document":
        return (
          <div className="p-4">
            <div className="flex gap-3 mb-3">
              <div className="w-14 h-16 rounded-lg bg-secondary flex items-center justify-center text-2xl">📄</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">Doc type</div>
                <div className="font-medium truncate">{m.docType} — {m.fileName}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">{m.summary}</div>
          </div>
        );
      case "voice":
        return (
          <div className="p-4 space-y-2">
            <div className="rounded-xl bg-secondary/60 p-3 text-sm italic">"{m.transcript}"</div>
            <div className="text-xs text-muted-foreground">Intent: <span className="text-foreground">{m.intent}</span> · Urgency: {m.urgency}</div>
          </div>
        );
      case "text":
        return (
          <div className="p-4 space-y-2">
            <div className="rounded-xl bg-secondary/60 p-3 text-sm line-clamp-4">{m.text}</div>
            <div className="text-xs text-muted-foreground">Meaning: {m.meaning}</div>
          </div>
        );
      case "manual":
        return (
          <div className="p-4">
            <div className="text-xs text-muted-foreground">You added</div>
            <div className="font-medium">{task.title}</div>
            {task.dueAt && <div className="text-xs text-muted-foreground mt-1">Due {new Date(task.dueAt).toLocaleDateString()}</div>}
          </div>
        );
      case "email":
        return (
          <div className="p-4">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="font-medium">{m.sender}</div>
            <div className="text-xs text-muted-foreground mt-2">Subject</div>
            <div className="text-sm">{m.subject}</div>
            <div className="mt-2 rounded-xl bg-secondary/60 p-3 text-sm">{m.summary}</div>
          </div>
        );
    }
  };

  return (
    <ResultCardWrapper src={task.source}>
      {renderBody()}
      <div className="px-4 pb-3 pt-2 space-y-3 border-t border-border/60">
        <div>
          <div className="font-semibold text-sm">{task.title}</div>
          {task.suggestedAction && <div className="text-xs text-primary mt-0.5">→ {task.suggestedAction}</div>}
          {task.whyItMatters && <div className="text-[11px] text-muted-foreground mt-1">Why: {task.whyItMatters}</div>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <CategoryPill category={task.category} />
          <PriorityPill priority={task.priority} />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <Button variant="ghost" onClick={onDiscard} className="rounded-xl"><Trash2 className="w-4 h-4 mr-1" />Discard</Button>
          <Button variant="outline" onClick={onEdit} className="rounded-xl bg-secondary border-border"><Edit3 className="w-4 h-4 mr-1" />Edit</Button>
          <Button onClick={onAdd} className="rounded-xl" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
            <Check className="w-4 h-4 mr-1" />Add
          </Button>
        </div>
      </div>
    </ResultCardWrapper>
  );
};

// =================== Edit Modal ===================

const EditModal = ({ open, draft, onOpenChange, onSave }: {
  open: boolean;
  draft: Omit<OrbitTask, "id" | "createdAt" | "status">;
  onOpenChange: (v: boolean) => void;
  onSave: (d: Omit<OrbitTask, "id" | "createdAt" | "status">) => void;
}) => {
  const [d, setD] = useState(draft);
  return (
    <Dialog open={open} onOpenChange={(v) => { if (v) setD(draft); onOpenChange(v); }}>
      <DialogContent className="max-w-[400px] mx-auto bg-popover border-border rounded-3xl">
        <DialogHeader><DialogTitle>Edit detected item</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Suggested action</Label>
            <Input value={d.suggestedAction ?? ""} onChange={(e) => setD({ ...d, suggestedAction: e.target.value })} className="mt-1 bg-secondary border-border" />
          </div>
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
          <div>
            <Label className="text-xs text-muted-foreground">Priority</Label>
            <div className="grid grid-cols-3 gap-1.5 mt-1">
              {(["high", "medium", "low"] as Priority[]).map((p) => (
                <button key={p} onClick={() => setD({ ...d, priority: p })}
                  className={`px-2 py-1.5 rounded-lg text-xs capitalize ${d.priority === p ? `border-2` : "border border-border bg-secondary"}`}
                  style={d.priority === p ? { background: `hsl(var(--priority-${p}) / 0.15)`, color: `hsl(var(--priority-${p}))`, borderColor: `hsl(var(--priority-${p}))` } : {}}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Due date</Label>
            <Input type="date" value={d.dueAt ? new Date(d.dueAt).toISOString().slice(0, 10) : ""}
              onChange={(e) => setD({ ...d, dueAt: e.target.value ? new Date(e.target.value).getTime() : undefined })}
              className="mt-1 bg-secondary border-border" />
          </div>
          <Button onClick={() => { onSave(d); onOpenChange(false); }} className="w-full mt-2"
            style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =================== Capture Page ===================

const Capture = () => {
  const { addTask } = useOrbit();
  const [activeMethod, setActiveMethod] = useState<CaptureSource | null>(null);
  const [step, setStep] = useState<"input" | "processing" | "result">("input");
  const [progress, setProgress] = useState(0);
  const [draft, setDraft] = useState<Omit<OrbitTask, "id" | "createdAt" | "status"> | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [results, setResults] = useState<OrbitTask[]>([]);

  // input fields
  const [textInput, setTextInput] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [manual, setManual] = useState({ title: "", category: "admin" as Category, priority: "medium" as Priority, dueAt: "" });
  const [email, setEmail] = useState({ sender: "", subject: "" });
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const reset = () => {
    setActiveMethod(null);
    setStep("input");
    setProgress(0);
    setDraft(null);
    setTextInput(""); setVoiceText(""); setManual({ title: "", category: "admin", priority: "medium", dueAt: "" });
    setEmail({ sender: "", subject: "" }); setFilePreview(null); setFileName("");
  };

  const startProcessing = async (source: CaptureSource, raw: any) => {
    setStep("processing");
    setProgress(0);
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 480));
      setProgress(i + 1);
    }
    setDraft(mockProcess(source, raw));
    setStep("result");
  };

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    setFileName(f.name);
    const url = URL.createObjectURL(f);
    setFilePreview(url);
  };

  const renderInput = () => {
    if (!activeMethod) return null;
    switch (activeMethod) {
      case "screenshot":
      case "document": {
        const isDoc = activeMethod === "document";
        return (
          <div className="space-y-3">
            <label className="block">
              <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center bg-secondary/30 tap cursor-pointer">
                <div className="text-3xl mb-2">{isDoc ? "📄" : "🖼️"}</div>
                <div className="text-sm font-medium">Tap to {isDoc ? "scan" : "upload"}</div>
                <div className="text-xs text-muted-foreground mt-1">{isDoc ? "PDF or image" : "PNG, JPG"}</div>
                {filePreview && <img src={filePreview} alt="preview" className="mt-3 rounded-xl mx-auto max-h-40" />}
              </div>
              <input type="file" accept={isDoc ? "image/*,.pdf" : "image/*"} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
            <Button disabled={!filePreview} onClick={() => startProcessing(activeMethod, { preview: filePreview, fileName })}
              className="w-full" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
              Analyze with Orbit
            </Button>
          </div>
        );
      }
      case "voice":
        return (
          <div className="space-y-3">
            <Textarea value={voiceText} onChange={(e) => setVoiceText(e.target.value)} placeholder="Type or paste your voice transcript…"
              className="bg-secondary border-border min-h-[100px]" />
            <div className="text-xs text-muted-foreground">Mock recorder: just type what you'd say.</div>
            <Button onClick={() => startProcessing("voice", { transcript: voiceText })}
              className="w-full" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
              Process voice
            </Button>
          </div>
        );
      case "text":
        return (
          <div className="space-y-3">
            <Textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Paste any text…"
              className="bg-secondary border-border min-h-[120px]" />
            <Button disabled={!textInput.trim()} onClick={() => startProcessing("text", { text: textInput })}
              className="w-full" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
              Extract action
            </Button>
          </div>
        );
      case "manual":
        return (
          <div className="space-y-3">
            <Input placeholder="Task title" value={manual.title} onChange={(e) => setManual({ ...manual, title: e.target.value })}
              className="bg-secondary border-border" />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Category</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
                  <button key={c} onClick={() => setManual({ ...manual, category: c })}
                    className={`px-2 py-1.5 rounded-lg text-xs ${manual.category === c ? "bg-primary/20 text-primary border border-primary/40" : "bg-secondary border border-border"}`}>
                    {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Priority</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["high", "medium", "low"] as Priority[]).map((p) => (
                  <button key={p} onClick={() => setManual({ ...manual, priority: p })}
                    className={`px-2 py-1.5 rounded-lg text-xs capitalize ${manual.priority === p ? "border-2" : "border border-border bg-secondary"}`}
                    style={manual.priority === p ? { background: `hsl(var(--priority-${p}) / 0.15)`, color: `hsl(var(--priority-${p}))`, borderColor: `hsl(var(--priority-${p}))` } : {}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Input type="date" value={manual.dueAt} onChange={(e) => setManual({ ...manual, dueAt: e.target.value })}
              className="bg-secondary border-border" />
            <Button disabled={!manual.title.trim()} onClick={() => startProcessing("manual", { ...manual, dueAt: manual.dueAt ? new Date(manual.dueAt).getTime() : undefined })}
              className="w-full" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
              Add task
            </Button>
          </div>
        );
      case "email":
        return (
          <div className="space-y-3">
            <Input placeholder="From (sender)" value={email.sender} onChange={(e) => setEmail({ ...email, sender: e.target.value })}
              className="bg-secondary border-border" />
            <Input placeholder="Subject" value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })}
              className="bg-secondary border-border" />
            <Button disabled={!email.subject.trim()} onClick={() => startProcessing("email", email)}
              className="w-full" style={{ background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" }}>
              Process email
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="px-5 pt-6 pb-6 min-h-screen">
      <h1 className="text-xl font-semibold tracking-tight">Capture</h1>
      <p className="text-xs text-muted-foreground mt-1">Drop anything. Orbit will understand it.</p>

      {/* method grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {METHODS.map((m) => {
          const Icon = m.icon;
          return (
            <button key={m.id} onClick={() => { reset(); setActiveMethod(m.id); }}
              className="premium-card p-4 text-left tap">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `hsl(${m.color} / 0.15)`, color: `hsl(${m.color})` }}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium">{m.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</div>
            </button>
          );
        })}
      </div>

      {/* recent results */}
      {results.length > 0 && (
        <div className="mt-6">
          <div className="text-xs text-muted-foreground mb-2">Just added</div>
          <div className="space-y-2">
            {results.slice(0, 3).map((r) => (
              <div key={r.id} className="premium-card p-3 flex items-center gap-3">
                <div className="w-1 h-8 rounded-full" style={{ background: `hsl(var(--priority-${r.priority}))` }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground">Added · {CATEGORY_META[r.category].label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capture flow modal */}
      <Dialog open={!!activeMethod} onOpenChange={(v) => { if (!v) reset(); }}>
        <DialogContent className="max-w-[400px] mx-auto bg-popover border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {activeMethod && METHODS.find((m) => m.id === activeMethod)?.label}
            </DialogTitle>
          </DialogHeader>

          {step === "input" && <div className="mt-2">{renderInput()}</div>}

          {step === "processing" && (
            <div className="py-6 space-y-4 animate-fade-in">
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full glow-orb" />
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "var(--gradient-brand)" }}>
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {PROCESSING_STEPS.map((s, i) => (
                  <div key={s} className={`flex items-center gap-2 text-sm ${i < progress ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {i < progress ? <Check className="w-4 h-4 text-primary" /> : <div className="w-4 h-4 rounded-full border border-border" />}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "result" && draft && (
            <>
              <div className="mt-2">
                <ResultCard task={draft}
                  onAdd={() => { const t = addTask(draft); setResults((r) => [t, ...r]); toast.success("Added to Orbit"); reset(); }}
                  onEdit={() => setEditOpen(true)}
                  onDiscard={() => { toast("Discarded"); reset(); }}
                />
              </div>
              <EditModal open={editOpen} onOpenChange={setEditOpen} draft={draft} onSave={(d) => { setDraft(d); toast.success("Updated"); }} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Capture;
