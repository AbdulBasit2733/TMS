"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { taskService } from "@/services/taskService"
import { Task, UserSummary, Priority, TaskStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { ArrowLeft, Calendar, Check, Loader2, UserPlus, X } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ── Helpers ────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100   text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100  text-amber-700",
  "bg-rose-100   text-rose-700",
  "bg-sky-100    text-sky-700",
]

function avatarColor(email: string) {
  const code = email.charCodeAt(0) + (email.charCodeAt(email.length - 1) || 0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

function initials(email: string): string {
  return email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
}

function Avatar({ email, size = "md" }: { email: string; size?: "sm" | "md" }) {
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

// ── Main page ──────────────────────────────────────────────────
export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const taskId = params.id

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  // Popover state
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<UserSummary[]>([])
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState("")

  // Per-user loading states
  const [assigning, setAssigning] = useState<string | null>(null)
  const [unassigning, setUnassigning] = useState<string | null>(null)

  const assignedIds = useMemo(
    () => new Set(task?.assignments.map((a) => a.userId) ?? []),
    [task]
  )

  // ── Load task ────────────────────────────────────────────────
  const loadTask = async () => {
    try {
      setLoading(true)
      const data = await taskService.getById(taskId)
      setTask(data)
    } catch {
      toast.error("Failed to load task")
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTask()
  }, [taskId])

  // ── Debounced user search (fires when popover open + query changes) ──
  useEffect(() => {
    if (!open) return
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const res = await taskService.searchAssignableUsers(taskId, query, 15)
        // Show ALL users — assigned ones get a checkmark, not hidden
        setOptions(res.users)
      } catch {
        setOptions([])
      } finally {
        setSearching(false)
      }
    }, 280)
    return () => clearTimeout(t)
  }, [open, query, taskId])

  // Reset query when closed
  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  // ── Assign ───────────────────────────────────────────────────
  const handleAssign = async (userId: string) => {
    try {
      setAssigning(userId)
      const updated = await taskService.assignUser(taskId, userId)
      setTask(updated)
      toast.success("Assignee added")
    } catch {
      toast.error("Failed to assign user")
    } finally {
      setAssigning(null)
    }
  }

  // ── Unassign ─────────────────────────────────────────────────
  const handleUnassign = async (userId: string) => {
    try {
      setUnassigning(userId)
      const updated = await taskService.unassignUser(taskId, userId)
      setTask(updated)
      toast.success("Assignee removed")
    } catch {
      toast.error("Failed to remove assignee")
    } finally {
      setUnassigning(null)
    }
  }

  // ── Toggle: if already assigned → unassign, else → assign ───
  const handleToggle = (userId: string) => {
    if (assigning === userId || unassigning === userId) return
    if (assignedIds.has(userId)) {
      handleUnassign(userId)
    } else {
      handleAssign(userId)
    }
  }

  // ── Status / Priority ────────────────────────────────────────
  const updateStatus = async (status: TaskStatus) => {
    if (!task) return
    try {
      setTask(await taskService.update(task.id, { status }))
    } catch {
      toast.error("Failed to update status")
    }
  }

  const updatePriority = async (priority: Priority) => {
    if (!task) return
    try {
      setTask(await taskService.update(task.id, { priority }))
    } catch {
      toast.error("Failed to update priority")
    }
  }

  // ── Render ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!task) return null

  const assigned = task.assignments
  const unassigned = options.filter((u) => !assignedIds.has(u.id))

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="gap-2 hover:bg-accent hover:text-accent-foreground"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tasks
      </Button>

      {/* ── Main card ───────────────────────────────────────── */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {/* Title + status/priority */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {task.title}
            </h1>
            {task.description && (
              <p className="max-w-2xl text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status */}
            <Select
              value={task.status}
              onValueChange={(v) => updateStatus(v as TaskStatus)}
            >
              <SelectTrigger className="w-[150px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Pending
                  </span>
                </SelectItem>
                <SelectItem value="COMPLETED">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Priority */}
            <Select
              value={task.priority}
              onValueChange={(v) => updatePriority(v as Priority)}
            >
              <SelectTrigger className="w-[140px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-muted-foreground">Low</span>
                  </span>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-amber-600">Medium</span>
                  </span>
                </SelectItem>
                <SelectItem value="HIGH">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-red-600">High</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date pills */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          {[
            { label: "Start", date: task.startDate },
            { label: "Target", date: task.targetDate },
            { label: "End", date: task.endDate },
          ].map(({ label, date }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs text-accent-foreground"
            >
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {label}: {format(new Date(date), "MMM d, yyyy")}
            </span>
          ))}
        </div>

        {/* ── Assignees panel ─────────────────────────────── */}
        <div className="space-y-3 rounded-xl border bg-background/60 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium">Assignees</h2>
              {assigned.length > 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
                  {assigned.length}
                </span>
              )}
            </div>

            {/* ── Popover + Command trigger ──────────────── */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 border-dashed text-xs hover:border-primary hover:text-primary"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Assign people
                </Button>
              </PopoverTrigger>

              <PopoverContent align="end" sideOffset={8} className="w-72 p-0">
                <Command shouldFilter={false}>
                  {/* Search input */}
                  <div className="flex items-center border-b px-3">
                    <CommandInput
                      placeholder="Search by email…"
                      value={query}
                      onValueChange={setQuery}
                      className="h-10 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:ring-0"
                    />
                    {searching && (
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  <CommandList className="max-h-64">
                    {/* ── Currently assigned ──────────────── */}
                    {assigned.length > 0 && (
                      <CommandGroup heading="Assigned">
                        {assigned.map((a) => (
                          <CommandItem
                            key={a.userId}
                            value={a.userId}
                            onSelect={() => handleToggle(a.userId)}
                            className="flex items-center gap-2.5 px-3 py-2"
                          >
                            <Avatar email={a.user.email} size="sm" />
                            <span className="min-w-0 flex-1 truncate text-xs">
                              {a.user.email}
                            </span>
                            {/* Loading or check */}
                            {unassigning === a.userId ? (
                              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                            ) : (
                              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {assigned.length > 0 && unassigned.length > 0 && (
                      <CommandSeparator />
                    )}

                    {/* ── Assignable users ────────────────── */}
                    {unassigned.length > 0 && (
                      <CommandGroup heading="Add assignee">
                        {unassigned.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={() => handleToggle(user.id)}
                            className="flex items-center gap-2.5 px-3 py-2"
                          >
                            <Avatar email={user.email} size="sm" />
                            <span className="min-w-0 flex-1 truncate text-xs">
                              {user.email}
                            </span>
                            {assigning === user.id && (
                              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* ── Empty state ─────────────────────── */}
                    {!searching && options.length === 0 && (
                      <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
                        {query ? "No users found" : "No users available"}
                      </CommandEmpty>
                    )}
                  </CommandList>

                  {/* Footer hint */}
                  <div className="border-t px-3 py-2 text-[10px] text-muted-foreground">
                    Click a name to assign or remove
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* ── Assignee badge list ──────────────────────── */}
          <div className="flex flex-wrap gap-2">
            {assigned.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assignees yet — click{" "}
                <span className="font-medium text-foreground">
                  Assign people
                </span>{" "}
                to add one.
              </p>
            ) : (
              assigned.map((a) => (
                <Badge
                  key={a.id}
                  variant="secondary"
                  className="gap-2 border border-primary/20 bg-accent py-1 pr-1 pl-1.5 text-accent-foreground hover:bg-accent"
                >
                  <Avatar email={a.user.email} size="sm" />
                  <span className="max-w-[180px] truncate text-xs">
                    {a.user.email}
                  </span>
                  <button
                    type="button"
                    disabled={unassigning === a.userId}
                    aria-label={`Remove ${a.user.email}`}
                    onClick={() => handleUnassign(a.userId)}
                    className="ml-0.5 rounded p-0.5 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                  >
                    {unassigning === a.userId ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
