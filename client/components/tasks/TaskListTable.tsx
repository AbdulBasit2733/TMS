"use client"

import { Task, TaskStatus, Priority } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface Props {
  tasks: Task[]
  onOpenTask: (id: string) => void
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
  onPriorityChange: (id: string, priority: Priority) => void
}

const priorityTone: Record<Priority, string> = {
  LOW: "text-muted-foreground",
  MEDIUM: "text-amber-600",
  HIGH: "text-red-600",
}

export function TaskListTable({
  tasks,
  onOpenTask,
  onToggle,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border-l-0 border-r-0 border-t-0 bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Task</th>
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
                          className={`truncate font-medium ${
                            isCompleted
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
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
                    {task.targetDate && (
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(task.targetDate), "MMM d, yyyy")}
                      </span>
                    )}
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