import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiMail, FiTrash2, FiX, FiEye, FiSearch } from 'react-icons/fi';

const ManageContacts = () => {
  const { showToast } = useApp();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contact');
      setContacts(res.data?.messages || res.data?.contacts || res.data || []);
    } catch (err) {
      showToast('Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, read: true } : c)));
      if (viewItem?._id === id) setViewItem((prev) => prev ? { ...prev, read: true } : prev);
    } catch (err) {
      // silently fail
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/contact/${deleteId}`);
      setContacts((prev) => prev.filter((c) => c._id !== deleteId));
      showToast('Message deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleView = (item) => {
    setViewItem(item);
    if (!item.read) handleMarkRead(item._id);
  };

  const filtered = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <Helmet><title>Manage Contacts - Pacific Barista Admin</title></Helmet>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Contact Messages</h1>
        <p className="font-body text-text/60 text-sm mt-1">View and manage contact form submissions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6">
        <div className="relative mb-4 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
          <input
            type="text"
            placeholder="Search messages..."
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
            <FiMail className="w-12 h-12 mx-auto text-text/20 mb-3" />
            <p className="font-body text-text/40">No messages found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item, i) => (
              <motion.div
                key={item._id || i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                  item.read
                    ? 'bg-white border-primary/5 hover:bg-cream/50'
                    : 'bg-accent/5 border-accent/20 hover:bg-accent/10'
                }`}
                onClick={() => handleView(item)}
              >
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${item.read ? 'bg-transparent' : 'bg-accent'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-body text-sm font-medium text-text truncate">{item.name}</p>
                    <p className="font-body text-xs text-text/40 shrink-0">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <p className="font-body text-xs text-text/50 truncate">{item.email}</p>
                  {item.subject && (
                    <p className="font-body text-sm text-text/70 mt-1 truncate">{item.subject}</p>
                  )}
                  <p className="font-body text-sm text-text/50 mt-1 line-clamp-2">{item.message}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(item._id); }}
                  className="p-2 rounded-lg hover:bg-red-50 text-text/30 hover:text-red-500 transition-colors shrink-0"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setViewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-lg shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary/5">
                <h2 className="font-heading text-lg font-bold text-primary">Message Details</h2>
                <button onClick={() => setViewItem(null)} className="p-1 rounded-lg hover:bg-primary/5 text-text/40 hover:text-text transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Name</p>
                    <p className="font-body text-sm text-text font-medium">{viewItem.name}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Date</p>
                    <p className="font-body text-sm text-text/50">
                      {viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Email</p>
                    <a href={`mailto:${viewItem.email}`} className="font-body text-sm text-accent hover:underline">
                      {viewItem.email}
                    </a>
                  </div>
                  {viewItem.subject && (
                    <div className="col-span-2">
                      <p className="font-body text-xs text-text/40 uppercase tracking-wider">Subject</p>
                      <p className="font-body text-sm text-text">{viewItem.subject}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Message</p>
                    <p className="font-body text-sm text-text/70 bg-cream p-4 rounded-lg mt-1 whitespace-pre-wrap">{viewItem.message}</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <a
                    href={`mailto:${viewItem.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-body text-sm font-medium hover:bg-accent/90 transition-colors"
                  >
                    <FiMail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              </div>
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
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Delete Message</h3>
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

export default ManageContacts;
