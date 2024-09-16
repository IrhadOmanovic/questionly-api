import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../services/user.service';
import { validateUserData } from '../utils/user.helper';

type Query = any;

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = request.body as any;
    const errorData = validateUserData(data);
    if (errorData) {
      reply.status(400).send({ error: errorData });
      return;
    }
    const newUser = await userService.createUser(data);

    reply.status(201).send(newUser);
  } catch (errorData) {
    console.log('Error creating user', errorData);
    reply.status(500).send({ warning: 'Failed to create user' });
  }
};

export const getUserByEmail = async (
  request: FastifyRequest<{ Params: { email: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const userEmail = request.params.email;
    const user = await userService.getUserByEmail(userEmail);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }
    reply.status(200).send(user);
  } catch (error) {
    console.log('Error getting user', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const userId = request.params.id;
    const user = await userService.getUserById(userId);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }
    reply.status(200).send(user);
  } catch (error) {
    console.log('Error getting user', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const errorData = validateUserData(data);
    if (errorData) {
      reply.status(400).send({ error: errorData });
      return;
    }

    const user = await userService.getUserById(id);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }

    const updatedUser = await userService.updateUser(id, data);

    reply.status(200).send(updatedUser);
  } catch (error) {
    console.log('Error updating user', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const employeeId = request.params.id;

  try {
    const user = await userService.getUserById(employeeId);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }
    const deletedUser = await userService.deleteUser(employeeId);

    reply.status(200).send(deletedUser);
  } catch (error) {
    console.log('Error deleting user', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const filterParams = request.query as any;
  try {
    const users = await userService.getAllUsers(filterParams);

    reply.status(200).send(users);
  } catch (error) {
    console.log('Error fetching all users', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};
