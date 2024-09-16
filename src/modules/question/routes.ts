import { FastifyInstance } from 'fastify';
import * as questionController from './controllers/question.controller';

const questionRoutes = (fastify: FastifyInstance, _options: any, done: () => void) => {
  fastify.post('/', questionController.createQuestion);
  fastify.get('/', questionController.getAllQuestions);
  fastify.get('/:id', questionController.getQuestionById);
  fastify.put('/:id', questionController.updateQuestion);
  fastify.delete('/:id', questionController.deleteQuestion);
  done();
};

export default questionRoutes;
