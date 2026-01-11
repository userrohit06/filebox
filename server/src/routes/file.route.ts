import { Router } from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/auth";
import {
  createUploadDir,
  downloadFile,
  handleUpload,
  listFiles,
} from "../controllers/fileController";

const router = Router();

createUploadDir();

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename(_req, file, cb) {
    const unique = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("file"), handleUpload);
router.get("/", authMiddleware, listFiles);
router.get("/:id/download", authMiddleware, downloadFile);
