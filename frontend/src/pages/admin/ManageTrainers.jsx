import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiUpload, FiX } from 'react-icons/fi';

const emptyForm = {
  name: '',
  specialization: '',
  bio: '',
  experience: '',
  socialLinks: { linkedin: '', twitter: '', instagram: '' },
  isActive: true,
};

const ManageTrainers = () => {
  const { showToast } = useApp();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await api.get('/trainers');
      setTrainers(res.data?.trainers || res.data || []);
    } catch (err) {
      showToast('Failed to load trainers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setImage(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await api.get(`/trainers/${id}`);
      const trainer = res.data?.trainer || res.data;
      setEditId(id);
      setForm({
        name: trainer.name || '',
        specialization: trainer.specialization || '',
        bio: trainer.bio || '',
        experience: trainer.experience?.toString() || '',
        socialLinks: trainer.socialLinks || { linkedin: '', twitter: '', instagram: '' },
        isActive: trainer.isActive ?? true,
      });
      if (trainer.photo?.url) setImagePreview(trainer.photo.url);
      setImage(null);
      setModalOpen(true);
    } catch (err) {
      showToast('Failed to load trainer', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        experience: parseInt(form.experience) || 0,
      };

      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (key === 'socialLinks') {
          formData.append(key, JSON.stringify(payload[key]));
        } else {
          formData.append(key, payload[key]);
        }
      });
      if (image) formData.append('photo', image);

      if (editId) {
        await api.put(`/trainers/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Trainer updated', 'success');
      } else {
        await api.post('/trainers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Trainer created', 'success');
      }
      setModalOpen(false);
      fetchTrainers();
    } catch (err) {
      showToast(err.message || 'Failed to save trainer', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/trainers/${deleteId}`);
      setTrainers((prev) => prev.filter((t) => t._id !== deleteId));
      showToast('Trainer deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete trainer', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <PageTransition>
      <Helmet><title>Manage Trainers - Pacific Barista Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Trainers</h1>
          <p className="font-body text-text/60 text-sm mt-1">Manage your training team</p>
        </div>
        <Button icon={FiPlus} size="sm" onClick={openAdd}>Add Trainer</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-primary/5">
          <FiUsers className="w-12 h-12 mx-auto text-text/20 mb-3" />
          <p className="font-body text-text/40">No trainers yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-primary/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/5">
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 p-4">Image</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Name</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Specialization</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Active</th>
                <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer, i) => (
                <motion.tr
                  key={trainer._id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-primary/5 last:border-0 hover:bg-cream/50 transition-colors"
                >
                  <td className="py-3 pr-4 p-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/5">
                      {trainer.photo?.url ? (
                        <img src={trainer.photo.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text/20">
                          <FiUsers className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-body text-sm text-text font-medium">{trainer.name}</td>
                  <td className="py-3 pr-4 hidden md:table-cell font-body text-sm text-text/70">{trainer.specialization || 'N/A'}</td>
                  <td className="py-3 pr-4 hidden md:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium font-body ${trainer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {trainer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(trainer._id)} className="p-2 rounded-lg hover:bg-accent/10 text-text/40 hover:text-accent transition-colors" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(trainer._id)} className="p-2 rounded-lg hover:bg-red-50 text-text/40 hover:text-red-500 transition-colors" title="Delete">
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
                  {editId ? 'Edit Trainer' : 'Add Trainer'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-primary/5 text-text/40 hover:text-text transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    placeholder="Trainer name"
                  />
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Specialization</label>
                  <input
                    type="text"
                    value={form.specialization}
                    onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    placeholder="e.g. Espresso Science & Latte Art"
                  />
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Experience (years)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent min-h-[80px] resize-y"
                    placeholder="Short biography"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-primary font-body font-medium text-sm mb-1.5">LinkedIn</label>
                    <input
                      type="text"
                      value={form.socialLinks.linkedin}
                      onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, linkedin: e.target.value } }))}
                      className="w-full px-3 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                      placeholder="url"
                    />
                  </div>
                  <div>
                    <label className="block text-primary font-body font-medium text-sm mb-1.5">Twitter</label>
                    <input
                      type="text"
                      value={form.socialLinks.twitter}
                      onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, twitter: e.target.value } }))}
                      className="w-full px-3 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                      placeholder="@handle"
                    />
                  </div>
                  <div>
                    <label className="block text-primary font-body font-medium text-sm mb-1.5">Instagram</label>
                    <input
                      type="text"
                      value={form.socialLinks.instagram}
                      onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, instagram: e.target.value } }))}
                      className="w-full px-3 py-2.5 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                      placeholder="@handle"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-primary font-body font-medium text-sm mb-1.5">Photo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-primary/10 overflow-hidden flex items-center justify-center bg-cream shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FiUpload className="w-5 h-5 text-text/20" />
                      )}
                    </div>
                    <label className="px-4 py-2 bg-cream border border-primary/10 rounded-lg cursor-pointer hover:border-accent/30 transition-colors font-body text-sm text-text">
                      Choose File
                      <input type="file" accept="image/*" onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) { setImage(f); setImagePreview(URL.createObjectURL(f)); }
                      }} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Delete Trainer</h3>
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

export default ManageTrainers;
