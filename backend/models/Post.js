const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a heading explaining your prompt'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    promptText: {
      type: String,
      required: [true, 'The prompt field cannot be empty'],
      trim: true,
    },
    aiModel: {
      type: String,
      required: true,
      enum: {
        values: ['ChatGPT', 'Claude', 'Midjourney', 'Stable Diffusion', 'Gemini', 'Other'],
        message: '{VALUE} is not a supported AI model',
      },
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ['Coding', 'Writing', 'Image Generation', 'Marketing', 'Productivity', 'General'],
        message: '{VALUE} is not a supported category',
      },
    },
    previewImage: {
      type: String, 
      default: '',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isReshare: {
      type: Boolean,
      default: false,
    },
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);