import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import PageTransition from '../../components/common/PageTransition';
import {
  FiBook, FiUsers, FiMessageSquare, FiTrendingUp,
  FiEye, FiPlus, FiStar, FiShield, FiCalendar
} from 'react-icons/fi';

const gradients = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

const StatCard = ({ icon: Icon, label, value, gradient, delay = 0, prefix }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white rounded-xl p-5 shadow-sm border border-primary/5 hover:shadow-md transition-all duration-300 group cursor-default"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-body text-xs text-text/50 uppercase tracking-wider">{label}</p>
        <p className="font-heading text-2xl font-bold text-primary mt-1.5 tabular-nums">
          {prefix}{value}
        </p>
      </div>
      <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </motion.div>
);

const QuickActionBtn = ({ to, icon: Icon, label, desc, gradient }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 hover:border-transparent hover:shadow-md transition-all duration-300 group bg-white"
  >
    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="font-body text-sm font-semibold text-primary">{label}</p>
      <p className="font-body text-xs text-text/40">{desc}</p>
    </div>
  </Link>
);

const Skeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-primary/5">
          <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
          <div className="h-7 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    enrollments: 0,
    blogs: 0,
    contacts: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes, blogsRes, contactsRes] = await Promise.all([
          api.get('/courses'),
          api.get('/enrollments?limit=5'),
          api.get('/blogs'),
          api.get('/contact'),
        ]);
        setStats({
          courses: coursesRes.data?.courses?.length || coursesRes.data?.length || 0,
          enrollments: enrollmentsRes.data?.total || enrollmentsRes.data?.enrollments?.length || 0,
          blogs: blogsRes.data?.blogs?.length || blogsRes.data?.length || 0,
          contacts: contactsRes.data?.messages?.length || contactsRes.data?.length || 0,
        });
        setRecentEnrollments(enrollmentsRes.data?.enrollments?.slice(0, 5) || enrollmentsRes.data?.slice(0, 5) || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Skeleton />;

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return `px-2.5 py-0.5 rounded-full text-xs font-semibold font-body ${styles[status] || 'bg-gray-100 text-gray-700'}`;
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Dashboard - Pacific Barista Admin</title>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E☕%3C/text%3E%3C/svg%3E" />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Dashboard</h1>
          <p className="font-body text-text/50 text-sm mt-1">Overview of your academy</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-primary/5 text-xs text-text/50 font-body">
          <FiCalendar className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard icon={FiBook} label="Total Courses" value={stats.courses} gradient={gradients.blue} delay={0} />
        <StatCard icon={FiTrendingUp} label="Total Enrollments" value={stats.enrollments} gradient={gradients.green} delay={0.1} />
        <StatCard icon={FiMessageSquare} label="Blog Posts" value={stats.blogs} gradient={gradients.purple} delay={0.2} />
        <StatCard icon={FiUsers} label="Contact Messages" value={stats.contacts} gradient={gradients.orange} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-primary/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-base font-bold text-primary">Recent Enrollments</h2>
            <Link
              to="/admin-pacific/enrollments"
              className="flex items-center gap-1 text-xs font-body text-accent hover:text-accent/70 transition-colors font-medium"
            >
              View All <FiEye className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <FiUsers className="w-8 h-8 text-text/20 mx-auto mb-2" />
              <p className="font-body text-text/30 text-sm">No enrollments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-primary/10">
                    <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 pr-4 font-semibold">Student</th>
                    <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 pr-4 font-semibold">Course</th>
                    <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 pr-4 font-semibold">Status</th>
                    <th className="font-body text-xs text-text/40 uppercase tracking-wider pb-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((enr, i) => (
                    <motion.tr
                      key={enr._id || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-primary/5 last:border-0 hover:bg-primary/[0.02] transition-colors"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center">
                            <span className="font-body text-xs font-medium text-text/60">
                              {enr.fullName.charAt(0)}
                            </span>
                          </div>
                          <span className="font-body text-sm text-text font-medium">{enr.fullName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-body text-sm text-text/60">{enr.courseName || enr.course?.title || 'N/A'}</td>
                      <td className="py-3.5 pr-4">
                        <span className={getStatusBadge(enr.status)}>{enr.status || 'pending'}</span>
                      </td>
                      <td className="py-3.5 font-body text-xs text-text/40 whitespace-nowrap">
                        {enr.createdAt ? new Date(enr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
            <h2 className="font-heading text-base font-bold text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickActionBtn to="/admin-pacific/courses/new" icon={FiPlus} label="Add Course" desc="Create a new course" gradient="from-blue-500 to-blue-600" />
              <QuickActionBtn to="/admin-pacific/blogs/new" icon={FiPlus} label="Add Blog" desc="Write a new post" gradient="from-purple-500 to-purple-600" />
              <QuickActionBtn to="/admin-pacific/enrollments" icon={FiEye} label="Enrollments" desc="Manage enrollments" gradient="from-emerald-500 to-emerald-600" />
              <QuickActionBtn to="/admin-pacific/testimonials" icon={FiStar} label="Testimonials" desc="Manage reviews" gradient="from-amber-500 to-amber-600" />
              <QuickActionBtn to="/admin-pacific/gallery" icon={FiPlus} label="Gallery" desc="Upload images" gradient="from-orange-500 to-orange-600" />
              <QuickActionBtn to="/admin-pacific/certificates" icon={FiShield} label="Certificates" desc="Issue certificates" gradient="from-indigo-500 to-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6">
            <h2 className="font-heading text-base font-bold text-primary mb-4">At a Glance</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/[0.02]">
                <span className="font-body text-sm text-text/60">Courses</span>
                <span className="font-heading font-bold text-primary tabular-nums">{stats.courses}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/[0.02]">
                <span className="font-body text-sm text-text/60">Enrollments</span>
                <span className="font-heading font-bold text-primary tabular-nums">{stats.enrollments}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/[0.02]">
                <span className="font-body text-sm text-text/60">Blog Posts</span>
                <span className="font-heading font-bold text-primary tabular-nums">{stats.blogs}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/[0.02]">
                <span className="font-body text-sm text-text/60">Contact Messages</span>
                <span className="font-heading font-bold text-primary tabular-nums">{stats.contacts}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
