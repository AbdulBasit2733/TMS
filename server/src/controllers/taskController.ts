import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Prisma, TASK_STATUS } from '@prisma/client';
import { AssignTaskInput, CreateTaskData, SearchAssignableUsersQuery, UpdateTaskData, TaskWhereClause } from '../types/tasks.types';
import { firstQueryString, getParam } from '../helpers/tasks/task-helper';
import { assignTaskSchema, taskSchema } from '../validations/task.validations';

const taskInclude = {
  assignments: {
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  },
} as const;


export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pageRaw = firstQueryString(req.query.page);
    const limitRaw = firstQueryString(req.query.limit);
    const statusRaw = firstQueryString(req.query.status);
    const search = firstQueryString(req.query.search);

    const pageNumber = Math.max(1, parseInt(pageRaw ?? '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limitRaw ?? '10', 10)));
    const skip = (pageNumber - 1) * pageSize;

    const where: TaskWhereClause = {};

    if (statusRaw && Object.values(TASK_STATUS).includes(statusRaw as TASK_STATUS)) {
      where.status = statusRaw as TASK_STATUS;
    }
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' }, include: taskInclude }),
      prisma.task.count({ where }),
    ]);

    res.status(200).json({
      tasks,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const parsed = taskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid payload' });
      return;
    }

    const data: CreateTaskData = {
      title: parsed.data.title,
      userId,
      startDate: parsed.data.startDate ?? new Date(),
      endDate: parsed.data.endDate ?? new Date(),
      targetDate: parsed.data.targetDate ?? new Date(),
      description: parsed.data.description ?? null,
      ...(parsed.data.status !== undefined && { status: parsed.data.status }),
      ...(parsed.data.priority !== undefined && { priority: parsed.data.priority }),
    };

    const task = await prisma.task.create({ data, include: taskInclude });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = getParam(req, 'id');
    if (!id) {
      res.status(400).json({ error: 'Task id is required' });
      return;
    }

    const task = await prisma.task.findUnique({ where: { id }, include: taskInclude });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json(task);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req, 'id');
    if (!id) {
      res.status(400).json({ error: 'Task id is required' });
      return;
    }

    const parsed = taskSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid payload' });
      return;
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const data: UpdateTaskData = {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
      ...(parsed.data.status !== undefined && { status: parsed.data.status }),
      ...(parsed.data.priority !== undefined && { priority: parsed.data.priority }),
      ...(parsed.data.startDate !== undefined && { startDate: parsed.data.startDate }),
      ...(parsed.data.endDate !== undefined && { endDate: parsed.data.endDate }),
      ...(parsed.data.targetDate !== undefined && { targetDate: parsed.data.targetDate }),
    };

    const task = await prisma.task.update({ where: { id }, data, include: taskInclude });
    res.status(200).json(task);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req, 'id');
    if (!id) {
      res.status(400).json({ error: 'Task id is required' });
      return;
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await prisma.task.delete({ where: { id } });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req, 'id');
    if (!id) {
      res.status(400).json({ error: 'Task id is required' });
      return;
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const newStatus: TASK_STATUS = existing.status === TASK_STATUS.PENDING
      ? TASK_STATUS.COMPLETED
      : TASK_STATUS.PENDING;

    const task = await prisma.task.update({ where: { id }, data: { status: newStatus }, include: taskInclude });
    res.status(200).json(task);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignTaskToUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = getParam(req, 'id');
    if (!taskId) {
      res.status(400).json({ error: 'Task id is required' });
      return;
    }

    const parsed = assignTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid payload' });
      return;
    }

    const payload: AssignTaskInput = { userId: parsed.data.userId };

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const assignee = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!assignee) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await prisma.taskAssignment.create({
      data: {
        taskId,
        userId: payload.userId,
      },
    });

    const updatedTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: taskInclude,
    });

    res.status(201).json(updatedTask);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(409).json({ error: 'This user is already assigned to the task' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeTaskAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = getParam(req, 'id');
    const assignedUserId = getParam(req, 'userId');

    if (!taskId || !assignedUserId) {
      res.status(400).json({ error: 'Task id and user id are required' });
      return;
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const assignment = await prisma.taskAssignment.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId: assignedUserId,
        },
      },
    });

    if (!assignment) {
      res.status(404).json({ error: 'Task assignment not found' });
      return;
    }

    await prisma.taskAssignment.delete({
      where: {
        taskId_userId: {
          taskId,
          userId: assignedUserId,
        },
      },
    });

    const updatedTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: taskInclude,
    });

    res.status(200).json(updatedTask);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTaskAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = getParam(req, 'id');
    if (!taskId) {
      res.status(400).json({ error: 'Task id is required' });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: taskInclude,
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json({ taskId: task.id, assignments: task.assignments });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchAssignableUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = getParam(req, 'id');
    if (!taskId) {
      res.status(400).json({ error: 'Task id is required' });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignments: {
          select: { userId: true },
        },
      },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const search = firstQueryString(req.query.search)?.trim();
    const limitRaw = firstQueryString(req.query.limit);
    const parsedLimit = Number.parseInt(limitRaw ?? '10', 10);
    const limit = Math.min(50, Math.max(1, Number.isNaN(parsedLimit) ? 10 : parsedLimit));

    const query: SearchAssignableUsersQuery = { limit };
    if (search) {
      query.search = search;
    }
    const alreadyAssignedUserIds = task.assignments.map((assignment) => assignment.userId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: alreadyAssignedUserIds,
        },
        ...(query.search
          ? {
              email: {
                contains: query.search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
      },
      orderBy: {
        email: 'asc',
      },
      take: limit,
    });

    res.status(200).json({ taskId, users });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};
