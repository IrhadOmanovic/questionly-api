import { Answer } from '@prisma/client';

export const validateAnswereData = (answerData: Partial<Answer>): string | null => {
  // Check if name is provided and is a string
  if (!answerData.text || typeof answerData.text !== 'string') {
    return 'Text is required and must be a string';
  }

  // Check if surname is provided and is a string
  if (!answerData.authorId || typeof answerData.authorId !== 'string') {
    return 'Author Id is required and must be a string';
  }

  return null; // Return null if all validation checks pass
};
