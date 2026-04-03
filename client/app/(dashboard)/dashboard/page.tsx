"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskStatus, Priority } from "@/types";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskListTable } from "@/components/tasks/TaskListTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Loader2,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const {
    tasks,
    page,
    totalPages,
    loading,
    filters,
    stats,
    setSearch,
    setStatus,
    setPriority,
    setPage,
    fetchTasks,
    deleteTask,
    toggleTask,
    updateStatus,
    updatePriority,
  } = useTasks();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleSaved = () => {
    setCreateOpen(false);
    setEditTask(null);
    fetchTasks();
  };

  const visibleTasks = tasks;

  const statsData = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: ClipboardList,
      valueCls: "text-primary",
      bgCls: "bg-primary/10",
      iconCls: "text-primary",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      valueCls: "text-amber-600 dark:text-amber-400",
      bgCls: "bg-amber-500/10",
      iconCls: "text-amber-500",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      valueCls: "text-emerald-600 dark:text-emerald-400",
      bgCls: "bg-emerald-500/10",
      iconCls: "text-emerald-500",
    },
    {
      label: "High",
      value: stats.high,
      icon: AlertTriangle,
      valueCls: "text-red-600 dark:text-red-400",
      bgCls: "bg-red-500/10",
      iconCls: "text-red-500",
    },
    {
      label: "Medium",
      value: stats.medium,
      icon: AlertCircle,
      valueCls: "text-amber-600 dark:text-amber-400",
      bgCls: "bg-amber-500/10",
      iconCls: "text-amber-500",
    },
    {
      label: "Low",
      value: stats.low,
      icon: CheckCircle2,
      valueCls: "text-emerald-600 dark:text-emerald-400",
      bgCls: "bg-emerald-500/10",
      iconCls: "text-emerald-500",
    },
  ];

  return (
    <div className="space-y-5 px-1">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Organize work and track progress.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9 gap-1.5 px-4">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSaved={handleSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statsData.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3.5 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bgCls}`}>
              <s.icon className={`h-5 w-5 ${s.iconCls}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className={`text-2xl leading-tight font-bold tabular-nums ${s.valueCls}`}>
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-2.5 border-b bg-background/60 p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks…"
              className="h-9 bg-card pl-9 text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={filters.status || "ALL"}
            onValueChange={(v) => setStatus(v === "ALL" ? "" : (v as TaskStatus))}
          >
            <SelectTrigger className="h-9 w-full bg-card text-sm sm:w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
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
          <Select
            value={filters.priority || ""}
            onValueChange={(v) => setPriority(v === "" ? "" : (v as Priority))}
          >
            <SelectTrigger className="h-9 w-full bg-card text-sm sm:w-40">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All priorities</SelectItem>
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

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading tasks…</p>
            </div>
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-2 font-semibold">No tasks found</p>
            <p className="max-w-[26ch] text-sm text-muted-foreground">
              Create your first task to start tracking work.
            </p>
            <Button size="sm" className="mt-4 gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              New Task
            </Button>
          </div>
        ) : (
          <TaskListTable
            tasks={visibleTasks}
            onOpenTask={(id) => router.push(`/dashboard/tasks/${id}`)}
            onToggle={toggleTask}
            onEdit={(task) => setEditTask(task)}
            onDelete={deleteTask}
            onStatusChange={updateStatus}
            onPriorityChange={updatePriority}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" className="h-8 px-3" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page <span className="font-semibold text-foreground">{page}</span>{" "}
            of <span className="font-semibold text-foreground">{totalPages}</span>
          </span>
          <Button variant="outline" size="sm" className="h-8 px-3" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}

      <Dialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && <TaskForm task={editTask} onSaved={handleSaved} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}