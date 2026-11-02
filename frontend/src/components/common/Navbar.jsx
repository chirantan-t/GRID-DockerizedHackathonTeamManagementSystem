import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Search, Bell, User, LogOut, Check, Sparkles } from 'lucide-react';
import announcementService from '../../services/announcementService';

export const Navbar = ({ title = 'Explore Hackathons' }) => {
  const navigate = useNavigate();
  const { user, role, switchRole, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Final Submission Reminder', priority: 'URGENT', time: '10 mins ago' },
    { id: 2, title: 'Shortlisted Teams Announced', priority: 'IMPORTANT', time: '2 hours ago' },
    { id: 3, title: 'Mentorship Slots Available', priority: 'NORMAL', time: '1 day ago' }
  ]);

  const bellRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real announcements if available
  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const live = await announcementService.getByHackathon(1);
        if (live && live.length > 0 && isMounted) {
          setAnnouncements(live.map(a => ({
            id: a.id,
            title: a.title,
            priority: a.priority || 'NORMAL',
            time: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recent'
          })));
        }
      } catch (_e) {
        // Fallback to initial seed announcements
      }
    };
    fetchAnnouncements();
    return () => { isMounted = false; };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (role === 'ORGANIZER') {
        navigate(`/organizer/hackathons?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/team/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleRoleSelect = (targetRole) => {
    switchRole(targetRole);
    setShowProfile(false);
    if (targetRole === 'SUPER_ADMIN') {
      navigate('/superadmin/dashboard');
    } else if (targetRole === 'ORGANIZER') {
      navigate('/organizer/dashboard');
    } else {
      navigate('/team/dashboard');
    }
  };

  const handleLogout = async () => {
    setShowProfile(false);
    await logout();
    navigate('/');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px 12px',
        background: 'transparent',
        zIndex: 40,
        position: 'relative'
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
          backdropFilter: 'blur(16px)',
          transition: 'border-color 0.2s ease'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search hackathons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
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

        {/* Notification Bell with Dropdown */}
        <div ref={bellRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Announcements"
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: showNotifications ? 'rgba(0, 245, 138, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: showNotifications ? '1px solid var(--grid-neon)' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showNotifications ? 'var(--grid-neon)' : 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease'
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

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: 0,
              width: '320px',
              background: 'rgba(15, 20, 18, 0.95)',
              border: '1px solid rgba(0, 245, 138, 0.25)',
              borderRadius: '16px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 245, 138, 0.12)',
              backdropFilter: 'blur(20px)',
              padding: '16px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Announcements</span>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(0, 245, 138, 0.15)',
                  color: 'var(--grid-neon)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 600
                }}>
                  {announcements.length} New
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(role === 'ORGANIZER' ? '/organizer/announcements' : '/team/announcements');
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 245, 138, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#ffffff' }}>{item.title}</span>
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: item.priority === 'URGENT' ? '#ff4d4f' : 'var(--grid-neon)',
                        textTransform: 'uppercase'
                      }}>
                        {item.priority}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowNotifications(false);
                  navigate(role === 'ORGANIZER' ? '/organizer/announcements' : '/team/announcements');
                }}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--grid-neon)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View All Announcements →
              </button>
            </div>
          )}
        </div>

        {/* User Icon Circle with Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            title="User Profile & Roles"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: showProfile ? 'rgba(0, 245, 138, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: showProfile ? '1px solid var(--grid-neon)' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showProfile ? 'var(--grid-neon)' : 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease'
            }}
          >
            <User size={15} />
          </button>

          {/* User Profile Dropdown Panel */}
          {showProfile && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: 0,
              width: '260px',
              background: 'rgba(15, 20, 18, 0.95)',
              border: '1px solid rgba(0, 245, 138, 0.25)',
              borderRadius: '16px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 245, 138, 0.12)',
              backdropFilter: 'blur(20px)',
              padding: '16px',
              zIndex: 100
            }}>
              {/* Profile Details */}
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                  {user?.name || (role === 'ORGANIZER' ? 'VIT Events Coordinator' : 'Chirantan Tondale')}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {user?.email || (role === 'ORGANIZER' ? 'organizer@grid.dev' : 'chirantan@grid.dev')}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: 'var(--grid-neon)',
                    background: 'rgba(0, 245, 138, 0.12)',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    Role: {role}
                  </span>
                </div>
              </div>

              {/* Quick Role Switcher */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Switch Active Role
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {[
                    { id: 'TEAM', label: 'Team Lead / Developer' },
                    { id: 'ORGANIZER', label: 'Hackathon Organizer' },
                    { id: 'SUPER_ADMIN', label: 'Super Administrator' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: role === r.id ? 'rgba(0, 245, 138, 0.12)' : 'transparent',
                        border: 'none',
                        color: role === r.id ? 'var(--grid-neon)' : '#ffffff',
                        fontSize: '12px',
                        fontWeight: role === r.id ? 600 : 400,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{r.label}</span>
                      {role === r.id && <Check size={13} color="var(--grid-neon)" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Out Option */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'rgba(255, 77, 79, 0.1)',
                  border: '1px solid rgba(255, 77, 79, 0.25)',
                  color: '#ff4d4f',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
