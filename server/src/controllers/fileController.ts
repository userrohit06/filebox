import { RequestHandler, response, Response } from "express";
import path from "path";
import fs from "fs";
import File from "../models/File";
import { AuthRequest } from "../middleware/auth";

const uploadDir = path.join(__dirname, "../../uploads");

export const createUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

export const listFiles: RequestHandler = async (req, res) => {
  try {
    const files = await File.find({ owner: req.userId! }).sort({
      createdAt: -1,
    });

    res.json(files);
  } catch (error) {
    console.error("List error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const handleUpload: RequestHandler = async (req, res) => {
  try {
    if (!req.file || !req.userId) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileDoc = await File.create({
      owner: req.userId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json(fileDoc);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const downloadFile: RequestHandler = async (req, res) => {
  try {
    const fileDoc = await File.findOne({
      _id: req.params.id!,
      owner: req.userId!,
    });
    if (!fileDoc) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(uploadDir, fileDoc.storedName);
    const stat = await fs.promises.stat(filePath);
    const range = req.headers.range;

    if (range && fileDoc.mimeType.startsWith("video/")) {
      // chunked video streaming using Range
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0]!, 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "content-range": `bytes ${start}-${end}/${stat.size}`,
        "accept-ranges": "bytes",
        "content-length": chunkSize,
        "content-type": fileDoc.mimeType,
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        "content-length": stat.size,
        "content-type": fileDoc.mimeType,
        "content-disposition": `inline; filename="${encodeURIComponent(
          fileDoc.originalName
        )}"`,
      });

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }
  } catch (error) {}
};
