import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { MessageModel } from '../models/Message';
import { AuthenticatedRequest } from '../middleware/auth';

const sendSchema = Joi.object({
  chatId: Joi.string().required(),
  recipientId: Joi.string().required(),
  content: Joi.string().max(2000).required(),
  projectId: Joi.string().optional(),
});

export const listMessages = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }
    const messages = await MessageModel.find({ chatId: req.params.chatId })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('sender', 'name role')
      .populate('recipient', 'name role');
    res.json(messages.reverse());
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }
    const { error, value } = sendSchema.validate(req.body);
    if (error) {
      throw createError(400, error.details.map((d) => d.message).join(', '));
    }

    const message = await MessageModel.create({
      chatId: value.chatId,
      sender: req.user._id,
      recipient: value.recipientId,
      content: value.content,
      project: value.projectId,
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
