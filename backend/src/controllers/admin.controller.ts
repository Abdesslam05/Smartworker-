import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';
import { WorkerProfileModel } from '../models/WorkerProfile';
import { ProjectModel } from '../models/Project';

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const listWorkerVerifications = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const workers = await WorkerProfileModel.find().populate('user', '-password');
    res.json(workers);
  } catch (error) {
    next(error);
  }
};

export const dashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [users, workers, projects] = await Promise.all([
      UserModel.countDocuments(),
      WorkerProfileModel.countDocuments(),
      ProjectModel.countDocuments(),
    ]);
    res.json({ users, workers, projects });
  } catch (error) {
    next(error);
  }
};
