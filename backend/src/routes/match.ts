import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { matchWorkers } from '../controllers/match.controller';

export const matchRouter = Router();

matchRouter.post('/', authenticate, matchWorkers);
