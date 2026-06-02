// ─── Formatters & Utilities ────────────────────────────────────────────────

/**
 * Format a number as NPR currency
 * @param {number} amount
 * @param {boolean} compact - use compact notation for large numbers
 */
export const formatNPR = (amount, compact = false) => {
  if (compact && amount >= 100000) {
    return `NPR ${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `NPR ${(amount / 1000).toFixed(1)}K`;
  }
  return `NPR ${amount.toLocaleString("en-IN")}`;
};

/**
 * Format date string to readable format
 * @param {string} dateStr - ISO date string
 * @param {boolean} short - use short format
 */
export const formatDate = (dateStr, short = false) => {
  const date = new Date(dateStr);
  if (short) {
    return date.toLocaleDateString("en-NP", { day: "2-digit", month: "short" });
  }
  return date.toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date + time
 * @param {string} dateStr
 */
export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get initials from a name
 * @param {string} name
 */
export const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

/**
 * Status config for registrations
 */
export const statusConfig = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200" },
  expired: { label: "Expired", color: "bg-red-100 text-red-700 border-red-200" },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700 border-red-200" },
  inactive: { label: "Inactive", color: "bg-slate-100 text-slate-600 border-slate-200" },
};

/**
 * Plan config for tenants
 */
export const planConfig = {
  Starter: { color: "bg-slate-100 text-slate-600 border-slate-200" },
  Business: { color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  Enterprise: { color: "bg-violet-100 text-violet-700 border-violet-200" },
};

/**
 * Payment method colors
 */
export const paymentColors = {
  eSewa: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Khalti: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  "Mobile Banking": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
};

/**
 * Generate a unique ID (simple timestamp-based)
 */
export const genId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

/**
 * Generate a sequential receipt ID in the format N-MM-BSYYYY.
 * Counter is persisted in localStorage per month+year and resets each new month.
 */
export const genReceiptId = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const key = `bk_rcpt_${month}_${year}`;
  const next = (parseInt(localStorage.getItem(key) || "0", 10)) + 1;
  localStorage.setItem(key, String(next));
  return `VH${String(next).padStart(2, "0")}-${month}-${year}`;
};

/**
 * Truncate text
 */
export const truncate = (str, n = 30) =>
  str.length > n ? str.slice(0, n) + "…" : str;

/**
 * Random avatar color from name
 */
export const avatarColor = (name) => {
  const colors = [
    "bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500",
    "bg-rose-500", "bg-cyan-500", "bg-orange-500", "bg-pink-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};
