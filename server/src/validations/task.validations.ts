import { z } from "zod";
import { TASK_STATUS, PRIORITY } from "@prisma/client";

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(TASK_STATUS).optional(),
  priority: z.enum(PRIORITY).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  targetDate: z.coerce.date().optional(),
});