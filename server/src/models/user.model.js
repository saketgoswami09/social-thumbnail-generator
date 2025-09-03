const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const User = mongoose.model('User', UserSchema);

module.exports = User;