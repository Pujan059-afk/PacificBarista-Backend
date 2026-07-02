const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
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

module.exports = mongoose.model('Gallery', gallerySchema);
