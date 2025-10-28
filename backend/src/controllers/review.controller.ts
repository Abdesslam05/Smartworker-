import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ReviewModel } from '../models/Review';
import { ProjectModel } from '../models/Project';
import { WorkerProfileModel } from '../models/WorkerProfile';
import { AuthenticatedRequest } from '../middleware/auth';

const reviewSchema = Joi.object({
  projectId: Joi.string().required(),
  workerId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('').max(2000),
});

export const createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }
    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(', '));
    }

    const project = await ProjectModel.findById(value.projectId);
    if (!project) {
      throw createError(404, 'Project not found');
    }
    if (project.client?.toString() !== req.user._id?.toString()) {
      throw createError(403, 'Only the project client can submit a review');
    }

    const review = await ReviewModel.create({
      project: project._id,
      client: req.user._id,
      worker: value.workerId,
      rating: value.rating,
      comment: value.comment,
    });

    const worker = await WorkerProfileModel.findById(value.workerId);
    if (worker) {
      const aggregation = await ReviewModel.aggregate([
        { $match: { worker: worker._id } },
        {
          $group: {
            _id: '$worker',
            avgRating: { $avg: '$rating' },
            count: { $sum: 1 },
          },
        },
      ]);

      const stats = aggregation[0];
      worker.ratingAverage = stats?.avgRating || 0;
      worker.ratingCount = stats?.count || 0;
      await worker.save();
    }

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const listWorkerReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await ReviewModel.find({ worker: req.params.workerId })
      .sort({ createdAt: -1 })
      .populate('client', 'name')
      .populate('project', 'title');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
