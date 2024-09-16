import { Rating } from '@prisma/client';

export const validateRatingData = (answerData: Partial<Rating>): string | null => {
  // Check if name is provided and is a string
  if (answerData.rating !== null  && typeof answerData.rating !== "boolean") {
    return 'Rating is required and must be a boolean(or null)';
  }

  // Check if surname is provided and is a string
  if (!answerData.authorId || typeof answerData.authorId !== 'string') {
    return 'Author Id is required and must be a string';
  }

   // Check if surname is provided and is a string
   if ((!answerData.answerId || typeof answerData.answerId !== 'string') && (!answerData.questionId || typeof answerData.questionId !== 'string')) {
    return 'Answer Id or Question Id is required and must be a string';
  }

  // Check if surname is provided and is a string
  if (answerData.answerId && typeof answerData.answerId === 'string' && answerData.questionId && typeof answerData.questionId === 'string') {
    return 'Answer Id and Question Id cant be present at the same time';
  }

  return null; // Return null if all validation checks pass
};
