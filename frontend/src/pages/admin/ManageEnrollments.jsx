import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import { FiEye, FiCheck, FiX, FiDollarSign, FiSearch, FiClock } from 'react-icons/fi';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const ManageEnrollments = () => {
  const { showToast } = useApp();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewItem, setViewItem] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/enrollments');
      setEnrollments(res.data?.enrollments || res.data || []);
    } catch (err) {
      showToast('Failed to load enrollments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setProcessing(id);
    try {
      await api.put(`/enrollments/${id}`, { status });
      setEnrollments((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status } : e))
      );
      showToast(`Enrollment ${status} successfully`, 'success');
      if (viewItem?._id === id) setViewItem((prev) => prev ? { ...prev, status } : prev);
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const filtered = enrollments.filter((e) => {
    const matchesSearch =
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      e.phone?.includes(search);
    const matchesStatus = statusFilter ? e.status?.toLowerCase() === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageTransition>
      <Helmet><title>Manage Enrollments - Pacific Barista Admin</title></Helmet>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Enrollments</h1>
        <p className="font-body text-text/60 text-sm mt-1">Manage student enrollments</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
            <input
              type="text"
              placeholder="Search by name, email, course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cream border border-primary/10 rounded-lg text-text font-body text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="flex gap-2">
            {['', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg font-body text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-accent text-white'
                    : 'bg-primary/5 text-text/60 hover:bg-primary/10'
                }`}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign className="w-12 h-12 mx-auto text-text/20 mb-3" />
            <p className="font-body text-text/40">No enrollments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/5">
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Student</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">Course</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4 hidden sm:table-cell">Phone</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3 pr-4">Status</th>
                  <th className="font-body text-xs text-text/50 uppercase tracking-wider pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enr, i) => (
                  <motion.tr
                    key={enr._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-primary/5 last:border-0 hover:bg-cream/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div>
                        <p className="font-body text-sm text-text font-medium">{enr.name || enr.studentName}</p>
                        <p className="font-body text-xs text-text/40">{enr.email}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell font-body text-sm text-text/70">
                      {enr.courseName || enr.course?.title || 'N/A'}
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell font-body text-sm text-text/50">{enr.phone || 'N/A'}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium font-body ${statusStyles[enr.status?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                        {enr.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewItem(enr)}
                          className="p-2 rounded-lg hover:bg-accent/10 text-text/40 hover:text-accent transition-colors"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {enr.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(enr._id, 'Approved')}
                              disabled={processing === enr._id}
                              className="p-2 rounded-lg hover:bg-green-50 text-text/40 hover:text-green-500 transition-colors"
                              title="Approve"
                            >
                              {processing === enr._id ? (
                                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FiCheck className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleStatusChange(enr._id, 'Rejected')}
                              disabled={processing === enr._id}
                              className="p-2 rounded-lg hover:bg-red-50 text-text/40 hover:text-red-500 transition-colors"
                              title="Reject"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
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
              className="bg-white rounded-xl w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary/5">
                <h2 className="font-heading text-lg font-bold text-primary">Enrollment Details</h2>
                <button onClick={() => setViewItem(null)} className="p-1 rounded-lg hover:bg-primary/5 text-text/40 hover:text-text transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Name</p>
                    <p className="font-body text-sm text-text font-medium">{viewItem.name || viewItem.studentName}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Status</p>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium font-body mt-1 ${statusStyles[viewItem.status?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                      {viewItem.status || 'Pending'}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Email</p>
                    <p className="font-body text-sm text-text">{viewItem.email}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Phone</p>
                    <p className="font-body text-sm text-text">{viewItem.phone || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Course</p>
                    <p className="font-body text-sm text-text">{viewItem.courseName || viewItem.course?.title || 'N/A'}</p>
                  </div>
                  {viewItem.message && (
                    <div className="col-span-2">
                      <p className="font-body text-xs text-text/40 uppercase tracking-wider">Message</p>
                      <p className="font-body text-sm text-text/70 bg-cream p-3 rounded-lg mt-1">{viewItem.message}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="font-body text-xs text-text/40 uppercase tracking-wider">Submitted</p>
                    <p className="font-body text-sm text-text/50">
                      {viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                {viewItem.status === 'Pending' && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      loading={processing === viewItem._id}
                      onClick={() => handleStatusChange(viewItem._id, 'Approved')}
                      className="flex-1 justify-center"
                    >
                      Approve
                    </Button>
                    <button
                      onClick={() => handleStatusChange(viewItem._id, 'Rejected')}
                      disabled={processing === viewItem._id}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-red-200 text-red-500 font-body text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default ManageEnrollments;
