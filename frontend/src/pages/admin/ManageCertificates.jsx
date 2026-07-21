import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiPlus, FiTrash2, FiEdit2, FiCopy, FiX, FiSearch, FiImage } from 'react-icons/fi';

const emptyForm = {
  certificateId: '',
  studentName: '',
  courseName: '',
  issueDate: '',
};

const ManageCertificates = () => {
  const { showToast } = useApp();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates');
      setCertificates(res.data?.certificates || res.data || []);
    } catch (err) {
      showToast('Failed to load certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setPhotoPreview('');
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await api.get(`/certificates/${id}`);
      const c = res.data;
      setEditId(id);
      setForm({
        certificateId: c.certificateId || '',
        studentName: c.studentName || '',
        courseName: c.courseName || '',
        issueDate: c.issueDate ? c.issueDate.slice(0, 10) : '',
      });
      setPhotoFile(null);
      setPhotoPreview(c.photo?.url || '');
      setModalOpen(true);
    } catch {
      showToast('Failed to load certificate', 'error');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('certificateId', form.certificateId);
      formData.append('studentName', form.studentName);
      formData.append('courseName', form.courseName);
      formData.append('issueDate', form.issueDate);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      if (editId) {
        await api.put(`/certificates/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Certificate updated', 'success');
      } else {
        await api.post('/certificates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Certificate created', 'success');
      }
      setModalOpen(false);
      fetchCertificates();
    } catch (err) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/certificates/${deleteId}`);
      setCertificates((prev) => prev.filter((c) => c._id !== deleteId));
      showToast('Certificate deleted', 'success');
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    showToast('Certificate ID copied', 'success');
  };

  const filtered = certificates.filter((c) =>
    c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    c.certificateId?.toLowerCase().includes(search.toLowerCase()) ||
    c.courseName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <Helmet><title>Manage Certificates - Pacific Barista Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Certificates</h1>
          <p className="font-body text-text/60 text-sm mt-1">Issue & manage student certificates</p>
        </div>
        <Button onClick={openCreate} icon={FiPlus}>Issue Certificate</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6">
        <div className="relative max-w-md mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
          <input
            type="text"
            placeholder="Search by name, ID, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-text/40">No certificates found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/5">
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Certificate ID</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Student</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Course</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden sm:table-cell">Issue Date</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Status</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-primary/5 last:border-0 hover:bg-cream/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-accent font-medium">{c.certificateId}</span>
                        <button onClick={() => handleCopy(c.certificateId)} className="p-1 rounded hover:bg-primary/5 text-text/30 hover:text-accent transition-colors" title="Copy ID">
                          <FiCopy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-body text-sm text-text font-medium">{c.studentName}</p>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell font-body text-sm text-text/70">{c.courseName}</td>
                    <td className="py-3 pr-4 hidden sm:table-cell font-body text-sm text-text/50">
                      {new Date(c.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-body ${c.status === 'Valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c._id)} className="p-2 rounded-lg hover:bg-accent/10 text-text/40 hover:text-accent transition-colors" title="Edit">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(c._id)} className="p-2 rounded-lg hover:bg-red-50 text-text/40 hover:text-red-500 transition-colors" title="Delete">
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
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg font-bold text-primary">
                  {editId ? 'Edit Certificate' : 'Issue Certificate'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-primary/5 text-text/40 hover:text-text">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block font-body text-sm text-text/60 mb-1.5">Certificate ID (optional)</label>
                  <input
                    type="text"
                    value={form.certificateId}
                    onChange={(e) => setForm({ ...form, certificateId: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent font-mono tracking-wider uppercase"
                    placeholder="Leave empty to auto-generate (PBC-XXXX-XXXX)"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-text/60 mb-1.5">Student Name</label>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-text/60 mb-1.5">Course Name</label>
                  <input
                    type="text"
                    required
                    value={form.courseName}
                    onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    placeholder="e.g. Professional Barista Diploma"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-text/60 mb-1.5">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-text/60 mb-1.5">Photo (optional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="cert-photo"
                  />
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-primary/10" />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="cert-photo"
                      className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-primary/15 rounded-lg cursor-pointer hover:border-accent/50 hover:bg-cream/50 transition-colors"
                    >
                      <FiImage className="w-8 h-8 text-text/20 mb-2" />
                      <span className="font-body text-xs text-text/40">Upload</span>
                    </label>
                  )}
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5">Cancel</button>
                  <Button type="submit" size="sm" loading={saving}>{editId ? 'Update' : 'Issue'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Delete Certificate</h3>
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

export default ManageCertificates;
