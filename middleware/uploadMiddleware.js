// backend/middleware/uploadMiddleware.js

import multer from 'multer';
import path from 'path';

// Define storage location and filename format
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Save files to the 'uploads' folder
    cb(null, 'uploads/'); 
  },
  filename(req, file, cb) {
    // Generate a unique name: fieldname-timestamp.ext
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File type validation (only allow images)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|avif/; 
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;