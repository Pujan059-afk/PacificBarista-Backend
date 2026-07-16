import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiMessageSquare } from 'react-icons/fi';

const ManageBlogs = () => {
  const { showToast } = useApp();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs/all');
      setBlogs(res.data?.blogs || res.data || []);
    } catch (err) {
      showToast('Failed to load blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/blogs/${deleteId}`);
      setBlogs((prev) => prev.filter((b) => b._id !== deleteId));
      showToast('Blog deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete blog', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <Helmet><title>Manage Blogs - Pacific Barista Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Blogs</h1>
          <p className="font-body text-text/60 text-sm mt-1">Manage blog posts</p>
        </div>
        <Link to="/admin-pacific/blogs/new">
          <Button icon={FiPlus} size="sm">Add New Blog</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6">
        <div className="relative mb-4 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,155,60,0.1)]"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-12 h-12 mx-auto text-text/20 mb-3" />
            <p className="font-body text-text/40">No blogs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/5">
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden sm:table-cell">Image</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Title</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Category</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Date</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((blog, i) => (
                  <motion.tr
                    key={blog._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-primary/5 last:border-0 hover:bg-cream/50 transition-colors"
                  >
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <div className="w-12 h-9 rounded overflow-hidden bg-primary/5">
                        {blog.image?.url ? (
                          <img src={blog.image.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text/20">
                            <FiMessageSquare className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-body text-sm text-text font-medium max-w-[250px] truncate">
                      {blog.title}
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium font-body">
                        {blog.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell font-body text-sm text-text/50">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin-pacific/blogs/edit/${blog._id}`}
                          className="p-2 rounded-lg hover:bg-accent/10 text-text/40 hover:text-accent transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(blog._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-text/40 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Delete Blog</h3>
              <p className="font-body text-sm text-text/60 mb-6">
                Are you sure you want to delete this blog post? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5 transition-colors"
                >
                  Cancel
                </button>
                <Button variant="secondary" size="sm" loading={deleting} onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default ManageBlogs;
