import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass, Users, LayoutDashboard, Award, Code, Send, FileText, Bell,
  Settings, Trophy, CheckCircle, BarChart2, ShieldCheck, Activity, LineChart,
  LogOut, ChevronUp, Layers
} from 'lucide-react';

export const Sidebar = () => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (role === 'ORGANIZER') {
      return [
        { to: '/organizer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/organizer/hackathons', label: 'Hackathons', icon: Trophy },
        { to: '/organizer/teams', label: 'Teams', icon: Users },
        { to: '/organizer/submissions', label: 'Submissions', icon: FileText },
        { to: '/organizer/evaluations', label: 'Evaluations', icon: CheckCircle },
        { to: '/organizer/analytics', label: 'Analytics', icon: BarChart2 },
        { to: '/organizer/announcements', label: 'Announcements', icon: Bell },
        { to: '/organizer/settings', label: 'Settings', icon: Settings }
      ];
    }

    if (role === 'SUPER_ADMIN') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/organizers', label: 'Organizers', icon: Award },
        { to: '/admin/hackathons', label: 'Hackathons', icon: Trophy },
        { to: '/admin/users', label: 'Users', icon: Users },
        { to: '/admin/analytics', label: 'Analytics', icon: LineChart },
        { to: '/admin/reports', label: 'Reports', icon: BarChart2 },
        { to: '/admin/permissions', label: 'Roles & Perms', icon: ShieldCheck },
        { to: '/admin/health', label: 'System Health', icon: Activity },
        { to: '/admin/settings', label: 'Settings', icon: Settings }
      ];
    }

    // Default: TEAM / PARTICIPANT (Exact matches from media_1793530387314_915b69f8.jpg)
    return [
      { to: '/team/explore', label: 'Explore', icon: Compass },
      { to: '/team/my-team', label: 'My Team', icon: Users },
      { to: '/team/dashboard', label: 'Participations', icon: Layers },
      { to: '/team/workspace', label: 'Submissions', icon: Code },
      { to: '/team/announcements', label: 'Announcements', icon: Bell }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <aside
      style={{
        width: '230px',
        background: 'rgba(12, 16, 22, 0.48)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '26px',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        margin: '18px 0 18px 20px',
        height: 'calc(100vh - 36px)',
        position: 'sticky',
        top: '18px',
        zIndex: 20,
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        flexShrink: 0
      }}
    >
      {/* Brand Logo */}
      <div style={{ padding: '4px 12px 28px' }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <span style={{ fontWeight: 800, letterSpacing: '0.14em', color: '#ffffff', fontSize: '18px' }}>GRID</span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '2px',
              background: 'var(--grid-neon)',
              boxShadow: '0 0 10px var(--grid-neon)'
            }}
          />
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '16px',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0, 255, 102, 0.14)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 255, 102, 0.45)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 20px rgba(0, 255, 102, 0.25)' : 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} color={isActive ? 'var(--grid-neon)' : 'currentColor'} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile Pill (Exact match from reference image) */}
      <div
        onClick={() => {
          if (role === 'ORGANIZER') navigate('/organizer/settings');
          else if (role === 'SUPER_ADMIN') navigate('/admin/settings');
          else navigate('/team/settings');
        }}
        title="Profile & Settings"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          marginTop: 'auto',
          cursor: 'pointer',
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0, 255, 102, 0.15)',
              border: '1px solid rgba(0, 255, 102, 0.35)',
              color: 'var(--grid-neon)',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {user?.avatar || 'TA'}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Team Alpha'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {role === 'TEAM' ? 'Team Account' : role.replace('_', ' ')}
            </div>
          </div>
        </div>

        <ChevronUp size={14} color="var(--text-muted)" />
      </div>
    </aside>
  );
};
