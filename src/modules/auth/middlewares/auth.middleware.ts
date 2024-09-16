import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../utils/auth.helper';

const JWT_SECRET = process.env.JWT_SECRET || 'heartbeat_jwt';

export const authMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    let token =
      req.cookies.authToken ||
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : undefined);

    if (!token) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const isValid = await verifyToken(token);

    if (!isValid) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = decoded;
  } catch (error) {
    console.log('Error verifying token:', error);
    return reply.status(401).send({ error: 'Unauthorized' });
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};
