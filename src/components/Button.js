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
  
  // Variant styles
  const variants = {
    primary: 'bg-gray-300 hover:bg-gray-400 text-gray-700 focus:ring-gray-500',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
    link: 'text-blue-600 hover:text-blue-800 underline bg-transparent p-0 rounded-none focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
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