// backend/controllers/promptController.js
const Prompt = require('../models/Prompt');

// @desc    Create a new prompt card
// @route   POST /api/prompts
// @access  Protected
const createPrompt = async (req, res) => {
  try {
    const { title, instruction, aiModel, tags } = req.body;

    if (!title || !instruction || !aiModel) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const cleanedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    const newPrompt = await Prompt.create({
      title,
      instruction,
      aiModel,
      tags: cleanedTags,
      creator: req.user._id
    });

    const populatedPrompt = await newPrompt.populate('creator', 'username avatar');
    res.status(201).json(populatedPrompt);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error creating prompt' });
  }
};

// @desc    Get all prompts
// @route   GET /api/prompts
// @access  Public
const getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find()
      .populate('creator', 'username avatar')
      .populate('likes', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch feed' });
  }
};

// @desc    Like / Unlike toggle engine
// @route   PUT /api/prompts/:id/like
// @access  Protected
const likePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt card not found' });
    }

    const currentUserId = req.user._id.toString();
    
    // Safely pull string matches out of whatever the current shape of the array is
    const currentLikesStrings = prompt.likes.map(id => {
      if (!id) return '';
      return typeof id === 'object' && id._id ? id._id.toString() : id.toString();
    }).filter(Boolean);

    const hasLiked = currentLikesStrings.includes(currentUserId);

    if (hasLiked) {
      // Pull out your user ID
      prompt.likes = currentLikesStrings.filter(id => id !== currentUserId);
    } else {
      // Add your user ID
      prompt.likes.push(req.user._id);
    }

    await prompt.save();

    // Re-fetch fully populated so the frontend app receives a perfectly clean schema
    const updatedPrompt = await Prompt.findById(prompt._id)
      .populate('creator', 'username avatar')
      .populate('likes', 'username avatar');

    return res.status(200).json(updatedPrompt);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error processing interaction' });
  }
};

// @desc    Delete a specific prompt card
// @route   DELETE /api/prompts/:id
// @access  Protected
const deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt card not found' });
    }

    if (prompt.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User unauthorized to delete this card' });
    }

    await prompt.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Prompt successfully removed' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error dropping prompt' });
  }
};

module.exports = {
  createPrompt,
  getAllPrompts,
  likePrompt,
  deletePrompt
};