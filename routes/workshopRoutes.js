const express = require('express');
const router = express.Router();
const {
  getWorkshops,
  getWorkshopBySlug,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} = require('../controllers/workshopController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getWorkshops);
router.get('/:slug', getWorkshopBySlug);
router.post('/', auth, upload.single('image'), createWorkshop);
router.put('/:id', auth, upload.single('image'), updateWorkshop);
router.delete('/:id', auth, deleteWorkshop);

module.exports = router;
