/**
 * Reusable Button component.
 * Supports variants, sizes, full-width and disabled states via Tailwind classes.
 */
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = ''
}) => {
  // Base button styles
  const baseStyles = 'font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2';
  
  // Variant styles (using custom Tailwind colors)
  const variants = {
    primary: 'bg-primary hover:bg-purple-800 text-surface focus:ring-primary',
    secondary: 'bg-secondary hover:bg-teal-800 text-surface focus:ring-secondary',
    outline: 'border-2 border-primary hover:border-secondary text-primary bg-transparent hover:bg-gray-100 focus:ring-primary',
    link: 'text-secondary hover:text-accent underline bg-transparent p-0 rounded-none focus:ring-secondary',
    danger: 'bg-red-600 hover:bg-red-700 text-surface focus:ring-red-500'
  };
  
  // Size styles
  const sizes = {
    small: 'py-2 px-3 text-sm',
    medium: 'py-3 px-4 text-base',
    large: 'py-4 px-6 text-lg'
  };
  
  // Disabled styles
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? disabledStyles : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button;
