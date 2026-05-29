// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // <-- Import upload hook

router.post('/register', registerUser);
router.post('/login', loginUser);

// Intercepts the form submission, extracts 'avatar' binary file, then hits update controller
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

module.exports = router;