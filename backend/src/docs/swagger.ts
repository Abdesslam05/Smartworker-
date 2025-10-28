export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SmartWorker Connect API',
    version: '1.0.0',
    description:
      'REST API for SmartWorker Connect connecting clients with smart-home and electrical professionals.',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local development server',
    },
  ],
};

export const swaggerApis = ['src/routes/*.ts', 'src/controllers/*.ts', 'src/models/*.ts'];
