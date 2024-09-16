import { FastifyRequest, FastifyReply } from 'fastify';
import * as answerService from '../services/answer.service';
import { validateAnswereData } from '../utils/question.helper';

export const createAnswer = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = request.body as any;
    const validationError = validateAnswereData(data);
    if (validationError) {
      reply.status(400).send({ error: validationError });
      return;
    }
    const newAnswer = await answerService.createAnswer(data);

    reply.status(201).send(newAnswer);
  } catch (errorData) {
    console.log('Error creating answer', errorData);
    reply.status(500).send({ warning: 'Failed to create answer' });
  }
};

export const getAnswerById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const answerId = request.params.id;
    const answer = await answerService.getAnswerById(answerId);
    if (!answer) {
      reply.status(404).send({ error: 'Answer not found' });
      return;
    }
    reply.status(200).send(answer);
  } catch (error) {
    console.log('Error getting answer', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const updateAnswer = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const validationError = validateAnswereData(data);

    if (validationError) {
      reply.status(400).send({ error: validationError });
      return;
    }

    const answer = await answerService.getAnswerById(id);
    if (!answer) {
      reply.status(404).send({ error: 'Answer not found' });
      return;
    }

    const updatedAnswer = await answerService.updateAnswer(id, data);
    reply.status(200).send(updatedAnswer);
  } catch (error) {
    console.log('Error updating answer', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const deleteAnswer = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const answerId = request.params.id;

  try {
    const answer = await answerService.getAnswerById(answerId);
    if (!answer) {
      reply.status(404).send({ error: 'Answer not found' });
      return;
    }

    const deletedAnswer = await answerService.deleteAnswer(answerId);

    reply.status(200).send(deletedAnswer);
  } catch (error) {
    console.log('Error deleting answer', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getAllAnswers = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const filterParams = request.query as any;
  try {
    const answers = await answerService.getAllAnswers(filterParams);

    reply.status(200).send(answers);
  } catch (error) {
    console.log('Error fetching all answers', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};
