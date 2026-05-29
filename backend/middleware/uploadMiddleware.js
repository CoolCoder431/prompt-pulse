// backend/middleware/uploadMiddleware.js
const multer = require('multer');

// Configure temporary memory storage for incoming buffers
const storage = multer.memoryStorage();

// Validate file types to protect the database against malicious code
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Strict 2MB image size constraint
});

module.exports = upload;