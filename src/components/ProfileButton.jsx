import React from 'react';

const sizeMap = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14'
};

const ProfileButton = ({
  onClick,
  ariaLabel = 'Open profile',
  size = 'md',
  className = '',
  ...rest
}) => {
  const sizeClasses = sizeMap[size] || sizeMap.md;

  // Swap bg-primary / text-white below to experiment with button colours.
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full bg-primary text-white shadow-sm
    transition-transform duration-150
    hover:scale-105 focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-primary
    ${sizeClasses}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const iconColorClass = 'text-white'; // Swap to 'text-secondary' to experiment with icon color.

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={baseClasses}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className={`h-1/2 w-1/2 ${iconColorClass}`}
        aria-hidden="true"
      >
        <path
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
        <path
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 20.25a8.25 8.25 0 0115 0"
        />
      </svg>
    </button>
  );
};

export default ProfileButton;
