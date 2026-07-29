import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { IconCoffee, IconArrowRight } from '../ui/Icons';

const levelVariant = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const levelColors = {
  beginner: 'from-emerald-500 to-emerald-700',
  intermediate: 'from-amber-500 to-amber-700',
  advanced: 'from-rose-500 to-rose-700',
};

const CourseCard = ({ course }) => {
  const { title, slug, image, duration, level, shortDescription, price } = course;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link to={`/courses/${slug}`} className="block">
        {image?.url ? (
          <div className="relative h-44 overflow-hidden bg-gray-50">
            <img src={image.url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        ) : (
          <div className={`relative h-44 bg-gradient-to-br ${levelColors[level?.toLowerCase()] || 'from-primary to-secondary'} flex items-center justify-center overflow-hidden`}>
            <IconCoffee className="w-10 h-10 text-white/80" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        )}
      </Link>

      <div className="px-4 pt-3 pb-3 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant={levelVariant[level?.toLowerCase()] || 'default'} className="text-[10px] px-2 py-0.5">{level}</Badge>
          <span className="flex items-center gap-1 text-text/40 text-xs font-body">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </span>
        </div>

        <Link to={`/courses/${slug}`}>
          <h3 className="font-heading text-base font-semibold text-primary mb-1 group-hover:text-accent transition-colors duration-300 leading-snug">
            {title}
          </h3>
        </Link>

        {shortDescription && (
          <p className="font-body text-text/60 text-sm leading-relaxed mb-2 line-clamp-2">
            {shortDescription}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-primary/5">
          <span className="font-heading text-base font-bold text-accent">Rs. {price?.toLocaleString()}/-</span>
          <Link
            to={`/courses/${slug}`}
            className="inline-flex items-center gap-1 text-accent font-body text-sm font-semibold hover:gap-2 transition-all duration-300"
          >
            View
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
