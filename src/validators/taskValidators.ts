import { z } from 'zod';

const taskStatusEnum = z.enum(['pending', 'in_progress', 'done']);
const taskPriorityEnum = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional().nullable(),
  status: taskStatusEnum.optional().default('pending'),
  priority: taskPriorityEnum.optional().default('medium'),
  dueDate: z.coerce.date().optional().nullable(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional().nullable(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    dueDate: z.coerce.date().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const taskIdParamSchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
});

export const projectTaskParamsSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
});

export const projectTaskIdParamsSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  taskId: z.string().uuid('Invalid task ID'),
});

export const taskListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(['title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
});
