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

export type AdminItemKind = "bills" | "documents" | "renewals";
export interface AdminItem {
  id: string;
  kind: AdminItemKind;
  title: string;
  amount?: string;
  dueAt?: number;
  status: "active" | "done" | "archived";
  notes?: string;
  meta?: Record<string, any>;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
  avatarInitial: string;
  streak: number;
  premium: boolean;
}

interface AccountSnapshot {
  profile: Profile;
  hasOnboarded: boolean;
  tasks: OrbitTask[];
  reminders: Reminder[];
  adminItems: AdminItem[];
  isPremium: boolean;
  trialEndsAt?: number;
  freeUsage: { date: string; captures: number; reminders: number };
  dailyPulseTime: string;
  reminderStyle: "gentle" | "standard" | "insistent";
  biometrics: boolean;
  twoFA: boolean;
  connectedGoogle: boolean;
  connectedApple: boolean;
}

interface AppState {
  // entry/auth
  hasOnboarded: boolean;
  isAuthed: boolean;
  currentEmail: string | null;
  accounts: Record<string, AccountSnapshot>;
  setOnboarded: (v: boolean) => void;
  setAuthed: (v: boolean) => void;
  signIn: (email: string, opts?: { name?: string; isSignup?: boolean }) => { isNew: boolean };
  signOut: () => void;

  // profile
  profile: Profile;
  updateProfile: (p: Partial<Profile>) => void;

  // settings
  dailyPulseTime: string;
  reminderStyle: "gentle" | "standard" | "insistent";
  biometrics: boolean;
  twoFA: boolean;
  connectedGoogle: boolean;
  connectedApple: boolean;
  setSetting: <K extends keyof AppState>(k: K, v: AppState[K]) => void;

  // premium / trial
  isPremium: boolean;
  trialEndsAt?: number;
  freeUsage: { date: string; captures: number; reminders: number };
  setPremium: (v: boolean, trialDays?: number) => void;
  canUse: (kind: "capture" | "reminder") => boolean;
  bumpUsage: (kind: "capture" | "reminder") => void;
  isProFeature: (key: "voice" | "document" | "email" | "screenshot" | "text") => boolean;

  // admin items
  adminItems: AdminItem[];
  addAdminItem: (item: Omit<AdminItem, "id">) => AdminItem;
  updateAdminItem: (id: string, p: Partial<AdminItem>) => void;

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

const defaultProfile = (email = "", name = ""): Profile => ({
  name: name || "You",
  email,
  phone: "",
  avatarColor: "hsl(212 100% 62%)",
  avatarInitial: (name || email || "Y").trim()[0]?.toUpperCase() ?? "Y",
  streak: 0,
  premium: false,
});

const emptyState = () => ({
  hasOnboarded: false,
  tasks: [] as OrbitTask[],
  reminders: [] as Reminder[],
  adminItems: [] as AdminItem[],
  isPremium: false,
  trialEndsAt: undefined as number | undefined,
  freeUsage: { date: new Date().toISOString().slice(0, 10), captures: 0, reminders: 0 },
  dailyPulseTime: "08:00",
  reminderStyle: "standard" as const,
  biometrics: true,
  twoFA: false,
  connectedGoogle: false,
  connectedApple: false,
});

export const useOrbit = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      isAuthed: false,
      currentEmail: null,
      accounts: {},

      setOnboarded: (v) => {
        set({ hasOnboarded: v });
        get().signOut; // no-op
        // snapshot to current account
        const email = get().currentEmail;
        if (email) {
          const accounts = { ...get().accounts };
          if (accounts[email]) accounts[email] = { ...accounts[email], hasOnboarded: v };
          set({ accounts });
        }
      },
      setAuthed: (v) => set({ isAuthed: v }),

      signIn: (email, opts) => {
        const e = email.trim().toLowerCase();
        const accounts = { ...get().accounts };
        const existing = accounts[e];
        const isNew = !existing || !!opts?.isSignup && !existing;

        if (existing && !opts?.isSignup) {
          // restore
          set({
            ...existing,
            isAuthed: true,
            currentEmail: e,
          });
          return { isNew: false };
        }

        // signup or first login with new email
        const fresh = emptyState();
        const profile = defaultProfile(e, opts?.name);
        const snapshot: AccountSnapshot = { ...fresh, profile };
        accounts[e] = snapshot;
        set({
          ...snapshot,
          accounts,
          isAuthed: true,
          currentEmail: e,
        });
        return { isNew: true };
      },

