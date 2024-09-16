import prisma from '../../prisma/prisma';

export const createRating = async (data: any) => {
  const rating = await prisma.rating.create({
    data: data,
  });

  return rating;
};

export const getRatingById = async (ratingId: string): Promise<any | null> => {
  const rating = await prisma.rating.findUnique({
    where: { id: ratingId },
  });

  return rating;
};

export const updateRating = async (
  ratingId: string,
  data: any,
): Promise<any | null> => {
 
  const rating = await prisma.rating.update({
    where: { id: ratingId },
    data: data,
  });

  return rating;
};


export const deleteRating = async (ratingId: string): Promise<any | null> => {
  return await prisma.rating.delete({
    where: { id: ratingId },
  });
};

export const getAllRatings = async (filterParams: any): Promise<any[]> => {
  const rating = await prisma.rating.findMany();

  return rating;
};

