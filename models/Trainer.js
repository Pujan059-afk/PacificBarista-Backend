const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  photo: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trainer', trainerSchema);
