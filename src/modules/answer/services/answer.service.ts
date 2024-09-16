import prisma from '../../prisma/prisma';

export const createAnswer = async (data: any) => {
  const answer = await prisma.answer.create({
    data: data,
  });

  return answer;
};

export const getAnswerById = async (answerId: string): Promise<any | null> => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });

  return answer;
};

export const updateAnswer = async (
  answerId: string,
  data: any,
): Promise<any | null> => {
 
  const answer = await prisma.answer.update({
    where: { id: answerId },
    data: data,
  });

  return answer;
};


export const deleteAnswer = async (answerId: string): Promise<any | null> => {
  return await prisma.answer.delete({
    where: { id: answerId },
  });
};

export const getAllAnswers = async (filterParams: any): Promise<any[]> => {
  const answers = await prisma.answer.findMany();

  return answers;
};