      signOut: () => {
        // snapshot before clearing session
        const email = get().currentEmail;
        const accounts = { ...get().accounts };
        if (email) {
          accounts[email] = {
            profile: get().profile,
            hasOnboarded: get().hasOnboarded,
            tasks: get().tasks,
            reminders: get().reminders,
            adminItems: get().adminItems,
            isPremium: get().isPremium,
            trialEndsAt: get().trialEndsAt,
            freeUsage: get().freeUsage,
            dailyPulseTime: get().dailyPulseTime,
            reminderStyle: get().reminderStyle,
            biometrics: get().biometrics,
            twoFA: get().twoFA,
            connectedGoogle: get().connectedGoogle,
            connectedApple: get().connectedApple,
          };
        }
        set({
          accounts,
          isAuthed: false,
          currentEmail: null,
          ...emptyState(),
          profile: defaultProfile(),
        });
      },

      profile: defaultProfile(),
      updateProfile: (p) => {
        const next = {
          ...get().profile,
          ...p,
          avatarInitial: (p.name?.trim()?.[0] ?? get().profile.avatarInitial).toUpperCase(),
        };
        set({ profile: next });
      },

      dailyPulseTime: "08:00",
      reminderStyle: "standard",
      biometrics: true,
      twoFA: false,
      connectedGoogle: false,
      connectedApple: false,
      setSetting: (k, v) => set({ [k]: v } as any),

      isPremium: false,
      trialEndsAt: undefined,
      freeUsage: { date: new Date().toISOString().slice(0, 10), captures: 0, reminders: 0 },
      setPremium: (v, trialDays) => set({
        isPremium: v,
        trialEndsAt: trialDays ? Date.now() + trialDays * 86400000 : undefined,
        profile: { ...get().profile, premium: v },
      }),
      canUse: (kind) => {
        const s = get();
        if (s.isPremium || (s.trialEndsAt && s.trialEndsAt > Date.now())) return true;
        const today = new Date().toISOString().slice(0, 10);
        const u = s.freeUsage.date === today ? s.freeUsage : { date: today, captures: 0, reminders: 0 };
        const limits = { capture: 3, reminder: 3 };
        return u[kind === "capture" ? "captures" : "reminders"] < limits[kind];
      },
      bumpUsage: (kind) => {
        const today = new Date().toISOString().slice(0, 10);
        const u = get().freeUsage.date === today ? { ...get().freeUsage } : { date: today, captures: 0, reminders: 0 };
        if (kind === "capture") u.captures += 1; else u.reminders += 1;
        set({ freeUsage: u });
      },
      isProFeature: (key) => {
        // Pro-locked capture features
        return key === "voice" || key === "document" || key === "email";
      },

      adminItems: [],
      addAdminItem: (item) => {
        const it: AdminItem = { id: "a_" + Math.random().toString(36).slice(2, 9), ...item };
        set({ adminItems: [it, ...get().adminItems] });
        return it;
      },
      updateAdminItem: (id, p) => set({ adminItems: get().adminItems.map((x) => x.id === id ? { ...x, ...p } : x) }),

      tasks: [],
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

      reset: () => set({
        isAuthed: false,
        currentEmail: null,
        accounts: {},
        ...emptyState(),
        profile: defaultProfile(),
      }),
    }),
    {
      name: "orbit-store",
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        isAuthed: s.isAuthed,
        currentEmail: s.currentEmail,
        accounts: s.accounts,
        profile: s.profile,
        dailyPulseTime: s.dailyPulseTime,
        reminderStyle: s.reminderStyle,
        biometrics: s.biometrics,
        twoFA: s.twoFA,
        connectedGoogle: s.connectedGoogle,
        connectedApple: s.connectedApple,
        tasks: s.tasks,
        reminders: s.reminders,
        isPremium: s.isPremium,
        trialEndsAt: s.trialEndsAt,
        freeUsage: s.freeUsage,
        adminItems: s.adminItems,
      }),
    }
  )
);
