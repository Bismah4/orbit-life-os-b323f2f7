// Orbit shared design tokens for categories & priorities
export type Priority = "high" | "medium" | "low";
export type Category = "money" | "work" | "admin" | "health" | "people" | "goals";

export const CATEGORY_META: Record<Category, { label: string; var: string; emoji: string }> = {
  money:  { label: "Money",  var: "--cat-money",  emoji: "💸" },
  work:   { label: "Work",   var: "--cat-work",   emoji: "💼" },
  admin:  { label: "Admin",  var: "--cat-admin",  emoji: "📋" },
  health: { label: "Health", var: "--cat-health", emoji: "❤️" },
  people: { label: "People", var: "--cat-people", emoji: "👥" },
  goals:  { label: "Goals",  var: "--cat-goals",  emoji: "🎯" },
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
