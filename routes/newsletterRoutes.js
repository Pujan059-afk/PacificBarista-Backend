const express = require('express');
const router = express.Router();
const {
  subscribe,
  getSubscribers,
  unsubscribe,
} = require('../controllers/newsletterController');
const auth = require('../middleware/auth');

router.post('/subscribe', subscribe);
router.get('/', auth, getSubscribers);
router.delete('/:id', auth, unsubscribe);

module.exports = router;
