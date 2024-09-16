import { FastifyInstance } from 'fastify';
import * as userController from './controllers/user.controller';

const employeeRoutes = (fastify: FastifyInstance, _options: any, done: () => void) => {
  fastify.post('/', userController.createUser);
  fastify.get('/', userController.getAllUsers);
  fastify.get('/:id', userController.getUserById);
  fastify.put('/:id', userController.updateUser);
  fastify.delete('/:id', userController.deleteUser);
  done();
};

export default employeeRoutes;
