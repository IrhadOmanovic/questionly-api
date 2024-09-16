import { FastifyInstance } from 'fastify';
import answersRoutes from './routes';

const registerModuleRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // Register all routes from the module
  await fastify.register(answersRoutes);

  return;
};

export default registerModuleRoutes;
