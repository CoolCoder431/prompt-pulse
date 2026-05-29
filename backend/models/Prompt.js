// backend/models/Prompt.js
const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  // 1. Relational Link: Attaches the prompt directly to a User ID
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // 2. The Title of the Prompt Card
  title: {
    type: String,
    required: [true, 'Please add a title for your prompt card'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  // 3. The actual raw instructions text copied into the clipboard
  instruction: {
    type: String,
    required: [true, 'Please provide the raw AI prompt text']
  },
  
  // 4. Categorized Target Engine (helps users filter the feed)
  aiModel: {
    type: String,
    required: [true, 'Please specify the target AI model'],
    enum: {
      values: ['ChatGPT', 'Claude', 'Midjourney', 'Stable Diffusion', 'v0', 'Other'],
      message: 'Please select a valid AI framework'
    }
  },
  
  // 5. Searchable descriptive keywords
  tags: [{
    type: String,
    trim: true
  }],
  
  // 6. Metrics tracking arrays (stores User IDs who interacted)
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  reshares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  // Automatically handles createdAt and updatedAt timestamps for sorting the feed
  timestamps: true
});

// Create a compound text index to enable blazing-fast global search lookups later
promptSchema.index({ title: 'text', instruction: 'text', tags: 'text' });

const Prompt = mongoose.model('Prompt', promptSchema);
module.exports = Prompt;