import { motion } from 'framer-motion';
import { fadeIn } from '../../animations';

const Card = ({ children, image, className = '', delay = 0, hover = true, ...props }) => {
  return (
    <motion.div
      variants={fadeIn('up', delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-30px' }}
      whileHover={hover ? { y: -5, transition: { duration: 0.3 } } : {}}
      className={`bg-white rounded-xl overflow-hidden shadow-md ${hover ? 'hover:shadow-xl' : ''} transition-shadow duration-300 ${className}`}
      {...props}
    >
      {image && (
        <div className="overflow-hidden">
          <motion.img
            src={image}
            alt=""
            whileHover={hover ? { scale: 1.05 } : {}}
            transition={{ duration: 0.4 }}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  );
};

export default Card;
