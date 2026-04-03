"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/services/taskService";
import { Task, Priority, TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Props {
  taskId: string;
}

export function TaskDetailClient({ taskId }: Props) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getById(taskId);
      setTask(data);
    } catch {
      toast.error("Failed to load task");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const updateStatus = async (status: TaskStatus) => {
    if (!task) return;
    try {
      setTask(await taskService.update(task.id, { status }));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const updatePriority = async (priority: Priority) => {
    if (!task) return;
    try {
      setTask(await taskService.update(task.id, { priority }));
    } catch {
      toast.error("Failed to update priority");
    }
  };

  if (loading) return null;
  if (!task) return null;

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

      {/* Main card */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {/* Title + controls */}
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
        <div className="flex flex-wrap gap-2.5">
          {[
            { label: "Start", date: task.startDate },
            { label: "Target", date: task.targetDate },
            { label: "End", date: task.endDate },
          ]
            .filter(({ date }) => !!date)
            .map(({ label, date }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs text-accent-foreground"
              >
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {label}: {format(new Date(date), "MMM d, yyyy")}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}