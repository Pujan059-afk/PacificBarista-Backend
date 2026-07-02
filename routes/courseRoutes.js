const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
router.post('/', auth, upload.single('image'), createCourse);
router.put('/:id', auth, upload.single('image'), updateCourse);
router.delete('/:id', auth, deleteCourse);

module.exports = router;
