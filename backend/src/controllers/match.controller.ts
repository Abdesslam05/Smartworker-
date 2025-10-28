import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { WorkerProfileModel } from '../models/WorkerProfile';
import { ProjectModel } from '../models/Project';
import { rankWorkers } from '../utils/matching';

const matchSchema = Joi.object({
  projectId: Joi.string().optional(),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).optional(),
  specialization: Joi.array().items(Joi.string()).optional(),
});

export const matchWorkers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = matchSchema.validate(req.body);
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(', '));
    }

    let location = value.location;
    let budget: number | undefined;

    if (value.projectId) {
      const project = await ProjectModel.findById(value.projectId);
      if (!project) {
        throw createError(404, 'Project not found');
      }
      budget = project.budget;
      location = {
        lat: project.location.coordinates.coordinates[1],
        lng: project.location.coordinates.coordinates[0],
      };
    }

    const filter: Record<string, unknown> = {};
    if (value.specialization) {
      filter.specialization = { $in: value.specialization };
    }

    const workers = await WorkerProfileModel.find(filter).populate('user');
    const ranked = rankWorkers(workers as any, {
      projectBudget: budget,
      projectLocation: location,
    });
    res.json(ranked);
  } catch (error) {
    next(error);
  }
};
