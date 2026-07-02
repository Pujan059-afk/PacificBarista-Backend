const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
} = require('../controllers/blogController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getBlogs);
router.get('/all', auth, getAllBlogsAdmin);
router.get('/:slug', getBlogBySlug);
router.post('/', auth, upload.single('image'), createBlog);
router.put('/:id', auth, upload.single('image'), updateBlog);
router.delete('/:id', auth, deleteBlog);

module.exports = router;
