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
  });
};

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const findUserByIdWithDetails = async (id) => {
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
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
  });
};

const findUsers = async ({ name, email, address, role, sortBy = "name", sortOrder = "asc" }) => {
  const allowedSortFields = ["name", "email", "address", "role", "createdAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const direction = sortOrder.toLowerCase() === "desc" ? "desc" : "asc";

  const where = {
    AND: [
      name
        ? {
            name: {
              contains: name,
              mode: "insensitive",
            },
          }
        : {},
      email
        ? {
            email: {
              contains: email,
              mode: "insensitive",
            },
          }
        : {},
      address
        ? {
            address: {
              contains: address,
              mode: "insensitive",
            },
          }
        : {},
      role
        ? {
            role,
          }
        : {},
    ],
  };

  return await prisma.user.findMany({
    where,
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
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
    orderBy: {
      [sortField]: direction,
    },
  });
};

const updateUserPassword = async (id, passwordHash) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdWithDetails,
  findUsers,
  updateUserPassword,
};
