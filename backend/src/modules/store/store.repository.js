import {prisma} from '../../lib/prisma.js'

const createStore = async(storeData)=>{
    return await prisma.store.create({
        data:storeData,
        include:{
            owner:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    })
}

const findStoreById = async(id)=>{
    return await prisma.store.findUnique({
        where:{
            id
        },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    })
}

const findStoreByEmail = async (email) => {
  return await prisma.store.findFirst({
    where: {
      email,
    },
  });
};

const findStoreByOwnerId = async (ownerId) => {
  return await prisma.store.findFirst({
    where: {
      ownerId,
    },
    include: {
      ratings: {
        select: {
          rating: true,
          userId: true,
        },
      },
    },
  });
};

const getAllStores = async ({
  name,
  email,
  address,
  sortBy = "name",
  sortOrder = "asc",
} = {}) => {
  const allowedSortFields = ["name", "email", "address", "createdAt"];
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
    ],
  };

  return prisma.store.findMany({
    where,
    include: {
      ratings: {
        select: {
          rating: true,
          userId: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      [sortField]: direction,
    },
  });
};

const findStores = async ({ name, address }) => {
  return await getAllStores({ name, address });
};


const getStoreRatings = async (
  storeId,
  { sortBy = "createdAt", sortOrder = "desc" } = {}
) => {
  const direction = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";
  let orderBy = { createdAt: direction };

  if (sortBy === "rating") {
    orderBy = { rating: direction };
  } else if (sortBy === "name") {
    orderBy = { user: { name: direction } };
  } else if (sortBy === "email") {
    orderBy = { user: { email: direction } };
  } else if (sortBy === "createdAt") {
    orderBy = { createdAt: direction };
  }

  return await prisma.rating.findMany({
    where: {
      storeId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
        },
      },
    },
    orderBy,
  });
};

export {
  createStore,
  findStoreById,
  findStoreByEmail,
  findStoreByOwnerId,
  getAllStores,
  findStores,
  getStoreRatings,
};