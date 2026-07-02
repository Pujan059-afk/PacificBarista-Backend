const Trainer = require('../models/Trainer');
const { slugify, uploadToCloudinary, deleteFromCloudinary } = require('../utils/helpers');

const getTrainers = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const query = { isActive: true };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Trainer.countDocuments(query);
  const trainers = await Trainer.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    trainers,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const getTrainerBySlug = async (req, res) => {
  const trainer = await Trainer.findOne({ slug: req.params.slug });
  if (!trainer) {
    return res.status(404).json({ message: 'Trainer not found' });
  }
  res.json(trainer);
};

const createTrainer = async (req, res) => {
  const { name, experience, specialization, bio, socialLinks, isActive } = req.body;

  let slug = slugify(name);

  const existingSlug = await Trainer.findOne({ slug });
  if (existingSlug) {
    slug = slug + '-' + Date.now();
  }

  let photo = { url: '', publicId: '' };

  if (req.file) {
    photo = await uploadToCloudinary(req.file.path, 'trainers');
  }

  const trainer = await Trainer.create({
    name,
    slug,
    photo,
    experience,
    specialization,
    bio,
    socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
    isActive,
  });

  res.status(201).json(trainer);
};

const updateTrainer = async (req, res) => {
  let trainer = await Trainer.findById(req.params.id);

  if (!trainer) {
    return res.status(404).json({ message: 'Trainer not found' });
  }

  const { name, experience, specialization, bio, socialLinks, isActive } = req.body;

  if (name && name !== trainer.name) {
    let slug = slugify(name);
    const existingSlug = await Trainer.findOne({ slug, _id: { $ne: req.params.id } });
    if (existingSlug) {
      slug = slug + '-' + Date.now();
    }
    trainer.slug = slug;
  }

  let photo = trainer.photo;

  if (req.file) {
    if (trainer.photo.publicId) {
      await deleteFromCloudinary(trainer.photo.publicId);
    }
    photo = await uploadToCloudinary(req.file.path, 'trainers');
  }

  trainer.name = name || trainer.name;
  trainer.photo = photo;
  trainer.experience = experience || trainer.experience;
  trainer.specialization = specialization || trainer.specialization;
  trainer.bio = bio || trainer.bio;
  trainer.socialLinks = socialLinks ? JSON.parse(socialLinks) : trainer.socialLinks;
  trainer.isActive = isActive !== undefined ? isActive : trainer.isActive;

  const updatedTrainer = await trainer.save();
  res.json(updatedTrainer);
};

const deleteTrainer = async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);

  if (!trainer) {
    return res.status(404).json({ message: 'Trainer not found' });
  }

  if (trainer.photo.publicId) {
    await deleteFromCloudinary(trainer.photo.publicId);
  }

  await trainer.deleteOne();
  res.json({ message: 'Trainer removed' });
};

module.exports = { getTrainers, getTrainerBySlug, createTrainer, updateTrainer, deleteTrainer };
