import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const DATABASE_URL = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString: DATABASE_URL });
export const prismaClient = new PrismaClient({ adapter });
