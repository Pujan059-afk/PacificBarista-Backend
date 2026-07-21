const Certificate = require('../models/Certificate');
const QRCode = require('qrcode');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/helpers');

const CERTIFICATE_PAGE_URL = 'https://pacificbarista.com.np/certificate';

const generateQRCode = async (certificate) => {
  const url = `${CERTIFICATE_PAGE_URL}/${certificate.certificateId}`;
  const buffer = await QRCode.toBuffer(url, {
    width: 400,
    margin: 2,
    color: { dark: '#1a1a1a', light: '#ffffff' },
  });
  return uploadToCloudinary(buffer, 'certificates/qr');
};

const getPublicCertificate = async (req, res) => {
  const certificate = await Certificate.findOne({
    certificateId: req.params.code.trim().toUpperCase(),
  });
  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
  if (certificate.status !== 'Valid') return res.status(404).json({ message: 'Certificate is not valid' });

  if (!certificate.qrCode?.url || certificate.qrCode.url.includes('/verify')) {
    if (certificate.qrCode.publicId) await deleteFromCloudinary(certificate.qrCode.publicId);
    certificate.qrCode = await generateQRCode(certificate);
    await certificate.save();
  }

  res.json({
    certificateId: certificate.certificateId,
    studentName: certificate.studentName,
    courseName: certificate.courseName,
    issueDate: certificate.issueDate,
    description: certificate.description,
    photo: certificate.photo,
    qrCode: certificate.qrCode,
    status: certificate.status,
  });
};

const verifyCertificate = async (req, res) => {
  const { certificateId } = req.body;

  if (!certificateId || !certificateId.trim()) {
    return res.status(400).json({ message: 'Certificate ID is required' });
  }

  const certificate = await Certificate.findOne({
    certificateId: certificateId.trim().toUpperCase(),
  });

  if (!certificate) {
    return res.status(404).json({
      valid: false,
      message: 'Certificate not found. Please check the ID and try again.',
    });
  }

  if (!certificate.qrCode?.url || certificate.qrCode.url.includes('/verify')) {
    if (certificate.qrCode?.publicId) await deleteFromCloudinary(certificate.qrCode.publicId);
    certificate.qrCode = await generateQRCode(certificate);
    await certificate.save();
  }

  res.json({
    valid: certificate.status === 'Valid',
    certificate: {
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      issueDate: certificate.issueDate,
      description: certificate.description,
      photo: certificate.photo,
      qrCode: certificate.qrCode,
      status: certificate.status,
    },
  });
};

const createCertificate = async (req, res) => {
  let { certificateId, studentName, courseName, issueDate, description } = req.body;

  if (!certificateId) {
    let unique = false;
    while (!unique) {
      certificateId = Certificate.generateId();
      const exists = await Certificate.findOne({ certificateId });
      if (!exists) unique = true;
    }
  } else {
    const exists = await Certificate.findOne({ certificateId: certificateId.trim().toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: 'Certificate ID already exists' });
    }
  }

  let photo = { url: '', publicId: '' };
  if (req.file) {
    photo = await uploadToCloudinary(req.file.buffer, 'certificates');
  }

  const certificate = await Certificate.create({
    certificateId: certificateId.trim().toUpperCase(),
    studentName,
    courseName,
    issueDate,
    description: description || '',
    photo,
  });

  certificate.qrCode = await generateQRCode(certificate);
  await certificate.save();

  res.status(201).json(certificate);
};

const getCertificates = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const total = await Certificate.countDocuments();
  const certificates = await Certificate.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ certificates, total, page: Number(page), pages: Math.ceil(total / limit) });
};

const getCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
  res.json(certificate);
};

const updateCertificate = async (req, res) => {
  const { certificateId, studentName, courseName, issueDate, description, status } = req.body;

  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

  const newCertId = certificateId?.trim().toUpperCase();
  if (newCertId && newCertId !== certificate.certificateId) {
    const existing = await Certificate.findOne({ certificateId: newCertId });
    if (existing) {
      return res.status(400).json({ message: 'Certificate ID already exists' });
    }
    certificate.certificateId = newCertId;
  }

  let photo = certificate.photo;
  if (req.file) {
    if (certificate.photo.publicId) {
      await deleteFromCloudinary(certificate.photo.publicId);
    }
    photo = await uploadToCloudinary(req.file.buffer, 'certificates');
  }

  certificate.studentName = studentName || certificate.studentName;
  certificate.courseName = courseName || certificate.courseName;
  certificate.issueDate = issueDate || certificate.issueDate;
  certificate.description = description !== undefined ? description : certificate.description;
  certificate.status = status || certificate.status;
  certificate.photo = photo;

  if (certificate.qrCode.publicId) {
    await deleteFromCloudinary(certificate.qrCode.publicId);
  }
  certificate.qrCode = await generateQRCode(certificate);

  const updated = await certificate.save();
  res.json(updated);
};

const deleteCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

  if (certificate.photo.publicId) {
    await deleteFromCloudinary(certificate.photo.publicId);
  }
  if (certificate.qrCode.publicId) {
    await deleteFromCloudinary(certificate.qrCode.publicId);
  }

  await certificate.deleteOne();
  res.json({ message: 'Certificate deleted' });
};

const regenerateAllQRCodes = async (req, res) => {
  const certificates = await Certificate.find();
  let regenerated = 0;
  for (const cert of certificates) {
    if (!cert.qrCode?.url || cert.qrCode.url.includes('/verify')) {
      if (cert.qrCode?.publicId) await deleteFromCloudinary(cert.qrCode.publicId);
      cert.qrCode = await generateQRCode(cert);
      await cert.save();
      regenerated++;
    }
  }
  res.json({ total: certificates.length, regenerated });
};

module.exports = {
  getPublicCertificate,
  verifyCertificate,
  createCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
  regenerateAllQRCodes,
};
