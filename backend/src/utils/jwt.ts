import jwt, { JwtPayload as JwtPayloadBase, Secret, SignOptions } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { IUser } from '../models/User';

export interface JwtPayload extends JwtPayloadBase {
  sub: string;
  role: string;
}

const getUserId = (user: IUser) => {
  const id = user._id instanceof mongoose.Types.ObjectId ? user._id.toString() : String(user._id);
  return id;
};

const accessOptions: SignOptions = {
  expiresIn: env.jwtExpiresIn as unknown as SignOptions['expiresIn'],
};
const refreshOptions: SignOptions = {
  expiresIn: env.refreshTokenExpiresIn as unknown as SignOptions['expiresIn'],
};

export const signAccessToken = (user: IUser): string => {
  const payload: JwtPayload = { sub: getUserId(user), role: user.role };
  return jwt.sign(payload, env.jwtSecret as Secret, accessOptions);
};

export const signRefreshToken = (user: IUser): string => {
  const payload: JwtPayload = { sub: getUserId(user), role: user.role };
  return jwt.sign(payload, env.refreshTokenSecret as Secret, refreshOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret as Secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.refreshTokenSecret as Secret) as JwtPayload;
};
