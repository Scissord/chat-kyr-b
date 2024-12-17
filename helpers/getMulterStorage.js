import multer from "multer";
import path from "path";
import fs from "fs";
import { slugify as transliteration } from "transliteration";

export default function getMulterStorage() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve('./uploads');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const currentTime = new Date().toISOString().replace(/[-:.]/g, "");
      const originalName = path.basename(file.originalname, path.extname(file.originalname));

      const sanitizedOriginalName = transliteration(originalName);

      const uniqueSuffix = `${sanitizedOriginalName}-${currentTime}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });
}
