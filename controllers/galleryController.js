const Gallery = require('../models/Gallery');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/helpers');

const getGalleryImages = async (req, res) => {
  const { page = 1, limit = 20, category } = req.query;

  const query = { isActive: true };
  if (category) {
    query.category = category;
  }

  const total = await Gallery.countDocuments(query);
  const images = await Gallery.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    images,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const addGalleryImage = async (req, res) => {
  const { title, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const image = await uploadToCloudinary(req.file.path, 'gallery');

  const galleryImage = await Gallery.create({
    image,
    title,
    category,
  });

  res.status(201).json(galleryImage);
};

const deleteGalleryImage = async (req, res) => {
  const galleryImage = await Gallery.findById(req.params.id);

  if (!galleryImage) {
    return res.status(404).json({ message: 'Image not found' });
  }

  if (galleryImage.image.publicId) {
    await deleteFromCloudinary(galleryImage.image.publicId);
  }

  await galleryImage.deleteOne();
  res.json({ message: 'Image removed' });
};

module.exports = { getGalleryImages, addGalleryImage, deleteGalleryImage };
