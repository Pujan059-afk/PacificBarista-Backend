const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
} = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');

router.post('/', createEnrollment);
router.get('/', auth, getEnrollments);
router.get('/:id', auth, getEnrollment);
router.put('/:id', auth, updateEnrollmentStatus);
router.delete('/:id', auth, deleteEnrollment);

module.exports = router;
