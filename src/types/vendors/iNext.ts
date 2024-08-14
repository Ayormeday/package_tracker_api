import { NextFunction } from "express";
export interface INextFunction extends NextFunction {
  (error?: any, user?: any): void;
}
