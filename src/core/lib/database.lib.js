import { PrismaClient } from "./prisma/index.js"
import { adapter } from "../config/database.config.js";

export const prismaClient = new PrismaClient({ adapter });