import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.substring(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
