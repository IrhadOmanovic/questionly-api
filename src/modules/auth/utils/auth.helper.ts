import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

export const validateUserData = (userData: Partial<User>): string | null => {
  if (
    !userData.email ||
    typeof userData.email !== 'string' ||
    userData.email?.toLowerCase()?.match(emailRegex) === null
  ) {
    return 'Email is required. It must be a string and have an appropriate format';
  }

  if (!userData.name || typeof userData.name !== 'string') {
    return 'Name is required and must be a string';
  }

  if (!userData.surname || typeof userData.surname !== 'string') {
    return 'Surname is required and must be a string';
  }

  if (
    userData.phone &&
    (typeof userData.phone !== 'string' || userData.phone?.match(phoneRegex) === null)
  ) {
    return 'Phone is required and must be a string of digits';
  }

  return null;
};

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const phoneRegex = /^[0-9]{1,10}$/;

export const encrpyptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validateLoginData = (userData: {
  email?: string;
  password: string;
  username?: string;
}): string | null => {
  if (!userData.username && !userData.email) {
    return 'Username or email is required';
  }
  if (
    userData.email &&
    (typeof userData.email !== 'string' ||
      userData.email?.toLowerCase()?.match(emailRegex) === null)
  ) {
    return 'Email must be a string and have an appropriate format';
  }

  if (!userData.username && typeof userData.username !== 'string') {
    return 'Username must be a string';
  }

  if (!userData.password || typeof userData.password !== 'string') {
    return 'Password is required and must be a string';
  }

  return null;
};

export class AuthError extends Error {}
