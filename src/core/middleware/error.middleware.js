import { BadRequestError } from "../../error/bad-request.error.js";
import { ConflictError } from "../../error/conflict.error.js";
import { ForbiddenError } from "../../error/forbidden.error.js";
import { NotFoundError } from "../../error/not-found.error.js";
import { UnauthorizedError } from "../../error/unathorized.error.js";
import { ValidationError } from "../../error/valdiation.error.js";

export const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      errors: err.message,
      details: err.details,
    });
  }

  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError||
    err instanceof ConflictError
  ) {
    console.error(`[${err.name}] ${req.method} ${req.path}`, err);
    return res.status(err.statusCode).json({
      errors: err.message,
    });
  }

  console.error(`[Internal Error] ${req.method} ${req.path}`, err);

  return res.status(500).json({
    errors: "Internal Server Error",
  });
};
