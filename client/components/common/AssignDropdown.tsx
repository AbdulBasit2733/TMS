import { Task, UserSummary } from "@/types"
import { useEffect, useRef, useState } from "react"
import { Input } from "../ui/input"
import { Loader2, Plus, UserX, X } from "lucide-react"
import { avatarColor, initials } from "@/helpers/helpers"

interface AssignDropdownProps {
  task: Task
  onSearchAssignableUsers: (
    taskId: string,
    search?: string
  ) => Promise<UserSummary[]>
  onAssignUser: (taskId: string, userId: string) => Promise<unknown>
  onUnassignUser: (taskId: string, userId: string) => Promise<unknown>
}
export function AssignDropdown({
  task,
  onSearchAssignableUsers,
  onAssignUser,
  onUnassignUser,
}: AssignDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [options, setOptions] = useState<UserSummary[]>([])
  const [searching, setSearching] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null)
  const [unassigning, setUnassigning] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const assignedIds = new Set(task.assignments.map((a) => a.userId))

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else setSearch("")
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!open) return
    setSearching(true)
    const timer = setTimeout(async () => {
      try {
        const users = await onSearchAssignableUsers(task.id, search)
        setOptions(users.filter((u) => !assignedIds.has(u.id)))
      } finally {
        setSearching(false)
      }
    }, 280)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, search])

  const handleAssign = async (userId: string) => {
    setAssigning(userId)
    try {
      await onAssignUser(task.id, userId)
      // Remove from options immediately
      setOptions((prev) => prev.filter((u) => u.id !== userId))
    } finally {
      setAssigning(null)
    }
  }

  const handleUnassign = async (userId: string) => {
    setUnassigning(userId)
    try {
      await onUnassignUser(task.id, userId)
    } finally {
      setUnassigning(null)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Avatar stack ── */}
      {task.assignments.length > 0 && (
        <div className="flex -space-x-1.5">
          {task.assignments.slice(0, 3).map((a) => (
            <span
              key={a.id}
              title={a.user.email}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-background text-[9px] font-bold ${avatarColor(a.user.email)}`}
            >
              {initials(a.user.email)}
            </span>
          ))}
          {task.assignments.length > 3 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] font-semibold text-muted-foreground">
              +{task.assignments.length - 3}
            </span>
          )}
        </div>
      )}

      {/* ── Plus button ── */}
      <button
        type="button"
        aria-label="Assign user"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed transition-colors ${
          open
            ? "border-primary bg-primary/10 text-primary"
            : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary"
        }`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="absolute top-8 left-0 z-50 w-64 rounded-lg border bg-popover shadow-lg">
          {/* Search input */}
          <div className="border-b p-2">
            <div className="relative">
              <Input
                ref={inputRef}
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 pr-6 text-xs"
              />
              {searching && (
                <Loader2 className="absolute top-1/2 right-2 h-3 w-3 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Current assignees — with remove */}
          {task.assignments.length > 0 && (
            <div className="border-b p-2">
              <p className="mb-1.5 px-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Assigned
              </p>
              <ul className="space-y-0.5">
                {task.assignments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${avatarColor(a.user.email)}`}
                    >
                      {initials(a.user.email)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs">
                      {a.user.email}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${a.user.email}`}
                      disabled={unassigning === a.userId}
                      onClick={() => handleUnassign(a.userId)}
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    >
                      {unassigning === a.userId ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Assignable users — click to assign instantly */}
          <div className="max-h-44 overflow-y-auto p-1">
            {!searching && options.length === 0 ? (
              <div className="flex items-center justify-center gap-1.5 py-4 text-xs text-muted-foreground">
                <UserX className="h-4 w-4" />
                {search ? "No users found" : "All users assigned"}
              </div>
            ) : (
              <ul>
                {options.map((user) => (
                  <li key={user.id}>
                    <button
                      type="button"
                      disabled={assigning === user.id}
                      onClick={() => handleAssign(user.id)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent disabled:opacity-50"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${avatarColor(user.email)}`}
                      >
                        {initials(user.email)}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs">
                        {user.email}
                      </span>
                      {assigning === user.id && (
                        <Loader2 className="h-3 w-3 shrink-0 animate-spin text-muted-foreground" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
