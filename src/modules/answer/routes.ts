import { FastifyInstance } from 'fastify';
import * as answersController from './controllers/answer.controller';

const answerRoutes = (fastify: FastifyInstance, _options: any, done: () => void) => {
  fastify.post('/', answersController.createAnswer);
  fastify.get('/', answersController.getAllAnswers);
  fastify.get('/:id', answersController.getAnswerById);
  fastify.put('/:id', answersController.updateAnswer);
  fastify.delete('/:id', answersController.deleteAnswer);
  done();
};

export default answerRoutes;
