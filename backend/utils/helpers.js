const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `pacific-barista/${folder}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error('Image upload failed'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

const formatContent = (text) => {
  if (!text) return '';
  const blocks = text.split(/\n\s*\n/).filter(b => b.trim());
  let html = '';
  for (const block of blocks) {
    const lines = block.split('\n').filter(l => l.trim());
    let inBullet = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^\d+[\.\)]\s/.test(trimmed)) {
        if (inBullet) { html += '</ul>'; inBullet = false; }
        html += `<p><strong>${trimmed}</strong></p>`;
      } else if (/^[-–—*]\s/.test(trimmed)) {
        if (!inBullet) { html += '<ul class="list-disc pl-6 space-y-1">'; inBullet = true; }
        html += `<li>${trimmed.replace(/^[-–—*]\s/, '')}</li>`;
      } else {
        if (inBullet) { html += '</ul>'; inBullet = false; }
        html += `<p>${trimmed}</p>`;
      }
    }
    if (inBullet) { html += '</ul>'; inBullet = false; }
  }
  return html;
};

module.exports = {
  slugify,
  generateToken,
  uploadToCloudinary,
  deleteFromCloudinary,
  formatContent,
};
