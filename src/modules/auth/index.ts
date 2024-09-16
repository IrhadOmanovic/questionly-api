import { FastifyInstance } from 'fastify';
import authRoutes from './routes';

const authModuleRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(authRoutes);

  return;
};

export default authModuleRoutes;
