"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { taskService } from "@/services/taskService"
import { Task, UserSummary, Priority, TaskStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Calendar, Loader2, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

function initialsFromEmail(email: string): string {
  return email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const taskId = params.id

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [options, setOptions] = useState<UserSummary[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [assigning, setAssigning] = useState(false)
  const [searching, setSearching] = useState(false)
  const [unassigningUserId, setUnassigningUserId] = useState<string | null>(null)

  const assignedIds = useMemo(
    () => new Set(task?.assignments.map((assignment) => assignment.userId) ?? []),
    [task]
  )

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

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setSearching(true)
        const res = await taskService.searchAssignableUsers(taskId, search, 12)
        setOptions(res.users.filter((user) => !assignedIds.has(user.id)))
      } catch {
        setOptions([])
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search, taskId, assignedIds])

  const assignUser = async () => {
    if (!selectedUserId) return
    try {
      setAssigning(true)
      const updated = await taskService.assignUser(taskId, selectedUserId)
      setTask(updated)
      setSelectedUserId("")
      setSearch("")
      toast.success("Assignee added")
    } catch {
      toast.error("Failed to assign user")
    } finally {
      setAssigning(false)
    }
  }

  const unassignUser = async (userId: string) => {
    try {
      setUnassigningUserId(userId)
      const updated = await taskService.unassignUser(taskId, userId)
      setTask(updated)
      toast.success("Assignee removed")
    } catch {
      toast.error("Failed to unassign user")
    } finally {
      setUnassigningUserId(null)
    }
  }

  const updateStatus = async (status: TaskStatus) => {
    if (!task) return
    try {
      const updated = await taskService.update(task.id, { status })
      setTask(updated)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const updatePriority = async (priority: Priority) => {
    if (!task) return
    try {
      const updated = await taskService.update(task.id, { priority })
      setTask(updated)
    } catch {
      toast.error("Failed to update priority")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-4 w-4" />
        Back to tasks
      </Button>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{task.title}</h1>
            {task.description && (
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={task.status} onValueChange={(v) => updateStatus(v as TaskStatus)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={task.priority} onValueChange={(v) => updatePriority(v as Priority)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Start: {format(new Date(task.startDate), "MMM d, yyyy")}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Target: {format(new Date(task.targetDate), "MMM d, yyyy")}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5">
            <Calendar className="h-3.5 w-3.5" />
            End: {format(new Date(task.endDate), "MMM d, yyyy")}
          </span>
        </div>

        <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Assignees</h2>
            <span className="text-xs text-muted-foreground">{task.assignments.length} people</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {task.assignments.length === 0 ? (
              <span className="text-sm text-muted-foreground">No assignees yet</span>
            ) : (
              task.assignments.map((assignment) => (
                <Badge key={assignment.id} variant="secondary" className="gap-2 pr-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-semibold">
                    {initialsFromEmail(assignment.user.email)}
                  </span>
                  <span className="max-w-[240px] truncate">{assignment.user.email}</span>
                  <button
                    type="button"
                    disabled={unassigningUserId === assignment.userId}
                    className="rounded p-0.5 hover:bg-background/80 disabled:opacity-50"
                    onClick={() => unassignUser(assignment.userId)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_220px_auto]">
            <Input
              placeholder="Search people by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder={searching ? "Searching..." : "Select assignee"} />
              </SelectTrigger>
              <SelectContent>
                {options.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={!selectedUserId || assigning} onClick={assignUser} className="gap-2">
              <Plus className="h-4 w-4" />
              Assign
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
