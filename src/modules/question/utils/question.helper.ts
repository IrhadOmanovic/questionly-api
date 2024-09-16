import { Question } from '@prisma/client';

export const validateQuestioneData = (questionData: Partial<Question>): string | null => {
  // Check if name is provided and is a string
  if (!questionData.text || typeof questionData.text !== 'string') {
    return 'Text is required and must be a string';
  }

  // Check if surname is provided and is a string
  if (!questionData.authorId || typeof questionData.authorId !== 'string') {
    return 'Author Id is required and must be a string';
  }

  return null; // Return null if all validation checks pass
};
