import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/common/PageTransition';
import { fadeIn, staggerContainer } from '../animations/index';
import api from '../services/api';

const gradients = [
  'from-amber-500 to-orange-400',
  'from-rose-500 to-pink-400',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
  'from-blue-500 to-cyan-400',
  'from-indigo-500 to-blue-400',
  'from-amber-600 to-yellow-400',
  'from-green-500 to-emerald-400',
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <FiStar
        key={star}
        className={`w-4 h-4 ${star <= rating ? 'text-accent fill-accent' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const TestimonialCard = ({ t, featured }) => (
  <motion.div
    variants={fadeIn('up')}
    className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-primary/5 ${
      featured ? 'md:col-span-2 md:flex' : ''
    }`}
  >
    <div className={`p-6 ${featured ? 'md:w-full' : ''}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
          <span className="text-lg font-heading font-bold text-white">{t.studentName.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <div>
          <h3 className="font-heading font-bold text-primary">{t.studentName}</h3>
          <Badge variant="accent">{t.course}</Badge>
        </div>
      </div>
      <StarRating rating={t.rating} />
      <p className="font-body text-text/70 text-sm leading-relaxed mt-3 italic">&ldquo;{t.content}&rdquo;</p>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        const data = res.data?.testimonials || res.data || [];
        const mapped = data.map((t, i) => ({
          ...t,
          gradient: gradients[i % gradients.length],
        }));
        setTestimonials(mapped);
      } catch {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const courses = ['All', ...new Set(testimonials.map((t) => t.course))];

  const filtered = filter === 'All'
    ? testimonials
    : testimonials.filter((t) => t.course === filter);

  const featured = filtered.find((t) => t.isFeatured);
  const rest = filtered.filter((t) => !t.isFeatured);

  return (
    <PageTransition>
      <Helmet>
        <title>Student Success Stories | Pacific Barista Academy</title>
        <meta name="description" content="Read success stories from Pacific Barista Academy graduates. Discover how our training has transformed careers and lives." />
        <link rel="canonical" href="https://www.pacificbarista.com/testimonials" />
        <meta property="og:title" content="Student Success Stories | Pacific Barista Academy" />
        <meta property="og:description" content="Read success stories from Pacific Barista Academy graduates." />
        <meta property="og:url" content="https://www.pacificbarista.com/testimonials" />
        <meta property="og:image" content="https://www.pacificbarista.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Student Success Stories | Pacific Barista Academy" />
        <meta name="twitter:description" content="Read success stories from Pacific Barista Academy graduates." />
      </Helmet>

      <section className="relative bg-primary text-cream pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-custom relative z-10">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Testimonials</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Student Success <span className="text-accent">Stories</span>
            </h1>
            <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed">
              Hear from our graduates about how Pacific Barista Academy changed their coffee journey.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {courses.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {courses.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilter(c)}
                      className={`px-6 py-2.5 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                        filter === c
                          ? 'bg-accent text-white shadow-lg'
                          : 'bg-white text-text/60 hover:text-accent border border-primary/10'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              <motion.div
                key={filter}
                variants={staggerContainer(0.1)}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {featured && <TestimonialCard t={featured} featured />}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((t) => (
                    <TestimonialCard key={t._id} t={t} />
                  ))}
                </div>
              </motion.div>

              {filtered.length === 0 && (
                <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center py-16">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiStar className="w-8 h-8 text-accent" />
                  </div>
                  <p className="font-body text-text/60 text-lg">No testimonials found for this course.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Testimonials;
