const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const superAdminOnly = require('../middleware/superAdmin');
const { getAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../controllers/adminController');

router.get('/', auth, superAdminOnly, getAdmins);
router.post('/', auth, superAdminOnly, createAdmin);
router.put('/:id', auth, superAdminOnly, updateAdmin);
router.delete('/:id', auth, superAdminOnly, deleteAdmin);

module.exports = router;
