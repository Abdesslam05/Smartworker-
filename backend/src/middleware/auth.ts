import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { verifyAccessToken } from '../utils/jwt';
import { UserModel, IUser } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return next(createError(401, 'Authorization header missing'));
    }
    const [, token] = header.split(' ');
    if (!token) {
      return next(createError(401, 'Access token missing'));
    }
    const payload = verifyAccessToken(token);
    const user = await UserModel.findById(payload.sub);
    if (!user) {
      return next(createError(401, 'User not found'));
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(createError(401, 'Invalid or expired token'));
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError(401, 'Not authenticated'));
    }
    if (!roles.includes(req.user.role)) {
      return next(createError(403, 'Not authorized'));
    }
    return next();
  };
};
