import { FastifyInstance } from 'fastify';
import * as questionController from './controllers/rating.controller';

const questionRoutes = (fastify: FastifyInstance, _options: any, done: () => void) => {
  fastify.post('/', questionController.createRating);
  fastify.get('/', questionController.getAllRatings);
  fastify.get('/:id', questionController.getRatingById);
  fastify.put('/:id', questionController.updateRating);
  fastify.delete('/:id', questionController.deleteRating);
  done();
};

export default questionRoutes;
