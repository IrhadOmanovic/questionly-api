import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { feedbackModuleTag } from '../openApi';

const rootRoutes = (fastify: FastifyInstance, _options: any, done: () => void) => {
  fastify.get(
    '/healthcheck',
    {
      schema: {
        description: 'Health check route',
        tags: [feedbackModuleTag],
        summary: 'Health check',
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              status: { type: 'string' },
              uptime: { type: 'number' },
              timestamp: { type: 'number' },
            },
          },
        },
      },
    },
    async (_req: FastifyRequest, reply: FastifyReply) => {
      const response = {
        status: 'OK',
        uptime: process.uptime(),
        timestamp: Date.now(),
      };

      return reply.status(200).send(response);
    },
  );

  done();
};

export default rootRoutes;
