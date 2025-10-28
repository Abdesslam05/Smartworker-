import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import createError from 'http-errors';

export const validateBody = (schema: ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
    if (error) {
      return next(createError(400, error.details.map((d) => d.message).join(', ')));
    }
    req.body = value;
    return next();
  };
};
