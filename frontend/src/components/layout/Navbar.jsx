import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import useScrollPosition from '../../hooks/useScrollPosition';
import { NAV_LINKS } from '../../utils/constants';
import Button from '../ui/Button';
import logo from '../../assets/pacificbarista.jpg';

const navVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, type: 'spring', stiffness: 100 },
  }),
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollY = useScrollPosition();
  const { pathname } = useLocation();

  const isScrolled = scrollY > 50;
  const isHomePage = pathname === '/';

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Pacific Barista" className="h-10 w-10 rounded-full object-cover" />
            <span className={`font-heading text-xl font-bold transition-colors duration-300 ${
              isScrolled || !isHomePage ? 'text-primary' : 'text-white'
            }`}>
              Pacific Barista
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium font-body rounded-lg transition-colors duration-200 ${
                  pathname === link.path
                    ? isScrolled || !isHomePage
                      ? 'text-accent'
                      : 'text-white'
                    : isScrolled || !isHomePage
                      ? 'text-text hover:text-accent'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                {pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-4 right-4 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link to="/enroll">
              <Button variant="primary" size="sm">
                Enroll Now
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled || !isHomePage ? 'text-primary' : 'text-white'
            }`}
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-primary/5 shadow-lg overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  custom={i}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-body text-sm font-medium transition-colors ${
                      pathname === link.path
                        ? 'text-accent bg-accent/5'
                        : 'text-text hover:text-accent hover:bg-accent/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="px-4 pt-2">
                <Link to="/enroll" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
