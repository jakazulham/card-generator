import { Router } from 'express';
import { upload } from '../middleware/upload.js';

export default function uploadRoutes() {
  const router = Router();

  // POST /api/upload — upload single image
  router.post('/', (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Ukuran file maksimal 5MB.' });
        }
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'File gambar wajib diunggah.' });
      }

      res.json({
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    });
  });

  return router;
}
