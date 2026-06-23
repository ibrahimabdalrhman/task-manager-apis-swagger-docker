import { z } from 'zod';

const projectStatusEnum = z.enum(['active', 'completed', 'archived']);

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional().nullable(),
  status: projectStatusEnum.optional().default('active'),
});

export const updateProjectSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional().nullable(),
    status: projectStatusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const projectIdParamSchema = z.object({
  id: z.string().uuid('Invalid project ID'),
});

export const projectListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(['title', 'status', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
  status: projectStatusEnum.optional(),
});
