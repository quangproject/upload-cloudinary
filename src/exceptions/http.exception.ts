import { isJson } from "../utils";

export class HttpException extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  getResponse() {
    return isJson(this.message) ? JSON.parse(this.message) : this.message;
  }
}
