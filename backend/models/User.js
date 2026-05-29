// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
  },
  avatar: {
    type: String,
    default: 'https://images.cloudinary.com/placeholder-avatar.png'
  }
}, {
  timestamps: true
});

// backend/models/User.js

// 1. Modernized Password Encryption Pre-Save Hook
// Notice: We completely dropped 'next' from the arguments and the body
userSchema.pre('save', async function () {
  // If the password field hasn't been changed, skip hashing entirely
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Password Comparison Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;