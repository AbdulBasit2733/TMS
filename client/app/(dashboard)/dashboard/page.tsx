"use client"
import { useState } from "react"
import { useTasks } from "@/hooks/useTasks"
import { Task, TaskStatus, Priority } from "@/types"
import { TaskCard } from "@/components/tasks/TaskCard"
import { TaskForm } from "@/components/tasks/TaskForm"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const {
    tasks,
    total,
    page,
    totalPages,
    loading,
    filters,
    setSearch,
    setStatus,
    setPage,
    fetchTasks,
    updateTask,
    deleteTask,
    toggleTask,
    updateStatus, // ← destructure new helpers
    updatePriority, // ←
  } = useTasks()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const handleSaved = () => {
    setCreateOpen(false)
    setEditTask(null)
    fetchTasks()
  }

  const pending = tasks.filter((t) => t.status === "PENDING").length
  const completed = tasks.filter((t) => t.status === "COMPLETED").length

  return (
    <div className="space-y-6">
      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: total, color: "text-foreground" },
          { label: "Pending", value: pending, color: "text-yellow-600" },
          { label: "Completed", value: completed, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold tabular-nums ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={filters.status || "ALL"}
          onValueChange={(v) => setStatus(v === "ALL" ? "" : (v as TaskStatus))}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSaved={handleSaved} />
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Task List ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <p className="text-lg font-medium">No tasks yet</p>
          <p className="text-sm">Click "New Task" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={() => setEditTask(task)}
              onDelete={deleteTask}
              onStatusChange={updateStatus} // ← inline status dropdown
              onPriorityChange={updatePriority} // ← inline priority dropdown
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="self-center text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && <TaskForm task={editTask} onSaved={handleSaved} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
