import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiBook } from 'react-icons/fi';

const ManageCourses = () => {
  const { showToast } = useApp();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data?.courses || res.data || []);
    } catch (err) {
      showToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/courses/${deleteId}`);
      setCourses((prev) => prev.filter((c) => c._id !== deleteId));
      showToast('Course deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete course', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.level?.toLowerCase().includes(search.toLowerCase())
  );

  const levelColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Advanced: 'bg-purple-100 text-purple-700',
  };

  return (
    <PageTransition>
      <Helmet><title>Manage Courses - Pacific Barista Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Courses</h1>
          <p className="font-body text-text/60 text-sm mt-1">Manage your training courses</p>
        </div>
        <Link to="/admin-pacific/courses/new">
          <Button icon={FiPlus} size="sm">
            Add New Course
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6">
        <div className="relative mb-4 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
          <input
            type="text"
            placeholder="Search courses..."
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
            <FiBook className="w-12 h-12 mx-auto text-text/20 mb-3" />
            <p className="font-body text-text/40">No courses found</p>
            {search && (
              <p className="font-body text-sm text-text/30 mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/5">
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Image</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Title</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Level</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Price</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden sm:table-cell">Featured</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course, i) => (
                  <motion.tr
                    key={course._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-primary/5 last:border-0 hover:bg-cream/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="w-12 h-9 rounded overflow-hidden bg-primary/5">
                        {course.image?.url ? (
                          <img src={course.image.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text/20">
                            <FiBook className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-body text-sm text-text font-medium max-w-[200px] truncate">
                      {course.title}
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium font-body ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
                        {course.level}
                      </span>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell font-body text-sm text-text">
                      {course.price ? `Rs. ${course.price}` : 'Free'}
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium font-body ${course.featured ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'}`}>
                        {course.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin-pacific/courses/edit/${course._id}`}
                          className="p-2 rounded-lg hover:bg-accent/10 text-text/40 hover:text-accent transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(course._id)}
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
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Delete Course</h3>
              <p className="font-body text-sm text-text/60 mb-6">
                Are you sure you want to delete this course? This action cannot be undone.
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

export default ManageCourses;
