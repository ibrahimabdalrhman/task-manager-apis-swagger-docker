import { NextFunction, Request, Response } from 'express';
import * as projectService from '../services/projectService';
import { AppError } from '../utils/AppError';
import { getParam } from '../utils/params';
import { parsePaginationQuery } from '../utils/pagination';

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const project = await projectService.createProject(req.user, req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function getAllProjects(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const query = (req.validated?.query ?? req.query) as Record<string, unknown>;
    const pagination = parsePaginationQuery(query);
    const filters = { status: query.status as projectService.ProjectListFilters['status'] };

    const result = await projectService.getAllProjects(req.user, pagination, filters);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const project = await projectService.getProjectById(req.user, getParam(req.params.id));
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const project = await projectService.updateProject(req.user, getParam(req.params.id), req.body);
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    await projectService.deleteProject(req.user, getParam(req.params.id));
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
}
