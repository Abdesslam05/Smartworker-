import { Router } from 'express';

import { authRouter } from './auth';
import { projectRouter } from './projects';
import { workerRouter } from './workers';
import { matchRouter } from './match';
import { adminRouter } from './admin';
import { messageRouter } from './messages';
import { reviewRouter } from './reviews';

export const router = Router();

router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/workers', workerRouter);
router.use('/match', matchRouter);
router.use('/admin', adminRouter);
router.use('/messages', messageRouter);
router.use('/reviews', reviewRouter);
