
const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  

  title: {
    type: String,
    required: [true, 'Please add a title for your prompt card'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  

  instruction: {
    type: String,
    required: [true, 'Please provide the raw AI prompt text']
  },
  

  aiModel: {
    type: String,
    required: [true, 'Please specify the target AI model'],
    enum: {
      values: ['ChatGPT', 'Claude', 'Midjourney', 'Stable Diffusion', 'v0', 'Other'],
      message: 'Please select a valid AI framework'
    }
  },
  

  tags: [{
    type: String,
    trim: true
  }],
  

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  reshares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {

  timestamps: true
});


promptSchema.index({ title: 'text', instruction: 'text', tags: 'text' });

const Prompt = mongoose.model('Prompt', promptSchema);
module.exports = Prompt;