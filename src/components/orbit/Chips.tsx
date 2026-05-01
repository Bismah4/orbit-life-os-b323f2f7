import { Category, Priority, CATEGORY_META, PRIORITY_LABEL } from "@/lib/design";

export const PriorityPill = ({ priority }: { priority: Priority }) => (
  <span className={`pill-priority-${priority}`}>{PRIORITY_LABEL[priority]}</span>
);

export const CategoryPill = ({ category }: { category: Category }) => {
  const m = CATEGORY_META[category];
  return (
    <span
      className="pill-category"
      style={{
        background: `hsl(var(${m.var}) / 0.12)`,
        borderColor: `hsl(var(${m.var}) / 0.35)`,
        color: `hsl(var(${m.var}))`,
      }}
    >
      <span aria-hidden>{m.emoji}</span>
      {m.label}
    </span>
  );
};
