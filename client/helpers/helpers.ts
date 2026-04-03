import { format } from "date-fns"

export function toDateInput(value?: string | Date | null): string {
  if (!value) return ""
  try {
    return format(new Date(value), "yyyy-MM-dd")
  } catch {
    return ""
  }
}
