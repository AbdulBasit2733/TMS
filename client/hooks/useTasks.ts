'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { taskService } from '@/services/taskService'
import { Task, TaskFilters, CreateTaskInput, TaskStatus, Priority } from '@/types'
import { toast } from 'sonner'

interface TasksState {
  tasks: Task[]
  total: number
  page: number
  totalPages: number,
  stats: { total: number; pending: number; completed: number }
}

export function useTasks(initialFilters?: Partial<TaskFilters>) {
  const [state, setState] = useState<TasksState>({
    tasks: [],
    total: 0,
    page: 1,
    totalPages: 1,
    stats: { total: 0, pending: 0, completed: 0 },
  })

  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    search: '',
    status: '',
    ...initialFilters,
  })

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await taskService.getAll(filters)
      setState({
        tasks: res.tasks,
        total: res.total,
        page: res.page,
        totalPages: res.totalPages,
        stats: res.stats,
      })
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const setSearch = useCallback((value: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: value, page: 1 }))
    }, 400)
  }, [])

  const setStatus = useCallback((value: TaskFilters['status']) => {
    setFilters((f) => ({ ...f, status: value, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters((f) => ({ ...f, page }))
  }, [])

  const patchLocal = (id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      const task = await taskService.create(input)
      toast.success('Task created')
      fetchTasks()
      return task
    },
    [fetchTasks]
  )

  const updateTask = useCallback(
    async (id: string, input: Partial<CreateTaskInput>) => {
      const task = await taskService.update(id, input)
      patchLocal(id, task)
      toast.success('Task updated')
      return task
    },
    []
  )

  const deleteTask = useCallback(
    async (id: string) => {
      await taskService.delete(id)
      toast.success('Task deleted')
      fetchTasks()
    },
    [fetchTasks]
  )

  const toggleTask = useCallback(async (id: string) => {
    const task = await taskService.toggle(id)
    patchLocal(id, { status: task.status })
    toast.success(task.status === 'COMPLETED' ? 'Marked as completed' : 'Marked as pending')
    return task
  }, [])


  const updateStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      patchLocal(id, { status })
      try {
        const task = await taskService.update(id, { status })
        patchLocal(id, { status: task.status })
        toast.success(`Status → ${status === 'COMPLETED' ? 'Completed' : 'Pending'}`)
      } catch {
        fetchTasks()
        toast.error('Failed to update status')
      }
    },
    [fetchTasks]
  )

  const updatePriority = useCallback(
    async (id: string, priority: Priority) => {
      patchLocal(id, { priority })
      try {
        const task = await taskService.togglePriority(id)
        patchLocal(id, { priority: task.priority })
        toast.success(`Priority → ${priority}`)
      } catch {
        fetchTasks() // rollback
        toast.error('Failed to update priority')
      }
    },
    [fetchTasks]
  )

  return {
    tasks: state.tasks,
    total: state.total,
    page: state.page,
    totalPages: state.totalPages,
    loading,
    filters,
    stats: state.stats,
    setSearch,
    setStatus,
    setPage,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    updateStatus,   
    updatePriority, 
  }
}