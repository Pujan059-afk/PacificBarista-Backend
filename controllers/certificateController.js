const Certificate = require('../models/Certificate');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/helpers');

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

  res.json({
    valid: certificate.status === 'Valid',
    certificate: {
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      issueDate: certificate.issueDate,
      photo: certificate.photo,
      status: certificate.status,
    },
  });
};

const createCertificate = async (req, res) => {
  let { certificateId, studentName, courseName, issueDate } = req.body;

  if (!certificateId) {
    let unique = false;
    while (!unique) {
      certificateId = Certificate.generateId();
      const exists = await Certificate.findOne({ certificateId });
      if (!exists) unique = true;
    }
  }

  let photo = { url: '', publicId: '' };
  if (req.file) {
    photo = await uploadToCloudinary(req.file.buffer, 'certificates');
  }

  const certificate = await Certificate.create({
    certificateId,
    studentName,
    courseName,
    issueDate,
    photo,
  });

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
  const { certificateId, studentName, courseName, issueDate, status } = req.body;

  if (certificateId) {
    const existing = await Certificate.findOne({ certificateId: certificateId.trim().toUpperCase() });
    if (existing && existing._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Certificate ID already exists' });
    }
  }

  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

  let photo = certificate.photo;
  if (req.file) {
    if (certificate.photo.publicId) {
      await deleteFromCloudinary(certificate.photo.publicId);
    }
    photo = await uploadToCloudinary(req.file.buffer, 'certificates');
  }

  certificate.certificateId = certificateId?.trim().toUpperCase() || certificate.certificateId;
  certificate.studentName = studentName || certificate.studentName;
  certificate.courseName = courseName || certificate.courseName;
  certificate.issueDate = issueDate || certificate.issueDate;
  certificate.status = status || certificate.status;
  certificate.photo = photo;

  const updated = await certificate.save();
  res.json(updated);
};

const deleteCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

  if (certificate.photo.publicId) {
    await deleteFromCloudinary(certificate.photo.publicId);
  }

  await certificate.deleteOne();
  res.json({ message: 'Certificate deleted' });
};

module.exports = {
  verifyCertificate,
  createCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
};
