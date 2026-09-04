import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
  const ownerPasswordHash = await bcrypt.hash("Owner@12345", 10);
  const userPasswordHash = await bcrypt.hash("User@12345", 10);

  // 1. Seed System Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@system.com" },
    update: {},
    create: {
      name: "System Administrator Main",
      email: "admin@system.com",
      passwordHash: adminPasswordHash,
      address: "100 System Headquarters Boulevard, Suite 500",
      role: "system_admin",
    },
  });
  console.log("Admin seeded:", admin.email);

  // 2. Seed Store Owner
  const owner = await prisma.user.upsert({
    where: { email: "owner@store.com" },
    update: {},
    create: {
      name: "Store Owner Professional",
      email: "owner@store.com",
      passwordHash: ownerPasswordHash,
      address: "200 Retail Market Avenue, Downtown",
      role: "store_owner",
    },
  });
  console.log("Store Owner seeded:", owner.email);

  // 3. Seed Store
  const store = await prisma.store.upsert({
    where: { id: "store-seed-uuid-1" },
    update: {},
    create: {
      id: "store-seed-uuid-1",
      name: "Supermart Express Central",
      email: "contact@supermart.com",
      address: "200 Retail Market Avenue, Downtown",
      ownerId: owner.id,
    },
  });
  console.log("Store seeded:", store.name);

  // 4. Seed Normal User
  const user = await prisma.user.upsert({
    where: { email: "user@normal.com" },
    update: {},
    create: {
      name: "Normal Consumer Regular",
      email: "user@normal.com",
      passwordHash: userPasswordHash,
      address: "300 Resident Green Lane, Cityville",
      role: "normal_user",
    },
  });
  console.log("Normal User seeded:", user.email);

  // 5. Seed Rating
  await prisma.rating.upsert({
    where: {
      storeId_userId: {
        storeId: store.id,
        userId: user.id,
      },
    },
    update: { rating: 5 },
    create: {
      rating: 5,
      storeId: store.id,
      userId: user.id,
    },
  });
  console.log("Sample rating seeded.");

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
