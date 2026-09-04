import {prisma} from "../../lib/prisma.js"

const findStoreById = async(storeId) => {

    return await prisma.store.findUnique({
        where: {
            id: storeId
        }
    })

}


const findRating = async(userId, storeId) => {

    return await prisma.rating.findUnique({
        where: {
            storeId_userId: {
                storeId,
                userId
            }
        }
    })

}


const createRating = async(ratingData) => {

    return await prisma.rating.create({
        data: ratingData
    })

}


const updateRating = async(id, rating) => {

    return await prisma.rating.update({
        where: {
            id
        },
        data: {
            rating
        }
    })

}


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
        },
      },
    },
    orderBy,
  });
};


const getUserRatingForStore = async(userId, storeId) => {

    return await prisma.rating.findUnique({
        where: {
            storeId_userId: {
                storeId,
                userId
            }
        }
    })

}


export {
    findStoreById,
    findRating,
    createRating,
    updateRating,
    getStoreRatings,
    getUserRatingForStore
}