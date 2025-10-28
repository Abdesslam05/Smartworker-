import createError from 'http-errors';
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { geocodeAddress } from '../utils/location';

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('client', 'worker').required(),
  location: Joi.object({
    address: Joi.string().required(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
  }).required(),
  languages: Joi.array().items(Joi.string()).default([]),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(', '));
    }

    const existing = await UserModel.findOne({ email: value.email });
    if (existing) {
      throw createError(409, 'Email already registered');
    }

    const passwordHash = await hashPassword(value.password);
    let coordinates = value.location;

    if (!value.location.latitude || !value.location.longitude) {
      const geocoded = await geocodeAddress(value.location.address);
      if (geocoded) {
        coordinates = { ...value.location, latitude: geocoded.lat, longitude: geocoded.lng };
      }
    }

    const user = await UserModel.create({
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: passwordHash,
      role: value.role,
      languages: value.languages,
      location: {
        address: value.location.address,
        coordinates: {
          type: 'Point',
          coordinates: [coordinates.longitude || 0, coordinates.latitude || 0],
        },
      },
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(', '));
    }

    const user = await UserModel.findOne({ email: value.email });
    if (!user) {
      throw createError(401, 'Invalid credentials');
    }

    const match = await comparePassword(value.password, user.password);
    if (!match) {
      throw createError(401, 'Invalid credentials');
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({ user, accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};
