import React from 'react';

/**
 * GridAtmosphere
 * Renders the single neat, elegant, perfectly curved neon green aurora line
 * running consistently from left to right with soft spatial blooms.
 * Matches the reference design in Image 1.
 */
export const GridAtmosphere = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 30%, #060a08 0%, #030406 60%, #010203 100%)'
      }}
    >
      {/* Soft atmospheric green nebula blooms behind cards */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '18%',
          width: '50vw',
          height: '42vh',
          background: 'radial-gradient(ellipse, rgba(0, 245, 138, 0.065) 0%, rgba(0, 245, 138, 0) 65%)',
          filter: 'blur(110px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          right: '15%',
          width: '55vw',
          height: '48vh',
          background: 'radial-gradient(ellipse, rgba(0, 245, 138, 0.075) 0%, rgba(0, 245, 138, 0) 70%)',
          filter: 'blur(120px)'
        }}
      />

      {/* Single neat, elegant SVG neon spline running smoothly from left to right */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <defs>
          {/* Luminous multi-stage neon glow with Gaussian Blur */}
          <filter id="singleAuroraGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="26" result="wideAura" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="midBloom" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="sharpCore" />
            <feMerge>
              <feMergeNode in="wideAura" />
              <feMergeNode in="midBloom" />
              <feMergeNode in="sharpCore" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="singleAuroraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f58a" stopOpacity="0.1" />
            <stop offset="20%" stopColor="#00f58a" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#80ffc4" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#00f58a" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#00f58a" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* The single neat, elegant, perfectly curved neon green line sweeping across from left to right */}
        <path
          d="M -40,310 C 260,200 580,390 920,290 C 1140,225 1320,295 1480,320"
          fill="none"
          stroke="url(#singleAuroraGrad)"
          strokeWidth="2.4"
          filter="url(#singleAuroraGlow)"
        />
      </svg>
    </div>
  );
};
