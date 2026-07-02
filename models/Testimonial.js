const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  photo: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  isFeatured: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model('Testimonial', testimonialSchema);
