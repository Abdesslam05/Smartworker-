import { Server } from 'socket.io';
import { MessageModel } from '../models/Message';
import { verifyAccessToken } from '../utils/jwt';

interface ServerToClientEvents {
  'chat:message': (payload: { chatId: string; message: string; senderId: string; createdAt: string }) => void;
}

interface ClientToServerEvents {
  'chat:join': (payload: { chatId: string }) => void;
  'chat:message': (payload: { chatId: string; content: string }) => void;
}

export const registerSocketHandlers = (io: Server<ClientToServerEvents, ServerToClientEvents>) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication token missing'));
      }
      verifyAccessToken(token);
      return next();
    } catch (error) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('chat:join', ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on('chat:message', async ({ chatId, content }) => {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return;
      }
      const payload = verifyAccessToken(token);
      const message = await MessageModel.create({
        chatId,
        sender: payload.sub,
        recipient: payload.sub,
        content,
      });

      io.to(chatId).emit('chat:message', {
        chatId,
        message: content,
        senderId: payload.sub,
        createdAt: message.createdAt.toISOString(),
      });
    });
  });
};
