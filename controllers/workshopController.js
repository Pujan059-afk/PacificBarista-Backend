const Workshop = require('../models/Workshop');
const { slugify, uploadToCloudinary, deleteFromCloudinary } = require('../utils/helpers');

const getWorkshops = async (req, res) => {
  const { page = 1, limit = 10, upcoming } = req.query;

  const query = { isActive: true };

  if (upcoming === 'true') {
    query.date = { $gte: new Date() };
  }

  const total = await Workshop.countDocuments(query);
  const workshops = await Workshop.find(query)
    .sort({ date: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    workshops,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const getWorkshopBySlug = async (req, res) => {
  const workshop = await Workshop.findOne({ slug: req.params.slug });
  if (!workshop) {
    return res.status(404).json({ message: 'Workshop not found' });
  }
  res.json(workshop);
};

const createWorkshop = async (req, res) => {
  const { title, description, date, time, duration, seatsAvailable, price, instructor, location, isActive } = req.body;

  let slug = slugify(title);

  const existingSlug = await Workshop.findOne({ slug });
  if (existingSlug) {
    slug = slug + '-' + Date.now();
  }

  let image = { url: '', publicId: '' };

  if (req.file) {
    image = await uploadToCloudinary(req.file.path, 'workshops');
  }

  const workshop = await Workshop.create({
    title,
    slug,
    description,
    image,
    date,
    time,
    duration,
    seatsAvailable,
    price,
    instructor,
    location,
    isActive,
  });

  res.status(201).json(workshop);
};

const updateWorkshop = async (req, res) => {
  let workshop = await Workshop.findById(req.params.id);

  if (!workshop) {
    return res.status(404).json({ message: 'Workshop not found' });
  }

  const { title, description, date, time, duration, seatsAvailable, price, instructor, location, isActive } = req.body;

  if (title && title !== workshop.title) {
    let slug = slugify(title);
    const existingSlug = await Workshop.findOne({ slug, _id: { $ne: req.params.id } });
    if (existingSlug) {
      slug = slug + '-' + Date.now();
    }
    workshop.slug = slug;
  }

  let image = workshop.image;

  if (req.file) {
    if (workshop.image.publicId) {
      await deleteFromCloudinary(workshop.image.publicId);
    }
    image = await uploadToCloudinary(req.file.path, 'workshops');
  }

  workshop.title = title || workshop.title;
  workshop.description = description || workshop.description;
  workshop.image = image;
  workshop.date = date || workshop.date;
  workshop.time = time || workshop.time;
  workshop.duration = duration || workshop.duration;
  workshop.seatsAvailable = seatsAvailable || workshop.seatsAvailable;
  workshop.price = price || workshop.price;
  workshop.instructor = instructor || workshop.instructor;
  workshop.location = location || workshop.location;
  workshop.isActive = isActive !== undefined ? isActive : workshop.isActive;

  const updatedWorkshop = await workshop.save();
  res.json(updatedWorkshop);
};

const deleteWorkshop = async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);

  if (!workshop) {
    return res.status(404).json({ message: 'Workshop not found' });
  }

  if (workshop.image.publicId) {
    await deleteFromCloudinary(workshop.image.publicId);
  }

  await workshop.deleteOne();
  res.json({ message: 'Workshop removed' });
};

module.exports = { getWorkshops, getWorkshopBySlug, createWorkshop, updateWorkshop, deleteWorkshop };
