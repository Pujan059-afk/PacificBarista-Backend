import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="relative w-16 h-24"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-16 bg-primary rounded-b-lg rounded-t-sm" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-primary rounded-full" />
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-0 bg-accent rounded-full"
            animate={{ height: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.p
          className="text-primary font-heading text-lg font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Brewing...
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;
