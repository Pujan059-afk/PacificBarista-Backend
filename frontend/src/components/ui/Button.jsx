import { motion } from 'framer-motion';
import { useState } from 'react';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg',
  secondary: 'bg-primary text-white hover:bg-primary-light shadow-md hover:shadow-lg',
  outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
  ghost: 'text-primary hover:bg-primary/5',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (loading || disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2 font-body font-medium
        rounded-lg transition-colors duration-300 overflow-hidden
        ${variants[variant]} ${sizes[size]}
        ${(disabled || loading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {!loading && children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{ left: ripple.x - 10, top: ripple.y - 10, width: 20, height: 20 }}
        />
      ))}
    </motion.button>
  );
};

export default Button;
