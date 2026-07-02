const Course = require('../models/Course');
const { slugify, uploadToCloudinary, deleteFromCloudinary } = require('../utils/helpers');

const getCourses = async (req, res) => {
  const { page = 1, limit = 10, search, level, featured } = req.query;

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (level) {
    query.level = level;
  }

  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    courses,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const getCourseBySlug = async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
};

const createCourse = async (req, res) => {
  const { title, description, shortDescription, duration, level, price, curriculum, learningOutcomes, requirements, certificateIncluded, featured, isActive } = req.body;

  let slug = slugify(title);

  const existingSlug = await Course.findOne({ slug });
  if (existingSlug) {
    slug = slug + '-' + Date.now();
  }

  let image = { url: '', publicId: '' };

  if (req.file) {
    image = await uploadToCloudinary(req.file.path, 'courses');
  }

  const course = await Course.create({
    title,
    slug,
    description,
    shortDescription,
    image,
    duration,
    level,
    price,
    curriculum: curriculum ? JSON.parse(curriculum) : [],
    learningOutcomes: learningOutcomes ? JSON.parse(learningOutcomes) : [],
    requirements: requirements ? JSON.parse(requirements) : [],
    certificateIncluded,
    featured,
    isActive,
  });

  res.status(201).json(course);
};

const updateCourse = async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const { title, description, shortDescription, duration, level, price, curriculum, learningOutcomes, requirements, certificateIncluded, featured, isActive } = req.body;

  if (title && title !== course.title) {
    let slug = slugify(title);
    const existingSlug = await Course.findOne({ slug, _id: { $ne: req.params.id } });
    if (existingSlug) {
      slug = slug + '-' + Date.now();
    }
    course.slug = slug;
  }

  let image = course.image;

  if (req.file) {
    if (course.image.publicId) {
      await deleteFromCloudinary(course.image.publicId);
    }
    image = await uploadToCloudinary(req.file.path, 'courses');
  }

  course.title = title || course.title;
  course.description = description || course.description;
  course.shortDescription = shortDescription || course.shortDescription;
  course.image = image;
  course.duration = duration || course.duration;
  course.level = level || course.level;
  course.price = price || course.price;
  course.curriculum = curriculum ? JSON.parse(curriculum) : course.curriculum;
  course.learningOutcomes = learningOutcomes ? JSON.parse(learningOutcomes) : course.learningOutcomes;
  course.requirements = requirements ? JSON.parse(requirements) : course.requirements;
  course.certificateIncluded = certificateIncluded !== undefined ? certificateIncluded : course.certificateIncluded;
  course.featured = featured !== undefined ? featured : course.featured;
  course.isActive = isActive !== undefined ? isActive : course.isActive;

  const updatedCourse = await course.save();
  res.json(updatedCourse);
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (course.image.publicId) {
    await deleteFromCloudinary(course.image.publicId);
  }

  await course.deleteOne();
  res.json({ message: 'Course removed' });
};

module.exports = { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse };
