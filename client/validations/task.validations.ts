import { z } from "zod"

// Matches backend taskSchema exactly
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(["PENDING", "COMPLETED"]).default("PENDING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  targetDate: z.string().optional(),
})