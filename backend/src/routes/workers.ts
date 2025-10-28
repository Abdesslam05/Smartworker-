import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middleware/auth';
import { getWorkers, getWorkerById, getMyProfile, upsertProfile, uploadPortfolioMedia } from '../controllers/worker.controller';

const upload = multer();

export const workerRouter = Router();

workerRouter.get('/', getWorkers);
workerRouter.get('/me', authenticate, authorize(['worker']), getMyProfile);
workerRouter.get('/:id', getWorkerById);
workerRouter.put('/me', authenticate, authorize(['worker']), upsertProfile);
workerRouter.post('/me/portfolio', authenticate, authorize(['worker']), upload.single('file'), uploadPortfolioMedia);
