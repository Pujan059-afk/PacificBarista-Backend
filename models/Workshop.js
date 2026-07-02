const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
  seatsAvailable: {
    type: Number,
    required: true,
    min: [0, 'Seats cannot be negative'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  instructor: {
    type: String,
    required: [true, 'Instructor is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
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

module.exports = mongoose.model('Workshop', workshopSchema);
