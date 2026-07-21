const express = require('express');
const router = express.Router();
const {
  verifyCertificate,
  createCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/verify', verifyCertificate);
router.post('/', auth, upload.single('photo'), createCertificate);
router.get('/', auth, getCertificates);
router.get('/:id', auth, getCertificate);
router.put('/:id', auth, upload.single('photo'), updateCertificate);
router.delete('/:id', auth, deleteCertificate);

module.exports = router;
