export type TaskStatus = 'PENDING' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface UserSummary {
  id: string;
  email: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  createdAt: string;
  user: UserSummary;
}

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
  assignments: TaskAssignment[];
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

export interface AssignableUsersResponse {
  taskId: string;
  users: UserSummary[];
}