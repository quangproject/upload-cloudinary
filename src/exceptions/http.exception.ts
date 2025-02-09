export class HttpException extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  getResponse() {
    try {
      return JSON.parse(this.message);
    } catch (error) {
      return this.message;
    }
  }
}
