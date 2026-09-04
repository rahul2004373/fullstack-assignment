import {
  addStore,
  getStores,
  searchStores,
  getStoreDetails,
  getOwnerDashboard,
  getMyStore,
} from "./store.service.js";

import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createStore = asyncHandler(async (req, res) => {
  const store = await addStore(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "store created successfully", store));
});

const getAllStores = asyncHandler(async (req, res) => {
  const { name, email, address, sortBy, sortOrder } = req.query;

  const stores = await getStores({
    name,
    email,
    address,
    sortBy,
    sortOrder,
    userId: req.user?.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Stores fetched successfully", stores));
});

const search = asyncHandler(async (req, res) => {
  const { name, address, email, sortBy, sortOrder } = req.query;

  const stores = await searchStores({
    name,
    email,
    address,
    sortBy,
    sortOrder,
    userId: req.user?.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Stores fetched successfully", stores));
});

const getMyStoreController = asyncHandler(async (req, res) => {
  const { sortBy, sortOrder } = req.query;
  const storeData = await getMyStore(req.user.id, { sortBy, sortOrder });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Store data fetched successfully", storeData)
    );
});

const getById = asyncHandler(async (req, res) => {
  const store = await getStoreDetails(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Store fetched successfully", store));
});

const ownerDashboard = asyncHandler(async (req, res) => {
  const { sortBy, sortOrder } = req.query;
  const dashboard = await getOwnerDashboard(req.params.id, req.user, {
    sortBy,
    sortOrder,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Owner dashboard fetched successfully", dashboard)
    );
});

export {
  createStore,
  getAllStores,
  search,
  getMyStoreController,
  getById,
  ownerDashboard,
};