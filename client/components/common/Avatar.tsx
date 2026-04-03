import { avatarColor, initials } from "@/helpers/helpers"
import { cn } from "@/lib/utils"

export default function Avatar({
  email,
  size = "md",
}: {
  email: string
  size?: "sm" | "md"
}) {
  const sz = size === "sm" ? "h-5 w-5 text-[9px]" : "h-7 w-7 text-[11px]"
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold",
        sz,
        avatarColor(email)
      )}
    >
      {initials(email)}
    </span>
  )
}
