export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  startDate: string;
  endDate: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TaskFilters {
  page: number;
  search: string;
  status: TaskStatus | '';
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  startDate?: string;
  endDate?: string;
  targetDate?: string;
}