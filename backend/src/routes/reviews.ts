import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createReview, listWorkerReviews } from '../controllers/review.controller';

export const reviewRouter = Router();

reviewRouter.post('/', authenticate, createReview);
reviewRouter.get('/worker/:workerId', listWorkerReviews);
