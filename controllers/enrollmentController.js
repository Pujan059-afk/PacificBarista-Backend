const Enrollment = require('../models/Enrollment');

const createEnrollment = async (req, res) => {
  const { fullName, email, phone, address, course, education, experience, message } = req.body;

  const enrollment = await Enrollment.create({
    fullName,
    email,
    phone,
    address,
    course,
    education,
    experience,
    message,
  });

  const populated = await Enrollment.findById(enrollment._id).populate('course', 'title slug');

  res.status(201).json(populated);
};

const getEnrollments = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  const total = await Enrollment.countDocuments(query);
  const enrollments = await Enrollment.find(query)
    .populate('course', 'title slug')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    enrollments,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const getEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id).populate('course', 'title slug');

  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  res.json(enrollment);
};

const updateEnrollmentStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('course', 'title slug');

  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  res.json(enrollment);
};

const deleteEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  await enrollment.deleteOne();
  res.json({ message: 'Enrollment removed' });
};

module.exports = { createEnrollment, getEnrollments, getEnrollment, updateEnrollmentStatus, deleteEnrollment };
