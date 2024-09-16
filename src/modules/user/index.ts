import { FastifyInstance } from 'fastify';
import userRoutes from './routes';

const registerModuleRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // Register all routes from the module
  await fastify.register(userRoutes);

  return;
};

export default registerModuleRoutes;
