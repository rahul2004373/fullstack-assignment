import {
  createStore,
  findStoreById,
  findStoreByEmail,
  findStoreByOwnerId,
  getAllStores,
  getStoreRatings,
} from "./store.repository.js";

const addStore = async (storeData) => {
  const { name, email, address, ownerId } = storeData;

  const existingStore = await findStoreByEmail(email);

  if (existingStore) {
    const error = new Error("Store with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const store = await createStore({
    name,
    email,
    address,
    ownerId,
  });

  return store;
};

const getStores = async ({
  name,
  email,
  address,
  sortBy = "name",
  sortOrder = "asc",
  userId,
} = {}) => {
  const isComputedSort = [
    "rating",
    "overallRating",
    "averageRating",
    "userRating",
  ].includes(sortBy);

  const stores = await getAllStores({
    name,
    email,
    address,
    sortBy: isComputedSort ? "name" : sortBy,
    sortOrder: isComputedSort ? "asc" : sortOrder,
  });

  let formattedStores = stores.map((store) => {
    const ratings = store.ratings || [];

    const averageRating =
      ratings.length === 0
        ? 0
        : ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;

    const userSubmittedRating = userId
      ? ratings.find((item) => item.userId === userId)?.rating || null
      : null;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      overallRating: Number(averageRating.toFixed(2)),
      averageRating: Number(averageRating.toFixed(2)),
      userRating: userSubmittedRating,
      totalRatings: ratings.length,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      owner: store.owner,
    };
  });

  if (isComputedSort) {
    const direction = sortOrder.toLowerCase() === "desc" ? -1 : 1;
    if (["rating", "overallRating", "averageRating"].includes(sortBy)) {
      formattedStores.sort(
        (a, b) => (a.overallRating - b.overallRating) * direction
      );
    } else if (sortBy === "userRating") {
      formattedStores.sort(
        (a, b) => ((a.userRating || 0) - (b.userRating || 0)) * direction
      );
    }
  }

  return formattedStores;
};

const searchStores = async ({ name, address, email, sortBy, sortOrder, userId }) => {
  return await getStores({ name, address, email, sortBy, sortOrder, userId });
};

const getStoreDetails = async (storeId) => {
  const store = await findStoreById(storeId);

  if (!store) {
    const error = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  return store;
};

const getOwnerDashboard = async (
  storeId,
  requestingUser,
  { sortBy = "createdAt", sortOrder = "desc" } = {}
) => {
  const store = await findStoreById(storeId);

  if (!store) {
    const error = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  // Authorization check: Only the owner or system admin can view this dashboard
  if (
    requestingUser.role !== "system_admin" &&
    store.ownerId !== requestingUser.id
  ) {
    const error = new Error("You are not authorized to view this store dashboard");
    error.statusCode = 403;
    throw error;
  }

  const ratings = await getStoreRatings(storeId, { sortBy, sortOrder });

  const averageRating =
    ratings.length === 0
      ? 0
      : ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    averageRating: Number(averageRating.toFixed(2)),
    overallRating: Number(averageRating.toFixed(2)),
    totalRatings: ratings.length,
    ratings: ratings.map((item) => ({
      rating: item.rating,
      user: item.user,
      createdAt: item.createdAt,
    })),
  };
};

const getMyStore = async (
  ownerId,
  { sortBy = "createdAt", sortOrder = "desc" } = {}
) => {
  const store = await findStoreByOwnerId(ownerId);

  if (!store) {
    const error = new Error("No store found for this store owner");
    error.statusCode = 404;
    throw error;
  }

  const ratings = await getStoreRatings(store.id, { sortBy, sortOrder });

  const averageRating =
    ratings.length === 0
      ? 0
      : ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    averageRating: Number(averageRating.toFixed(2)),
    overallRating: Number(averageRating.toFixed(2)),
    totalRatings: ratings.length,
    ratings: ratings.map((item) => ({
      rating: item.rating,
      user: item.user,
      createdAt: item.createdAt,
    })),
  };
};

export {
  addStore,
  getStores,
  searchStores,
  getStoreDetails,
  getOwnerDashboard,
  getMyStore,
};