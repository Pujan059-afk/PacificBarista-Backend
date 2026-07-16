import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeIn, staggerContainer, textReveal } from '../../animations';
import Button from '../ui/Button';
import { IconChevronDown } from '../ui/Icons';
import heroBg from '../../assets/images/hero-bg.jpeg';

const floatingBeans = [
  { x: 10, y: 20, size: 16, duration: 6, delay: 0 },
  { x: 85, y: 15, size: 12, duration: 5, delay: 1 },
  { x: 20, y: 70, size: 20, duration: 7, delay: 0.5 },
  { x: 75, y: 75, size: 14, duration: 5.5, delay: 1.5 },
  { x: 50, y: 10, size: 10, duration: 4.5, delay: 0.8 },
  { x: 90, y: 50, size: 18, duration: 6.5, delay: 0.3 },
  { x: 5, y: 50, size: 8, duration: 5, delay: 1.2 },
  { x: 60, y: 85, size: 15, duration: 5.8, delay: 0.7 },
];

const headingWords = "Roast Your Barista Skill".split(" ");

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {floatingBeans.map((bean, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-accent/10"
          style={{
            left: `${bean.x}%`,
            top: `${bean.y}%`,
            width: bean.size,
            height: bean.size,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, bean.x > 50 ? -10 : 10, 0],
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: bean.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: bean.delay,
          }}
        />
      ))}

      <motion.div
        variants={staggerContainer(0.12, 0.3)}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.span
          variants={fadeIn('up')}
          className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.25em] mb-6"
        >
          Pacific Barista Academy
        </motion.span>

        <motion.h1
          variants={staggerContainer(0.05)}
          className="font-heading text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-tight mb-6"
        >
          {headingWords.map((word, i) => (
            <motion.span
              key={i}
              variants={textReveal}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeIn('up')}
          className="text-white/60 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Complete international standard barista training with Advance Latte Art, 
          customer service standards, food safety & health & safety measurements at work. 
          Start your journey today.
        </motion.p>

        <motion.div variants={fadeIn('up')} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/courses">
            <Button variant="primary" size="lg">Explore Courses</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">Enroll Today</Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <IconChevronDown className="text-white/40 w-6 h-6" />
      </motion.div>
    </section>
  );
};

export default Hero;
