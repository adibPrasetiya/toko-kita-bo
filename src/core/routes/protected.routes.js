import { Router } from "express";
import { protectedUserRoutes } from "../../features/users/protected-users.route.js";
import { protectedSerialNumberRoutes } from "../../features/serial-number/protected-serial-number.route.js";

export const protectedRoute = Router();

const routes = [
  ...protectedUserRoutes,
  ...protectedSerialNumberRoutes
];

routes.forEach(({ method, path, handler }) => {
  const middleware = [];

  middleware.push(handler);

  protectedRoute[method](path, ...middleware);
});
