import React from 'react';
import GlassSurface from '../GlassSurface';

export const StatCard = ({ icon: Icon, title, label, value, subtext, trend, change, color }) => {
  const displayLabel = title || label;
  const displayChange = trend || change;

  return (
    <GlassSurface className="grid-stat-card">
      <div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--grid-text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--grid-muted)', marginTop: '4px', fontWeight: 500 }}>
          {displayLabel}
        </div>
        {displayChange && (
          <div style={{ fontSize: '12px', color: 'var(--grid-green)', fontWeight: 600, marginTop: '4px' }}>
            {displayChange}
          </div>
        )}
        {subtext && (
          <div style={{ fontSize: '11px', color: 'var(--grid-muted)', marginTop: '2px' }}>
            {subtext}
          </div>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'var(--grid-green-soft)',
            border: '1px solid rgba(0, 245, 138, 0.25)',
            color: color || 'var(--grid-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 245, 138, 0.12)'
          }}
        >
          <Icon size={20} />
        </div>
      )}
    </GlassSurface>
  );
};
