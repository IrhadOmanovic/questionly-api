import prisma from '../../prisma/prisma';

export const createUser = async (data: any) => {
  const user = await prisma.user.create({
    data: data,
  });

  return user;
};

export const getUserById = async (userId: string): Promise<any | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

export const getUserByEmail = async (email: string): Promise<any | null> => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  return user;
};

export const updateUser = async (
  userId: string,
  data: any,
): Promise<any | null> => {
 
  const user = await prisma.user.update({
    where: { id: userId },
    data: data,
  });

  return user;
};


export const deleteUser = async (userId: string): Promise<any | null> => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};

export const getAllUsers = async (filterParams: any): Promise<any[]> => {
  const users = await prisma.user.findMany();

  return users || [];
};

