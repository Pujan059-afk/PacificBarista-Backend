const Testimonial = require('../models/Testimonial');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/helpers');

const getTestimonials = async (req, res) => {
  const { page = 1, limit = 10, featured } = req.query;

  const query = { isActive: true };

  if (featured === 'true') {
    query.isFeatured = true;
  }

  const total = await Testimonial.countDocuments(query);
  const testimonials = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    testimonials,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const createTestimonial = async (req, res) => {
  const { studentName, course, content, rating, isFeatured, isActive } = req.body;

  const toBool = (v) => v === true || v === 'true';

  let photo = { url: '', publicId: '' };

  if (req.file) {
    photo = await uploadToCloudinary(req.file.buffer, 'testimonials');
  }

  const testimonial = await Testimonial.create({
    studentName,
    photo,
    course,
    content,
    rating: Number(rating),
    isFeatured: isFeatured !== undefined ? toBool(isFeatured) : false,
    isActive: isActive !== undefined ? toBool(isActive) : true,
  });

  res.status(201).json(testimonial);
};

const updateTestimonial = async (req, res) => {
  let testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }

  const { studentName, course, content, rating, isFeatured, isActive } = req.body;

  const toBool = (v) => v === true || v === 'true';

  let photo = testimonial.photo;

  if (req.file) {
    if (testimonial.photo.publicId) {
      await deleteFromCloudinary(testimonial.photo.publicId);
    }
    photo = await uploadToCloudinary(req.file.buffer, 'testimonials');
  }

  testimonial.studentName = studentName || testimonial.studentName;
  testimonial.photo = photo;
  testimonial.course = course || testimonial.course;
  testimonial.content = content || testimonial.content;
  testimonial.rating = rating ? Number(rating) : testimonial.rating;
  testimonial.isFeatured = isFeatured !== undefined ? toBool(isFeatured) : testimonial.isFeatured;
  testimonial.isActive = isActive !== undefined ? toBool(isActive) : testimonial.isActive;

  const updatedTestimonial = await testimonial.save();
  res.json(updatedTestimonial);
};

const deleteTestimonial = async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }

  if (testimonial.photo.publicId) {
    await deleteFromCloudinary(testimonial.photo.publicId);
  }

  await testimonial.deleteOne();
  res.json({ message: 'Testimonial removed' });
};

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
