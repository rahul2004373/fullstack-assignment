import { getDashboardCounts } from "./admin.repository.js";

const getDashboardStats = async () => {
  const stats = await getDashboardCounts();
  return stats;
};

export { getDashboardStats };
