import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { fadeIn } from '../../animations';
import SectionTitle from '../ui/SectionTitle';
import { IconStar } from '../ui/Icons';
import api from '../../services/api';

const gradients = [
  'from-purple-400 to-pink-400',
  'from-blue-400 to-cyan-400',
  'from-amber-400 to-orange-400',
  'from-emerald-400 to-teal-400',
  'from-rose-400 to-red-400',
  'from-violet-400 to-indigo-400',
];

const initials = (name) =>
  name?.split(' ').map((n) => n[0]).join('') || '?';

const TestimonialsSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        const data = res.data?.testimonials || res.data || [];
        setTestimonials(data.map((t, i) => ({ ...t, gradient: gradients[i % gradients.length] })));
      } catch (err) {
        console.error('Failed to load testimonials', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Testimonials"
          title="What Our Students Say"
          description="Hear from our graduates about how Pacific Barista helped shape their careers."
        />

        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: '.testimonials-pagination' }}
            navigation={{
              nextEl: '.testimonials-next',
              prevEl: '.testimonials-prev',
            }}
            className="pb-12"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={t._id || i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group relative bg-white rounded-2xl p-7 h-full shadow-lg shadow-primary/5 border border-primary/5 flex flex-col hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/40 via-accent to-accent/40 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${t.gradient} blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                      {t.photo?.url ? (
                        <img
                          src={t.photo.url}
                          alt={t.studentName}
                          className="relative w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
                        />
                      ) : (
                        <div
                          className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-heading font-semibold text-lg flex-shrink-0 shadow-md`}
                        >
                          {initials(t.studentName)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-base font-bold text-primary truncate">
                        {t.studentName}
                      </h4>
                      <p className="font-body text-text/40 text-xs font-medium tracking-wide uppercase">
                        {t.course}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <IconStar
                        key={j}
                        className={`w-4 h-4 transition-colors duration-300 ${
                          j < t.rating ? 'fill-accent text-accent' : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="relative flex-1">
                    <span className="absolute -top-1 -left-1 text-4xl leading-none text-accent/10 font-serif select-none">&ldquo;</span>
                    <p className="font-body text-text/70 text-sm leading-relaxed pl-4 relative z-10">
                      {t.content}
                    </p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-center gap-4 mt-2">
            <button className="testimonials-prev w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-text/40 hover:text-accent hover:border-accent transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="testimonials-pagination flex gap-2" />
            <button className="testimonials-next w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-text/40 hover:text-accent hover:border-accent transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
