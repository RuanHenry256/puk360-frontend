import React from 'react';

export default function Spinner({ size = 32, className = '', label = 'Loading' }) {
  const style = { width: size, height: size };
  return (
    <div className={`inline-flex items-center justify-center ${className}`} role="status" aria-label={label}>
      <div className="spinner" style={style} />
      <span className="sr-only">{label}</span>
    </div>
  );
}

