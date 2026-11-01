import React, { useRef } from 'react';

/**
 * GlassSurface
 * Provides mouse-responsive translucent glassmorphism with dynamic spotlight radial lighting.
 */
export function GlassSurface({
  children,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const surfaceRef = useRef(null);

  const handleMouseMove = (event) => {
    const element = surfaceRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    element.style.setProperty('--mouse-x', `${x}px`);
    element.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={surfaceRef}
      className={`grid-glass ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassSurface;

