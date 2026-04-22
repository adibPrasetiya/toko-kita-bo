import { Router } from "express";
import { publicSerialNumberRoutes } from "../../features/serial-number/public-serial-number.route.js";
import { userRoutes } from "../../features/users/users.route.js";

export const publicRoute = Router();

const routes = [...userRoutes, ...publicSerialNumberRoutes];

routes.forEach(({ method, path, handler, middleware = [] }) => {
  publicRoute[method](path, ...middleware, handler);
});
