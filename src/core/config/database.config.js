import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER } from "./app.constant.js";

export const adapter = new PrismaMariaDb({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    connectionLimit: 5
});