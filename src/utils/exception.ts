import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http.exception";
import { HTTP_STATUS_CODE } from "../constant";

export function httpExceptionFilter(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode =
    err instanceof HttpException
      ? err.statusCode
      : HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

  const message =
    err instanceof HttpException ? err.getResponse() : "Internal Server Error";

  res.status(statusCode).json({
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.url
  });
}
