import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Search, Bell, User } from 'lucide-react';

export const Navbar = ({ title = 'Explore Hackathons' }) => {
  const { user, role, switchRole } = useAuth();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px 12px',
        background: 'transparent',
        zIndex: 10
      }}
    >
      {/* Left Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Home size={15} color="var(--text-muted)" />
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
          {title}
        </span>
      </div>

      {/* Right Controls: Search + Notification Bell + User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Sleek Apple Frosted Search Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          padding: '6px 14px',
          width: '210px',
          backdropFilter: 'blur(16px)'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search hackathons..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '12px',
              width: '100%'
            }}
          />
        </div>

        {/* Notification Bell with indicator */}
        <button
          title="Announcements"
          style={{
            position: 'relative',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <Bell size={14} />
          <span style={{
            position: 'absolute',
            top: 7,
            right: 8,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--grid-neon)',
            boxShadow: '0 0 6px var(--grid-neon)'
          }} />
        </button>

        {/* User Icon Circle */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)'
        }}>
          <User size={15} />
        </div>
      </div>
    </header>
  );
};
