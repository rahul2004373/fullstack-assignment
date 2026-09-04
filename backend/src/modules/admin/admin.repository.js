import { prisma } from "../../lib/prisma.js";

const getDashboardCounts = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return {
    totalUsers,
    totalStores,
    totalRatings,
  };
};

export { getDashboardCounts };
