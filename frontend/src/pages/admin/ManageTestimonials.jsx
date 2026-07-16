import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiUpload, FiX } from 'react-icons/fi';

const emptyForm = {
  studentName: '',
  course: '',
  content: '',
  rating: 5,
  isFeatured: false,
  isActive: true,
};

const ManageTestimonials = () => {
  const { showToast } = useApp();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials?limit=100');
      setTestimonials(res.data?.testimonials || res.data || []);
    } catch (err) {
      showToast('Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setPhoto(null);
    setPhotoPreview('');
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditId(t._id);
    setForm({
      studentName: t.studentName || '',
      course: t.course || '',
      content: t.content || '',
      rating: t.rating || 5,
      isFeatured: t.isFeatured ?? false,
      isActive: t.isActive ?? true,
    });
    setPhoto(null);
    setPhotoPreview(t.photo?.url || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName.trim() || !form.course.trim() || !form.content.trim()) {
      showToast('Name, course, and content are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('studentName', form.studentName);
      formData.append('course', form.course);
      formData.append('content', form.content);
      formData.append('rating', form.rating);
      formData.append('isFeatured', form.isFeatured);
      formData.append('isActive', form.isActive);
      if (photo) formData.append('photo', photo);

      if (editId) {
        await api.put(`/testimonials/${editId}`, formData);
        showToast('Testimonial updated', 'success');
      } else {
        await api.post('/testimonials', formData);
        showToast('Testimonial created', 'success');
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      showToast(err.message || 'Failed to save testimonial', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/testimonials/${deleteId}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== deleteId));
      showToast('Testimonial deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <PageTransition>
      <Helmet><title>Manage Testimonials - Pacific Barista Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Testimonials</h1>
          <p className="font-body text-text/60 text-sm mt-1">Manage student testimonials</p>
        </div>
        <Button icon={FiPlus} size="sm" onClick={openAdd}>Add Testimonial</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-primary/5">
          <FiStar className="w-12 h-12 mx-auto text-text/20 mb-3" />
          <p className="font-body text-text/40">No testimonials yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-primary/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/5">
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 p-4">Photo</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Name</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Course</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Rating</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Active</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t, i) => (
                <motion.tr
                  key={t._id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-primary/5 last:border-0 hover:bg-cream/50 transition-colors"
                >
                  <td className="py-3 pr-4 p-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/5">
                      {t.photo?.url ? (
                        <img src={t.photo.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/10">
                          <span className="font-body font-medium text-accent text-sm">{t.studentName?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-body text-sm text-text font-medium">{t.studentName}</td>
                  <td className="py-3 pr-4 hidden md:table-cell font-body text-sm text-text/70">{t.course || 'N/A'}</td>
                  <td className="py-3 pr-4 hidden md:table-cell">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <FiStar key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'text-accent fill-accent' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium font-body ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-accent/10 text-text/40 hover:text-accent transition-colors" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(t._id)} className="p-2 rounded-lg hover:bg-red-50 text-text/40 hover:text-red-500 transition-colors" title="Delete">
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary/5">
                <h2 className="font-heading text-lg font-bold text-primary">
                  {editId ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-primary/5 text-text/40 hover:text-text transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Student Name</label>
                  <input
                    type="text"
                    value={form.studentName}
                    onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    placeholder="Student name"
                  />
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Course</label>
                  <input
                    type="text"
                    value={form.course}
                    onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    placeholder="e.g. Professional Barista"
                  />
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent min-h-[80px] resize-y"
                    placeholder="Testimonial text..."
                  />
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setForm((p) => ({ ...p, rating: star }))}>
                        <FiStar className={`w-6 h-6 transition-colors ${star <= form.rating ? 'text-accent fill-accent' : 'text-gray-300 hover:text-accent/50'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Photo (optional)</label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-primary/10 overflow-hidden flex items-center justify-center bg-cream shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FiUpload className="w-5 h-5 text-text/20" />
                      )}
                    </div>
                    <label className="px-4 py-2 bg-cream border border-primary/10 rounded-lg cursor-pointer hover:border-accent/30 transition-colors font-body text-sm text-text">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f) { setPhoto(f); setPhotoPreview(URL.createObjectURL(f)); }
                        }}
                        className="hidden"
                      />
                    </label>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => { setPhoto(null); setPhotoPreview(''); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-text/30 hover:text-red-500 transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded border-primary/20 text-accent focus:ring-accent"
                    />
                    <span className="font-body text-sm text-text">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-primary/20 text-accent focus:ring-accent"
                    />
                    <span className="font-body text-sm text-text">Active</span>
                  </label>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5 transition-colors">
                    Cancel
                  </button>
                  <Button type="submit" size="sm" loading={saving}>
                    {editId ? 'Update' : 'Save'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
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
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Delete Testimonial</h3>
              <p className="font-body text-sm text-text/60 mb-6">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5 transition-colors">Cancel</button>
                <Button variant="secondary" size="sm" loading={deleting} onClick={handleDelete}>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default ManageTestimonials;
