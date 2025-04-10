import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types/error.types";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal server error"
  });
};