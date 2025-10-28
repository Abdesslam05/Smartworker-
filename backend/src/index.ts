import http from 'http';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import { Server } from 'socket.io';
import createError from 'http-errors';

import { env } from './config/env';
import { connectDatabase } from './config/database';
import { registerSocketHandlers } from './sockets/chat';
import { router as apiRouter } from './routes';
import { swaggerRouter } from './routes/swagger';

const app: Application = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xssClean());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'smartworker-connect-api' });
});

app.use('/api', apiRouter);
app.use('/docs', swaggerRouter);

app.use((_req, _res, next) => {
  next(createError(404, 'Route not found'));
});

app.use((err: createError.HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    status,
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientOrigin,
  },
});

registerSocketHandlers(io);

const start = async () => {
  await connectDatabase();
  server.listen(env.port, () => {
    console.log(`SmartWorker Connect API running on port ${env.port}`);
  });
};

void start();
