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

router.post('/verify', verifyCertificate);
router.post('/', auth, createCertificate);
router.get('/', auth, getCertificates);
router.get('/:id', auth, getCertificate);
router.put('/:id', auth, updateCertificate);
router.delete('/:id', auth, deleteCertificate);

module.exports = router;
