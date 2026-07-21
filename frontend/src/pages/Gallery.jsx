import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiX, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import PageTransition from '../components/common/PageTransition';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { fadeIn, staggerContainer } from '../animations/index';

const gradients = [
  'from-amber-500 to-orange-400',
  'from-rose-500 to-pink-400',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
  'from-blue-500 to-cyan-400',
  'from-indigo-500 to-blue-400',
  'from-amber-600 to-yellow-400',
  'from-green-500 to-emerald-400',
  'from-orange-500 to-amber-400',
  'from-pink-500 to-rose-400',
  'from-cyan-500 to-teal-400',
  'from-purple-500 to-violet-400',
];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/gallery')
      .then((res) => setImages(res.data?.images || res.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(images.map((img) => img.category).filter(Boolean))];

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const openLightbox = useCallback((index) => setLightbox(index), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goNext = useCallback(() => {
    setLightbox((prev) => (prev + 1) % filtered.length);
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setLightbox((prev) => (prev - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const getGradient = (i) => gradients[i % gradients.length];

  if (loading) return <Loader />;

  return (
    <PageTransition>
      <Helmet>
        <title>Our Gallery | Pacific Barista Academy</title>
        <meta name="description" content="Explore our gallery showcasing training sessions, events, facilities, and student moments at Pacific Barista Academy." />
        <link rel="canonical" href="https://pacificbarista.com.np/gallery" />
        <meta property="og:title" content="Our Gallery | Pacific Barista Academy" />
        <meta property="og:description" content="Explore our gallery showcasing training, events, facilities, and student moments." />
        <meta property="og:url" content="https://pacificbarista.com.np/gallery" />
        <meta property="og:image" content="https://pacificbarista.com.np/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Gallery | Pacific Barista Academy" />
        <meta name="twitter:description" content="Explore our gallery showcasing training, events, facilities, and student moments." />
      </Helmet>

      <section className="relative bg-primary text-cream pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-custom relative z-10">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Gallery</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Our <span className="text-accent">Gallery</span>
            </h1>
            <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed">
              A visual journey through our academy, training sessions, and community events.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {images.length === 0 ? (
        <section className="py-20 bg-cream">
          <div className="container-custom text-center">
            <FiImage className="w-16 h-16 mx-auto text-text/20 mb-4" />
            <p className="font-body text-text/40">No gallery images yet. Check back soon!</p>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-cream">
          <div className="container-custom">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-accent text-white shadow-lg scale-105'
                      : 'bg-white text-text/60 hover:text-accent hover:bg-accent/5 border border-primary/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <motion.div
              key={activeCategory}
              variants={staggerContainer(0.05)}
              initial="hidden"
              animate="show"
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img._id || i}
                  variants={fadeIn('up', i * 0.05)}
                  onClick={() => openLightbox(i)}
                  className="break-inside-avoid cursor-pointer group relative rounded-2xl overflow-hidden shadow-md"
                >
                  {img.image?.url ? (
                    <div className="relative w-full h-64">
                      <img
                        src={img.image.url}
                        alt={img.category || 'Gallery image'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiSearch className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="text-white/80 text-xs font-body uppercase tracking-wider">{img.category}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full h-64 bg-gradient-to-br ${getGradient(i)} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FiImage className="w-12 h-12 text-white/30" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiSearch className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="text-white/80 text-xs font-body uppercase tracking-wider">{img.category}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            >
              <FiX className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              <FiChevronLeft className="w-10 h-10" />
            </button>

            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered[lightbox].image?.url ? (
                <div className="w-full h-[60vh] rounded-2xl overflow-hidden relative">
                  <img
                    src={filtered[lightbox].image.url}
                    alt={filtered[lightbox].category || 'Gallery image'}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white/80 font-body text-sm">{filtered[lightbox].category}</span>
                  </div>
                </div>
              ) : (
                <div className={`w-full h-[60vh] bg-gradient-to-br ${getGradient(lightbox)} rounded-2xl flex items-center justify-center relative`}>
                  <FiImage className="w-24 h-24 text-white/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white/80 font-body text-sm">{filtered[lightbox].category}</span>
                  </div>
                </div>
              )}
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              <FiChevronRight className="w-10 h-10" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 font-body text-sm">
              {lightbox + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Gallery;
