"use client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Task } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { taskFormSchema } from "@/validations/task.validations"
import { taskService } from "@/services/taskService"

type FormData = z.output<typeof taskFormSchema>

interface Props {
  task?: Task
  onSaved: () => void
}

export function TaskForm({ task, onSaved }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "PENDING",
      priority: task?.priority ?? "MEDIUM",
      startDate: task?.startDate ?? "",
      endDate: task?.endDate ?? "",
      targetDate: task?.targetDate ?? "",
    },
  })

  const onSubmit = async (data: FormData) => {
    const payload = {
      title: data.title,
      description: data.description || undefined,
      status: data.status,
      priority: data.priority,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      targetDate: data.targetDate || undefined,
    }

    if (task) await taskService.update(task.id, payload)
    else await taskService.create(payload)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input id="title" placeholder="Task title" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Optional description..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          {...register("description")}
        />
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            defaultValue={watch("status")}
            onValueChange={(v) =>
              setValue("status", v as "PENDING" | "COMPLETED")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            defaultValue={watch("priority")}
            onValueChange={(v) =>
              setValue("priority", v as "LOW" | "MEDIUM" | "HIGH")
            }
          >
            <SelectTrigger>
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

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetDate">Target Date</Label>
          <Input id="targetDate" type="date" {...register("targetDate")} />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {task ? "Update Task" : "Create Task"}
      </Button>
    </form>
  )
}
