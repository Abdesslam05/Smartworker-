import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createProject, listProjects, assignWorker, updateStatus } from '../controllers/project.controller';

export const projectRouter = Router();

projectRouter.use(authenticate);
projectRouter.post('/', createProject);
projectRouter.get('/', listProjects);
projectRouter.patch('/:id/assign', assignWorker);
projectRouter.patch('/:id/status', updateStatus);
