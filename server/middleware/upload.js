import multer from 'multer';
import { extname } from 'path';
import { mkdirSync, existsSync } from 'fs';
import config from '../config.js';

// Ensure upload directory exists
if (!existsSync(config.uploadDir)) {
  mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    // Keep original filename, replace spaces with dashes, remove unsafe characters
    let baseName = file.originalname
      .replace(ext, '') // remove extension
      .replace(/\s+/g, '-') // spaces → dashes
      .replace(/[^a-zA-Z0-9\-_.]/g, '') // remove unsafe chars
      .replace(/-+/g, '-') // collapse multiple dashes
      .replace(/^-|-$/g, ''); // trim leading/trailing dashes

    if (!baseName) baseName = 'image';

    let name = baseName + ext;
    // If file exists, append a counter
    let counter = 1;
    while (existsSync(config.uploadDir + '/' + name)) {
      name = `${baseName}-${counter}${ext}`;
      counter++;
    }

    cb(null, name);
  },
});

function fileFilter(_req, file, cb) {
  if (config.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipe file tidak diizinkan. Hanya: ${config.allowedMimeTypes.join(', ')}`), false);
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxFileSize },
});
