import { FastifyInstance } from 'fastify';
// import { googleCallback, handleGoogleAuth, checkAuth } from './controllers/auth.controller';
import {
  googleCallback,
  handleLogin,
  handleRefreshToken,
  handleSignup,
} from './controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/refreshToken', handleRefreshToken);
  fastify.get('/oauth/redirect', googleCallback);
  fastify.post('/login', handleLogin);
  fastify.post('/register', handleSignup);
  // fastify.get('/check', checkAuth);
}
