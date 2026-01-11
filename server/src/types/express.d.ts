import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
}
