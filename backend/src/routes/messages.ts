import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { listMessages, sendMessage } from '../controllers/message.controller';

export const messageRouter = Router();

messageRouter.use(authenticate);
messageRouter.get('/:chatId', listMessages);
messageRouter.post('/', sendMessage);
