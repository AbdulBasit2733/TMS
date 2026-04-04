export type TaskStatus = 'PENDING' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface UserSummary {
  id: string;
  email: string;
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
}

export interface TaskFilters {
  page: number;
  search: string;
  status: TaskStatus | '';
  priority: Priority | '';
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

export interface Props {
  task: Task
  onToggle: (id: string) => void
  onEdit: () => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
  onPriorityChange: (id: string, priority: Priority) => void
}