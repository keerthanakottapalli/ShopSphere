// backend/routes/uploadRoutes.js

import path from 'path';
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// The middleware 'upload.single('image')' handles saving the file
router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    const fixedPath = req.file.path.replace(/\\/g, '/'); // ✅ replace backslashes
    res.status(200).json({
      message: 'Image uploaded successfully',
      image: `/${fixedPath.split('uploads/')[1] ? 'uploads/' + fixedPath.split('uploads/')[1] : fixedPath}`,
    });
  } else {
    res.status(400).json({ message: 'No image file provided' });
  }
});

export default router;