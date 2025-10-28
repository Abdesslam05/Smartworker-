import createError from 'http-errors';
import { Response, NextFunction } from 'express';
import Joi from 'joi';
import dayjs from 'dayjs';
import { ProjectModel } from '../models/Project';
import { AuthenticatedRequest } from '../middleware/auth';
import { geocodeAddress } from '../utils/location';

const projectSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  budget: Joi.number().min(0).required(),
  location: Joi.object({
    address: Joi.string().required(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
  }).required(),
  photos: Joi.array().items(Joi.string().uri()).default([]),
  preferredStartDate: Joi.date().optional(),
  preferredCompletionDate: Joi.date().optional(),
});

export const createProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }
    const { error, value } = projectSchema.validate(req.body, { abortEarly: false });
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(', '));
    }

    let coordinates = value.location;
    if (!coordinates.latitude || !coordinates.longitude) {
      const geocoded = await geocodeAddress(value.location.address);
      if (geocoded) {
        coordinates = { ...coordinates, latitude: geocoded.lat, longitude: geocoded.lng };
      }
    }

    const project = await ProjectModel.create({
      title: value.title,
      description: value.description,
      budget: value.budget,
      location: {
        address: value.location.address,
        coordinates: {
          type: 'Point',
          coordinates: [coordinates.longitude || 0, coordinates.latitude || 0],
        },
      },
      client: req.user._id,
      photos: value.photos,
      preferredStartDate: value.preferredStartDate ? dayjs(value.preferredStartDate).toDate() : undefined,
      preferredCompletionDate: value.preferredCompletionDate
        ? dayjs(value.preferredCompletionDate).toDate()
        : undefined,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const listProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const query: Record<string, unknown> = {};
    if (req.user?.role === 'client') {
      query.client = req.user._id;
    }
    if (req.user?.role === 'worker') {
      query.$or = [{ assignedWorker: null }, { assignedWorker: { $exists: false } }, { assignedWorker: req.user._id }];
    }
    const projects = await ProjectModel.find(query)
      .populate('client', 'name email phone')
      .populate('assignedWorker')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const assignWorker = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      throw createError(404, 'Project not found');
    }
    if (project.client?.toString() !== req.user._id?.toString() && req.user.role !== 'admin') {
      throw createError(403, 'Only the client or admin can assign a worker');
    }
    project.assignedWorker = req.body.workerId;
    project.status = 'in_progress';
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      throw createError(404, 'Project not found');
    }
    const isClient = project.client?.toString() === req.user._id?.toString();
    const isWorker = project.assignedWorker?.toString() === req.user._id?.toString();
    if (req.user.role !== 'admin' && !isClient && !isWorker) {
      throw createError(403, 'Not authorized to update project status');
    }
    project.status = req.body.status;
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};
