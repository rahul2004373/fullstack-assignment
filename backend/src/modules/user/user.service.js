import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdWithDetails,
  findUsers,
  updateUserPassword,
} from "./user.repository.js";
import { hashPassword, comparePassword } from "../../utils/password.js";

const calculateStoreOwnerRating = (stores = []) => {
  if (!stores || stores.length === 0) return null;
  const allRatings = stores.flatMap((s) => s.ratings || []).map((r) => r.rating);
  if (allRatings.length === 0) return 0;
  const avg = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
  return Number(avg.toFixed(2));
};

const addUser = async (userData) => {
  const { name, email, password, role, address } = userData;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    name,
    email,
    passwordHash,
    role,
    address,
  });

  return user;
};

const getUsersList = async (queryParams) => {
  const { name, email, address, role, sortBy = "name", sortOrder = "asc" } = queryParams;
  const isRatingSort = sortBy === "rating";

  const users = await findUsers({
    name,
    email,
    address,
    role,
    sortBy: isRatingSort ? "name" : sortBy,
    sortOrder: isRatingSort ? "asc" : sortOrder,
  });

  let formattedUsers = users.map((user) => {
    const baseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.role === "store_owner") {
      baseUser.rating = calculateStoreOwnerRating(user.stores);
    }

    return baseUser;
  });

  if (isRatingSort) {
    const direction = sortOrder.toLowerCase() === "desc" ? -1 : 1;
    formattedUsers.sort((a, b) => ((a.rating ?? -1) - (b.rating ?? -1)) * direction);
  }

  return formattedUsers;
};

const getUserDetails = async (id) => {
  const user = await findUserByIdWithDetails(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const responseData = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (user.role === "store_owner") {
    responseData.rating = calculateStoreOwnerRating(user.stores);
    responseData.stores = user.stores.map((s) => {
      const avg =
        s.ratings.length === 0
          ? 0
          : s.ratings.reduce((sum, r) => sum + r.rating, 0) / s.ratings.length;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        averageRating: Number(avg.toFixed(2)),
        totalRatings: s.ratings.length,
      };
    });
  }

  return responseData;
};

const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.passwordHash
  );

  if (!isCurrentPasswordValid) {
    const error = new Error("Current password does not match");
    error.statusCode = 400;
    throw error;
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updateUserPassword(userId, newPasswordHash);

  return { message: "Password updated successfully" };
};

export { addUser, getUsersList, getUserDetails, updatePassword };
