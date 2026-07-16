import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiX } from 'react-icons/fi';

const emptyForm = { studentName: '', course: '', content: '', rating: 5, isActive: true };

const ManageTestimonials = () => {
  const { showToast } = useApp();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
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
    setForm({ studentName: t.studentName || '', course: t.course || '', content: t.content || '', rating: t.rating || 5, isActive: t.isActive ?? true });
    setPhoto(null);
    setPhotoPreview(t.photo?.url || '');
    setModalOpen(true);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('studentName', form.studentName);
    fd.append('course', form.course);
    fd.append('content', form.content);
    fd.append('rating', form.rating);
    fd.append('isActive', form.isActive);
    if (photo) fd.append('photo', photo);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName?.trim() || !form.course?.trim() || !form.content?.trim()) {
      showToast('Name, course, and content are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const hasPhoto = Boolean(photo);
      const config = hasPhoto ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      if (editId) {
        await api.put(`/testimonials/${editId}`, hasPhoto ? buildFormData() : form, config);
        showToast('Testimonial updated', 'success');
      } else {
        await api.post('/testimonials', hasPhoto ? buildFormData() : form, config);
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

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FiStar key={i} className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-gray-300'}`} />
    ));

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl shadow-sm border border-primary/5 p-5"
            >
              <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                  {t.photo?.url ? (
                    <img src={t.photo.url} alt={t.studentName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="font-body font-medium text-accent text-sm">{t.studentName?.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-body text-sm font-medium text-text">{t.studentName}</p>
                    {t.course && <p className="font-body text-xs text-text/40">{t.course}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-accent/10 text-text/30 hover:text-accent transition-colors">
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(t._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text/30 hover:text-red-500 transition-colors">
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mb-2">{renderStars(t.rating)}</div>
              <p className="font-body text-sm text-text/70 italic">&ldquo;{t.content}&rdquo;</p>
            </motion.div>
          ))}
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
              className="bg-white rounded-xl w-full max-w-md shadow-xl"
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
                    placeholder="e.g. Professional"
                  />
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Photo (optional)</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setPhoto(file);
                        setPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                    onClick={() => document.getElementById('photo-input')?.click()}
                    className="relative w-24 h-24 rounded-xl border-2 border-dashed border-primary/20 hover:border-accent/50 bg-primary/[0.02] flex items-center justify-center cursor-pointer transition-colors overflow-hidden group"
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-6 h-6 mx-auto text-text/30 group-hover:text-accent/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-[10px] text-text/30 mt-1">Drop or click</p>
                      </div>
                    )}
                    <input
                      id="photo-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhoto(file);
                          setPhotoPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent min-h-[100px] resize-y"
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-primary/20 text-accent focus:ring-accent"
                  />
                  <span className="font-body text-sm text-text">Active</span>
                </label>
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

      {/* Delete */}
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
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5">Cancel</button>
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
