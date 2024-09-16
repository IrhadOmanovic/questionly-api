import { User } from '@prisma/client';

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
    !userData.phone ||
    typeof userData.phone !== 'string' ||
    userData.phone?.match(phoneRegex) === null
  ) {
    return 'Phone is not required and must be a string';
  }

  return null;
};

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const phoneRegex = /^[0-9]{1,10}$/;
