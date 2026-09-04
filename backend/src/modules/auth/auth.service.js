import {
  findUserByEmail,
  findUserByIdWithStore,
  createUser,
} from "./auth.repository.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import ROLES from "../../constants/roles.js";
import { generateToken, verifyToken } from "../../utils/jwt.js";

const registerUser = async (userData) => {
  const { name, email, password, address } = userData;

  // check existing user
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  // hash the password
  const hashedPass = await hashPassword(password);

  // create new user (default to normal_user for public signup)
  const user = await createUser({
    name,
    email,
    passwordHash: hashedPass,
    role: ROLES.NORMAL_USER,
    address,
  });

  const token = await generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    },
    token,
  };
};

const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // compare password
  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = await generateToken(user);

  const responseUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };

  if (user.role === ROLES.STORE_OWNER) {
    responseUser.stores = user.stores || [];
    responseUser.store = user.stores && user.stores.length > 0 ? user.stores[0] : null;
  }

  return {
    user: responseUser,
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await findUserByIdWithStore(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const responseUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (user.role === ROLES.STORE_OWNER) {
    responseUser.stores = user.stores || [];
    responseUser.store = user.stores && user.stores.length > 0 ? user.stores[0] : null;
  }

  return responseUser;
};

export { registerUser, loginUser, getCurrentUser };