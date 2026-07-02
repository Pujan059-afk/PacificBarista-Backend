const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getTestimonials);
router.post('/', auth, upload.single('photo'), createTestimonial);
router.put('/:id', auth, upload.single('photo'), updateTestimonial);
router.delete('/:id', auth, deleteTestimonial);

module.exports = router;
