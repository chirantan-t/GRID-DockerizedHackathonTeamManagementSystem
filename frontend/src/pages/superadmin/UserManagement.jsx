import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { mockUserDirectory } from '../../data/mockData';

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
                  <button className="grid-btn grid-btn-secondary" style={{ padding: '6px 10px' }}>
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

