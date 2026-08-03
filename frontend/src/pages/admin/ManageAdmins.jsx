import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiUserPlus, FiTrash2, FiX, FiSearch, FiShield, FiUser, FiEdit2 } from 'react-icons/fi';

const ManageAdmins = () => {
  const { showToast } = useApp();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [editFormData, setEditFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admins');
      setAdmins(res.data?.admins || res.data || []);
    } catch (err) {
      showToast('Failed to load admins', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/admins', formData);
      setAdmins((prev) => [res.data.admin, ...prev]);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      setShowForm(false);
      setShowCreatePassword(false);
      showToast('Admin created successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to create admin', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setEditFormData({ name: admin.name, email: admin.email, password: '', role: admin.role });
    setShowEditPassword(false);
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.email) {
      showToast('Name and email are required', 'error');
      return;
    }
    setUpdating(true);
    try {
      const payload = { name: editFormData.name, email: editFormData.email, role: editFormData.role };
      if (editFormData.password) payload.password = editFormData.password;
      const res = await api.put(`/admins/${editAdmin._id}`, payload);
      setAdmins((prev) => prev.map((a) => (a._id === editAdmin._id ? res.data.admin : a)));
      setShowEditForm(false);
      setEditAdmin(null);
      setEditFormData({ name: '', email: '', password: '', role: 'admin' });
      showToast('Admin updated successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update admin', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/admins/${deleteId}`);
      setAdmins((prev) => prev.filter((a) => a._id !== deleteId));
      showToast('Admin deleted successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to delete admin', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.role?.toLowerCase().includes(search.toLowerCase())
  );

  const PasswordInput = ({ value, onChange, show, onToggle, placeholder, id }) => (
    <div className="flex items-center bg-cream border border-primary/10 rounded-lg transition-all duration-300 focus-within:border-accent">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="new-password"
        className="flex-1 px-4 py-2.5 bg-transparent text-text font-body text-sm outline-none placeholder:text-text/30"
        minLength={6}
      />
      <span
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className="px-3 py-2.5 cursor-pointer select-none text-text/40 hover:text-accent transition-colors shrink-0"
        style={{ lineHeight: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {show ? (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </>
          ) : (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </span>
    </div>
  );

  return (
    <PageTransition>
      <Helmet><title>Manage Admins - Pacific Barista Admin</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Manage Admins</h1>
          <p className="font-body text-text/60 text-sm mt-1">Add, view, and remove admin accounts</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <FiUserPlus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6">
        <div className="relative mb-4 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
          <input
            type="text"
            placeholder="Search admins..."
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
            <FiUser className="w-12 h-12 mx-auto text-text/20 mb-3" />
            <p className="font-body text-text/40">No admins found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 pr-4 font-semibold">Name</th>
                  <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 pr-4 font-semibold">Email</th>
                  <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 pr-4 font-semibold">Role</th>
                  <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 pr-4 font-semibold">Joined</th>
                  <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((admin, i) => (
                  <motion.tr
                    key={admin._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-primary/5 last:border-0 hover:bg-primary/[0.02] transition-colors"
                  >
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                          <span className="font-body text-xs font-medium text-text/60">
                            {admin.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <span className="font-body text-sm text-text font-medium">{admin.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 font-body text-sm text-text/60">{admin.email}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold font-body ${
                        admin.role === 'superadmin'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {admin.role === 'superadmin' && <FiShield className="w-3 h-3" />}
                        {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-body text-xs text-text/40 whitespace-nowrap">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="p-2 rounded-lg hover:bg-primary/5 text-text/30 hover:text-accent transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        {admin._id !== user?._id && (
                          <button
                            onClick={() => setDeleteId(admin._id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-text/30 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary/5">
                <h2 className="font-heading text-lg font-bold text-primary">Add New Admin</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-primary/5 text-text/40 hover:text-text transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block font-body text-sm font-medium text-primary mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-primary mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-primary mb-1">Password</label>
                  <PasswordInput
                    id="create-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    show={showCreatePassword}
                    onToggle={() => setShowCreatePassword((v) => !v)}
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-primary mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5"
                  >
                    Cancel
                  </button>
                  <Button type="submit" loading={submitting} size="sm">
                    Create Admin
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Admin Modal */}
      <AnimatePresence>
        {showEditForm && editAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary/5">
                <h2 className="font-heading text-lg font-bold text-primary">Edit Admin</h2>
                <button onClick={() => setShowEditForm(false)} className="p-1 rounded-lg hover:bg-primary/5 text-text/40 hover:text-text transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block font-body text-sm font-medium text-primary mb-1">Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-primary mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-primary mb-1">Password <span className="text-text/40 font-normal">(leave blank to keep current)</span></label>
                  <PasswordInput
                    id="edit-password"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    show={showEditPassword}
                    onToggle={() => setShowEditPassword((v) => !v)}
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-primary mb-1">Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 rounded-lg font-body text-sm text-text/60 hover:bg-primary/5"
                  >
                    Cancel
                  </button>
                  <Button type="submit" loading={updating} size="sm">
                    Update Admin
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
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
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Delete Admin</h3>
              <p className="font-body text-sm text-text/60 mb-2">Are you sure you want to delete this admin?</p>
              <p className="font-body text-xs text-text/40 mb-6">Their uploaded content will be preserved and not deleted.</p>
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

export default ManageAdmins;
