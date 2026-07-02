const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
} = require('../controllers/galleryController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getGalleryImages);
router.post('/', auth, upload.single('image'), addGalleryImage);
router.delete('/:id', auth, deleteGalleryImage);

module.exports = router;
