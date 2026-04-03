import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthRequest } from "../middlewares/authMiddleware";
import { PRIORITY, TASK_STATUS } from "@prisma/client";
import {
  CreateTaskData,
  UpdateTaskData,
  TaskWhereClause,
} from "../types/tasks.types";
import { firstQueryString, getParam } from "../helpers/tasks/task-helper";
import { taskSchema } from "../validations/task.validations";

export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const pageRaw = firstQueryString(req.query.page);
    const limitRaw = firstQueryString(req.query.limit);
    const statusRaw = firstQueryString(req.query.status);
    const search = firstQueryString(req.query.search);

    const pageNumber = Math.max(1, parseInt(pageRaw ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limitRaw ?? "10", 10)));
    const skip = (pageNumber - 1) * pageSize;

    const filteredWhere: TaskWhereClause = { userId: userId };

    if (
      statusRaw &&
      Object.values(TASK_STATUS).includes(statusRaw as TASK_STATUS)
    ) {
      filteredWhere.status = statusRaw as TASK_STATUS;
    }
    if (search) {
      filteredWhere.title = { contains: search, mode: "insensitive" };
    }

    const globalWhere: TaskWhereClause = { userId: userId };

    const [tasks, total, globalTotal, globalPending, globalCompleted] =
      await prisma.$transaction([
        prisma.task.findMany({
          where: filteredWhere,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),

        prisma.task.count({ where: filteredWhere }),

        prisma.task.count({ where: globalWhere }),

        prisma.task.count({
          where: { ...globalWhere, status: TASK_STATUS.PENDING },
        }),
        prisma.task.count({
          where: { ...globalWhere, status: TASK_STATUS.COMPLETED },
        }),
      ]);

    res.status(200).json({
      tasks,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      stats: {
        total: globalTotal,
        pending: globalPending,
        completed: globalCompleted,
      },
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const parsed = taskSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" });
      return;
    }

    const data: CreateTaskData = {
      title: parsed.data.title,
      userId,
      startDate: parsed.data.startDate ?? null,
      endDate: parsed.data.endDate ?? null,
      targetDate: parsed.data.targetDate ?? null,
      description: parsed.data.description ?? null,
      ...(parsed.data.status !== undefined && { status: parsed.data.status }),
      ...(parsed.data.priority !== undefined && {
        priority: parsed.data.priority,
      }),
    };

    const task = await prisma.task.create({ data });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req, "id");
    if (!id) {
      res.status(400).json({ error: "Task id is required" });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id, userId: userId },
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req, "id");
    if (!id) {
      res.status(400).json({ error: "Task id is required" });
      return;
    }

    const parsed = taskSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" });
      return;
    }

    const existing = await prisma.task.findUnique({
      where: { id, userId: userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const data: UpdateTaskData = {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.description !== undefined && {
        description: parsed.data.description,
      }),
      ...(parsed.data.status !== undefined && { status: parsed.data.status }),
      ...(parsed.data.priority !== undefined && {
        priority: parsed.data.priority,
      }),
      ...(parsed.data.startDate !== undefined && {
        startDate: parsed.data.startDate,
      }),
      ...(parsed.data.endDate !== undefined && {
        endDate: parsed.data.endDate,
      }),
      ...(parsed.data.targetDate !== undefined && {
        targetDate: parsed.data.targetDate,
      }),
    };

    const task = await prisma.task.update({
      where: { id, userId: userId },
      data,
    });
    res.status(200).json(task);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req, "id");
    if (!id) {
      res.status(400).json({ error: "Task id is required" });
      return;
    }

    const existing = await prisma.task.findUnique({
      where: { id, userId: userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    await prisma.task.delete({ where: { id, userId: userId } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleTaskStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req, "id");
    if (!id) {
      res.status(400).json({ error: "Task id is required" });
      return;
    }

    const existing = await prisma.task.findUnique({
      where: { id, userId: userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const newStatus: TASK_STATUS =
      existing.status === TASK_STATUS.PENDING
        ? TASK_STATUS.COMPLETED
        : TASK_STATUS.PENDING;

    const task = await prisma.task.update({
      where: { id, userId: userId },
      data: { status: newStatus },
    });
    res.status(200).json(task);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const toggleTaskPriority = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req, "id");
    if (!id) {
      res.status(400).json({ error: "Task id is required" });
      return;
    }

    const existing = await prisma.task.findUnique({
      where: { id, userId: userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const newPriority: PRIORITY =
      existing.priority === PRIORITY.LOW
        ? PRIORITY.MEDIUM
        : existing.priority === PRIORITY.MEDIUM
        ? PRIORITY.HIGH
        : PRIORITY.LOW;

    const task = await prisma.task.update({
      where: { id, userId: userId },
      data: { priority: newPriority },
    });
    res.status(200).json(task);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
