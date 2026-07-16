import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import useInView from '../../hooks/useInView';
import { fadeIn, staggerContainer } from '../../animations';

const stats = [
  { value: 500, suffix: '+', label: 'Students Trained', subtitle: 'From around the world' },
  { value: 20, suffix: '+', label: 'Professional Courses', subtitle: 'Comprehensive curriculum' },
  { value: 95, suffix: '%', label: 'Placement Guidance', subtitle: 'Career success rate' },
  { value: 10, suffix: '+', label: 'Years Experience', subtitle: 'Industry expertise' },
];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const useCountUp = (end, duration) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * end));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return count;
};

const CountUp = ({ end, duration, suffix }) => {
  const count = useCountUp(end, duration);
  return <>{count}{suffix}</>;
};

const Statistics = () => {
  const [ref, isInView] = useInView({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 bg-gradient-to-br from-primary via-primary-dark to-dark overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,155,60,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(200,155,60,0.05),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeIn('up')}
            className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3"
          >
            Our Impact
          </motion.span>
          <motion.h2
            variants={fadeIn('up')}
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-white font-bold"
          >
            By the Numbers
          </motion.h2>
          <motion.div
            variants={fadeIn('up')}
            className="w-16 h-1 bg-accent rounded-full mx-auto mt-4"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeIn('up')}
              className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-2">
                {isInView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <h3 className="font-body text-white font-semibold text-lg mb-1">
                {stat.label}
              </h3>
              <p className="font-body text-white/50 text-sm">
                {stat.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;
