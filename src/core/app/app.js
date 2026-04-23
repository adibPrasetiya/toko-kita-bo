import express from "express";
import cors from "cors";
import { publicRoute } from "../routes/public.routes.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "../middleware/authentication.middleware.js";
import { protectedRoute } from "../routes/protected.routes.js";

export const app = express();

app.use(
  cors({
    origin: "https://toko-kita.adibprasetiya.com",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(publicRoute);
app.use(authMiddleware);
app.use(protectedRoute);

app.use(errorMiddleware);