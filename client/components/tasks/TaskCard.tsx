"use client"
import { useEffect, useMemo, useState } from "react"
import { TaskStatus, Priority, UserSummary, Props } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2, Calendar, X, Plus } from "lucide-react"
import { format } from "date-fns"
import { initials } from "@/helpers/helpers"
import { Badge } from "../ui/badge"

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
  onSearchAssignableUsers,
  onAssignUser,
  onUnassignUser,
}: Props) {
  const isCompleted = task.status === "COMPLETED"
  const [search, setSearch] = useState("")
  const [options, setOptions] = useState<UserSummary[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [assignLoading, setAssignLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [unassigningUserId, setUnassigningUserId] = useState<string | null>(
    null
  )
  const [showAssigner, setShowAssigner] = useState(false)

  const assignedUserIds = useMemo(
    () => new Set(task.assignments.map((assignment) => assignment.userId)),
    [task.assignments]
  )

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true)
        const users = await onSearchAssignableUsers(task.id, search)
        setOptions(users.filter((user) => !assignedUserIds.has(user.id)))
      } finally {
        setSearchLoading(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [task.id, search, onSearchAssignableUsers, assignedUserIds])

  const handleAssign = async () => {
    if (!selectedUserId) return
    setAssignLoading(true)
    try {
      await onAssignUser(task.id, selectedUserId)
      setSelectedUserId("")
      setSearch("")
      setShowAssigner(false)
    } finally {
      setAssignLoading(false)
    }
  }

  const handleUnassign = async (userId: string) => {
    setUnassigningUserId(userId)
    try {
      await onUnassignUser(task.id, userId)
    } finally {
      setUnassigningUserId(null)
    }
  }

  return (
    <div
      className={`flex items-start gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-sm ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      {/* ── Checkbox toggle PENDING ↔ COMPLETED ── */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={isCompleted ? "Mark as pending" : "Mark as complete"}
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

      {/* ── Content ── */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* Title */}
        <p
          className={`leading-snug font-medium ${
            isCompleted
              ? "text-muted-foreground line-through"
              : "text-foreground"
          }`}
        >
          {task.title}
        </p>

        {/* Description */}
        {task.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}

        {/* ── Inline dropdowns row ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status dropdown */}
          <Select
            value={task.status}
            onValueChange={(v) => onStatusChange(task.id, v as TaskStatus)}
          >
            <SelectTrigger className="h-7 w-36 px-2 text-xs">
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

          {/* Priority dropdown */}
          <Select
            value={task.priority}
            onValueChange={(v) => onPriorityChange(task.id, v as Priority)}
          >
            <SelectTrigger className="h-7 w-32 px-2 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground">Low</span>
                </span>
              </SelectItem>
              <SelectItem value="MEDIUM">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-yellow-600">Medium</span>
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
        </div>

        {/* ── Dates row ── */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {task.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Start: {format(new Date(task.startDate), "MMM d, yyyy")}
            </span>
          )}
          {task.targetDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Target: {format(new Date(task.targetDate), "MMM d, yyyy")}
            </span>
          )}
          {task.endDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              End: {format(new Date(task.endDate), "MMM d, yyyy")}
            </span>
          )}
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              Assignees
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => setShowAssigner((v) => !v)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add assignee
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {task.assignments.length === 0 ? (
              <span className="text-xs text-muted-foreground">
                No assignees
              </span>
            ) : (
              task.assignments.map((assignment) => (
                <Badge
                  key={assignment.id}
                  variant="secondary"
                  className="gap-1.5 pr-1"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                    {initials(assignment.user.email)}
                  </span>
                  <span className="max-w-[170px] truncate">
                    {assignment.user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUnassign(assignment.userId)}
                    disabled={unassigningUserId === assignment.userId}
                    className="rounded p-0.5 hover:bg-background/70 disabled:opacity-50"
                    aria-label={`Unassign ${assignment.user.email}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          {showAssigner && (
            <div className="grid gap-2 rounded-md border bg-muted/30 p-2 sm:grid-cols-[1fr_200px_auto]">
              <Input
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      searchLoading ? "Searching..." : "Select person"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {options.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAssign}
                disabled={!selectedUserId || assignLoading}
              >
                Assign
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
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
      </div>
    </div>
  )
}
