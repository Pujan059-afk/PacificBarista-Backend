import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, variant = 'text', options = [], className = '', ...props }, ref) => {
  const baseClasses =
    'w-full px-4 py-3 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,155,60,0.1)] placeholder:text-text/30';

  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : '';

  const renderInput = () => {
    switch (variant) {
      case 'textarea':
        return (
          <textarea
            ref={ref}
            className={`${baseClasses} ${errorClasses} min-h-[120px] resize-y ${className}`}
            {...props}
          />
        );
      case 'select':
        return (
          <select ref={ref} className={`${baseClasses} ${errorClasses} ${className}`} {...props}>
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            ref={ref}
            type={variant}
            className={`${baseClasses} ${errorClasses} ${className}`}
            {...props}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-primary font-body font-medium text-sm">{label}</label>
      )}
      {renderInput()}
      {error && (
        <p className="text-red-500 font-body text-xs mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
