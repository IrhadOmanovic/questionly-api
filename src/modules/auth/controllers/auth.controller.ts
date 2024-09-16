import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/auth.service';
import prisma from '../../prisma/prisma';
import jwt from 'jsonwebtoken';
import { validateLoginData, validateUserData } from '../utils/auth.helper';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'heartbeat_jwt';

// export const handleGoogleAuth = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     const result = await authService.handleGoogleAuth(token);

//     if (result) {
//       reply.redirect(result.redirectUrl);
//     } else {
//       reply.status(500).send('An error occurred during authentication');
//     }
//   } catch (error) {
//     console.log('Error during authentication:', error);
//     reply.status(500).send(`An error occurred during authentication: ${error}`);
//   }
// };

export const googleCallback = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { code } = req.query as { code: string };
    if (!code) {
      reply.status(400).send('Missing code parameter');
      return;
    }

    const result = await authService.handleGoogleCallback(code);

    if (!result) {
      reply.status(500).send('An error occurred during authentication');
      return;
    }

    if (result.refreshToken) {
      reply.setCookie('refreshToken', result.refreshToken, {
        maxAge: 3600,
        path: '/',
      });
    }

    reply.status(200).send({ authToken: result.authToken });
  } catch (error) {
    console.log('Error during authentication:', error);
    reply.status(500).send(`An error occurred during authentication: ${error}`);
  }
};

// export const checkAuth = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
//   try {
//     let token: string | undefined;
//     const authCookie = req.cookies.authToken;
//     const authHeader = req.headers.authorization;

//     if (authCookie) {
//       token = authCookie;
//     } else if (authHeader && authHeader.startsWith('Bearer ')) {
//       token = authHeader.split(' ')[1];
//     }

//     if (token) {
//       const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
//       const userId = decoded.userId;

//       const user = await prisma.user.findUnique({
//         where: { id: userId },
//         select: {
//           name: true,
//           surname: true,
//           image: true,
//         },
//       });

//       if (user) {
//         reply.status(200).send({
//           authenticated: true,
//           userProfile: {
//             name: user.name,
//             surname: user.surname,
//             image: user.image,
//           },
//         });
//       } else {
//         reply.status(401).send({ authenticated: false });
//       }
//     } else {
//       reply.status(401).send({ authenticated: false });
//     }
//   } catch (error) {
//     console.error('Error during authentication check:', error);
//     reply.status(500).send({ authenticated: false });
//   }
// };

export const handleRefreshToken = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const result = await authService.refreshAccessToken(refreshToken);
    if (result.newRefreshToken) {
      reply.setCookie('refreshToken', result.newRefreshToken, {
        maxAge: 3600,
        path: '/',
      });
    }

    reply.status(200).send({ newAccessToken: result.newAccessToken });
  } catch (error) {
    console.error('Error during refresh token:', error);
    reply.status(401).send({ error: 'Unauthorized' });
  }
};

export const handleLogin = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { username, password, email } = req.body as {
      username?: string;
      password: string;
      email?: string;
    };

    const errorValidationMessage = validateLoginData({ username, password, email });
    if (errorValidationMessage) {
      reply.status(400).send({ error: errorValidationMessage });
      return;
    }

    const currentUser = await authService.findUserByEmailOrUsername({ username, email });

    if (!currentUser) {
      reply.status(400).send({ error: 'User not found' });
      return;
    }

    if (!currentUser.password) {
      reply.status(400).send({ error: 'Password not set' });
      return;
    }

    const isMatching = await bcrypt.compare(password, currentUser.password);

    if (isMatching) {
      const authToken = jwt.sign({ userId: currentUser.id }, JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId: currentUser.id }, JWT_SECRET, { expiresIn: '1h' });
      reply.setCookie('refreshToken', refreshToken, {
        maxAge: 3600,
        path: '/',
      });
      reply.status(200).send({ authToken });
    } else {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }
  } catch (error) {
    console.error('Error during login:');
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const handleSignup = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { username, password, email, name, surname } = req.body as {
      username: string;
      password: string;
      email: string;
      name: string;
      surname: string;
    };

    const errorMessage = validateUserData({ username, email, name, surname });

    if (errorMessage) {
      reply.status(400).send({ error: errorMessage });
      return;
    }

    const result = await authService.signup({ username, password, email, name, surname });
    if (!result) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    } else {
      reply.status(200).send({ success: result.success });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};
