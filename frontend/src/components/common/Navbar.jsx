import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Search, Bell, User, Users, Award, Shield } from 'lucide-react';

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

      {/* Right Controls: Role Switcher + Search + Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Subtle Integrated Role Switcher */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '3px',
          borderRadius: '9999px'
        }}>
          <button
            onClick={() => switchRole('TEAM')}
            style={{
              background: role === 'TEAM' ? 'rgba(0, 255, 102, 0.16)' : 'transparent',
              border: role === 'TEAM' ? '1px solid rgba(0, 255, 102, 0.45)' : '1px solid transparent',
              color: role === 'TEAM' ? 'var(--grid-neon)' : 'var(--text-secondary)',
              borderRadius: '9999px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Users size={11} /> Team
          </button>
          <button
            onClick={() => switchRole('ORGANIZER')}
            style={{
              background: role === 'ORGANIZER' ? 'rgba(0, 255, 102, 0.16)' : 'transparent',
              border: role === 'ORGANIZER' ? '1px solid rgba(0, 255, 102, 0.45)' : '1px solid transparent',
              color: role === 'ORGANIZER' ? 'var(--grid-neon)' : 'var(--text-secondary)',
              borderRadius: '9999px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Award size={11} /> Organizer
          </button>
          <button
            onClick={() => switchRole('SUPER_ADMIN')}
            style={{
              background: role === 'SUPER_ADMIN' ? 'rgba(0, 255, 102, 0.16)' : 'transparent',
              border: role === 'SUPER_ADMIN' ? '1px solid rgba(0, 255, 102, 0.45)' : '1px solid transparent',
              color: role === 'SUPER_ADMIN' ? 'var(--grid-neon)' : 'var(--text-secondary)',
              borderRadius: '9999px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Shield size={11} /> Admin
          </button>
        </div>

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
