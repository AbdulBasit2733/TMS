"use client"

import { useEffect, useRef, useState } from "react"
import { Task, TaskStatus, Priority } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserX,
  X,
} from "lucide-react"
import { format } from "date-fns"
import type { UserSummary } from "@/types"

interface Props {
  tasks: Task[]
  onOpenTask: (id: string) => void
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
  onPriorityChange: (id: string, priority: Priority) => void
  onSearchAssignableUsers: (
    taskId: string,
    search?: string
  ) => Promise<UserSummary[]>
  onAssignUser: (taskId: string, userId: string) => Promise<unknown>
  onUnassignUser: (taskId: string, userId: string) => Promise<unknown>
}

const priorityTone: Record<Priority, string> = {
  LOW: "text-muted-foreground",
  MEDIUM: "text-amber-600",
  HIGH: "text-red-600",
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
]
function avatarColor(email: string) {
  const code = email.charCodeAt(0) + (email.charCodeAt(email.length - 1) || 0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}
function initials(email: string) {
  return email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
}

// ── Inline assignee dropdown (self-contained per task row) ────────────────────
interface AssignDropdownProps {
  task: Task
  onSearchAssignableUsers: Props["onSearchAssignableUsers"]
  onAssignUser: Props["onAssignUser"]
  onUnassignUser: Props["onUnassignUser"]
}

function AssignDropdown({
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

// ── Main table ────────────────────────────────────────────────────────────────
export function TaskListTable({
  tasks,
  onOpenTask,
  onToggle,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
  onSearchAssignableUsers,
  onAssignUser,
  onUnassignUser,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Task</th>
              <th className="px-4 py-3 text-left font-medium">Assignees</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Priority</th>
              <th className="px-4 py-3 text-left font-medium">Target</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const isCompleted = task.status === "COMPLETED"
              return (
                <tr
                  key={task.id}
                  onClick={() => onOpenTask(task.id)}
                  className="cursor-pointer border-t transition-colors hover:bg-muted/30"
                >
                  {/* ── Title ── */}
                  <td className="max-w-[340px] px-4 py-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        aria-label={
                          isCompleted ? "Mark as pending" : "Mark as complete"
                        }
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggle(task.id)
                        }}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground hover:border-primary"
                        }`}
                      >
                        {isCompleted && (
                          <svg
                            viewBox="0 0 12 10"
                            className="h-3 w-3 fill-none stroke-current stroke-2"
                          >
                            <polyline points="1,5 4,8 11,1" />
                          </svg>
                        )}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`truncate font-medium ${isCompleted ? "text-muted-foreground line-through" : ""}`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="truncate text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ── Assignees ── */}
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AssignDropdown
                      task={task}
                      onSearchAssignableUsers={onSearchAssignableUsers}
                      onAssignUser={onAssignUser}
                      onUnassignUser={onUnassignUser}
                    />
                  </td>

                  {/* ── Status ── */}
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      value={task.status}
                      onValueChange={(v) =>
                        onStatusChange(task.id, v as TaskStatus)
                      }
                    >
                      <SelectTrigger className="h-8 w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                            Pending
                          </span>
                        </SelectItem>
                        <SelectItem value="COMPLETED">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Completed
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* ── Priority ── */}
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      value={task.priority}
                      onValueChange={(v) =>
                        onPriorityChange(task.id, v as Priority)
                      }
                    >
                      <SelectTrigger
                        className={`h-8 w-32 ${priorityTone[task.priority]}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                            <span className="text-muted-foreground">Low</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="MEDIUM">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-amber-600">Medium</span>
                          </span>
                        </SelectItem>
                        <SelectItem value="HIGH">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-red-600">High</span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* ── Target date ── */}
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(task.targetDate), "MMM d, yyyy")}
                    </span>
                  </td>

                  {/* ── Actions ── */}
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(task)}
                        aria-label="Edit task"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(task.id)}
                        aria-label="Delete task"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
