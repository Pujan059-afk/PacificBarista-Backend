import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeIn, staggerContainer } from '../../animations';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import api from '../../services/api';
import { IconArrowRight, IconCoffee, IconPalette, IconFlask, IconBookOpen, IconAward, IconZap } from '../ui/Icons';

const fallbackImages = [
  { gradient: 'from-amber-600 to-amber-800', span: 'lg:row-span-2 lg:col-span-2', label: 'Espresso Art', Icon: IconCoffee },
  { gradient: 'from-rose-600 to-rose-800', span: 'lg:col-span-2', label: 'Latte Art', Icon: IconPalette },
  { gradient: 'from-blue-600 to-blue-800', span: 'lg:col-span-1', label: 'Brewing Lab', Icon: IconFlask },
  { gradient: 'from-emerald-600 to-emerald-800', span: 'lg:col-span-1', label: 'Student Workspace', Icon: IconBookOpen },
  { gradient: 'from-purple-600 to-purple-800', span: 'lg:col-span-2', label: 'Graduation Day', Icon: IconAward },
];

const previewIcons = [IconCoffee, IconPalette, IconFlask, IconBookOpen, IconAward, IconZap];

const GalleryPreview = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gallery?limit=5')
      .then((res) => setImages(res.data?.images || res.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const displayImages = loading || images.length === 0 ? fallbackImages : images;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Gallery"
          title="A Glimpse Into Our Academy"
          description="See our state-of-the-art facilities, students in action, and the vibrant coffee community at Pacific Barista."
        />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px] lg:auto-rows-[240px]"
        >
          {displayImages.map((img, i) => {
            const isFallback = !img.image?.url;
            const Icon = isFallback ? (img.Icon || previewIcons[i % previewIcons.length]) : previewIcons[i % previewIcons.length];
            const span = isFallback ? img.span : '';
            const gradient = isFallback ? img.gradient : gradients[i % gradients.length];

            if (isFallback) {
              return (
                <motion.div
                  key={i}
                  variants={fadeIn('up')}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer ${span}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-110`}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2">
                    <Icon className="w-12 h-12 text-white/80" />
                    <span className="text-white font-heading font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      {img.label}
                    </span>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={img._id || i}
                variants={fadeIn('up')}
                className="group relative rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={img.image.url}
                  alt={img.category || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/40 to-transparent">
                  <span className="text-white/90 text-xs font-body uppercase tracking-wider">{img.category}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/gallery">
            <Button variant="outline" size="lg" icon={IconArrowRight} iconPosition="right">
              View Full Gallery
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const gradients = [
  'from-amber-600 to-amber-800',
  'from-rose-600 to-rose-800',
  'from-blue-600 to-blue-800',
  'from-emerald-600 to-emerald-800',
  'from-purple-600 to-purple-800',
  'from-orange-600 to-red-800',
];

export default GalleryPreview;
