import { FastifyRequest, FastifyReply } from 'fastify';
import * as ratingService from '../services/rating.service';
import { validateRatingData } from '../utils/rating.helper';

export const createRating = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = request.body as any;
    const validationError = validateRatingData(data);
    if (validationError) {
      reply.status(400).send({ error: validationError });
      return;
    }

    const newRating = await ratingService.createRating(data);
    reply.status(201).send(newRating);
  } catch (errorData) {
    console.log('Error creating rating', errorData);
    reply.status(500).send({ warning: 'Failed to create rating' });
  }
};

export const getRatingById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const ratingId = request.params.id;
    const rating = await ratingService.getRatingById(ratingId);
    if (!rating) {
      reply.status(404).send({ error: 'Rating not found' });
      return;
    }
    reply.status(200).send(rating);
  } catch (error) {
    console.log('Error getting rating', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const updateRating = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const validationError = validateRatingData(data);

    if (validationError) {
      reply.status(400).send({ error: validationError });
      return;
    }

    const rating = await ratingService.getRatingById(id);
    if (!rating) {
      reply.status(404).send({ error: 'Rating not found' });
      return;
    }

    const updatedRating = await ratingService.updateRating(id, data);
    reply.status(200).send(updatedRating);
  } catch (error) {
    console.log('Error updating rating', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const deleteRating = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const ratingId = request.params.id;

  try {
    const rating = await ratingService.getRatingById(ratingId);
    if (!rating) {
      reply.status(404).send({ error: 'Rating not found' });
      return;
    }
    const deltedRating = await ratingService.deleteRating(ratingId);

    reply.status(200).send(deltedRating);
  } catch (error) {
    console.log('Error deleting rating', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getAllRatings = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const filterParams = request.query as any;
  try {
    const ratings = await ratingService.getAllRatings(filterParams);

    reply.status(200).send(ratings);
  } catch (error) {
    console.log('Error fetching all ratings', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};
