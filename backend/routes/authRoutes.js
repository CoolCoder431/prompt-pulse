
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

module.exports = router;