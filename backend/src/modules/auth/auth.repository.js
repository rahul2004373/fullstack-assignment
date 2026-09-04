import { prisma } from "../../lib/prisma.js";

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      stores: {
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
        },
      },
    },
  });
};

const findUserByIdWithStore = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      stores: {
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
        },
      },
    },
  });
};

export { findUserByEmail, findUserByIdWithStore, createUser };

