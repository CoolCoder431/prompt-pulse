// backend/routes/promptRoutes.js
const express = require('express');
const router = express.Router();
const { createPrompt, getAllPrompts, likePrompt, deletePrompt } = require('../controllers/promptController');
const { protect } = require('../middleware/authMiddleware');

// Route for root collection interactions
router.route('/')
  .get(getAllPrompts)
  .post(protect, createPrompt);

// Route for target card deletion
router.route('/:id')
  .delete(protect, deletePrompt);

// Route for target card interaction toggles matching your frontend fetch
router.route('/:id/like')
  .put(protect, likePrompt);

module.exports = router;