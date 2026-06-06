
const express = require('express');
const router = express.Router();
const { createPrompt, getAllPrompts, likePrompt, deletePrompt } = require('../controllers/promptController');
const { protect } = require('../middleware/authMiddleware');


router.route('/')
  .get(getAllPrompts)
  .post(protect, createPrompt);


router.route('/:id')
  .delete(protect, deletePrompt);


router.route('/:id/like')
  .put(protect, likePrompt);

module.exports = router;