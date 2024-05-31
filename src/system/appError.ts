import httpStatus from 'http-status';
import Constants from "src/commons/constants";
import {HttpError} from "./httpError";

export class AppError {
  message: string;
  status: number;

  constructor(error: unknown) {
    if (error instanceof HttpError) {
      this.status = error.status;
      this.message = error.message;
    } else {
      this.status = httpStatus.INTERNAL_SERVER_ERROR;
      this.message = Constants.MESSAGES.INTERNAL_SERVER_ERROR;
    }
  }
}