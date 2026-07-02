const Newsletter = require('../models/Newsletter');

const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const existing = await Newsletter.findOne({ email });

  if (existing) {
    if (existing.isSubscribed) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    existing.isSubscribed = true;
    await existing.save();
    return res.json({ message: 'Subscribed successfully' });
  }

  await Newsletter.create({ email });

  res.status(201).json({ message: 'Subscribed successfully' });
};

const getSubscribers = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const query = { isSubscribed: true };

  const total = await Newsletter.countDocuments(query);
  const subscribers = await Newsletter.find(query)
    .sort({ subscribedAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    subscribers,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const unsubscribe = async (req, res) => {
  const subscriber = await Newsletter.findById(req.params.id);

  if (!subscriber) {
    return res.status(404).json({ message: 'Subscriber not found' });
  }

  subscriber.isSubscribed = false;
  await subscriber.save();

  res.json({ message: 'Unsubscribed successfully' });
};

module.exports = { subscribe, getSubscribers, unsubscribe };
