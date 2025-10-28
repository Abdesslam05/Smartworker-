import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { WorkerProfileModel } from '../models/WorkerProfile';
import { AuthenticatedRequest } from '../middleware/auth';
import { uploadBufferToS3 } from '../utils/storage';

const profileSchema = Joi.object({
  specialization: Joi.array().items(Joi.string()).min(1).required(),
  experienceYears: Joi.number().min(0).required(),
  certifications: Joi.array().items(Joi.string()).default([]),
  hourlyRate: Joi.number().optional(),
  availabilityStatus: Joi.string().valid('available', 'busy', 'on_leave').default('available'),
  bio: Joi.string().max(2000).allow(''),
});

export const getWorkers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const workers = await WorkerProfileModel.find()
      .populate('user', '-password')
      .sort({ ratingAverage: -1 })
      .limit(50);
    res.json(workers);
  } catch (error) {
    next(error);
  }
};

export const getWorkerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const worker = await WorkerProfileModel.findById(req.params.id).populate('user', '-password');
    if (!worker) {
      throw createError(404, 'Worker not found');
    }
    res.json(worker);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }
    const profile = await WorkerProfileModel.findOne({ user: req.user._id }).populate('user', '-password');
    if (!profile) {
      throw createError(404, 'Profile not found');
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const upsertProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }

    const { error, value } = profileSchema.validate(req.body, { abortEarly: false });
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(', '));
    }

    const profile = await WorkerProfileModel.findOneAndUpdate(
      { user: req.user._id },
      { ...value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('user', '-password');

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const uploadPortfolioMedia = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      throw createError(400, 'File missing');
    }

    const key = `portfolio/${req.user._id}/${Date.now()}-${file.originalname}`;
    const url = await uploadBufferToS3(key, file.buffer, file.mimetype);

    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
};
