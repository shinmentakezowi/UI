export function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return (v >= 10 ? v.toFixed(1) : v.toFixed(2)) + "M";
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + "K";
  }
  return n.toLocaleString();
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export function formatLogTime(ts: number): string {
  const d = new Date(ts * 1000);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (isToday) return time;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + time;
}

export function maskKey(key: string | null | undefined): string {
  if (!key) return "";
  const prefix = "sk-hapuppy-";
  if (key.length <= prefix.length + 4) return key;
  return prefix + "\u2022".repeat(8) + key.slice(-4);
}
