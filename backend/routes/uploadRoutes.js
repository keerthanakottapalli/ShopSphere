import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// 1. Configure Disk Storage for Multer
const storage = multer.diskStorage({
    // Define the destination folder for the uploaded images
    destination(req, file, cb) {
        // cb(error, destination_path)
        // We use 'uploads' relative to the root of the project
        cb(null, 'uploads/'); 
    },
    // Define the filename to be saved
    filename(req, file, cb) {
        // Creates a unique filename: fieldname-timestamp.ext
        // e.g., image-1634567890123.jpg
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// 2. File Filter (Optional but recommended)
// Only allow certain image file types
function checkFileType(file, cb) {
    const filetypes = /jpe?g|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only! (JPEG, PNG, GIF, WebP)');
    }
}

// 3. Initialize Multer Upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// 4. Create the POST route for image upload
// 'image' here must match the 'name' attribute in the frontend <input type="file" name="image" />
router.post('/', upload.single('image'), (req, res) => {
    // req.file contains the information about the uploaded file
    if (req.file) {
        // The path we are saving to the database.
        // On a server, this URL would be 'http://yourdomain.com/uploads/filename.jpg'
        // For local development, it will be the file path.
        res.status(200).send(`/${req.file.path}`);
    } else {
        res.status(400).send('File upload failed.');
    }
});

export default router;