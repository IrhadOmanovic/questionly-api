import axios from 'axios';
import querystring from 'querystring';
import prisma from '../../prisma/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { encrpyptPassword } from '../utils/auth.helper';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'heartbeat_jwt';
const WHITELISTED_EMAILS = process.env.WHITELISTED_EMAILS?.split(',') || [];

// export const handleGoogleAuth = async (
//   token: string | undefined,
// ): Promise<{ redirectUrl: string; authToken?: string } | null> => {
//   try {
//     if (token) {
//       try {
//         const decoded: any = jwt.verify(token, JWT_SECRET);
//         const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

//         if (user) {
//           const newAccessToken = await refreshAccessToken(user.googleRefreshToken);
//           return {
//             redirectUrl: `${process.env.WEB_APP_URL}`,
//             authToken: newAccessToken,
//           };
//         }
//       } catch (error) {
//         console.error('Error verifying token:', error);
//       }
//     }

//     const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&access_type=offline`;
//     return { redirectUrl: googleAuthUrl };
//   } catch (error) {
//     console.log('Error during authentication:', error);
//     return null;
//   }
// };

export const handleGoogleCallback = async (
  code: string,
): Promise<{
  redirectUrl?: string;
  authToken?: string;
  refreshToken?: string;
} | null> => {
  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const tokenRequestData = querystring.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      tokenRequestData,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    // We could also obtain refresh_token from this response but we dont need it for now
    // We wont persist neither of googles tokens since we wont be using google resources in our app
    const { access_token } = tokenResponse.data;

    const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const profile = profileResponse.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ googleId: profile.sub }, { email: profile.email }] },
    });

    const newUser = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleId: existingUser.googleId || profile.sub,
            username: existingUser.username || profile.name,
            email: existingUser.email || profile.email,
            image: existingUser.image || profile.picture,
            name: existingUser.name || profile.given_name,
            surname: existingUser.surname || profile.family_name,
          },
        })
      : await prisma.user.create({
          data: {
            googleId: profile.sub,
            username: profile.name,
            email: profile.email,
            image: profile.picture,
            name: profile.given_name,
            surname: profile.family_name,
          },
        });

    const user = newUser || existingUser!;

    const authToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    refreshToken &&
      (await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      }));

    return {
      authToken,
    };
  } catch (error) {
    console.log('Error during authentication:', error);
    return null;
  }
};

export const refreshAccessToken = async (
  refreshToken?: string,
): Promise<{ newAccessToken: string; newRefreshToken: string }> => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token not provided');
    }
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const newAccessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    newRefreshToken &&
      (await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      }));

    return { newAccessToken, newRefreshToken };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

export const findUserByEmailOrUsername = async ({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<User | null> => {
  try {
    const where = {} as UserWhere;
    if (email) {
      where.email = email;
    } else if (username) {
      where.username = username;
    } else {
      throw Error('Either username or email must be provided');
    }

    const user = await prisma.user.findUnique({ where });
    return user;
  } catch (error) {
    console.error('Error finding user by email or username:', error);
    throw error;
  }
};

export const signup = async ({
  username,
  password,
  name,
  surname,
  email,
}: {
  username: string;
  password: string;
  email: string;
  name: string;
  surname: string;
}): Promise<{ success: boolean } | null> => {
  try {
    const encyptedPassword = await encrpyptPassword(password);
    const existingUserEmail = await prisma.user.findUnique({ where: { email } });
    const existingUserUsername = await prisma.user.findUnique({ where: { username } });

    if (existingUserEmail) {
      throw new Error('Email already in use');
    }
    if (existingUserUsername) {
      throw new Error('Username already in use');
    }

    await prisma.user.create({
      data: {
        username,
        email,
        name,
        surname,
        password: encyptedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error during signup:', error);
    return null;
  }
};
