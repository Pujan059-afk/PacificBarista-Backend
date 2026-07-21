const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const { slugify, uploadToCloudinary, deleteFromCloudinary } = require('../utils/helpers');

const getBlogs = async (req, res) => {
  const { page = 1, limit = 10, search, category } = req.query;

  const query = { isPublished: { $in: [true, 'true'] } };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  const total = await Blog.countDocuments(query);
  const blogs = await Blog.find(query)
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    blogs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const getBlogBySlug = async (req, res) => {
  const { slug } = req.params;
  let blog = await Blog.findOne({ slug });
  if (!blog && mongoose.Types.ObjectId.isValid(slug)) {
    blog = await Blog.findById(slug);
  }
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  res.json(blog);
};

const createBlog = async (req, res) => {
  const { title, content, excerpt, author, category, tags, isPublished } = req.body;

  let slug = slugify(title);

  const existingSlug = await Blog.findOne({ slug });
  if (existingSlug) {
    slug = slug + '-' + Date.now();
  }

  let image = { url: '', publicId: '' };

  if (req.file) {
    image = await uploadToCloudinary(req.file.buffer, 'blogs');
  }

  let parsedTags = [];
  if (tags) {
    try {
      parsedTags = JSON.parse(tags);
    } catch {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }

  const publish = isPublished === true || isPublished === 'true';

  const blog = await Blog.create({
    title,
    slug,
    content,
    excerpt,
    image,
    author: author || 'Admin',
    category,
    tags: parsedTags,
    isPublished: publish,
    publishedAt: publish ? Date.now() : undefined,
  });

  res.status(201).json(blog);
};

const updateBlog = async (req, res) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const { title, content, excerpt, author, category, tags, isPublished } = req.body;

  if (title && title !== blog.title) {
    let slug = slugify(title);
    const existingSlug = await Blog.findOne({ slug, _id: { $ne: req.params.id } });
    if (existingSlug) {
      slug = slug + '-' + Date.now();
    }
    blog.slug = slug;
  }

  let image = blog.image;

  if (req.file) {
    if (blog.image.publicId) {
      await deleteFromCloudinary(blog.image.publicId);
    }
    image = await uploadToCloudinary(req.file.buffer, 'blogs');
  }

  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.excerpt = excerpt || blog.excerpt;
  blog.image = image;
  blog.author = author || blog.author;
  blog.category = category || blog.category;
  if (tags) {
    try {
      blog.tags = JSON.parse(tags);
    } catch {
      blog.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }

  if (isPublished !== undefined) {
    const publish = isPublished === true || isPublished === 'true';
    blog.isPublished = publish;
    blog.publishedAt = publish ? blog.publishedAt || Date.now() : undefined;
  }

  const updatedBlog = await blog.save();
  res.json(updatedBlog);
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (blog.image.publicId) {
    await deleteFromCloudinary(blog.image.publicId);
  }

  await blog.deleteOne();
  res.json({ message: 'Blog removed' });
};

const getAllBlogsAdmin = async (req, res) => {
  const { page = 1, limit = 10, search, category, isPublished } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (isPublished !== undefined) {
    query.isPublished = isPublished === 'true';
  }

  const total = await Blog.countDocuments(query);
  const blogs = await Blog.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    blogs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, getAllBlogsAdmin };
