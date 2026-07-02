const express = require('express');
const router = express.Router();
const {
  submitContact,
  getMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/contactController');
const auth = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', auth, getMessages);
router.put('/:id/read', auth, markAsRead);
router.delete('/:id', auth, deleteMessage);

module.exports = router;
