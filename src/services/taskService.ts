import { Task } from '../models';
import { AuthUser } from '../types/express';
import { AppError } from '../utils/AppError';
import { buildPaginatedResult, PaginationParams } from '../utils/pagination';
import { assertProjectAccess } from './projectService';

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
}

export interface TaskListFilters {
  status?: 'pending' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
}

export async function createTask(
  user: AuthUser,
  projectId: string,
  input: CreateTaskInput
) {
  await assertProjectAccess(user, projectId);

  const task = await Task.create({
    ...input,
    projectId,
  });

  return task;
}

export async function getTasksByProject(
  user: AuthUser,
  projectId: string,
  pagination: PaginationParams,
  filters: TaskListFilters = {}
) {
  await assertProjectAccess(user, projectId);

  const where: Record<string, unknown> = { projectId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  const allowedSortFields = [
    'title',
    'status',
    'priority',
    'dueDate',
    'createdAt',
    'updatedAt',
  ];
  const sortBy = allowedSortFields.includes(pagination.sortBy)
    ? pagination.sortBy
    : 'createdAt';

  const offset = (pagination.page - 1) * pagination.limit;

  const { rows, count } = await Task.findAndCountAll({
    where,
    limit: pagination.limit,
    offset,
    order: [[sortBy, pagination.sortOrder]],
  });

  return buildPaginatedResult(rows, count, pagination.page, pagination.limit);
}

export async function getTaskById(user: AuthUser, projectId: string, taskId: string) {
  await assertProjectAccess(user, projectId);

  const task = await Task.findOne({
    where: { id: taskId, projectId },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
}

export async function updateTask(
  user: AuthUser,
  projectId: string,
  taskId: string,
  input: UpdateTaskInput
) {
  const task = await getTaskById(user, projectId, taskId);
  await task.update(input);
  return task;
}

export async function deleteTask(user: AuthUser, projectId: string, taskId: string) {
  const task = await getTaskById(user, projectId, taskId);
  await task.destroy();
}
