import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerDefinition, swaggerApis } from '../docs/swagger';

const specs = swaggerJsdoc({ definition: swaggerDefinition, apis: swaggerApis });

export const swaggerRouter = Router();

swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(specs));
