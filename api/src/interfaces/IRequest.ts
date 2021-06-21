import { Request } from "express";

export interface IRequest extends Request {
  /**
   * the user Id of the authenticated user.
   */
  userId?: string;
}
