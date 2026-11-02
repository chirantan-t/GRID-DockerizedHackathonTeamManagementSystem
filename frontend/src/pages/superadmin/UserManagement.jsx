import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { mockUserDirectory } from '../../data/mockData';

const UserActionDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = (type) => {
    setOpen(false);
    if (type === 'view') {
      alert(`User Profile: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nJoined: ${user.joinedOn}\nStatus: ${user.status}`);
    } else if (type === 'reset') {
      alert(`Password reset link generated for ${user.email}`);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(p => !p)}
        className="grid-btn grid-btn-secondary"
        style={{ padding: '6px 10px', background: open ? 'rgba(0,245,138,0.15)' : undefined }}
        title="Actions"
      >
        <MoreHorizontal size={14} color={open ? 'var(--grid-neon)' : 'currentColor'} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%', zIndex: 999,
          background: 'rgba(18, 22, 28, 0.98)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px', padding: '6px', minWidth: '160px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(0,245,138,0.08)',
          backdropFilter: 'blur(24px)'
        }}>
          {[
            { label: '👁 View User', type: 'view' },
            { label: '🔑 Reset Credentials', type: 'reset' }
          ].map(({ label, type }) => (
            <button
              key={type}
              onClick={() => handleAction(type)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none', color: '#fff',
                padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12.5px',
                fontWeight: 500, transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,245,138,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('All Users');
  const [search, setSearch] = useState('');

  const tabs = [
    { label: 'All Users', count: '2,842' },
    { label: 'Teams', count: '712' },
    { label: 'Participants', count: '2,130' }
  ];

  const filtered = mockUserDirectory.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.role.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'All Users') return true;
    if (activeTab === 'Teams') return u.role === 'Team Lead';
    if (activeTab === 'Participants') return u.role === 'Participant';
    return true;
  });

  return (
    <div className="grid-page-container">
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
          User Management
        </h1>
        <p style={{ color: 'var(--grid-text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
          Directory of all platform users, team leads, and participants.
        </p>
      </div>

      {/* Tabs and Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              style={{
                background: activeTab === tab.label ? 'rgba(0, 255, 102, 0.12)' : 'transparent',
                color: activeTab === tab.label ? 'var(--grid-neon)' : 'var(--grid-text-secondary)',
                border: activeTab === tab.label ? '1px solid rgba(0, 255, 102, 0.3)' : '1px solid transparent',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="var(--grid-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grid-input"
              style={{ paddingLeft: '36px', width: '220px', padding: '7px 12px 7px 36px', fontSize: '13px' }}
            />
          </div>
          <button className="grid-btn grid-btn-secondary" style={{ padding: '7px 12px', fontSize: '13px' }}>
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="grid-table-container">
        <table className="grid-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input type="checkbox" style={{ accentColor: 'var(--grid-neon)' }} />
              </th>
              <th>User</th>
              <th>Role</th>
              <th>Joined On</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>
                  <input type="checkbox" style={{ accentColor: 'var(--grid-neon)' }} />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--grid-text-secondary)' }}>
                  {user.role}
                </td>
                <td style={{ color: 'var(--grid-text-secondary)', fontSize: '13px' }}>
                  {user.joinedOn}
                </td>
                <td>
                  <Badge variant={user.status}>{user.status}</Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <UserActionDropdown user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

