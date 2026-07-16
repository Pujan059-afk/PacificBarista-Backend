import { motion } from 'framer-motion';
import { fadeIn } from '../../animations';

const SectionTitle = ({ subtitle, title, description, align = 'center', className = '' }) => {
  const alignClasses = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  };

  return (
    <motion.div
      variants={fadeIn('up')}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className={`max-w-3xl mx-auto mb-12 ${alignClasses[align]} ${className}`}
    >
      {subtitle && (
        <motion.span
          variants={fadeIn('up', 0.1)}
          className="inline-block text-accent font-body font-semibold text-sm uppercase tracking-[0.2em] mb-3"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2
        variants={fadeIn('up', 0.2)}
        className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary font-bold leading-tight"
      >
        {title}
      </motion.h2>
      <motion.div
        variants={fadeIn('up', 0.3)}
        className="w-16 h-1 bg-accent rounded-full mx-auto mt-4"
        style={align === 'left' ? { marginLeft: 0 } : align === 'right' ? { marginRight: 0 } : {}}
      />
      {description && (
        <motion.p
          variants={fadeIn('up', 0.4)}
          className="text-text/70 font-body text-base md:text-lg mt-4 leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
