export function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function formatMoney(amount?: number | null) {
  if (amount == null || Number.isNaN(Number(amount))) return "$0.00";
  return `$${Number(amount).toFixed(2)}`;
}

export function statusClass(value?: string) {
  const normalized = (value || "").toLowerCase();
  if (normalized === "paid" || normalized === "confirmed" || normalized === "approved" || normalized === "completed") {
    return "approved";
  }
  if (normalized === "rejected" || normalized === "failed") return "rejected";
  return "pending";
}

export function monthlyBuckets(items: Array<{ date: string | Date; amount?: number }>, months = 6) {
  const now = new Date();
  const labels: string[] = [];
  const counts: number[] = [];
  const totals: number[] = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(cursor.toLocaleString("en-US", { month: "short" }));
    const month = cursor.getMonth();
    const year = cursor.getFullYear();
    const matched = items.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
    counts.push(matched.length);
    totals.push(matched.reduce((sum, item) => sum + Number(item.amount || 0), 0));
  }

  return { labels, counts, totals };
}
