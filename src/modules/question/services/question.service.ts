import prisma from '../../prisma/prisma';

export const createQuestion = async (data: any) => {
  const question = await prisma.question.create({
    data: data,
  });

  return question;
};

export const getQuestionById = async (questionId: string): Promise<any | null> => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  return question;
};

export const updateQuestion = async (
  questionId: string,
  data: any,
): Promise<any | null> => {
 
  const question = await prisma.question.update({
    where: { id: questionId },
    data: data,
  });

  return question;
};


export const deleteQuestion = async (questionId: string): Promise<any | null> => {
  return await prisma.question.delete({
    where: { id: questionId },
  });
};

export const getAllQuestions = async (filterParams: any): Promise<any[]> => {
  const questions = await prisma.question.findMany();

  return questions;
};

