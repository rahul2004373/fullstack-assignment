import { getDashboardStats } from "./admin.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();

  return res
    .status(200)
    .json(new ApiResponse(200, "Dashboard stats fetched successfully", stats));
});

export { getDashboard };
