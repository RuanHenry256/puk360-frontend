/**
 * Reusable Button component (deduplicated).
 * - Primary is the default brand CTA.
 * - Secondary maps to primary to keep important actions consistent.
 * - Danger remains red for destructive/sign-out actions.
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
  className = '',
}) => {
  const baseStyles = 'font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2';

  const variants = {
    primary: 'bg-primary hover:bg-purple-800 text-surface focus:ring-primary',
    // Map secondary to primary for unified important buttons
    secondary: 'bg-primary hover:bg-purple-800 text-surface focus:ring-primary',
    outline: 'border-2 border-primary hover:border-secondary text-primary bg-transparent hover:bg-gray-100 focus:ring-primary',
    link: 'text-secondary hover:text-accent underline bg-transparent p-0 focus:ring-secondary',
    danger: 'bg-red-600 hover:bg-red-700 text-surface focus:ring-red-500',
  };

  const sizes = {
    small: 'py-2 px-3 text-sm',
    medium: 'py-3 px-4 text-base',
    large: 'py-4 px-6 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.medium}
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

