export const fmtRelative = (ts: number): string => {
  const diff = ts - Date.now();
  const abs = Math.abs(diff);
  const m = Math.round(abs / 60000);
  const h = Math.round(m / 60);
  const d = Math.round(h / 24);
  const past = diff < 0;
  if (m < 1) return "just now";
  if (m < 60) return past ? `${m}m ago` : `in ${m}m`;
  if (h < 24) return past ? `${h}h ago` : `in ${h}h`;
  if (d < 7) return past ? `${d}d ago` : `in ${d}d`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const fmtDateTime = (ts: number): string =>
  new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export const fmtTime = (ts: number): string =>
  new Date(ts).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
