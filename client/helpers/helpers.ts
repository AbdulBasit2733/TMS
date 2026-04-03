// ── Helpers ────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100   text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100  text-amber-700",
  "bg-rose-100   text-rose-700",
  "bg-sky-100    text-sky-700",
]

export function avatarColor(email: string) {
  const code = email.charCodeAt(0) + (email.charCodeAt(email.length - 1) || 0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

export function initials(email: string): string {
  return email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
}

