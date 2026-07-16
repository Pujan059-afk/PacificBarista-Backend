import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome, FiBook, FiUsers, FiImage, FiMessageSquare,
  FiMail, FiStar, FiLogOut, FiMenu, FiX, FiShield
} from 'react-icons/fi';

const sidebarLinks = [
  { path: '/admin-pacific/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/admin-pacific/courses', label: 'Courses', icon: FiBook },
  { path: '/admin-pacific/blogs', label: 'Blogs', icon: FiMessageSquare },
  { path: '/admin-pacific/trainers', label: 'Trainers', icon: FiUsers },
  { path: '/admin-pacific/testimonials', label: 'Testimonials', icon: FiStar },
  { path: '/admin-pacific/gallery', label: 'Gallery', icon: FiImage },
  { path: '/admin-pacific/enrollments', label: 'Enrollments', icon: FiUsers },
  { path: '/admin-pacific/certificates', label: 'Certificates', icon: FiShield },
  { path: '/admin-pacific/contacts', label: 'Contacts', icon: FiMail },
];

const AdminLayout = () => {
  const { user, isAuthenticated, admin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !admin) {
        navigate('/admin-pacific', { replace: true });
      }
    }
  }, [loading, isAuthenticated, admin, navigate]);

  useEffect(() => {
    if (mobile) setSidebarOpen(false);
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !admin) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin-pacific', { replace: true });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <h2 className="font-heading text-xl font-bold text-white">Pacific Barista</h2>
        <p className="font-body text-white/40 text-xs mt-0.5">Admin Panel</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg font-body text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <link.icon className="w-4 h-4 shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-body font-medium text-sm">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-body text-sm truncate">{user?.name || 'Admin'}</p>
            <p className="text-white/40 font-body text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-body text-sm text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <FiLogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Admin - Pacific Barista</title></Helmet>
      <div className="admin-wrapper min-h-screen bg-cream flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-primary fixed inset-y-0 left-0 z-30">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && mobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {sidebarOpen && mobile && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-primary lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
          {/* Top header */}
          <header className="sticky top-0 z-20 bg-white border-b border-primary/5 px-4 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/5 text-primary"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <h3 className="font-heading text-lg text-primary font-semibold">
                {sidebarLinks.find((l) => location.pathname === l.path)?.label || 'Dashboard'}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-sm text-text/60 hidden sm:block">
                {user?.name || 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-text/40 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
