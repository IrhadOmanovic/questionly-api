import { FastifyRequest, FastifyReply } from 'fastify';
import * as questionService from '../services/question.service';
import { validateQuestioneData } from '../utils/question.helper';

export const createQuestion = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = request.body as any;
    const validationError = validateQuestioneData(data);
    if (validationError) {
      reply.status(400).send({ error: validationError });
      return;
    }
    const newQuestion = await questionService.createQuestion(data);
    reply.status(201).send(newQuestion);
  } catch (errorData) {
    console.log('Error creating question', errorData);
    reply.status(500).send({ warning: 'Failed to create question' });
  }
};

export const getQuestionById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const questionId = request.params.id;
    const question = await questionService.getQuestionById(questionId);
    if (!question) {
      reply.status(404).send({ error: 'Question not found' });
      return;
    }
    reply.status(200).send(question);
  } catch (error) {
    console.log('Error getting question', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const updateQuestion = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const validationError = validateQuestioneData(data);
    if (validationError) {
      reply.status(400).send({ error: validationError });
      return;
    }

    const question = await questionService.getQuestionById(id);
    if (!question) {
      reply.status(404).send({ error: 'Question not found' });
      return;
    }

    const updatedQuestion = await questionService.updateQuestion(id, data);
    reply.status(200).send(updatedQuestion);
  } catch (error) {
    console.log('Error updating question', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const deleteQuestion = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const questionId = request.params.id;

  try {
    const question = await questionService.getQuestionById(questionId);
    if (!question) {
      reply.status(404).send({ error: 'Question not found' });
      return;
    }
    const deletedQuestion = await questionService.deleteQuestion(questionId);

    reply.status(200).send(deletedQuestion);
  } catch (error) {
    console.log('Error deleting question', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getAllQuestions = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const filterParams = request.query as any;
  try {
    const questions = await questionService.getAllQuestions(filterParams);

    reply.status(200).send(questions);
  } catch (error) {
    console.log('Error fetching all questions', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};
