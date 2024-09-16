export const feedbackModuleTag = 'feedback';

export const openApiOptions = {
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'Heartbeat API',
      description: 'Heartbeat API Documentation',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io/specification/',
      description: 'Find more info here',
    },

    // servers: [
    //   { url: 'http://localhost:3000', description: 'Local' },
    //   { url: 'https://heartbeat-dev.mop.ba/', description: 'Development' },
    // ],
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      {
        name: feedbackModuleTag,
        description: 'These are the routes from the feedback module',
      },
    ],
  },
};

export const openApiUiOptions = {
  routePrefix: '/documentation',
  exposeRoute: true,
};
