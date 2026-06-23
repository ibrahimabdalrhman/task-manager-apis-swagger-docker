import { NextFunction, Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { AppError } from '../utils/AppError';
import { getParam } from '../utils/params';
import { parsePaginationQuery } from '../utils/pagination';

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const task = await taskService.createTask(req.user, getParam(req.params.projectId), req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function getTasksByProject(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const query = (req.validated?.query ?? req.query) as Record<string, unknown>;
    const pagination = parsePaginationQuery(query);
    const filters: taskService.TaskListFilters = {
      status: query.status as taskService.TaskListFilters['status'],
      priority: query.priority as taskService.TaskListFilters['priority'],
    };

    const result = await taskService.getTasksByProject(
      req.user,
      getParam(req.params.projectId),
      pagination,
      filters
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const task = await taskService.getTaskById(
      req.user,
      getParam(req.params.projectId),
      getParam(req.params.taskId)
    );
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const task = await taskService.updateTask(
      req.user,
      getParam(req.params.projectId),
      getParam(req.params.taskId),
      req.body
    );
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    await taskService.deleteTask(
      req.user,
      getParam(req.params.projectId),
      getParam(req.params.taskId)
    );
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}
