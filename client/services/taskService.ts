import { api } from './api';
import { AssignableUsersResponse, Task, TaskFilters, CreateTaskInput } from '@/types';

export const taskService = {
  async getAll(filters: TaskFilters) {
    const params = new URLSearchParams();
    params.set('page', String(filters.page ?? 1));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);

    const { data } = await api.get(`/tasks?${params}`);
    return data as {
      tasks: Task[];
      total: number;
      page: number;
      totalPages: number;
      stats: {
        total: number;
        pending: number;
        completed: number;
      };
    };
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const { data } = await api.post('/tasks', input);
    return data as Task;
  },

  async update(id: string, input: Partial<CreateTaskInput>): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}`, input);
    return data as Task;
  },

  async getById(id: string): Promise<Task> {
    const { data } = await api.get(`/tasks/${id}`);
    return data as Task;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggle(id: string): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}/toggle`);
    return data as Task;
  },

  async togglePriority(id: string): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}/priority`);
    return data as Task;
  },
};