// backend/models/Post.js
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
      type: String, // URL to Cloudinary/S3 image (Optional)
      default: '',
    },
    // Array of User IDs who liked this post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Reshare Logic (Twitter Retweet equivalent)
    isReshare: {
      type: Boolean,
      default: false,
    },
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Points back to the source prompt if this is a reshare
      default: null,
    },
  },
  {
    timestamps: true, // Captures when the prompt was posted
  }
);

module.exports = mongoose.model('Post', postSchema);