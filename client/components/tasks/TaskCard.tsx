"use client"

import { TaskStatus, Priority } from "@/types"
import { Task } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2, Calendar } from "lucide-react"
import { format } from "date-fns"

interface Props {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
  onPriorityChange: (id: string, priority: Priority) => void
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
}: Props) {
  const isCompleted = task.status === "COMPLETED"

  return (
    <div
      className={`flex items-start gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-sm ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      {/* ── Checkbox toggle ── */}
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
          {/* Status */}
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

          {/* Priority */}
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
      </div>

      {/* ── Action buttons ── */}
      <div className="flex shrink-0 items-center gap-1">
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
      </div>
    </div>
  )
}