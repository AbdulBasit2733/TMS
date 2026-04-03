import { TASK_STATUS, PRIORITY } from '@prisma/client';

export type { TASK_STATUS, PRIORITY };

export interface CreateTaskData {
  title: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  targetDate: Date;
  description?: string | null;
  status?: TASK_STATUS;
  priority?: PRIORITY;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TASK_STATUS;
  priority?: PRIORITY;
  startDate?: Date;
  endDate?: Date;
  targetDate?: Date;
}

export interface AssignTaskInput {
  userId: string;
}

export interface SearchAssignableUsersQuery {
  search?: string;
  limit?: number;
}

export interface TaskWhereClause {
  userId?: string;
  status?: TASK_STATUS;
  title?: {
    contains: string;
    mode: 'insensitive';
  };
}