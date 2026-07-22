import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export interface AuthRequest extends Request {
    user? : any
}

export const protect = async ( req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  
  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded: any = jwt.verify( token, process.env.JWT_SECRET! );

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Not authorized, token failed",
      });
    }
  }

  return res.status(401).json({
    message: "Not authorized, no token",
  });
};