const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  res.status(201).json({ message: 'Message sent successfully', contact });
};

const getMessages = async (req, res) => {
  const { page = 1, limit = 20, isRead } = req.query;

  const query = {};
  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const total = await Contact.countDocuments(query);
  const messages = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    messages,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const markAsRead = async (req, res) => {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  res.json(message);
};

const deleteMessage = async (req, res) => {
  const message = await Contact.findById(req.params.id);

  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  await message.deleteOne();
  res.json({ message: 'Message removed' });
};

module.exports = { submitContact, getMessages, markAsRead, deleteMessage };
