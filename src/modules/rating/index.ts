import { FastifyInstance } from 'fastify';
import questionRoutes from './routes';

const registerModuleRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // Register all routes from the module
  await fastify.register(questionRoutes);

  return;
};

export default registerModuleRoutes;
