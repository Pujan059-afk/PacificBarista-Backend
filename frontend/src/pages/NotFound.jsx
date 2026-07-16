import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IconCoffee } from './../components/ui/Icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <Helmet>
        <title>404 - Page Not Found | Pacific Barista</title>
      </Helmet>
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <IconCoffee className="w-24 h-24 mx-auto mb-4 text-primary/40" />
          <h1 className="font-heading text-7xl md:text-8xl font-bold text-primary mb-4">404</h1>
          <p className="font-body text-lg text-text/60 mb-8">
            The page you're looking for has been brewed away.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-accent/90 transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
