import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiLinkedin, FiTwitter, FiInstagram, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import PageTransition from '../components/common/PageTransition';
import { fadeIn, staggerContainer } from '../animations/index';
import api from '../services/api';

const gradients = [
  'from-amber-600 to-orange-400',
  'from-rose-500 to-pink-400',
  'from-emerald-600 to-teal-400',
  'from-violet-600 to-purple-400',
  'from-blue-600 to-cyan-400',
  'from-amber-500 to-yellow-400',
  'from-indigo-600 to-blue-400',
  'from-orange-600 to-red-400',
];

const TrainerCard = ({ trainer, gradient }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeIn('up')}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group"
    >
      {trainer.photo?.url ? (
        <div className="h-36 overflow-hidden relative">
          <img src={trainer.photo.url} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>
      ) : (
        <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-2xl font-heading font-bold text-white">{trainer.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>
      )}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-base font-bold text-primary">{trainer.name}</h3>
          <span className="text-xs font-body font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{trainer.experience} Years</span>
        </div>
        <p className="text-sm font-body font-medium text-accent mb-1.5">{trainer.specialization}</p>
        <div className="relative">
          <p className={`font-body text-text/70 text-sm leading-relaxed mb-2 ${expanded ? '' : 'line-clamp-2'}`}>{trainer.bio}</p>
          {trainer.bio && trainer.bio.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-accent font-body text-xs font-medium hover:underline mb-2"
            >
              {expanded ? 'Show less' : 'Read more'}
              {expanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
        {trainer.socialLinks && (
          <div className="flex items-center gap-2 pt-2 border-t border-primary/5">
            {trainer.socialLinks.linkedin && (
              <a href={trainer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-accent hover:text-white transition-all duration-300">
                <FiLinkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {trainer.socialLinks.twitter && (
              <a href={trainer.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-accent hover:text-white transition-all duration-300">
                <FiTwitter className="w-3.5 h-3.5" />
              </a>
            )}
            {trainer.socialLinks.instagram && (
              <a href={trainer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-accent hover:text-white transition-all duration-300">
                <FiInstagram className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trainers')
      .then((res) => setTrainers(res.data?.trainers || res.data || []))
      .catch(() => setTrainers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>Our Expert Trainers | Pacific Barista Academy</title>
        <meta name="description" content="Meet our world-class barista trainers at Pacific Barista Academy. Industry experts dedicated to helping you master the art of coffee." />
        <link rel="canonical" href="https://pacificbarista.com.np/trainers" />
        <meta property="og:title" content="Our Expert Trainers | Pacific Barista Academy" />
        <meta property="og:description" content="Meet our world-class barista trainers. Industry experts dedicated to helping you master the art of coffee." />
        <meta property="og:url" content="https://pacificbarista.com.np/trainers" />
        <meta property="og:image" content="https://pacificbarista.com.np/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Expert Trainers | Pacific Barista Academy" />
        <meta name="twitter:description" content="Meet our world-class barista trainers at Pacific Barista Academy." />
      </Helmet>

      <section className="relative bg-primary text-cream pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-custom relative z-10">
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-4">Our Team</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Our Expert <span className="text-accent">Trainers</span>
            </h1>
            <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed">
              Learn from award-winning baristas, certified Q-Graders, and industry veterans passionate about sharing their craft.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      <section className="py-20 bg-cream">
        <div className="container-custom">
          {loading ? (
            <Loader />
          ) : trainers.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-text/60 text-lg">No trainers available yet.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {trainers.map((trainer, i) => (
                <TrainerCard key={trainer._id || i} trainer={trainer} gradient={gradients[i % gradients.length]} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Trainers;
