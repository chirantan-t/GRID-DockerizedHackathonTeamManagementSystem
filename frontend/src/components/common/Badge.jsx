import React from 'react';

export const Badge = ({ status, variant, label, children }) => {
  const text = children || label || status || variant || 'Ongoing';
  const val = String(status || variant || text || '').toLowerCase();

  let color = '#00ff66';
  let bg = 'rgba(0, 255, 102, 0.1)';
  let border = 'rgba(0, 255, 102, 0.3)';
  let dotGlow = '0 0 6px #00ff66';

  if (val.includes('reg') || val.includes('open')) {
    color = '#06b6d4';
    bg = 'rgba(6, 182, 212, 0.1)';
    border = 'rgba(6, 182, 212, 0.3)';
    dotGlow = '0 0 6px #06b6d4';
  } else if (val.includes('pending') || val.includes('upcoming') || val.includes('review')) {
    color = '#f59e0b';
    bg = 'rgba(245, 158, 11, 0.1)';
    border = 'rgba(245, 158, 11, 0.3)';
    dotGlow = '0 0 6px #f59e0b';
  } else if (val.includes('completed') || val.includes('draft') || val.includes('inactive')) {
    color = '#9aa1ad';
    bg = 'rgba(154, 161, 173, 0.1)';
    border = 'rgba(154, 161, 173, 0.25)';
    dotGlow = '0 0 6px #9aa1ad';
  } else if (val.includes('reject') || val.includes('danger')) {
    color = '#f43f5e';
    bg = 'rgba(244, 63, 94, 0.1)';
    border = 'rgba(244, 63, 94, 0.3)';
    dotGlow = '0 0 6px #f43f5e';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '11.5px',
        fontWeight: 600,
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        lineHeight: 1.3,
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: color,
          boxShadow: dotGlow
        }}
      />
      {text}
    </span>
  );
};
