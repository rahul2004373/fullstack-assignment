import {findStoreById,findRating,createRating,updateRating,getStoreRatings,getUserRatingForStore} from "./rating.repository.js"


const addOrUpdateRating = async(userId, storeId, rating) => {

    // check store exists
    const store = await findStoreById(storeId)

    if(!store){
        const error = new Error("Store not found")
        error.statusCode = 404
        throw error
    }


    // check whether user already rated this store
    const existingRating = await findRating(
        userId,
        storeId
    )


    // update existing rating
    if(existingRating){

        const updatedRating = await updateRating(
            existingRating.id,
            rating
        )

        return {
            action: "updated",
            rating: updatedRating
        }
    }


    // create new rating
    const newRating = await createRating({
        rating,
        userId,
        storeId
    })


    return {
        action: "created",
        rating: newRating
    }

}


const getRatingsForStore = async (
  storeId,
  { sortBy, sortOrder } = {}
) => {
  const store = await findStoreById(storeId);

  if (!store) {
    const error = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  const ratings = await getStoreRatings(storeId, { sortBy, sortOrder });

  const averageRating =
    ratings.length === 0
      ? 0
      : ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;

  return {
    averageRating: Number(averageRating.toFixed(2)),
    overallRating: Number(averageRating.toFixed(2)),
    totalRatings: ratings.length,
    ratings,
  };
};


const getMyRating = async(userId, storeId) => {

    const store = await findStoreById(storeId)

    if(!store){
        const error = new Error("Store not found")
        error.statusCode = 404
        throw error
    }


    const rating = await getUserRatingForStore(
        userId,
        storeId
    )


    return rating

}


export {
    addOrUpdateRating,
    getRatingsForStore,
    getMyRating
}