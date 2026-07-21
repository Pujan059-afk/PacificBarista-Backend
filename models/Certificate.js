const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
    required: true,
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
  },
  photo: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['Valid', 'Revoked'],
    default: 'Valid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

certificateSchema.statics.generateId = function () {
  const prefix = 'PBC';
  const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${part1}-${part2}`;
};

module.exports = mongoose.model('Certificate', certificateSchema);
