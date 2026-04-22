import { config } from "dotenv";

config();

export const APP_PORT = process.env.APP_PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "dev";

//DATABSE CONFIG
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = process.env.DATABASE_PORT;

// PASSWORD CONFIG
export const SALT_LENGTH = parseInt(process.env.SALT_LENGTH) || 32;
export const PASSWORD_ITERATIONS =
  parseInt(process.env.PASSWORD_ITERATIONS) || 100000;
export const KEY_LENGTH = parseInt(process.env.KEY_LENGTH) || 64;

// TOKEN CONFIG
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
export const REFRESH_TOKEN_EXPIRY_DAYS =
  parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7;
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET;
export const PRE_AUTH_TOKEN_SECRET =
  process.env.PRE_AUTH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET;
export const PRE_AUTH_TOKEN_EXPIRY = process.env.PRE_AUTH_TOKEN_EXPIRY || "5m";
