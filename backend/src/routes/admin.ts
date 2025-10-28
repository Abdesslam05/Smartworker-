import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { listUsers, listWorkerVerifications, dashboardStats } from '../controllers/admin.controller';

export const adminRouter = Router();

adminRouter.use(authenticate, authorize(['admin']));
adminRouter.get('/users', listUsers);
adminRouter.get('/workers', listWorkerVerifications);
adminRouter.get('/stats', dashboardStats);
