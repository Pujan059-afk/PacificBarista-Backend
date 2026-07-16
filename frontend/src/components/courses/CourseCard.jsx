import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Badge from '../ui/Badge';
import { IconCoffee } from '../ui/Icons';

const levelVariant = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const CourseCard = ({ course }) => {
  const { title, slug, image, duration, level, shortDescription, price } = course;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative">
          <div className="w-full h-28 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            {image?.url ? (
              <img src={image.url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <IconCoffee className="w-8 h-8 text-cream/30" />
            )}
          </div>
          <div className="absolute top-1.5 left-1.5">
            <Badge variant={levelVariant[level?.toLowerCase()] || 'default'} className="text-[10px] px-2 py-0.5">{level}</Badge>
          </div>
          <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-body font-medium text-primary flex items-center gap-0.5">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </div>
        </div>
        <div className="flex flex-col flex-1 px-3 pt-2.5 pb-2.5">
          <Link to={`/courses/${slug}`}>
            <h3 className="font-heading text-sm font-bold text-primary mb-1 group-hover:text-accent transition-colors duration-300 leading-tight">
              {title}
            </h3>
          </Link>
          {shortDescription && (
            <div className="mb-1.5">
              <p className={`font-body text-text/60 text-xs leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>{shortDescription}</p>
              {shortDescription.length > 80 && (
                <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-0.5 text-accent font-body text-[10px] font-medium hover:underline mt-0.5">
                  {expanded ? 'Show less' : 'Read more'}
                  {expanded ? <FiChevronUp className="w-2.5 h-2.5" /> : <FiChevronDown className="w-2.5 h-2.5" />}
                </button>
              )}
            </div>
          )}
          <div className="flex items-center justify-between pt-1.5 border-t border-primary/5 mt-auto">
            <span className="font-heading text-base font-bold text-accent">Rs. {price?.toLocaleString()}/-</span>
            <Link
              to={`/courses/${slug}`}
              className="font-body text-xs font-medium text-primary hover:text-accent transition-colors duration-300"
            >
              View &rarr;
            </Link>
          </div>
        </div>
    </div>
  );
};

export default CourseCard;
