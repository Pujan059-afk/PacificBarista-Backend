const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainerBySlug,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} = require('../controllers/trainerController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getTrainers);
router.get('/:slug', getTrainerBySlug);
router.post('/', auth, upload.single('photo'), createTrainer);
router.put('/:id', auth, upload.single('photo'), updateTrainer);
router.delete('/:id', auth, deleteTrainer);

module.exports = router;
