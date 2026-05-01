import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, Priority } from "@/lib/design";

export type CaptureSource =
  | "screenshot" | "document" | "voice" | "text" | "manual" | "email";

export interface OrbitTask {
  id: string;
  title: string;
  detail?: string;
  category: Category;
  priority: Priority;
  source: CaptureSource;
  // Per-source extra data (preview, transcript, etc.)
  meta?: Record<string, any>;
  status: "needs_action" | "completed";
  createdAt: number;
  completedAt?: number;
  dueAt?: number;
  reminderAt?: number;
  suggestedAction?: string;
  whyItMatters?: string;
}

export interface Reminder {
  id: string;
  taskId: string;
  title: string;
  category: Category;
  priority: Priority;
  remindAt: number;
  createdAt: number;
  dismissed?: boolean;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  avatarColor: string; // hsl
  avatarInitial: string;
  streak: number;
  premium: boolean;
}

interface AppState {
  // entry/auth
  hasOnboarded: boolean;
  isAuthed: boolean;
  setOnboarded: (v: boolean) => void;
  setAuthed: (v: boolean) => void;

  // profile
  profile: Profile;
  updateProfile: (p: Partial<Profile>) => void;

  // settings
  dailyPulseTime: string; // "08:00"
  reminderStyle: "gentle" | "standard" | "insistent";
  biometrics: boolean;
  twoFA: boolean;
  connectedGoogle: boolean;
  connectedApple: boolean;
  setSetting: <K extends keyof AppState>(k: K, v: AppState[K]) => void;

  // tasks & reminders
  tasks: OrbitTask[];
  reminders: Reminder[];
  addTask: (t: Omit<OrbitTask, "id" | "createdAt" | "status"> & { status?: OrbitTask["status"] }) => OrbitTask;
  updateTask: (id: string, p: Partial<OrbitTask>) => void;
  completeTask: (id: string) => void;
  removeTask: (id: string) => void;
  setReminder: (taskId: string, remindAt: number) => Reminder;
  dismissReminder: (id: string) => void;

  reset: () => void;
}

const seedTasks = (): OrbitTask[] => {
  const now = Date.now();
  return [
    {
      id: "t1",
      title: "Review contract screenshot",
      detail: "Apartment lease — Section 4.2 mentions a 3-month notice you didn't agree to.",
      category: "admin", priority: "high", source: "screenshot",
      meta: { screenshotType: "Contract", insight: "Renewal clause auto-renews for 12 months unless cancelled by Dec 15." },
      suggestedAction: "Reply to landlord before Dec 15",
      whyItMatters: "Auto-renewal locks you in for another year.",
      status: "needs_action", createdAt: now - 1000 * 60 * 30,
      dueAt: now + 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: "t2",
      title: "Pay electricity bill",
      detail: "₹2,340 due to BESCOM",
      category: "money", priority: "high", source: "screenshot",
      meta: { screenshotType: "Bill", insight: "Late fee of ₹120 applies after due date." },
      suggestedAction: "Pay via UPI", whyItMatters: "Avoid late fee + service interruption.",
      status: "needs_action", createdAt: now - 1000 * 60 * 60 * 2,
      dueAt: now + 1000 * 60 * 60 * 36,
    },
    {
      id: "t3",
      title: "Reply to Sarah's message",
      detail: "She asked about Thursday lunch.",
      category: "people", priority: "medium", source: "screenshot",
      meta: { screenshotType: "Chat", insight: "Last message was 2 days ago." },
      suggestedAction: "Send a quick reply", whyItMatters: "Maintains the relationship.",
      status: "needs_action", createdAt: now - 1000 * 60 * 60 * 5,
    },
    {
      id: "t4",
      title: "Renew car insurance",
      category: "admin", priority: "medium", source: "email",
      meta: { sender: "ICICI Lombard", subject: "Your policy expires in 7 days" },
      suggestedAction: "Compare quotes & renew", whyItMatters: "Driving uninsured is illegal.",
      status: "needs_action", createdAt: now - 1000 * 60 * 60 * 12,
      dueAt: now + 1000 * 60 * 60 * 24 * 7,
    },
    {
      id: "t5",
      title: "Doctor appointment Friday",
      category: "health", priority: "low", source: "voice",
      meta: { transcript: "Don't forget Dr. Mehta on Friday at 4pm" },
      suggestedAction: "Add to calendar", whyItMatters: "Stay on top of your check-ups.",
      status: "needs_action", createdAt: now - 1000 * 60 * 60 * 20,
    },
    {
      id: "t6",
      title: "Wrote project proposal draft",
      category: "work", priority: "low", source: "text",
      meta: { text: "Drafted Q1 proposal — needs review by Mon." },
      status: "completed", createdAt: now - 1000 * 60 * 60 * 48,
      completedAt: now - 1000 * 60 * 60 * 5,
    },
  ];
};

export const useOrbit = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      isAuthed: false,
      setOnboarded: (v) => set({ hasOnboarded: v }),
      setAuthed: (v) => set({ isAuthed: v }),

      profile: {
        name: "Alex Rivera",
        email: "alex.rivera@orbit.app",
        phone: "+1 415 555 0142",
        avatarColor: "hsl(212 100% 62%)",
        avatarInitial: "A",
        streak: 12,
        premium: true,
      },
      updateProfile: (p) => set({ profile: { ...get().profile, ...p, avatarInitial: (p.name?.trim()?.[0] ?? get().profile.avatarInitial).toUpperCase() } }),

      dailyPulseTime: "08:00",
      reminderStyle: "standard",
      biometrics: true,
      twoFA: false,
      connectedGoogle: true,
      connectedApple: false,
      setSetting: (k, v) => set({ [k]: v } as any),

      tasks: seedTasks(),
      reminders: [],
      addTask: (t) => {
        const task: OrbitTask = {
          id: "t_" + Math.random().toString(36).slice(2, 9),
          createdAt: Date.now(),
          status: t.status ?? "needs_action",
          ...t,
        };
        set({ tasks: [task, ...get().tasks] });
        return task;
      },
      updateTask: (id, p) =>
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...p } : t)) }),
      completeTask: (id) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, status: "completed", completedAt: Date.now() } : t
          ),
        }),
      removeTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),
      setReminder: (taskId, remindAt) => {
        const t = get().tasks.find((x) => x.id === taskId);
        const rem: Reminder = {
          id: "r_" + Math.random().toString(36).slice(2, 9),
          taskId,
          title: t?.title ?? "Reminder",
          category: t?.category ?? "admin",
          priority: t?.priority ?? "medium",
          remindAt,
          createdAt: Date.now(),
        };
        set({ reminders: [rem, ...get().reminders] });
        if (t) get().updateTask(taskId, { reminderAt: remindAt });
        return rem;
      },
      dismissReminder: (id) =>
        set({ reminders: get().reminders.map((r) => (r.id === id ? { ...r, dismissed: true } : r)) }),

      reset: () => set({ hasOnboarded: false, isAuthed: false }),
    }),
    {
      name: "orbit-store",
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        isAuthed: s.isAuthed,
        profile: s.profile,
        dailyPulseTime: s.dailyPulseTime,
        reminderStyle: s.reminderStyle,
        biometrics: s.biometrics,
        twoFA: s.twoFA,
        connectedGoogle: s.connectedGoogle,
        connectedApple: s.connectedApple,
        tasks: s.tasks,
        reminders: s.reminders,
      }),
    }
  )
);
