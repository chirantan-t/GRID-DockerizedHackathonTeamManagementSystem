import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Terminal, Shield, Award, Users } from 'lucide-react';

export const RoleSwitchBanner = () => {
  const { role, switchRole, user } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole, targetPath) => {
    switchRole(newRole);
    navigate(targetPath);
  };

  return (
    <div className="role-demo-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Terminal size={13} color="var(--grid-neon)" />
        <span style={{ fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>GRID Command Hub</span>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Simulating: <strong style={{ color: 'var(--grid-neon)' }}>{user.name}</strong> ({role})
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Switch View:</span>
        <button
          className={`role-pill-btn ${role === 'TEAM' ? 'active' : ''}`}
          onClick={() => handleRoleChange('TEAM', '/team/dashboard')}
        >
          <Users size={12} />
          TEAM / PARTICIPANT
        </button>
        <button
          className={`role-pill-btn ${role === 'ORGANIZER' ? 'active' : ''}`}
          onClick={() => handleRoleChange('ORGANIZER', '/organizer/dashboard')}
        >
          <Award size={12} />
          ORGANIZER
        </button>
        <button
          className={`role-pill-btn ${role === 'SUPER_ADMIN' ? 'active' : ''}`}
          onClick={() => handleRoleChange('SUPER_ADMIN', '/admin/dashboard')}
        >
          <Shield size={12} />
          SUPER ADMIN
        </button>
      </div>
    </div>
  );
};
