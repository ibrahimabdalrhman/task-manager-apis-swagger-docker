import { Project } from '../models';
import { AuthUser } from '../types/express';
import { AppError } from '../utils/AppError';
import { buildPaginatedResult, PaginationParams } from '../utils/pagination';

export interface CreateProjectInput {
  title: string;
  description?: string | null;
  status?: 'active' | 'completed' | 'archived';
}

export interface UpdateProjectInput {
  title?: string;
  description?: string | null;
  status?: 'active' | 'completed' | 'archived';
}

export interface ProjectListFilters {
  status?: 'active' | 'completed' | 'archived';
}

function buildOwnershipWhere(user: AuthUser): Record<string, unknown> {
  if (user.role === 'admin') {
    return {};
  }
  return { userId: user.id };
}

export async function createProject(user: AuthUser, input: CreateProjectInput) {
  const project = await Project.create({
    ...input,
    userId: user.id,
  });

  return project;
}

export async function getAllProjects(
  user: AuthUser,
  pagination: PaginationParams,
  filters: ProjectListFilters = {}
) {
  const where: Record<string, unknown> = {
    ...buildOwnershipWhere(user),
  };

  if (filters.status) {
    where.status = filters.status;
  }

  const allowedSortFields = ['title', 'status', 'createdAt', 'updatedAt'];
  const sortBy = allowedSortFields.includes(pagination.sortBy)
    ? pagination.sortBy
    : 'createdAt';

  const offset = (pagination.page - 1) * pagination.limit;

  const { rows, count } = await Project.findAndCountAll({
    where,
    limit: pagination.limit,
    offset,
    order: [[sortBy, pagination.sortOrder]],
  });

  return buildPaginatedResult(rows, count, pagination.page, pagination.limit);
}

export async function getProjectById(user: AuthUser, projectId: string) {
  const where: Record<string, unknown> = {
    id: projectId,
    ...buildOwnershipWhere(user),
  };

  const project = await Project.findOne({ where });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  return project;
}

export async function updateProject(
  user: AuthUser,
  projectId: string,
  input: UpdateProjectInput
) {
  const project = await getProjectById(user, projectId);
  await project.update(input);
  return project;
}

export async function deleteProject(user: AuthUser, projectId: string) {
  const project = await getProjectById(user, projectId);
  await project.destroy();
}

export async function assertProjectAccess(user: AuthUser, projectId: string) {
  const where: Record<string, unknown> = {
    id: projectId,
    ...buildOwnershipWhere(user),
  };

  const project = await Project.findOne({ where });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  return project;
}
